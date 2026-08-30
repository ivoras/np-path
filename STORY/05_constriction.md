# Chapter 05 — CONSTRICTION

> **Source:** PATH.pdf pp. 21–24
> **Runtime:** 18–22 min
> **Voices:** Merged/Traveler → Watcher
> **Cuts:** 2 — and the player loses the ability to tell which side they are on
> **Puzzle:** Passage Refused (the pebble economy resolves)
> **Coda:** *"The one that lost. / Dissolution. / The burden."*

---

## 1. Thematic Function

Chapter 04 opened everything — an island, a sky, a burst. Chapter 05 does the opposite, and does
it physically: **the world narrows around the player until there is room for exactly one body,
and there are two of them.**

Three loads:

1. **The Figure is finally reached.** It has been standing in the game since Chapter 01 minute
   four. It has never moved except to turn its head once. Now the player walks into it and does
   not walk out.
2. **The pebbles are spent.** Four chapters of a resource nobody explained. It resolves here, and
   the resolution is that the player gives away the last white thing they own and takes its place.
3. **The Watcher's world ends first, and inward.** *"The turret started to disintegrate inwards. I
   reach outwards."* The two clauses point in opposite directions and the level must stage that
   literally.

---

## 2. Spatial Flow

| # | Space | Verb | Duration |
|---|---|---|---|
| 1 | **The Narrowing** — a passage that begins as open moor and closes over ten minutes | Walk. It gets tighter. | 10 min |
| 2 | **The Refusal** — the Figure, immobile, in a gap too small to pass | **PUZZLE** | 7 min |
| 3 | **The Merge** | Step in | 90 s |
| — | **CUT** | | |
| 4 | **The Turret, collapsing** — inward, in slow motion, around a man who will not leave | Stay. Then reach. | 4 min |

### The Narrowing — level-design spec

Beat 1 is the most technically important level in the game and the whole chapter rests on it
working invisibly.

**The player must not notice they are being compressed until they cannot turn around.**

Implementation:
- Begin as **open moor at dusk** — indistinguishable from the game's opening, deliberately. Same
  bone path, same ember verges. Players should half-think they have looped already.
- Introduce vertical elements at the verges: first the Ones That Lost, standing off the path at
  forty metres; then at twenty; then at eight. **They are the walls.** The passage narrows because
  more of them are standing closer to it. This is the single best idea available to this chapter
  and it should carry the whole beat.
- Then rock, then the rock leaning in, then rock overhead. The sky closes last, and it closes as a
  *seam*, like the egg's, not as a ceiling.
- **No corridors.** Nothing here should read as architecture. It is a landscape with less and less
  room in it.
- **Do not use invisible walls.** (The single most-cited failure in the reference games.) The
  passage is physically narrow; the player's collision capsule genuinely will not fit. When they
  cannot go somewhere it is because there is stone there, at head height, visible, with light on
  it.
- **Backtracking is possible for the first eight minutes and pointless.** Turning around shows a
  passage that is exactly as narrow behind as ahead. The player did not come through anything
  wider. Let them check. Let them check twice.

### The Ones That Lost — payoff

Established in Ch. 01 (two, on the horizon), Ch. 02 (two, in the scrub, closer), Ch. 03 (they
drifted, for two seconds). Here they are the environment.

- Human-scaled, bone-and-fabric, standing, facing the path. **Never posed identically** — sculpt
  every one, no instancing at close range (the *no cheap repeated textures* discipline from the
  reference pipeline is load-bearing here; a player who spots a duplicate loses the chapter).
- **Decay as a skin over intact structure**, per the reference grammar: they are not rubble. The
  anatomy underneath is correct and unbroken; what is wrong is on the surface — calcification,
  fabric fused to bone, a bloom of something white.
- They do not react, ever. No head-turns, no audio, no eye-lines. **If a single one of them moves,
  the chapter becomes a horror game and stops being this one.**
- At the tightest point, the player must brush past them. Contact plays a dry, light, papery
  foley — and the body gives slightly, which is worse than if it did not.

---

## 3. THE PUZZLE — *Passage Refused*

**Type:** resource sacrifice / spatial compression — the pebble economy's terminus
**Location:** beat 2
**Solve time:** 5–8 min

### Setup

The passage arrives at a gap perhaps sixty centimetres wide. **The Figure stands in it**, facing
the player, at arm's length, filling it entirely.

