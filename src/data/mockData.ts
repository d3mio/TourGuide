import { Drum, Coffee, Castle, Tent, FlameKindling, Building, Paintbrush, Ship, Leaf, Compass, Users, BookOpen } from "lucide-react";

export type Review = {
  id: number | string;
  name: string;
  stars: number;
  text: string;
  date: string;
  tags: string[];
  isMine?: boolean;
};



export type Package = {
  id: string;
  name: string;
  tags: string[];
  desc: string;
  itinerary: string[];
  accommodation: string;
  transport: string;
};

export type Excursion = {
  id: string;
  title: string;
  badge: string;
  duration: string;
  desc: string;
  stops: string;
  travelInfo: string;
  itinerary: { time: string; event: string }[];
};

export type Place = {
  name: string;
  rating: number;
  desc: string;
};

export type CultureItem = {
  Icon: any;
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
    id: 'basic',
    name: 'The Explorer\'s Trail (Basic)',
    tags: ['Backpackers', 'Couples', 'Budget'],
    desc: 'Perfect for budget travelers, backpackers, and adventurous couples. Experience Sri Lanka like a local by utilizing the gorgeous highland rail tracks and public buses. Stay in cozy guesthouses and sample rich local street food markets.',

    itinerary: [
      'Day 1–2 — Colombo arrival, city street-food tour',
      'Day 3–4 — Public train to Kandy, Temple of the Tooth',
      'Day 5–6 — Scenic blue train ride to Ella, hike Little Adam\'s Peak',
      'Day 7–8 — Local bus to Weligama / Hiriketiya, beach hostels & surfing',
      'Day 9–10 — Galle Fort walk, return to Colombo'
    ],
    accommodation: 'Local homestays, guesthouses & surf hostels',
    transport: 'Scenic trains (2nd/3rd class) & public buses'
  },
  {
    id: 'economic',
    name: 'The Heritage & Comfort Tour (Economic)',
    tags: ['Families', 'Honeymoons', 'Comfort'],
    desc: 'Balanced comfort, convenience, and value. Stay in mid-range boutique hotels and eco-resorts. Travel comfortably with a dedicated private air-conditioned vehicle and local driver, offering flexibility for families and honeymooners.',

    itinerary: [
      'Day 1–2 — Colombo transfer, coastal highway to Galle Dutch Fort',
      'Day 3–4 — Mirissa beach relaxing, blue whale watching boat tour',
      'Day 5–6 — Udawalawe National Park elephant safari & transit home visit',
      'Day 7–8 — Scenic highland drive to Kandy, Temple of the Tooth & cultural show',
      'Day 9–10 — Climb Sigiriya Lion Rock citadel & Dambulla Golden Cave Temple',
      'Day 11–12 — Trincomalee beach cove snorkeling & historical fort walk',
      'Day 13–14 — Return to Colombo for shopping & departure'
    ],
    accommodation: '3-star boutique hotels & family eco-resorts',
    transport: 'Private AC Sedan / Van with English-speaking driver'
  },
  {
    id: 'premium',
    name: 'The Island Grandeur Tour (Premium)',
    tags: ['Groups', 'Multi-Gen', 'Luxury'],
    desc: 'Travel in premium style and absolute comfort. Stay in curated 4-star boutique resorts and luxury eco-lodges. Move with a dedicated tourist coach and professional national guide. Includes private culinary demonstrations and local expert interactions.',

    itinerary: [
      'Day 1–2 — Colombo airport welcome, stay in premium Galle Face hotel',
      'Day 3–4 — Drive south to Galle Fort, stay in converted colonial mansion',
      'Day 5–7 — Private naturalist guided jeep safari in Yala National Park, luxury glamping tents',
      'Day 8–10 — Mountain train to Nuwara Eliya, tea plantation plucking & private bungalows',
      'Day 11–13 — Drive to Kandy and Sigiriya, private tour of Sigiriya frescoes & village buffet',
      'Day 14–16 — Madu River boat safari, turtle conservation tour, Colombo departure'
    ],
    accommodation: '4-star boutique resorts, luxury glamping tents & tea bungalows',
    transport: 'Luxury private coach/van with professional national guide'
  },
  {
    id: 'vvip',
    name: 'The Ceylon Odyssey Elite (VVIP)',
    tags: ['Bespoke', 'Helicopter', 'Ultra-Lux'],
    desc: 'The absolute height of luxury and exclusivity. Fly across the island with private scenic helicopter transfers. Stay in ultra-luxury 5-star properties, private wellness sanctuaries, and serviced villas. Accompanied by naturalists, private chefs, and dedicated security.',

    itinerary: [
      'Day 1–2 — VVIP fast-track arrival, private helicopter transfer to Galle coastal villa',
      'Day 3–4 — Private yacht cruise along the southern coast, whale watching & champagne lunch',
      'Day 5–6 — Helicopter to Yala Park, exclusive park buyout, private night game safari',
      'Day 7–8 — Helicopter to Ella tea highlands, stay in 5-star resort with private butler service',
      'Day 9–10 — Heli transfer to Sigiriya, private archaeological tour & candlelight ruins dining',
      'Day 11–14 — Helicopter to Colombo, VVIP spa retreats, private jet transfer departure'
    ],
    accommodation: '5-star ultra-luxury resorts, private buy-out villas & wellness retreats',
    transport: 'Private helicopter transfers + luxury SUV with dedicated concierge'
  }
];

