import React, { useState, useEffect } from 'react';
import { User, Repo } from './types';
import { fetchUserData } from './services/githubService';
import ProfileCard from './components/ProfileCard';
import RepositoryList from './components/RepositoryList';
import ContributionGraph from './components/ContributionGraph';
import Tabs from './components/Tabs';
import { LANGUAGE_COLORS } from './components/RepositoryCard';
import { BookIcon, StarIcon } from './components/icons';

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [repos, setRepos] = useState<Repo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<string>('Overview');

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const { user, repos } = await fetchUserData();
                setUser(user);
                setRepos(repos);
                setError(null);
            } catch (err) {
                setError('Failed to fetch GitHub data. Please check the console.');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const PinnedRepos = () => {
        const getLangColor = (language: string | null) => {
            if (!language) return 'bg-gray-400';
            return LANGUAGE_COLORS[language] || 'bg-gray-400';
        };

        return (
            <div className="mt-6">
                <h2 className="text-xl font-semibold text-white mb-2">Pinned</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {repos.slice(0, 6).map(repo => (
                        <div key={repo.id} className="border border-gray-700 rounded-md p-4 flex flex-col justify-between">
                            <div>
                                <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 font-semibold hover:underline flex items-center">
                                    <BookIcon />
                                    {repo.name}
                                </a>
                                <p className="text-gray-400 text-sm mt-2">{repo.description}</p>
                            </div>
                            <div className="flex items-center text-gray-400 text-xs mt-4">
                            {repo.language && (
                                    <div className="flex items-center mr-4">
                                        <span className={`w-3 h-3 rounded-full mr-1.5 ${getLangColor(repo.language)}`}></span>
                                        <span>{repo.language}</span>
                                    </div>
                                )}
                                {repo.stargazers_count > 0 && (
                                    <a href={`${repo.html_url}/stargazers`} className="flex items-center mr-4 hover:text-blue-500">
                                        <StarIcon />
                                        <span className="ml-1">{repo.stargazers_count.toLocaleString()}</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderContent = () => {
        if (loading) {
            return <div className="text-center py-20 text-lg">Loading profile...</div>;
        }
        if (error) {
            return <div className="text-center py-20 text-red-500">{error}</div>;
        }
        if (!user) {
            return <div className="text-center py-20">User not found.</div>;
        }

        return (
            <div className="container mx-auto px-4 py-8">
                <main className="md:grid md:grid-cols-4 md:gap-8">
                    <aside className="md:col-span-1 mb-8 md:mb-0">
                        <ProfileCard user={user} />
                    </aside>
                    <div className="md:col-span-3">
                        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} repoCount={repos.length} />
                        <div className="mt-6">
                            {activeTab === 'Overview' && (
                                <>
                                    <PinnedRepos />
                                    <div className="mt-6">
                                      <ContributionGraph />
                                    </div>
                                </>
                            )}
                            {activeTab === 'Repositories' && <RepositoryList repos={repos} />}
                        </div>
                    </div>
                </main>
            </div>
        );
    };

    return <>{renderContent()}</>;
};

export default App;