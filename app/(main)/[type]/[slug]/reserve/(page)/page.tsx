import React, { Suspense } from 'react';
import ReservationPage from '../../../../../../components/reserve/ReservationPage';


export default async function Page() {
    return (
        <Suspense>
            <ReservationPage />
        </Suspense>
    );
}


