#!/usr/bin/env python3
"""
Assemble the three combined instructor-kit books from the per-session source docs.

Kit:    React Native & Expo: Build and Ship a Mobile App (the whole course, Modules 1 to 10), 26 sessions x 3 hours
        = 78 h, in three parts that can each run as their own block:
          Part 1 "Foundations and Lists" (Sessions 1 to 9, Modules 1 to 3) ends with the Part 1 project check-in
            and assessment (Session 9; the course close when Part 1 runs alone);
          Part 2 "Navigation, Data and Devices" (Sessions 10 to 17, Modules 4 to 6) opens with a Part 1 refresher
            and the catch-up code (downloads/lesson-11-start + shoreline-api), and ends with the Part 2 project
            check-in and assessment (Session 17);
          Part 3 "Motion, Quality and Shipping" (Sessions 18 to 26, Modules 7 to 10) opens with a Parts 1-2
            refresher and catch-up (downloads/lesson-25-start), and ends with the final project showcase and final
            assessment (Session 26).
Reads:  source/module-NN/{facilitator-guide,participant-workbook,answer-key}.html   (NN = 01 ... 26)
        ../course-config.json   (lesson titles, so the contents page always matches the course)
Writes: ./participant-workbook.html, ./facilitator-guide.html, ./answer-key.html
        (the hand-out documents: a cover, a contents page, a divider before each part, then one chapter per session)

A "module" folder is one 3-hour SESSION of the kit (not a course module): module-07 = Session 7.
Sessions 9, 17 and 26 teach no new lesson (project check-ins and assessments); Sessions 4, 13 and 21 hold the
three 30-minute checkpoints (CHECKPOINTS below).

A session whose source doc is missing (or has no sheet/foot) is skipped with a warning, so a
partly written kit still builds. The exit code is 0 when every session was found, 1 otherwise;
add --strict to stop at the first missing doc instead.

Links: a source doc sits two folders below the kit root, a book sits in the root, so every
href="../../..." or src="../../..." in a source doc is rewritten (the leading "../../" is dropped). Course
screenshots are referenced, not copied: src="../../../images/lesson_NN/x.png" in a source doc becomes
src="../images/lesson_NN/x.png" in a book (the kit folder stays inside the course folder).

After editing a session's source doc, run this again, then render the PDFs
(python3 ~/projects/_kit_tools/reactnative/render_pdfs_rn.py, or each book's Print button).

Usage:  python3 build-combined.py [--strict]      (works from any folder)
"""
import json
import re
import sys
from pathlib import Path

KIT = Path(__file__).resolve().parent
COURSE = "React Native & Expo: Build and Ship a Mobile App"   # the course on the site (rays-reactnative.netlify.app)
KIT_TITLE = "React Native & Expo: Build and Ship a Mobile App"  # this kit's name: masthead foot lines and book covers
KIT_KEY = ""                   # one kit: the instructor-kit/ folder itself
AUTHOR = "Ray de la Paz"
SESSIONS = 26
HOURS = 78
FORMAT_CHIP = "26 sessions × 3 h · 78 h"
LESSON_CHIP = "37 lessons"
SCOPE = "Modules 1 to 10, in three parts"

