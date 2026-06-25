import SingleView from '@/components/hotel-single-view/SingleView';
import React, { Suspense } from 'react';

export default async function Page({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: any }) {

    const slug = (await params).slug;
    const { checkin, checkout, adults, children, rooms } = await searchParams;

    // const timeZone = process.env.NEXT_PUBLIC_TIME_ZONE;
    // const chekindate = new Date().toLocaleDateString('en-CA', { timeZone: timeZone });
    // const chekoutdate = new Date(new Date().setDate(new Date().getDate() + 5)).toLocaleDateString('en-CA', { timeZone: timeZone });

    const chekindate = new Date().toLocaleDateString('en-CA');
    const chekoutdate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-CA');

    return (
        <Suspense >
            <SingleView slug={slug} checkin={checkin || chekindate + "T00:00:00"} checkout={checkout || chekoutdate + "T23:59:59"} adults={adults} children={children} rooms={rooms} />
        </Suspense>
    );
}
