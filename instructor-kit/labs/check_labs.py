#!/usr/bin/env python3
"""check_labs.py: run every lab of the React Native & Expo instructor kit and check it behaves as declared.

    python3 labs/check_labs.py module-01                 every lab of Session 1
    python3 labs/check_labs.py module-01/l1_2-your-toolchain     one lab folder
    python3 labs/check_labs.py --all                     every session (and the part projects in labs/projects/)
    python3 labs/check_labs.py --dir PATH                a lab folder anywhere (the lab templates)
    options: -v (print each run's output) · --run NAME (only that run) · --no-api (skip runs that need
             shoreline-api) · --api URL (use an API that is ALREADY RUNNING, e.g. http://localhost:4000, instead of
             starting a private copy; runs that start the API with their own flags ("args") are skipped)
             · --api-dir PATH (the shoreline-api folder to start; default: the course tools' copy, else
             ../shoreline-api next to this labs/ folder, i.e. shoreline/shoreline-api when labs/ sits in the
             learner's shoreline/ folder) · --timeout S (default per run: its "timeout" or 240)

Exit 0 = every run passed (skips do not fail). System python3 (3.10+); Node 24 from the course tools
(~/.nvm/versions/node/v24.22.2/bin, override with RN_NODE=/path/to/bin; on a learner's machine the node on PATH).
The checker never edits the kit: each run works in a fresh copy of the lab folder under ~/.cache/rn/kit-work/
(removed afterwards). No phone, emulator or simulator is used: the labs run headless (Jest with jest-expo, tsc,
expo lint, expo export, and a short `expo start` where a run says so).

A LAB is one folder labs/module-NN/lM_N-<slug>/ with a lab.json (format: labs/README.md):

    {"title": "Cleanup cards, tested", "lesson": "1.1", "tasks": 3,
     "runs": [
       {"name": "starter",  "dir": "starter",  "cmd": "npm test", "exit": "nonzero", "expect": ["Tests:       4 failed"]},
       {"name": "solution", "dir": "solution", "cmd": "npm test", "exit": 0, "expect": ["Tests:       4 passed"]},
       {"name": "solution-types", "dir": "solution", "cmd": "npm run typecheck", "absent": ["error TS"]},
       {"name": "env",      "dir": ".", "cmd": "node check_environment.mjs {API} --metro-port={METRO}", "api": true,
        "course": "lesson-02-end", "exit": 0, "expect": ["READY"]}]}

Per run: copy the lab folder the way a learner has it, <copy>/labs/module-NN/<lab>/ (templates and folders outside
labs/: <copy>/labs/module-99/<name>/), with the kit's SHARED install next to it: labs/package.json +
labs/package-lock.json (every package every lab uses) are installed ONCE per lockfile into ~/.cache/rn/kit-nm/<hash>/
(npm ci) and hard-linked as <copy>/labs/node_modules, so packages resolve from the parent folder exactly as on a
learner's machine after `npm install` in shoreline/labs. Lab folders carry no node_modules and no lockfile of their
own (a course download copied by "course" keeps its own); write run["files"]; then
  * "api": true or {"args": [...], "today": "YYYY-MM-DD"}: start a PRIVATE shoreline-api for this run on port
    44NN (NN = the session of the lab folder; 4493 / 4494 for labs/projects/part1-* / part2-*; a free port if that
    one is busy), NEVER the learners' :4000 or the course tools' :4300, with --quiet, --today (default 2026-06-15 so
    outputs are the same every day; "today": null for the real date) and the run's "args"; {API} in cmd, env and
    files = http://localhost:PORT; the API is stopped by PID afterwards. Labs that need the API are the EXCEPTION:
    prefer fixtures captured from it, or MSW in a Jest lab.
  * {METRO} in cmd, env and files = a port for anything that starts Metro or a web server (expo start, expo
    serve): 45NN for the lab's session (4593 / 4594 for the part projects), a free port if it is busy. NEVER 8081
    (the learners'), 4381/4382 (the course tools'; 4382 may be held by a process that is not ours).
  * "course": "lesson-02-end" (+ "into": "shoreline", the default): copy that course download (the course repo's
    downloads/<name>/: shoreline-api, shoreline-crew) into <dir>/<into>/ first, with node_modules installed from
    each project's lockfile (once per lockfile): a learner's course folder at that point, for checks that need one
    (the Session 1 environment check). Skipped when the downloads are not on this machine.
  * "cmd": run with bash in the copied <dir>, Node 24 first on PATH, agent variables removed (CLAUDECODE,
    AI_AGENT, every CLAUDE*: tools change their output under them or without a terminal), stdout+stderr merged.
    Every cmd runs in a pseudo-terminal (the course tools' ptyrun.py: the final screen a learner sees, no ANSI, no
    CI variable) unless it starts a background job ("&") or "tty": false; without the course tools it falls back
    to a plain pipe with CI=1 (same verdicts; some tools print a little differently).
  * Afterwards every process still running inside the run's copy (its working folder is there: a Metro or a dev
    server the cmd left behind) is stopped BY PID, and the run FAILS ("left a process running").
Verdict: "exit" (0, a number, or "nonzero"; default 0), every "expect" text in the output, no "absent" text.
A starter must fail where it should: a run named starter* needs exit "nonzero" or an expect text (the TODO line).
"""
from __future__ import annotations

