// components/common/sections/parcours/ParcoursCard.tsx
interface ParcoursCardProps {
    title: string;
    subtitle: string;
    dates: string;
    extra?: string;
    onClick: () => void;
}

export default function ParcoursCard({ title, subtitle, dates, extra, onClick }: ParcoursCardProps) {
    return (
        <div
            className="border-2 border-black p-3 cursor-none hover:bg-gray-100 transition-colors hoverable"
            onClick={onClick}
        >
            <h4 className="text-pixel-sm font-bold">{title}</h4>
            <p className="text-pixel-xs">{subtitle}</p>
            <p className="text-pixel-xs">{dates}</p>
            {extra && <p className="text-pixel-xs mt-2">{extra}</p>}
        </div>
    );
}
