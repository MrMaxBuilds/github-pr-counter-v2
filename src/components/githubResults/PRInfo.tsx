'use client';
import { useState } from 'react';
import PRForm from '@/components/githubResults/PRForm';
import PRStats from '@/components/githubResults/PRStats';

export default function PRInfo() {
  const [formData, setFormData] = useState<{
    apiEndpoint: string;
    owner: string;
    repo: string;
    startDate: string;
    endDate: string;
  } | null>(null);

  const handleFormSubmit = (data: {
    apiEndpoint: string;
    owner: string;
    repo: string;
    startDate: string;
    endDate: string;
  }) => {
    setFormData(data);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full p-6">
      <div className="md:w-1/3 p-4 border rounded-lg shadow-sm">
        <PRForm onSubmit={handleFormSubmit} />
      </div>
      {formData && (
        <div className="md:w-2/3 p-4 border rounded-lg shadow-sm">
          <PRStats
            apiEndpoint={formData.apiEndpoint}
            owner={formData.owner}
            repo={formData.repo}
            startDate={formData.startDate}
            endDate={formData.endDate}
          />
        </div>
      )}
    </div>
  );
}