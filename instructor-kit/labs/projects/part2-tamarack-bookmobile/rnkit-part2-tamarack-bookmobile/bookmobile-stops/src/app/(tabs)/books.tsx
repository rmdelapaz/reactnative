import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { RefreshControl } from 'react-native';

import { describeError } from '@/api/client';
import { booksQuery } from '@/api/queries';
import { AppText } from '@/components/AppText';
import { BookCard } from '@/components/BookCard';
import { EmptyState } from '@/components/EmptyState';
import { ErrorView } from '@/components/ErrorView';
import { FormField } from '@/components/FormField';
import { LoadingView } from '@/components/LoadingView';
import { Screen } from '@/components/Screen';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';

// The Books tab (GIVEN: a model for the Stops tab). What is in the collection, searchable by
// title or author, each with a way to place a hold.
export default function BooksScreen() {
  const [search, setSearch] = useState('');
  const books = useQuery(booksQuery(search));
  // Our own flag for the pull: isRefetching is also true for background refetches (Lesson 5.2)
  const [refreshing, setRefreshing] = useState(false);
  useRefreshOnFocus('books');

  async function refresh() {
    setRefreshing(true);
    await books.refetch();
    setRefreshing(false);
  }

  return (
    <Screen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}>
      <FormField
        label="Search books"
        value={search}
        onChangeText={setSearch}
        placeholder="A title or an author"
        autoCapitalize="none"
        autoCorrect={false}
        enterKeyHint="search"
      />
      {books.isPending ? (
        <LoadingView label="Loading books…" />
      ) : books.isError ? (
        <ErrorView message={describeError(books.error)} onRetry={() => books.refetch()} />
      ) : books.data.length === 0 ? (
        <EmptyState message="No books match your search." action={{ label: 'Show all books', onPress: () => setSearch('') }} />
      ) : (
        <>
          <AppText variant="muted" accessibilityLiveRegion="polite">
            {books.data.length === 1 ? '1 book' : `${books.data.length} books`}
          </AppText>
          {books.data.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </>
      )}
    </Screen>
  );
}
