import React from 'react';
import { Info, TriangleAlert, Wine, Flame, Scroll, Image as ImageIcon } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

/**
 * Converts Google Drive share links to direct image URLs
 */
const getDirectImageUrl = (url) => {
    if (!url || url === '#N/A' || url === 'undefined' || url.trim() === '') return null;

    // Detect shared Google Drive links
    if (url.includes('drive.google.com') || url.includes('docs.google.com/open')) {
        let fileId = '';

        // Match different types of drive URLs to find the ID
        const patterns = [
            /\/d\/([^/]+)\//,           // file/d/ID/view
            /id=([^&]+)/,               // ?id=ID
            /open\?id=([^&]+)/          // open?id=ID
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
                fileId = match[1];
                break;
            }
        }

        if (fileId) {
            // This lh3 format is the most reliable way to show Drive images in <img> tags
            return `https://lh3.googleusercontent.com/d/${fileId}`;
        }
    }

    return url;
};

export const SlideCard = ({ message }) => {
    const { title, body, type, imageUrl } = message;
    const processedImageUrl = getDirectImageUrl(imageUrl);
    const cleanTitle = title === '.' ? '' : title;

    // Base container class for all non-image slides
    const cardBaseClass = "frame-message flex flex-col items-center justify-center h-[95%] w-[95%] text-center p-32 relative overflow-hidden";

    const renderContent = () => {
        const titleLength = title?.length || 0;
        const bodyLength = body?.length || 0;
        const totalLength = titleLength + bodyLength;

        // Dynamic font classes based on length
        const getTitleClass = (baseClass) => {
            if (totalLength > 150) return "text-6xl";
            if (totalLength > 80) return "text-7xl";
            return baseClass;
        };

        const getBodyClass = (baseClass) => {
            if (totalLength > 250) return "text-4xl";
            if (totalLength > 150) return "text-5xl";
            if (totalLength > 80) return "text-6xl";
            return baseClass;
        };

        switch (type) {
            case 'info':
                return (
                    <div className="flex items-center justify-center w-full h-full">
                        <div className={cardBaseClass}>
                            <Info size={100} className="text-[#d4af37] mb-10 drop-shadow-md" />
                            <h1 className={cn("font-black mb-10 text-white font-serif drop-shadow-lg leading-tight", getTitleClass("text-8xl"))}>
                                {title}
                            </h1>
                            <p className={cn("leading-tight text-slate-200 font-serif font-semibold drop-shadow-sm", getBodyClass("text-6xl"))}>
                                {body}
                            </p>
                        </div>
                    </div>
                );
            case 'alert':
                return (
                    <div className="flex items-center justify-center w-full h-full">
                        <div className={cardBaseClass}>
                            <TriangleAlert size={120} className="text-[#d4af37] mb-10 animate-bounce drop-shadow-lg" />
                            <h1 className={cn("font-black mb-10 text-white font-serif uppercase tracking-widest decoration-4 underline decoration-[#d4af37]/50 drop-shadow-lg leading-none", getTitleClass("text-9xl"))}>
                                {title}
                            </h1>
                            <p className={cn("font-bold text-slate-100 drop-shadow-md", getBodyClass("text-7xl"))}>
                                {body}
                            </p>
                        </div>
                    </div>
                );
            case 'mazaltov':
                return (
                    <div className="flex items-center justify-center w-full h-full">
                        <div className={cardBaseClass}>
                            <Wine size={140} className="text-[#d4af37] mb-10 drop-shadow-xl" />
                            <h1 className={cn("font-serif font-black mb-10 text-[#d4af37] drop-shadow-2xl leading-none text-shadow-heavy", getTitleClass("text-9xl"))}>
                                {title}
                            </h1>
                            <p className={cn("text-white font-serif font-medium italic drop-shadow-lg", getBodyClass("text-7xl"))}>
                                {body}
                            </p>
                        </div>
                    </div>
                );
            case 'memorial':
                return (
                    <div className="flex items-center justify-center w-full h-full">
                        <div className={cardBaseClass}>
                            <Flame size={100} className="text-orange-400 mb-10 animate-pulse drop-shadow-lg" />
                            <h1 className="text-7xl font-bold mb-8 text-slate-300 font-serif italic">לעילוי נשמת</h1>
                            <h2 className={cn("font-black mb-10 text-white border-b-6 border-[#d4af37]/30 pb-6 px-16 font-serif tracking-wide leading-tight", getTitleClass("text-8xl"))}>
                                {title}
                            </h2>
                            <p className={cn("text-slate-200 italic font-serif leading-relaxed drop-shadow-sm", getBodyClass("text-6xl"))}>
                                {body}
                            </p>
                        </div>
                    </div>
                );
            case 'times':
                return (
                    <div className="flex items-center justify-center w-full h-full">
                        <div className={cardBaseClass}>
                            <Scroll size={100} className="text-[#d4af37] mb-10 drop-shadow-md" />
                            <h1 className={cn("font-bold mb-10 text-white font-serif underline decoration-double decoration-[#d4af37]/50 leading-tight", getTitleClass("text-8xl"))}>
                                {title}
                            </h1>
                            <div className={cn(
                                "w-full max-w-6xl font-serif leading-tight drop-shadow-sm whitespace-pre-line text-slate-200",
                                getBodyClass("text-7xl")
                            )}>
                                {body}
                            </div>
                        </div>
                    </div>
                );
            case 'image':
                return (
                    <div className="absolute inset-0 w-full h-full overflow-hidden">
                        {processedImageUrl ? (
                            <img
                                src={processedImageUrl}
                                alt={cleanTitle}
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
            case 'image_text':
                return (
                    <div className="flex items-center justify-center w-full h-full p-8">
                        <div className={cn("frame-message w-full h-full flex flex-col overflow-hidden p-0", "bg-slate-900/20")}>
                            {/* Image Area */}
                            <div className="flex-[3] w-full relative overflow-hidden bg-black/10">
                                {processedImageUrl ? (
                                    <img
                                        src={processedImageUrl}
                                        alt={cleanTitle}
                                        className="w-full h-full object-contain"
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/1920x1080?text=תמונה+לא+נמצאה'; }}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full">
                                        <ImageIcon size={100} className="text-white/20" />
                                    </div>
                                )}
                            </div>

                            {/* Text Area */}
                            <div className="flex-1 w-full flex flex-col items-center justify-center px-16 text-center border-t-2 border-[#d4af37]/20 bg-gradient-to-b from-slate-900/40 to-slate-900/60">
                                {cleanTitle && (
                                    <h1 className="text-6xl font-black text-[#d4af37] mb-4 font-serif drop-shadow-lg">
                                        {cleanTitle}
                                    </h1>
                                )}
                                <p className="text-5xl text-white font-serif font-semibold leading-tight drop-shadow-md">
                                    {body}
                                </p>
                            </div>
                        </div>
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
