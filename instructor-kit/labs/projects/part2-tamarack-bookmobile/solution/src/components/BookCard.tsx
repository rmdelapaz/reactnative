import { Link } from 'expo-router';

import type { Audience, Book } from '@/api/types';
import { AppText } from '@/components/AppText';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';

export const audienceLabels: Record<Audience, string> = {
  children: 'Children',
  teens: 'Teens',
  adults: 'Adults',
};

// One book: title, author, who it is for, whether it is on the van, and a way to hold it
export function BookCard({ book }: { book: Book }) {
  return (
    <Card>
      <AppText variant="heading" accessibilityRole="header">
        {book.title}
      </AppText>
      <AppText>
        {book.author} · {audienceLabels[book.audience]}
      </AppText>
      {book.onVan ? (
        <Badge label="On the van" tone="success" />
      ) : (
        <AppText variant="muted">At the branch: a hold brings it on the next trip.</AppText>
      )}
      <Link href={{ pathname: '/hold/[bookId]', params: { bookId: book.id } }} asChild>
        <Button label="Place a hold" accessibilityLabel={`Place a hold on ${book.title}`} />
      </Link>
    </Card>
  );
}
