import { axiosClient } from "@core";

const GITHUB_USER = "NuhDemir";
const GITHUB_API = `https://api.github.com/users/${GITHUB_USER}`;
const GITHUB_REPOS_API = `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`;

export const fetchAboutContent = async (signal) => {
  try {
    const { data } = await axiosClient.get("/about", { signal });
    return data?.isActive !== false ? data : null;
  } catch {
    return null;
  }
};

export const fetchGitHubStats = async (signal) => {
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(GITHUB_API, { signal }),
      fetch(GITHUB_REPOS_API, { signal }),
    ]);

    let repos = 0, followers = 0, stars = 0, avatar = null;
    let topLang = null;

    if (userRes.ok) {
      const u = await userRes.json();
      repos = u.public_repos ?? 0;
      followers = u.followers ?? 0;
      avatar = u.avatar_url ?? null;
    }

    if (reposRes.ok) {
      const repoList = await reposRes.json();
      stars = repoList.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);

      const langCount = {};
      repoList.forEach((r) => {
        if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1;
      });
      const languages = Object.entries(langCount)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);
      topLang = languages[0]?.name || null;

      return { repos, followers, stars, avatar, topLang, languages };
    }

    return { repos, followers, stars, avatar, topLang };
  } catch {
    return null;
  }
};

export const fetchSoundCloudStats = async (signal) => {
  try {
    const res = await fetch(
      `https://soundcloud.com/nuh-demir-210070335/sets/playlist`,
      { signal }
    );
    const html = await res.text();

    const followerMatch = html.match(/"followers_count":(\d+)/);
    const trackMatch = html.match(/"track_count":(\d+)/);

    return {
      followers: followerMatch ? parseInt(followerMatch[1]) : 0,
      tracks: trackMatch ? parseInt(trackMatch[1]) : 0,
    };
  } catch {
    return null;
  }
};
