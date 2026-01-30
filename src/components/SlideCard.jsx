import React from 'react';
import { Info, TriangleAlert, Wine, Flame, Scroll, Image as ImageIcon } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const SlideCard = ({ message }) => {
    const { title, body, type, imageUrl } = message;

    // Base container class for all non-image slides
    const cardBaseClass = "frame-message flex flex-col items-center justify-center h-[95%] w-[95%] text-center p-32 relative overflow-hidden";

    const renderContent = () => {
        switch (type) {
            case 'info':
                return (
                    <div className="flex items-center justify-center w-full h-full">
                        <div className={cardBaseClass}>
                            <Info size={120} className="text-[#d4af37] mb-12 drop-shadow-md" />
                            <h1 className="text-9xl font-black mb-14 text-white font-serif drop-shadow-lg leading-tight">{title}</h1>
                            <p className="text-7xl leading-tight text-slate-200 font-serif font-semibold drop-shadow-sm">{body}</p>
                        </div>
                    </div>
                );
            case 'alert':
                return (
                    <div className="flex items-center justify-center w-full h-full">
                        <div className={cardBaseClass}>
                            {/* Gold/White theme for alerts instead of red */}
                            <TriangleAlert size={150} className="text-[#d4af37] mb-12 animate-bounce drop-shadow-lg" />
                            <h1 className="text-[10rem] font-black mb-14 text-white font-serif uppercase tracking-widest decoration-4 underline decoration-[#d4af37]/50 drop-shadow-lg leading-none">{title}</h1>
                            <p className="text-8xl font-bold text-slate-100 drop-shadow-md">{body}</p>
                        </div>
                    </div>
                );
            case 'mazaltov':
                return (
                    <div className="flex items-center justify-center w-full h-full">
                        <div className={cardBaseClass}>
                            <Wine size={160} className="text-[#d4af37] mb-12 drop-shadow-xl" />
                            <h1 className="text-[11rem] font-serif font-black mb-14 text-[#d4af37] drop-shadow-2xl leading-none text-shadow-heavy">
                                {title}
                            </h1>
                            <p className="text-8xl text-white font-serif font-medium italic drop-shadow-lg">{body}</p>
                        </div>
                    </div>
                );
            case 'memorial':
                return (
                    <div className="flex items-center justify-center w-full h-full">
                        <div className={cardBaseClass}>
                            <Flame size={120} className="text-orange-400 mb-12 animate-pulse drop-shadow-lg" />
                            <h1 className="text-8xl font-bold mb-10 text-slate-300 font-serif italic">לעילוי נשמת</h1>
                            <h2 className="text-9xl font-black mb-12 text-white border-b-6 border-[#d4af37]/30 pb-8 px-20 font-serif tracking-wide leading-tight">{title}</h2>
                            <p className="text-7xl text-slate-200 italic font-serif leading-relaxed drop-shadow-sm">{body}</p>
                        </div>
                    </div>
                );
            case 'times':
                return (
                    <div className="flex items-center justify-center w-full h-full">
                        <div className={cardBaseClass}>
                            <Scroll size={120} className="text-[#d4af37] mb-12 drop-shadow-md" />
                            <h1 className="text-9xl font-bold mb-14 text-white font-serif underline decoration-double decoration-[#d4af37]/50 leading-tight">{title}</h1>
                            <div className="w-full max-w-6xl text-7xl text-slate-100 font-serif leading-loose drop-shadow-sm whitespace-pre-line">
                                {body}
                            </div>
                        </div>
                    </div>
                );
            case 'image':
                return (
                    <div className="absolute inset-0 w-full h-full overflow-hidden">
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={title}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/1920x1080?text=תמונה+לא+נמצאה'; }}
                            />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full bg-slate-900">
                                <ImageIcon size={100} className="text-white/20" />
                            </div>
                        )}
                    </div>
                );
            default:
                return (
                    <div className="flex items-center justify-center h-full text-slate-500 font-serif text-3xl">
                        סוג שקופית לא נתמך: {type}
                    </div>
                );
        }
    };

    return (
        <div className="w-full h-full transition-opacity duration-1000 flex items-center justify-center">
            {renderContent()}
        </div>
    );
};
