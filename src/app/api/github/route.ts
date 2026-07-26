export async function GET() {
  try {
    const headers: Record<string, string> = {};
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const [userRes, reposRes] = await Promise.all([
      fetch('https://api.github.com/users/Rafie-kun', { headers, next: { revalidate: 300 } }),
      fetch('https://api.github.com/users/Rafie-kun/repos?sort=updated&per_page=20', { headers, next: { revalidate: 300 } }),
    ]);
    if (!userRes.ok || !reposRes.ok) throw new Error('GitHub API error');
    const user = await userRes.json();
    const repos = await reposRes.json();
    const totalStars = repos.reduce((sum: number, r: any) => sum + (r.stargazers_count || 0), 0);
    return Response.json({
      user: { login: user.login, avatar_url: user.avatar_url, public_repos: user.public_repos, followers: user.followers },
      repos: repos.map((r: any) => ({
        id: r.id, name: r.name, description: r.description, html_url: r.html_url,
        language: r.language, stargazers_count: r.stargazers_count, forks_count: r.forks_count,
      })),
      totalStars,
    });
  } catch {
    return Response.json({ error: 'Failed to fetch GitHub data' }, { status: 500 });
  }
}