It is the Figure from the orchard. Same silhouette, same fall of wet fabric, the ivy still at its
ankles though there is no soil here. It has no face to speak of and the game has never resolved
one.

*A figure without motion and no intent. Just a fixed object in space.* You cannot push it, move
it, speak to it, or squeeze past it. Interacting does nothing — not "nothing happens," but
genuinely no interaction prompt has ever existed in this game, so the player will not try for
long.

**And the walls are still closing.** Slowly — about a centimetre every four seconds — but
measurably, and audibly.

### Mechanic

There are **five niches** in the stone of the narrowing passage, at irregular heights, each about
the size of a fist. They are not marked, not lit, not glowing. They are shaped like the pebbles.

The player's hand, when they look down, holds **one white pebble.**

Placing a pebble in a niche **stops that section of wall.** The grinding stops. The section holds.
Five niches, five sections; fill them all and the passage is braced.

The player has one pebble.

### The search

This is where the chapter cashes its cheques. There are exactly four more pebbles available and
every one of them is a callback:

| # | Where | Requires the player to remember |
|---|---|---|
| 1 | In hand | Ch. 03 — they ate one of two; this is the other |
| 2 | **In the ash still on their own feet**, from the egg hill. Look down at your feet and hold. | Ch. 04 |
| 3 | **Embedded in the calcified surface of one of the Ones That Lost.** Only one of them has it, and it is at chest height, and it is white on white. | Ch. 05 — that they are made of the same substance as the path |
| 4 | **In the strike-marks on a bone chip** carried out of Ch. 04 without knowing. In the other hand. Look at the other hand — the game has never once asked the player to do this. | Ch. 04 |
| 5 | **Does not exist.** | — |

Four pebbles. Five niches. The player will search for a long time for the fifth, and there is no
fifth, and the searching is the puzzle.

### Solve

With four niches braced, one section is still closing — **the one the Figure is standing in.**

The only white object left in the world is the player.

The solve is to **step into the gap beside the Figure** and stand there. Walk into the narrowing
section, put your body in it, and stop.

The moment the player stands still in that gap, the walls close on both of them.

- *"Pebbles. Insulting the dark with white."* — the four braced niches glow bone against the black.
- *"A clash of white and dark closing in to crush it."*
- *"Flattened."* — the camera FOV compresses hard, to ~35°, and the image squeezes horizontally.
- *"Expanded."* — FOV snaps to 120° and the image stretches. One frame between them, bone white.
- *"Silenced."* — everything to `-inf`.
- *"Remade together without purpose."* — the image resolves. The player is standing where the
  Figure was. **The Figure is gone. The player casts no shadow, and neither did it.**
- *"We continue."* — the passage ahead is open. Walk.

### Why this puzzle

- It is the game's only resource system, and it exists solely so that the player can **run out**.
  A currency introduced four chapters early, never explained, never counted on screen, and spent
  down to zero at the exact moment the story requires a sacrifice.
- The fifth pebble's non-existence is honest, not cruel: the game has been telling the player since
  the cover image that a person on the path is a small white shape, the same as a pebble. The
  solution is available to anyone who has been *looking* rather than *inventorying*.
- Stepping into the gap is the first time in the game that the player chooses to **stop moving**,
  and it is the only time stopping is the answer. Chapter 01 made stasis a punishment. Chapter 05
  makes it the solve.

### Assist

- After 4 min at four niches: the camera does an involuntary, slow, one-second drift to the empty
  fifth niche, then back. Once.
- After 6 min: the player's hands, both empty, rise into the bottom of the frame and stay there
  for three seconds. They are white.
- **Never** highlight the gap. Never add a prompt. If a player is truly stuck past ten minutes,
  the walls close anyway and the chapter proceeds — with the merge happening *to* them rather than
  *by* them. Both readings are true. Do not tell them which one they got.

---

## 4. Voice-Over Script

**Verbatim from PATH.pdf.**

Note: **page 22 has no `…` before its first line.** Every other prose page in the book opens with
the switch glyph; this one does not. The voice here is neither and both. Play the whole of beat 2
in the **merged voice from Ch. 04**, and do not return to the separated voices until the Cut.

