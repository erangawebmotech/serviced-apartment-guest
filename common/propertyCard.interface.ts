export interface DealsProps {
    id: number,
    name: string,
    slug: string,
    discount?: number,
    location: {
        country: {
            id: number,
            name: string
        },
        province: {
            id: number,
            name: string
        },
        district: {
            id: number,
            name: string,
        },
        city: {
            id: number,
            name: string,
        }
    },
    summaryReview: {
        averageReviews: number,
        totalReviews: number,
    },
    images:ImageProps[],
    propertyType: {
        type: string,
    }
}


export interface ImageProps {
    isCover: boolean,
    file: {
        mediumPath: string
        smallPath: string
        largePath: string
    }
}