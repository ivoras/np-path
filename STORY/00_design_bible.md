# THE PATH — Design Bible

**A walking simulator adapted from *THE PATH* by TLLOA (PATH.pdf, 28 pp.)**

> Target runtime **2h 20m – 2h 45m** · 7 chapters · 7 puzzles · single ending · no combat,
> no inventory, no HUD, no map, no fail state, no collectibles

| Chapter | Title | Puzzle | Runtime |
|---|---|---|---|
| [01](01_prologue.md) | **PROLOGUE** | The Great Lens — optical alignment | 18–22 min |
| [02](02_ascent.md) | **ASCENT** | The Cairns — wayfinding in fog | 20–25 min |
| [03](03_inversion.md) | **INVERSION** | The Knock — rhythm from memory | 15–18 min |
| [04](04_expansion.md) | **EXPANSION** | The Footprints — ritual circumambulation | 25–30 min |
| [05](05_constriction.md) | **CONSTRICTION** | Passage Refused — resource sacrifice | 18–22 min |
| [06](06_absence.md) | **ABSENCE** | The Crooked Line — drawing by erasure | 9–12 min |
| [07](07_the_path.md) | **THE PATH** | The Confused Shadow — light-source resolution | 12–15 min |

---

## 1. Reference Analysis — *Necrophosis* and *The Shore*

### 1.1 The finding that reframes everything: same author

**Both games are by Ares Dragonis** — a Greek 3D character artist, based in Larisa. *The Shore*
(2021) was essentially solo, "with some help from a programmer and a composer." *Necrophosis*
(April 2025, UE 5.4) is Dragonis Games, co-developed with Adonis Brosteanu.

So this is not two references. It is **one artist's five-year evolution**, and the vector is
exactly the one this project needs:

```
The Shore (2021)                    Necrophosis (2025)
Lovecraft, literal            →     Beksiński, abstract
combat + chase sequences      →     no weapons at all
naturalistic island           →     landscape as anatomy
UE4                           →     UE 5.4
Metacritic 59                 →     Metacritic 67
```

Both games share **one strength and one failure, identically**: a sculptor's eye applied to
environment art, rated at or above AA quality — and every verb the player performs rated at or
below hobbyist quality. That split is the most important thing to inherit *around*.

### 1.2 The production method — the single most actionable item

From Dragonis's 80 Level interview (2019):

> "Almost everything is made only with **ZBrush and Photoshop**."

No Substance. No scan-PBR pipeline. For natural assets he takes photographs, alters them in
Photoshop, and **uses them as paint and alpha brushes inside ZBrush**. Detail is therefore
*sculpted into displacement and silhouette*, not tiled on as normal maps.

**Why this matters for us:** our game is fog-heavy, distance-heavy, and low-contrast. A
normal-map-driven pipeline flattens out at exactly the distances and lighting conditions we live
in. Sculpted silhouette survives fog. This is a technical decision with an aesthetic consequence
and we are taking it wholesale.

His material discipline is also worth copying verbatim: the first asset built for *The Shore* was
the **black sand**, and he studied how black sand behaves **specifically in moody weather** before
compositing it. He studies materials *under the game's lighting condition*, never under neutral
light. Our equivalent first asset is **wet bone-white path stone at 8 minutes past sunset.**

### 1.3 The lighting rig — quoted, and adopted

> "There are only **3 static lights** in the scene, a **custom HDRI for the dynamic skylight**, and
> **atmospheric fog**. **The key is in the colors.**"

And the sky recipe:

> "The **clouds below are made darker**, the **clouds in the middle** are left a bit lighter and
> more colorful, and the **top clouds are the lightest with faded colors**."

*(Caveat: this is from the 2019 The Shore-era interview. It resurfaces in Necrophosis coverage but
I could not confirm the same rig carried into UE5. Treat as the author's lighting philosophy, not
a verified UE5 spec.)*

This is not a physically-lit scene. It is a **painted** one: the HDRI *is* the palette, the three
lights are accents, and fog does all depth separation. It maps precisely onto Beksiński, who lit
paintings from a single implied ambient with no rim-light logic.

**We adopt the rig and invert one thing:** our sky's vertical grade runs *dark low → petrol mid →
near-bone top*, so the sky looks drained upward rather than lit from above. Every chapter file
specifies its own three lights against this.

### 1.4 What *Necrophosis* does that we want

