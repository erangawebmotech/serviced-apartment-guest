jest.mock('@/common/commonFunctions', () => ({
    getLoggedUser: jest.fn().mockResolvedValue({
        firstName: 'Krishan',
        lastName: 'Mihiranga',
        email: 'krishanmdev@gmail.com',
    }),
    getAccessToken: jest.fn().mockResolvedValue('mock-token'),
}));

jest.mock('@/actions/services/getReservationDetails', () => ({
    getReservationSuccessData: jest.fn(),
    reservationPreCheck: jest.fn(),
    createTransaction: jest.fn(),
    cancelReservation: jest.fn(),
}));

jest.mock('@/common/commonClientFunctions', () => ({
    generatePDF: jest.fn(),
}));

jest.mock('@/lib/whatsapp', () => ({
    sendWhatsappMessage: jest.fn(),
}));

jest.mock('@/hooks/use-toast', () => ({ toast: jest.fn() }));

jest.mock('@/common/auth/handleLoginModal', () => ({
    useLoginModal: () => ({ handleLoginModal: jest.fn(), loginModal: false }),
}));

jest.mock('lenis', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({ start: jest.fn(), stop: jest.fn() })),
}));
jest.mock('lenis/react', () => ({
    useLenis: () => ({ lenis: { start: jest.fn(), stop: jest.fn() } }),
}));

jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
    usePathname: jest.fn(() => '/apartment/test-slug/reserve/RTEST'),
    useSearchParams: jest.fn(() => new URLSearchParams('')),
    notFound: jest.fn(),
}));

jest.mock('jose', () => ({
    jwtVerify: jest.fn().mockResolvedValue({ payload: { user: { access_token: 'mock-token' } } }),
}));

jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => <img {...props} />,
}));

jest.mock('@/actions/services/getRatingDetails', () => ({
    getRatingCategoriesData: jest.fn().mockResolvedValue({ error: false, data: [] }),
}));

// --- IMPORTS AFTER MOCKS ---
import { render, screen, fireEvent, act } from '@testing-library/react';
import ReservationSuccessPage from '@/components/reserve/ReservationSuccessPage';
import { getReservationSuccessData } from '@/actions/services/getReservationDetails';
import { PAYMENT_STATUS_TYPES, PAYMENT_TYPES } from '@/common/constants';
import userEvent from '@testing-library/user-event';
import { sendWhatsappMessage } from '@/lib/whatsapp';

// --- MOCK DATA ---
const mockReservations = [
    {
        id: 200,
        code: "RrQEQBQE",
        paymentType: "PAY_AT_PROPERTY",
        paymentStatus: "PENDING",
        subTotal: 231,
        totalDiscount: 0,
        netTotal: 231,
        reservedUser: { firstName: "Krishan", lastName: "Mihiranga", email: "krishanmdev@gmail.com" },
        property: {
            name: "hii ",
            city: "Colombo",
            allowInstantBooking: true,
            host: { firstName: "QA", lastName: "Tester", whatsappContactNo: "+94770033848", contactNo: "756657004" },
            file: { originalPath: "https://apartment-api.webmotech.com/api/v1/files/original/6268398388120073623.jpg" },
            description: "<p>test</p>",
        },
        roomDetails: [
            {
                name: "Deluxe Queen Room",
                maxHeadCount: 1,
                roomCount: 1,
                unitPrice: 77,
                files: [
                    { originalPath: "https://apartment-api.webmotech.com/api/v1/files/original/2071388211746561187.jpg" },
                    { originalPath: "https://apartment-api.webmotech.com/api/v1/files/original/-7795884759023414831.jpg" },
                ],
            },
        ],
        cancellationPolicy: {
            name: "STRICT",
            description: "Guests get a full refund if they cancel within 48 hours of booking and at least 14 days before check-in.",
            isCancellationAllowed: false,
        },
        contactDetails: { firstName: "Krishan", lastName: "Mihiranga", countryCode: "+94", contactNo: "774512029", email: "krishanmdev@gmail.com" },
        specialRequest: "Test",
    },
];

