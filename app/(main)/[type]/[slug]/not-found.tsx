import Image from "next/image";
import Link from "next/link";
import logo from '@/public/icon.png';
import watermark from '@/public/shared/Bg-watermark.png';

export default function NotFound() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center text-white font-poppins bg-gradient-to-b from-black via-gray-800 to-black">
      <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url(${watermark.src})` }} />

      <div className="relative flex flex-col border items-center p-6 shadow-lg rounded-lg bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 max-w-md mx-4 text-center">
        <div className="mb-6">
          <Image src={logo} alt="Serviced Apartments Logo" width={80} height={80} priority />
        </div>

        <h1 className="font-bold text-6xl text-secondary">404</h1>
        <h2 className="mt-4 font-semibold text-slate-300 text-xl">
          Page Not Found
        </h2>

        <p className="mt-3 text-gray-300 text-sm">
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        <div className="mt-6 space-y-4 w-full">
          <Link
            href="/"
            className="block w-full text-center bg-primary hover:bg-blue-950 px-4 py-2 rounded-lg text-white font-medium transition duration-300 shadow focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}