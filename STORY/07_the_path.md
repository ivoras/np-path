# Chapter 07 — THE PATH

> **Source:** PATH.pdf pp. 27–28
> **Runtime:** 12–15 min, then the loop
> **Voices:** One. The first voice. See §4.
> **Cuts:** 1 — the last one, and it is the first one
> **Puzzle:** The Confused Shadow (light-source resolution)
> **Coda:** the book's first page

---

## 1. Thematic Function

The last page of the book is the first page of the book, emptied out. Compare them directly:

| PROLOGUE (p. 3) | THE PATH (p. 28) |
|---|---|
| *"The path is. As far back as I can remember, it was. It will be."* | *"I get up. A path of white cutting through a moor."* |
| *"Rain. A broken fence. Drenched to the bone, mud on my bare feet."* | *"Dusk. My shadow is confused. The air is thick with salt."* |
| *"My memory is useless. What is left is to keep moving."* | *"My feet start walking. I feel nothing."* |

Same moor, same dusk, same bare feet, same forward motion. What has been removed is the memory,
the rain, the fence, the orchard, the house, the figure — and the feeling.

**The chapter's job is to make the player recognise the loop and then walk into it anyway.**

Not as a twist. Not as a reveal with a sting. The player should arrive at the recognition roughly
four minutes before the game confirms it, sit with it, and then be given the option to stop —
which they will not take, because the game has spent two and a half hours teaching them that
there is nothing to do but keep moving.

---

## 2. Spatial Flow

| # | Space | Verb | Duration |
|---|---|---|---|
| 1 | **The Moor** — dusk, salt air, a white path through black heather | Get up. Walk. | 5 min |
| 2 | **The Long Walk** — the path runs dead straight to a vanishing point that never gets closer | Keep walking. Notice things. | 4 min |
| 3 | **The Convergence** — **PUZZLE** | Find where your shadows agree | 5 min |
| — | **CUT** — the last one | | |
| 4 | **The Orchard** | — | 90 s |

### Level-design rules

- **Beat 1 is a shot-for-shot restaging of the game's opening**, with three differences the player
  is expected to find on their own:
  1. **It is not raining.** The Prologue's rain was the loudest thing in the game; here there is
     none, and the silence where the rain should be is the chapter's first unease.
  2. **The fence is not broken.** It is not there at all. There is no fence.
  3. **The path is straight.** In the Prologue it wound. This one runs true to the horizon —
     because it was drawn by something that was not a person walking. (The player drew a crooked
     one in Ch. 06. This is not that one.)
- **The vanishing point does not approach.** Over four minutes of beat 2, the horizon's apparent
  distance is held constant by translating the far terrain with the player at a ratio of ~0.97.
  The player *is* making progress — the near terrain passes normally — but the destination does
  not resolve. Do not make this obvious; 0.97 is chosen to be below the perceptual threshold for
  a single glance and above it for four minutes of glances.
- **Landmarks recur.** Place a distinctive object — a single dead tree, leaning — at intervals
  along the path. It is the same tree. It leans the same way. The interval shortens: 90 s, then
  70 s, then 50 s, then 35 s. By the fourth pass most players will have stopped and looked at it
  properly.
- **The Ones That Lost are on the moor again**, at distance, facing the path. There are more of
  them than in Chapter 05. One of them is much closer than the others, standing in the heather
  about fifteen metres off the path, and it is wearing what the player has been wearing.

---

## 3. THE PUZZLE — *The Confused Shadow*

**Type:** light-source resolution / positional
**Location:** beat 3
**Solve time:** 4–6 min

### Setup

*Dusk. My shadow is confused.*

For the entire game the player has cast **no shadow at all**. In this chapter, from the first
frame, they cast **two**.

- One falls **ahead**, thrown by something behind them.
- One falls **behind**, thrown by something ahead.
- Neither light source is visible. The sky is a flat dusk gradient in both directions.
- The two shadows are different lengths, and both lengths change as the player moves — not
  consistently with each other.