import fcntl
import hashlib
import json
import os
import re
import shutil
import signal
import socket
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

LABS = Path(__file__).resolve().parent
KIT = LABS.parent
TOOLS = Path.home() / "projects" / "_kit_tools" / "reactnative"
CACHE = Path.home() / ".cache" / "rn"
NM_CACHE = CACHE / "kit-nm"
WORK = CACHE / "kit-work"
_DEFAULT_NODE = Path.home() / ".nvm/versions/node/v24.22.2/bin"
NODE_BIN = Path(os.environ.get("RN_NODE", str(_DEFAULT_NODE if _DEFAULT_NODE.is_dir() else
                                              Path(shutil.which("node") or "/usr/bin/node").parent)))
AGENT_VARS = ("CLAUDECODE", "AI_AGENT", "CLAUDE_CODE_ENTRYPOINT", "CLAUDE_CODE_SSE_PORT", "CLAUDE_AGENT_SDK_VERSION",
              "CLAUDE_CODE_EXECPATH", "GEMINI_CLI", "CODEX", "CURSOR_AGENT", "NODE_OPTIONS", "CONTINUOUS_INTEGRATION")
DEFAULT_TIMEOUT = 240
KIT_TODAY = "2026-06-15"      # the API's --today for lab runs: sample dates are relative to it (never quote them)
SKIP_NAMES = {"node_modules", "dist", ".expo", "expo-env.d.ts", "coverage", ".env.local", ".tsbuildinfo",
              "web-build", ".metro-health-check"}
RESERVED_PORTS = {4000, 4300, 4381, 4382, 4383, 4384, 8081}   # learners' and the course tools' (4382: not ours)


def api_dir(opts=None):
    """The shoreline-api folder to start: --api-dir, RN_API_DIR, the course tools' copy, ../shoreline-api."""
    for cand in ((opts or {}).get("api_dir"), os.environ.get("RN_API_DIR"), TOOLS / "code" / "shoreline-api",
                 KIT / "shoreline-api", LABS.parent / "shoreline-api"):
        if cand and (Path(cand) / "server.ts").is_file():
            return Path(cand)
    return None


def course_download(name):
    """downloads/<name>/ of the course repo (the kit lives in it: KIT.parent), e.g. "lesson-02-end"."""
    for base in (KIT.parent / "downloads", Path.home() / "projects" / "reactnative" / "downloads"):
        if (base / name).is_dir():
            return base / name
    return None


def session_port(folder: Path, base=4400) -> int:
    """44NN (API) / 45NN (base=4500, Metro) for labs/module-NN/...; +93 / +94 for labs/projects/part1-* /
    part2-*; +99 otherwise. One port per session, so parallel checkers do not collide (a busy port falls back to a
    free one anyway)."""
    mt = re.search(r"module-(\d\d)", str(folder))
    if mt:
        return base + int(mt.group(1))
    mt = re.search(r"part([12])-", str(folder))
    return base + 92 + int(mt.group(1)) if mt else base + 99


