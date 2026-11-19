import { useQuery } from '@tanstack/react-query';
import { Text, View } from 'react-native';

import { favoritesQuery } from './queries';

// The volunteer's favorite beaches (given): read from the phone through the query cache
export function FavoriteList() {
  const favorites = useQuery(favoritesQuery());

  if (favorites.data === undefined) {
    return <Text>{favorites.isError ? 'Could not open your favorites.' : 'Opening your favorites…'}</Text>;
  }
  if (favorites.data.length === 0) {
    return <Text>No favorites yet.</Text>;
  }
  return (
    <View>
      {favorites.data.map((favorite) => (
        <Text key={favorite.id}>★ {favorite.name}</Text>
      ))}
    </View>
  );
}
