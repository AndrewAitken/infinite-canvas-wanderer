
export interface Album {
  id: string;
  title: string;
  artist: string;
  description: string;
  imageUrl: string;
}

export const albumData: Record<string, Album> = {
  '/lovable-uploads/c3f650ce-0d59-43cc-8e26-8c669e6de4c1.png': {
    id: '1',
    title: 'DAMN.',
    artist: 'Kendrick Lamar',
    description: 'Классический альбом, который сочетает в себе глубокие лирические размышления и инновационное звучание. Это произведение искусства, которое затрагивает важные социальные темы и демонстрирует невероятное мастерство исполнителя.',
    imageUrl: '/lovable-uploads/c3f650ce-0d59-43cc-8e26-8c669e6de4c1.png'
  },
  '/lovable-uploads/d431adb0-edeb-4ea4-8a10-31c1f0ce5a8b.png': {
    id: '2',
    title: 'The Dark Side of the Moon',
    artist: 'Pink Floyd',
    description: 'Легендарный альбом, который изменил представление о том, каким может быть рок-музыка. Концептуальное произведение, исследующее темы времени, смерти и человеческого опыта через призму психоделического звучания.',
    imageUrl: '/lovable-uploads/d431adb0-edeb-4ea4-8a10-31c1f0ce5a8b.png'
  },
  '/lovable-uploads/821a0507-d6b1-4abd-8c07-3aa48ccdd9a6.png': {
    id: '3',
    title: 'Memories',
    artist: 'Various Artists',
    description: 'Коллекция незабываемых треков, которые переносят слушателя в другое время и место. Каждая композиция - это история, рассказанная через музыку, создающая атмосферу ностальгии и глубоких эмоций.',
    imageUrl: '/lovable-uploads/821a0507-d6b1-4abd-8c07-3aa48ccdd9a6.png'
  }
};

// Fallback album for covers not in the data
export const getAlbumData = (imageUrl: string): Album => {
  return albumData[imageUrl] || {
    id: 'unknown',
    title: 'Неизвестный альбом',
    artist: 'Неизвестный исполнитель',
    description: 'Это удивительное музыкальное произведение, которое демонстрирует уникальный стиль и творческий подход. Альбом сочетает в себе различные музыкальные направления и создает неповторимую атмосферу, погружая слушателя в мир звуков и эмоций.',
    imageUrl
  };
};
