import { render, screen, fireEvent } from '@testing-library/react';
import OverviewTabContent from '@/components/hotel-single-view/OverviewTabContent';
import React from 'react';
import { fullHotelMock } from '@/__mock__/hotel.mock';

const mockSearchParams = { current: new URLSearchParams() };

jest.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams.current,
}));

// Mocks
jest.mock('next/image', () => (props: any) => {
  const { fill, ...rest } = props;
  return <img {...rest} alt={rest.alt || 'mocked-image'} />;
});

jest.mock('@/components/hotel-single-view/StartsRating', () => () => <div data-testid="star-rating" />);



describe('OverviewTabContent', () => {
  beforeEach(() => {
    mockSearchParams.current = new URLSearchParams();
  });

  beforeAll(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  describe('cancellation policy by stay length (check-in to check-out)', () => {
    it('shows only short policy when stay is fewer than 30 days', () => {
      mockSearchParams.current.set('checkin', '2025-06-20T00:00:00');
      mockSearchParams.current.set('checkout', '2025-06-25T00:00:00');
      render(<OverviewTabContent hotel={fullHotelMock} />);
      expect(screen.getByText(/Free cancellation up to 5 days/)).toBeInTheDocument();
      expect(screen.queryByText(/Full refund if canceled 30 days/)).not.toBeInTheDocument();
    });

    it('shows only long policy when stay is 30 or more days', () => {
      mockSearchParams.current.set('checkin', '2025-08-01T00:00:00');
      mockSearchParams.current.set('checkout', '2025-08-31T00:00:00');
      render(<OverviewTabContent hotel={fullHotelMock} />);
      expect(screen.queryByText(/Free cancellation up to 5 days/)).not.toBeInTheDocument();
      expect(screen.getByText(/Full refund if canceled 30 days/)).toBeInTheDocument();
    });
  });

  it('renders hotel name', () => {
    render(<OverviewTabContent hotel={fullHotelMock} />);
    expect(screen.getByText('Ella Rock Heaven')).toBeInTheDocument();
  });

  it('renders star rating and reviews', () => {
    render(<OverviewTabContent hotel={fullHotelMock} />);
    expect(screen.getByTestId('star-rating')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('(12 Reviews)')).toBeInTheDocument();
  });

  it("renders 'Entire Apartment in Colombo, Sri Lanka'", () => {
    render(<OverviewTabContent hotel={fullHotelMock} />);
    expect(screen.getByText(/Entire Apartment in Colombo, Sri Lanka/i)).toBeInTheDocument();
  });

  it('renders full description if width is >= 1000', () => {
    render(<OverviewTabContent hotel={fullHotelMock} />);
    expect(screen.getByText(/This is a test hotel description/i)).toBeInTheDocument();
  });

  it('renders unit highlights', () => {
    render(<OverviewTabContent hotel={fullHotelMock} />);
    expect(screen.getByText('Highlights')).toBeInTheDocument();
    expect(screen.getByText('Jungle View')).toBeInTheDocument();
  });

  it('renders amenities', () => {
    render(<OverviewTabContent hotel={fullHotelMock} />);
    expect(screen.getByText('What this place offers')).toBeInTheDocument();
    expect(screen.getByText('Free Wifi')).toBeInTheDocument();
  });

  it('does not render cancellation policies until check-in and check-out are in the URL', () => {
    render(<OverviewTabContent hotel={fullHotelMock} />);
    expect(screen.queryByText('Cancellation Policies')).not.toBeInTheDocument();
  });

  it('shows fallback "Undefined" if hotel name is missing', () => {
    render(<OverviewTabContent hotel={{ ...fullHotelMock, name: undefined }} />);
    expect(screen.getByText('Undefined')).toBeInTheDocument();
  });

  it("renders 'Not rated yet' if totalReviews is 0", () => {
    render(<OverviewTabContent hotel={{ ...fullHotelMock, summaryReviews: { averageReviews: 0, totalReviews: 0 } }} />);
    expect(screen.getByText('Not rated yet')).toBeInTheDocument();
  });

  it("renders 'No description available.' if description is not present", () => {
    const noDescription = { ...fullHotelMock, description: '' };
    render(<OverviewTabContent hotel={noDescription} />);
    expect(screen.getByText('No description available.')).toBeInTheDocument();
  });

  it('expands and collapses the description (simulated < 1000px window)', () => {
    window.innerWidth = 800; // Simulate tablet
    const longDescription = {
      ...fullHotelMock,
      description: `<p>${'a'.repeat(2000)}</p>`,
    };
    render(<OverviewTabContent hotel={longDescription} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button.textContent).toBe('see more');

    fireEvent.click(button);
    expect(button.textContent).toBe('see less');

    fireEvent.click(button);
    expect(button.textContent).toBe('see more');
  });
});