**Dragonis's stated thesis, in his own words:**

> "I use **scale, darkness, silhouettes, fog, and distant structures** to make the player feel
> small and lost inside something ancient and incomprehensible. **The emptiness itself becomes
> part of the horror.**"

> "**Negative space and visual ambiguity are extremely important** because they allow the player's
> imagination to complete what is missing. When everything is fully explained visually, the
> mystery disappears very quickly."

> "Sometimes **what you don't show is far more powerful than what you do show**."

**The surfacing grammar** — and this is the most transferable idea in either game:

> "Formations of bones stretching across surfaces, making the environment feel **infected and
> decayed while still maintaining an architectural structure underneath**."

**Decay is a skin applied over intact structure, never rubble.** Architecture "feels **grown
rather than built**." Bodies are "stretched, twisted, and transformed into architecture, monuments,
and organic machinery." Mountains are literal faces. This is exactly how our **Ones That Lost**
are built (Ch. 05 §2) and exactly how the **turret** should read.

**Scale as a mechanic:** the game changes the player's body scale to reframe architecture — a
behemoth in one sequence, a scuttling spider-creature in another. We use a quieter version of the
same idea in Ch. 03 (eye height drifting from 1.70 m to 2.40 m over 90 seconds, never announced).

**Audio, which is its strongest craft area after the visuals:**
> "**Silence dominates large stretches of exploration**, broken only by distant groans, whispers,
> and low ambient drones that seem to vibrate through the environment itself."

Music arrives "in **subdued waves**" rather than as a bed — score as *event*, gated to beats.
Voices are "**exhausted and ancient**, sometimes layered together into unsettling whispers that
barely feel human anymore," echoing unnaturally, overlapping. Our merged-voice spec (Ch. 04 §4) is
this treatment pulled back about 40%.

### 1.5 What *The Shore* does that we want

- **No map. Light as breadcrumb, plus minimal diegetic signage.** The technique is right; the
  reinforcement was not (see 1.6). We keep the technique and triple the reinforcement.
- **No cheap repeated textures.** Reviewers specifically praised "unique-looking rocks" — every
  rock a hero asset. This is the ZBrush pipeline paying off, and it is why we sculpt every one of
  the Ones That Lost individually with no close-range instancing.
- **Gargantuan scale as the horror.** The dread is the *size of a landform*. Our egg is the
  equivalent gesture.
- **Composer Thanos Zampoukas with featured vocalist Andriana Káli** — a named human voice used as
  an instrument against cosmic-scale material. Our female-voice-as-texture rule (never melody,
  never words) comes directly from here.
- **The structural steal:** Andrew searches the island for his daughter Ellie; the antagonist
  reveals Ellie never existed and the memory was manufactured to give him a purpose. **The
  player's navigational drive was the antagonist's level-design tool.** Our equivalent: the player
  walks the path because the path is the only thing there, and Ch. 07 reveals the path is the
  shadow they cast.

### 1.6 What both games are criticised for — the do-not-inherit list

This matters more than the praise, because our design is close enough to inherit these failures by
default.

