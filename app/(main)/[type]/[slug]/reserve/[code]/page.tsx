import React, { Suspense } from 'react';
import ReservationSuccessPage from '@/components/reserve/ReservationSuccessPage';


export default async function Page({ params }: { params: Promise<{ code: string }> }) {
    const code = (await params).code;
    return (
        <Suspense>
            <ReservationSuccessPage id={code} />
        </Suspense>
    );
}


