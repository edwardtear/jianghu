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

Text is always `T(english, chinese)`. Outcomes are `{w, t, c, fx, next, keep}`; `fx` uses the effects in `applyFx` (`life.js`). When an amount depends on the scene, write the whole `fx` as a function, `fx:(s,c)=>({money:c.amt})`, not a function inside it. Events that add someone to your relationships (`meet`, `enemy`) use `c.npc`, so set `npc` in `ctx` to the person the scene is about.

## Inventory (October 2026, after Batch 4)

- 1,364 incidents in 73 files; 33 story series (186 endings); about 200 sect scenes; 32 encounters; 32 people events; 100 activities; 24 person actions; 18 kinds of date (`date.js`).
- Simulation reaches all but about 2% of incidents within 400 lives.
- Thin areas before Batch 1: teenage years (20 teen-only incidents), region-specific scenes, reconciliation. Late life turned out to be well covered already (about 44 scenes aged 50+); what was missing was legacy: nothing in an heir's life remembered the parent.

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

## Batch 2 (34 units)

Job dilemmas (`b2.js`), one for each job that had none or almost none: inn waiter (a missing guest's sword) · dock porter (a crate that breathes, two scenes) · smith (a blade made to break) · bookkeeper (the master's son's missing money) · tutor (the poor pupil or the rich one) · doctor (a wounded fugitive at midnight) · storyteller (paid to slander) · opera actor (a patron's supper) · house guard (the master's son) · constable (arrest the convenient man) · official (flood relief money).

Teenage years (`b2.js`): delivering a rival's love letter · an apprenticeship offer · a bell-tower race · sneaking out to see a famous swordswoman.

Regions (`b2.js`), one scene each, only in that region: Shu (a face-changer's trick) · the North (a scarred colt at the horse fair) · the West (a monk carrying sutras) · the Miao borderlands (the Sisters' Meal) · the East coast (a typhoon) · the capital (exam questions for sale) · Jiangnan (dying silkworms) · the Central Plains (a failing Yellow River dike).

Sect life by rank (`b2.js`): outer disciple (a senior takes your rations) · inner disciple (first errand with a junior) · personal disciple (asked to spy on a teacher) · elder (voting for the next head) · head (an alliance sealed by a marriage).

Family (`b2.js`, people events): a teenage child's choices · a spouse who feels neglected · the in-laws come to stay · a grown child brings someone home.

Mysteries (`st6.js`), clue-based, with the answer fixed when the story opens and wrong accusations that stick: 喜宴 The Wedding Cup · 假银 False Silver.

## Batch 3 (26 units): what a life leaves behind

The legacy record (`b3.js`): when you carry on as your child, the heir gets `s.legacy` with the parent's name, fame, alignment, deeds, close friends, people helped and wronged (from the memory record), unfinished stories, a handwritten manual if one was written, and the grandparent's name. Loans the parent made pass to the heir. Enemies carried over are marked `inherited`.

Heir scenes (`b3.js`): the parent's old friend visits · the grave at Qingming (offerings, a defaced stone, or a quiet day, by the parent's alignment) · someone the parent wronged · someone the parent saved · living in a famous parent's shadow · an unsent letter · the parent's handwritten manual · the inherited enemy at the crossroads (two scenes) · the old family house · a storyteller's version of your grandparent · the parent's unfinished story.

Late life, new angles only (`b3.js`): failing eyes · failing ears · caring for a sick spouse (people event) · life after being widowed · the last of your old friends · hearing your own legend told wrong · writing your art down for your children (becomes the heir's manual).

Stories that outlive you (`st7.js`): 三十年之约 The Thirty-Year Promise · 半块玉 Half a Jade Disc. Each registers a `STORY_INHERIT[id]` handler, so an heir who takes up the parent's notes continues the story where it stopped, with its own 'finished by your child' ending.

Testing: `heirtest.js` in the scratchpad plays a parent to 40, sets up friends, an enemy, a loan, memories, a manual and an unfinished story, carries on as the child and plays 45 more years.

## Batch 4 (26 units): 门派风云

Sect content already had about 196 scenes (every sect's own flavour, around 30 sect missions, succession, contests, a lost manual, being framed). What it lacked was stories that unfold over years, and a few angles.

Sect stories (`st8.js`): 内鬼 The Traitor Within (clue-based; three suspects, the culprit fixed at the start, a false-roster trap, the option to turn the traitor) · 禁术 The Forbidden Manual (power that costs you; burn it, confess, or master it and be cast out) · 两派血案 A Death Between Two Sects (envoy work: apology, a duel of champions, or finding out what really happened) · 师恩 Your Master's Last Years (one last wish: a lost son, a journey home, or an unfinished move; if the master dies first, you inherit their sword).

One-off scenes (`b4.js`): surpassing your master in public · your master punishes the wrong disciple · a new, harsher master after yours dies · cheating at the promotion test · secretly learning from an outsider · seniors bullying new disciples (rank 2+) · reforming the founders' rules (as head) · the sect runs out of money · a hostage disciple from another sect · a birthday gift that is an insult · your former sect asks you back · your former sect wants its art back.

## Adding a batch

1. Write the content in a new file (for example `b3.js`, `st7.js`) and add its `<script>` tag to `page.html` after `st8.js`.
2. Run the validator: `node tools/validate.js <dir> 250 '<regex of new ids>'`. It loads every file and checks:
   - ids are unique, and `next` references, story stages and endings, and people-event ids all resolve;
   - no one-language text;
   - in random lives, with saves reloaded in the middle of decisions, every printed line is bilingual and clean;
   - the queue does not pile up;
   - which new incidents are never reached.
3. For anything the validator never reaches, set up its situation in a targeted test before assuming it works.