export const EXCURSIONS: Excursion[] = [
  {
    id: "colombo-ella",
    title: "Colombo ⟶ Ella",
    badge: "Scenic Highlands",
    duration: "Full Day Express",
    desc: "An early start takes you high into the mist-covered mountains of Ella. View iconic railway bridges and roaring waterfalls in a rapid, unforgettable tour.",
    stops: "Nine Arch Bridge, Little Adam's Peak, Ravana Falls",
    travelInfo: "5.5 Hours (Express Car / Train Transfer)",
    itinerary: [
      { time: "05:30 AM", event: "Departure from Colombo hotel in private AC express vehicle" },
      { time: "10:30 AM", event: "Reach Ella, climb Little Adam's Peak for panoramic gap views" },
      { time: "12:30 PM", event: "Lush lunch at Ella town overlooking the valleys" },
      { time: "02:00 PM", event: "Walk to Nine Arch Bridge to witness the classic blue train cross" },
      { time: "03:30 PM", event: "Refreshments at Ravana Falls and premium tea tasting session" },
      { time: "05:00 PM", event: "Scenic return drive to Colombo (arriving around 10:30 PM)" }
    ]
  },
  {
    id: "colombo-sigiriya",
    title: "Colombo ⟶ Sigiriya / Dambulla",
    badge: "Ancient Wonders",
    duration: "14 Hours",
    desc: "Journey deep into the Cultural Triangle. Scale the majestic Sigiriya Lion Rock citadel and wander through the historic cave temple temples of Dambulla.",
    stops: "Sigiriya Lion Rock, Dambulla Cave Monasteries",
    travelInfo: "4 Hours Road Travel",
    itinerary: [
      { time: "06:00 AM", event: "Departure from Colombo hotel" },
      { time: "09:30 AM", event: "Arrive in Dambulla, explore the 5 sacred cave temples" },
      { time: "11:30 AM", event: "Traditional Sri Lankan wood-fired lunch buffet in a village farm" },
      { time: "01:30 PM", event: "Climb the UNESCO Sigiriya Lion Rock Fortress" },
      { time: "04:30 PM", event: "Afternoon tea and drive back to Colombo" },
      { time: "08:30 PM", event: "Arrive back at your Colombo hotel" }
    ]
  },
  {
    id: "colombo-galle",
    title: "Colombo ⟶ Galle",
    badge: "Coastal Heritage",
    duration: "10 Hours",
    desc: "Drive south along the coastal expressway. Walk Galle's Dutch colonial fort, see the famous stilt fishermen, and visit sea turtle hatcheries.",
    stops: "Galle Dutch Fort, Turtle Hatchery, Stilt Fishermen",
    travelInfo: "2 Hours via Southern Expressway",
    itinerary: [
      { time: "07:30 AM", event: "Expressway departure from Colombo" },
      { time: "09:00 AM", event: "Visit turtle conservation center at Kosgoda" },
      { time: "10:30 AM", event: "Observe and photograph traditional stilt fishermen in Weligama" },
      { time: "12:00 PM", event: "Gourmet seafood lunch inside the historic Galle Fort" },
      { time: "01:30 PM", event: "Guided history walk of Galle Fort, lighthouse, and museums" },
      { time: "04:00 PM", event: "Coffee stop & sunset walk at Unawatuna beach" },
      { time: "05:30 PM", event: "Expressway return drive, arriving Colombo at 7:30 PM" }
    ]
  },
  {
    id: "colombo-yala",
    title: "Colombo ⟶ Yala / Udawalawe",
    badge: "Wild Safari",
    duration: "16 Hours",
    desc: "A wild adventure. Spot Sri Lankan leopards, wild elephants, peacocks, and bears in their natural habitats on a private jeep safari.",
    stops: "Udawalawe Transit Home, Yala National Safari",
    travelInfo: "3.5 Hours via Southern Expressway",
    itinerary: [
      { time: "05:00 AM", event: "Early morning pickup and highway departure" },
      { time: "08:30 AM", event: "Watch baby elephants being fed at Udawalawe Transit Home" },
      { time: "10:30 AM", event: "Scenic transfer to Yala park entrance" },
      { time: "12:00 PM", event: "Bento box lunch near the beach boundary" },
      { time: "02:00 PM", event: "4x4 open-jeep afternoon wildlife safari tour" },
      { time: "06:00 PM", event: "Safari ends, transfer back to vehicle and drive home" },
      { time: "09:30 PM", event: "Drop-off in Colombo" }
    ]
  }
];