| # | Trigger | Line (verbatim) | Treatment |
|---|---|---|---|
| 5.1 | The Figure resolves in the gap | *"A figure without motion and no intent. Just a fixed object in space."* | Merged, 100%. |
| 5.2 | Player looks around; there is nothing else | *"Nothing was around it. Everything narrowed to it."* | |
| 5.3 | First failed attempt to pass | *"Passage refused."* | The only two-word line in the book that functions as a game-system message. Deliver it flatter than flat. |
| 5.4 | First pebble placed in a niche | *"Pebbles. Insulting the dark with white."* | |
| 5.5 | Fourth pebble placed | *"A clash of white and dark closing in to crush it."* | |
| 5.6 | Player stands in the gap; walls contact | *"Flattened."* | See §3 for the FOV choreography. Each of these four words gets its own frame-exact treatment. |
| 5.7 | | *"Expanded."* | |
| 5.8 | | *"Silenced."* | Into `-inf`. Four seconds. |
| 5.9 | Image resolves, player is where the Figure was | *"Remade together without purpose."* | |
| 5.10 | Passage opens ahead | *"We continue."* | Whispered. First-person plural, and by now it is simply accurate. |
| — | **CUT** | | |
| 5.11 | Turret, collapsing inward, dust | *"Even when it started crumbling I stayed."* | Watcher — **but the merge is at 30% and will not go lower.** He does not get his voice back. |
| 5.12 | | *"Yesterday. This was an echo."* | Process the word *"echo"* with a real, long, decaying echo — the only literal-minded effect in the game. It is allowed once, here, because the book is being literal-minded here. |
| 5.13 | Player looks at the parapet: the cups | *"The cups empty."* | Both cups are there. Both are empty. The second one, which he never fetched, is there anyway. |
| 5.14 | Player looks at where the pebbles were | *"Pebbles gone."* | The parapet is bare. Match the Ch. 01/02 camera framing exactly so the emptiness is legible. |
| 5.15 | The floor gives | *"Collapse."* | |
| 5.16 | | *"The winds howled. The trees swayed in the dusk. The turret started to disintegrate inwards."* | The trees are visible from the turret for the first time — the same dead orchard from Ch. 01, which means the mansion was always the house in the orchard. **Do not remark on this in any way.** |
| 5.17 | Final action of the chapter: the player holds a direction — outward, over the parapet — while the room falls inward | *"I reach outwards."* | The two directions must be simultaneous and opposed on screen. Then black. |

### Coda card

```
The one that lost.
Dissolution.
The burden.
```

**"The one that lost"** — singular. The game has spent four chapters saying *the Ones That Lost*,
plural. Set this card with the singular clearly legible; some players will catch it.

---

## 5. Visual Design

### The compression, as a lighting problem

The chapter's whole visual arc is **the loss of the horizon**, and the horizon has been the game's
only light source since minute one (twilight on the vanishing point). As the passage narrows:

| Stage | Key light |
|---|---|
| Open moor | Full twilight key on the vanishing point. Ember rims. Identical to Ch. 01. |
| Ones That Lost as verges | Key survives, but the figures occlude it — the path is now lit in **slats**, bright/dark/bright, as you pass between them |
| Rock closing | Key reduced to a vertical strip of sky. Everything is silhouette. |
| Overhead seam | Key is a **line**. A single bright seam directly above, exactly like the egg's fracture. |
| The gap | Key gone. The only light is the four braced pebbles, bone, from four points. |

That last state — a figure lit from four small white points in total darkness — is the chapter's
signature image and should be the marketing frame.

### Palette

- **Moor black** dominates to a degree nothing else in the game approaches. Target 80% of the
  frame below 10% luminance for the final five minutes.
- **Bone** is the pebbles, the Ones That Lost, and the player.
- **Ember** appears **once**: the last of the blood on the hands, seen when they rise into frame
  during the assist. After the merge, it is gone — the player's hands are clean and bone-white.
- **Petrol** survives only in the strip of sky, and dies with it.

### The Ones That Lost — surfacing

Follow the reference grammar precisely: **infected and decayed while still maintaining an
architectural structure underneath.** Their forms should be readable as human at a hundred metres
in fog — silhouette-first, sculpt-driven, no reliance on normal maps that flatten at distance.

Surface: bone, fabric, and a white efflorescent bloom, treated as **one continuous substance**.
Cloth calcifies into shell; shell frays into cloth. There should be no material boundary anywhere
on them. This is the single Beksiński trait that translates most directly and it is worth the
sculpt time.

### The turret collapse

*Disintegrates inwards.* Not a building falling down — a building **falling into itself**, as if
the room's volume is being subtracted from the middle outward. Stone travels toward the centre.
Dust goes up.

