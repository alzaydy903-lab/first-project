
import React, { useState, useMemo } from 'react';
import { Repo } from '../types';
import RepositoryCard from './RepositoryCard';

interface RepositoryListProps {
    repos: Repo[];
}

const RepositoryList: React.FC<RepositoryListProps> = ({ repos }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [languageFilter, setLanguageFilter] = useState('All');

    const languages = useMemo(() => {
        const langSet = new Set<string>();
        repos.forEach(repo => {
            if (repo.language) {
                langSet.add(repo.language);
            }
        });
        return ['All', ...Array.from(langSet).sort()];
    }, [repos]);

    const filteredRepos = useMemo(() => {
        return repos
            .filter(repo => {
                // Search term filter
                return repo.name.toLowerCase().includes(searchTerm.toLowerCase());
            })
            .filter(repo => {
                // Type filter
                if (typeFilter === 'All') return true;
                if (typeFilter === 'Forks') return repo.fork;
                return true; // Simplified, add more types if needed
            })
            .filter(repo => {
                // Language filter
                if (languageFilter === 'All') return true;
                return repo.language === languageFilter;
            });
    }, [repos, searchTerm, typeFilter, languageFilter]);

    return (
        <div>
            <div className="mb-4 pb-4 border-b border-gray-800">
                <input
                    type="text"
                    placeholder="Find a repository..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#0d1117] border border-gray-700 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2 mt-4">
                    <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="bg-[#21262d] border border-gray-700 rounded-md px-3 py-1.5 text-sm">
                        <option value="All">All</option>
                        <option value="Forks">Forks</option>
                    </select>
                     <select value={languageFilter} onChange={e => setLanguageFilter(e.target.value)} className="bg-[#21262d] border border-gray-700 rounded-md px-3 py-1.5 text-sm">
                        {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                    </select>
                </div>
            </div>
            <div>
                {filteredRepos.length > 0 ? (
                    filteredRepos.map(repo => (
                        <RepositoryCard key={repo.id} repo={repo} />
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-400">
                        No repositories found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default RepositoryList;
