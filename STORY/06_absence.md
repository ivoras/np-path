# Chapter 06 — ABSENCE

> **Source:** PATH.pdf pp. 25–26
> **Runtime:** 9–12 min — by far the shortest chapter, and the only one with no world in it
> **Voices:** One voice. Neither. See §4.
> **Cuts:** 0 — the only chapter in the game with no Cut
> **Puzzle:** The Crooked Line (drawing by erasure, with your feet)
> **Coda:** none — the book gives ABSENCE no coda, and neither do we

---

## 1. Thematic Function

The whole book is eleven lines long here. It is the thinnest page in the manuscript and it must be
the thinnest chapter in the game — not padded out to match the others, not given a set-piece.
**Its brevity is its content.**

Two loads:

1. **The world is revealed as a drawing, and an unfinished one.** Everything the player has walked
   through — orchard, mountain, island, passage — was drawn. Here they are standing on the sheet
   before it has been finished, and they have to finish it themselves.
2. **The thesis lands.** *Erase. Redraw. A crooked line.* The player draws the path with their own
   feet, and the game does not let them draw it straight, because a person walking cannot draw a
   straight line. That is what the path is. That is what it has always been. **The path is not a
   route through the world; it is the mark a walking body leaves.**

If a player understands only one chapter of this game, it should be this one, and it should take
them nine minutes.

---

## 2. Spatial Flow

There is one space and one beat.

| # | Space | Verb | Duration |
|---|---|---|---|
| 1 | **The Sheet** — an unbounded white ground under a white sky, with no horizon between them | **PUZZLE** — walk | 9–12 min |

That is the entire chapter. No transitions, no reveals, no second location. After five chapters
of accumulating world, the game presents **nothing**, and asks the player to make something out of
it with the only tool they have ever had.

### Level-design rules

- **This is not Chapter 03's white void.** That was a hostile, scaleless, disorienting white with a
  receding hole in it. This one is **flat, calm, matte, and finite-feeling** — like standing on
  paper. The difference must be immediately legible in the first three seconds: Ch. 03's white had
  no floor sound; this one has a very clear, very dry, very close floor.
- **There is a ground plane and it reads as a surface.** The paper tooth — screen-locked everywhere
  else in the game — is, for this chapter only, **world-locked and mapped to the floor**. The
  player is walking on the grain. This is the single visual gag the whole post-processing stack
  has been building toward for two hours.
- **No boundary.** Walk in any direction forever. The chapter does not end by reaching an edge.
- **Two objects exist in the world.** Both are lying on the sheet, some distance apart, and both
  are from the Watcher's turret:
  - **a teacup**, on its side, empty
  - **a white pebble**
  They cast small, precise, hard shadows — the only shadows in the chapter — and the player casts
  none. They are the only proof that anything happened.

---

## 3. THE PUZZLE — *The Crooked Line*

**Type:** subtractive mark-making with the movement verb
**Location:** the sheet
**Solve time:** 7–10 min

### Setup

At the player's feet, running away toward nothing, is **the beginning of a path**: a strip of
moor-black about a metre wide, perhaps eight metres long, drawn on the white ground.

It stops. Mid-stroke. The end is ragged, like a line that ran out of ink.

Somewhere far off — impossible to judge how far, because there is no scale reference — sits a
second fragment of black line. And beyond that, another. Five fragments in all, scattered across
the white, unconnected.

### The discovery

The player walks. And **where they walk, the white comes away.**

Their footfalls lift the white ground in flakes, revealing moor-black underneath. Not a paint
trail — an **erasure**. The white is a layer on top of the dark, and walking wears it off.

Nothing announces this. The player takes four or five steps, turns around out of habit, and finds
that they have made a black mark. The realisation is the whole first minute of the chapter and it
should be allowed to happen in silence.

**The path was never drawn onto the world. It was worn into it.**

### Mechanic

- Each footfall erases a small, irregular patch of white. Patch shape is randomised from a set of
  sculpted alphas — no two footfalls identical, no tiling.
- **The mark is permanent.** Nothing regenerates. The player cannot undo, and the chapter never
  offers a reset.
- Walking slowly wears more (more contact time). Walking briskly wears a thinner, patchier line.
  The player will discover that a good line requires the same **deliberate, unnatural gait** they
  learned in Chapter 04. The two puzzles rhyme, and the second one does not explain the joke.
