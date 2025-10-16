// URL Templates Configuration
// Best Practice: Generic placeholders instead of hardcoded URLs

export interface PlatformTemplate {
  name: string;
  urlTemplate: string;
  icon: string;
  description: string;
  category: 'social' | 'direct' | 'ai' | 'video';
}

export const URL_TEMPLATES: { [key: string]: PlatformTemplate } = {
  // Social Media Platforms
  youtube: {
    name: 'YouTube',
    urlTemplate: 'https://www.youtube.com/watch?v=VIDEO_ID',
    icon: '📺',
    description: 'YouTube video URL format',
    category: 'social'
  },
  youtubeShort: {
    name: 'YouTube Short',
    urlTemplate: 'https://youtu.be/VIDEO_ID',
    icon: '📺',
    description: 'YouTube short URL format',
    category: 'social'
  },
  instagram: {
    name: 'Instagram',
    urlTemplate: 'https://www.instagram.com/p/POST_ID/',
    icon: '📱',
    description: 'Instagram post URL format',
    category: 'social'
  },
  tiktok: {
    name: 'TikTok',
    urlTemplate: 'https://www.tiktok.com/@username/video/VIDEO_ID',
    icon: '🎵',
    description: 'TikTok video URL format',
    category: 'social'
  },
  twitter: {
    name: 'Twitter/X',
    urlTemplate: 'https://twitter.com/username/status/TWEET_ID',
    icon: '🐦',
    description: 'Twitter/X post URL format',
    category: 'social'
  },
  facebook: {
    name: 'Facebook',
    urlTemplate: 'https://www.facebook.com/username/posts/POST_ID',
    icon: '📘',
    description: 'Facebook post URL format',
    category: 'social'
  },
  
  // Video Platforms
  vimeo: {
    name: 'Vimeo',
    urlTemplate: 'https://vimeo.com/VIDEO_ID',
    icon: '🎬',
    description: 'Vimeo video URL format',
    category: 'video'
  },
  dailymotion: {
    name: 'DailyMotion',
    urlTemplate: 'https://www.dailymotion.com/video/VIDEO_ID',
    icon: '📹',
    description: 'DailyMotion video URL format',
    category: 'video'
  },
  
  // AI Platforms
  artlist: {
    name: 'Artlist AI',
    urlTemplate: 'https://artlist.io/text-to-image/examples/EXAMPLE_ID/title',
    icon: '🤖',
    description: 'Artlist AI generated content URL format',
    category: 'ai'
  },
  leonardo: {
    name: 'Leonardo AI',
    urlTemplate: 'https://leonardo.ai/ai-generations/GENERATION_ID',
    icon: '🎨',
    description: 'Leonardo AI generated content URL format',
    category: 'ai'
  },
  
  // Direct Media Files
  directImage: {
    name: 'Direct Image',
    urlTemplate: 'https://example.com/image.jpg',
    icon: '🖼️',
    description: 'Direct image file URL format',
    category: 'direct'
  },
  directVideo: {
    name: 'Direct Video',
    urlTemplate: 'https://example.com/video.mp4',
    icon: '🎬',
    description: 'Direct video file URL format',
    category: 'direct'
  }
};

// Helper functions
export function getTemplatesByCategory(category: PlatformTemplate['category']): { [key: string]: PlatformTemplate } {
  return Object.fromEntries(
    Object.entries(URL_TEMPLATES).filter(([_, template]) => template.category === category)
  );
}

export function getTemplateUrl(templateKey: string): string {
  return URL_TEMPLATES[templateKey]?.urlTemplate || '';
}

export function getAllCategories(): PlatformTemplate['category'][] {
  return ['social', 'video', 'ai', 'direct'];
}
