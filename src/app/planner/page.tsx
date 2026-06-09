"use client";

import { useState, useMemo, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation, useAppStore } from "@/store";
import { PACKAGES, DESTINATIONS } from "@/data/mockData";
import {
  Hotel, Palmtree, Castle, Leaf, Mail, MessageCircle,
  Calendar, CheckCircle2, Send, ChevronDown, Users,
  Upload, FileImage, X
} from "lucide-react";

const TOUR_MAPS: Record<string, {
  mapPath: string;
  mapPoints: { name: string; x: number; y: number; type: string }[];
}> = {
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
      { name: "Sigiriya", x: 52, y: 35, type: "point" },
      { name: "Ella", x: 58, y: 65, type: "point" },
      { name: "Yala", x: 62, y: 78, type: "end" },
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
  const { addDraft, updateDraftStatus } = useAppStore();

  const [budgetTier, setBudgetTier] = useState("Basic");
  const [activeTour, setActiveTour] = useState("basic");
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [tripDuration, setTripDuration] = useState(10);
  const [companions, setCompanions] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentDraftId, setCurrentDraftId] = useState("");
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(["Kandy", "Ella", "Mirissa"]);
  const [usePartnerLodging, setUsePartnerLodging] = useState(true);
  const [selectedLodgingStyles, setSelectedLodgingStyles] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [bookingLoading, setBookingLoading] = useState(false);

  const handleTierSelect = (tier: string) => {
    setBudgetTier(tier);
    setActiveTour(budgetTierToTourKey[tier] || "basic");
    setTripDuration(defaultDurations[tier] || 10);
    setSelectedDestinations(defaultDestinations[tier] || []);
  };

  useEffect(() => {
    const dest = searchParams.get("dest");
    const notes = searchParams.get("notes");
    if (dest) setSelectedDestinations([decodeURIComponent(dest)]);
    if (notes) setSpecialNotes(decodeURIComponent(notes));
  }, [searchParams]);

  const activePackage = useMemo(
    () => PACKAGES.find((p) => p.id === activeTour) || PACKAGES[0],
    [activeTour]
  );

  const packageMeta = useMemo(() => {
    const p = activePackage;
    return {
      audience: `${t(p.tags[0])} / ${t(p.tags[1])}`,
      tier: t(p.tags[2]),
      duration: `${p.itinerary.length} ${t("days") || "Days"}`,
    };
  }, [activePackage, t]);

  const toggleArr = (arr: string[], setArr: (v: string[]) => void, val: string) => {
    setArr(arr.includes(val) ? arr.filter((a) => a !== val) : [...arr, val]);
  };

  // Receipt upload state
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [receiptNotes, setReceiptNotes] = useState("");
  const [receiptSubmitted, setReceiptSubmitted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Contact details (update these with real values)
  const GUIDE_EMAIL = "dineth.theekshana2002@gmail.com";
  const GUIDE_WHATSAPP = "+94705836005";

  // Generate booking summary text
  const getBookingSummary = () => {
    const lines = [
      `Package: ${activePackage.name}`,
      `Destinations: ${selectedDestinations.join(", ") || "—"}`,
      `Duration: ${tripDuration} days`,
      `Companions: ${companions || "—"}`,
      `Themes: ${selectedThemes.join(", ") || "None"}`,
      `Activities: ${selectedActivities.join(", ") || "None"}`,
      `Lodging: ${selectedLodgingStyles.map((k) => LODGE_OPTIONS.find((o) => o.key === k)?.name || "").filter(Boolean).join(", ") || "Standard"}`,
    ];
    if (clientName) lines.unshift(`Name: ${clientName}`);
    if (clientEmail) lines.unshift(`Email: ${clientEmail}`);
    if (specialNotes) lines.push(`Notes: ${specialNotes}`);
    return lines.join("\n");
  };

  const handleApiBooking = async (method: "email" | "whatsapp") => {
    if (!clientEmail) {
      alert("Please enter an email address.");
      return;
    }
    
    setBookingLoading(true);
    try {
      // Send the automated receipt in the background
      fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: clientName || "Traveler",
          clientEmail,
          title: activePackage.name,
          details: getBookingSummary()
        })
      }).catch((e) => console.error("API Booking Error:", e));
      
      const draftId = crypto.randomUUID();
      setCurrentDraftId(draftId);
      addDraft({
        id: draftId,
        name: `Custom ${tripDuration}-Day ${budgetTier} Journey`,
        date: new Date().toLocaleDateString(),
        status: "pending",
        packageName: activePackage.name,
        destinations: selectedDestinations,
        duration: tripDuration,
        companions: companions,
        themes: selectedThemes,
        activities: selectedActivities,
        lodgingStyles: selectedLodgingStyles,
        clientName: clientName,
        clientEmail: clientEmail,
        specialNotes: specialNotes,
      });

      if (method === "email") {
        const subject = encodeURIComponent(`Tour Booking Request — ${activePackage.name}`);
        const body = encodeURIComponent(getBookingSummary());
        window.open(`mailto:${GUIDE_EMAIL}?subject=${subject}&body=${body}`, "_blank");
      } else {
        const text = encodeURIComponent(`Hi! I'd like to book a tour.\n\n${getBookingSummary()}`);
        window.open(`https://wa.me/${GUIDE_WHATSAPP.replace(/\+/g, "")}?text=${text}`, "_blank");
      }

      setShowModal(true);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Don't auto-submit — user picks Email or WhatsApp
  };

  const handleReceiptFile = (file: File) => {
    setReceiptFile(file);
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setReceiptPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setReceiptPreview(null);
    }
  };

  const handleReceiptSubmit = () => {
    const subject = encodeURIComponent(`Payment Receipt — ${activePackage.name}`);
    const body = encodeURIComponent(
      `Please find my payment receipt attached.\n\nFile: ${receiptFile?.name || "N/A"}\n${receiptNotes ? `Notes: ${receiptNotes}` : ""}\n\nBooking Summary:\n${getBookingSummary()}`
    );
    window.open(`mailto:${GUIDE_EMAIL}?subject=${subject}&body=${body}`, "_blank");
    updateDraftStatus(currentDraftId || `Custom ${tripDuration}-Day ${budgetTier} Journey`, "completed");
    setReceiptSubmitted(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setReceiptFile(null);
    setReceiptPreview(null);
    setReceiptNotes("");
    setReceiptSubmitted(false);
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

  const lodgingSummary = useMemo(() => {
    const styles = selectedLodgingStyles.length > 0
      ? selectedLodgingStyles.map((k) => t(LODGE_OPTIONS.find((o) => o.key === k)?.name || "")).filter(Boolean).join(", ")
      : t("Standard") || "Standard";
    const partnerText = usePartnerLodging
      ? `(${t("partner_network") || "Partner Network"})`
      : `(${t("independent") || "Independent"})`;
    return `${styles} ${partnerText}`;
  }, [selectedLodgingStyles, usePartnerLodging, t]);

  const modalData = [
    [t("modal_destinations"), selectedDestinations.map(d => t(d)).join(", ") || "—"],
    [t("modal_budget"), t(budgetTier)],
    [t("modal_themes"), selectedThemes.map(th => t(th)).join(", ") || t("None")],
    [t("modal_duration"), `${tripDuration} ${t("days")}`],
    [t("modal_companions"), t(`plan_cohort_${companions.toLowerCase()}`) || companions || "—"],
    [t("modal_lodging"), lodgingSummary],
    [t("modal_activities"), selectedActivities.map(a => t(a)).join(", ") || t("None")],
    [t("modal_saved"), t("modal_saved_val")],
  ];

  const tiers = ["Basic", "Economic", "Premium", "VVIP"];

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-24">
      {/* Page Header */}
      <div className="mb-8 md:mb-12">
        <span className="text-[0.68rem] tracking-[0.15em] uppercase text-accent font-bold mb-3 block">
          {t("plan_eyebrow")}
        </span>
        <h1 className="font-serif text-[2rem] md:text-[3.2rem] leading-tight mb-3 md:mb-4 text-textcolor">
          {t("plan_title")}
        </h1>
        <p className="text-muted text-[0.85rem] md:text-[0.95rem] max-w-2xl">
          {t("plan_sub")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.8fr] gap-6 md:gap-10 items-start">
        {/* ── Left: Preset Route Card ─────────────────────── */}
        <div className="bg-surface border border-bordercolor rounded-2xl p-5 md:p-8 space-y-5 md:space-y-6 shadow-sm">
          <div>
            <h3 className="font-serif text-xl text-textcolor mb-1">{t("plan_base_title")}</h3>
            <p className="text-muted text-xs">{t("plan_base_sub")}</p>
          </div>

          {/* Tier Selector */}
          <div className="flex bg-bg/50 border border-bordercolor rounded-xl p-1 gap-1 w-full overflow-x-auto hide-scrollbar">
            {tiers.map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => handleTierSelect(tier)}
                className={`flex-1 py-2 rounded-lg text-center text-[0.68rem] sm:text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap min-w-[58px] ${budgetTier === tier
                  ? "bg-accent text-white shadow-sm"
                  : "text-muted hover:text-textcolor"
                  }`}
              >
                {t(tier)}
              </button>
            ))}
          </div>

          {/* Route Map */}
          <div className="flex justify-center relative bg-bg/30 border border-bordercolor rounded-xl p-4 overflow-hidden min-h-[180px] md:min-h-[220px]">
            <div className="absolute w-[140px] h-[140px] bg-accent/15 filter blur-[80px] pointer-events-none rounded-full" />
            {TOUR_MAPS[activeTour] && (
              <svg viewBox="0 0 100 100" className="w-full max-w-[240px] md:max-w-[280px] aspect-square filter drop-shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                <path d={TOUR_MAPS[activeTour].mapPath} fill="none" stroke="url(#mapGrad)" strokeWidth="2" className="animated-route-path" />
                <defs>
                  <linearGradient id="mapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--accent)" />
                    <stop offset="100%" stopColor="var(--amber)" />
                  </linearGradient>
                </defs>
                {TOUR_MAPS[activeTour].mapPoints.map((pt, i) => (
                  <g key={i}>
                    <circle
                      cx={pt.x} cy={pt.y}
                      r={pt.type === "start" || pt.type === "end" ? "3.5" : "2.5"}
                      fill={pt.type === "start" ? "var(--accent)" : pt.type === "end" ? "var(--amber)" : "var(--accent)"}
                      className={pt.type === "start" ? "pulse-glow" : ""}
                    />
                    <text x={pt.x + 4.5} y={pt.y + 1} fill="var(--muted)" fontSize="3.2" fontWeight="600" fontFamily="system-ui">
                      {t(pt.name)}
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
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[0.65rem] font-semibold uppercase bg-surface text-textdim">
                <Calendar className="w-3 h-3" /> {packageMeta.duration}
              </span>
            </div>

            <h4 className="font-serif text-base md:text-lg text-textcolor">{t(activePackage.name)}</h4>
            <p className="text-muted text-[0.78rem] leading-relaxed">{t(activePackage.desc)}</p>

            <div className="border-t border-bordercolor pt-3">
              <h5 className="text-[0.65rem] tracking-[0.08em] uppercase font-bold text-accent mb-2">
                {t("plan_highlights")}:
              </h5>
              <ul className="space-y-1.5">
                {activePackage.itinerary.map((day, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[0.72rem] text-muted leading-relaxed">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                    <span>{t(day)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-l-2 border-accent/40 pl-3 py-1">
              <span className="block text-[0.62rem] uppercase tracking-wider text-muted font-bold mb-0.5">
                {t("plan_lodging_transit")}
              </span>
              <p className="text-[0.68rem] text-muted leading-relaxed">
                {t(activePackage.accommodation)} · {t(activePackage.transport)}
              </p>
            </div>
          </div>
        </div>

        {/* ── Right: Customizer Form ───────────────────────── */}
        <div className="bg-surface border border-bordercolor rounded-2xl p-5 md:p-8 shadow-sm">
          <div className="mb-5 md:mb-6">
            <h3 className="font-serif text-xl text-textcolor mb-1">{t("plan_custom_title")}</h3>
            <p className="text-muted text-xs">{t("plan_custom_sub")}</p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-6 md:space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

              {/* Col 1 */}
              <div className="space-y-5">
                {/* Destinations */}
                <div>
                  <label className="block text-[0.65rem] font-bold uppercase tracking-wider text-muted mb-2">
                    {t("plan_destinations")}
                  </label>
                  <div className="flex flex-wrap gap-1.5 max-h-[130px] overflow-y-auto pr-1 border border-bordercolor rounded-lg p-2 bg-bg/30">
                    {DESTINATIONS.map((d) => {
                      const isSelected = selectedDestinations.includes(d);
                      return (
                        <button
                          key={d} type="button"
                          onClick={() => toggleArr(selectedDestinations, setSelectedDestinations, d)}
                          className={`px-2 py-1 rounded text-[0.65rem] font-medium border transition-all cursor-pointer ${isSelected
                            ? "border-accent text-accent bg-accentdim/15"
                            : "border-bordercolor text-muted hover:border-textcolor hover:text-textcolor bg-surface/30"
                            }`}
                        >
                          {t(d)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Themes */}
                <div>
                  <label className="block text-[0.65rem] font-bold uppercase tracking-wider text-muted mb-2">
                    {t("plan_themes")}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {["History", "Culture", "Adventure", "Eco", "MICE", "Family", "Leisure", "Education"].map((theme) => {
                      const isSelected = selectedThemes.includes(theme);
                      return (
                        <button
                          key={theme} type="button"
                          onClick={() => toggleArr(selectedThemes, setSelectedThemes, theme)}
                          className={`px-2.5 py-1.5 rounded-full text-[0.65rem] border transition-all cursor-pointer ${isSelected
                            ? "border-accent text-accent bg-accentdim/15"
                            : "border-bordercolor text-muted hover:border-textcolor hover:text-textcolor bg-surface/30"
                            }`}
                        >
                          {t(theme)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Activities */}
                <div>
                  <label className="block text-[0.65rem] font-bold uppercase tracking-wider text-muted mb-2">
                    {t("plan_activities")}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {ACTIVITIES.map((a) => {
                      const isSelected = selectedActivities.includes(a);
                      return (
                        <div
                          key={a}
                          onClick={() => toggleArr(selectedActivities, setSelectedActivities, a)}
                          className={`p-2.5 rounded-lg border cursor-pointer flex items-center gap-2 transition-colors ${isSelected ? "border-accent/40 bg-accentdim/5" : "border-bordercolor bg-bg/20 hover:border-accent/30"
                            }`}
                        >
                          <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[0.5rem] transition-all shrink-0 ${isSelected ? "bg-accent border-accent text-white" : "border-bordercolor"
                            }`}>
                            {isSelected ? "✓" : ""}
                          </div>
                          <span className="text-[0.68rem] font-semibold text-textcolor leading-tight">{t(a)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Col 2 */}
              <div className="space-y-5">
                {/* Duration */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[0.65rem] font-bold uppercase tracking-wider text-muted">
                      {t("plan_duration")}
                    </label>
                    <strong className="text-xs font-serif text-accent">{tripDuration} {t("days")}</strong>
                  </div>
                  <input
                    type="range" min="3" max="28"
                    value={tripDuration}
                    onChange={(e) => setTripDuration(Number(e.target.value))}
                    className="w-full cursor-pointer"
                  />
                </div>

                {/* Cohort */}
                <div>
                  <label className="block text-[0.65rem] font-bold uppercase tracking-wider text-muted mb-2">
                    {t("plan_cohort")}
                  </label>
                  <div className="relative">
                    <select
                      value={companions}
                      onChange={(e) => setCompanions(e.target.value)}
                      className="w-full bg-surface border border-bordercolor rounded-lg px-3.5 py-2.5 text-xs text-textcolor outline-none focus:border-accent cursor-pointer appearance-none"
                      required
                    >
                      <option value="" disabled>{t("plan_cohort_placeholder")}</option>
                      <option value="Solo">{t("plan_cohort_solo")}</option>
                      <option value="Couple">{t("plan_cohort_couple")}</option>
                      <option value="Family">{t("plan_cohort_family")}</option>
                      <option value="Group">{t("plan_cohort_group")}</option>
                    </select>
                    <ChevronDown className="absolute right-3.5 top-3.5 w-4 h-4 text-muted pointer-events-none" />
                  </div>
                </div>

                {/* Lodging Styles */}
                <div>
                  <label className="block text-[0.65rem] font-bold uppercase tracking-wider text-muted mb-2">
                    {t("plan_lodging")}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {LODGE_OPTIONS.map((l) => {
                      const isSelected = selectedLodgingStyles.includes(l.key);
                      return (
                        <div
                          key={l.key}
                          onClick={() => toggleArr(selectedLodgingStyles, setSelectedLodgingStyles, l.key)}
                          className={`p-2 border rounded-lg cursor-pointer transition-all flex gap-2 items-center ${isSelected ? "border-accent bg-accentdim/15" : "border-bordercolor bg-bg/20 hover:border-accent/40"
                            }`}
                        >
                          <div className={`p-1 rounded border shrink-0 ${isSelected ? "bg-accent text-white border-transparent" : "bg-surface border-bordercolor text-muted"
                            }`}>
                            <l.Icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-[0.65rem] font-semibold text-textcolor truncate">{t(l.name)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Partner Toggle */}
                <div className="pt-1">
                  <label className="relative inline-flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox" className="sr-only peer"
                      checked={usePartnerLodging}
                      onChange={(e) => setUsePartnerLodging(e.target.checked)}
                    />
                    <div className="w-9 h-5 bg-bordercolor peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent" />
                    <span className="text-[0.72rem] font-semibold text-textcolor">{t("plan_partner_network")}</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="border-t border-bordercolor pt-5 md:pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[0.62rem] text-muted mb-1" htmlFor="clientName">
                  {t("plan_name")}
                </label>
                <input
                  type="text" id="clientName" value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder={t("plan_name_placeholder")}
                  className="w-full bg-bg/40 border border-bordercolor rounded-lg px-3 py-2.5 text-xs text-textcolor outline-none focus:border-accent placeholder:text-muted/50"
                  required
                />
              </div>
              <div>
                <label className="block text-[0.62rem] text-muted mb-1" htmlFor="clientEmail">
                  {t("plan_email")}
                </label>
                <input
                  type="email" id="clientEmail" value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder={t("plan_email_placeholder")}
                  className="w-full bg-bg/40 border border-bordercolor rounded-lg px-3 py-2.5 text-xs text-textcolor outline-none focus:border-accent placeholder:text-muted/50"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[0.62rem] text-muted mb-1" htmlFor="specialNotes">
                  {t("plan_notes")}
                </label>
                <textarea
                  id="specialNotes" value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder={t("plan_notes_placeholder")}
                  className="w-full min-h-[65px] bg-bg/40 border border-bordercolor rounded-lg px-3 py-2.5 text-xs text-textcolor outline-none focus:border-accent resize-y placeholder:text-muted/50"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-1">
              <button
                type="button"
                onClick={() => handleApiBooking("email")}
                disabled={bookingLoading}
                className="flex-1 py-3 bg-accent hover:opacity-85 text-white font-semibold uppercase tracking-wider text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-md shadow-accent/25 cursor-pointer transition-all disabled:opacity-50"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{t("book_via_email") || "Email"}</span>
              </button>
              <button
                type="button"
                onClick={() => handleApiBooking("whatsapp")}
                disabled={bookingLoading}
                className="flex-1 py-3 bg-[#25D366] hover:opacity-85 text-white font-semibold uppercase tracking-wider text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-md shadow-[#25D366]/25 cursor-pointer transition-all disabled:opacity-50"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{t("book_via_whatsapp") || "WhatsApp"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation & Receipt Upload Modal */}
      <div className={`modal-overlay ${showModal ? "open" : ""}`}>
        <div className="modal-card max-w-[500px]">
          {!receiptSubmitted ? (
            <>
              {/* Success header */}
              <div className="text-center mb-5">
                <div className="mx-auto w-12 h-12 bg-accentdim/20 text-accent rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-xl sm:text-2xl text-textcolor mb-2">{t("booking_sent_title")}</h3>
                <p className="text-muted text-xs sm:text-sm leading-relaxed">{t("booking_sent_desc")}</p>
              </div>

              {/* Trip summary */}
              <div className="w-full text-left bg-bg/50 border border-bordercolor rounded-lg p-4 mb-5">
                <h5 className="text-[0.62rem] tracking-[0.15em] uppercase font-bold text-accent mb-3 pb-2 border-b border-bordercolor">
                  {t("modal_summary_title")}
                </h5>
                <ul className="space-y-2 text-xs">
                  {modalData.map(([label, value]) => (
                    <li key={label} className="flex justify-between gap-2">
                      <span className="text-muted shrink-0">{label}:</span>
                      <strong className={`truncate max-w-[180px] sm:max-w-[220px] ${label === t("modal_saved") ? "text-accent" : "text-textcolor"
                        }`}>{value}</strong>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Receipt upload section */}
              <div className="w-full text-left border border-bordercolor rounded-lg p-4 mb-5 bg-surface/30">
                <h5 className="text-[0.62rem] tracking-[0.15em] uppercase font-bold text-accent mb-1">
                  {t("upload_receipt")}
                </h5>
                <p className="text-muted text-[0.65rem] mb-3 leading-relaxed">{t("upload_receipt_desc")}</p>

                {/* Drop zone */}
                <div
                  className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-all cursor-pointer ${isDragging ? "border-accent bg-accentdim/10" : "border-bordercolor hover:border-accent/40"
                    }`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files[0];
                    if (file) handleReceiptFile(file);
                  }}
                  onClick={() => document.getElementById("receiptFileInput")?.click()}
                >
                  <input
                    id="receiptFileInput"
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleReceiptFile(file);
                    }}
                  />

                  {receiptFile ? (
                    <div className="flex items-center gap-3">
                      {receiptPreview ? (
                        <img src={receiptPreview} alt="Receipt" className="w-14 h-14 rounded-lg object-cover border border-bordercolor" />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-accentdim/20 flex items-center justify-center">
                          <FileImage className="w-6 h-6 text-accent" />
                        </div>
                      )}
                      <div className="text-left flex-1 min-w-0">
                        <p className="text-xs text-textcolor font-medium truncate">{receiptFile.name}</p>
                        <p className="text-[0.6rem] text-muted">{(receiptFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setReceiptFile(null); setReceiptPreview(null); }}
                        className="p-1 rounded-full hover:bg-surface text-muted hover:text-textcolor transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="py-2">
                      <Upload className="w-5 h-5 mx-auto text-muted mb-2" />
                      <p className="text-[0.65rem] text-muted">{t("receipt_drop_hint")}</p>
                    </div>
                  )}
                </div>

                {/* Receipt notes */}
                <textarea
                  value={receiptNotes}
                  onChange={(e) => setReceiptNotes(e.target.value)}
                  placeholder={t("receipt_notes_label")}
                  className="w-full mt-3 min-h-[50px] bg-bg/40 border border-bordercolor rounded-lg px-3 py-2 text-xs text-textcolor outline-none focus:border-accent resize-y placeholder:text-muted/50"
                />

                {/* Submit receipt */}
                <button
                  type="button"
                  disabled={!receiptFile}
                  onClick={handleReceiptSubmit}
                  className={`w-full mt-3 py-2.5 text-white text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all ${receiptFile
                    ? "bg-accent hover:opacity-85 shadow-md shadow-accent/25"
                    : "bg-muted/30 text-muted cursor-not-allowed"
                    }`}
                >
                  <Send className="w-3 h-3" />
                  {t("receipt_submit")}
                </button>
              </div>

              <button
                onClick={handleCloseModal}
                className="w-full py-2.5 bg-surface hover:bg-surface2 text-textdim text-xs font-semibold uppercase tracking-wider rounded-lg cursor-pointer border border-bordercolor transition-all"
              >
                {t("modal_close")}
              </button>
            </>
          ) : (
            /* Receipt submitted success */
            <div className="text-center py-4">
              <div className="mx-auto w-14 h-14 bg-accentdim/20 text-accent rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-textcolor mb-2">{t("receipt_success_title")}</h3>
              <p className="text-muted text-xs sm:text-sm leading-relaxed mb-6">{t("receipt_success_desc")}</p>
              <button
                onClick={handleCloseModal}
                className="w-full py-2.5 bg-accent hover:opacity-85 text-white text-xs font-semibold uppercase tracking-wider rounded-lg cursor-pointer"
              >
                {t("modal_close")}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function Planner() {
  return (
    <Suspense fallback={<div className="p-24 text-center text-muted"><div className="inline-block w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" /></div>}>
      <PlannerContent />
    </Suspense>
  );
}