| Failure | Where | Our countermeasure |
|---|---|---|
| **Fetch-quest puzzle loops.** *Necrophosis*'s puzzles "mostly consist of moving items — normally brains — from one location to the next." Reviewers "kept waiting for some grander idea… it never really arrived." | Necrophosis | **No puzzle in this game moves an object from A to B.** All seven are built from looking, walking, standing, listening, or waiting. See §5. |
| **Over-narration.** *"Necrophosis drowns you in Lovecraftian poetry"*; lengthy dialogue "limited immersion"; a reviewer who called the acting faultless still found it "definitely out of place." **The developer withholds visually and over-explains verbally** — directly contradicting his own negative-space thesis. | Necrophosis | See §6. Our total script is **964 words across ~150 minutes = 6.4 words/minute.** |
| **Bolted-on combat and chases.** *The Shore*'s chases "squandered the good work built up by the dread and atmosphere of the first half"; "many deaths that rarely felt fair"; every creature reveal forces at least one death. Condemned in *Scorn* too. | The Shore | **There is no threat in this game.** Nothing pursues, nothing damages, nothing kills. In Ch. 05 falling stone passes through the player. |
| **Under-communicated affordances.** "Constant invisible walls"; a puzzle that stalled a reviewer because "it wasn't clear that jumping over an obstruction was possible"; snagging on pebbles and background geometry. One flat verdict: *"signposting can still be a thing in a video game."* | The Shore | **No invisible walls anywhere.** Where the player cannot go, there is visible, lit geometry. Ch. 01 uses deep water; Ch. 05 uses a collision capsule that genuinely does not fit. Every boundary is diegetic. |
| **Over-railing.** *Necrophosis* is "insanely linear to a fault." | Necrophosis | Chapters 02, 04, 06 and 07 are open fields with no correct route. The player can walk away from the climax of Ch. 04 and will only do it once. |
| **Implied-but-unimplemented systems.** *The Shore*'s sanity is "implied constantly through dialogue and visual widgets" but never a system — "a completely missed opportunity." Reviewers punish this harder than absence. | The Shore | **The pebble economy is fully implemented** (§4) and resolves to zero in Ch. 05. Nothing in this game is gestured at without being real. |
| **Sluggish body.** "Walking is rather slow, animations stiff and animatronic-like, controls slightly sluggish… everything else was an afterthought to make it a game." | Necrophosis | Locomotion gets first-class animation budget. The Ch. 02 limp and the Ch. 07 restoration are *authored gait changes*, not a speed multiplier on a stiff walk. |
| **Inconsistent VO mix.** Volume levels differed between plot narration and lore; the creature performance was "emotionless." | The Shore | One narrator, one chain, one bus, one loudness target (§6). |

**The pattern to internalise:** in both games the surfaces are world-class and everything the
player *does* is not. **Inherit the environment craft. Inherit none of the interaction design.**

### 1.7 Beksiński — what actually survives the jump to 3D

Facts worth designing against:

- **Medium: oil on hardboard panels he prepared himself.** Hardboard, not canvas — **no weave, no
  tooth**. This is why his surfaces read as airless and slightly photographic. In 3D it argues for
  **low roughness variance** and no procedural canvas break-up on world materials.
- **The "fantastic period"** (late 1960s – mid 1980s): post-apocalyptic surrealism, skeletal
  landscapes, "lush, subdued colors with carefully rendered textural details." From the late 1980s
  he moved to **monumental, sculpture-like images** in a "restricted and often subdued" palette.
  The mature style is monochrome austerity.
- **Palette:** muted earth tones, sepia, greys — "accentuating **mood over decorative color**."
- **Atmosphere:** "as if filled with a **mist of miasma and corruption**." Fog is not weather. It
  is the paint medium.
- **His method, in his words:** *"I wish to paint as if I were photographing dreams."* Photographic
  rendering fidelity applied to impossible content. **The more photoreal your shading, the more
  the impossible geometry hurts.** Do not stylise the material response.
- He **refused to title anything** and denied his work had decodable meaning. He worked to
  classical music and **hated silence**.

**The Giger/Beksiński split**, as the *Scorn* literature puts it cleanly: Giger supplies the
biomechanical interface — ribbed machinery, tubing, skeleton-as-technology. **Beksiński supplies
the palette, the atmosphere, the monumentality and the religious desolation.** *Necrophosis* takes
both. **We take only Beksiński**, and none of Giger: there is no machinery in THE PATH, nothing
tubed, nothing biomechanical. Our world is weather, stone, bone, cloth and water.

### 1.8 The one place we diverge from both references

**Our source material is not Beksiński and we should not pretend it is.**

The cover of PATH.pdf is a **riso/screenprint** — flat graphic shapes, visible channel
misregistration, heavy paper grain, and a palette of petrol-green, bone and hot amber that has
nothing to do with Beksiński's sepia or Giger's grey. See §2.

So the synthesis this project is actually making:

> **Necrophosis's monumental scale and negative space, and The Shore's atmospheric restraint,
> rendered as a riso print that has been made to move.**

Note the productive tension with 1.7: Beksiński's support has *no tooth*, and we have a lot of it.
We resolve this by putting the grain **on the glass, not on the world** — the paper tooth is
screen-locked, sitting in front of the image like the smear on the Watcher's lens, while world
materials stay airless and low-variance in the Beksiński manner. Chapter 06 breaks this rule
exactly once, on purpose, and that break is the game's thesis (see 06_absence.md §5).

---

## 2. The Palette — locked

Taken directly off the book's cover. **Five colours. There is no sixth.** If a department needs
another hue the answer is no; use value instead.

