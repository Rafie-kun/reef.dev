export interface DiscordProfile {
  username: string;
  globalName: string;
  avatarUrl: string;
}

export interface LanyardData {
  discord_status: 'online' | 'idle' | 'dnd' | 'offline';
  discord_user: {
    id: string;
    username: string;
    avatar: string;
    discriminator: string;
    global_name: string;
  };
  activities: Array<{
    id: string;
    name: string;
    type: number;
    state?: string;
    details?: string;
    timestamps?: { start?: number; end?: number };
    assets?: {
      large_image?: string;
      large_text?: string;
      small_image?: string;
      small_text?: string;
    };
  }>;
  spotify?: {
    song: string;
    artist: string;
    album: string;
    album_art_url: string;
    timestamps: { start: number; end: number };
  };
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
}

export interface GitHubUser {
  login: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
}

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: string;
}

export interface FriendBadge {
  id: string;
  name: string;
  url: string;
  imageUrl: string;
}

export interface LibraryItem {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  link: string;
  tab: 'games' | 'music' | 'projects' | 'reading';
  tags?: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  techStack: string[];
  liveUrl: string;
  repoUrl: string;
}

export interface CMSEasterEgg {
  id: string;
  phrase: string;
}

export interface CMSData {
  bio: string;
  email: string;
  socials: SocialLink[];
  friends: FriendBadge[];
  library: LibraryItem[];
  projects: Project[];
  easterEggs: CMSEasterEgg[];
  soundEnabled: boolean;
}

export const DEFAULT_CMS: CMSData = {
  bio: "Hey, I'm Reef. I build things, break things, and occasionally sleep. Welcome to my little corner of the internet.",
  email: "reef@example.com",
  socials: [
    { id: 'discord', name: 'Discord', url: 'https://discord.com/users/744808879036170272', icon: 'mc-discord' },
    { id: 'github', name: 'GitHub', url: 'https://github.com/Rafie-kun', icon: 'mc-github' },
    { id: 'spotify', name: 'Spotify', url: 'https://open.spotify.com/user/reef', icon: 'mc-spotify' },
    { id: 'instagram', name: 'Instagram', url: '', icon: 'mc-instagram' },
    { id: 'twitter', name: 'Twitter/X', url: '', icon: 'mc-twitter' },
  ],
  friends: Array.from({ length: 6 }, (_, i) => ({
    id: `placeholder-${i}`,
    name: '???',
    url: '#',
    imageUrl: '/badges/placeholder.png',
  })),
  library: [],
  projects: [],
  easterEggs: [
    { id: '1', phrase: 'Also try touching grass!' },
    { id: '2', phrase: 'Also try sleeping!' },
    { id: '3', phrase: 'Also try GitHub!' },
    { id: '4', phrase: 'Also try talking to Reef!' },
    { id: '5', phrase: 'Also try Limbo!' },
  ],
  soundEnabled: true,
};
