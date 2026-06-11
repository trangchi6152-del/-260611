import React from 'react';
import {
  Heart,
  BookOpen,
  Cloud,
  Flame,
  Cpu,
  Sun,
  Wine,
  Gift,
  Disc,
  Map,
  PawPrint,
  Music,
  Calendar,
  Sparkles,
  HelpCircle,
  Clock,
  Compass
} from 'lucide-react';

interface AnniversaryIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const AnniversaryIcon: React.FC<AnniversaryIconProps> = ({ name, className = '', size = 20 }) => {
  switch (name) {
    case 'Heart':
      return <Heart className={className} size={size} />;
    case 'BookOpen':
      return <BookOpen className={className} size={size} />;
    case 'Cloud':
      return <Cloud className={className} size={size} />;
    case 'Flame':
      return <Flame className={className} size={size} />;
    case 'Cpu':
      return <Cpu className={className} size={size} />;
    case 'Sun':
      return <Sun className={className} size={size} />;
    case 'Wine':
      return <Wine className={className} size={size} />;
    case 'Gift':
      return <Gift className={className} size={size} />;
    case 'Disc':
      return <Disc className={className} size={size} />;
    case 'Map':
      return <Map className={className} size={size} />;
    case 'PawPrint':
      return <PawPrint className={className} size={size} />;
    case 'Music':
      return <Music className={className} size={size} />;
    case 'Calendar':
      return <Calendar className={className} size={size} />;
    case 'Sparkles':
      return <Sparkles className={className} size={size} />;
    case 'Clock':
      return <Clock className={className} size={size} />;
    case 'Compass':
      return <Compass className={className} size={size} />;
    default:
      return <HelpCircle className={className} size={size} />;
  }
};
