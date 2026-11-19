import { readDataSource } from '@/api/source';

it('reads demo and server addresses from EXPO_PUBLIC_API_URL', () => {
  expect(readDataSource('demo')).toEqual({ kind: 'demo' });
  expect(readDataSource('http://192.168.1.42:4000/')).toEqual({
    kind: 'server',
    baseUrl: 'http://192.168.1.42:4000',
  });
});

it('says what to fix when the address is missing or written wrongly', () => {
  expect(() => readDataSource('')).toThrow('EXPO_PUBLIC_API_URL is not set');
  expect(() => readDataSource('192.168.1.42:4000')).toThrow('use demo, or an address');
  expect(() => readDataSource('https://api.example.com/api')).toThrow('leave out the /api');
});
