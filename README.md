# THE PATH

A walking simulator adapted from **THE PATH** by TLLOA (`STORY/PATH.pdf`).

The source is a 964-word prose poem in two interleaved voices, cut apart by a `…` glyph:
**the Traveler**, barefoot on a path he cannot remember starting, and **the Watcher**, in a
ruined turret with cold tea and a great lens aimed down the valley, tormented every night by
knocking at a door he will not open. They are watching each other. The last page is the first
page with the memory removed.

---

## Play

The game is a static site in [`docs/`](docs/). Serve it over HTTP — ES modules will not load
from `file://`:

```sh
cd docs && python3 -m http.server 8000
# then open http://localhost:8000
```

Mouse to look, **W A S D** to walk, **E** or click to act, **Esc** to release the cursor,
**M** to mute. Headphones recommended. `?ch=4` starts at a given chapter.

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

`docs/` is ready to serve as a GitHub Page. In **Settings → Pages**, set *Source* to
**Deploy from a branch**, then choose the branch and the **`/docs`** folder.
