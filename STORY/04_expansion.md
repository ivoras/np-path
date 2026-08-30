# Chapter 04 — EXPANSION

> **Source:** PATH.pdf pp. 17–20
> **Runtime:** 25–30 min — the longest chapter, and 90 seconds of it are silent
> **Voices:** Merged (see §4) → Watcher → Merged → Traveler
> **Cuts:** 3
> **Puzzle:** The Footprints (ritual circumambulation)
> **Coda:** *"The Silence. / The wait. / The rebirth."*

---

## 1. Thematic Function

This is the chapter where **the two voices stop being two**, and where the game's central image —
the egg on the cover — is finally put in front of the player.

Three loads:

1. **Grammatical collapse.** Page 18 does something the book has not done before: it slides from
   *"I had to protect it"* to *"I watch as you step into my footprints. We wait together to break
   it."* Within one paragraph the voice changes tense, changes pronoun, changes intention
   (protect → break), and **addresses the player directly**. This is the hinge of the entire book
   and it must be the hinge of the game.
2. **Waiting is a verb.** *"I watched. I waited. I waited more."* The chapter must make the player
   actually wait — not watch a cutscene of waiting. The 90-second silence in §6 is the design's
   nerve, and it will be the most divisive ninety seconds in the game. Keep it.
3. **The Watcher loses his instrument.** *"The lens lay shattered. What is left?"* He has looked
   through glass for three chapters. Now he can only look with his eyes, and immediately after,
   the thing he was looking for happens without him.

---

## 2. Spatial Flow

| # | Space | Verb | Duration |
|---|---|---|---|
| 1 | **The Shallows** — waking again, in warm black water this time, wading toward land | Wade | 3 min |
| 2 | **The Foliage** — dense, tall, wet, absolutely silent; no birds, no insects, nothing | Push through | 6 min |
| 3 | **The Clearing Rim** — first sight of the egg across the hill | Stop involuntarily | 1 min |
| 4 | **The Egg Hill** — a small bare hill; the egg at its summit, three times human height | Circle it. **PUZZLE** | 12 min |
| — | **CUT** | | |
| 5 | **The Turret, ruined** — the lens on the flagstones in pieces | Kneel. Look up with your own eyes. | 4 min |
| — | **CUT** | | |
| 6 | **The Wait** — the completed circle; nothing happens | **Do nothing for 90 seconds** | 90 s |
| 7 | **The Burst** | — | 40 s |
| — | **CUT** | | |
| 8 | **The Dark** — waking a third time, in blackness, unable to open the eyes | Open your eyes, slowly, with the trigger | 2 min |

### Level-design rules

- **The foliage is the game's only "green" and it isn't green.** Petrol-black leaves, bone-white
  undersides. When wind moves the canopy the forest flickers between black and white like a
  half-tone screen. This is the chapter's best cheap effect and it costs nothing.
- **Absolute absence of fauna, and make it conspicuous.** Build the foliage with every affordance
  of a living forest — hollows, nests, hives, burrows, gnawed bark — all empty, all abandoned, all
  perfectly preserved. *Thick foliage but no wildlife.* The players who notice the nests will be
  the ones who understand the ending.
- **The egg is visible from six minutes away through gaps in the canopy**, in fragments, never
  whole, until beat 3. Compose the foliage to frame slices of white.
- **The egg is not smooth.** It is the same bone material as the path and the pebbles — the game
  has been showing the player this substance for two hours at pebble scale. Now it is four metres
  tall. Nobody needs to be told they are the same thing.
- **The hill is bare and the egg is on top of it**, which means the player circles it in the open,
  fully exposed, in flat light, for twelve minutes. After the fog shelf and the white void, being
  *visible* is the new discomfort.
- **Nothing on this island is hostile.** There is no threat here and there never will be. Do not
  add one. The chapter's tension is entirely structural — it comes from the player knowing
  something must happen and it not happening.

---

## 3. THE PUZZLE — *The Footprints*

**Type:** ritual circumambulation — pace-matching and gait discipline
**Location:** the egg hill, beat 4
**Solve time:** 10–14 min

### Setup

A **ring of bare footprints** circles the egg at about eight metres' radius, pressed into pale
ash-soil. Thirty-two prints, one full circuit. They are old, sharp-edged, and unmistakably
**barefoot and adult** — the same prints the player saw in the orchard mud in Chapter 01 and left
in the black sand in Chapter 02.

Somebody has also tried to break the egg. There are shallow strike-marks on the shell at chest
height and a scatter of bone chips at its base. The tool is not here.

### Mechanic

The player walks the ring **by stepping into the existing prints.**

