// The sample data: the same every time the API starts (or POST /api/_reset runs). All of it is fictional.
import type { Book, Hold, Patron, Stop } from './types.ts'

export const stops: Stop[] = [
  { id: 's01', name: 'Larch Creek Trailhead', address: 'Trailhead parking lot, Forest Road 12, Pine Hollow', latitude: 46.8412, longitude: -91.6230, day: 'monday', start: '10:00', end: '11:30' },
  { id: 's02', name: 'Ridgeline Senior Center', address: '410 Ridgeline Drive, Cedar Bend', latitude: 46.7925, longitude: -91.5108, day: 'monday', start: '14:00', end: '15:30' },
  { id: 's03', name: 'Pine Hollow Elementary', address: '88 School Street, Pine Hollow', latitude: 46.8350, longitude: -91.6012, day: 'tuesday', start: '13:30', end: '15:00' },
  { id: 's04', name: 'Millrace Farmers Market', address: 'Depot Square, Millrace', latitude: 46.7598, longitude: -91.4471, day: 'wednesday', start: '09:00', end: '12:00' },
  { id: 's05', name: 'Tamarack Middle School', address: '1200 County Road 7, Larchmont Flats', latitude: 46.8811, longitude: -91.4890, day: 'thursday', start: '12:30', end: '14:00' },
  { id: 's06', name: 'Cedar Bend Community Hall', address: '15 River Street, Cedar Bend', latitude: 46.7871, longitude: -91.5233, day: 'thursday', start: '16:00', end: '18:00' },
  { id: 's07', name: 'Lakeside Mobile Home Park', address: 'Lakeside Lane, Clearwater', latitude: 46.9104, longitude: -91.5702, day: 'friday', start: '15:00', end: '16:30' },
  { id: 's08', name: 'Millrace Green Story Corner', address: 'Millrace Public Green, Millrace', latitude: 46.7622, longitude: -91.4415, day: 'saturday', start: '10:00', end: '11:00' },
]

export const books: Book[] = [
  { id: 'b01', title: "The Lantern Keeper's Map", author: 'Rosa Ilves', audience: 'children', onVan: true },
  { id: 'b02', title: 'Moss and the Midnight Fox', author: 'Teodor Banks', audience: 'children', onVan: true },
  { id: 'b03', title: 'Seventeen Bridges', author: 'Amara Okonjo-Hale', audience: 'teens', onVan: true },
  { id: 'b04', title: 'The Quiet Orchard', author: 'Lena Marchetti', audience: 'adults', onVan: true },
  { id: 'b05', title: 'Field Guide to Northern Mushrooms', author: 'Henrik Saari', audience: 'adults', onVan: false },
  { id: 'b06', title: 'Rocket Recipes for Small Kitchens', author: 'Priya Desmond', audience: 'adults', onVan: true },
  { id: 'b07', title: 'The Girl Who Counted Clouds', author: 'Mei Lindqvist', audience: 'children', onVan: false },
  { id: 'b08', title: 'Northbound Static', author: 'Jules Ferreira', audience: 'teens', onVan: true },
  { id: 'b09', title: 'A History of Tamarack County', author: 'Odette Pruitt', audience: 'adults', onVan: false },
  { id: 'b10', title: 'Pancake Weather', author: 'Sam Ostrowski', audience: 'children', onVan: true },
  { id: 'b11', title: 'The Ice Road Letters', author: 'Grace Whitfield', audience: 'adults', onVan: true },
  { id: 'b12', title: 'Robots on Recess', author: 'Dev Kapoor', audience: 'children', onVan: false },
]

/** Card holders and their PINs (the PIN is never sent back) */
export const patrons: (Patron & { pin: string })[] = [
  { id: 'p01', name: 'June Okafor', cardNumber: '21450021', pin: '4821' },
  { id: 'p02', name: 'Tomas Lindgren', cardNumber: '21450038', pin: '1357' },
]

/** One hold already waiting for June at the senior center */
export function seedHolds(): (Hold & { patronId: string })[] {
  return [
    { id: 'h01', clientId: 'seed-hold-0001', patronId: 'p01', bookId: 'b09', bookTitle: 'A History of Tamarack County', stopId: 's02', stopName: 'Ridgeline Senior Center', note: '', status: 'ready' },
  ]
}
