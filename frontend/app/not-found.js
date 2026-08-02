'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center p-4">
      <div className="max-w-xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white border-4 border-black p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#ff5252] border-2 border-black rotate-12" />
          <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-[#C5975B] border-2 border-black -rotate-12 rounded-full" />
          
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-black flex items-center justify-center rounded-2xl rotate-3">
              <Search className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-black mb-4 tracking-tighter">
            404
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-6 uppercase tracking-tight">
            Oops! Page Not Found
          </h2>
          
          <p className="text-lg text-slate-600 mb-10 leading-relaxed font-medium">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. 
            Let's get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="flex items-center justify-center gap-2 bg-black text-white px-8 py-4 font-bold text-lg border-2 border-black hover:bg-slate-800 transition-all shadow-[4px_4px_0px_0px_rgba(122,31,43,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
            >
              <Home className="w-5 h-5" />
              BACK TO HOME
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 bg-white text-black px-8 py-4 font-bold text-lg border-2 border-black hover:bg-slate-50 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
            >
              <ArrowLeft className="w-5 h-5" />
              GO BACK
            </button>
          </div>
        </motion.div>
        
        <p className="mt-8 text-slate-400 font-medium text-sm">
          Error Code: 404_PAGE_NOT_FOUND • Startups India Incubation
        </p>
      </div>
    </div>
  );
}
