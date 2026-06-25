import React from 'react'
import { Timeline, TimelineDescription, TimelineHeader, TimelineItem, TimelineTime, TimelineTitle } from './timeline';
import { PAYMENT_STATUS_TYPES } from '@/common/constants';
interface reservationTimelineProps {
    reason: null | string,
    createdAt: string | Date,
    status: string
}

const TimelineLayout = ({ data }: { data: reservationTimelineProps[] }) => {
    return (
        <Timeline className="mt-5">
            {data.map((item, index) => (
                <TimelineItem key={index}>
                    <TimelineHeader
                        className={`justify-start ${item.status === PAYMENT_STATUS_TYPES.APPROVED
                            ? "after:bg-green-500"
                            : item.status === PAYMENT_STATUS_TYPES.PENDING
                                ? "after:bg-yellow-500"
                                : item.status === PAYMENT_STATUS_TYPES.CANCELLED
                                    ? "after:bg-red-600"
                                    : item.status === PAYMENT_STATUS_TYPES.CANCELLED
                                        ? "after:bg-red-500"
                                        : "after:bg-primary/70"
                            }`}
                    >
                        <TimelineTime className="bg-transparent hover:bg-transparent shadow-none text-primary">
                            {new Date(item.createdAt).toDateString()}
                        </TimelineTime>
                        <TimelineTitle className="text-sm">{item.status.replace(/_/g, ' ')}</TimelineTitle>
                    </TimelineHeader>
                    <TimelineDescription className="text-gray-600 text-xs">
                        {item.reason
                            ? item.reason
                            : item.status === PAYMENT_STATUS_TYPES.APPROVED
                                ? "Your reservation has been approved."
                                : item.status === PAYMENT_STATUS_TYPES.CANCELLED
                                    ? "Your reservation has been canceled."
                                    : item.status === PAYMENT_STATUS_TYPES.PENDING
                                        ? "Your reservation is pending."
                                        : item.status === PAYMENT_STATUS_TYPES.REJECTED
                                            ? "Your reservation has been rejected."
                                            : item.status === PAYMENT_STATUS_TYPES.CHECKED_IN
                                                ? "You have successfully checked in."
                                                : item.status === PAYMENT_STATUS_TYPES.CHECKED_OUT
                                                    ? "You have successfully checked out."
                                                    : ""}
                    </TimelineDescription>
                </TimelineItem>
            ))}
        </Timeline>
    )
}

export default TimelineLayout