def _port_free(port):
    with socket.socket() as sk:
        sk.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        try:
            sk.bind(("127.0.0.1", port))
            return True
        except OSError:
            return False


def _free_port():
    with socket.socket() as sk:
        sk.bind(("127.0.0.1", 0))
        return sk.getsockname()[1]


def own_port(port):
    """port if it is free and not one of the reserved ones, else a free port the system picks."""
    if port in RESERVED_PORTS or not _port_free(port):
        return _free_port()
    return port


def start_api(port, args=(), today=KIT_TODAY, opts=None):
    """Start a private shoreline-api on `port` (or a free port when it is busy). -> (Popen, url).
    Never the learners' 4000 or the tools' 4300. Stop it with stop_api(proc)."""
    d = api_dir(opts)
    if d is None:
        raise FileNotFoundError("shoreline-api not found (give --api-dir PATH, or put shoreline-api next to labs/)")
    port = own_port(port)
    argv = [str(NODE_BIN / "node"), "server.ts", f"--port={port}", "--quiet"]
    if today:
        argv.append(f"--today={today}")
    argv += list(args)
    proc = subprocess.Popen(argv, cwd=d, env=clean_env(), stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                            start_new_session=True)
    url = f"http://localhost:{port}"
    end = time.time() + 20
    while time.time() < end:
        if proc.poll() is not None:
            raise RuntimeError(f"shoreline-api exited: {proc.stdout.read().decode('utf-8', 'replace')[-600:]}")
        try:
            urllib.request.urlopen(url + "/api/health", timeout=2)
            return proc, url
        except urllib.error.HTTPError:
            return proc, url
        except Exception:  # noqa: BLE001
            time.sleep(0.15)
    stop_api(proc)
    raise RuntimeError(f"shoreline-api did not answer on {url}")


def stop_api(proc):
    """Stop a started API by its process group (never by pattern)."""
    if proc is None:
        return
    try:
        os.killpg(proc.pid, signal.SIGTERM)
        proc.wait(5)
    except Exception:  # noqa: BLE001
        try:
            os.killpg(proc.pid, signal.SIGKILL)
        except Exception:  # noqa: BLE001
            pass


def leftovers(folder: Path) -> list[int]:
    """PIDs of OUR processes whose working folder is inside `folder` (a run's private copy): a Metro or a web
    server a command left behind. Linux /proc only (elsewhere: [])."""
    found = []
    root = str(folder.resolve())
    me = os.getuid()
    for d in Path("/proc").glob("[0-9]*"):
        try:
            if d.stat().st_uid != me:
                continue
            cwd = os.readlink(d / "cwd")
        except OSError:
            continue
        if cwd == root or cwd.startswith(root + "/"):
            found.append(int(d.name))
    return found


def reap(folder: Path, grace=6.0) -> list[int]:
    """Stop (by PID) every process leftovers() finds after `grace` seconds (a server that was asked to stop takes
    a moment: Metro's workers exit after it); returns the PIDs that were still running."""
    end = time.time() + grace
    pids = [p for p in leftovers(folder) if p != os.getpid()]
    while pids and time.time() < end:
        time.sleep(0.2)
        pids = [p for p in leftovers(folder) if p != os.getpid()]
    for sig in (signal.SIGTERM, signal.SIGKILL):
        for pid in pids:
            try:
                os.kill(pid, sig)
            except OSError:
                pass
        if pids and sig == signal.SIGTERM:
            end = time.time() + 5
            while time.time() < end and any(Path(f"/proc/{p}").exists() for p in pids):
                time.sleep(0.1)
    return pids


_ptyrun = False


