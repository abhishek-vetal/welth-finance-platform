import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen justify-center flex items-center bg-white px-6">

      <div className="text-center max-w-lg">

        {/* 404 Text */}
        <h1 className="text-[120px] font-extrabold tracking-tight bg-linear-to-r from-gray-900 via-gray-700 to-gray-500 text-transparent bg-clip-text">
          404
        </h1>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800 mt-2">
          Oops! Page not found
        </h2>

        {/* Description */}
        <p className="text-gray-500 mt-3 leading-relaxed">
          The page you’re looking for doesn’t exist or has been moved.
          Let’s get you back on track.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-black text-white hover:bg-gray-800 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Go Home
          </Link>
        </div>

        {/* Divider */}
        <div className="mt-10 border-t border-gray-200 pt-4 text-sm text-gray-400">
          Error code: 404 — Resource not found
        </div>
      </div>
    </div>
  );
}