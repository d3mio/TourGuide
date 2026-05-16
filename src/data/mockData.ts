export type Review = {
  id: number | string;
  name: string;
  stars: number;
  text: string;
  date: string;
  tags: string[];
  isMine?: boolean;
};

export type PackagePricing = {
  solo: number;
  duo: number;
  group: number;
};

export type Package = {
  id: string;
  name: string;
  tags: string[];
  desc: string;
  pricing: PackagePricing;
  itinerary: string[];
  accommodation: string;
  transport: string;
};

export type Place = {
  name: string;
  rating: number;
  desc: string;
};

export type CultureItem = {
  emoji: string;
  tag: string;
  title: string;
  desc: string;
};

export const DESTINATIONS = [
  'Sigiriya','Ella','Mirissa','Kandy','Galle Fort','Yala National Park',
  'Nuwara Eliya','Trincomalee','Anuradhapura','Polonnaruwa','Dambulla',
  'Arugam Bay','Horton Plains','Adams Peak','Bentota','Hikkaduwa',
  'Pinnawala','Knuckles Range','Mannar','Jaffna'
];

export const PROVINCES: Record<string, Place[]> = {
  'Central':     [{name:'Kandy',rating:4.9,desc:'Sacred city, cultural heartland, home to the Temple of the Tooth.'},{name:'Nuwara Eliya',rating:4.7,desc:"Ceylon tea highlands. Colonial architecture amid cloud forests."},{name:'Knuckles Range',rating:4.6,desc:'UNESCO biosphere reserve. Trekking amid mist-laden ridges.'}],
  'Southern':    [{name:'Galle Fort',rating:4.9,desc:'17th-century Dutch colonial ramparts overlooking the Indian Ocean.'},{name:'Mirissa',rating:4.8,desc:'World-class blue whale watching. Languid palm-lined crescent bay.'},{name:'Tangalle',rating:4.5,desc:'Secluded coves and nesting sea turtles at remote beaches.'}],
  'Western':     [{name:'Colombo',rating:4.6,desc:'Vibrant cosmopolitan capital. Art galleries, rooftop bars, street food.'},{name:'Bentota',rating:4.7,desc:'Lagoon adventures and Ayurvedic resorts on the golden coast.'},{name:'Negombo',rating:4.3,desc:'Fishing village charm with colonial Dutch canals and fresh seafood.'}],
  'Uva':         [{name:'Ella',rating:4.9,desc:"Nine Arch Bridge, Little Adam's Peak — a hiker's paradise."},{name:'Buduruwagala',rating:4.4,desc:'Ancient rock-cut Buddhist sculptures from the 9th century.'}],
  'North Central':[{name:'Sigiriya',rating:5.0,desc:'5th-century rock fortress. UNESCO site. Frescoes & water gardens.'},{name:'Anuradhapura',rating:4.8,desc:'Sacred ancient capital with towering dagobas and moonstone carvings.'},{name:'Polonnaruwa',rating:4.7,desc:'Medieval royal city. Gal Vihara colossal rock sculptures.'}],
  'Sabaragamuwa':[{name:'Adams Peak',rating:4.8,desc:'Sacred conical summit revered by four religions. Dawn pilgrimages.'},{name:'Pinnawala',rating:4.5,desc:'Elephant orphanage. Witness the river bathing ritual daily.'}],
  'Northern':    [{name:'Jaffna',rating:4.6,desc:'Distinctive Tamil culture, kovils, and causeway-laced lagoons.'},{name:'Mannar',rating:4.4,desc:'Flamingo flocks, ancient baobab tree, and a storied fort.'}],
  'Eastern':     [{name:'Trincomalee',rating:4.7,desc:"Finest natural harbour, Koneswaram Temple, Pigeon Island reef."},{name:'Arugam Bay',rating:4.8,desc:"World-ranked surf point. Laidback bay life. Leopard safaris nearby."}],
  'North Western':[{name:'Wilpattu',rating:4.7,desc:"Sri Lanka's oldest national park. Leopards in dense dry forest."},{name:'Kalpitiya',rating:4.5,desc:'Dolphin pods, kitesurfing lagoon, and deserted island chains.'}]
};

export const BG_COLORS = [
  'linear-gradient(135deg,#064e3b,#0a2420)',
  'linear-gradient(135deg,#1e1b4b,#0f0e1a)',
  'linear-gradient(135deg,#78350f,#3a180a)',
  'linear-gradient(135deg,#1e3a5f,#0a1628)',
  'linear-gradient(135deg,#3b1e5f,#160a28)',
  'linear-gradient(135deg,#374151,#111827)'
];

export const INITIAL_REVIEWS: Review[] = [
  {id:1, name:'James H.', stars:5, text:'The safari through Yala was unlike anything I\'ve experienced. Leopards at sunrise — absolutely breathtaking.', date:'2025-04-10', tags:['safari','wildlife','excellent']},
  {id:2, name:'Léa F.', stars:5, text:'Sigiriya at dawn before the crowds — our guide arranged private early access. Pure magic.', date:'2025-03-22', tags:['sigiriya','heritage','excellent']},
  {id:3, name:'Marco B.', stars:4, text:'Mirissa whale watching was superb. The boat was comfortable and the crew knowledgeable.', date:'2025-02-14', tags:['mirissa','whale','beach']},
  {id:4, name:'Priya K.', stars:5, text:'The cultural tour of Kandy and the Perahera festival was spectacular. Impeccably organized.', date:'2025-01-30', tags:['kandy','cultural','excellent']},
  {id:5, name:'Tom W.', stars:3, text:'Good experience overall. The Ella trip was enjoyable though the accommodation was slightly basic.', date:'2024-12-20', tags:['ella','accommodation']},
  {id:6, name:'Amara N.', stars:5, text:'Galle Fort walking tour with our private guide was outstanding — deeply knowledgeable and friendly.', date:'2024-11-05', tags:['galle','excellent','history']}
];