def ptyrun():
    """The course tools' ptyrun module (pseudo-terminal runs), or None when the tools are not on this machine:
    then every command runs through a plain pipe (same verdicts; some tools print a little differently)."""
    global _ptyrun
    if _ptyrun is False:
        try:
            sys.path.insert(0, str(TOOLS))
            sys.dont_write_bytecode = True
            import ptyrun as pr  # noqa: E402
            _ptyrun = pr
        except Exception:  # noqa: BLE001
            _ptyrun = None
    return _ptyrun


def clean_env(extra=None):
    env = {k: v for k, v in os.environ.items() if k not in AGENT_VARS and not k.startswith(("CLAUDE", "ANTHROPIC"))}
    env["PATH"] = f"{NODE_BIN}:{env.get('PATH', '')}"
    env.update({"CI": "1", "NO_COLOR": "1", "FORCE_COLOR": "0", "EXPO_NO_TELEMETRY": "1",
                "npm_config_update_notifier": "false", "npm_config_fund": "false", "npm_config_audit": "false",
                # create-expo-app and friends run git commit; this machine signs commits with GPG (would wait)
                "GIT_CONFIG_COUNT": "1", "GIT_CONFIG_KEY_0": "commit.gpgsign", "GIT_CONFIG_VALUE_0": "false"})
    env.update(extra or {})
    return env


# ------------------------------------------------------------------ node_modules: once per lockfile
def ensure_modules(app: Path) -> str:
    """Install app/package-lock.json once into the shared cache and hard-link node_modules into app/.
    Returns '' or a short note ('installed in 14 s')."""
    lock = app / "package-lock.json"
    if not lock.is_file():
        return ""
    key = hashlib.sha1(lock.read_bytes() + (app / "package.json").read_bytes()).hexdigest()[:16]
    home = NM_CACHE / key
    note = ""
    NM_CACHE.mkdir(parents=True, exist_ok=True)
    with open(NM_CACHE / f"{key}.lock", "a+") as fh:          # two checkers, one lockfile: install once
        fcntl.flock(fh, fcntl.LOCK_EX)
        if not (home / ".done").exists():
            shutil.rmtree(home, ignore_errors=True)
            home.mkdir(parents=True)
            shutil.copy2(app / "package.json", home / "package.json")
            shutil.copy2(lock, home / "package-lock.json")
            t = time.time()
            r = subprocess.run([str(NODE_BIN / "npm"), "ci", "--no-audit", "--no-fund", "--loglevel=error"], cwd=home,
                               env=clean_env(), capture_output=True, text=True, timeout=1200)
            if r.returncode:
                raise RuntimeError(f"npm ci failed for {app}:\n{(r.stdout + r.stderr)[-1500:]}")
            (home / ".done").write_text(time.strftime("%Y-%m-%d %H:%M:%S\n"))
            note = f"installed in {time.time() - t:.0f} s"
    dst = app / "node_modules"
    shutil.rmtree(dst, ignore_errors=True)
    if not (home / "node_modules").is_dir():   # a lockfile with no packages: npm ci makes no node_modules
        return note
    r = subprocess.run(["cp", "-al", str(home / "node_modules"), str(dst)], capture_output=True, text=True)
    if r.returncode:   # another file system: a real copy
        shutil.copytree(home / "node_modules", dst, symlinks=True)
    return note


# ------------------------------------------------------------------ one run
def load_lab(folder: Path) -> dict:
    p = folder / "lab.json"
    if not p.is_file():
        raise FileNotFoundError(f"{folder}: no lab.json")
    lab = json.loads(p.read_text(encoding="utf-8"))
    names = [r.get("name") for r in lab.get("runs", [])]
    if not names or len(set(names)) != len(names) or None in names:
        raise ValueError(f"{p}: runs need unique names")
    return lab


def lab_rel(folder: Path) -> Path:
    """Where a lab folder sits under labs/ (module-01/l1_1-...); a folder elsewhere (a template) -> module-99/<name>."""
    try:
        return folder.resolve().relative_to(LABS.resolve())
    except ValueError:
        return Path("module-99") / folder.name


