// components/PRStats.tsx
'use client';
import { useEffect, useState } from 'react';

interface PRStats {
  totalPRs: number;
  totalAdditions: number;
  totalDeletions: number;
  userStats: Array<{
    user: string;
    prs: number;
    additions: number;
    deletions: number;
    prDetails: Array<{
      number: number;
      title: string;
      link: string;
      additions: number;
      deletions: number;
    }>;
  }>;
  _refreshedToken?: string;
}

interface PRStatsProps {
  apiEndpoint?: string;
  owner: string;
  repo: string;
  startDate: string;
  endDate: string;
}

export default function PRStats({
  apiEndpoint = 'https://api.github.com',
  owner,
  repo,
  startDate,
  endDate
}: PRStatsProps) {
  const [stats, setStats] = useState<PRStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Get the GitHub token and refresh token from localStorage
        const githubToken = localStorage.getItem('oauth_provider_token');
        const refreshToken = localStorage.getItem('oauth_provider_refresh_token');
        if (!githubToken && !refreshToken) {
          setError('GitHub token not found. Please log in again.');
        }
        // Prepare headers
        const headers: HeadersInit = {};
        headers['Authorization'] = `Bearer ${githubToken}`;
        headers['X-Refresh-Token'] = refreshToken ?? '';
      
        setLoading(true);
        const response = await fetch('/stats?' + new URLSearchParams({
          apiEndpoint,
          owner,
          repo,
          startDate,
          endDate
        }), {
          headers
        });
        setLoading(false);
        
        if (!response.ok) {
          setError(`API error: ${response.status} ${response.statusText}`);
          return;
        }
        
        const data: PRStats = await response.json();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching PR stats:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setStats(null);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [apiEndpoint, owner, repo, startDate, endDate]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
      <p className="text-lg font-medium text-gray-700">Loading PR statistics...</p>
    </div>
  );
  if (error) return <div className="bg-red-100 text-red-700 p-4 rounded-md border border-red-300">Error: {error}</div>;
  if (!stats || !stats.userStats) return <p className="p-4 bg-yellow-50 text-yellow-700 rounded-md border border-yellow-200">No data available.</p>;

  return (
    <div>
      <div className="font-bold flex flex-col mb-4">
        <h1 className="text-2xl">Pull Request Statistics</h1>
        <div className="flex space-x-6 mt-2">
          <p>Total Merged PRs: {stats.totalPRs}</p>
          <p>Total Additions: {stats.totalAdditions}</p>
          <p>Total Deletions: {stats.totalDeletions}</p>
        </div>
      </div>

      {stats.userStats.map((userStat) => (
        <div key={userStat.user}>
          <h3 className="text-xl font-bold">{userStat.user}: {userStat.prs} PRs, +{userStat.additions}, -{userStat.deletions}</h3>
          <ul className="pl-8 mt-2 space-y-1 list-disc">
            {userStat.prDetails.map((pr) => (
              <li key={pr.number}>
                <a href={pr.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  [PR #{pr.number}] {pr.title}
                </a> (+{pr.additions}, -{pr.deletions})
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}