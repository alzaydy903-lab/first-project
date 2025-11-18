import React from 'react';
import { Repo } from '../types';
import { StarIcon, ForkIcon } from './icons';

interface RepositoryCardProps {
    repo: Repo;
}

export const LANGUAGE_COLORS: { [key: string]: string } = {
    JavaScript: 'bg-yellow-400',
    TypeScript: 'bg-blue-400',
    Python: 'bg-blue-600',
    HTML: 'bg-orange-500',
    CSS: 'bg-purple-500',
    Java: 'bg-red-500',
    C: 'bg-gray-500',
    'C++': 'bg-pink-500',
    'C#': 'bg-green-600',
    Go: 'bg-cyan-400',
    Rust: 'bg-orange-600',
    Shell: 'bg-green-300',
    Ruby: 'bg-red-600',
    PHP: 'bg-indigo-400',
    // Add more languages as needed
};

const formatUpdatedAt = (dateString: string) => {
    const date = new Date(dateString);
    return `Updated on ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
};

const RepositoryCard: React.FC<RepositoryCardProps> = ({ repo }) => {
    const langColor = repo.language ? LANGUAGE_COLORS[repo.language] || 'bg-gray-400' : 'bg-gray-400';

    return (
        <div className="py-6 border-b border-gray-800">
            <div className="flex justify-between items-start">
                <div>
                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-xl font-semibold hover:underline">
                        {repo.name}
                    </a>
                    <p className="text-gray-400 mt-1 text-sm">{repo.description}</p>
                </div>
                <button className="flex items-center text-sm bg-[#21262d] border border-gray-700 rounded-md px-3 py-1 ml-4 whitespace-nowrap hover:bg-gray-700 transition-colors">
                    <StarIcon />
                    <span className="ml-1">Star</span>
                </button>
            </div>
            <div className="flex items-center text-gray-400 text-xs mt-4">
                {repo.language && (
                    <div className="flex items-center mr-4">
                        <span className={`w-3 h-3 rounded-full mr-1.5 ${langColor}`}></span>
                        <span>{repo.language}</span>
                    </div>
                )}
                {repo.stargazers_count > 0 && (
                    <a href={`${repo.html_url}/stargazers`} className="flex items-center mr-4 hover:text-blue-500">
                        <StarIcon />
                        <span className="ml-1">{repo.stargazers_count.toLocaleString()}</span>
                    </a>
                )}
                {repo.forks_count > 0 && (
                     <a href={`${repo.html_url}/forks`} className="flex items-center mr-4 hover:text-blue-500">
                        <ForkIcon />
                        <span className="ml-1">{repo.forks_count.toLocaleString()}</span>
                    </a>
                )}
                <span>{formatUpdatedAt(repo.updated_at)}</span>
            </div>
        </div>
    );
};

export default RepositoryCard;