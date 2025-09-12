export interface Views {
  total: number;
  "sky-go": number;
  "now-tv": number;
  peacock: number;
}

export interface Movie {
  name: string;
  totalViews: Views;
  prevTotalViews: Views;
  description: string;
  duration: number;
  assetImage: string;
  videoImage: string;
  provider: string;
  genre: string[];
}

export type RouteParams = {
  id: string;
};
export interface GenreCardProps {
  title: string;
  items: Movie[];
}
