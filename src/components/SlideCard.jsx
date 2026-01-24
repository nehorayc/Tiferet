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
    const cardBaseClass = "synagogue-border flex flex-col items-center justify-center h-4/5 w-4/5 text-center p-16 relative overflow-hidden shadow-2xl";

    const renderContent = () => {
        switch (type) {
            case 'info':
                return (
                    <div className="flex items-center justify-center w-full h-full">
                        <div className={cardBaseClass}>
                            <Info size={80} className="text-blue-900 mb-8" />
                            <h1 className="text-8xl font-black mb-10 text-blue-950 font-serif drop-shadow-sm">{title}</h1>
                            <p className="text-6xl leading-tight text-slate-800 font-serif font-semibold">{body}</p>
                        </div>
                    </div>
                );
            case 'alert':
                return (
                    <div className="flex items-center justify-center w-full h-full">
                        <div className={cardBaseClass} style={{ backgroundColor: '#fee2e2' }}>
                            <TriangleAlert size={100} className="text-red-700 mb-8 animate-bounce" />
                            <h1 className="text-9xl font-black mb-10 text-red-800 uppercase tracking-wide decoration-4 underline decoration-red-400">{title}</h1>
                            <p className="text-7xl font-bold text-red-900">{body}</p>
                        </div>
                    </div>
                );
            case 'mazaltov':
                return (
                    <div className="flex items-center justify-center w-full h-full">
                        <div className={cardBaseClass} style={{ backgroundColor: '#fffbeb' }}>
                            <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
                            <Wine size={120} className="text-yellow-600 mb-8" />
                            <h1 className="text-9xl font-serif font-black mb-10 text-yellow-700 drop-shadow-md leading-tight text-shadow-heavy">
                                {title}
                            </h1>
                            <p className="text-7xl text-slate-900 font-serif font-medium italic">{body}</p>
                            <div className="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
                        </div>
                    </div>
                );
            case 'memorial':
                return (
                    <div className="flex items-center justify-center w-full h-full">
                        <div className={cardBaseClass} style={{ backgroundColor: '#f3f4f6' }}>
                            <Flame size={80} className="text-orange-600/80 mb-8 animate-pulse" />
                            <h1 className="text-7xl font-bold mb-6 text-slate-600">לעילוי נשמת</h1>
                            <h2 className="text-8xl font-black mb-8 text-slate-900 border-b-4 double border-slate-400 pb-4 px-12">{title}</h2>
                            <p className="text-5xl text-slate-700 italic font-serif leading-relaxed">{body}</p>
                        </div>
                    </div>
                );
            case 'times':
                return (
                    <div className="flex items-center justify-center w-full h-full">
                        <div className={cardBaseClass}>
                            <Scroll size={80} className="text-blue-800 mb-8" />
                            <h1 className="text-8xl font-bold mb-10 text-blue-950 font-serif underline decoration-double decoration-blue-300">{title}</h1>
                            <div className="w-full max-w-4xl text-6xl text-slate-900 font-serif leading-loose">
                                {body}
                            </div>
                        </div>
                    </div>
                );
            case 'image':
                return (
                    <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-black/50 backdrop-blur-sm p-10">
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={title}
                                className="max-h-full max-w-full object-contain shadow-2xl border-[10px] border-white/20 rounded-lg"
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/1920x1080?text=תמונה+לא+נמצאה'; }}
                            />
                        ) : (
                            <div className="text-center p-12 bg-white/10 rounded-xl border border-white/20">
                                <ImageIcon size={100} className="text-white/50 mx-auto mb-4" />
                                <h1 className="text-4xl text-white/70">תמונה לא זמינה</h1>
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
        <div className="w-full h-full transition-opacity duration-1000 flex items-center justify-center p-12">
            {renderContent()}
        </div>
    );
};
