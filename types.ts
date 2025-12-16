export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  groundingMetadata?: GroundingMetadata;
  images?: string[];
  isLoading?: boolean;
}

export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
      reviewSnippets?: {
        content: string;
        reviewAuthor: string;
      }[];
    }[];
  };
}

export enum ImageSize {
  Size1K = '1K',
  Size2K = '2K',
  Size4K = '4K',
}

export enum AspectRatio {
  Square = '1:1',
  Portrait34 = '3:4',
  Portrait916 = '9:16',
  Landscape43 = '4:3',
  Landscape169 = '16:9',
  Landscape219 = '21:9',
}