export const CULTURE_ITEMS: CultureItem[] = [
  {Icon: Drum, tag:'Performing Arts', title:'Kandyan Dance', desc:'The sacred Kandyan dance — ves, naiyandi, udekki — performed at the Kandy Esala Perahera for over three centuries. An UNESCO intangible heritage of the world.'},
  {Icon: Coffee, tag:'Culinary Arts', title:'The Art of Ceylon Tea', desc:'From the misty estates of Nuwara Eliya to Dimbula and Uva, Ceylon tea is the world\'s finest. A guided tea plucking and tasting is a ritual not to be missed.'},
  {Icon: Castle, tag:'Architecture', title:'Rock Fortresses & Dagobas', desc:'Sigiriya\'s frescoed lion citadel, Anuradhapura\'s monumental Ruwanwelisaya — ancient engineering and spiritual vision rendered in stone.'},
  {Icon: Tent, tag:'Festival', title:'Kandy Esala Perahera', desc:'Ten nights of illuminated tuskers, fire dancers, Kandyan drummers, and the sacred relic casket. Sri Lanka\'s most spectacular cultural event each August.'},
  {Icon: FlameKindling, tag:'Culinary Arts', title:'Spice & Curry Traditions', desc:'Sri Lankan cuisine layers cinnamon, cardamom, curry leaf, and Maldive fish into complex sambols and curries served on banana leaf. A cooking class here changes you.'},
  {Icon: Building, tag:'Spiritual Heritage', title:'Sacred Multi-Faith Coexistence', desc:'Adams Peak is summited by Buddhists, Hindus, Christians, and Muslims alike. Mosques, kovils, temples, and churches share neighbourhoods in a living testament to plural identity.'},
  {Icon: Paintbrush, tag:'Visual Arts', title:'Dumbara Mat Weaving', desc:'The intricate Dumbara mats of Kandy — woven from hemp and rush grass in precise geometric patterns — are a dying artform kept alive by a handful of master weavers.'},
  {Icon: Ship, tag:'Natural Heritage', title:'Ancient Maritime Culture', desc:'Sri Lankan fishermen\'s stilt fishing is iconic. The island\'s maritime silk-road legacy spans centuries of trade with Arabia, China, and Europe.'}
];

export const WISHLIST = ['Sigiriya','Arugam Bay','Ella','Jaffna','Mirissa'];

