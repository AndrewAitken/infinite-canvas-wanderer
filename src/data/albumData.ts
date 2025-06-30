
export interface Album {
  id: string;
  title: string;
  artist: string;
  description: string;
  imageUrl: string;
}

export const albumData: Record<string, Album> = {
  '/covers/RFD 06.09.2024.jpg': {
    id: '1',
    title: '#1',
    artist: 'RFD',
    description: '#1',
    imageUrl: '/covers/RFD 06.09.2024.jpg'
  },
  '/covers/RFD01111024.jpg': {
    id: '2',
    title: '#2',
    artist: 'RFD',
    description: '#2',
    imageUrl: '/covers/RFD01111024.jpg'
  },
  '/covers/RFD03102024.jpg': {
    id: '3',
    title: '#3',
    artist: 'RFD',
    description: '#3',
    imageUrl: '/covers/RFD03102024.jpg'
  },
  '/covers/16.05.2025.jpg': {
    id: '4',
    title: '#4',
    artist: 'RFD',
    description: '#4',
    imageUrl: '/covers/16.05.2025.jpg'
  },
  '/covers/RFD22112024.jpg': {
    id: '5',
    title: '#5',
    artist: 'RFD',
    description: '#5',
    imageUrl: '/covers/RFD22112024.jpg'
  },
  '/covers/06.06.2025.jpg': {
    id: '6',
    title: '#6',
    artist: 'RFD',
    description: '#6',
    imageUrl: '/covers/06.06.2025.jpg'
  },
  '/covers/2.jpg': {
    id: '7',
    title: '#7',
    artist: 'RFD',
    description: '#7',
    imageUrl: '/covers/2.jpg'
  },
  '/covers/25.04.2025.jpg': {
    id: '8',
    title: '#8',
    artist: 'RFD',
    description: '#8',
    imageUrl: '/covers/25.04.2025.jpg'
  },
  '/covers/30.05.2025.jpg': {
    id: '9',
    title: '#9',
    artist: 'RFD',
    description: '#9',
    imageUrl: '/covers/30.05.2025.jpg'
  },
  '/covers/Frame 21.jpg': {
    id: '10',
    title: '#10',
    artist: 'RFD',
    description: '#10',
    imageUrl: '/covers/Frame 21.jpg'
  },
  '/covers/Frame 22.jpg': {
    id: '11',
    title: '#11',
    artist: 'RFD',
    description: '#11',
    imageUrl: '/covers/Frame 22.jpg'
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
