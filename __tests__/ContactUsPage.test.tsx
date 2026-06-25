import { render, screen } from '@testing-library/react';
import ContactUsPage from '@/components/contactUs/ContactUsPage';

// Mocking 'jose' library to avoid actual token verification in tests
jest.mock('jose', () => ({
  jwtVerify: jest.fn().mockResolvedValue({ payload: { user: { access_token: 'mock-token' } } }),
}));

// Mocking the ContactUsForm component to avoid rendering the full form logic
jest.mock('@/components/contactUs/contactUsForm', () => () => (
  <div data-testid="contact-us-form">Mock ContactUsForm</div>
));

// Mocking the WhatsApp wrapper to simplify testing
jest.mock('@/components/contactUs/RequestWhatsappWrapper', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="whatsapp-wrapper">{children}</div>
  ),
}));

describe('ContactUsPage', () => {
  // Check if "Get In Touch" heading is displayed
  it('renders the "Get In Touch" heading', () => {
    render(<ContactUsPage />);
    expect(screen.getByText('Get In Touch')).toBeInTheDocument();
  });


  // Check if the "Let's Talk!" section and its description is shown
  it('renders the "Let\'s Talk!" section with description', () => {
    render(<ContactUsPage />);
    expect(screen.getByRole('heading', { name: /let's talk!/i })).toBeInTheDocument();
    expect(
      screen.getByText(/get in touch with us using the enquiry form or contact details below/i)
    ).toBeInTheDocument();
  });

  // Check if the mocked ContactUsForm is present
  it('renders the ContactUsForm component', () => {
    render(<ContactUsPage />);
    expect(screen.getByTestId('contact-us-form')).toBeInTheDocument();
  });

  // Check if Quick Contact section shows WhatsApp, email, and address
  it('renders the Quick Contact section', () => {
    render(<ContactUsPage />);
    expect(screen.getByRole('heading', { name: /quick contact/i })).toBeInTheDocument();
    expect(screen.getByText(/whatsapp/i)).toBeInTheDocument();
    expect(screen.getByText('+94 77 003 3848')).toBeInTheDocument();
    expect(screen.getByText(/support@servicedapartments.lk/i)).toBeInTheDocument();
    expect(screen.getByText(/bank of ceylon mw/i)).toBeInTheDocument();
  });

  // Check if WhatsApp number is wrapped inside the mocked RequestWhatsappWrapper
  it('wraps WhatsApp contact inside RequestWhatsappWrapper', () => {
    render(<ContactUsPage />);
    expect(screen.getByTestId('whatsapp-wrapper')).toBeInTheDocument();
    expect(screen.getByText('+94 77 003 3848')).toBeInTheDocument();
  });

  // Check if all social media links are rendered using their aria-labels
  it('renders all social media links with correct aria-labels', () => {
    render(<ContactUsPage />);
    const platforms = ['Facebook', 'Instagram', 'LinkedIn', 'TikTok', 'YouTube'];

    platforms.forEach((platform) => {
      expect(screen.getByLabelText(new RegExp(platform, 'i'))).toBeInTheDocument();
    });
  });

  // Check if the embedded Google Maps iframe is shown
  it('renders the embedded Google Maps iframe', () => {
    render(<ContactUsPage />);
    const map = screen.getByTitle(/media makeup location/i);
    expect(map).toBeInTheDocument();
    expect(map).toHaveAttribute('src', expect.stringContaining('https://www.google.com/maps/embed'));
  });
});