# (session number, session title, the lesson ids taught in it). Lesson TITLES are read from
# ../course-config.json when the script runs; do not type them here. Sessions 9, 17 and 26 teach no new lesson.
MODULES = [
    (1, "How React Native Works and Your Toolchain", ["1.1", "1.2"]),
    (2, "From the HQ to the Phone", ["1.3"]),
    (3, "View, Text and StyleSheet", ["2.1"]),
    (4, "Flexbox the Native Way", ["2.2"]),
    (5, "Images, Icons, Fonts and Safe Areas", ["2.3"]),
    (6, "Touch and Input", ["2.4"]),
    (7, "Responsive, Platform-Specific and Themed UI", ["2.5"]),
    (8, "FlatList, SectionList and Big Lists", ["3.1", "3.2"]),
    (9, "Part 1 Project Check-in and Assessment", []),
    (10, "File-Based Routing, Tabs and Modals", ["4.1", "4.2"]),
    (11, "Sign-In Flows and Deep Links", ["4.3", "4.4"]),
    (12, "Reaching the API and TanStack Query on Mobile", ["5.1", "5.2"]),
    (13, "Storage and Mobile Forms", ["5.3", "5.4"]),
    (14, "Offline First and Permissions", ["5.5", "6.1"]),
    (15, "Camera, Photos, Location and Maps", ["6.2", "6.3"]),
    (16, "Notifications, Haptics, Sharing and Files", ["6.4", "6.5"]),
    (17, "Part 2 Project Check-in and Assessment", []),
    (18, "Animation and Gestures", ["7.1", "7.2"]),
    (19, "Motion Polish and Accessible Apps", ["7.3", "8.1"]),
    (20, "Testing the App's Logic", ["8.2"]),
    (21, "Testing Screens and Flows", ["8.3"]),
    (22, "Performance, Debugging and App Config", ["8.4", "9.1"]),
    (23, "Development Builds and EAS Build", ["9.2"]),
    (24, "Updates, Monitoring and the App Stores", ["9.3", "9.4"]),
    (25, "Final Project Workshop and Real Mobile Projects", ["10.1", "10.2"]),
    (26, "Final Project Showcase and Final Assessment", []),
]

# (part number, title, first session, last session, one-line description). The books put a divider page
# before each part; check_kit_rn.py and gen_syllabus_rn.py read this list too.
PARTS = [
    (1, "Part 1: Foundations and Lists", 1, 9,
     "Modules 1 to 3: how React Native turns components into native views and what Expo adds, a working toolchain "
     "(Node LTS, VS Code with Expo Tools, the shoreline-api mock back end, an Expo SDK 58 project running in Expo Go "
     "or the web preview), the shared code that comes over from Shoreline Crew HQ, then the core components and "
     "layout (View, Text and StyleSheet, flexbox, images, icons, fonts and safe areas, touch and input, responsive, "
     "platform-specific and themed UI) and fast lists (FlatList, SectionList, FlashList). Runs on its own as a short "
     "course and ends with the Part 1 project check-in and assessment."),
    (2, "Part 2: Navigation, Data and Devices", 10, 17,
     "Modules 4 to 6: Expo Router (file-based routes, tabs, nesting and modals, sign-in flows and protected routes, "
     "deep links), the API from a phone with TanStack Query, storage on the device, mobile forms and offline first, "
     "then the device features: permissions, the camera and photos, location and maps, notifications, haptics, "
     "sharing and files. Opens with a Part 1 refresher and the catch-up code, and ends with the Part 2 project "
     "check-in and assessment."),
    (3, "Part 3: Motion, Quality and Shipping", 18, 26,
     "Modules 7 to 10: animation with Reanimated 4 and gestures, motion polish, accessible mobile apps, testing the "
     "app's logic and its screens with Jest, React Native Testing Library and MSW, performance and debugging, app "
     "config and environments, development builds and EAS Build, updates and monitoring, the app stores, then the "
     "final project and real mobile projects. Opens with a Parts 1 and 2 refresher and catch-up, and ends with the "
     "final project showcase and final assessment."),
]
CHECKPOINTS = {4: "Checkpoint 1", 13: "Checkpoint 2", 21: "Checkpoint 3"}   # session -> its 30-minute checkpoint row
FINAL_SESSIONS = (8, 9, 16, 17, 25, 26)       # sessions that use final-assessment.html (part projects + final)


def part_of(num):
    return next(p for p in PARTS if p[2] <= num <= p[3])

