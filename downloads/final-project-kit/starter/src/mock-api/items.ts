// The starter's example resource, /items: its routes and its rules
import { z } from 'zod';

import { newItemBodySchema } from '@/api/schemas';
import type { Item } from '@/api/types';
import { db, nextId } from '@/mock-api/db';
import { answer, type MockResponse, problem, type ResourceRequest } from '@/mock-api/respond';
import { isItemStatus } from '@/utils/labels';

export function handleItems({ method, id, query, body }: ResourceRequest): MockResponse {
  // GET /items, GET /items?status=open
  if (id === undefined && method === 'GET') {
    const { status } = query;
    if (status !== undefined && !isItemStatus(status)) {
      return problem(400, 'bad_request', 'status must be open or done.');
    }
    return answer(200, db.items.filter((item) => status === undefined || item.status === status));
  }

  // POST /items
  if (id === undefined && method === 'POST') {
    const parsed = newItemBodySchema.safeParse(body);
    if (!parsed.success) {
      const { fieldErrors } = z.flattenError(parsed.error);
      return problem(400, 'bad_request', 'Some fields need fixing.', fieldErrors);
    }
    // A rule only the server can check: it is the one that knows every item
    const name = parsed.data.name.toLowerCase();
    if (db.items.some((item) => item.name.toLowerCase() === name)) {
      const message = `There is already an item called "${parsed.data.name}".`;
      return problem(409, 'conflict', message, { name: [message] });
    }
    const item: Item = {
      id: nextId(),
      ...parsed.data,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    db.items.unshift(item); // newest first, like the sample data
    return answer(201, item);
  }

  const item = db.items.find((candidate) => candidate.id === id);
  if (id === undefined || item === undefined) {
    return id === undefined
      ? problem(400, 'bad_request', `${method} /items is not supported.`)
      : problem(404, 'not_found', 'There is no item with this id.');
  }

  // GET /items/:id
  if (method === 'GET') {
    return answer(200, item);
  }

  // PATCH /items/:id with { status }
  if (method === 'PATCH') {
    const status: unknown =
      typeof body === 'object' && body !== null && 'status' in body ? body.status : undefined;
    if (!isItemStatus(status)) {
      return problem(400, 'bad_request', 'status must be open or done.', {
        status: ['Choose open or done.'],
      });
    }
    item.status = status;
    return answer(200, item);
  }

  return problem(400, 'bad_request', `${method} /items/${id} is not supported.`);
}
