
import { User, Repo } from '../types';

const GITHUB_API_BASE = 'https://api.github.com';
const USERNAME = 'alzaydy901-gif';

export const fetchUserData = async (): Promise<{ user: User; repos: Repo[] }> => {
  try {
    const [userResponse, reposResponse] = await Promise.all([
      fetch(`${GITHUB_API_BASE}/users/${USERNAME}`),
      fetch(`${GITHUB_API_BASE}/users/${USERNAME}/repos?per_page=100`),
    ]);

    if (!userResponse.ok) {
      throw new Error(`Failed to fetch user data: ${userResponse.statusText}`);
    }
    if (!reposResponse.ok) {
      throw new Error(`Failed to fetch repositories: ${reposResponse.statusText}`);
    }

    const user: User = await userResponse.json();
    const repos: Repo[] = await reposResponse.json();

    // Sort repositories by stargazers_count descending to get the most popular ones
    repos.sort((a, b) => b.stargazers_count - a.stargazers_count);

    return { user, repos };
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    throw error;
  }
};
