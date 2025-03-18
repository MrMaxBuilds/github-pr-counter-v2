// src/app/stats/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { getMergedPRStats } from '@/utils/github/get-prs';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const apiEndpoint = url.searchParams.get('apiEndpoint');
  const owner = url.searchParams.get('owner');
  const repo = url.searchParams.get('repo');
  const startDate = url.searchParams.get('startDate');
  const endDate = url.searchParams.get('endDate');

  if (!apiEndpoint || !owner || !repo || !startDate || !endDate) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  const authHeader = request.headers.get('Authorization');
  let githubToken = authHeader ? authHeader.replace('Bearer ', '') : null;
  
  // Check for refresh token
  const refreshToken = request.headers.get('X-Refresh-Token');

  // TODO Handle refresh token
  
  // if ((!githubToken || refreshToken) && refreshToken) {
  //   try {
  //     // Create Supabase client
  //     const supabase = await createClient();
      
  //     // Attempt to refresh the session using the refresh token
  //     const { data, error } = await supabase.auth.refreshSession({
  //       refresh_token: refreshToken,
  //     });
      
  //     if (error) throw error;
      
  //     if (data.session && data.session.provider_token) {
  //       // Get the new provider token
  //       refreshedToken = data.session.provider_token;
  //       // Use the new token
  //       githubToken = refreshedToken;
  //     }
  //   } catch (error) {
  //     console.error('Error refreshing token:', error);
  //     // Continue with original token if refresh fails
  //   }
  // }
  
  if (!githubToken) {
    return NextResponse.json({ error: 'No GitHub token provided in the Authorization header' }, { status: 401 });
  }

  try {
    const stats = await getMergedPRStats(
      apiEndpoint,
      owner,
      repo,
      githubToken,
      startDate,
      endDate
    );
    
    // If we got a refreshed token, include it in the response
    // if (refreshedToken) {
    //   return NextResponse.json({
    //     ...stats,
    //     _refreshedToken: refreshedToken
    //   });
    // }
    console.log('stats', stats);
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching PR stats:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}