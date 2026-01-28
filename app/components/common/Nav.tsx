import type { FC } from 'react';
import Image from 'next/image';

interface NavProps {
  windows: Array<{ id: number; title: string; visible: boolean }>;
  onToggleWindow: (id: number) => void;
}

const iconMap: Record<number, string> = {
  1: '/images/about.svg',
  2: '/images/parcours.svg',
  3: '/images/compétences.svg',
  4: '/images/projets.svg',
  5: '/images/contact.svg',
};

const Nav: FC<NavProps> = ({ windows, onToggleWindow }) => {
  const handleKeyDown = (e: React.KeyboardEvent, id: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggleWindow(id);
    }
  };

  return (
    <nav
      className="fixed bottom-6 left-1/2 -translate-x-1/2 h-20 flex items-center justify-center gap-3 px-6 z-[999998]"
      aria-label="Navigation principale"
    >
      {windows.map((window) => (
        <button
          key={window.id}
          onClick={() => onToggleWindow(window.id)}
          onKeyDown={(e) => handleKeyDown(e, window.id)}
          title={window.title}
          aria-label={`${window.visible ? 'Masquer' : 'Afficher'} ${window.title}`}
          aria-pressed={window.visible}
          className={`w-14 h-14 flex items-center justify-center border-2 border-black transition-colors ${window.visible
              ? 'bg-white text-black hover:bg-gray-200'
              : 'bg-gray-400 text-black hover:bg-gray-500'
            } hoverable cursor-none focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2`}
        >
          <Image
            src={iconMap[window.id]}
            alt={window.title}
            width={32}
            height={32}
          />
        </button>
      ))}
    </nav>
  );
};

export default Nav;