Nothing draws attention to this. It is simply true from the moment the player stands up, and the
first thing most players do in a game where they have never had a shadow is look down.

### Mechanic

The two shadows are cast by two real, invisible directional lights:

- **Light A** is at the vanishing point ahead — the twilight the player has walked toward since
  minute one.
- **Light B** is *behind and below the horizon*, and it is at the position of the egg from
  Chapter 04.

The player can move anywhere on the moor. As they move, the angle between the two shadows changes.
There is exactly **one location** on the map where the two shadows lie along the same line and the
same length — where they resolve into **one shadow**, pointing directly away from the player, down
the path.

Finding it requires no tool and no information beyond looking at the ground and walking. Warm/cold
feedback is entirely in the shadows themselves: as the player nears the convergence point, the two
shadows close on each other visibly and the ground darkens where they overlap.

The convergence point is **off the path**, in the heather — about twelve metres to the left, next
to the close-standing figure of the Ones That Lost.

### Solve

Standing in the convergence, the player has one shadow, and it is long, and it points down the
path toward the vanishing point.

Then three things happen, in this order, with nothing said:

1. **The figure standing beside them casts no shadow.** The player is close enough to see this
   clearly.
2. **The vanishing point resolves.** The horizon, which has refused to approach for nine minutes,
   is suddenly legible: a broken fence, a dead orchard, and beyond it a house with no roof and one
   wall collapsed. It has been four minutes away this whole time.
3. **The player's single shadow lengthens** until it reaches the orchard — a shadow four hundred
   metres long, which is not possible, and which lies along the path exactly like a path.

*The path is where a body's shadow fell.*

Then the last VO line, then the Cut.

### Why this puzzle

- It is the only puzzle in the game with **no interaction verb at all** — not even a hold. It is
  pure position. The final test of a walking simulator should be a test of *where you stand*.
- It pays off a two-and-a-half-hour absence. The missing shadow is the game's longest-running
  withheld detail, planted in Ch. 01 §5, and no player will have consciously registered it. When
  it arrives doubled, the wrongness is available instantly even to someone who never noticed it
  was gone.
- The convergence being **off the path** is the chapter's argument. The player has been taught for
  two hours that leaving the path is transgression (Ch. 01 forbade it; Ch. 02 marked it with a
  title card). The final solve requires it, and nothing bad happens, and it turns out the
  destination was visible from there all along.
- Light B is the egg. The thing that hatched is behind the player, casting them forward. Nobody
  says this. It is available to anyone who checks the angle.

### Assist

- At 3 min: the two shadows briefly, once, snap into alignment for half a second wherever the
  player happens to be standing — showing them what the goal state looks like — then separate.
- At 5 min: the close-standing figure in the heather becomes fractionally more contrasted against
  the moor. It is standing at the convergence. It has been the marker all along.

---

## 4. Voice-Over Script

**Verbatim from PATH.pdf.** Nine lines. They are the last nine lines of the book.

### The voice

**The Traveler's voice from Chapter 01, unprocessed, unmerged, exactly as recorded on day one.**

Not the merge, not the stripped voice of Ch. 06 — the original take, the dry close mic, the man
from the opening minute. Use the *same session*, the same mic, the same room, and if possible
record Chapter 07's lines **on the same day as Chapter 01's** and leave them untouched for the
whole production.

The effect: after two and a half hours of a voice being layered, merged, reverbed, stripped and
degraded, it comes back clean, and the cleanness is unbearable.

