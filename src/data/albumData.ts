
export interface Album {
  id: string;
  title: string;
  artist: string;
  description: string;
  imageUrl: string;
}

export const albumData: Record<string, Album> = {
  '/RFD 06.09.2024.jpg': {
    id: '1',
    title: '#1',
    artist: 'RFD',
    description: '#1',
    imageUrl: '/RFD 06.09.2024.jpg'
  },
  '/RFD01111024.jpg': {
    id: '2',
    title: '#2',
    artist: 'RFD',
    description: '#2',
    imageUrl: '/RFD01111024.jpg'
  },
  '/RFD03102024.jpg': {
    id: '3',
    title: '#3',
    artist: 'RFD',
    description: '#3',
    imageUrl: '/RFD03102024.jpg'
  },
  '/16.05.2025.jpg': {
    id: '4',
    title: '#4',
    artist: 'RFD',
    description: '#4',
    imageUrl: '/16.05.2025.jpg'
  },
  '/RFD22112024.jpg': {
    id: '5',
    title: '#5',
    artist: 'RFD',
    description: '#5',
    imageUrl: '/RFD22112024.jpg'
  }
};

// Get all albums as an array for navigation
export const getAllAlbums = (): Album[] => {
  return Object.values(albumData);
};

// Get album by index for navigation
export const getAlbumByIndex = (index: number): Album | null => {
  const albums = getAllAlbums();
  if (index < 0 || index >= albums.length) return null;
  return albums[index];
};

// Get index of album by imageUrl
export const getAlbumIndex = (imageUrl: string): number => {
  const albums = getAllAlbums();
  return albums.findIndex(album => album.imageUrl === imageUrl);
};

// Get next album index (circular)
export const getNextAlbumIndex = (currentIndex: number): number => {
  const albums = getAllAlbums();
  return (currentIndex + 1) % albums.length;
};

// Get previous album index (circular)
export const getPreviousAlbumIndex = (currentIndex: number): number => {
  const albums = getAllAlbums();
  return currentIndex === 0 ? albums.length - 1 : currentIndex - 1;
};

// Fallback album for covers not in the data
export const getAlbumData = (imageUrl: string): Album => {
  const existingAlbum = albumData[imageUrl];
  if (existingAlbum) {
    return existingAlbum;
  }
  
  // Generate a simple number for unknown albums based on hash
  const hash = Math.abs(imageUrl.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0));
  const albumNumber = (hash % 999) + 1;
  
  return {
    id: 'unknown',
    title: `#${albumNumber}`,
    artist: 'RFD',
    description: `#${albumNumber}`,
    imageUrl
  };
};