| Name | Hex | Role |
|---|---|---|
| **Moor black** | `#0B1614` | Mud, bark, water, heather, the Ones That Lost, the drawn path in Ch. 06 |
| **Petrol** | `#16332F` | The dominant midtone. The air itself is this colour. |
| **Bruise cyan** | `#3E6E70` | Rain, wet stone, far horizon haze. The coldest thing in the game. |
| **Bone** | `#EDE2C2` | The path, the pebbles, the egg, all type. **The same material at every scale.** |
| **Ember** | `#E0762A` | Rim-light on the path verges, brass, blood, the light inside the egg. **The only warm colour, and it is rationed by the chapter.** |
| *Ash olive* | `#2A2A22` | Not a world colour — the printed vignette border only |

**Ember discipline** is the palette's central rule. It appears constantly in Ch. 01, sparingly in
Ch. 02, three times in Ch. 04, once in Ch. 05, not at all in Ch. 06, and floods back in Ch. 07.
Ember is the game's emotional thermometer and the player reads it without knowing they are.

### The White/Dark Ledger

Track the polarity across the whole game. It inverts four times and every inversion is load-bearing:

| Chapter | Ground | Path/figure | Note |
|---|---|---|---|
| 01 | dark | **white** | Baseline established |
| 02 | dark → draining | white | Ends in a white-out on the fog shelf |
| 03 | **white** | dark | **Full inversion.** White is the substance; dark pours out of a crack |
| 04 | dark, darkening to near-black | **white** (the egg) | Returns to baseline, then extinguishes everything but the egg |
| 05 | **black** | white (four pebbles, one player) | Maximum compression: 80% of frame below 10% luminance |
| 06 | **white** | dark | Full inversion again — and revealed as the same operation |
| 07 | dark | **white** | Baseline. The loop. |

---

## 3. Rendering & Post — the riso stack

Every chapter file references this. It is the game's signature and it is applied globally.

1. **Palette-limited render**; posterise luminance to ~24 steps (Ch. 06: 2 steps).
2. **Channel misregistration** — offset the cyan and ember separations by *n* px in a fixed
   direction with a slow 0.2 Hz wander. **This is the single most important effect in the game.**
   It is also a narrative instrument:

   | State | Misreg. | Meaning |
   |---|---|---|
   | Ch. 01 baseline | 1–2 px | The world is holding together |
   | Ch. 02, climbing | → 4 px | Coming apart with the Traveler |
   | Ch. 03, in the white | **0 px** | Death, not clarity |
   | Ch. 03, the burst | 12 px | |
   | Ch. 04, the 90-second wait | **0 px** | Something has stopped |
   | Ch. 05, the merge | 18 px | Three superimposed images |
   | Ch. 05 onward | **2 px, permanent** | Never zero again — until |
   | Ch. 07, the convergence → credits | **0 px, permanent** | Nothing starts again |

   **Perfect registration in this game always means something has stopped.** It happens four times.
3. **Paper tooth** — a 1:1 grain plate multiplied over the frame, **screen-locked, not
   world-locked**. It sits on the glass in front of the world. Coarsens with altitude in Ch. 02.
   **Ch. 06 world-locks it to the floor** — the only exception, and the point of the whole game.
4. **Vignette** — hard-ish ash-olive printed border. Absent only in Ch. 06. Heaviest in Ch. 07,
   closing to ~18% of frame width by the credits.
5. **Ink-bleed bloom** — from bone and ember only, never from petrol.
6. **The lens smear** — a fixed diagonal greasy streak in one corner, acquired in the Ch. 01 puzzle
   (*"I polish the glass with my dirty sleeve"*), present on **every camera in the game** until the
   lens shatters in Ch. 04, then gone forever. Most players will never consciously notice it. Some
   will notice its absence.

**Explicitly forbidden:** chromatic aberration, lens flare, film scratches, letterboxing, depth-of-
field racks. Those are cinema. This is print.

---

## 4. Systems

The game has **four systems and no others.** Each is fully implemented and each resolves.

### 4.1 The Cut

The book's `…` glyph, made physical. It is how the game changes bodies.

1. One frame of pure **bone white**, full-screen, no fade.
2. A large-format camera shutter, slowed 30%, pitched low, with a wet click in it.
3. **The new POV is already in motion.** Never cut to a static frame.
4. **Look-direction is preserved across the cut.** This is what sells two bodies as one nervous
   system, and it is the cheapest, best idea in the design.

