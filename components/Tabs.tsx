
import React from 'react';
import { BookIcon, RepoIcon } from './icons';

interface TabsProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    repoCount: number;
}

const Tab: React.FC<{
    icon: React.ReactNode;
    label: string;
    count?: number;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, count, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center px-4 py-2 border-b-2 text-sm transition-colors ${
                isActive
                    ? 'border-orange-500 text-white font-semibold'
                    : 'border-transparent text-gray-400 hover:bg-gray-800 hover:text-white rounded-md'
            }`}
        >
            {icon}
            <span>{label}</span>
            {count !== undefined && <span className="ml-2 bg-gray-700 text-xs rounded-full px-2 py-0.5">{count}</span>}
        </button>
    );
};


const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab, repoCount }) => {
    return (
        <div className="border-b border-gray-800">
            <nav className="flex space-x-2" aria-label="Tabs">
                <Tab
                    icon={<BookIcon />}
                    label="Overview"
                    isActive={activeTab === 'Overview'}
                    onClick={() => setActiveTab('Overview')}
                />
                <Tab
                    icon={<RepoIcon />}
                    label="Repositories"
                    count={repoCount}
                    isActive={activeTab === 'Repositories'}
                    onClick={() => setActiveTab('Repositories')}
                />
            </nav>
        </div>
    );
};

export default Tabs;
