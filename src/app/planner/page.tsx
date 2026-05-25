"use client";

import { useState, useMemo, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation, useAppStore } from "@/store";
import { PACKAGES, DESTINATIONS } from "@/data/mockData";
import {
  Hotel, Palmtree, Castle, Leaf, Wallet,
  Calendar, Compass, CheckCircle2, Send, ChevronDown, Users
} from "lucide-react";

// SVG Map routing paths & coordinates for the 4 tiers
const TOUR_MAPS: Record<string, { mapPath: string; mapPoints: { name: string; x: number; y: number; type: string }[] }> = {
  basic: {
    mapPoints: [
      { name: "Colombo", x: 50, y: 20, type: "start" },
      { name: "Kandy", x: 48, y: 50, type: "point" },
      { name: "Ella", x: 58, y: 65, type: "point" },
      { name: "Mirissa", x: 48, y: 82, type: "end" },
    ],
    mapPath: "M 50,20 Q 56,38 48,50 T 58,65 T 48,82",
  },
  economic: {
    mapPoints: [
      { name: "Colombo", x: 50, y: 20, type: "start" },
      { name: "Sigiriya", x: 52, y: 35, type: "point" },
      { name: "Kandy", x: 48, y: 50, type: "point" },
      { name: "Mirissa", x: 48, y: 82, type: "end" },
    ],
    mapPath: "M 50,20 Q 55,28 52,35 T 48,50 Q 58,70 48,82",
  },
  premium: {
    mapPoints: [
      { name: "Colombo", x: 50, y: 20, type: "start" },
      { name: "Sigiriya", x: 52, y: 35, type: "point" },
      { name: "N. Eliya", x: 54, y: 58, type: "point" },
      { name: "Yala", x: 62, y: 78, type: "point" },
      { name: "Galle", x: 44, y: 80, type: "end" },
    ],
    mapPath: "M 50,20 Q 55,28 52,35 T 54,58 T 62,78 Q 50,85 44,80",
  },
  vvip: {
    mapPoints: [
      { name: "Colombo", x: 50, y: 20, type: "start" },
      { name: "Sigiriya (Heli)", x: 52, y: 35, type: "point" },
      { name: "Ella (Heli)", x: 58, y: 65, type: "point" },
      { name: "Yala (Heli)", x: 62, y: 78, type: "end" },
    ],
    mapPath: "M 50,20 Q 54,30 52,35 T 58,65 Q 60,72 62,78",
  },
};

const LODGE_OPTIONS = [
  { key: "boutique", Icon: Hotel, name: "Boutique Hotels" },
  { key: "beach", Icon: Palmtree, name: "Beach Resorts" },
  { key: "heritage", Icon: Castle, name: "Heritage Hotels" },
  { key: "eco", Icon: Leaf, name: "Eco Lodges" },
];

const ACTIVITIES = ["Wild Safari", "Cultural Sites", "Beach Time", "Mountain Hikes", "Water Sports"];

const budgetTierToTourKey: Record<string, string> = {
  Basic: "basic",
  Economic: "economic",
  Premium: "premium",
  VVIP: "vvip",
};

const defaultDestinations: Record<string, string[]> = {
  Basic: ["Kandy", "Ella", "Mirissa"],
  Economic: ["Sigiriya", "Kandy", "Mirissa", "Galle Fort"],
  Premium: ["Sigiriya", "Nuwara Eliya", "Yala National Park", "Galle Fort"],
  VVIP: ["Sigiriya", "Ella", "Yala National Park", "Galle Fort"],
};

const defaultDurations: Record<string, number> = {
  Basic: 10,
  Economic: 14,
  Premium: 16,
  VVIP: 14,
};

function PlannerContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addDraft } = useAppStore();

  const destParam = searchParams.get("dest");
  const notesParam = searchParams.get("notes");

  // Form State
  const [budgetTier, setBudgetTier] = useState("Basic");
  const [activeTour, setActiveTour] = useState("basic");
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [tripDuration, setTripDuration] = useState(10);
  const [companions, setCompanions] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [specialNotes, setSpecialNotes] = useState(notesParam ? decodeURIComponent(notesParam) : "");
  const [showModal, setShowModal] = useState(false);

  // Customizer extras
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(["Kandy", "Ella", "Mirissa"]);
  const [usePartnerLodging, setUsePartnerLodging] = useState(true);
  const [selectedLodgingStyles, setSelectedLodgingStyles] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  const handleTierSelect = (tier: string) => {
    setBudgetTier(tier);
    setActiveTour(budgetTierToTourKey[tier] || "basic");
    setTripDuration(defaultDurations[tier] || 10);
    setSelectedDestinations(defaultDestinations[tier] || []);
  };

  useEffect(() => {
    const dest = searchParams.get("dest");
    const notes = searchParams.get("notes");
    if (dest) setSelectedDestinations([dest]);
    if (notes) setSpecialNotes(decodeURIComponent(notes));
  }, [searchParams]);

  const activePackage = useMemo(() => PACKAGES.find((p) => p.id === activeTour) || PACKAGES[0], [activeTour]);

  const packageMeta = useMemo(() => {
    const p = activePackage;
    return {
      audience: `${p.tags[0]} / ${p.tags[1]}`,
      cost:
        p.tags[2] === "Budget"
          ? "Budget ($)"
          : p.tags[2] === "Comfort"
          ? "Comfort ($$)"
          : p.tags[2] === "Luxury"
          ? "Luxury ($$$)"
          : "Ultra-Lux ($$$$)",
      duration: `${p.itinerary.length} Days`,
    };
  }, [activePackage]);

  const toggleArr = (arr: string[], setArr: (v: string[]) => void, val: string) => {
    if (arr.includes(val)) setArr(arr.filter((a) => a !== val));
    else setArr([...arr, val]);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDraft({ name: `Custom ${tripDuration}-Day ${budgetTier} Journey`, date: new Date().toLocaleDateString() });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    router.push("/profile");
    setSelectedDestinations(["Kandy", "Ella", "Mirissa"]);
    setSelectedThemes([]);
    setTripDuration(10);
    setCompanions("");
    setClientName("");
    setClientEmail("");
    setSelectedLodgingStyles([]);
    setSelectedActivities([]);
    setSpecialNotes("");
    setBudgetTier("Basic");
    setActiveTour("basic");
  };

  const displayedSummary = useMemo(
    () => ({
      destinations: selectedDestinations.length > 0 ? selectedDestinations.join(", ") : "Not selected",
      budget: budgetTier,
      themes: selectedThemes.length > 0 ? selectedThemes.join(", ") : "None",
      duration: `${tripDuration} Days`,
      companions: companions || "Not specified",
      lodging: `${
        selectedLodgingStyles.length > 0
          ? selectedLodgingStyles.map((k) => LODGE_OPTIONS.find((o) => o.key === k)?.name).filter(Boolean).join(", ")
          : "Standard"
      } ${usePartnerLodging ? "(Partner Network)" : "(Independent)"}`,
      activities: selectedActivities.length > 0 ? selectedActivities.join(", ") : "None",
    }),
    [selectedDestinations, budgetTier, selectedThemes, tripDuration, companions, selectedLodgingStyles, usePartnerLodging, selectedActivities]
  );

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-24">
      {/* Page Header */}
      <div className="mb-8 md:mb-12">
        <span className="text-[0.68rem] tracking-[0.15em] uppercase text-accent font-bold mb-3 block">
          {t("plan_eyebrow") || "Trip Planning Dashboard"}
        </span>
        <h1 className="font-serif text-[2rem] md:text-[3.2rem] leading-tight mb-3 md:mb-4 text-textcolor">
          {t("plan_title") || "Craft Your Journey"}
        </h1>
        <p className="text-muted text-[0.85rem] md:text-[0.95rem] max-w-2xl">
          {t("plan_sub") || "Choose a preset tier to populate the travel route details, then fully customize stays, activities, and duration."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.8fr] gap-6 md:gap-10 items-start">

        {/* Left Column: Preset Route & Details */}
        <div className="bg-surface border border-bordercolor rounded-2xl p-5 md:p-8 space-y-5 md:space-y-6 shadow-sm">
          <div>
            <h3 className="font-serif text-xl text-textcolor mb-1">Base Tour Plan</h3>
            <p className="text-muted text-xs">Select a tier to load the route and preset features.</p>
          </div>

          {/* Tier Selector Pills */}
          <div className="flex bg-bg/50 border border-bordercolor rounded-xl p-1 gap-1 w-full overflow-x-auto hide-scrollbar">
            {["Basic", "Economic", "Premium", "VVIP"].map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => handleTierSelect(tier)}
                className={`flex-1 py-2 rounded-lg text-center text-[0.68rem] sm:text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap min-w-[60px] ${
                  budgetTier === tier ? "bg-accent text-white shadow-sm" : "text-muted hover:text-textcolor"
                }`}
              >
                {tier}
              </button>
            ))}
          </div>

          {/* Map Illustration */}
          <div className="flex justify-center relative bg-bg/30 border border-bordercolor rounded-xl p-4 overflow-hidden min-h-[180px] md:min-h-[220px]">
            <div className="absolute w-[140px] h-[140px] bg-accent/15 filter blur-[80px] pointer-events-none rounded-full" />
            {TOUR_MAPS[activeTour] && (
              <svg viewBox="0 0 100 100" className="w-full max-w-[240px] md:max-w-[280px] aspect-square filter drop-shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                <path d={TOUR_MAPS[activeTour].mapPath} fill="none" stroke="url(#mapGrad)" strokeWidth="2" className="animated-route-path" />
                <defs>
                  <linearGradient id="mapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
                {TOUR_MAPS[activeTour].mapPoints.map((pt, i) => (
                  <g key={i}>
                    <circle cx={pt.x} cy={pt.y} r={pt.type === "start" || pt.type === "end" ? "3.5" : "2.5"} fill={pt.type === "start" ? "#10b981" : pt.type === "end" ? "#f59e0b" : "#ffffff"} className={pt.type === "start" ? "pulse-glow" : ""} />
                    <text x={pt.x + 4.5} y={pt.y + 1} fill="#ffffff" fontSize="3.2" fontWeight="600" fontFamily="var(--font-sans)">
                      {pt.name}
                    </text>
                  </g>
                ))}
              </svg>
            )}
          </div>

          {/* Package Meta */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[0.65rem] font-semibold uppercase bg-accentdim/20 text-accent">
                <Users className="w-3 h-3" /> {packageMeta.audience}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[0.65rem] font-semibold uppercase bg-amber-500/10 text-amber-500 border border-amber-500/10">
                <Wallet className="w-3 h-3" /> {packageMeta.cost}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[0.65rem] font-semibold uppercase bg-white/5 text-textcolor">
                <Calendar className="w-3 h-3" /> {packageMeta.duration}
              </span>
            </div>

            <h4 className="font-serif text-base md:text-lg text-textcolor">{activePackage.name}</h4>
            <p className="text-muted text-[0.78rem] leading-relaxed">{activePackage.desc}</p>

            <div className="border-t border-bordercolor pt-3">
              <h5 className="text-[0.65rem] tracking-[0.08em] uppercase font-bold text-accent mb-2">Preset Highlights:</h5>
              <ul className="space-y-1.5">
                {activePackage.itinerary.map((day, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[0.72rem] text-muted leading-relaxed">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                    <span>{day}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-l-2 border-accent/40 pl-3 py-1">
              <span className="block text-[0.62rem] uppercase tracking-wider text-muted font-bold mb-0.5">Lodging & Transit</span>
              <p className="text-[0.68rem] text-muted leading-relaxed">
                Stays in {activePackage.accommodation}. Moving via {activePackage.transport}.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Customizer Form */}
        <div className="bg-surface border border-bordercolor rounded-2xl p-5 md:p-8 shadow-sm">
          <div className="mb-5 md:mb-6">
            <h3 className="font-serif text-xl text-textcolor mb-1">Personalize Your Plan</h3>
            <p className="text-muted text-xs">Tweak destinations, lodging, activities, and duration.</p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-6 md:space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

              {/* Col 1: Route & Themes */}
              <div className="space-y-5">
                {/* Destinations */}
                <div>
                  <label className="block text-[0.65rem] font-bold uppercase tracking-wider text-muted mb-2">Destinations of Interest</label>
                  <div className="flex flex-wrap gap-1.5 max-h-[130px] overflow-y-auto pr-1 border border-bordercolor rounded-lg p-2 bg-bg/30">
                    {DESTINATIONS.map((d) => {
                      const isSelected = selectedDestinations.includes(d);
                      return (
                        <button key={d} type="button" onClick={() => toggleArr(selectedDestinations, setSelectedDestinations, d)} className={`px-2 py-1 rounded text-[0.65rem] font-medium border transition-all cursor-pointer ${isSelected ? "border-accent text-accent bg-accentdim/15" : "border-bordercolor/80 text-muted hover:border-textcolor hover:text-textcolor bg-surface/30"}`}>
                          {d}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Themes */}
                <div>
                  <label className="block text-[0.65rem] font-bold uppercase tracking-wider text-muted mb-2">Selected Themes</label>
                  <div className="flex flex-wrap gap-1.5">
                    {["History", "Culture", "Adventure", "Eco", "MICE", "Family", "Leisure", "Education"].map((theme) => {
                      const isSelected = selectedThemes.includes(theme);
                      return (
                        <button key={theme} type="button" onClick={() => toggleArr(selectedThemes, setSelectedThemes, theme)} className={`px-2.5 py-1.5 rounded-full text-[0.65rem] border transition-all cursor-pointer ${isSelected ? "border-accent text-accent bg-accentdim/15" : "border-bordercolor text-muted hover:border-textcolor hover:text-textcolor bg-surface/30"}`}>
                          {theme}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Activities */}
                <div>
                  <label className="block text-[0.65rem] font-bold uppercase tracking-wider text-muted mb-2">Included Activities</label>
                  <div className="grid grid-cols-2 gap-2">
                    {ACTIVITIES.map((a) => {
                      const isSelected = selectedActivities.includes(a);
                      return (
                        <div key={a} onClick={() => toggleArr(selectedActivities, setSelectedActivities, a)} className={`p-2.5 rounded-lg border cursor-pointer flex items-center gap-2 transition-colors ${isSelected ? "border-accent/40 bg-accentdim/5" : "border-bordercolor bg-bg/20 hover:border-accent/30"}`}>
                          <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[0.5rem] transition-all shrink-0 ${isSelected ? "bg-accent border-accent text-white" : "border-bordercolor"}`}>{isSelected ? "✓" : ""}</div>
                          <span className="text-[0.68rem] font-semibold text-textcolor leading-tight">{a}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Col 2: Preferences */}
              <div className="space-y-5">
                {/* Duration Slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[0.65rem] font-bold uppercase tracking-wider text-muted">Trip Duration</label>
                    <strong className="text-xs font-serif text-accent">{tripDuration} Days</strong>
                  </div>
                  <input type="range" min="3" max="28" value={tripDuration} onChange={(e) => setTripDuration(Number(e.target.value))} className="w-full cursor-pointer accent-accent" />
                </div>

                {/* Travel Cohort */}
                <div>
                  <label className="block text-[0.65rem] font-bold uppercase tracking-wider text-muted mb-2">Travel Cohort</label>
                  <div className="relative">
                    <select value={companions} onChange={(e) => setCompanions(e.target.value)} className="w-full bg-surface border border-bordercolor rounded-lg px-3.5 py-2.5 text-xs text-textcolor outline-none focus:border-accent cursor-pointer appearance-none" required>
                      <option value="" disabled>Who is traveling?</option>
                      <option value="Solo">Solo Traveler</option>
                      <option value="Couple">Couple</option>
                      <option value="Family">Family</option>
                      <option value="Group">Group</option>
                    </select>
                    <ChevronDown className="absolute right-3.5 top-3.5 w-4 h-4 text-muted pointer-events-none" />
                  </div>
                </div>

                {/* Lodging Styles */}
                <div>
                  <label className="block text-[0.65rem] font-bold uppercase tracking-wider text-muted mb-2">Lodging Style</label>
                  <div className="grid grid-cols-2 gap-2">
                    {LODGE_OPTIONS.map((l) => {
                      const isSelected = selectedLodgingStyles.includes(l.key);
                      return (
                        <div key={l.key} onClick={() => toggleArr(selectedLodgingStyles, setSelectedLodgingStyles, l.key)} className={`p-2 border rounded-lg cursor-pointer transition-all duration-200 flex gap-2 items-center ${isSelected ? "border-accent bg-accentdim/15" : "border-bordercolor bg-bg/20 hover:border-accent/40"}`}>
                          <div className={`p-1 rounded border shrink-0 ${isSelected ? "bg-accent text-white border-transparent" : "bg-surface border-bordercolor text-muted"}`}>
                            <l.Icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-[0.65rem] font-semibold text-textcolor truncate">{l.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Partner Network */}
                <div className="pt-1">
                  <label className="relative inline-flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={usePartnerLodging} onChange={(e) => setUsePartnerLodging(e.target.checked)} />
                    <div className="w-9 h-5 bg-bordercolor peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent" />
                    <span className="text-[0.72rem] font-semibold text-textcolor">Use partner network (Save 15%)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="border-t border-bordercolor pt-5 md:pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[0.62rem] text-muted mb-1" htmlFor="clientName">Your Name</label>
                <input type="text" id="clientName" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="e.g. John Doe" className="w-full bg-bg/40 border border-bordercolor rounded-lg px-3 py-2.5 text-xs text-textcolor outline-none focus:border-accent" required />
              </div>
              <div>
                <label className="block text-[0.62rem] text-muted mb-1" htmlFor="clientEmail">Email Address</label>
                <input type="email" id="clientEmail" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="e.g. john@example.com" className="w-full bg-bg/40 border border-bordercolor rounded-lg px-3 py-2.5 text-xs text-textcolor outline-none focus:border-accent" required />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[0.62rem] text-muted mb-1" htmlFor="specialNotes">Special Inquiries / Requests</label>
                <textarea id="specialNotes" value={specialNotes} onChange={(e) => setSpecialNotes(e.target.value)} placeholder="Tell us about specific sites, dietary needs or extra requests..." className="w-full min-h-[65px] bg-bg/40 border border-bordercolor rounded-lg px-3 py-2.5 text-xs text-textcolor outline-none focus:border-accent resize-y" />
              </div>
            </div>

            <button type="submit" className="w-full py-3 bg-accent hover:opacity-85 text-white font-semibold uppercase tracking-wider text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-md shadow-accent/25 cursor-pointer">
              <span>Generate Custom Quote</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      <div className={`modal-overlay ${showModal ? "open" : ""}`}>
        <div className="modal-card glass-panel text-center bg-surface border border-bordercolor p-5 sm:p-8 rounded-2xl max-w-md w-full mx-auto">
          <div className="mx-auto w-12 h-12 bg-accentdim/20 text-accent rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl sm:text-2xl text-textcolor mb-2">{t("modal_success_title")}</h3>
          <p className="text-muted text-xs sm:text-sm leading-relaxed mb-5">{t("modal_success_desc")}</p>

          <div className="w-full text-left bg-bg/50 border border-bordercolor rounded-lg p-4 mb-6">
            <h5 className="text-[0.62rem] tracking-[0.15em] uppercase font-bold text-accent mb-3 pb-2 border-b border-bordercolor">{t("modal_summary_title")}</h5>
            <ul className="space-y-2 text-xs">
              {[
                ["Destinations", displayedSummary.destinations],
                ["Budget Tier", displayedSummary.budget],
                ["Selected Themes", displayedSummary.themes],
                ["Duration", displayedSummary.duration],
                ["Companions", displayedSummary.companions],
                ["Lodging Style", displayedSummary.lodging],
                ["Activities", displayedSummary.activities],
                ["Saved Draft", "Yes (Saved to Profile)"],
              ].map(([label, value]) => (
                <li key={label} className="flex justify-between gap-2">
                  <span className="text-muted shrink-0">{label}:</span>
                  <strong className={`truncate max-w-[180px] sm:max-w-[200px] ${label === "Saved Draft" ? "text-accent" : "text-textcolor"}`}>{value}</strong>
                </li>
              ))}
            </ul>
          </div>

          <button onClick={handleCloseModal} className="w-full py-2.5 bg-accent hover:opacity-85 text-white text-xs font-semibold uppercase tracking-wider rounded-lg cursor-pointer">
            {t("modal_close")}
          </button>
        </div>
      </div>
    </section>
  );
}

export default function Planner() {
  return (
    <Suspense fallback={<div className="p-24 text-center text-muted">Loading Planner...</div>}>
      <PlannerContent />
    </Suspense>
  );
}