Cuts are authored in Ch. 01–02, **player-triggered for the first time in Ch. 03** (by swallowing a
pebble), required in Ch. 05, absent entirely from Ch. 06, and final in Ch. 07.

### 4.2 The Pebble Economy

A currency introduced four chapters before it matters, never explained, never displayed in UI, and
spent to zero at the moment the story requires a sacrifice.

| Ch. | Event | On Traveler | On parapet |
|---|---|---|---|
| 01 | Background dressing, unmentioned | 0 | **3** |
| 02 | Found at the tideline where the body lay | **3** | 3 |
| 02 | Placed as a cairn capstone → rolls off the mountain → **crosses worlds** | **2** | **4** |
| 03 | *"Eat a pebble."* | **1** | 4 |
| 05 | Four found (one in hand, one in the ash on the feet, one calcified into a standing figure, one in the other hand); four niches braced | 0 | — |
| 05 | The fifth does not exist; the player takes its place | **0** | **0** |

**Readability rule:** shoot the parapet from an identical camera position in Ch. 01 beat 8, Ch. 02
beat 9, and Ch. 03 beat 6, so the pebbles occupy the same screen space and the count change is
legible without a cut-in. Players who notice will tell players who didn't. That is the correct
distribution mechanism for a game like this.

### 4.3 The Knocking

The game's longest-running audio thread. One fixed performance, never re-recorded, never quantised:

```
knock  ·  knock-knock  ·············  knock
  1         2    3                      4
0.00s     0.75s 1.05s                 3.40s
```

| Ch. | State |
|---|---|
| 01 | Ambient, unremarked, behind the mansion beats |
| 02 | **Three unbroken minutes** in the lower mansion, disguised as an errand — this is the teaching scene |
| 02 | Stops. The absence is a bigger event than any presence has been. |
| 03 | **The player performs it** at the door, from memory, to open nothing |
| 04 | Comes from **inside the egg**, one knock per correct footstep, accelerating |
| 05 | **Absent for the first time since Ch. 01** — because the knocker is inside now |
| 07 | Starts again in the final ninety seconds. It is not the player's yet. It will be. |

**Two libraries, same takes:** *outside* (close, dry, hand-flesh in it) and *inside* (the same
performances re-amped through a real door and recorded from the far side of a stone room). A
player who hears both must be able to recognise them as one event.

### 4.4 The Body

Not a stat block — an authored, one-directional accumulation. Nothing is ever restored except once.

| Ch. | Change |
|---|---|
| 01 | Bare feet. No shadow. (The player has no shadow for the entire game. Nobody will consciously notice. Everybody will feel it.) |
| 02 | **The limp.** Movement speed −15%, permanent. Footprints take on ember at the heel. Breath enters the mix and never leaves. |
| 03 | Hands split to the bone, permanent. Sprint unlocked once, for eleven seconds, and revoked. |
| 04 | Eye height drifts 1.70 → 2.40 m over 90 s in the white. Never restored, never mentioned. |
| 05 | Hands come back **clean and bone-white** after the merge. Footsteps become different assets — heavier, two people's worth. |
| 07 | **Movement speed returns to 100%.** The limp is gone. Nobody is told. And the player has **two shadows.** |

---

## 5. Puzzle Doctrine

Seven puzzles, one per chapter. Every one is built from **looking, walking, standing, listening, or
waiting.**

**Nothing in this game is ever:** a keypad, a code, a lever, a valve, a fuse box, a sliding block,
a lockpick, a crate to push, an item to fetch from A to B, or a note that tells you the answer.

| Ch. | Puzzle | Verb | Feedback channel |
|---|---|---|---|
| 01 | The Great Lens | **Look** — align three collars until two ghost plates register | Audio (a swell resolving to silence) |
| 02 | The Cairns | **Walk** — restack three cairns; the fog opens a corridor for 8 s | Visual (fog density) |
| 03 | The Knock | **Listen** — reproduce a rhythm heard for two chapters | Physical (blood on the door) |
| 04 | The Footprints | **Walk differently** — 32 steps in someone else's gait | Audio + light (a knock and 2% darkness per step) |
| 05 | Passage Refused | **Give up** — brace four niches, then stand in the fifth | Audio (per-section grinding stops) |
| 06 | The Crooked Line | **Wear** — erase the white with your feet to draw the path | Audio (the crush in the footstep) |
| 07 | The Confused Shadow | **Stand** — find the one place your two shadows agree | Visual (the shadows themselves) |

