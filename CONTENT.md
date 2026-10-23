# 江湖一生 · Content guide

How the game's content is organised, what exists, and how to add a batch safely.

## Content formats (use these; do not build parallel systems)

| Format | Helper | Use for | Example file |
|---|---|---|---|
| Incident | `I({...})` | A single scene with choices. Goes into the yearly pool, or a tagged pool (`town`, `wander`, `af_<activity>`) | `ev_*.js`, `b1.js` |
| Story series | `SDEF` + `SOPEN` + `STI` | Multi-stage arcs that need to remember choices. One record per life in `s.story[id]` (stage, facts, people, timing); endings go into the 江湖奇遇录 | `stories.js` (engine), `st1.js`–`st5.js` |
| Encounter | `EN({...})` | One-off regional, festival and comic scenes, listed in the 江湖奇遇录 | `st3.js`, `st4.js` |
| People event | `PEV(id,{who,...})` | Something a person you know brings to you; `who(s,p)` decides who can | `people.js`, `b1.js` |
| Wording variants | `VARY['<exact zh line>']` | Extra ways to say a line that appears in most lives | `vary.js` |

Text is always `T(english, chinese)`. Outcomes are `{w, t, c, fx, next, keep}`; `fx` uses the effects in `applyFx` (`life.js`).

## Inventory (October 2026, after Batch 1)

- 1,271 incidents in 65 files; 25 story series (153 endings); 32 encounters; 27 people events; 100 activities; 24 person actions.
- Simulation reaches all but about 2% of incidents within 400 lives.
- Thin areas before Batch 1: teenage years (20 teen-only incidents), late life (28), region-specific scenes, reconciliation, mentorship late in life.

## Roadmap

| Category | Roughly now | Next priorities |
|---|---|---|
| 1. Everyday encounters | very large (general pool ~670) | more short comic scenes; vary the most frequent ones |
| 2. Travel and regions | ~37 regional incidents + 32 encounters | 3–4 more per region; city-specific scenes |
| 3. Mysteries and adventures | ~12 chains + 9 story series | clue-based mysteries with wrong-answer branches |
| 4. Sect life | ~100 (ev_sect, sects*.js) | rank-specific dilemmas; inter-sect diplomacy |
| 5. Relationships and family | 13 relationship + 27 people events + family.js | children's adolescence; marriage trouble; in-laws |
| 6. Reputation and consequences | memory callbacks, bounty, impostor | faction standing from repeated choices |
| 7. Occupations | ~72 activity follow-ups | yearly job events for each of the 13 jobs |
| 8. Age-specific | child 68, teen 20, late life 28 | teen first love, apprenticeship; old-age health and legacy |
| 9. Long-running stories | 25 series | 4–6 per batch |
| 10. Rebirth and legacy | 江湖奇遇录, heirs, biography | callbacks for heirs to a parent's stories |

## Batch 1 (31 units)

Multi-stage stories (`st5.js`): 密室 The Sealed Room · 改口的证人 The Witness Who Changed Her Story · 断镖路 The Road Where Convoys Vanish · 高人的秘密 A Master's Secret · 儿时之约 A Childhood Promise · 同名之人 Letters to Someone With Your Name.

Short incidents (`b1.js`): an unusual request from a silk merchant · sharing a table at a full inn · a parcel in the road · a disputed horse · a flooded crossing · treasure rumour at an inn · judging a village contest · a blind seer who knows your past (from the memory record) · the sunken salt barge · a junior disciple's challenge · a hundred-year shrine dispute · a rumour that you fixed a win (two scenes) · a bribe to throw a match · a teenage dare · running away with an opera troupe · a kite on the magistrate's roof · late-life amends to someone you wronged (from the memory record).

People events (`b1.js`): a former travelling companion (from the memory record) · a rival asks for help · a favour returned when you are down · a grown child's secret · a parent's story · a student surpasses you · an old friend visits in old age · reconciliation with someone you drifted from.

## Adding a batch

1. Write the content in a new file (for example `b2.js`, `st6.js`) and add its `<script>` tag to `page.html` after `b1.js`.
2. Run the validator: `node tools/validate.js <dir> 250 '<regex of new ids>'`. It loads every file and checks:
   - ids are unique, and `next` references, story stages and endings, and people-event ids all resolve;
   - no one-language text;
   - in random lives, with saves reloaded in the middle of decisions, every printed line is bilingual and clean;
   - the queue does not pile up;
   - which new incidents are never reached.
3. For anything the validator never reaches, set up its situation in a targeted test before assuming it works.
