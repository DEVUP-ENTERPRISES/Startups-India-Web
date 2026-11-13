'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Home } from 'lucide-react';

export default function RouteError({ error, reset }) {
  useEffect(() => {
    console.error('[route error]', error?.digest || '', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] bg-[#f9fafb] flex items-center justify-center p-4">
      <div
        role="alert"
        className="max-w-xl w-full text-center bg-white border-4 border-black p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-black mb-4 tracking-tight">
          This page didn&apos;t load properly
        </h1>
        <p className="text-lg text-slate-600 mb-8 leading-relaxed font-medium">
          Something went wrong on our side. Your account and data are safe. Please try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 bg-black text-white px-8 py-4 font-bold text-lg border-2 border-black hover:bg-slate-800 transition-all shadow-[4px_4px_0px_0px_rgba(122,31,43,1)] hover:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <RefreshCw className="w-5 h-5" aria-hidden="true" />
            Try again
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-white text-black px-8 py-4 font-bold text-lg border-2 border-black hover:bg-slate-50 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <Home className="w-5 h-5" aria-hidden="true" />
            Go to homepage
          </Link>
        </div>
        {error?.digest && <p className="mt-6 text-xs text-slate-400">Reference: {error.digest}</p>}
      </div>
    </div>
  );
}
