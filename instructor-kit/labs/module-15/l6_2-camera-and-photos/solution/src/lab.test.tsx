// Tests (do not edit): npm test
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ImagePickerAsset, ImagePickerResult } from 'expo-image-picker';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import { addPicked } from './addPicked';
import { API } from './api';
import { loadFoundQueue, QUEUE_KEY, useFoundQueue } from './foundQueue';
import { keptPhotos, savePhoto } from './photoFiles';
import { sendWaitingItems } from './sendFound';
import type { FoundItem, ItemPhoto } from './types';

// No phone under Jest: AsyncStorage's own stand-in keeps the saved values in memory
jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const MB = 1024 * 1024;
const picked = (assets: ImagePickerAsset[]): ImagePickerResult => ({ canceled: false, assets });
const asset = (name: string, mimeType: string, fileSize: number): ImagePickerAsset => ({
  uri: `file:///cache/ImagePicker/${name}`,
  width: 1600,
  height: 1200,
  type: 'image',
  mimeType,
  fileSize,
});

test('Task 1: closing the picker changes nothing', () => {
  const before: ItemPhoto[] = [{ uri: 'file:///a.jpg', type: 'image/jpeg', photoId: null }];
  expect(addPicked({ canceled: true, assets: null }, before)).toEqual({ photos: before, problem: null });
});

test('Task 1: JPEG, PNG and WebP photos of 5 MB or less are added, with their kind and no id yet', () => {
  const result = addPicked(
    picked([asset('a.jpg', 'image/jpeg', 2 * MB), asset('b.png', 'image/png', 5 * MB)]),
    [],
  );
  expect(result.photos).toEqual([
    { uri: 'file:///cache/ImagePicker/a.jpg', type: 'image/jpeg', photoId: null },
    { uri: 'file:///cache/ImagePicker/b.png', type: 'image/png', photoId: null },
  ]);
  expect(result.problem).toBeNull();
});

test('Task 1: a HEIC, a GIF and a 9 MB PNG are not added, and one sentence says why', () => {
  const result = addPicked(
    picked([
      asset('c.heic', 'image/heic', 3 * MB),
      asset('d.gif', 'image/gif', 1 * MB),
      asset('e.png', 'image/png', 9 * MB),
    ]),
    [],
  );
  expect(result.photos).toEqual([]);
  expect(result.problem).toBe(
    '3 photos were not added: the server takes JPEG, PNG or WebP photos of 5 MB or smaller.',
  );
});

test('Task 1: never more than three photos, and "One photo was" for one', () => {
  const two: ItemPhoto[] = [
    { uri: 'file:///a.jpg', type: 'image/jpeg', photoId: null },
    { uri: 'file:///b.jpg', type: 'image/jpeg', photoId: null },
  ];
  const result = addPicked(
    picked([asset('f.gif', 'image/gif', MB), asset('g.jpg', 'image/jpeg', MB), asset('h.jpg', 'image/jpeg', MB)]),
    two,
  );
  expect(result.photos).toHaveLength(2); // one place left: the GIF took it, and was refused
  expect(result.problem).toBe(
    'One photo was not added: the server takes JPEG, PNG or WebP photos of 5 MB or smaller.',
  );
  expect(addPicked(picked([asset('g.jpg', 'image/jpeg', MB), asset('h.jpg', 'image/jpeg', MB)]), two).photos).toHaveLength(3);
});

// The practice server: POST /api/photos answers like shoreline-api's; POST /api/found-items saves an
// item once per clientId (a second try with the same clientId gets 200 and the saved item)
const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const uploads: { type: string; bytes: number }[] = [];
const sent: { clientId: string; photoIds: string[] }[] = [];
const saved = new Set<string>();
const server = setupServer(
  http.post(`${API}/api/photos`, async ({ request }) => {
    const type = (request.headers.get('content-type') ?? '').split(';')[0].trim();
    if (type === 'multipart/form-data') {
      const form = (await request.formData()) as unknown as { get(name: string): unknown };
      const photo = form.get('photo');
      if (!(photo instanceof Blob)) {
        return HttpResponse.json(
          {
            error: 'validation_failed',
            message: 'Some fields need attention.',
            fieldErrors: { photo: ['Attach an image in a field named photo.'] },
          },
          { status: 400 },
        );
      }
    }
    if (!PHOTO_TYPES.includes(type)) {
      return HttpResponse.json(
        { error: 'unsupported_media_type', message: 'Photos must be JPEG, PNG or WebP images.' },
        { status: 415 },
      );
    }
    uploads.push({ type, bytes: (await request.arrayBuffer()).byteLength });
    const id = `p${uploads.length}`;
    return HttpResponse.json({ id, url: `${API}/api/photos/${id}`, contentType: type }, { status: 201 });
  }),
  http.post(`${API}/api/found-items`, async ({ request }) => {
    const body = (await request.json()) as FoundItem & { photoIds: string[] };
    sent.push({ clientId: body.clientId, photoIds: body.photoIds });
    const again = saved.has(body.clientId);
    saved.add(body.clientId);
    if (body.siteId === 'lost-answer' && !again) {
      return HttpResponse.error(); // saved, but the answer never reached the phone
    }
    return HttpResponse.json({ ...body, id: `found-${body.clientId}` }, { status: again ? 200 : 201 });
  }),
);
const unhandled: string[] = [];
beforeAll(() =>
  server.listen({
    onUnhandledFrame({ frame, defaults }) {
      const { data } = frame;
      const request =
        typeof data === 'object' && data !== null && 'request' in data && data.request instanceof Request
          ? data.request
          : undefined;
      unhandled.push(request ? `${request.method} ${request.url}` : frame.protocol);
      defaults.error();
    },
  }),
);
beforeEach(async () => {
  uploads.length = 0;
  sent.length = 0;
  saved.clear();
  await AsyncStorage.clear();
  useFoundQueue.setState({ items: [], sending: false });
});
afterEach(() => {
  const missed = unhandled.splice(0);
  if (missed.length) throw new Error(`No MSW handler for: ${missed.join(', ')}`);
  server.resetHandlers();
});
afterAll(() => server.close());