| # | Trigger | Line (verbatim) | Treatment |
|---|---|---|---|
| 7.1 | Player stands up, first frame | *"I get up."* | |
| 7.2 | The path is visible ahead | *"A path of white cutting through a moor."* | |
| 7.3 | Player looks down and sees two shadows | *"Dusk. My shadow is confused."* | **Singular — "shadow."** He has two and calls it one. Do not let anyone in QA flag this as a bug. |
| 7.4 | ~2 min into the walk | *"The air is thick with salt."* | Salt has been in the game since Ch. 02's black shore and has never been mentioned. |
| 7.5 | Fourth pass of the leaning tree | *"My eyes complain."* | |
| — | **PUZZLE** | | |
| 7.6 | The convergence; the shadows become one | — | **No line.** Four seconds of nothing. |
| 7.7 | The orchard resolves on the horizon | — | **No line.** Eight seconds. Let them look at it. |
| 7.8 | Player takes the first step back toward the path | *"My feet start walking."* | |
| 7.9 | The Cut fires on the last word | *"I feel nothing."* | Flattest read in the game. Not despair — **absence of affect**. He is not sad about it. He is reporting. |

### The last Cut

One frame of bone white. The shutter sound. And then:

**Chapter 01, beat 5.** The orchard, in the rain, the ruined house, and the Figure standing in it —
from the Figure's point of view, looking out at a soaked barefoot traveller standing six metres
away, motionless, in the rain.

Hold for ninety seconds. The player has full control and can look anywhere. They cannot move.
*I was still. Static.*

The rain is the Chapter 01 rain, the same assets, at the same levels. Somewhere far above and
behind, a lens turns and finds focus.

Then, over the top, in the same bone type as every card in the game:

```
THE PATH
```

and after eight seconds,

```
TLLOA
```

Cut to black. No music. Credits roll in silence over the sound of rain on mud, which continues,
unbroken, for the entire credit sequence.

### On endings

**There is one ending and there is no choice.** The reference games both offer branching; this one
should not. The book has one ending, the ending is a loop, and offering the player an escape from
the loop would be the single most damaging thing this adaptation could do to its source.

**No New Game+, no unlocked commentary, no collectible tally on the results screen.** The main menu
after completion is identical to the main menu before it.

---

## 5. Visual Design

### The return of the full palette

Chapter 06 stripped the game to two values. Chapter 07 brings all five back at once, and the
return should feel like colour flooding into a bleached photograph:

- **Bone `#EDE2C2`** — the path, dead straight
- **Moor black `#0B1614`** — the heather, the Ones That Lost
- **Petrol `#16332F`** — the dusk sky, both halves of it
- **Ember `#E0762A`** — the verges, exactly as in Chapter 01, and nowhere else until the shadows
  converge
- **Bruise cyan `#3E6E70`** — the far horizon haze, returned from Ch. 02

**The cover image is the level.** Build beat 2 so that the default walking camera, at default FOV,
with the player centred on the path, reproduces the book's cover composition continuously. Anyone
who has seen the cover is looking at it for four minutes.

### The two shadows

- Both are **hard-edged**. No soft shadows anywhere in this chapter — at dusk with two low sources
  the shadows should be long, sharp, and graphically flat, like cut paper.
- The shadow cast by Light B (the egg, behind) is **warmer at its edge** — a one-pixel ember fringe.
  The shadow cast by Light A (twilight, ahead) is cold, petrol-fringed. When they converge the two
  fringes cancel and the resulting single shadow has **no fringe at all** — the only perfectly
  neutral element in the game.
- The four-hundred-metre shadow at the solve is not a real shadow render. It is a **drawn shape**,
  bitonal, with the Chapter 06 paper-tooth on it, laid over the terrain. The game is showing the
  player that the shadow and the path they drew in the previous chapter are the same object, in
  the same rendering language, and it does this without a word.

### Post

