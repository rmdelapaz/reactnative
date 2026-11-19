# The course folder after the catch-up steps

The kit's check copies `lesson-11-start` into `solution/shoreline/`, copies `.env.example` to `.env.local`, installs
the packages from the lockfile (`npm ci`) and runs the environment check (READY) and the lesson's own two checks
(`npx tsc --noEmit` silent, `npx expo lint` only its two `env:` lines).
