
import React from 'react';
import { User } from '../types';
import { PeopleIcon, LocationIcon, LinkIcon } from './icons';

interface ProfileCardProps {
    user: User | null;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
    if (!user) return null;

    return (
        <div className="p-4 md:p-0">
            <img src={user.avatar_url} alt={`${user.login} avatar`} className="w-48 h-48 rounded-full border-4 border-gray-800 mx-auto md:mx-0" />
            <div className="mt-4">
                <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                <p className="text-xl text-gray-400">{user.login}</p>
            </div>
            <button className="w-full mt-4 bg-[#21262d] border border-gray-700 rounded-md py-1.5 text-sm font-semibold hover:bg-gray-700 transition-colors">
                Follow
            </button>
            <p className="mt-4 text-gray-300">{user.bio}</p>
            <div className="flex items-center mt-4 text-sm text-gray-400">
                <PeopleIcon />
                <a href={`${user.html_url}?tab=followers`} className="hover:text-blue-500">
                    <span className="font-semibold text-white">{user.followers}</span> followers
                </a>
                <span className="mx-1">·</span>
                <a href={`${user.html_url}?tab=following`} className="hover:text-blue-500">
                    <span className="font-semibold text-white">{user.following}</span> following
                </a>
            </div>
            {user.location && (
                <div className="flex items-center mt-2 text-sm">
                    <LocationIcon />
                    <span>{user.location}</span>
                </div>
            )}
            {user.blog && (
                 <div className="flex items-center mt-2 text-sm">
                    <LinkIcon />
                    <a href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 truncate">{user.blog}</a>
                </div>
            )}
        </div>
    );
};

export default ProfileCard;
