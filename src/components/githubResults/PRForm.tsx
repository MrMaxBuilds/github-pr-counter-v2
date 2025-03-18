'use client';
import { useState } from 'react';

interface PRFormProps {
  onSubmit: (data: {
    apiEndpoint: string;
    owner: string;
    repo: string;
    startDate: string;
    endDate: string;
  }) => void;
}

export default function PRForm({ onSubmit }: PRFormProps) {
  const [apiEndpoint, setApiEndpoint] = useState('https://api.github.com');
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  
  // Get today's date for the start date
  const today = new Date();
  const formattedToday = today.toISOString().split('T')[0];
  
  // Get date from two weeks ago for the end date
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(today.getDate() - 14);
  const formattedTwoWeeksAgo = twoWeeksAgo.toISOString().split('T')[0];
  
  const [startDate, setStartDate] = useState(formattedTwoWeeksAgo);
  const [endDate, setEndDate] = useState(formattedToday);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ apiEndpoint, owner, repo, startDate, endDate });
  };

  return (
    <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
      <div>
        <label htmlFor="apiEndpoint">API Endpoint:</label>
        <input
          type="text"
          id="apiEndpoint"
          value={apiEndpoint}
          onChange={(e) => setApiEndpoint(e.target.value)}
          required
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md p-2 w-full"
        />
      </div>
      <div>
        <label htmlFor="owner">Owner:</label>
        <input
          type="text"
          id="owner"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          required
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md p-2 w-full"
        />
      </div>
      <div>
        <label htmlFor="repo">Repository:</label>
        <input
          type="text"
          id="repo"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          required
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md p-2 w-full"
        />
      </div>
      <div>
        <label htmlFor="startDate">Start Date (YYYY-MM-DD):</label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md p-2 w-full"
        />
      </div>
      <div>
        <label htmlFor="endDate">End Date (YYYY-MM-DD):</label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md p-2 w-full"
        />
      </div>
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Fetch PR Stats</button>
    </form>
  );
}