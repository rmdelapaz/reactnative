// Changes (Lesson 5.2): a mutationOptions factory per kind of change. Each says what to send and
// which cached answers are out of date afterwards.
import { mutationOptions } from '@tanstack/react-query';

import { patchItem, postItem } from '@/api/client';
import { itemKeys, queryClient } from '@/api/queries';
import type { ItemStatus, NewItem } from '@/api/types';

// Returning the promise keeps the mutation pending until the screens have the new answers.
// onSettled, not onSuccess: after a "no" from the server the screens need the truth too.
function refreshItems() {
  return queryClient.invalidateQueries({ queryKey: itemKeys.all });
}

export function createItemMutation() {
  return mutationOptions({
    mutationFn: (item: NewItem) => postItem(item),
    onSettled: refreshItems,
  });
}

export function changeStatusMutation(id: string) {
  return mutationOptions({
    mutationFn: (status: ItemStatus) => patchItem(id, { status }),
    onSettled: refreshItems,
  });
}
