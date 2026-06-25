import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { getHotelRooms } from '@/actions/services/getHotelDetails';
import { useRouter } from 'next/navigation';
import SinglePropertyRoomDetails from '@/components/hotel-single-view/SinglePropertyRoomDetails';
import { RoomsMock } from '@/__mock__/hotel.mock';

jest.mock('lenis', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    start: jest.fn(),
    stop: jest.fn(),
  })),
}));

jest.mock('@/components/ui/carousel', () => {
  const React = require('react');
  return {
    __esModule: true,
    Carousel: React.forwardRef((props: any, ref: any) => <div ref={ref}>{props.children}</div>),
    CarouselContent: (props: any) => <div>{props.children}</div>,
    CarouselItem: (props: any) => <div>{props.children}</div>,
    CarouselNext: (props: any) => <button {...props}>Next</button>,
    CarouselPrevious: (props: any) => <button {...props}>Prev</button>,
    useCarousel: () => ({
      carouselRef: React.createRef(),
      api: {
        canScrollPrev: () => false,
        canScrollNext: () => true,
        scrollPrev: jest.fn(),
        scrollNext: jest.fn(),
      },
      scrollPrev: jest.fn(),
      scrollNext: jest.fn(),
      canScrollPrev: false,
      canScrollNext: true,
    }),
  };
});

const mockApi = {
  canScrollPrev: jest.fn(() => false),
  canScrollNext: jest.fn(() => true),
};

// Mock lenis/react
jest.mock('lenis/react', () => ({
  useLenis: () => ({
    lenis: {
      start: jest.fn(),
      stop: jest.fn(),
    },
  }),
}));

// Mock ESM jose for auth tokens
jest.mock('jose', () => ({
  jwtVerify: jest.fn().mockResolvedValue({ payload: { user: { access_token: 'mock-token' } } }),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => '/hotel/test-slug'),
}));


jest.mock('@/actions/services/getReservationDetails', () => ({
  getReservationSummaryDetails: jest.fn().mockRejectedValue({ status: 403, message: 'Unauthorized' }),
}));

jest.mock('@/common/auth/handleLoginModal', () => {
  return {
    useLoginModal: () => ({
      handleLoginModal: jest.fn(),
    }),
  };
});

// Mock reservation services
jest.mock('@/actions/services/getHotelDetails', () => ({
  getHotelRooms: jest.fn().mockResolvedValue({ data: { subUnits: [] } }),
}));

const getHotelRoomsMock = getHotelRooms as jest.MockedFunction<typeof getHotelRooms>;

jest.mock('@/actions/services/getReservationDetails', () => ({
  getReservationSummaryDetails: jest.fn().mockResolvedValue({ summary: true }),
}));

// Mock login modal
jest.mock('@/common/auth/handleLoginModal', () => ({
  useLoginModal: () => ({
    handleLoginModal: jest.fn(),
  }),
}));

// Mock embla-carousel-react
jest.mock('embla-carousel-react', () => ({
  __esModule: true,
  default: () => [null, { scrollTo: jest.fn(), scrollNext: jest.fn(), scrollPrev: jest.fn() }],
  useEmblaCarousel: () => [null, { scrollTo: jest.fn(), scrollNext: jest.fn(), scrollPrev: jest.fn() }],
}));

