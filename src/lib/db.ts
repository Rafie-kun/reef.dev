import { CMSData, DEFAULT_CMS } from './types';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'public', 'data', 'cms.json');

function readData(): CMSData {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch {}
  return { ...DEFAULT_CMS };
}

function writeData(data: CMSData): void {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write CMS data:', e);
  }
}

export function getCMS(): CMSData {
  return readData();
}

export function updateCMS(updates: Partial<CMSData>): CMSData {
  const data = readData();
  const updated = { ...data, ...updates };
  writeData(updated);
  return updated;
}

export function updateBio(bio: string): CMSData {
  return updateCMS({ bio });
}

export function updateEmail(email: string): CMSData {
  return updateCMS({ email });
}

export function updateSocials(socials: CMSData['socials']): CMSData {
  return updateCMS({ socials });
}

export function updateFriends(friends: CMSData['friends']): CMSData {
  return updateCMS({ friends });
}

export function updateLibrary(library: CMSData['library']): CMSData {
  return updateCMS({ library });
}

export function updateProjects(projects: CMSData['projects']): CMSData {
  return updateCMS({ projects });
}

export function updateEasterEggs(easterEggs: CMSData['easterEggs']): CMSData {
  return updateCMS({ easterEggs });
}

export function updateSoundEnabled(soundEnabled: boolean): CMSData {
  return updateCMS({ soundEnabled });
}
