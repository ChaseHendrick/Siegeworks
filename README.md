# Siegeworks

Twenty-four living historical miniatures, playable in a browser. Watch work crews haul material, build ramps, moles, trenches and siege lines, and bring up towers, rams, trebuchets and guns. Defenders gather on the threatened wall and shoot back; relief armies march on the siege lines; day turns to night and a torch-lit night shift keeps working. Grab and toss workers and soldiers, follow a person, or knock a formation off balance with a shockwave.

[Play on Hendrick Research](https://www.hendrickresearch.com/play/siegeworks/)

## The collection

Thirteen of the sieges are Roman campaigns, and two more have Roman garrisons as the defenders.

| Siege | Date | Besiegers vs defenders | Setting | Siege works |
| --- | --- | --- | --- | --- |
| Masada | 73 / 74 CE | Roman vs Jewish rebels | Judaean Desert | Western siege ramp |
| Alesia | 52 BCE | Roman vs Gallic | Gaul | Double lines of fortification |
| Jerusalem | 70 CE | Roman vs Jewish defenders | Judaea | Assault terraces |
| Tyre | 332 BCE | Macedonian vs Tyrian | Phoenician coast | Stone causeway |
| Constantinople | 1453 CE | Ottoman vs Byzantine | Bosphorus | Artillery approach |
| Candia | 1648–1669 CE | Ottoman vs Venetian | Venetian Crete | Trenches and batteries |
| Lachish | 701 BCE | Assyrian vs Judahite | Kingdom of Judah | Stone siege ramp |
| Rhodes | 305–304 BCE | Antigonid vs Rhodian | Aegean | Levelled approach |
| Acre | 1189–1191 CE | Crusader vs Ayyubid | Levant coast | Camp ditches and ramparts |
| Château Gaillard | 1203–1204 CE | French vs Angevin | Normandy | Ditches and mines |
| Orléans | 1428–1429 CE | English vs French | Loire valley | Siege forts and earthworks |
| Vienna | 1683 CE | Ottoman vs Habsburg | Danube | Approach trenches and mines |
| Carthage | 149–146 BCE | Roman vs Carthaginian | North Africa | Harbour mole |
| Numantia | 134–133 BCE | Roman vs Celtiberian | Hispania | Circumvallation |
| Avaricum | 52 BCE | Roman vs Gallic (Bituriges) | Gaul | Siege terrace (agger) |
| Uxellodunum | 51 BCE | Roman vs Gallic (Cadurci) | Gaul | Ramp, tower and mines |
| Massilia | 49 BCE | Roman vs Massiliote Greek | Gaul (Provence) | Siege ramp and brick tower |
| Perusia | 41–40 BCE | Octavian vs Antonian | Etruria | Ditch and towered wall |
| Jotapata | 67 CE | Roman vs Jewish rebels | Galilee | Assault bank |
| Gamla | 67 CE | Roman vs Jewish rebels | Golan | Earth banks and rams |
| Machaerus | 71 / 72 CE | Roman vs Jewish rebels | Peraea | Siege wall and camps |
| Hatra | c. 198–199 CE | Roman vs Hatrene Arab | Upper Mesopotamia | Engine emplacements |
| Dura-Europos | c. 256 CE | Sasanian Persian vs Roman garrison | Euphrates | Siege ramp and mines |
| Amida | 359 CE | Sasanian Persian vs Roman garrison | Upper Tigris | Siege mounds and towers |

All twenty-four worlds run locally and save separately in your browser. There are no accounts, trackers, service calls, or external asset requests.

## Controls

- **Explore:** Drag to orbit, right-drag to pan, scroll or pinch to zoom. The Overview, Works, City and Camp views (keys 1–4) fly the camera closer.
- **Inspect:** Click anyone to see their side, job, condition, fatigue and story. *Follow this person* moves the camera with them.
- **Grab & toss (G):** Hold a person to lift them, release slowly to drop, or flick to throw. Scroll while holding to change height. Escape drops the person and returns to Explore.
- **Shockwave (B):** Click the ground. People react, tumble, recover, and return to their work.
- **Time:** Space pauses, and 1×, 4× and 12× change miniature time. A full day passes in eight minutes at 1×.
- **Advance works:** Completes construction so you can watch the later phase. Restart clears only the current siege.
- **Display settings:** Under the gear button. *High* graphics add a tilt-shift depth of field, finer shadows and multisampled edges; *Balanced* is lighter for older devices. The day–night cycle can be switched to *Always day*.
- **Pausing:** The selector, notes, help and settings dialogs pause time while open. Closing the page stops time; reopening restores progress.

## How the crews behave

- **Workers** choose the open part of the works that most needs material, so loads are not wasted on finished ground, and reroute if someone fills their spot first. They keep apart in walking lanes, grow tired and rest by the camp fires, and at night half the crew sleeps while the other half works on by torchlight.
- **Attackers** screen the work front with a shield line, drill in camp, and post sentries. When the works are ready they form an assault column behind the tower or beside the batteries. Where the city fell by assault, they storm the breach once the wall gives way.
- **Defenders** concentrate on the threatened stretch of wall as the works approach. Their archers, slingers or musketeers shoot at crews and escorts in range. When a breach opens they come down to hold it, and in ring sieges they sortie against the lines.
- **Relief armies** (Alesia, Acre, Orléans and Vienna) wait beyond the lines and then attack the besiegers, who turn to face them.

Combat is schematic and nonfatal: figures take hits, regroup and recover.

## Where the miniature follows the outcome

The later phase follows each siege's recorded ending rather than always ending in a breach:

- **A breach opens** where the city fell by assault.
- **The walls hold and only show damage** where the attackers withdrew (Hatra), a peace ended the siege (Rhodes), the city surrendered (Uxellodunum, Massilia), or a relief army drove the besiegers off (Vienna).
- **At Dura-Europos** the city fell, but how is unknown, so the walls there do not break either.
- **Ring sieges end** in a relief attack or in breakout attempts.

The finale label in the overview card names that ending.

## Simulation and graphics

Three.js renders original procedural terrain, buildings, camps, ships, crews and engines. The terrain is shaded from its own shape: slopes, rock strata, shorelines, trodden paths, contact shadows around walls and buildings, and the changing colour of the works themselves. Water has depth-tinted shallows and moving foam.

A sky dome, sun and moon follow the miniature clock. After dusk the camps glow with fires and wall torches, and carried torches light the night shift. Particles carry dust, smoke, muzzle flashes, sparks, splashes and rain; at Avaricum, which Caesar says was taken in a rainstorm, it rains.

Figures wear broad period cues for their side: helmets, turbans, Janissary börk caps, morions and hats, and rectangular, round or oval shields. They carry swords, spears, pikes, bows or muskets, and sit, crouch, brace, aim or swing depending on what they are doing. Engines include siege towers (iron-plated at Jotapata and Rhodes; a six-storey brick tower at Massilia that grows as the siege goes on), an Assyrian-style ram engine, bronze guns and a great bombard, a trebuchet and a Roman torsion engine. Carts are drawn by mules. The board sits on a walnut plinth with a nameplate.

cannon-es supplies gravity, rigid bodies, matched terrain triangles, solid walls and buildings, adaptive collision steps, collision impulses, pickup constraints, tumbling and ballistic projectiles. Arrows, sling bullets and musket balls fly as ballistic points traced against the physics world. A controlled person becomes dynamic when grabbed or hit by a shockwave, then returns to their task after recovery. Ground crews plan routes around intact walls and buildings with A* on a walkability grid and can pass through an open breach. Engine movement and ships are controlled animations; this is not a calibrated military or structural simulator.

These are schematic engineering scenes, not measured archaeological reconstructions or a claim to reproduce the exact historical sequence. Geography, architecture, populations, timing, construction amounts, clothing, damage and combat behaviour are simplified, and several boards are turned so that the attack comes from the same side. Each world's *Historical notes* separate what written accounts and archaeology report from what the miniature assumes, and say where scholars disagree.

## Historical sources

Each siege's notes link to the sources below. Ancient narratives such as Caesar, Josephus, Appian, Diodorus, Cassius Dio and Ammianus are historical accounts, not impartial technical specifications.

- **Masada:** [Masada, UNESCO](https://whc.unesco.org/en/list/1040/), [Roman ramp, Israel Nature and Parks Authority](https://en.parks.org.il/article/the-roman-ramp-trail-at-masada-national-park/), [2024 archaeological analysis](https://doi.org/10.1017/S1047759424000084)
- **Alesia:** [Alesia, Musée d’Archéologie nationale](https://musee-archeologienationale.fr/vercingetorix-et-alesia), [Archaeology, Alésia MuséoParc](https://alesia.com/archeologie/)
- **Jerusalem:** [Josephus, Jewish War, Book V](https://penelope.uchicago.edu/josephus/war-5.html), [Josephus, Jewish War, Book VI](https://penelope.uchicago.edu/josephus/war-6.html)
- **Tyre:** [Tyre, UNESCO](https://whc.unesco.org/en/list/299/), [Tyre archaeological research, American University of Beirut](https://www.aub.edu.lb/museum_archeo/Documents/Newsletter%20September%202022%2C%20vol.%20XXXV.pdf)
- **Constantinople:** [Historic Areas of Istanbul, UNESCO](https://whc.unesco.org/en/list/356/), [Panorama 1453 History Museum](https://www.panoramikmuze.com/)
- **Candia:** [Contemporary siege map, Royal Collection Trust](https://militarymaps.rct.uk/other-17th-century-conflicts/siege-of-candia-1648), [Historic city, Municipality of Heraklion](https://www.heraklion.gr/en/visitor/history/tour-of-the-city.html)
- **Lachish:** [Lachish relief panel, British Museum](https://www.britishmuseum.org/collection/object/W_1856-0909-14_2), [Garfinkel et al. 2021, Constructing the Assyrian siege ramp at Lachish](https://doi.org/10.1111/ojoa.12231), [Lachish and its siege ramps, Biblical Archaeology Society](https://library.biblicalarchaeology.org/sidebar/lachish-and-its-siege-ramps/)
- **Rhodes:** [Diodorus Siculus 20.81–88, LacusCurtius](https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Diodorus_Siculus/20D%2A.html), [Diodorus Siculus 20.91–100, LacusCurtius](https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Diodorus_Siculus/20E%2A.html), [Antigonus I Monophthalmus, Britannica](https://www.britannica.com/biography/Antigonus-I-Monophthalmus)
- **Acre:** [Itinerarium Peregrinorum, Fordham Medieval Sourcebook](https://sourcebooks.web.fordham.edu/source/1191acre.asp), [A. V. Murray, review of Hosler, The Siege of Acre (Speculum)](https://doi.org/10.1086/711859), [The Siege of Acre, Yale University Press](https://yalebooks.yale.edu/2020/04/14/the-siege-of-acre/)
- **Château Gaillard:** [Siège de Château-Gaillard, Encyclopædia Universalis](https://www.universalis.fr/encyclopedie/siege-de-chateau-gaillard/), [William the Breton, Philippide VII](https://remacle.org/bloodwolf/historiens/guillaumelebreton/philippide7.htm), [Les Andelys, Château Gaillard, ADLFI archaeology notice](https://doi.org/10.4000/adlfi.12220)
- **Orléans:** [Siege of Orléans, Britannica](https://www.britannica.com/event/Siege-of-Orleans), [Saint Joan of Arc, Britannica](https://www.britannica.com/biography/Saint-Joan-of-Arc), [K. DeVries, Gunpowder weaponry and Joan of Arc (War & Society)](https://doi.org/10.1179/072924796791200889)
- **Vienna:** [Zweite Türkenbelagerung (1683), Wien Geschichte Wiki](https://www.geschichtewiki.wien.gv.at/Zweite_T%C3%BCrkenbelagerung_%281683%29), [Stadtbefestigung, Wien Geschichte Wiki](https://www.geschichtewiki.wien.gv.at/Stadtbefestigung), [Merzifonlu Kara Mustafa Paşa, Britannica](https://www.britannica.com/biography/Merzifonlu-Kara-Mustafa-Pasa)
- **Carthage:** [Appian, Punic Wars 117–126, Perseus](https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.01.0230%3Atext%3DPun.%3Achapter%3D18), [H. Hurst, Understanding Carthage as a Roman port](https://bollettinodiarcheologiaonline.beniculturali.it/wp-content/uploads/2019/01/6_Hurst_paper.pdf), [Third Punic War, Britannica](https://www.britannica.com/event/Third-Punic-War)
- **Numantia:** [Appian, Wars in Spain 90–98, Perseus](https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.01.0230%3Atext%3DHisp.%3Achapter%3D15), [Numancia, Junta de Castilla y León](https://www.jcyl.es/jcyl/patrimoniocultural/GuiaLugaresArqueologicos/soria/04soria/index.html), [Numantia, Britannica](https://www.britannica.com/place/Numantia)
- **Avaricum:** [Caesar, Gallic War VII, LacusCurtius](https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Caesar/Gallic_War/7C%2A.html), [L. Augier et al. 2024, Topography of Bourges in the Iron Age](https://doi.org/10.46608/basic1.9782356134929.18), [Bourges, Britannica](https://www.britannica.com/place/Bourges)
- **Uxellodunum:** [Caesar (Hirtius), Gallic War VIII, LacusCurtius](https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Caesar/Gallic_War/8A%2A.html), [J.-M. Pailler, review of Girault, La Fontaine de Loulié (Pallas)](https://doi.org/10.4000/pallas.2404), [Uxellodunum, Mairie de Vayrac](https://www.vayrac.fr/tourisme/uxellodunum)
- **Massilia:** [Caesar, Civil War II, LacusCurtius](https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Caesar/Civil_Wars/2A%2A.html), [La Bourse, INRAP archaeological atlas of Marseille](https://multimedia.inrap.fr/atlas/marseille/sites/2878/La-Bourse), [Marseille, Britannica](https://www.britannica.com/place/Marseille/Administration-and-social-conditions)
- **Perusia:** [Appian, Civil Wars 5.30–38, Perseus](https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.01.0232%3Abook%3D5%3Achapter%3D4), [Lead sling bullet from Perusia, Ashmolean Museum](https://latininscriptions.ashmus.ox.ac.uk/xml/AN_Fortnum_V_241.xml), [Sling bullet, Perugia, Italian Ministry of Culture catalogue](https://catalogo.beniculturali.it/detail/ArchaeologicalProperty/1000156554)
- **Jotapata:** [Josephus, Jewish War III](https://penelope.uchicago.edu/josephus/war-3.html), [Yodfat, New Encyclopedia of Archaeological Excavations in the Holy Land](https://library.biblicalarchaeology.org/book/the-new-encyclopedia-of-archaeological-excavations-in-the-holy-land/yodfat/), [Adan-Bayewitz and Aviam 1997, Journal of Roman Archaeology](https://doi.org/10.1017/S1047759400014768)
- **Gamla:** [Josephus, Jewish War IV](https://penelope.uchicago.edu/josephus/war-4.html), [Gamla, Jewish Virtual Library (Israel Ministry of Foreign Affairs text)](https://jewishvirtuallibrary.org/gamla), [Gamala, New Encyclopedia of Archaeological Excavations in the Holy Land](https://library.biblicalarchaeology.org/book/the-new-encyclopedia-of-archaeological-excavations-in-the-holy-land/gamala/)
- **Machaerus:** [Josephus, Jewish War VII](https://penelope.uchicago.edu/josephus/war-7.html), [M. J. F. Fowler, AARGnews 64 (2022)](https://aargonline.com/wp/wp-content/uploads/2022/10/AARGnews64.pdf), [Gy. Vörös, Archaeological missions to Machaerus (SHAJ 13)](https://publication.doa.gov.jo/uploads/publications/208/SHAJ_2019_13_-321-336.pdf)
- **Hatra:** [Cassius Dio, Roman History 76, LacusCurtius](https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Cassius_Dio/76%2A.html), [Hatra, UNESCO World Heritage Centre](https://whc.unesco.org/en/list/277/), [Hatra, Britannica](https://www.britannica.com/place/Hatra)
- **Dura-Europos:** [S. James 2011, Stratagems, combat and chemical warfare in the siege mines of Dura-Europos (AJA)](https://ajaonline.org/article/360/), [Dura-Europos, Yale University Art Gallery](https://duraeuropos.artgallery.yale.edu/), [Dura-Europos: archaeology and history, Encyclopaedia Iranica](https://www.iranicaonline.org/articles/dura-europos/dura-europos-i-archaeology-and-history/)
- **Amida:** [Ammianus Marcellinus 19, LacusCurtius](https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Ammian/19%2A.html), [Ammianus Marcellinus 18, LacusCurtius](https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Ammian/18%2A.html), [Ancient Iran: the Sasanian period, Britannica](https://www.britannica.com/place/ancient-Iran/The-Sasanian-period)

## Run and build

Open `index.html` directly for the portable build, or serve it with any static HTTP server. For source changes:

```sh
npm ci
npm test
npm run build
python3 -m http.server 8767 --bind 127.0.0.1
```

The build bundles code, styles, Three.js and cannon-es into one offline HTML file. Dependency notices are in `LICENSE.txt`; original code is MIT licensed. Node.js 20 or newer is recommended.

## Tests

- **Simulation and physics** (`tests/simulation.mjs`, all 24 worlds): autonomous construction and progression, engine gating, pause behaviour, round-trip and corrupt saves, physical lifting and throwing, gravity and recovery, projectile trajectories, shockwaves, and restoring dynamic bodies.
- **Collisions** (`tests/collisions.mjs`): terrain and render agreement, fast falling and thrown bodies, thin wall impacts, obstacle navigation, open breaches, cart clearance, enemy combat, and saves.
- **Behaviour** (`tests/ai.mjs`):
  - complete notes, sources and dress for every siege, with dry camps, carts and works
  - workers deliver on nearly every trip, avoid oversubscribing cells and keep their spacing
  - rest at night, torches and a working night shift
  - defenders concentrating on the threatened wall and shooting
  - breaches only where the city fell by assault, and walls that hold elsewhere
  - relief armies and sorties reaching the siege lines
  - compatibility with older saves