def shared_install(labs_dir: Path) -> str:
    """The kit's shared labs/package.json + package-lock.json into labs_dir, node_modules hard-linked from the cache."""
    for name in ("package.json", "package-lock.json"):
        src = LABS / name
        if not src.is_file():
            raise FileNotFoundError(f"{src} is missing: the shared install of every lab (lab_templates/labs-root/)")
        shutil.copy2(src, labs_dir / name)
    return ensure_modules(labs_dir)


def fresh_copy(folder: Path) -> tuple[Path, Path]:
    """-> (the copy's top folder, the lab folder inside it: <top>/labs/<rel>) with the shared install in <top>/labs."""
    WORK.mkdir(parents=True, exist_ok=True)
    top = WORK / f"lab-{os.getpid()}-{int(time.time() * 1000) % 100000}"
    dst = top / "labs" / lab_rel(folder)
    shutil.copytree(folder, dst, ignore=shutil.ignore_patterns(*SKIP_NAMES))
    return top, dst


def _verdict(run, code, out):
    want = run.get("exit", 0)
    problems = []
    if want == "nonzero":
        if code == 0:
            problems.append("exit 0, expected a failure (nonzero)")
    elif code != int(want):
        problems.append(f"exit {code}, expected {want}")
    for text in run.get("expect", []):
        if text not in out:
            problems.append(f"output lacks {text!r}")
    for text in run.get("absent", []):
        if text in out:
            problems.append(f"output should not contain {text!r}")
    return problems


def run_one(folder: Path, run: dict, opts) -> tuple[str, str, str]:
    """-> (status PASS/FAIL/SKIP, message, output). opts: dict(api=None|URL, no_api=False, api_dir=None,
    timeout=None)."""
    api = run.get("api")
    if api and opts.get("no_api"):
        return "SKIP", "needs shoreline-api (--no-api)", ""
    own = opts.get("api")
    if api and own and isinstance(api, dict) and api.get("args"):
        return "SKIP", f"starts the API with {' '.join(api['args'])}: only with a private API (no --api)", ""
    if api and not own and api_dir(opts) is None:
        return "SKIP", "needs shoreline-api: none found (--api-dir PATH or --api URL)", ""
    top, work = fresh_copy(folder)
    proc = None
    stray = []
    try:
        cwd = work / run.get("dir", ".")
        if not cwd.is_dir():
            return "FAIL", f"dir {run.get('dir')!r} does not exist", ""
        if run.get("course"):
            src = course_download(run["course"])
            if src is None:
                return "SKIP", f"needs the course download downloads/{run['course']}/ (run it from the course repo)", ""
            dst = cwd / run.get("into", "shoreline")
            shutil.copytree(src, dst, ignore=shutil.ignore_patterns(*SKIP_NAMES, "README.txt"))
            for app in sorted(x for x in dst.iterdir() if (x / "package-lock.json").is_file()):
                ensure_modules(app)
        note = " ".join(x for x in (shared_install(top / "labs"), ensure_modules(cwd)) if x)
        url = own or ""
        if api and not own:
            spec = api if isinstance(api, dict) else {}
            proc, url = start_api(spec.get("port") or session_port(folder), spec.get("args", ()),
                                  spec.get("today", KIT_TODAY), opts)
        metro = str(own_port(session_port(folder, 4500)))
        sub = (lambda t: t.replace("{API}", url).replace("{METRO}", metro)) if url else (lambda t: t.replace("{METRO}", metro))
        for rel, text in run.get("files", {}).items():
            (cwd / rel).parent.mkdir(parents=True, exist_ok=True)
            (cwd / rel).write_text(sub(text), encoding="utf-8")
        timeout = opts.get("timeout") or run.get("timeout", DEFAULT_TIMEOUT)
        code, out = _execute(run, cwd, sub, timeout)
        stray = reap(top)
        if url:
            out = out.replace(url, "{API}")
        out = out.replace(f"localhost:{metro}", "localhost:{METRO}")
        problems = _verdict(run, code, out)
        if stray:
            problems.append(f"left a process running (stopped by PID: {', '.join(map(str, stray))})")
        msg = ("; ".join(problems) if problems else "ok") + (f" ({note})" if note else "")
        return ("FAIL" if problems else "PASS"), msg, out
    except subprocess.TimeoutExpired:
        return "FAIL", "timed out", ""
    except Exception as e:                                       # noqa: BLE001
        return "FAIL", f"{type(e).__name__}: {str(e)[:400]}", ""
    finally:
        reap(top)
        stop_api(proc)
        shutil.rmtree(top, ignore_errors=True)