- The Watcher does not move. The player has control and can walk; the exits are gone; there is
  nowhere to go and nothing chasing them. **It is not a set-piece escape.** It is watching a room
  end while standing in it.
- The last controllable action is holding a direction outward, over the parapet, against a room
  moving inward.
- **No debris damage, no health, no fail.** If the player walks into falling stone, the stone
  passes through them. They are not in the room in a way that stone can affect.

### Post

Misregistration climbs steadily through the narrowing — 6 px at the start of beat 1, **18 px** at
the merge, which is enough to fully separate the plates and read as three superimposed images.
On *"Remade together without purpose,"* it collapses to 2 px and stays there for the rest of the
game. Never zero again.

### Signature frames

- The path between two ranks of standing figures, lit in slats.
- The seam of sky overhead, a bright line, identical in shape to the egg's fracture.
- The Figure filling a sixty-centimetre gap at arm's length.
- Four white pebbles glowing in four black niches.
- The turret interior falling toward its own centre with a man standing still in it.

---

## 6. Audio Design

### The narrowing, as a reverb automation

The chapter's audio is **one continuous forty-minute reverb move**, and if it is done well nobody
will hear it happening.

- Beat 1 opens with the moor's ambience: no early reflections, huge diffuse tail, wind.
- As the passage narrows, **shorten the pre-delay and raise the early reflections**, continuously,
  never in steps. The player's own footsteps come back at them sooner and sooner.
- By beat 2, reflections arrive in under 8 ms and the tail is nearly gone. The player is in a
  space the size of their own body and every sound they make hits them immediately.
- **The stone-grind of the closing walls** is the bed for the entire puzzle. Sub-heavy, granular,
  and — critically — **it stops, per-section, when a pebble is placed.** The player can hear how
  many walls are still moving. This is the puzzle's only feedback and it is entirely audio.

### The Ones That Lost

They make no sound. But the **wind changes** as you pass them: a distinct, close, hollow tone as
air moves through a body-shaped obstruction, different for every one of them. Recorded, not
synthesised. Thirty-odd assets. This is expensive and it is the difference between a corridor of
props and a place where things are standing.

### The merge

- *"Silenced."* → all buses `-inf`, 4 s.
- The return is not a swell. It is **the wind, from the far side of the gap, alone**, at a low
  level, and it takes nine seconds before anything else joins it.
- Footsteps after the merge are **different assets**. Slightly heavier. Two people's worth. Never
  mentioned.

### The turret

- The collapse is mixed *quietly*. The instinct is to make it enormous; resist. Stone moving
  inward should sound like furniture being moved in the flat above — close, dull, unhurried.
- The wind, meanwhile, is at full and comes from **outside**, through the parapet, and it is the
  loudest thing in the scene. *I reach outwards.*
- **The knocking does not appear in this chapter.** Its absence, after four chapters, is the loudest
  thing in the game. Nobody knocks because the knocker is inside now.

### Score

Bass and pump organ only, and both are playing **one held note** for the entire chapter — the root
of the Ch. 01 chord, alone, with no harmony above it. The chord that never resolved has been
reduced to its own root. It fades out entirely at the merge and does not return before the coda.

---

## 7. Continuity Ledger

| Item | Entering | Leaving |
|---|---|---|
| Traveler pebbles | 1 | **0** — four placed, one was never found |
| Parapet pebbles | 4 | **0** — *"Pebbles gone."* |
| Teacups | 1 on parapet, 1 unreached on the shelf | **both on the parapet, both empty.** Never explain how. |
| The Figure | standing since Ch. 01 | **gone; the player is where it was** |
| Ones That Lost | distant | **the walls**; then behind |
| The turret | cracked floor | **disintegrated** |
| Voices | merged 100% at Ch. 04 climax, then separated | **merge floors at 30% and never goes below** |
| Player's hands | bloodied since Ch. 03 | **clean, bone-white** |
| Player's shadow | none (has never had one) | still none — but now the player has *noticed*, because the Figure had none either |
| Misregistration | 6 px | **2 px, permanent** |
| The knocking | — | **absent for the first time since Ch. 01** |

---

## 8. Exit

Black, with wind, for eight seconds — the longest hold in the game.

Coda card. Then the wind stops mid-gust, cut off, and there is nothing at all.

Title card: **ABSENCE**.
