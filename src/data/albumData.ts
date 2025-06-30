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
  '/RFD04042025.jpg': {
    id: '4',
    title: '#4',
    artist: 'RFD',
    description: '#4',
    imageUrl: '/RFD04042025.jpg'
  },
  '/RFD08112024-1.jpg': {
    id: '5',
    title: '#5',
    artist: 'RFD',
    description: '#5',
    imageUrl: '/RFD08112024-1.jpg'
  },
  '/RFD08112024.jpg': {
    id: '6',
    title: '#6',
    artist: 'RFD',
    description: '#6',
    imageUrl: '/RFD08112024.jpg'
  },
  '/RFD13122024.jpg': {
    id: '7',
    title: '#7',
    artist: 'RFD',
    description: '#7',
    imageUrl: '/RFD13122024.jpg'
  },
  '/RFD14022025.jpg': {
    id: '8',
    title: '#8',
    artist: 'RFD',
    description: '#8',
    imageUrl: '/RFD14022025.jpg'
  },
  '/RFD14032025.jpg': {
    id: '9',
    title: '#9',
    artist: 'RFD',
    description: '#9',
    imageUrl: '/RFD14032025.jpg'
  },
  '/RFD17012025.jpg': {
    id: '10',
    title: '#10',
    artist: 'RFD',
    description: '#10',
    imageUrl: '/RFD17012025.jpg'
  },
  '/RFD181024.jpg': {
    id: '11',
    title: '#11',
    artist: 'RFD',
    description: '#11',
    imageUrl: '/RFD181024.jpg'
  },
  '/RFD21032025.jpg': {
    id: '12',
    title: '#12',
    artist: 'RFD',
    description: '#12',
    imageUrl: '/RFD21032025.jpg'
  },
  '/RFD22112024.jpg': {
    id: '13',
    title: '#13',
    artist: 'RFD',
    description: '#13',
    imageUrl: '/RFD22112024.jpg'
  },
  '/RFD23082024.jpg': {
    id: '14',
    title: '#14',
    artist: 'RFD',
    description: '#14',
    imageUrl: '/RFD23082024.jpg'
  },
  '/RFD24012025.jpg': {
    id: '15',
    title: '#15',
    artist: 'RFD',
    description: '#15',
    imageUrl: '/RFD24012025.jpg'
  },
  '/RFD251024.jpg': {
    id: '16',
    title: '#16',
    artist: 'RFD',
    description: '#16',
    imageUrl: '/RFD251024.jpg'
  },
  '/RFD27092024.jpg': {
    id: '17',
    title: '#17',
    artist: 'RFD',
    description: '#17',
    imageUrl: '/RFD27092024.jpg'
  },
  '/RFD28032025.jpg': {
    id: '18',
    title: '#18',
    artist: 'RFD',
    description: '#18',
    imageUrl: '/RFD28032025.jpg'
  },
  '/RFD29112024.jpg': {
    id: '19',
    title: '#19',
    artist: 'RFD',
    description: '#19',
    imageUrl: '/RFD29112024.jpg'
  },
  '/RFD30082024.jpg': {
    id: '20',
    title: '#20',
    artist: 'RFD',
    description: '#20',
    imageUrl: '/RFD30082024.jpg'
  },
  '/RFD31012025.jpg': {
    id: '21',
    title: '#21',
    artist: 'RFD',
    description: '#21',
    imageUrl: '/RFD31012025.jpg'
  },
  '/RFD_20.06.2025.jpg': {
    id: '22',
    title: '#22',
    artist: 'RFD',
    description: '#22',
    imageUrl: '/RFD_20.06.2025.jpg'
  },
  '/16.05.2025.jpg': {
    id: '23',
    title: '#23',
    artist: 'RFD',
    description: '#23',
    imageUrl: '/16.05.2025.jpg'
  },
  '/06.06.2025.jpg': {
    id: '24',
    title: '#24',
    artist: 'RFD',
    description: '#24',
    imageUrl: '/06.06.2025.jpg'
  },
  '/25.04.2025.jpg': {
    id: '25',
    title: '#25',
    artist: 'RFD',
    description: '#25',
    imageUrl: '/25.04.2025.jpg'
  },
  '/30.05.2025.jpg': {
    id: '26',
    title: '#26',
    artist: 'RFD',
    description: '#26',
    imageUrl: '/30.05.2025.jpg'
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
