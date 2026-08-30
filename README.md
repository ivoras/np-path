# THE PATH

A walking simulator adapted from **THE PATH** by TLLOA (`STORY/PATH.pdf`).

The source is a 964-word prose poem in two interleaved voices, cut apart by a `…` glyph:
**the Traveler**, barefoot on a path he cannot remember starting, and **the Watcher**, in a
ruined turret with cold tea and a great lens aimed down the valley, tormented every night by
knocking at a door he will not open. They are watching each other. The last page is the first
page with the memory removed.

---

## Play

The game is a static site in [`docs/`](docs/) — **that is the directory to publish**. There is
no `dist/` and there shouldn't be: the game is authored as plain ES modules behind an importmap
with no build step, and three.js is vendored into `docs/js/vendor/`, so `docs/` *is* the built
artifact. Serve it over HTTP — ES modules will not load from `file://`:

```sh
cd docs && python3 -m http.server 8000
# then open http://localhost:8000
```

**Desktop** — mouse to look, **W A S D** to walk, **E**/click to act, **Esc** for the menu,
**M** to mute. Headphones recommended.

**Phone** — a virtual controller appears automatically on touch devices: left thumb walks
(a floating analog stick), right thumb looks, one button acts, one pauses. Landscape is much
better than portrait, and the game says so. The stick is genuinely analog because two of the
seven puzzles read partial deflection — chapter 04 asks you to hold a specific gait for
thirty-two paces, and chapter 06's line quality depends on how slowly you walk — so a d-pad
would break both.

**Menu** — New · Continue · Start From… · Settings · About. *Continue* resumes at the furthest
chapter reached; *Start From…* lists the chapters you have actually finished. Progress lives in
`localStorage`, per browser. **Esc** or the on-screen button pauses mid-chapter.

**Settings** — look sensitivity, invert horizontal, invert vertical, touch sensitivity,
left-handed layout, force-touch-controls, head bob, field of view, print-effect strength
(grain and misregistration), quality tier, text size, volume, mute. Head bob and print effects
both reach fully *off* deliberately: this game runs two and a half hours, and neither camera
motion nor heavy static grain suits everyone.

`?ch=4` still jumps straight to a chapter.

> **On the password:** the entry gate is a doorbell, not a lock. The page is static and public,
> so the check runs on the visitor's own machine and everything it guards is already in their
> browser. The phrase is stored as a SHA-256 digest, which keeps it out of a casual *view
> source* — and that is the whole of what it does.

---

## Design documents

The game was built from these, and they carry considerably more than the build implements.

| | | Puzzle |
|---|---|---|
| [00](STORY/00_design_bible.md) | **Design bible** | reference analysis, palette, systems, doctrine |
| [01](STORY/01_prologue.md) | **PROLOGUE** | The Great Lens — optical alignment |
| [02](STORY/02_ascent.md) | **ASCENT** | The Cairns — wayfinding in fog |
| [03](STORY/03_inversion.md) | **INVERSION** | The Knock — rhythm from memory |
| [04](STORY/04_expansion.md) | **EXPANSION** | The Footprints — ritual circumambulation |
| [05](STORY/05_constriction.md) | **CONSTRICTION** | Passage Refused — resource sacrifice |
| [06](STORY/06_absence.md) | **ABSENCE** | The Crooked Line — drawing by erasure |
| [07](STORY/07_the_path.md) | **THE PATH** | The Confused Shadow — light-source resolution |

Every puzzle is built from looking, walking, standing, listening, or waiting. Nothing in this
game is a keypad, a lever, or an item carried from A to B. Nothing can kill you.

---

## How it is made

No art assets and no audio files. Every mesh is generated at runtime and every sound is
synthesised in the Web Audio API.

- **`js/engine/post.js`** — the riso stack. Palette-limited render, posterised luminance,
  channel misregistration, screen-locked paper tooth, printed vignette. The misregistration is
  a narrative instrument: perfect registration happens four times in the game and always means
  *something has stopped*.
- **`js/engine/audio.js`** — bowed bass, prepared piano, one detuned pump organ, contact-mic'd
  stone, and a female voice used only as texture. The chord is a D minor with a flat fifth and
  it resolves exactly once, in chapter 7.
- **`js/engine/world.js`** — terrain, the path ribbon, dead orchards, the Ones That Lost, rain.
  Three static lights and a vertically graded sky, after Ares Dragonis's documented rig.
- **`js/engine/vo.js`** — the source text, verbatim, set as typography in the book's own face.
  964 words across the whole game: about 6.4 words per minute.
- **`js/vendor/`** — three.js r160, vendored. No CDN dependency.

---

## Publishing

`docs/` is the site. GitHub Pages has to be switched on once by a repo admin — the Actions
token cannot create the Pages site itself. Either option works:

**A — GitHub Actions** (uses `.github/workflows/pages.yml`, already in the repo)
1. **Settings → Pages → Source: GitHub Actions**
2. Re-run the *Deploy THE PATH to GitHub Pages* workflow, or push to `master` / `mvp1`.

**B — straight from the branch** (no workflow, no Actions minutes)
1. **Settings → Pages → Source: Deploy from a branch**
2. Branch `mvp1`, folder **`/docs`**.

Either way the game lands at `https://ivoras.github.io/np-path/`.