DOCS = {
    "participant-workbook": dict(
        base="participant-workbook.html", role="Participant Workbook",
        eyebrow=f"Instructor Kit · {KIT_TITLE} · Complete Workbook",
        sub=f"Your working notebook for all {SESSIONS} sessions of {KIT_TITLE}. Read the key ideas, study the worked examples, do the guided labs, predict before you run, and check yourself with the self-check quizzes.",
        chips=[f'<span class="chip"><b>{SESSIONS}</b> sessions · {LESSON_CHIP}</span>', '<span class="chip">Write-in exercises &amp; self-checks</span>', '<span class="chip">Name: ____________________</span>'],
        toolbar=("Student workbook —", "write in it · bring it to every session")),
    "facilitator-guide": dict(
        base="facilitator-guide.html", role="Facilitator Guide",
        eyebrow=f"Instructor Kit · {KIT_TITLE} · Complete Facilitator Guide",
        sub=f"The full teaching manual for the {SESSIONS}-session {KIT_TITLE} kit ({SCOPE}; one 3-hour session, one or two lessons each). Timing, live-demo scripts, the mistakes to pre-empt, lab facilitation, and checks for understanding, for every session.",
        chips=[f'<span class="chip"><b>{SESSIONS}</b> sessions · {LESSON_CHIP}</span>', f'<span class="chip">{FORMAT_CHIP}</span>', '<span class="chip">Instructor copy · not for students</span>'],
        toolbar=("Instructor copy —", "contains answers &amp; timing · not for students")),
    "answer-key": dict(
        base="answer-key.html", role="Answer Key",
        eyebrow=f"Instructor Kit · {KIT_TITLE} · Complete Answer Key",
        sub=f"Every self-check item answered and explained, plus reference notes for each lab, for all {SESSIONS} sessions. Use for grading and reteaching. Confidential instructor material.",
        chips=[f'<span class="chip"><b>{SESSIONS}</b> sessions</span>', f'<span class="chip">{SESSIONS * 12} self-check items + lab solutions</span>', '<span class="chip">Confidential · do not distribute</span>'],
        toolbar=("Instructor copy —", "answers &amp; solutions · not for students")),
}

SHEET_OPEN = '<div class="sheet">'
FOOT_OPEN = '<div class="foot">'


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def folder(num):
    """Session 7 -> 'module-07'."""
    return f"module-{num:02d}"


def lesson_titles():
    """{'1.1': 'How React Native Works', ...} from the course's course-config.json."""
    for cfg in (KIT.parent / "course-config.json", KIT.parent.parent / "course-config.json", KIT / "course-config.json"):
        if cfg.is_file():
            break
    try:
        data = json.loads(cfg.read_text(encoding="utf-8"))
    except (OSError, ValueError) as e:
        raise SystemExit(f"Cannot read lesson titles from {cfg}: {e}")
    return {les["id"]: les["title"] for mod in data["modules"] for les in mod["lessons"]}


def lessons_for(num, titles=None):
    """[('1.1', 'How React Native Works'), ('1.2', 'Your Toolchain')] for a session (used by the checker too); [] for Sessions 9, 17, 26."""
    titles = titles or lesson_titles()
    ids = next(ids for n, _, ids in MODULES if n == num)
    missing = [i for i in ids if i not in titles]
    if missing:
        raise SystemExit(f"Lesson id(s) {missing} are not in course-config.json")
    return [(i, titles[i]) for i in ids]


def extract_body(path):
    """Inner content of .sheet minus the trailing .foot block; None (with a reason) if it cannot be cut."""
    try:
        html = path.read_text(encoding="utf-8")
    except OSError:
        return None, "file not found"
    if html.count(SHEET_OPEN) != 1 or html.count(FOOT_OPEN) != 1:
        return None, f'needs exactly one {SHEET_OPEN} and one {FOOT_OPEN}'
    i = html.index(SHEET_OPEN) + len(SHEET_OPEN)
    j = html.index(FOOT_OPEN)
    if j < i:
        return None, "the foot comes before the sheet"
    body = html[i:j].strip()
    body = re.sub(r'\b(href|src)="\.\./\.\./', r'\1="', body)    # ../../../images/... -> ../images/...
    return body, ""


