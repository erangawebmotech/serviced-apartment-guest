"use client"

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex flex-col justify-center items-center bg-gray-100 px-4 min-h-screen font-poppins text-center">
      <div className="p-8 rounded-2xl w-full max-w-md">
        <h1 className="mb-4 font-bold text-red-600 text-3xl">Oops! Something went wrong.</h1>
        <p className="mb-6 text-gray-700">
          We ran into an unexpected error. Please try again or come back later.
        </p>
        
        <button
          onClick={reset}
          className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-xl text-white transition-all duration-200"
        >
          Try Again
        </button>

       
        <p className="mt-6 max-h-32 overflow-auto text-gray-500 text-sm">
          {error.message}
        </p>
      </div>
    </div>
  );
}
