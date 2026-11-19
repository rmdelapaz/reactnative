# solution: your course folder after the README's steps: .env.local copied from .env.example, npm ci run in shoreline-crew

The checker copies `downloads/lesson-25-start/` here as `shoreline/` (its packages installed from its lockfile, the
way `npm ci` does) and runs the commands in `../lab.json` from this folder. Nothing else lives here.
