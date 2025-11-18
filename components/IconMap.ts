import React from 'react';
import { BrainIcon, ZapIcon, FootprintsIcon, SwordsIcon, BookOpen } from 'lucide-react';

export const iconMap: { [key: string]: React.ComponentType<{ className?: string; size?: number }> } = {
    ZapIcon,
    BrainIcon,
    FootprintsIcon,
    SwordsIcon,
    BookOpen,
};