def _execute(run, cwd: Path, sub, timeout):
    if not run.get("cmd"):
        return 1, "no cmd"
    env = clean_env({k: sub(v) for k, v in run.get("env", {}).items()})
    pr = ptyrun()
    cmd = sub(run["cmd"])
    tty = run.get("tty")
    if tty is None:     # every command in a terminal, like a learner's (tsc, Jest, expo print differently)
        tty = bool(pr and pr.available()) and not re.search(r"(?<![&>])&(?![&>])\s*($|\n)", cmd)
    if tty:
        rc, text = pr.pty_run(["bash", "-c", cmd], cwd, env, timeout=timeout)
    else:
        r = subprocess.run(["bash", "-c", cmd], cwd=cwd, env=env, stdout=subprocess.PIPE,
                           stderr=subprocess.STDOUT, timeout=timeout)
        rc, text = r.returncode, r.stdout.decode("utf-8", "replace")
    return rc, text.rstrip()


# ------------------------------------------------------------------ static checks of a lab folder
def _test_script_watches(d: Path) -> bool:
    try:
        script = json.loads((d / "package.json").read_text(encoding="utf-8")).get("scripts", {}).get("test", "")
    except Exception:  # noqa: BLE001
        return False
    return "--watch" in script


def lint_lab(folder: Path, lab: dict) -> list[str]:
    bad = []
    if not (folder / "TASKS.md").is_file():
        bad.append("no TASKS.md (the learner's task sheet)")
    for d in ("starter", "solution"):
        if not (folder / d).is_dir() and folder.name != "l1_0-orientation":
            bad.append(f"no {d}/ folder")
    for run in lab["runs"]:
        cmd = run.get("cmd", "")
        if run["name"].startswith("starter") and run.get("exit", 0) != "nonzero" and not run.get("expect"):
            bad.append(f"run {run['name']}: a starter must fail where it should (exit \"nonzero\" or an expect text)")
        if run["name"].startswith("solution") and run.get("exit", 0) != 0:
            bad.append(f"run {run['name']}: a solution exits 0")
        if run.get("api") not in (None, True, False) and not isinstance(run.get("api"), dict):
            bad.append(f"run {run['name']}: api is true or {{\"args\": [...]}}")
        if "cmd" not in run:
            bad.append(f"run {run['name']}: needs cmd")
        for port in sorted(RESERVED_PORTS):
            if re.search(rf"(?<![\d.]){port}(?!\d)", cmd + json.dumps(run.get("env", {}))):
                bad.append(f"run {run['name']}: names port {port} (the learners' or the course tools'): use {{API}} / {{METRO}}")
        if re.search(r"\bexpo\s+(start|serve)\b", cmd) and "{METRO}" not in cmd:
            bad.append(f"run {run['name']}: expo start/serve needs --port {{METRO}} (never Metro's 8081)")
        if re.search(r"\bnpm (test|t)\b", cmd) and "--watchAll=false" not in cmd \
                and _test_script_watches(folder / run.get("dir", ".")):
            bad.append(f"run {run['name']}: the test script watches (--watchAll): add -- --watchAll=false or it never ends")
    for d in ("starter", "solution"):
        pj = folder / d / "package.json"
        if (folder / d / "package-lock.json").is_file():
            bad.append(f"{d}/package-lock.json: labs use the ONE shared install (labs/package.json); no lockfile per lab")
        if pj.is_file():
            try:
                pkg = json.loads(pj.read_text(encoding="utf-8"))
            except ValueError:
                bad.append(f"{d}/package.json is not JSON")
                continue
            if pkg.get("dependencies") or pkg.get("devDependencies"):
                bad.append(f"{d}/package.json lists dependencies: packages come from the shared labs/package.json "
                           "(a missing package is a request to the coordinator)")
            for name, script in pkg.get("scripts", {}).items():
                if "node_modules/" in script and "../../../node_modules/" not in script:
                    bad.append(f"{d}/package.json script {name!r}: the packages are three folders up "
                               "(../../../node_modules/...), in labs/")
    sol_dirs = {r.get("dir", ".") for r in lab["runs"] if r["name"].startswith("solution")}
    for d in sorted(sol_dirs):
        if (folder / d / "tsconfig.json").is_file() and not any(
                r["name"].startswith("solution") and r.get("dir", ".") == d
                and re.search(r"\btsc\b|npm run (check|typecheck)\b", r.get("cmd", "")) for r in lab["runs"]):
            bad.append(f"{d}/ has a tsconfig.json but no solution* run type-checks it (npm run check / typecheck / "
                       f"tsc): Jest and Node run code without checking types")
    for nm in folder.rglob("node_modules"):
        bad.append(f"{nm.relative_to(folder)}: node_modules must not be in the kit (lockfiles only)")
        break
    return bad


