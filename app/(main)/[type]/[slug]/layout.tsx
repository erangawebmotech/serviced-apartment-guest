import { getHotelDetails } from '@/actions/services/getHotelDetails';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    try {
        const response = await getHotelDetails(slug);
        const coverImage = response?.data?.propertyImages?.find((image: any) => image.isCover);
        const coverImageMediumPath = coverImage?.file?.mediumPath || null;

        return {
            title: response?.data?.name || response?.data?.propertyType?.name || 'Serviced Apartments',
            description: response?.data?.description || 'Serviced Apartments',
            openGraph: {
                images: [
                    {
                        url: coverImageMediumPath || '',
                    },
                ],
            },
        };
    } catch (error: any) {
        if (error.status === 404) {
            notFound()
        }


        return {
            title: 'Hotel',
            description: 'Hotel details could not be loaded.',
            openGraph: {
                images: [
                    {
                        url: `${process.env.NEXT_PUBLIC_BASE_URL}/opengraph-image.png`,
                    },
                ],
            },
        };
    }
}

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return <>{children}
    </>;
};

export default MainLayout;