- Misregistration holds at Chapter 05's permanent **2 px** for the whole chapter — until the
  convergence, where it goes to **0** and *stays* at 0 through the Cut, the orchard, the title
  card and the credits. The game ends perfectly registered.

  Perfect registration has meant *something has stopped* three times in this game (Ch. 01 lens
  solve, Ch. 03 coda flip, Ch. 04's ninety seconds). The fourth time, nothing starts again.
- **The vignette returns** in beat 1, after its absence in Ch. 06, and it is heavier than it has
  ever been. By the credits the printed border has closed to about 18% of frame width. The image
  is being squeezed back into a book.
- **The lens smear does not return.** It shattered in Ch. 04 and is gone. There is no longer anyone
  watching through glass, because the watcher is on the path.

### Signature frames

- The cover, live, held for four minutes.
- A pair of legs on white ground with two shadows going opposite ways.
- The leaning tree, fourth pass, with the player stopped in front of it.
- A figure in the heather that is wearing your clothes and has no shadow.
- The orchard, resolving, four hundred metres away, at the end of a shadow.
- The final ninety seconds: rain, a ruin, and a barefoot man standing in the middle distance not
  moving, seen from inside the wall.

---

## 6. Audio Design

### The chapter is never silent

Chapters 03, 04 and 06 each spent an engineered silence. Chapter 07 has none, and this is
deliberate: the loop does not offer a pause. From the first frame to the last credit there is
always something in the mix.

### Ambient

- **Wind on heather** — dry, continuous, mid-heavy, with no gusting structure. It does not build
  and it does not drop. Four minutes of an unchanging bed is its own kind of pressure.
- **Salt.** There is no such thing as the sound of salt air, so build it out of what is missing:
  roll off the high end of the wind by about 3 dB relative to Ch. 01's moor and add a very
  distant, very low surf bed at –44 dB, barely above the floor. Nobody will identify it. Everybody
  will believe the line about salt when it comes.
- **No rain.** The absence of the game's founding sound is the chapter's central ambient decision.
  Players who have been in the rain for two and a half hours will feel exposed.

### Score

The pump organ chord from Chapter 01 — the D minor with the flat fifth that has never resolved —
returns, complete, for the first time since the Prologue.

**It resolves at the convergence.** One chord change, the only one in the game. It goes to the
tonic and it is not triumphant; it is simply the end of a suspension that has been held for two
and a half hours, and it will produce a physical response in anyone who has been paying attention
to the score without knowing it.

Then it fades under the last VO line and does not play over the credits.

### Foley

- Bare feet on dry heather and dry path — the first genuinely *dry* footsteps of the game. No mud,
  no water, no blood, no ash, no paper. Just dust.
- **The limp is gone.** Movement speed returns to 100% for the first time since Chapter 02, and
  nobody is told. The player's body is new.

### The credits

Rain on mud, unbroken, at conversational level, for the full duration. The Chapter 01 asset. It
does not fade at the end — it is cut off, mid-fall, at the last frame.

---

## 7. Continuity Ledger — final state

| Item | State at the end |
|---|---|
| Traveler pebbles | 0 |
| Parapet pebbles | 0 — the parapet no longer exists |
| Teacups | one on the sheet in Ch. 06, one in the collapsed turret. Neither is reachable. |
| The great lens | shattered — but something focuses in the last ninety seconds |
| The Figure | the player was it in Ch. 05; there is one in the orchard in the last shot; it is not the player |
| The Ones That Lost | more of them than ever, one wearing the player's clothes |
| Voices | one, clean, original |
| Player's shadow | two → one → four hundred metres long |
| Player's hands | bone-white, clean |
| Movement speed | **100%** |
| Misregistration | **0, permanent** |
| Vignette | heaviest in the game and still closing |
| The knocking | silent since Ch. 05 — and in the final ninety seconds, from somewhere in the ruin, **it starts again** |

That last row is the whole game. In the final shot the player is standing in the rain outside a
ruined house, watching a figure, while somewhere a lens turns to look at them — and the knocking
begins, and it is not theirs yet, and it will be.

---

## 8. Exit

There is none. That is the point.

The main menu, when it returns, has a single line of type on it that was not there before:

```
The path is.
```
