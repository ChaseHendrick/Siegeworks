# Siegeworks

Six living historical miniatures, playable in a browser. Watch workers haul supplies, build approaches and defenses, and prepare siege engines. Grab and toss workers and soldiers, follow a person, or knock a formation off balance with a shockwave.

[Play on Hendrick Research](https://www.hendrickresearch.com/play/siegeworks/)

## The collection

| Siege | Setting | Engineering focus |
| --- | --- | --- |
| Masada, 73 / 74 CE | Roman, Judaean Desert | An earthen ramp over the natural western spur |
| Alesia, 52 BCE | Roman, Gaul | Inner and outer defenses, patrols, and a relief force |
| Jerusalem, 70 CE | Roman, Judaea | An assault approach to layered urban defenses |
| Tyre, 332 BCE | Macedonian, Phoenician coast | A stone causeway toward an island city |
| Constantinople, 1453 CE | Ottoman, Bosphorus | Protected artillery positions at the land walls |
| Candia, 1648–1669 CE | Ottoman, Venetian Crete | Trench approaches to a bastioned city |

All six worlds run locally and save separately in your browser. There are no accounts, trackers, service calls, or external asset requests.

## Controls

- Drag to orbit, right-drag to pan, scroll or pinch to zoom. Overview, Works, City, and Camp give close views.
- Click a person to inspect their job and condition. Follow this person moves the camera with them.
- Choose Grab & toss or press G. Hold a person to lift, release slowly to drop, or flick to throw. Scroll while holding to change height. Escape drops the person and returns to Explore.
- Choose Shockwave and click the ground. People react, tumble, recover, and return to their work.
- Space pauses. 1×, 4×, and 12× change miniature time. Number keys 1–4 select the camera views.
- Advance works completes construction and lets you watch the later phase. Restart clears only the current siege.
- The selector and historical notes pause time while open. Closing the page stops time; reopening restores progress.

## Simulation and scope

Three.js renders original procedural terrain, buildings, camps, boats, work crews, and siege engines. Bodies, limbs, carried baskets, work tools, rotating wheels, fluttering banners, dust, projectile arcs, and water surfaces are animated. Instanced actors and merged architecture keep drawing costs bounded.

Supply carts circulate in separate lanes with smooth turns and retain their spacing. Siege towers stay upright while their wheels and supports follow the ground. Opposing soldiers brought into contact engage in animated, nonfatal melee, then regroup. Ground crews plan routes around intact walls and buildings and can pass through a cleared breach.

Workers use local job states for loading, hauling, building, and returning to camp. Material is tracked per work cell. Engines wait until the works are ready. The ramp and causeway affect the height field; digging lowers the trench floor. Relief soldiers approach Alesia’s outer circuit in its later phase.

cannon-es supplies gravity, rigid bodies, matched terrain triangles, solid walls and buildings, adaptive collision steps, collision impulses, pickup constraints, tumbling, and ballistic projectiles. A controlled person becomes dynamic when grabbed or hit by a shockwave, then returns to their task after recovery. Figures are simple miniature bodies rather than anatomical ragdolls. Engine movement and route-following ships are controlled animations; this is not a calibrated military or structural simulator.

These are schematic engineering scenes, not measured archaeological reconstructions or a claim to reproduce the exact historical sequence. Geography, architecture, populations, timing, construction amounts, damage, and combat behavior are simplified. Archaeological remains and historical accounts are distinguished from assumptions in each world’s Historical notes. In particular, the Romans used a natural spur at Masada rather than building an entire mountain. Details of its final assault and the interpretation of the evidence remain debated. Candia was an Ottoman siege of a Venetian city, not a Roman campaign.

## Historical sources

- [Masada, UNESCO](https://whc.unesco.org/en/list/1040/), [Roman ramp, Israel Nature and Parks Authority](https://en.parks.org.il/article/the-roman-ramp-trail-at-masada-national-park/), [2024 archaeological analysis](https://doi.org/10.1017/S1047759424000084)
- [Alesia, Musée d’Archéologie nationale](https://musee-archeologienationale.fr/vercingetorix-et-alesia), [Alésia MuséoParc archaeology](https://alesia.com/archeologie/)
- [Josephus, Jewish War V](https://penelope.uchicago.edu/josephus/war-5.html), [Jewish War VI](https://penelope.uchicago.edu/josephus/war-6.html). Josephus is a historical narrative, not an impartial technical specification.
- [Tyre, UNESCO](https://whc.unesco.org/en/list/299/), [American University of Beirut archaeology museum](https://www.aub.edu.lb/museum_archeo/Documents/Newsletter%20September%202022%2C%20vol.%20XXXV.pdf)
- [Historic Areas of Istanbul, UNESCO](https://whc.unesco.org/en/list/356/), [Panorama 1453 History Museum](https://www.panoramikmuze.com/)
- [Contemporary Candia siege map, Royal Collection Trust](https://militarymaps.rct.uk/other-17th-century-conflicts/siege-of-candia-1648), [Municipality of Heraklion](https://www.heraklion.gr/en/visitor/history/tour-of-the-city.html)

## Run and build

Open `index.html` directly for the portable build, or serve it with any static HTTP server. For source changes:

```sh
npm ci
npm test
npm run build
python3 -m http.server 8767 --bind 127.0.0.1
```

The build bundles code, styles, Three.js, and cannon-es into one offline HTML file. Dependency notices are in `LICENSE.txt`; original code is MIT licensed. Node.js 20 or newer is recommended.

Tests cover autonomous construction and progression in every world, finite state, material bounds, engine gating, pause behavior, round-trip saves and corrupt saves, physical lifting and throwing, gravity and recovery, projectile trajectories, shockwaves, and restoration of dynamic bodies. Collision regressions cover terrain/render agreement, fast falling and thrown bodies, thin wall impacts, obstacle navigation, open breaches, cart clearance, enemy combat, and saves across all six worlds. Browser checks separately cover the actual rendered scenes, mouse pickup, per-siege persistence, historical notes, touch-sized layouts, and the site’s dim and full screen controls.