describe('SinglePropertyRoomDetails', () => {
  let mockReplace: jest.Mock;
  let mockPush: jest.Mock;

  beforeEach(() => {
    mockReplace = jest.fn();
    mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: mockReplace,
    });
    getHotelRoomsMock.mockClear();
    getHotelRoomsMock.mockResolvedValue({
      data: {
        ...RoomsMock.roomDetails.data,
        subUnits: [],
      },
    });
  });

  it('renders hotel name and heading', () => {
    render(<SinglePropertyRoomDetails {...RoomsMock} />);
    expect(screen.getByText('Availability')).toBeInTheDocument();
  });

  it('shows Reserve Entire Property button when allowEntireProperty=true, allowIndividualUnit=false, isEntirePropertyAvailable=true', () => {
    render(<SinglePropertyRoomDetails {...RoomsMock} />);
    expect(screen.getAllByRole('button', { name: /Reserve Entire Property/i })[0]).toBeInTheDocument();
  });

  it('does not show Reserve Entire Property button when allowEntireProperty=false', () => {
    const props = {
      ...RoomsMock,
      roomDetails: {
        data: {
          ...RoomsMock.roomDetails.data,
          allowEntireProperty: false,
        },
      },
    };
    render(<SinglePropertyRoomDetails {...props} />);
    expect(screen.queryByRole('button', { name: /Reserve Entire Property/i })).toBeNull();
  });

  it('shows unavailable message when isEntirePropertyAvailable=false', () => {
    const props = {
      ...RoomsMock,
      roomDetails: {
        data: {
          ...RoomsMock.roomDetails.data,
          isEntirePropertyAvailable: false,
        },
      },
    };
    render(<SinglePropertyRoomDetails {...props} />);
    expect(screen.getByText(/Unavailable for selected dates/i)).toBeInTheDocument();
  });

  it('shows room selection UI when allowIndividualUnit=true', () => {
    const props = {
      ...RoomsMock,
      roomDetails: {
        data: {
          ...RoomsMock.roomDetails.data,
          allowEntireProperty: false,
          allowIndividualUnit: true,
        },
      },
    };
    render(<SinglePropertyRoomDetails {...props} />);
    // Find the guest count button by its visible text
    expect(screen.getByRole('button', { name: /Adult.*Children/i })).toBeInTheDocument();
  });

  it('enables reserve button when allowEntireProperty=true, allowIndividualUnit=true, isEntirePropertyAvailable=true and totalEntPropPersonCount > 0', async () => {
    const hybridData = {
      ...RoomsMock.roomDetails.data,
      allowEntireProperty: true,
      allowIndividualUnit: true,
      isEntirePropertyAvailable: true,
    };
    getHotelRoomsMock.mockResolvedValue({
      data: {
        ...hybridData,
        subUnits: [],
      },
    });

    const props = {
      ...RoomsMock,
      roomDetails: {
        data: hybridData,
      },
    };

    render(<SinglePropertyRoomDetails {...props} />);

    const guestButton = await screen.findByRole('button', { name: /Adult.*Children/i });
    fireEvent.click(guestButton);

    const incrementButtons = await screen.findAllByText('+');
    fireEvent.click(incrementButtons[0]); // increment adults

    await waitFor(
      () => {
        const reserveEntireProperty = screen.getByRole('button', { name: /Reserve Entire Property/i });
        expect(reserveEntireProperty).not.toBeDisabled();
      },
      { timeout: 10000 },
    );
  });

  it('opens guest count popover and increments adults', async () => {
    render(<SinglePropertyRoomDetails {...RoomsMock} />);

    const guestButton = await screen.findByRole('button', { name: /Adult.*Children/i });
    fireEvent.click(guestButton);

    const incrementButton = await screen.findAllByText('+');
    fireEvent.click(incrementButton[0]);

    const summary = await screen.findByText(/2\s+Adults?\s+·/i);
    expect(summary).toBeInTheDocument();
  });


  it('renders guest count dropdown with price', async () => {
    render(<SinglePropertyRoomDetails {...RoomsMock} />);
    // Use findAllByText and check at least one match
    const priceElements = await screen.findAllByText((content, element) => {
      return typeof content === 'string' && (content.includes('100') || content.includes('200'));
    });
    expect(priceElements.length).toBeGreaterThan(0);
  });

  it('updates availability on form submit', async () => {
    render(<SinglePropertyRoomDetails {...RoomsMock} />);
    const guestButton = await screen.findByRole('button', { name: /Adult.*Children/i });
    await act(async () => {
      fireEvent.click(guestButton);
    });
    const incrementButton = await screen.findAllByText('+');
    await act(async () => {
      fireEvent.click(incrementButton[0]);
    });
    await waitFor(() => {
      expect(getHotelRoomsMock).toHaveBeenCalled();
    }, { timeout: 4000 });
  });

  // it('reserves entire property on click', async () => {
  //   render(<SinglePropertyRoomDetails {...RoomsMock} />);
  //   const reserveButtons = screen.getAllByRole('button', { name: /Reserve Entire Property/i });
  //   const reserve = reserveButtons[0];

  //   await act(async () => {
  //     fireEvent.click(reserve);
  //   });

  //   await waitFor(() => {
  //     expect(sessionStorage.getItem('reservation-summary')).not.toBeNull();
  //   });
  // });

  it('displays unavailable when property is not available', () => {
    const unavailableProps = {
      ...RoomsMock,
      roomDetails: {
        data: {
          ...RoomsMock.roomDetails.data,
          isEntirePropertyAvailable: false,
        },
      },
    };

    render(<SinglePropertyRoomDetails {...unavailableProps} />);
    expect(screen.getByText(/Unavailable for selected dates/i)).toBeInTheDocument();
  });

  it('handles no subUnits gracefully', () => {
    const propsWithNoSubunits = {
      ...RoomsMock,
      roomDetails: {
        data: {
          ...RoomsMock.roomDetails.data,
          subUnits: [],
        },
      },
    };

    render(<SinglePropertyRoomDetails {...propsWithNoSubunits} />);
    expect(screen.getByText(/No room details available for the selected date range./i)).toBeInTheDocument();
  });


  it('blocks date range if reserved dates fall between checkin and checkout', async () => {
    const propsWithBlockedDates = {
      ...RoomsMock,
      blockedDates: {
        reserved: [[new Date('2025-08-06T00:00:00')]],
        blocked: [],
      },

      checkin: new Date('2025-08-05T00:00:00'),
      checkout: new Date('2025-08-08T00:00:00'),
    };

    render(<SinglePropertyRoomDetails {...propsWithBlockedDates} />);

    const checkinButton = await screen.findByRole('button', { name: /Aug 05, 2025/i });
    fireEvent.click(checkinButton);

    const checkoutButton = await screen.findByRole('button', { name: /Aug 08, 2025/i });
    fireEvent.click(checkoutButton);

    fireEvent.click(screen.getByText('8'));

    await waitFor(() => {
      expect(screen.getByText(/No room details available for the selected date range./i)).toBeInTheDocument();
    }, { timeout: 4000 });
  });


  it('updates URL params on form submit', async () => {
    render(<SinglePropertyRoomDetails {...RoomsMock} />);

    const guestButton = screen.getByRole('button', { name: /Adult.*Children/i });
    fireEvent.click(guestButton);

    const incrementButtons = await screen.findAllByText('+');
    fireEvent.click(incrementButtons[0]);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalled();
      const url = String(mockReplace.mock.calls[mockReplace.mock.calls.length - 1][0]);
      expect(url).toContain('checkin=');
      expect(url).toContain('checkout=');
      expect(url).toContain('adults=');
    }, { timeout: 4000 });
  });


});