import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/5 bg-[#050813] py-6 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <span className="font-semibold text-slate-400">FUTURE LAB</span> · Нэг команд, Нэг шинэ боломж.
        </div>
        <div className="text-slate-400">
          Гараараа бич. Өөрийнхөөрөө бүтээ.
        </div>
      </div>
    </footer>
  );
};
