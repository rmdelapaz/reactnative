Shoreline Crew code for React Native & Expo: Build and Ship a Mobile App
https://rays-reactnative.netlify.app/

Each folder is one project:
  shoreline-api: the mock back end; no install needed: node server.ts --host  (Node 24 or newer)
  shoreline-crew: copy .env.example to .env.local and keep http://localhost:4000 for the web preview (a phone or emulator needs another address: Lesson 5.1; from then on .env.example lists one per device); then npm ci   (installs the exact versions in package-lock.json); then npx expo start  (start shoreline-api first)
