## What this changes

One or two sentences: what a user or a teammate will notice.

## How to check it

The screen, the sample data and what should happen (for example: open a stop, mark it delivered without signal, then turn the signal back on).

## Tested on

- [ ] Android phone or emulator (which one?)
- [ ] iPhone or iOS Simulator (which one?)
- [ ] Web preview only (say why a phone was not needed)

## Phone checklist

- [ ] `npx tsc --noEmit`, `npx expo lint` and `npm test -- --watchAll=false` pass, and CI is green
- [ ] New or changed behavior has a test
- [ ] Labels and roles, largest text size and dark mode checked on the changed screens
- [ ] Offline, loading, error and empty states still say something helpful
- [ ] No secrets in the code or in an `EXPO_PUBLIC_` variable
- [ ] Native change? (a new native package, a config plugin, a permission, app.config.ts) Then it needs a new build, not an update
- [ ] Changes what the app collects? Then the privacy answers and the data inventory change too
