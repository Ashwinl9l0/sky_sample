export interface ContentItem {
  name: string;
  totalViews: {
    total: number;
    'sky-go': number;
    'now-tv': number;
    peacock: number;
  };
  prevTotalViews: {
    total: number;
    'sky-go': number;
    'now-tv': number;
    peacock: number;
  };
  description: string;
  duration: number;
  assetImage: string;
  videoImage: string;
  provider: string;
  genre: string[];
}