export const PILLARS_DATA = {
  history: {
    title: "History & Ancient Ruins",
    tagline: "Step back 2500+ years into sacred cities",
    bg: "/assets/heritage.png",
    icon: Castle,
    desc: "Sri Lanka's history spans over two and a half millennia, chronicled in the ancient Pali epics. Explore the Cultural Triangle, home to towering stupas, rock temples, and ruins of ancient capitals that once stood as centers of trade and Buddhist learning.",
    highlights: [
      "Sigiriya Lion Rock: A 5th-century palace fortress built atop a sheer 200m rock plug, famous for its colorful frescoes and mirror wall.",
      "Anuradhapura: The first kingdom of Sri Lanka, showcasing massive brick dagobas like Ruwanwelisaya that rival the pyramids of Giza in size.",
      "Polonnaruwa: The medieval capital featuring the spectacular Gal Vihara, four colossal Buddha statues carved into a single granite rock face.",
      "Dambulla Cave Temple: A massive cave monastery complex containing over 150 stunning Buddha statues and wall paintings dating back to the 1st century BC."
    ],
    tip: "When visiting sacred historical sites, ensure your shoulders and knees are covered, and remove shoes and hats before entering temple premises."
  },
  culture: {
    title: "Culture & Living Traditions",
    tagline: "A vibrant tapestry of multi-faith heritage",
    bg: "https://images.unsplash.com/photo-1578593139888-39622e207264?q=80&w=800&auto=format&fit=crop",
    icon: Drum,
    desc: "Influenced by Buddhism, Hinduism, Islam, and Christianity, Sri Lanka boasts a rich, complex cultural heritage. Experience traditional drumming, Kandyan dancing, intricate arts and crafts, and spice-infused culinary rituals passed down through generations.",
    highlights: [
      "Temple of the Tooth: The sacred tooth relic of the Buddha housed in a golden-roofed temple in Kandy, the spiritual capital.",
      "Esala Perahera: The grand festival in August featuring hundreds of dancers, drummers, and beautifully decorated elephants.",
      "Culinary Heritage: Coconut sambols, egg hoppers, and curry leaf infusions that make Sri Lankan food unique and fragrant.",
      "Stilt Fishing: The iconic coastal fishing tradition in the south, demonstrating balance and patience."
    ],
    tip: "August is the peak cultural season due to the Kandy Perahera. Book your accommodation and viewing seats months in advance!"
  },
  adventure: {
    title: "Adventure & Outdoor Sports",
    tagline: "Thrills across wild mountains and turquoise waves",
    bg: "/assets/adventure.png",
    icon: Compass,
    desc: "From the world-class surf breaks of Arugam Bay and Mirissa to the mist-shrouded peaks of the central highlands, Sri Lanka is an action-packed paradise. Trek through tea estates, raft down raging rivers, or kitesurf in shallow lagoons.",
    highlights: [
      "Hiking Ella: Trek to the top of Ella Rock or Little Adam's Peak for stunning views over the Ella Gap.",
      "Surfing Arugam Bay: Ranked among the top surf points in the world, offering long, consistent right-hand point breaks.",
      "Whitewater Rafting Kitulgala: Navigate the turbulent rapids of the Kelani River, surrounded by tropical rainforests.",
      "Kitesurfing Kalpitiya: A paradise for kitesurfers, featuring steady trade winds and flat lagoons."
    ],
    tip: "The surfing season runs from May to October on the East Coast (Arugam Bay) and from November to April on the South Coast (Weligama/Mirissa)."
  },
  eco: {
    title: "Eco-Tourism & Wildlife Safaris",
    tagline: "Unrivaled biodiversity in pristine forests",
    bg: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop",
    icon: Leaf,
    desc: "Despite its small size, Sri Lanka has one of the highest rates of biological endemism in the world. Embark on safaris to see leopards and wild elephant herds, or explore prehistoric rainforests home to rare birds and orchids.",
    highlights: [
      "Yala National Park: Boasts one of the highest leopard densities in the world, alongside sloth bears and crocodiles.",
      "Sinharaja Rainforest: A UNESCO Biosphere Reserve and the last viable area of primary tropical rainforest on the island.",
      "Udawalawe National Park: Guaranteed sightings of herds of wild Asian elephants roaming around reservoir beds.",
      "Whale Watching Mirissa: Witness giant blue whales and open pods of dolphins migrating close to the southern shore."
    ],
    tip: "Choose safari operators that prioritize wildlife conservation, maintain safe distances, and turn off engines near animals."
  },
  mice: {
    title: "MICE & Business Travels",
    tagline: "Meetings, Incentives, Conferences & Exhibitions",
    bg: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop",
    icon: Building,
    desc: "Sri Lanka is rapidly growing as a hub for corporate travel. Offering state-of-the-art convention centers in Colombo, luxurious beachside conference resorts, and unique team-building excursions in the highlands.",
    highlights: [
      "BMICH Colombo: The premier venue for international conferences, featuring massive exhibition halls and theatres.",
      "Bleisure Trips: Combine corporate meetings with golf courses in Nuwara Eliya or spa wellness in Bentota.",
      "Unique Team Building: White-water rafting in Kitulgala or eco-camping in the Knuckles Range.",
      "Luxurious Venues: High-end hotels along Colombo's Galle Face Green equipped for large scale corporate retreats."
    ],
    tip: "Corporate tour packages can be customized with private chartered domestic flights to minimize travel times."
  },
  family: {
    title: "Family & Child-Friendly Holidays",
    tagline: "Warm memories for travelers of all ages",
    bg: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?q=80&w=800&auto=format&fit=crop",
    icon: Users,
    desc: "Create unforgettable family bonds. Sri Lanka offers safe sandy beaches, kid-friendly safaris, interactive elephant feeding programs, turtle conservation centers, and resort complexes with extensive recreation options.",
    highlights: [
      "Elephant Transit Home: Watch baby orphaned elephants being bottle-fed at Udawalawe, a heartwarming experience.",
      "Safe Beach Bays: Hikkaduwa and Unawatuna offer calm waters protected by coral reefs, ideal for swimming and snorkeling.",
      "Turtle Hatcheries: Children can learn about marine biology and release tiny turtle hatchlings into the ocean.",
      "Scenic Train Rides: The slow train ride through tunnels and tea gardens is a magical experience for the whole family."
    ],
    tip: "Resorts with kid clubs and family bungalows are widely available in Bentota and Kandy. Private vans with child car seats can be pre-booked."
  },
  leisure: {
    title: "Leisure, Wellness & Ayurveda",
    tagline: "Unwind on golden beaches and healing sanctuaries",
    bg: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
    icon: Coffee,
    desc: "Immerse yourself in serenity. Sri Lanka offers traditional Ayurveda retreats using herbal oils and holistic medicines, luxury beachfront resorts, and colonial-era tea bungalows where you can escape the rush of modern life.",
    highlights: [
      "Ayurveda Healing: Experience personalized detox treatments, oil massages, and yoga in specialized wellness retreats.",
      "Highland Bungalows: Stay in a restored colonial tea planter's bungalow in Nuwara Eliya, complete with cozy fireplaces.",
      "Galle Coast Villas: Private luxury villas overlooking secluded beaches, ideal for ultimate relaxation.",
      "Scenic Tea Spa: Spas overlooking visual tea valleys, combining local teas, oils, and herbs in treatments."
    ],
    tip: "Authentic Ayurveda programs usually require a minimum stay of 7 to 14 days for full detox benefits."
  },
  education: {
    title: "Education & Field Research",
    tagline: "Knowledge sharing and environmental studies",
    bg: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop",
    icon: BookOpen,
    desc: "For students, researchers, and curious minds, Sri Lanka offers a rich canvas. Study unique island ecosystems, volunteer in wildlife rehabilitation, or examine centuries of colonial history archives and archeological excavations.",
    highlights: [
      "Rainforest Research: Conduct field trips in Sinharaja to study endemic flora, fauna, and canopy ecosystems.",
      "Marine Conservation: Volunteer in sea turtle nesting monitoring programs along the southern coast.",
      "Historical Archives: Study Dutch and Portuguese colonial structures in Galle Fort and Colombo archives.",
      "Agricultural Tours: Interactive educational walks through organic spice gardens and sustainable tea factories."
    ],
    tip: "Field study permits for national parks and protected forests must be applied for in advance through the Department of Wildlife Conservation."
  }
};
