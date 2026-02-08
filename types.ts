
export enum Platform {
  YOUTUBE = 'youtube',
  INSTAGRAM = 'instagram',
  TIKTOK = 'tiktok',
  FACEBOOK = 'facebook',
  TWITTER = 'twitter',
  PINTEREST = 'pinterest',
  SNACKVIDEO = 'snackvideo',
  LIKEE = 'likee',
  SOUNDCLOUD = 'soundcloud',
  UNKNOWN = 'unknown'
}

export enum MediaType {
  VIDEO = 'video',
  AUDIO = 'audio',
  IMAGE = 'image',
  THUMBNAIL = 'thumbnail'
}

export interface MediaQuality {
  label: string;
  value: string;
  filesize?: string;
}

export interface MediaMetadata {
  id: string;
  url: string;
  platform: Platform;
  title: string;
  thumbnail: string;
  duration?: string;
  author: string;
  availableTypes: MediaType[];
  videoQualities: MediaQuality[];
  audioQualities: MediaQuality[];
}

export interface DownloadHistoryItem {
  id: string;
  title: string;
  platform: Platform;
  timestamp: number;
  url: string;
  type: MediaType;
  status: 'completed' | 'failed' | 'processing';
}

export interface AdminStats {
  totalDownloads: number;
  activeUsers: number;
  storageUsed: string;
  platformsActive: string[];
}
