import React from 'react';
import { Sparkles } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
  subMessage?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'กำลังเชื่อมต่อพลังแห่งโชคชะตา...',
  subMessage = 'กรุณารอสักครู่ จิตสงบนำพาสติและปัญญา',
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[55vh] sm:min-h-[65vh] px-4 py-12 relative overflow-hidden select-none">
      {/* Background Mystic Glow */}
      <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-br from-amber-500/15 via-purple-600/15 to-indigo-600/10 blur-[90px] pointer-events-none animate-pulse" />
      
      {/* Central Sacred Geometric Spinner */}
      <div className="relative flex items-center justify-center mb-8">
        {/* Outer Pulsing Aura Ring */}
        <div className="absolute w-28 h-28 sm:w-36 sm:h-36 rounded-full border border-amber-500/20 animate-ping opacity-30" />

        {/* Outer Rotating Dashed Ring */}
        <div 
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-dashed border-amber-400/40 border-t-amber-300 animate-spin"
          style={{ animationDuration: '8s' }}
        />

        {/* Inner Counter-Rotating Gradient Ring */}
        <div 
          className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-transparent border-t-purple-400 border-r-pink-400/80 animate-spin"
          style={{ animationDuration: '3s', animationDirection: 'reverse' }}
        />

        {/* Central Core Emblem */}
        <div className="absolute w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-600 to-purple-600 p-[1.5px] shadow-lg shadow-amber-500/30">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-amber-400/10 animate-pulse" />
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300 animate-bounce" />
          </div>
        </div>

        {/* Orbiting Sparkles */}
        <div 
          className="absolute w-28 h-28 sm:w-36 sm:h-36 animate-spin pointer-events-none"
          style={{ animationDuration: '5s' }}
        >
          <div className="w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_10px_#fde047] absolute -top-1 left-1/2 -translate-x-1/2" />
        </div>
        <div 
          className="absolute w-28 h-28 sm:w-36 sm:h-36 animate-spin pointer-events-none"
          style={{ animationDuration: '6.5s', animationDirection: 'reverse' }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-purple-300 shadow-[0_0_8px_#d8b4fe] absolute -bottom-0.5 left-1/2 -translate-x-1/2" />
        </div>
      </div>

      {/* Loading Typography */}
      <div className="text-center space-y-2 relative z-10 max-w-sm">
        <h3 className="text-base sm:text-lg font-bold gold-gradient-text tracking-wide font-cinzel-decorative">
          {message}
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 font-normal leading-relaxed">
          {subMessage}
        </p>

        {/* Subtle Animated Progress Shimmer Line */}
        <div className="w-48 sm:w-56 h-1 mx-auto mt-4 bg-slate-900 rounded-full overflow-hidden border border-amber-500/20 p-[1px]">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-amber-400 to-purple-500 rounded-full animate-goldShimmer" style={{ backgroundSize: '200% auto' }} />
        </div>
      </div>
    </div>
  );
};
