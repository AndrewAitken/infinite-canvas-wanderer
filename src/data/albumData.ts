
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
    title: 'RFD Session',
    artist: 'Radio Free Dance',
    description: 'Уникальная танцевальная сессия, которая объединяет электронные ритмы с живыми выступлениями. Это музыкальное путешествие через различные жанры электронной музыки, создающее атмосферу свободы и движения.',
    imageUrl: '/RFD 06.09.2024.jpg'
  },
  '/RFD01111024.jpg': {
    id: '2',
    title: 'Frequency Waves',
    artist: 'RFD Collective',
    description: 'Экспериментальный альбом, исследующий границы звука и ритма. Каждый трек представляет собой уникальное звуковое путешествие, сочетающее традиционные инструменты с современными электронными элементами.',
    imageUrl: '/RFD01111024.jpg'
  },
  '/RFD03102024.jpg': {
    id: '3',
    title: 'Urban Echoes',
    artist: 'City Sounds',
    description: 'Альбом, вдохновленный звуками города и его ритмами. Композиции отражают пульс современной жизни, от тихих утренних мелодий до энергичных ночных битов.',
    imageUrl: '/RFD03102024.jpg'
  },
  '/16.05.2025.jpg': {
    id: '4',
    title: 'Future Memories',
    artist: 'Time Capsule',
    description: 'Концептуальный альбом о связи прошлого и будущего через музыку. Каждая композиция рассказывает историю о том, как воспоминания формируют наше будущее.',
    imageUrl: '/16.05.2025.jpg'
  },
  '/RFD22112024.jpg': {
    id: '5',
    title: 'Late Night Sessions',
    artist: 'Midnight Collective',
    description: 'Интимная коллекция треков, записанных в поздние ночные часы. Атмосферная музыка для размышлений и глубокого погружения в себя.',
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
  return albumData[imageUrl] || {
    id: 'unknown',
    title: 'RFD Archive',
    artist: 'Radio Free Dance',
    description: 'Архивная запись из коллекции Radio Free Dance. Эта музыка представляет собой уникальное сочетание электронных и живых элементов, создавая неповторимую атмосферу танца и свободы движения.',
    imageUrl
  };
};
