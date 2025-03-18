/**
 * Fetches statistics about merged pull requests in a GitHub repository within a date range.
 * @param apiEndpoint - GitHub API endpoint (e.g., 'https://api.github.com' or your Enterprise Server URL)
 * @param owner - Repository owner (organization or user)
 * @param repo - Repository name
 * @param token - GitHub Personal Access Token with repo access
 * @param startDate - Start date in 'YYYY-MM-DD' format
 * @param endDate - End date in 'YYYY-MM-DD' format
 * @returns Promise resolving to total and per-user PR statistics
 */
export async function getMergedPRStats(
    apiEndpoint: string,
    owner: string,
    repo: string,
    token: string,
    startDate: string,
    endDate: string
  ): Promise<{
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
  }> {
    const query = `repo:${owner}/${repo} is:pr is:merged merged:${startDate}..${endDate}`;
    let url = `${apiEndpoint}/search/issues?q=${encodeURIComponent(query)}&per_page=100`;
  
    let totalPRs = 0;
    let totalAdditions = 0;
    let totalDeletions = 0;
    const userTotals: { [user: string]: { prs: number; additions: number; deletions: number } } = {};
    const userPRs: { [user: string]: Array<{ number: number; title: string; link: string; additions: number; deletions: number }> } = {};
  
    // Headers for authentication and API version
    const headers = {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    };
  
    // Helper function to parse the 'Link' header for pagination
    function getNextLink(linkHeader: string | null): string | null {
      if (!linkHeader) return null;
      const links = linkHeader.split(',');
      for (const link of links) {
        const [urlPart, relPart] = link.split(';');
        if (relPart?.trim() === 'rel="next"') {
          return urlPart.trim().slice(1, -1); // Remove < and >
        }
      }
      return null;
    }
  
    // Fetch all pages of search results
    while (true) {
      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error(`Failed to fetch search results: ${response}`);
      }
      const data = await response.json();
      const items = data.items || [];
  
      // Process each PR in the current page
      for (const item of items) {
        const prUrl = item.pull_request.url;
        const prResponse = await fetch(prUrl, { headers });
        if (!prResponse.ok) {
          console.error(`Failed to fetch PR details for ${prUrl}: ${prResponse.status}`);
          continue;
        }
        const prData = await prResponse.json();
        const additions = prData.additions || 0;
        const deletions = prData.deletions || 0;
  
        const user = item.user.login;
  
        // Update overall totals
        totalPRs += 1;
        totalAdditions += additions;
        totalDeletions += deletions;
  
        // Initialize user data if not present
        if (!userTotals[user]) {
          userTotals[user] = { prs: 0, additions: 0, deletions: 0 };
          userPRs[user] = [];
        }
  
        // Update user-specific totals and PR details
        userTotals[user].prs += 1;
        userTotals[user].additions += additions;
        userTotals[user].deletions += deletions;
        userPRs[user].push({
          number: item.number,
          title: item.title,
          link: item.html_url,
          additions,
          deletions
        });
      }
  
      // Check for next page
      const linkHeader = response.headers.get('Link');
      const nextUrl = getNextLink(linkHeader);
      if (!nextUrl) break;
      url = nextUrl;
    }
  
    // Convert user data to sorted array
    const userStats = Object.entries(userTotals)
      .map(([user, totals]) => ({
        user,
        ...totals,
        prDetails: userPRs[user]
      }))
      .sort((a, b) => b.prs - a.prs);
  
    // Return aggregated statistics
    return {
      totalPRs,
      totalAdditions,
      totalDeletions,
      userStats
    };
  }