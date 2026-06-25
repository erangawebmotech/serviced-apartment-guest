import { getPDFToDownload } from '@/service/reservation';
import { setHours, setMinutes } from 'date-fns'


export enum CheckTimeType {
    CHECKIN = 'CHECKIN',
    CHECKOUT = 'CHECKOUT'
}

// const timeZone = process.env.NEXT_PUBLIC_TIME_ZONE;

// export const refactorDate = (date: Date, type: CheckTimeType): Date => {
//     if (type === CheckTimeType.CHECKIN) {
//         return toZonedTime(setMinutes(setHours(date, 0), 0), timeZone!);
//     } else {
//         return toZonedTime(setMinutes(setHours(date, 23), 59), timeZone!);
//     }
// };
export const refactorDate = (date: Date | undefined, type: CheckTimeType): Date => {
    if(!date) return new Date();
    if (type === CheckTimeType.CHECKIN) {
        return setMinutes(setHours(date, 0), 0);
    } else {
        return setMinutes(setHours(date, 23), 59);
    }
};

export function getMonthsOnServicedApartments(dateString: string): string {
    const givenDate = new Date(dateString);
    const now = new Date();

    let months =
        (now.getFullYear() - givenDate.getFullYear()) * 12 +
        (now.getMonth() - givenDate.getMonth());

    if (now.getDate() < givenDate.getDate()) {
        months -= 1;
    }

    if (months < 0) months = 0;

    if (months >= 12) {
        const years = Math.floor(months / 12);
        const yearLabel = years === 1 ? "Year" : "Years";
        return `${years} ${yearLabel} on Serviced Apartments`;
    }

    const monthLabel = months === 1 ? "Month" : "Months";
    return `${months} ${monthLabel} on Serviced Apartments`;
}