### Assist doctrine

Every puzzle has a **timed, escalating, diegetic assist ladder that plateaus and never solves.**
Assists are always: a camera drift, a change in the mix, a line of already-heard VO on the wind, or
a 15% contrast change. Never: a glow, an outline, a marker, a prompt, a hint text, or a "press X."

This is the direct answer to *The Shore*'s "no hints at any point" and *Necrophosis*'s over-railing.
The game guides constantly and never once tells you anything.

### No fail states

Nothing in this game can kill you, damage you, or end a session. The Ch. 03 knock has no attempt
limit. The Ch. 04 ring resets to zero and costs only time. The Ch. 05 walls close on a stuck player
anyway and the chapter proceeds — with the merge happening *to* them rather than *by* them. **Both
readings are true and the game never says which one you got.**

---

## 6. Voice-Over Doctrine

### The word count, which is the whole argument

The most damaging criticism levelled at *Necrophosis* is over-narration — a developer who withholds
visually and over-explains verbally. This game is VO-driven by mandate: the brief requires the
source text to be spoken verbatim. So the defence has to be arithmetic:

> **964 words. ~150 minutes. 6.4 words per minute.**

For comparison, ordinary speech runs 130–150 wpm. This game speaks at roughly **1/20th of
conversational density.** Almost every minute of THE PATH is silent or wordless. The text is not a
narration track; it is **seven hundred seconds of speech distributed across two and a half hours**,
and the distribution is the design.

**Not one word is added, cut, reordered, or paraphrased in any chapter.** The source is 964 words
and the script is 964 words. Every chapter file's VO table is verbatim.

### The rules

1. **Lines land 3–6 seconds late.** Never on the image they describe. The player sees the thing,
   doubts it, and only then hears it named. Two lines in the entire game land on the beat — the
   Ch. 02 pebble roll and the Ch. 05 compression sequence — and both are hinges.
2. **No performance.** Nobody is telling anybody a story. Both men are confirming things to
   themselves.
3. **One loudness target, one bus, one chain.** (*The Shore*'s inconsistent VO mix is the specific
   failure being avoided.)
4. **Never explain a system, an object, or a relationship.** The pebble transfer, the identity of
   the knocker, the nature of the Figure, the black disc in the sky and the meaning of the egg are
   never stated. They are staged.

### The voices

| Voice | Chain | Chapters |
|---|---|---|
| **The Traveler** | Dry, close, almost too close — you can hear the mouth. No reverb. Mono, centred. Breath from Ch. 02. | 01–04, and **07 unprocessed** |
| **The Watcher** | Recorded in an actual stone stairwell — real reverb, never plate. Older, a rasp. | 01–05 |
| **The Merge** | Both takes phoneme-aligned and **formant**-crossfaded (not amplitude), both reverb tails layered. Opens 15% → 100% across Ch. 04's ring. | 04–05 |
| **The Stripped Voice** | The merge with everything removed — no reverb, no breath, no room, bandlimited 180 Hz–6 kHz. A voice with no body. | 06 |

**The chains converge from Ch. 03 onward** — the Traveler gains a faint stone tail, the Watcher
gets closer — and nobody should be able to name the moment it happens. After Ch. 04 the merge
floors at 30% and never fully separates.

**Then Ch. 07 brings back the Chapter 01 Traveler take, clean, from the same recording session.**
Record both days' material on the same day if the schedule allows. After two and a half hours of
degradation, the cleanness is unbearable.

---

## 7. Audio Doctrine

### Instrumentation — the whole game

Bowed double bass · prepared piano (screws and felt, no bright strikes) · one detuned pump organ ·
contact-mic'd stone and metal · a female voice used **only as texture, never as melody, never with
words**.

**No drums, ever. No synth pad that sounds like a synth pad.**

*(The female-voice rule comes from The Shore's use of vocalist Andriana Káli against cosmic-scale
material. Do not give her a line, a melody, or a credit as a character.)*

### The chord

A single unresolved D minor with a flat fifth, stated by the pump organ in Ch. 01 beneath the
orchard, is present in some form in every chapter. It drops a whole step in Ch. 02. It is inverted
in Ch. 03. It is reduced to its own bare root in Ch. 05. It is absent in Ch. 06.