const found = (clientId: string, siteId = 'driftwood-cove'): FoundItem => ({
  clientId,
  siteId,
  what: 'A phone in a blue case',
  foundAt: '2026-06-15T09:40:00.000Z',
});
// A photo kept in the documents folder: `bytes` bytes of the given kind
function kept(name: string, type: string, bytes: number): ItemPhoto {
  const uri = `file:///documents/found-photos/${name}`;
  savePhoto(uri, new Blob([new Uint8Array(bytes)], { type }));
  return { uri, type, photoId: null };
}
const queued = () => useFoundQueue.getState().items;

test('Task 2: the photos go up first, as themselves, then the item names their ids', async () => {
  useFoundQueue.getState().add(found('f-0001'), [kept('1.jpg', 'image/jpeg', 1500), kept('2.png', 'image/png', 900)]);
  await sendWaitingItems();
  expect(uploads).toEqual([
    { type: 'image/jpeg', bytes: 1500 },
    { type: 'image/png', bytes: 900 },
  ]);
  expect(sent).toEqual([{ clientId: 'f-0001', photoIds: ['p1', 'p2'] }]);
  expect(queued()).toEqual([]);
  expect(keptPhotos()).toBe(0); // the server has them: the files are deleted
});

test('Task 2: the answer was lost: the next try sends the item with the saved ids, no second upload', async () => {
  useFoundQueue.getState().add(found('f-0002', 'lost-answer'), [kept('3.jpg', 'image/jpeg', 700), kept('4.jpg', 'image/jpeg', 800)]);
  await sendWaitingItems();
  expect(queued()[0].photos.map((photo) => photo.photoId)).toEqual(['p1', 'p2']);
  expect(queued()[0].attempts).toBe(1);
  await sendWaitingItems();
  expect(uploads).toHaveLength(2);
  expect(sent).toEqual([
    { clientId: 'f-0002', photoIds: ['p1', 'p2'] },
    { clientId: 'f-0002', photoIds: ['p1', 'p2'] },
  ]);
  expect(queued()).toEqual([]);
});

test('Task 2: a photo whose file is gone: the item goes without it', async () => {
  const photo = kept('5.jpg', 'image/jpeg', 600);
  useFoundQueue.getState().add(found('f-0003'), [
    { uri: 'file:///documents/found-photos/gone.jpg', type: 'image/jpeg', photoId: null },
    photo,
  ]);
  await sendWaitingItems();
  expect(sent).toEqual([{ clientId: 'f-0003', photoIds: ['p1'] }]);
});

test('Task 2: a GIF in the queue: refused in the server\'s words, the JPEG before it kept its id', async () => {
  useFoundQueue.getState().add(found('f-0004'), [kept('6.jpg', 'image/jpeg', 500), kept('7.gif', 'image/gif', 400)]);
  await sendWaitingItems();
  expect(queued()[0]).toMatchObject({ status: 'refused', problem: 'Photos must be JPEG, PNG or WebP images.' });
  expect(queued()[0].photos[0].photoId).toBe('p1');
  expect(sent).toEqual([]);
});

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

test('Task 3: the saved queue says which version wrote it', async () => {
  useFoundQueue.getState().add(found('f-0005'), [{ uri: 'file:///documents/found-photos/8.jpg', type: 'image/jpeg', photoId: null }]);
  await tick();
  const savedJson = JSON.parse((await AsyncStorage.getItem(QUEUE_KEY)) ?? '{}');
  expect(savedJson.version).toBe(1);
  expect(savedJson.state.items[0].photos).toEqual([{ uri: 'file:///documents/found-photos/8.jpg', type: 'image/jpeg', photoId: null }]);
});

test('Task 3: an item saved before photos existed is kept, with an empty photo list', async () => {
  const old = { item: found('f-0006'), status: 'waiting', attempts: 2, problem: null }; // version 0: no photos
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify({ state: { items: [old] }, version: 0 }));
  await loadFoundQueue();
  expect(queued()).toEqual([{ ...old, photos: [] }]);
});

test('Task 3: a saved item nobody can read is still dropped', async () => {
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify({ state: { items: [{ what: 'keys' }] }, version: 0 }));
  await loadFoundQueue();
  expect(queued()).toEqual([]);
});