def build(key, titles, strict=False):
    d = DOCS[key]
    toc_rows, chapters, skipped = [], [], []
    for num, title, _ in MODULES:
        part = part_of(num)
        if num == part[2]:
            toc_rows.append(f'<li class="part">{esc(part[1])} · Sessions {part[2]} to {part[3]}</li>')
            chapters.append(f'<section class="part-divider">\n  <div class="kit-eyebrow">{esc(KIT_TITLE)} · {d["role"]}</div>\n'
                            f'  <h2>{esc(part[1])}</h2>\n  <p class="sub">Sessions {part[2]} to {part[3]}. {esc(part[4])}</p>\n</section>')
        path = KIT / "source" / folder(num) / d["base"]
        body, why = extract_body(path)
        if body is None:
            if strict:
                raise SystemExit(f"Session {num:02d}: {path.relative_to(KIT)}: {why}")
            if why != "file not found":       # a doc that exists but cannot be cut deserves its own line
                print(f"WARNING: Session {num:02d} skipped in {d['base']}: {path.relative_to(KIT)}: {why}")
            skipped.append(num)
            toc_rows.append(f'<li class="mod missing"><span class="mnum">S{num:02d}</span>{esc(title)} (not written yet)</li>')
            continue
        cp = f' · {CHECKPOINTS[num]}' if num in CHECKPOINTS else ''
        toc_rows.append(f'<li class="mod"><span class="mnum">S{num:02d}</span>{esc(title)}{cp}</li>')
        for lc, lt in lessons_for(num, titles):
            toc_rows.append(f'<li class="les"><span class="lc">{lc}</span><span>{esc(lt)}</span></li>')
        chapters.append(f'<section class="modwrap">\n{body}\n</section>')
    toc = "\n        ".join(toc_rows)
    mods = "\n\n".join(chapters)
    n_done = sum(1 for ch in chapters if ch.startswith('<section class="modwrap">'))
    scope = f"all {SESSIONS} sessions" if not skipped else f"{n_done} of {SESSIONS} sessions (draft)"

    out = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{d['role']} | {KIT_TITLE}</title>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800&family=Source+Sans+3:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@500;600&display=swap">
<link rel="stylesheet" href="kit.css">
</head>
<body>

<div class="toolbar">
  <span class="lbl">{d['toolbar'][0]}</span>
  <button type="button" onclick="window.print()">🖨 Print / Save as PDF</button>
  <span class="hint">{d['toolbar'][1]}</span>
</div>

<div class="sheet">

  <header class="cover">
    <div class="kit-eyebrow">{d['eyebrow']}</div>
    <h1>{KIT_TITLE}</h1>
    <p class="sub">{d['sub']}</p>
    <div class="meta-row">{''.join(d['chips'])}</div>
  </header>

  <nav class="toc">
    <h2>Contents</h2>
    <ol>
        {toc}
    </ol>
  </nav>

{mods}

  <div class="foot">
    <div class="who"><span class="bio">{KIT_TITLE} · {d['role']}</span></div>
    <div class="ver">Complete {d['role']} · {scope} · v1.0 · &copy; 2026 {AUTHOR}</div>
  </div>

</div>
</body>
</html>
"""
    (KIT / d["base"]).write_text(out, encoding="utf-8")
    if skipped:
        print(f"WARNING: {d['base']}: {len(skipped)} session(s) skipped (source doc missing or not cuttable): "
              + ", ".join(f"{n:02d}" for n in skipped))
    print(f"wrote {d['base']}  ({len(out) // 1024} KB, {n_done} of {len(MODULES)} sessions)")
    return skipped


def main(argv=None):
    argv = sys.argv[1:] if argv is None else argv
    if any(a in ("-h", "--help") for a in argv):
        print(__doc__)
        return 0
    strict = "--strict" in argv
    if not (KIT / "source").is_dir():
        raise SystemExit(f"source/ folder not found next to {Path(__file__).name}")
    titles = lesson_titles()
    for num, _, _ in MODULES:
        lessons_for(num, titles)          # fail early on a lesson id that left the course
    skipped = set()
    for k in DOCS:
        skipped |= set(build(k, titles, strict))
    if skipped:
        print(f"Built with {len(skipped)} session(s) missing at least one doc: "
              + ", ".join(f"{n:02d}" for n in sorted(skipped)))
        return 1
    print(f"Done: all {SESSIONS} sessions in all three books. Now render the PDFs.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