- **The player cannot walk straight.** Implemented honestly, not as a trick: a very low-frequency
  noise (~0.08 Hz, ±1.5°) is added to the character's heading, at a magnitude below the threshold
  of conscious correction but above the threshold of visible result. Over eight metres it is
  invisible. Over eighty it is a wandering line.
  - Players *will* try to correct it. Sighting on a distant object is the obvious technique — and
    there are no distant objects, because there is nothing in this world but two pieces of
    crockery and some black fragments. The correction is unavailable by level design, not by
    input suppression. **Never fight the player's stick.** Just remove everything they could aim at.

### The goal

Connect the five fragments into one continuous path.

- There is no order requirement and no optimal route. Any topology that joins all five counts.
- **There is no straightness requirement, and this is the point.** The game will accept the ugliest
  possible solution without comment. A player who spends twenty minutes trying to make it neat and
  a player who scrawls it in six have both solved it identically, and the game treats them
  identically. *A crooked line.*
- When the last fragment connects, the erasure **continues on its own** — running away from the
  player across the white in both directions, at walking pace, wearing a path toward and past the
  horizon that does not exist. It does not stop.

### Solve

The player stands on a path they made. It extends past sight in both directions. It is crooked.

Then the two objects — the cup and the pebble — are on it. They were not on it before; the player
routed around them or did not, and either way, they are on it now. *A cup. A pebble. Residue.*

Then the ground beneath the player gives out the last of its white, and the chapter ends by
**fading up to bone rather than down to black** — the only chapter in the game that does.

### Why this puzzle

- It is the game's argument, executed with the game's only verb, in the game's own visual
  language, with no dialogue, no mechanism, and no failure state.
- It retroactively re-reads every previous chapter. The bone-white path the player has followed
  since minute one was the *inverse* of this — there, the world was dark and the path was white;
  here the world is white and the path is dark. **Both are the same operation: the path is where
  the ground has been removed by walking.** The player has been the erasure the whole time.
- It converts the game's most distinctive post-processing choice (the paper tooth) from decoration
  into mechanism, two hours after establishing it.
- And it is the only puzzle in the game whose solution the player is *proud* of and which the game
  refuses to congratulate. It just keeps wearing away.

### Assist

- If the player has not made a mark within 90 s (i.e. they are standing still or circling), the
  camera drifts down to their feet for two seconds. That is all it takes.
- If the player has connected three fragments and stalled for 3 min, the furthest unconnected
  fragment **darkens by about 15%.** Once. No pulse, no outline, no marker.

---

## 4. Voice-Over Script

**Verbatim from PATH.pdf.** The chapter has eleven lines of text and they are all here.

### The voice

Neither the Traveler nor the Watcher, and not the Ch. 04 merge either.

**Spec:** take the merged voice and remove things from it. Strip the reverb entirely. Strip the
breath. Strip the room. Then reduce the bandwidth — roll off below 180 Hz and above 6 kHz — until
what is left is a voice with **no body and no space around it**, dry to the point of sounding
un-recorded. It should sound like the *idea* of the voice rather than a recording of it.

No performance at all. This is the flattest read in the game. The actor should be instructed to
say the lines as if reading a list of items they are checking off, in a room they are about to
leave.

| # | Trigger | Line (verbatim) | Treatment |
|---|---|---|---|
| 6.1 | First footfall of the chapter — the first flake of white comes away | *"Erase."* | Before the player has understood what they just did. |
| 6.2 | Player turns and sees their mark for the first time | *"Redraw."* | Then **four minutes of no VO at all** while they work it out. |
| 6.3 | Second fragment connected | *"A crooked line."* | No emphasis. It is not a judgement. |
| 6.4 | Fourth fragment connected | *"I was. I am. I will be."* | Three tenses, one breath. The only line in the chapter with any weight, and it should be given none. |
| 6.5 | Fifth fragment connects; the erasure begins to run on its own | *"An effect to a cause."* | Note the inversion — not *a cause to an effect*. Do not let the actor "fix" it. Do not let the localisation team fix it either. Flag this line in the loc kit. |
| 6.6 | The cup is on the path | *"A cup."* | |
| 6.7 | The pebble is on the path | *"A pebble."* | |
| 6.8 | Both, together, in one frame | *"Residue."* | |
| 6.9 | The white gives out; fade up to bone | *"I yield."* | Last line before the last chapter. Play it into complete silence and let the fade take eleven seconds. |

**Total spoken content: 24 words, across ten minutes.** That ratio is the game's whole answer to
the over-narration problem (see 00_design_bible.md §6).

### No coda card

The book gives ABSENCE no three-line coda. Every other section has one. **Do not write one.**

