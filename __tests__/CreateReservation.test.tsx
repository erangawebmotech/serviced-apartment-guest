import { act } from '@testing-library/react';
import { addReservation, reservationPreCheck, createTransaction } from '@/actions/services/getReservationDetails';
import { getCaptchaToken } from '@/actions/utils/captcha';
import { toast } from '@/hooks/use-toast';

jest.mock('@/actions/services/getReservationDetails');
jest.mock('@/actions/utils/captcha');
jest.mock('@/hooks/use-toast');
jest.mock('jose', () => ({
  jwtVerify: jest.fn().mockResolvedValue({ payload: { user: { access_token: 'mock-token' } } }),
}));

describe('onSubmit', () => {
  const mockSetReserving = jest.fn();
  const mockHandleLoginModal = jest.fn();
  const mockNotFound = jest.fn();
  const mockNavigateTo = jest.fn();

  // Sample form input
  const formData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    countryCode: '+94',
    mobileNumber: '+94770000000',
    arrivalTime: new Date(),
    specialRequests: 'None',
  };

  // Reservation summary & req mocks
  const reservationSummary = {
    data: {
      property: { slug: 'test-slug', allowInstantBooking: true, propertyType: 'hotel' },
      entireProperty: true,
    },
  };

  const reservationReq = {
    maxHeadCount: 4,
    unitDetails: [],
    checkIn: new Date(),
    checkOut: new Date(Date.now() + 86400000),
    adult: 2,
    child: 0,
    infant: 0,
    pet: 0,
  };

  // Payment method and nrpEnabled state mocks
  const paymentMethod = 'CARD';
  const nrpEnabled = false;

  beforeAll(() => {
    // Mock window.open and window.close safely
    window.open = jest.fn();
    window.close = jest.fn();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset navigation mock before each test
    mockNavigateTo.mockReset();
  });

  // The onSubmit function with injected navigateTo function for testability
  const onSubmit = async (
    data: typeof formData,
    navigateToFn: (url: string) => void = (url) => {
      // Default real navigation in production code
      window.location.href = url;
    }
  ) => {
    const mobileNumber = data.mobileNumber.replace(data.countryCode, '');

    const reservationObject = {
      slug: reservationSummary?.data?.property?.slug || '',
      maxHeadCount: reservationReq?.maxHeadCount,
      unitDetails: reservationReq?.unitDetails,
      checkIn: reservationReq?.checkIn,
      checkOut: reservationReq?.checkOut,
      adult: reservationReq?.adult || 1,
      child: reservationReq?.child || 0,
      infant: reservationReq?.infant || 0,
      pet: reservationReq?.pet || 0,
      arrivalTime: data.arrivalTime,
      paymentType: paymentMethod,
      isEntireProperty: reservationSummary?.data?.entireProperty || false,
      nrpEnabled: nrpEnabled,
      specialRequest: data.specialRequests || '',
      userDetails: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        countryCode: data.countryCode,
        contactNo: mobileNumber,
      },
    };
    mockSetReserving(true);

    try {
      const token = await getCaptchaToken();

      const res: any = await addReservation({ reservationObject, token });
      if (res?.error) throw res?.errors;

      toast({
        description: res.message,
        className: 'bg-primary font-poppins text-white p-4 rounded-lg shadow-md',
        duration: 3000,
      });

      const { paymentType, id, netTotal, reservedUser, code, property } = res?.data;

      if (paymentType === 'CARD' && property?.allowInstantBooking) {
        mockSetReserving(true);

        const preCheckRes: any = await reservationPreCheck(id);
        if (preCheckRes?.error) throw preCheckRes?.errors;

        if (preCheckRes?.data) {
          mockSetReserving(true);
          const transactionData = {
            reservationId: id,
            reservationCode: code,
            amount: netTotal,
            currency: 'USD',
            redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment`,
            customerName: `${reservedUser?.firstName} ${reservedUser?.lastName}`,
            customerEmail: reservedUser?.email || reservationObject?.userDetails?.email || null,
          };

          const transactionRes: any = await createTransaction(transactionData);
          if (transactionRes?.error) throw transactionRes?.errors;

          if (transactionRes) {
            const { url } = transactionRes?.data;
            if (url) {
              navigateToFn(url);
            } else {
              throw {
                error: true,
                errors: { status: 404, message: 'Redirect Url not Found' },
              };
            }
          }
        } else {
          throw {
            error: true,
            errors: { status: 400, message: 'Bad Credentials' },
          };
        }
        return;
      } else if (
        paymentType === 'PAY_AT_PROPERTY' ||
        (paymentType === 'CARD' && !property?.allowInstantBooking)
      ) {
        const paymentUrl = new URL(window.location.origin + '/payment');
        paymentUrl.searchParams.set('state', 'CONFIRMED');
        paymentUrl.searchParams.set('reservationCode', code);
        window.open(paymentUrl.toString(), '_blank');
        window.close();
        return;
      } else {
        throw {
          error: true,
          errors: { status: 400, message: 'Bad Request' },
        };
      }
    } catch (err: any) {
      toast({
        description: err.message,
        className: 'bg-secondary font-poppins text-white p-4 rounded-lg shadow-md',
        duration: 3000,
      });
      mockSetReserving(false);
      if (err.status === 403) {
        mockHandleLoginModal({ open: true });
      }
      if (err.status === 401) {
        mockNotFound();
      }
      mockSetReserving(false);
    }
  };

  it('should call APIs and "redirect" on CARD payment with instant booking allowed', async () => {
    (getCaptchaToken as jest.Mock).mockResolvedValue('captcha-token');
    (addReservation as jest.Mock).mockResolvedValue({
      message: 'Success',
      data: {
        paymentType: 'CARD',
        id: 'resv123',
        netTotal: 100,
        reservedUser: { firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
        code: 'ABC123',
        property: { allowInstantBooking: true },
      },
    });
    (reservationPreCheck as jest.Mock).mockResolvedValue({ data: {} });
    (createTransaction as jest.Mock).mockResolvedValue({
      data: { url: 'https://payment-gateway.com/pay' },
    });

    await act(async () => {
      await onSubmit(formData, mockNavigateTo);
    });

    expect(mockSetReserving).toHaveBeenCalledTimes(3);
    expect(getCaptchaToken).toHaveBeenCalled();
    expect(addReservation).toHaveBeenCalled();
    expect(reservationPreCheck).toHaveBeenCalledWith('resv123');
    expect(createTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        reservationId: 'resv123',
        reservationCode: 'ABC123',
        amount: 100,
      })
    );
    expect(mockNavigateTo).toHaveBeenCalledWith('https://payment-gateway.com/pay');
    expect(toast).toHaveBeenCalledWith(expect.objectContaining({ description: 'Success' }));
  });

  it('should open new window on PAY_AT_PROPERTY payment', async () => {
    (getCaptchaToken as jest.Mock).mockResolvedValue('captcha-token');
    (addReservation as jest.Mock).mockResolvedValue({
      message: 'Success',
      data: {
        paymentType: 'PAY_AT_PROPERTY',
        id: 'resv456',
        netTotal: 100,
        reservedUser: {},
        code: 'XYZ789',
        property: { allowInstantBooking: false },
      },
    });

    await act(async () => {
      await onSubmit(formData);
    });

    expect(window.open).toHaveBeenCalled();
    expect(window.close).toHaveBeenCalled();
    expect(toast).toHaveBeenCalledWith(expect.objectContaining({ description: 'Success' }));
  });

  it('should show error toast and call login modal on 403 error', async () => {
    (getCaptchaToken as jest.Mock).mockResolvedValue('captcha-token');
    (addReservation as jest.Mock).mockRejectedValue({
      message: 'Forbidden',
      status: 403,
    });

    await act(async () => {
      await onSubmit(formData);
    });

    expect(toast).toHaveBeenCalledWith(expect.objectContaining({ description: 'Forbidden' }));
    expect(mockHandleLoginModal).toHaveBeenCalledWith({ open: true });
    expect(mockSetReserving).toHaveBeenCalledWith(false);
  });

  it('should call notFound on 401 error', async () => {
    (getCaptchaToken as jest.Mock).mockResolvedValue('captcha-token');
    (addReservation as jest.Mock).mockRejectedValue({
      message: 'Unauthorized',
      status: 401,
    });

    await act(async () => {
      await onSubmit(formData);
    });

    expect(toast).toHaveBeenCalledWith(expect.objectContaining({ description: 'Unauthorized' }));
    expect(mockNotFound).toHaveBeenCalled();
    expect(mockSetReserving).toHaveBeenCalledWith(false);
  });
});