- Footfall position is tracked against the print positions. A step lands "in" a print if it is
  within a generous radius **and** the player's stride is carrying them the right way round
  (widdershins — always against the sun's implied direction).
- **Each correct consecutive step:**
  - the ambient light drops by a fixed, tiny amount (~2% of remaining luminance — so the fall-off
    is geometric and the last eight steps are much darker than the first eight);
  - **one knock sounds from inside the egg.** The knock is *the same asset from Chapter 03* — the
    player's own knock, recorded from the inside, coming from inside the shell.
- **A missed print resets the count to zero.** The light returns to full over 4 seconds and the
  knocking stops. No sound of failure, no message. The world simply gets bright again, which after
  a good run feels like a punishment far out of proportion to its severity — correctly.

### The difficulty, and why it is not artificial

The prints are **not spaced to the player's default stride.** They are slightly shorter and
slightly wider. Walking normally will miss roughly every fourth print.

There is no "match stride" button. The player has to discover that they must **walk differently** —
shorter steps, wider set, slower — and hold that gait for thirty-two paces. In practice this means
easing off the stick to a specific partial deflection and keeping it there.

This is the entire puzzle: **the game asks you to walk like somebody else, and the somebody else
is you.**

- Analog input: partial stick deflection maps to stride length continuously. There is a ~20% band
  that matches the prints.
- Digital input (keyboard): a hold-to-slow modifier exists but is not prompted. Discovering it is
  the equivalent solve. Tune the walk-speed curve so the correct pace is reachable by feathering.
- **Assist:** after three full resets, the character's own feet begin to leave faint bone-white
  prints that persist for ten seconds, so the player can see their own gait against the target
  gait. This is enough. Do not add more.

### Solve

Step thirty-two lands in the last print — which is the first print. The circle closes.

- Light has fallen to near-black. The egg is the only luminous object left, glowing faintly from
  within, the way a lampshade does.
- The knocking from inside the egg, which has been accelerating with the player's steps, **stops.**
- The player's own footprints are now on top of the old ones, indistinguishable from them.

Then **beat 6: nothing happens for ninety seconds.** See §6.

### Why this puzzle

- It is made only of walking. In a game whose sole verb is walking, the climactic puzzle should be
  the hardest possible thing to do with that verb — which is to do it *unnaturally, and keep doing
  it.*
- The reset-to-zero on a miss is what produces the *waiting* the text demands. *"I watched. I
  waited. I waited more."* The player will wait. The player will do it again.
- The knocking from inside the shell answers, silently, the question of who is in the egg,
  four chapters after the knocking started — and the answer arrives as a *sound design decision*,
  not as a line of dialogue. This is the game's most important piece of environmental storytelling
  and nobody says a word during it.
- **Protect → break.** The player begins the ring believing they are performing a protective rite
  (the VO says so) and ends it having cracked the shell. The verb never changed. Only the
  intention did, and the intention was never theirs.

---

## 4. Voice-Over Script

**Verbatim from PATH.pdf.**

### The merged voice — spec

Chapter 04 introduces the game's third voice, which is both of the others. Do not create a new
performance. **Build it from the two existing takes:**

- Record both actors reading the beat-4 lines.
- Time-align them to the same phoneme grid.
- Crossfade the *formant* content, not the amplitude — a spectral morph, so at 50% it is a mouth
  that does not belong to either man.
- Keep both reverb tails, layered, so the voice is simultaneously close-and-dry and in-a-stone-room.
  This should be perceptible as *wrong* without being identifiable as an effect.

Reference the *Necrophosis* treatment here — "layered together into unsettling whispers that
barely feel human anymore" — but pull it back about 40%. This game's voices should stay
recognisably human right up until they are not.

| # | Trigger | Line (verbatim) | Treatment |
|---|---|---|---|
| 4.1 | Wading, before land | *"It was an island. Thick foliage but no wildlife."* | Traveler voice, unmodified. |
| 4.2 | Beat 3, the egg fully revealed | *"In the middle of it, on top of a small hill, stood a giant egg."* | Traveler. Line lands 5 s *after* the reveal, per the standing rule. |
| 4.3 | Player reaches the ring | *"I had to protect it until something hatched."* | Traveler — but at the word **"protect,"** open the merged morph to 15%. Almost nothing. |
| 4.4 | Player finds the strike-marks on the shell | *"Someone had tried to break it."* | Morph 25%. |
| 4.5 | Player looks down at the ring of prints | *"The footprints circled its white structure. Were they mine?"* | Morph 40%. The question mark is the only one in the book — do not let the actor resolve it downward into a statement. |
| 4.6 | First correct step | *"I watched."* | Morph 55%. |
| 4.7 | First reset | *"I waited."* | Morph 70%. |
| 4.8 | Second reset (or 4 min elapsed, whichever first) | *"I waited more."* | Morph 85%. If the player never resets, play this at the 4-minute mark anyway; a perfect run should still have to wait. |
| 4.9 | **Step 32 — the circle closes** | *"I watch as you step into my footprints. We wait together to break it."* | **Morph 100%.** Both voices, fully merged, present tense, second person. This is the line the whole game is built to deliver. Play it in **absolute silence** — no ambient, no score, no footstep tail. Then hold the silence into beat 6. |
| — | **CUT** | | |
| 4.10 | Turret. The lens in pieces on the flagstones. | *"The lens lay shattered."* | Watcher, alone, unmerged — the last time his voice is clean. |
| 4.11 | Player looks at the empty mount, then at the horizon, unaided | *"What is left?"* | |
| — | **CUT** — back to the hill, into the ongoing silence | | |
| 4.12 | ~80 s into the 90 s wait | *"The silence was too loud."* | Merged. **This is the only sound in ninety seconds.** |
| 4.13 | Silence breaks | *"White noise."* | On the word, the mix floods with actual white noise at –12 dB. Not a stinger. A *substance*. |
| 4.14 | First fracture on the shell | *"Cracks."* | |
| 4.15 | | *"The egg burst."* | See §5. |
| 4.16 | Into black | *"Rebirth."* | Merged, whispered, with the female voice texture underneath it for the first time in the chapter. |
| — | **CUT** | | |
| 4.17 | Black. Player must hold the trigger to open their eyes; it takes effort and slips. | *"Waking up was hard. It felt like lifting lead when I tried to open my eyes."* | Traveler, unmerged — but the Watcher's reverb tail is now permanently on his voice. They do not fully separate again. |
| 4.18 | Eyes open onto nothing | *"I remembered white."* | |
| 4.19 | +5 s | *"All was dark now."* | |

### Coda card

```
The Silence.
The wait.
The rebirth.
```

Note the definite articles — the book capitalises **The Silence** and it is the only common noun
in any coda given a capital. Treat it as a proper name. Set it slightly larger than the other two
lines.

---

## 5. Visual Design

### The three-light discipline

This chapter is where the game commits hardest to the reference pipeline (see 00_design_bible.md
§3). Ares Dragonis's rig on *The Shore*: **three static lights, one custom HDRI driving the
dynamic skylight, atmospheric fog. "The key is in the colors."**

Chapter 04's implementation:

| Light | Role |
|---|---|
| **Key** | A high, hazy, sourceless overhead — the flat light of a white sky. No visible sun disc. Motivates nothing. |
| **Fill** | Bounce off the pale ash-soil of the hill, warm bone, very low. This is what separates the egg from the sky. |
| **Practical** | **The egg itself**, from beat 4 step 1 onward. It is a light. It starts at zero and comes up as the world goes down, so by step 32 it is the only source in the level. |

The HDRI carries the palette. Vertically graded per the reference recipe: **darkest low, most
chroma in the middle band, palest and most faded at the top.** Our variant — low band moor black,
mid band petrol with a bruise-cyan lift, top band near-bone. The result is a sky that looks like
it is being drained upward.

### Palette

Chapter 04 runs the narrowest range in the game before Ch. 06:

- **Bone `#EDE2C2`** — the egg, the ash-soil, the leaf undersides, the sky's upper band
- **Moor black `#0B1614`** — the foliage, the water, the horizon
- **Petrol `#16332F`** — the mid sky and the shallows
- **Ember `#E0762A`** — appears **exactly three times in the whole chapter:** in the blood still on
  the Traveler's hands; in the light from inside the egg, once the shell first cracks; and in the
  final frame of the burst. Nowhere else. Ration it.
- **Bruise cyan** — deleted from this chapter entirely.

### The half-tone forest

The foliage effect, specified: leaves are black on the upper surface and bone on the lower, with a
near-zero-thickness translucency. In wind, the canopy inverts in patches. Shot from below with the
white sky behind it, the forest reads as **a moving half-tone screen** — the printing metaphor
made into weather. Tune the wind so the inversions are slow and large, not shimmery.

### The egg

- Same shader as the pebbles and the path. Bone, matte, with the ZBrush-sculpted micro-relief that
  survives fog and distance (see bible §3). **Chalky, not eggshell.** It should read as *stone that
  is trying to be an egg.*
- **Two-plate construction**, matching the cover: the shell reads as two halves with a vertical
  seam that is already, faintly, a fracture, from the very first frame. Nobody will notice at beat
  3. Everybody will remember it after the burst.
- Behind it, whenever framed from the west: **a black disc**, low in the sky, which is not the sun
  and is never explained and never mentioned. The cover image, standing in the level.

### The burst

*"The egg burst."* Frame-exact:

1. **12 frames:** the seam opens. Ember light from inside, hard-edged, no falloff — light as a
   *solid*, like a Beksiński sky.
2. **1 frame:** pure bone white, full frame.
3. **6 frames:** the cover composition, rebuilt in-engine at the player's actual position — the
   path, the verges, the cracked egg, the black disc. Held. Slight camera drift. Then:
4. **2 frames:** analogue static (the Ch. 01 asset again, third and final use).
5. **Black**, 6 s, silent.

Do not show what came out of the egg. There is nothing to show. *Waking up was hard.*

### Post

- Misregistration sits at 6 px through the chapter and **collapses to 0 for the 90-second wait** —
  the second and last time the image is perfectly registered (after the Ch. 01 lens solve and the
  Ch. 03 coda flip). Perfect registration in this game always means *something has stopped.*
- The Ch. 01 lens smear **disappears in beat 5**, when the lens shatters. The camera is clean for
  the rest of the game and it feels like a loss.

### Signature frames

- Slices of white through black foliage, six minutes before the reveal.
- The egg from the rim of the clearing, three times human height, on a bare hill, under a flat
  white sky. Give this composition thirty full seconds with no VO.
- Looking down at thirty-two bare footprints in ash.
- Step 32: near-total darkness, one glowing shell, one small figure standing in its own print.
- The Watcher on the flagstones among lens fragments, each shard showing a different piece of the
  path, none of them agreeing.

---

## 6. Audio Design — and The Ninety Seconds

### The chapter's audio thesis

Necrophosis's most-praised quality is that "silence dominates large stretches of exploration."
Chapter 04 takes that further than the reference does, because the text demands it: *The Silence*
is a named character in the coda.

### The foliage (beat 2)

Six minutes of forest with **no fauna layer at all.** Only:
- leaf contact against the body and arms — dense, constant, close
- wet ground underfoot
- the player's own breathing
- a distant, extremely low sub-bass pulse at ~0.4 Hz which is the egg and is never identified

Every horror-game instinct will want to add a bird. Do not add a bird. The forest sounding like a
recording with the wildlife stem muted is the entire point, and players will describe it as
"wrong" without being able to say why.

### The ring (beat 4)

- Score: **absent.**
- Ambient: thins by 2% per correct step, in lockstep with the light. By step 32 the world is
  effectively muted.
- **The knock from inside the egg** — Chapter 03's asset, re-amped through a resonant hollow
  chamber and recorded from outside. Each correct step produces one knock. The interval between
  knocks shortens with the step count, so the last five steps are almost a heartbeat.
- Footsteps on ash: fine, dry, dusty, quiet. Almost a paper sound.

### The Ninety Seconds

After step 32, the game plays **ninety seconds of nothing** while the player stands in near-total
darkness in front of a faintly glowing egg.

- All buses at `-inf`. No room tone, no breath, no wind, no score.
- The player has full control and can walk away. **If they walk away, the circle breaks and they
  must do the ring again.** They will only make this mistake once.
- No timer, no prompt, no shimmer, no "hold to wait." The player must simply not do anything, and
  must decide to trust the game.
- At **80 s**, the merged voice: *"The silence was too loud."*
- At **90 s**: white noise floods in at –12 dB and the shell cracks.

**On the risk:** this will be the most-complained-about ninety seconds in the game, and it should
survive playtesting unchanged. The reference games are both criticised for pacing — but for
*undifferentiated* slowness, corridors of set dressing with nothing asked of the player. This is
the opposite: a single, bounded, deliberate demand, placed at the exact climax, that the player
consciously chooses to meet. Slowness that is asked for is not the same as slowness that is
merely endured. Hold the line at ninety and cut nothing.

### The burst

One hit. Everything at once — bass, organ, prepared piano, contact mics, the female voice — for
100 ms, then the noise floor, then six seconds of absolute black silence.

### Beat 8 — the dark

- The eyelid mechanic has its own foley: a wet, sticky, close sound, in the player's own head.
- Under it, for the first time, the Watcher's stone-room reverb is audible **in the Traveler's
  scene**, applied to the Traveler's breathing. The rooms have merged. Never mention it.

---

## 7. Continuity Ledger

| Item | Entering | Leaving |
|---|---|---|
| Traveler pebbles | 1 | 1 |
| Parapet pebbles | 4 | **irrelevant — the parapet is not shown again until it collapses in Ch. 05** |
| The great lens | intact, smeared | **shattered.** The camera smear is gone for the rest of the game. |
| Teacups | Watcher never reached the second cup | Still unreached. He does not get it. |
| Voices | separate, chains converging | **merged once at 100%**, then separated — but permanently sharing reverb |
| Turret floor crack | a hand's width | **the lens mount has fallen through it** |
| Movement speed | –15% | –15% |
| Egg | — | **burst** |
| Ones That Lost | absent from this chapter entirely | return in Ch. 05, close |

---

## 8. Exit

Black. Six seconds of nothing. Then the coda card, then — from somewhere very close in the dark,
before any image — **a single footstep that is not the player's.**

Title card: **CONSTRICTION**.