Instead: after *"I yield,"* the screen is bone white, empty, silent, and stays that way for
**eleven seconds** with no type on it at all. Players will expect the card. Its absence is the
card.

---

## 5. Visual Design

### The whole palette

Two values.

- **Bone `#EDE2C2`** — the ground, the sky, the air, the light
- **Moor black `#0B1614`** — the path, the fragments, the two objects' shadows

That is the entire chapter. No petrol. No ember. No cyan. **No third value anywhere in the frame**,
including in the shadows of the cup and pebble, which are hard-edged black with no penumbra
because a drawn shadow does not have one.

After five chapters of a five-colour system this reduction should feel like the air being let out
of the game.

### Light

There isn't any, in the physical sense.

- No directional light. No skylight. No fog.
- Everything is **unlit, flat-shaded, and emissive at the same value.** Ground, sky, and the
  player's own hands all sit at exactly `#EDE2C2` with zero shading variation. The image is
  literally flat.
- The two objects and the path fragments are the only non-emissive things, and they are pure
  silhouette.
- **The player still casts no shadow.** They have never cast one. In a chapter where two teacups'
  worth of crockery cast crisp shadows, this becomes conspicuous for the first time — and it is
  the setup for Chapter 07, which is entirely about the player's shadow.

### Texture & post — the inversion of the whole stack

| Effect | Everywhere else in the game | Here |
|---|---|---|
| **Paper tooth** | Screen-locked, on the glass in front of the world | **World-locked, mapped to the ground plane.** You walk on the grain. |
| **Misregistration** | 2–18 px, breathing | **Ember and cyan plates do not exist.** There is nothing to misregister. Set to 0 by virtue of a two-plate image. |
| **Vignette** | Heavy ash-olive printed border | **Removed entirely.** The image bleeds to the frame edge for the only time in the game. |
| **Bloom** | From bone and ember | **None.** Nothing glows. |
| **Posterisation** | ~24 luminance steps | **2 steps.** Pure bitonal. |

The frame should be indistinguishable from a **1-bit print**. If a still from this chapter could be
faxed without loss, it is correct.

### Signature frames

- The first mark: five footprints of black on infinite white, seen from a slightly high angle.
- A single crooked black line running from the bottom of the frame to a vanishing point that is
  not there.
- The overhead shot, if the game ever takes the camera (it does not, but the marketing team will
  want it): the player's completed line as a wandering scrawl across white, with two tiny objects
  on it.
- The final frame: pure bone, no type, eleven seconds.

---

## 6. Audio Design

### The floor

The chapter's audio identity is **one sound**: a bare foot on dry paper.

- Close, dry, papery, with a fine granular crush in it — the sound of the white coming away.
- **No reverb, no room, no tail.** Recorded as dead as physically possible.
- The crush component's level scales with how much white is being lifted, so the player can *hear*
  the quality of the line they are drawing. This is the only feedback the puzzle gives and it is
  enough.

### Everything else

There is no ambient. No wind, no drone, no room tone, no breath. The noise floor is genuinely
empty.

**Score: none.** Chapter 06 has no music of any kind. It is the only chapter that doesn't, and it
sits between two chapters that end and begin with the fullest mixes in the game.

The two objects have sounds if the player walks near them — the cup rocks slightly, ceramic on
paper; the pebble does not move at all. That is the complete SFX list for the chapter: footsteps,
a cup, and nothing.

### The eleven seconds

After *"I yield,"* over the bone-white screen: **absolute silence for eleven seconds.**

This is the third and longest engineered silence in the game (after Ch. 03's six seconds and
Ch. 04's ninety). It is the last one. Chapter 07 will never be silent.

---

## 7. Continuity Ledger

| Item | Entering | Leaving |
|---|---|---|
| Traveler pebbles | 0 | 0 — but one is lying on the ground here, and the player does not pick it up. There is no pick-up interaction. |
| Teacups | both on the collapsed parapet | one is here, on its side, empty |
| Voices | merged, floored at 30% | **stripped to a single bodiless voice** |
| The path | walked | **drawn, by the player, crooked** |
| Player's shadow | none | none — now conspicuous |
| Misregistration | 2 px | n/a (two-plate image) |
| Vignette | present since frame one | **gone** |
| Score | continuous since Ch. 01 | **silent** |

---

## 8. Exit

Eleven seconds of bone white, silent, with no type.

Then the type arrives — but not as a coda. As the last title card of the game, in the same
position and face as every chapter title before it:

**THE PATH**

And underneath it, for the first and only time, the author's name from the cover:

**TLLOA**

Then salt air, and wind, and a moor.