def lab_folders(target: str) -> list[Path]:
    if target == "--all":
        return sorted(p.parent for p in list(LABS.glob("module-*/*/lab.json")) + list(LABS.glob("projects/*/lab.json")))
    p = Path(target)
    if not p.is_absolute():
        p = LABS / target
    if (p / "lab.json").is_file():
        return [p]
    found = sorted(x.parent for x in p.glob("*/lab.json"))
    if not found:
        raise SystemExit(f"no lab.json under {p}")
    return found


def main(argv=None):
    argv = list(sys.argv[1:] if argv is None else argv)
    if not argv or argv[0] in ("-h", "--help"):
        print(__doc__)
        return 0
    opts = {"no_api": "--no-api" in argv}
    verbose = "-v" in argv
    only = None
    targets = []
    i = 0
    while i < len(argv):
        a = argv[i]
        if a in ("--api", "--api-dir", "--run", "--timeout", "--dir"):
            val = argv[i + 1]
            if a == "--api":
                opts["api"] = val.rstrip("/").removesuffix("/api")
            elif a == "--api-dir":
                opts["api_dir"] = str(Path(val).expanduser().resolve())
            elif a == "--run":
                only = val
            elif a == "--timeout":
                opts["timeout"] = float(val)
            else:
                targets.append(str(Path(val).expanduser().resolve()))
            i += 2
            continue
        if a == "--all":
            targets.append("--all")
        elif not a.startswith("-"):
            targets.append(a)
        i += 1
    folders = [f for t in targets for f in lab_folders(t)]
    counts = {"PASS": 0, "FAIL": 0, "SKIP": 0}
    t0 = time.time()
    for folder in folders:
        try:
            lab = load_lab(folder)
        except (ValueError, FileNotFoundError, json.JSONDecodeError) as e:
            print(f"FAIL  {folder}: {e}")
            counts["FAIL"] += 1
            continue
        rel = folder.relative_to(LABS) if LABS in folder.parents else folder
        for problem in lint_lab(folder, lab):
            print(f"FAIL  {rel}: {problem}")
            counts["FAIL"] += 1
        for run in lab["runs"]:
            if only and run["name"] != only:
                continue
            t = time.time()
            status, msg, out = run_one(folder, run, opts)
            counts[status] += 1
            print(f"{status:<5} {rel} [{run['name']}] {msg} ({time.time() - t:.1f} s)", flush=True)
            if verbose or status == "FAIL":
                print("      " + "\n      ".join((out or "(no output)").splitlines()[-60:]))
    print(f"\n{counts['PASS']} passed, {counts['FAIL']} failed, {counts['SKIP']} skipped "
          f"({len(folders)} lab folder(s), {time.time() - t0:.0f} s)")
    return 1 if counts["FAIL"] else 0


if __name__ == "__main__":
    sys.exit(main())
