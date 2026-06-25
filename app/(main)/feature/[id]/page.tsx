import Image from 'next/image';
import Link from 'next/link';
import logo from '@/public/icon.png';
import watermark from '@/public/shared/Bg-watermark.png';
import { Metadata } from 'next';

const formatId = (id?: string) => {
  if (!id) return "Unknown";
  return id
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export function generateStaticParams() {
    const ids = ['filter-page',]; 
    return ids.map(id => ({ id }));
}


export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const featureName = formatId(params?.id);
  return {
    title: featureName,
  };
}

export default function Page({ params }: { params: any }) {
    const id = formatId(params.id);

    return (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-gradient-to-b from-black via-gray-800 to-black font-poppins text-white">
            <div
                className="absolute inset-0 bg-cover bg-center opacity-10"
                style={{ backgroundImage: `url(${watermark.src})` }}
            />
            <div className="z-10 flex flex-col items-center bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 shadow-lg mx-4 p-6 px-20 border rounded-lg max-w-md text-center">
                <div className="mb-6">
                    <Image
                        src={logo}
                        alt="Serviced Apartments Logo"
                        width={80}
                        height={80}
                        priority
                    />
                </div>

                <h1 className="w-max font-bold text-secondary text-4xl uppercase tracking-wider">
                    Coming Soon
                </h1>

                <p className="mt-3 w-max text-gray-300 text-sm">
                    Exciting things are on the way!
                </p>
                <p className="mt-1 w-max text-gray-300 text-sm">
                    Feature <span className="text-secondary">{id}</span> is under development.
                </p>

                <div className="space-y-4 mt-6 w-full">
                    <Link
                        href="/"
                        className="block bg-primary hover:bg-blue-950 shadow px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 w-full font-medium text-white text-center transition duration-300"
                    >
                        Return to Homepage
                    </Link>
                </div>
            </div>
        </div>
    );
}
