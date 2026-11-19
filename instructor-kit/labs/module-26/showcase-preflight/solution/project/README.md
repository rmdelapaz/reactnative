# Saltwick Kayaks

A phone app for Saltwick Kayak Hire, a harbor shop that rents single and tandem kayaks by the hour: staff see
today's bookings per kayak, book a kayak (never twice for the same time), mark it out and returned, and see the late
ones first. Built from the final-project starter of React Native & Expo: Build and Ship a Mobile App (Lesson 10.1).

**Launch:** an Android preview build from an EAS internal distribution link, used by two staff for a Saturday, and a
two-minute recording of the main journey: https://example.org/saltwick/recording (preview builds use demo data).

## Run it

    npm ci
    cp .env.example .env.local
    npx expo start

`EXPO_PUBLIC_API_URL=demo`: the app answers from its own mock API (`src/mock-api`, `src/rentals`), on any phone.
Checks: `npx tsc --noEmit`, `npx expo lint`, `npm test -- --watchAll=false`.

## Decisions

The plan and every decision are in `worksheet.md`; the Expo Go or development build decision is
`docs/decisions/001-expo-go-or-dev-build.md`.

## Maintenance

- Every few weeks: `npx expo install --check`, `npx expo-doctor`, `npm outdated`; plain JavaScript packages on a
  branch with CI.
- When a new Expo SDK is released: read its notes; upgrade within the year, one SDK at a time.
- Once a year: the stores' target and SDK rules, before they block an update.
