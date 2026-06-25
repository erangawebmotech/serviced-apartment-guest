import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReservationPage from '@/components/reserve/ReservationPage';

// Mock fetch to avoid errors
beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ success: true }),
    })
  ) as jest.Mock;
});

afterEach(() => {
  (global.fetch as jest.Mock).mockClear();
});

// Clear sessionStorage before each test
beforeEach(() => {
  sessionStorage.clear();
});

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  notFound: jest.fn(),
}));

jest.mock('@/components/navigation/Navbar', () => () => (
  <div data-testid="navbar">Mock Navbar</div>
));

jest.mock('@/components/reserve/PhoneInput', () => ({
  PhoneInput: ({ onChange }: { onChange: (value: string) => void }) => (
    <input
      data-testid="phone-input"
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));
jest.mock('@/components/reserve/DateAndTimePicker', () => ({
  DateAndTimePicker: ({ onChange }: { onChange: (date: Date) => void }) => (
    <input
      type="datetime-local"
      data-testid="date-picker"
      onChange={(e) => onChange(new Date(e.target.value))}
    />
  ),
}));

jest.mock('@/common/commonFunctions', () => ({
  getLoggedUser: jest.fn().mockResolvedValue({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    countryCode: '+94',
    contactNo: '770000000',
  }),
}));
jest.mock('@/actions/services/getReservationDetails', () => ({
  addReservation: jest.fn().mockResolvedValue({ message: 'Success', data: {} }),
  createTransaction: jest.fn(),
  getReservationSummaryDetails: jest.fn(),
  reservationPreCheck: jest.fn(),
}));
jest.mock('@/actions/utils/captcha', () => ({
  getCaptchaToken: jest.fn().mockResolvedValue('mock-token'),
}));
jest.mock('@/hooks/use-toast', () => ({
  toast: jest.fn(),
}));
jest.mock('@/common/auth/handleLoginModal', () => ({
  useLoginModal: () => ({ handleLoginModal: jest.fn() }),
}));

// Helper: set sessionStorage with flat structure, matching component expectation
const setSessionData = (overrides: Partial<any> = {}) => {
  const baseData = {
    property: {
      slug: 'test-slug',
      name: 'Test Property',
      file: { mediumPath: '/test.jpg' },
      summaryReviews: { averageReviews: 4.5, totalReviews: 12 },
    },
    checkIn: new Date().toISOString(),
    checkOut: new Date(Date.now() + 86400000).toISOString(),
    totalGuest: 2,
    adult: 2,
    child: 0,
    infant: 0,
    pet: 0,
    entireProperty: true,
    instantBookingEnabled: false,
    payAtPropertyEnabled: true,
    nrpRate: null,
    priceDetail: {
      subTotal: 100,
      totalDiscount: 0,
      netTotal: 100,
      withOutNrpDiscount: 0,
      securityDeposit: 0,
      nonRefundableDetail: null,
      accommodationUnits: [],
    },
    roomCount: 1,
    stayDuration: 1,
  };

  const finalData = { ...baseData, ...overrides };

  sessionStorage.setItem('reservation-summary', JSON.stringify(finalData));
  sessionStorage.setItem(
    'reservation-details',
    JSON.stringify({
      slug: 'test-slug',
      checkIn: new Date().toISOString(),
      checkOut: new Date(Date.now() + 86400000).toISOString(),
      adult: 2,
      child: 0,
      infant: 0,
      pet: 0,
    })
  );
};

describe('ReservationPage', () => {
  beforeEach(() => {
    setSessionData();
  });

  it('renders the page with heading', async () => {
    render(<ReservationPage />);
    await waitFor(() => {
      expect(screen.getByText(/request to book/i)).toBeInTheDocument();
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });
  });

  it('shows Enter your details section', async () => {
    render(<ReservationPage />);
    await waitFor(() => {
      expect(screen.getByText(/enter your details/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByTestId('phone-input')).toBeInTheDocument();
    });
  });

  it('shows arrival time picker', async () => {
    render(<ReservationPage />);
    await waitFor(() => {
      expect(screen.getByText(/your arrival time/i)).toBeInTheDocument();
      expect(screen.getByTestId('date-picker')).toBeInTheDocument();
    });
  });

  it('allows filling and submitting the form', async () => {
    render(<ReservationPage />);
    await waitFor(() => {
      fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
      fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByTestId('phone-input'), { target: { value: '+94770000000' } });
      fireEvent.change(screen.getByTestId('date-picker'), { target: { value: '2025-08-11T12:00' } });
      expect(screen.getByText(/complete your booking/i)).toBeInTheDocument();
    });
  });

});