// --- SETUP ---
beforeAll(() => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve({ success: true, data: {} }), // mock session/user API calls
        })
    ) as jest.Mock;
});

beforeEach(() => {
    jest.clearAllMocks();
    (getReservationSuccessData as jest.Mock).mockResolvedValue({ data: mockReservations[0] });
});

const formatString = (input: string): string => {
    return input
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

// --- TESTS ---
describe('ReservationSuccessPage', () => {
    it('shows loader while fetching data', async () => {
        (getReservationSuccessData as jest.Mock).mockImplementation(() => new Promise(() => { }));
        await act(async () => {
            render(<ReservationSuccessPage id="" />);
        });
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('renders Leave a Review button when status is CHECKED_OUT and review is available', async () => {
        const checkedOutReservation = { ...mockReservations[0], status: 'CHECKED_OUT', isReviewAvailable: true };
        (getReservationSuccessData as jest.Mock).mockResolvedValue({ data: checkedOutReservation });

        await act(async () => {
            render(<ReservationSuccessPage id="200" />);
        });

        const reviewButton = screen.queryByText('Leave a Review');
        expect(reviewButton).toBeInTheDocument();
        if (reviewButton) fireEvent.click(reviewButton);
    });

    it('does NOT render Leave a Review button when status is not CHECKED_OUT', async () => {
        const notCheckedOutReservation = { ...mockReservations[0], status: 'APPROVED', isReviewAvailable: true };
        (getReservationSuccessData as jest.Mock).mockResolvedValue({ data: notCheckedOutReservation });

        await act(async () => {
            render(<ReservationSuccessPage id="200" />);
        });

        const reviewButton = screen.queryByText('Leave a Review');
        expect(reviewButton).not.toBeInTheDocument();
    });

    it('does NOT render Leave a Review button when review is not available', async () => {
        const reviewUnavailableReservation = { ...mockReservations[0], status: 'CHECKED_OUT', isReviewAvailable: false };
        (getReservationSuccessData as jest.Mock).mockResolvedValue({ data: reviewUnavailableReservation });

        await act(async () => {
            render(<ReservationSuccessPage id="200" />);
        });

        const reviewButton = screen.queryByText('Leave a Review');
        expect(reviewButton).not.toBeInTheDocument();
    });

    it('renders payment details', async () => {
        await act(async () => render(<ReservationSuccessPage id="200" />));

        expect(screen.getByText(/Type/i)).toBeInTheDocument();
        expect(screen.getByText(formatString(PAYMENT_TYPES.PAY_AT_PROPERTY))).toBeInTheDocument();
        expect(screen.getByText(/Code/i)).toBeInTheDocument();
        expect(screen.getByText(mockReservations[0].code)).toBeInTheDocument();
        expect(screen.getByText(/Status/i)).toBeInTheDocument();
        expect(screen.getByText(/Pending/i)).toBeInTheDocument();
    });


    it('does not show "Tap here to try again" if payment is successful', async () => {
        (getReservationSuccessData as jest.Mock).mockResolvedValue({
            data: { ...mockReservations[0], paymentStatus: PAYMENT_STATUS_TYPES.SUCCESS },
        });

        await act(async () => render(<ReservationSuccessPage id="200" />));

        const button = screen.queryByText(/Tap here to try again/i);
        expect(button).not.toBeInTheDocument();
    });

    // --- New test for About Property section ---
    it('renders "About Property" section with description', async () => {
        const reservationWithDescription = {
            ...mockReservations[0],
            property: { ...mockReservations[0].property, description: '<p>Beautiful property</p>' },
        };
        (getReservationSuccessData as jest.Mock).mockResolvedValue({ data: reservationWithDescription });

        await act(async () => render(<ReservationSuccessPage id="200" />));

        expect(screen.getByText(/About Property/i)).toBeInTheDocument();

        const descriptionElement = screen.getByText('Beautiful property', { exact: false });
        expect(descriptionElement).toBeInTheDocument();
    });

    it('does not render "About Property" section if description is missing', async () => {
        const reservationWithoutDescription = {
            ...mockReservations[0],
            property: { ...mockReservations[0].property, description: '' },
        };
        (getReservationSuccessData as jest.Mock).mockResolvedValue({ data: reservationWithoutDescription });

        await act(async () => render(<ReservationSuccessPage id="200" />));

        expect(screen.queryByText(/About Property/i)).not.toBeInTheDocument();
    });

    it('renders "Cancellation Policy" section with description', async () => {
        const reservationWithPolicy = {
            ...mockReservations[0],
            cancellationPolicy: { ...mockReservations[0].cancellationPolicy, description: 'Full refund within 48 hours' },
        };
        (getReservationSuccessData as jest.Mock).mockResolvedValue({ data: reservationWithPolicy });

        await act(async () => render(<ReservationSuccessPage id="200" />));

        // Check heading
        expect(screen.getByText(/Cancellation Policy/i)).toBeInTheDocument();

        // Check policy description
        expect(screen.getByText(/Full refund within 48 hours/i)).toBeInTheDocument();
    });

    it('does not render "Cancellation Policy" section if description is missing', async () => {
        const reservationWithoutPolicy = {
            ...mockReservations[0],
            cancellationPolicy: { ...mockReservations[0].cancellationPolicy, description: '' },
        };
        (getReservationSuccessData as jest.Mock).mockResolvedValue({ data: reservationWithoutPolicy });

        await act(async () => render(<ReservationSuccessPage id="200" />));

        expect(screen.queryByText(/Cancellation Policy/i)).not.toBeInTheDocument();
    });
;

    // it('renders Host Info section with avatar, name, whatsapp and email', async () => {
    //     const reservationWithHost = {
    //         ...mockReservations[0],
    //         paymentType: PAYMENT_TYPES.CARD, // ensure it is not PAY_AT_PROPERTY
    //         property: {
    //             ...mockReservations[0].property,
    //             host: {
    //                 firstName: 'QA',
    //                 lastName: 'Tester',
    //                 whatsappContactNo: '+94770033848',
    //                 email: 'qa@test.com',
    //                 file: { smallPath: 'https://example.com/avatar.jpg' },
    //             },
    //         },
    //     };

    //     (getReservationSuccessData as jest.Mock).mockResolvedValue({ data: reservationWithHost });

    //     await act(async () => render(<ReservationSuccessPage id="200" />));

    //     // Check Host heading
    //     expect(screen.getByText(/Meet Your Host/i)).toBeInTheDocument();

    //     // Check Host name
    //     expect(screen.getByText(/QA Tester/i)).toBeInTheDocument();

    //     // Check avatar image
    //     const avatarImg = screen.getByRole('img', { name: /QA Tester/i });
    //     expect(avatarImg).toHaveAttribute('src', 'https://example.com/avatar.jpg');

    //     // Check WhatsApp contact
    //     expect(screen.getByText('+94770033848')).toBeInTheDocument();
    //     const messageBtn = screen.getByRole('button', { name: /Message/i });
    //     expect(messageBtn).toBeInTheDocument();

    //     // Click the Message button
    //     await act(async () => userEvent.click(messageBtn));
    //     expect(sendWhatsappMessage).toHaveBeenCalledWith('Hello 👋', '+94770033848');

    //     // Check Email
    //     expect(screen.getByText('qa@test.com')).toBeInTheDocument();
    //     const emailLink = screen.getByRole('link', { name: /Email/i });
    //     expect(emailLink).toHaveAttribute('href', 'mailto:qa@test.com');
    // });

    it('renders host initials when no avatar file is provided', async () => {
        const reservationWithHostNoAvatar = {
            ...mockReservations[0],
            paymentType: PAYMENT_TYPES.CARD,
            property: {
                ...mockReservations[0].property,
                host: {
                    firstName: 'John',
                    lastName: 'Doe',
                    whatsappContactNo: null,
                    email: null,
                    file: null,
                },
            },
        };

        (getReservationSuccessData as jest.Mock).mockResolvedValue({ data: reservationWithHostNoAvatar });

        await act(async () => render(<ReservationSuccessPage id="200" />));

        // Check initials are rendered
        expect(screen.getByText('JD')).toBeInTheDocument();
    });


}); 
