# Showcase pre-flight: the evidence check

Run this two days before the showcase (Session 26), on your final project. It reads your project's files (no
network, no install, nothing is changed) and lists the evidence the Lesson 10.1 rubric asks for that is still
missing. It is NOT a score: the rubric scores your project, with a person, from the evidence and your demo.

## Task 1: run it on your project

From your course folder (`shoreline`):

```
node labs/module-26/showcase-preflight/evidence_check.mjs ~/projects/your-app
```

(the folder where your final project's `package.json` is). Each line starts with PASS, FIX or CHECK and names the
rubric row it belongs to. **FIX** = evidence the rubric needs that is not there yet: the verdict is NOT READY.
**CHECK** = something to look at yourself (an id that still starts with com.example, no review file yet): READY
WITH NOTES.

## Task 2: fix the FIX lines, and read the CHECK lines

Fix every FIX line and run the check again. For each CHECK line, decide: fix it, or bring a sentence that says why
not (for example "the ids stay com.example until the client confirms its domain: to do on the release checklist").
Done when the last line says READY FOR THE SHOWCASE, or READY WITH NOTES with a sentence for each CHECK line.

The check cannot see your phone, your CI run, your recording or your demo: bring those to the showcase.