export const PACKAGES: Package[] = [
  {
    id:'pkg1', name:'7-Day Cultural Heritage Tour',
    tags:['Heritage','History','Spiritual'],
    desc:'An in-depth exploration of Sri Lanka\'s greatest ancient sites.',
    pricing:{solo:1290, duo:2180, group:890},
    itinerary:[
      'Day 1 — Arrival, Colombo City Tour',
      'Day 2 — Pinnawala Elephant Orphanage → Sigiriya',
      'Day 3 — Sigiriya Rock Fortress & Dambulla Cave Temple',
      'Day 4 — Anuradhapura Sacred City',
      'Day 5 — Polonnaruwa Medieval City',
      'Day 6 — Kandy Temple of the Tooth, Cultural Show',
      'Day 7 — Peradeniya Botanical Gardens → Departure'
    ],
    accommodation:'Heritage Bungalows & Boutique Hotels',
    transport:'Private AC vehicle throughout'
  },
  {
    id:'pkg2', name:'10-Day Tropical Escape',
    tags:['Beach','Wildlife','Relaxation'],
    desc:'Coast to jungle — the full spectrum of the island\'s natural splendour.',
    pricing:{solo:1890, duo:3200, group:1380},
    itinerary:[
      'Day 1–2 — Galle Fort exploration',
      'Day 3 — Mirissa whale watching',
      'Day 4 — Tangalle turtle beach',
      'Day 5 — Yala National Park full-day safari',
      'Day 6 — Transfer to Ella',
      'Day 7 — Nine Arch Bridge, Little Adam\'s Peak',
      'Day 8 — Nuwara Eliya tea country',
      'Day 9 — Bentota water sports',
      'Day 10 — Colombo → Departure'
    ],
    accommodation:'Beach Resorts & Eco Lodges',
    transport:'Private AC vehicle + boat transfers'
  },
  {
    id:'pkg3', name:'5-Day Northern Discovery',
    tags:['Off-Beat','Culture','History'],
    desc:'Explore the Tamil heritage and storied north of the island.',
    pricing:{solo:890, duo:1540, group:620},
    itinerary:[
      'Day 1 — Colombo → Jaffna, Fort & Market',
      'Day 2 — Nainativu Island Temple boat trip',
      'Day 3 — Mannar Fort, Baobab Tree, Flamingo Flats',
      'Day 4 — Wilpattu National Park safari',
      'Day 5 — Return to Colombo'
    ],
    accommodation:'Boutique Heritage Guesthouses',
    transport:'Private vehicle + ferry transfers'
  }
];

export const CULTURE_ITEMS: CultureItem[] = [
  {emoji:'🥁', tag:'Performing Arts', title:'Kandyan Dance', desc:'The sacred Kandyan dance — ves, naiyandi, udekki — performed at the Kandy Esala Perahera for over three centuries. An UNESCO intangible heritage of the world.'},
  {emoji:'🫖', tag:'Culinary Arts', title:'The Art of Ceylon Tea', desc:'From the misty estates of Nuwara Eliya to Dimbula and Uva, Ceylon tea is the world\'s finest. A guided tea plucking and tasting is a ritual not to be missed.'},
  {emoji:'🏰', tag:'Architecture', title:'Rock Fortresses & Dagobas', desc:'Sigiriya\'s frescoed lion citadel, Anuradhapura\'s monumental Ruwanwelisaya — ancient engineering and spiritual vision rendered in stone.'},
  {emoji:'🎪', tag:'Festival', title:'Kandy Esala Perahera', desc:'Ten nights of illuminated tuskers, fire dancers, Kandyan drummers, and the sacred relic casket. Sri Lanka\'s most spectacular cultural event each August.'},
  {emoji:'🌶️', tag:'Culinary Arts', title:'Spice & Curry Traditions', desc:'Sri Lankan cuisine layers cinnamon, cardamom, curry leaf, and Maldive fish into complex sambols and curries served on banana leaf. A cooking class here changes you.'},
  {emoji:'🛕', tag:'Spiritual Heritage', title:'Sacred Multi-Faith Coexistence', desc:'Adams Peak is summited by Buddhists, Hindus, Christians, and Muslims alike. Mosques, kovils, temples, and churches share neighbourhoods in a living testament to plural identity.'},
  {emoji:'🎨', tag:'Visual Arts', title:'Dumbara Mat Weaving', desc:'The intricate Dumbara mats of Kandy — woven from hemp and rush grass in precise geometric patterns — are a dying artform kept alive by a handful of master weavers.'},
  {emoji:'🤿', tag:'Natural Heritage', title:'Ancient Maritime Culture', desc:'Sri Lankan fishermen\'s stilt fishing is iconic. The island\'s maritime silk-road legacy spans centuries of trade with Arabia, China, and Europe.'}
];

export const WISHLIST = ['Sigiriya','Arugam Bay','Ella','Jaffna','Mirissa'];
