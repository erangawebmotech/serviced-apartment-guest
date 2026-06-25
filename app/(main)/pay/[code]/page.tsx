'use client'
import { getPaymentDetailsFromPaymentCode } from '@/actions/services/getPaymentDetails';
import ReservationSuccessPage from '@/components/reserve/ReservationSuccessPage';
import { use, useEffect, useState } from 'react'

export interface PayloadProps {
  createdAt: number
  data: string
  endAt: number
  expired: boolean
  remainingTimeInSeconds: any
  reservationCode: string
}

export default function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);

  const [paymentCode, setPaymentCode] = useState<string | null>(null);
  const [payload, setPayload] = useState<PayloadProps | null>(null);
  const [isDone, setIsDone] = useState<boolean>(false);

  useEffect(() => {
    if (code) {
      setPaymentCode(code);

      const fetchPaymentDetails = async () => {
        try {
          const res = await getPaymentDetailsFromPaymentCode(code);
          if (res.error) throw res;
          await setPayload(res)
          setIsDone(true)
        } catch (error) {
          console.error('Fetch error:', error);
        }
      };

      fetchPaymentDetails();
    }
  }, [code]);
 
  return (
    <div>
      {paymentCode && isDone && (
        <ReservationSuccessPage id={payload?.reservationCode!} payExternal={payload}/>
      )}
    </div>
  );
}