**It resolves once, in Chapter 07, at the shadow convergence.** One chord change in two and a half
hours. It is not triumphant. It is the end of a suspension that has been held since minute four,
and it will produce a physical response in players who never consciously heard it.

### Silence as a budget

Four engineered silences — all buses at `-inf`, no room tone, no floor, no filter:

| Ch. | Length | Where |
|---|---|---|
| 01 | 4 s | The lens registers |
| 01 | 6 s | After *"I washed up on another shore."* |
| 02 | 4 s | When the knocking stops |
| 03 | **6 s** | After the correct knock — the pivot of the first half |
| 04 | **90 s** | The wait. See below. |
| 06 | **11 s** | After *"I yield."* The last silence in the game. |

**Chapter 07 is never silent.** The loop does not offer a pause.

**On the ninety seconds:** this will be the most-complained-about stretch in the game and it should
survive playtesting unchanged. The reference games are criticised for *undifferentiated* slowness —
corridors of set dressing asking nothing. This is the opposite: one bounded, deliberate demand at
the exact climax, which the player consciously chooses to meet. Slowness that is asked for is not
slowness that is merely endured. **Hold at ninety. Cut nothing.**

### Foley

**Bare feet are the most important sound in the game** and get their own budget line. Every surface
gets a bespoke recorded set, no shared samples, no three-sample randomisation:

wet black sand · dry black sand · mud · flooded grass · rotted orchard fruit · wet stone · dry
slab · frost-shattered slab · loose scree · root · ash · **nothing** (Ch. 03's white — "a foot
landing on nothing, recorded in an anechoic chamber, then made smaller") · **dry paper** (Ch. 06) ·
dry heather (Ch. 07).

Record it barefoot, for real, in a wet field.

---

## 8. Interface

There is none.

- **No HUD.** No crosshair, no reticle, no stamina, no compass, no objective, no subtitle
  background plate.
- **No map**, no waypoint, no quest log, no journal.
- **No inventory.** The pebbles exist as *a closed hand at the bottom of the frame that opens if
  you hold the look*. That is the entire item interface for the whole game.
- **No interaction prompts.** Interactable things are interactable because the camera can reach
  them and they are the only thing there.
- **No collectibles, no achievements tied to exploration, no percentage complete.**
- **Subtitles are mandatory to support** and are set in the book's face — an old-style serif
  (EB Garamond or similar), bone on nothing, left-aligned, low in the frame, generous leading,
  matching the book's own typography. No box, no shadow, no outline. They should look like the
  page.
- **Menus** are the book: bone ground, black serif, no ornament, no background art.

---

## 9. Production Notes

### Asset priorities, in order

1. **Bare-foot foley across 14 surfaces.** More than any single visual asset, this is the game.
2. **The path material** — wet bone stone at 8 minutes past sunset, studied under that condition
   only, sculpted in ZBrush with photo-derived alpha brushes. The reference project's black sand,
   our version.
3. **The Ones That Lost** — ~35 individually sculpted figures, no close-range instancing, bone/
   fabric/efflorescence as one continuous substance with no material boundary anywhere.
4. **The egg** — same shader family as the pebbles and the path, at 400× scale.
5. **The knock library** — two libraries, same performances.
6. **Fog.** Volumetric, very low scattering anisotropy so it reads as substance rather than
   atmosphere; density noise animated at ~0.03 Hz.

### Localisation flags

- Ch. 06 line 6.5: *"An effect to a cause."* The inversion is intentional. **Do not let it be
  corrected** in any language.
- Ch. 07 line 7.3: *"My shadow is confused."* Singular, while the player has two. Not a bug.
- Ch. 05 coda: *"The one that lost"* — singular, after four chapters of the plural. Not a typo.
- The `…` glyph is a POV switch, not an ellipsis of omitted speech. It is never spoken.

### Scope discipline

The two reference games run ~3 hours and ~3–4 hours respectively, made by one and two people. This
design targets 2h20m–2h45m with **seven bespoke puzzles and no reused level geometry**, which is
the more expensive shape. The place to cut, if cutting is required, is **Chapter 02's beat count —
never Chapter 04's ninety seconds and never Chapter 06 in its entirety.** Chapter 06 is nine
minutes long and it is the reason the game exists.

### What success looks like

A player finishes, sits through a credit sequence that is only rain, and goes back to the main
menu — where there is now one line of type that was not there before:

```
The path is.
```
