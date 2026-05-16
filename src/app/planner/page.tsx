"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation, useAppStore } from "@/store";
import { PACKAGES, DESTINATIONS, PackagePricing } from "@/data/mockData";

function PlannerContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addDraft } = useAppStore();

  const destParam = searchParams.get("dest");

  const [currentMode, setCurrentMode] = useState<"packages" | "custom">(destParam ? "custom" : "packages");
  const [currentTier, setCurrentTier] = useState<keyof PackagePricing>("solo");
  const [expandedPkg, setExpandedPkg] = useState<string | null>(null);

  const [wizardStep, setWizardStep] = useState(1);
  const [wizDestinations, setWizDestinations] = useState<string[]>(destParam ? [destParam] : []);
  const [wizBudget, setWizBudget] = useState(1);
  const [wizNet, setWizNet] = useState(true);
  const [wizLodging, setWizLodging] = useState<string[]>([]);
  const [wizDays, setWizDays] = useState(7);
  const [wizStyles, setWizStyles] = useState<string[]>([]);
  const [wizActivities, setWizActivities] = useState<string[]>([]);
  const [draftSaved, setDraftSaved] = useState(false);

  const LODGE_OPTIONS = [
    {key:'boutique', emoji:'🏨', name:'Boutique Hotels'},
    {key:'beach', emoji:'🌴', name:'Beach Resorts'},
    {key:'heritage', emoji:'🏰', name:'Heritage Hotels'},
    {key:'eco', emoji:'🌿', name:'Eco Lodges'}
  ];
  const STYLES = ['Adventure','Relaxation','Cultural','Photography','Romantic'];
  const ACTIVITIES = ['Wild Safari','Cultural Sites','Beach Time','Mountain Hikes','Water Sports'];
  const WIZARD_LABELS = ['Destinations','Budget Range','Accommodation','Lodging Category','Trip Duration','Travel Style','Activities'];
  const BUDGET_LABELS = ['Budget','Mid-Tier','Luxury'];

  const toggleArr = (arr: string[], setArr: (v: string[]) => void, val: string) => {
    if (arr.includes(val)) setArr(arr.filter(a => a !== val));
    else setArr([...arr, val]);
  };

  const handleSaveDraft = (name: string) => {
    addDraft({ name, date: new Date().toLocaleDateString() });
    alert("Saved to your Profile!");
  };

  const handleSaveCustomDraft = () => {
    const name = `Custom ${wizDays}-Day ${wizStyles[0] || 'Journey'}`;
    addDraft({ name, date: new Date().toLocaleDateString() });
    setDraftSaved(true);
    setTimeout(() => {
      setDraftSaved(false);
      router.push("/profile");
    }, 1500);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
      <div className="text-[0.68rem] tracking-[0.15em] uppercase text-muted mb-3">{t("plan_eyebrow")}</div>
      <h1 className="font-serif text-[2.2rem] md:text-[2.5rem] mb-2">{t("plan_title")}</h1>
      <p className="text-[0.85rem] md:text-[0.9rem] text-muted mb-8">{t("plan_sub")}</p>
      
      {/* Toggle */}
      <div className="flex bg-surface border border-bordercolor rounded-lg p-1 gap-1 mb-8 md:mb-10 w-fit max-w-full overflow-x-auto">
        <button 
          onClick={() => setCurrentMode("packages")}
          className={`px-4 md:px-5 py-2 text-[0.7rem] md:text-[0.78rem] tracking-[0.06em] uppercase rounded-md transition-colors whitespace-nowrap ${currentMode === "packages" ? "bg-accent text-white" : "text-muted hover:text-textcolor"}`}
        >
          {t("plan_tab_pkg")}
        </button>
        <button 
          onClick={() => setCurrentMode("custom")}
          className={`px-4 md:px-5 py-2 text-[0.7rem] md:text-[0.78rem] tracking-[0.06em] uppercase rounded-md transition-colors whitespace-nowrap ${currentMode === "custom" ? "bg-accent text-white" : "text-muted hover:text-textcolor"}`}
        >
          {t("plan_tab_custom")}
        </button>
      </div>

      {currentMode === "packages" && (
        <div>
          <div className="inline-flex gap-1 bg-bg border border-bordercolor p-1 rounded-md mb-6 overflow-x-auto max-w-full">
            {(["solo", "duo", "group"] as const).map(tier => (
              <button 
                key={tier}
                onClick={() => setCurrentTier(tier)}
                className={`px-3 py-1.5 text-[0.7rem] md:text-[0.73rem] tracking-[0.05em] rounded transition-all whitespace-nowrap ${currentTier === tier ? "bg-surface text-textcolor shadow-[0_0_0_0.5px_var(--color-bordercolor)]" : "text-muted hover:text-textcolor"}`}
              >
                {t(`tier_${tier}`)}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {PACKAGES.map(pkg => {
              const price = pkg.pricing[currentTier];
              const isExp = expandedPkg === pkg.id;

              return (
                <div key={pkg.id}>
                  <div 
                    onClick={() => setExpandedPkg(isExp ? null : pkg.id)}
                    className={`bg-surface border border-bordercolor p-5 md:p-6 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-center cursor-pointer transition-colors ${isExp ? "rounded-t-xl border-accent" : "rounded-xl hover:border-accent"}`}
                  >
                    <div>
                      <h3 className="text-[1.2rem] md:text-[1.3rem] font-serif mb-2">{pkg.name}</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {pkg.tags.map(tag => (
                          <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.65rem] md:text-[0.7rem] tracking-[0.06em] font-medium border border-bordercolor text-muted uppercase">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="text-left md:text-right border-t md:border-0 border-bordercolor pt-3 md:pt-0">
                      <div className="text-[1.2rem] md:text-[1.4rem] font-serif text-accent md:text-textcolor">{currentTier==='group'?'From ':''}${price}</div>
                      <div className="text-[0.7rem] md:text-[0.72rem] text-muted">{currentTier==='solo'?'per person':currentTier==='duo'?'for 2 persons':'per person (group)' }</div>
                    </div>
                  </div>
                  
                  {isExp && (
                    <div className="bg-surface border border-accent border-t-0 rounded-b-xl p-5 md:p-6 animate-[fadeIn_0.25s_ease]">
                      <p className="text-[0.8rem] md:text-[0.85rem] text-muted mb-4">{pkg.desc}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div><div className="text-[0.68rem] tracking-[0.15em] uppercase text-muted mb-1">Accommodation</div><p className="text-[0.82rem] text-muted">{pkg.accommodation}</p></div>
                        <div><div className="text-[0.68rem] tracking-[0.15em] uppercase text-muted mb-1">Transport</div><p className="text-[0.82rem] text-muted">{pkg.transport}</p></div>
                      </div>
                      <div className="text-[0.68rem] tracking-[0.15em] uppercase text-muted mb-2">Itinerary</div>
                      <ul className="space-y-3">
                        {pkg.itinerary.map((day, i) => (
                          <li key={i} className="flex items-start gap-3 md:gap-4 pb-3 border-b border-bordercolor text-[0.8rem] md:text-[0.83rem] text-muted last:border-0 last:pb-0">
                            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-accentdim text-accent flex items-center justify-center text-[0.68rem] font-medium shrink-0">{i+1}</div>
                            <span className="mt-1">{day}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        <button onClick={(e) => { e.stopPropagation(); handleSaveDraft(pkg.name); }} className="w-full sm:w-auto px-4 py-2 bg-accent text-white rounded-md text-[0.72rem] font-medium tracking-[0.06em] uppercase hover:opacity-85 text-center">Save Trip Draft</button>
                        <button className="w-full sm:w-auto px-4 py-2 bg-transparent border border-bordercolor text-textcolor rounded-md text-[0.72rem] font-medium tracking-[0.06em] uppercase hover:border-accent hover:text-accent text-center">Request Booking</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {currentMode === "custom" && (
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 md:gap-8 items-start">
          <div className="sticky top-14 md:top-20 bg-bg/95 md:bg-transparent backdrop-blur-sm z-10 py-3 md:py-0 flex md:flex-col gap-2 overflow-x-auto border-b md:border-0 border-bordercolor hide-scrollbar">
            {WIZARD_LABELS.map((label, i) => {
              const stepNum = i + 1;
              const isActive = stepNum === wizardStep;
              const isDone = stepNum < wizardStep;
              return (
                <div key={label} onClick={() => setWizardStep(stepNum)} className={`flex items-center gap-2 md:gap-3 px-3 py-2 md:py-2.5 rounded-lg text-[0.75rem] md:text-[0.8rem] whitespace-nowrap cursor-pointer transition-all ${isActive ? 'bg-surface text-textcolor border border-bordercolor' : isDone ? 'text-muted hover:bg-surface/50' : 'text-muted opacity-50'}`}>
                  <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-[0.6rem] md:text-[0.68rem] font-semibold shrink-0 ${isDone ? 'bg-accent text-white' : isActive ? 'bg-bordercolor text-textcolor' : 'bg-bordercolor text-muted'}`}>{stepNum}</div>
                  <span className="hidden sm:inline-block md:inline-block">{label}</span>
                  <span className="sm:hidden">{isActive ? label : ''}</span>
                </div>
              );
            })}
          </div>
          
          <div className="bg-surface border border-bordercolor rounded-xl p-8">
            {wizardStep === 1 && (
              <>
                <h3 className="text-[1.3rem] font-serif mb-1">Choose Your Destinations</h3>
                <p className="text-[0.8rem] text-muted mb-4">Select one or more places you'd like to visit.</p>
                <div className="flex flex-wrap gap-2">
                  {DESTINATIONS.map(d => (
                    <button key={d} onClick={() => toggleArr(wizDestinations, setWizDestinations, d)} className={`px-3.5 py-1.5 rounded-full text-[0.76rem] border transition-all ${wizDestinations.includes(d) ? 'border-accent text-accent bg-accentdim' : 'border-bordercolor text-muted hover:border-textcolor'}`}>{d}</button>
                  ))}
                </div>
              </>
            )}
            {wizardStep === 2 && (
              <>
                <h3 className="text-[1.3rem] font-serif mb-1">Budget Range</h3>
                <p className="text-[0.8rem] text-muted mb-6">Set your estimated travel budget tier.</p>
                <div className="py-4">
                  <input type="range" min="0" max="2" step="1" value={wizBudget} onChange={(e) => setWizBudget(Number(e.target.value))} className="w-full" />
                  <div className="flex justify-between text-[0.72rem] text-muted mt-2"><span>Budget</span><span>Mid-Tier</span><span>Luxury</span></div>
                </div>
                <div className="mt-4 text-[1.4rem] font-serif text-accent">{BUDGET_LABELS[wizBudget]}</div>
              </>
            )}
            {wizardStep === 3 && (
              <>
                <h3 className="text-[1.3rem] font-serif mb-1">Accommodation Strategy</h3>
                <p className="text-[0.8rem] text-muted mb-6">How would you like to manage your lodging?</p>
                <label className="relative inline-flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={wizNet} onChange={(e) => setWizNet(e.target.checked)} />
                  <div className="w-11 h-6 bg-bordercolor peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                  <span className="text-[0.85rem]">{wizNet ? "Use VisitCeylon's Partner Network" : "Independent Booking"}</span>
                </label>
                <div className="bg-accentdim border border-accent rounded-lg px-4 py-3 text-[0.8rem] text-accent mt-4">
                  {wizNet ? "Booking via our partner network reduces total lodge overhead fees by 15%." : "You retain full control of your own accommodation bookings."}
                </div>
              </>
            )}
            {wizardStep === 4 && (
              <>
                <h3 className="text-[1.3rem] font-serif mb-1">Lodging Category</h3>
                <p className="text-[0.8rem] text-muted mb-4">Select your preferred accommodation style.</p>
                <div className="grid grid-cols-2 gap-3">
                  {LODGE_OPTIONS.map(l => (
                    <div key={l.key} onClick={() => toggleArr(wizLodging, setWizLodging, l.key)} className={`p-4 border rounded-lg cursor-pointer text-center transition-all ${wizLodging.includes(l.key) ? 'border-accent bg-accentdim' : 'border-bordercolor hover:border-textcolor'}`}>
                      <div className="text-2xl mb-1">{l.emoji}</div>
                      <div className="text-[0.8rem] font-medium">{l.name}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {wizardStep === 5 && (
              <>
                <h3 className="text-[1.3rem] font-serif mb-1">Trip Duration</h3>
                <p className="text-[0.8rem] text-muted mb-6">How many days are you planning to travel?</p>
                <div className="flex items-center gap-4">
                  <button onClick={() => setWizDays(Math.max(1, wizDays - 1))} className="w-9 h-9 rounded-full border border-bordercolor flex items-center justify-center text-xl hover:border-accent hover:text-accent transition-colors">−</button>
                  <div className="text-[2rem] font-serif min-w-[3rem] text-center">{wizDays}</div>
                  <button onClick={() => setWizDays(Math.min(30, wizDays + 1))} className="w-9 h-9 rounded-full border border-bordercolor flex items-center justify-center text-xl hover:border-accent hover:text-accent transition-colors">+</button>
                  <span className="text-muted text-[0.85rem]">days</span>
                </div>
              </>
            )}
            {wizardStep === 6 && (
              <>
                <h3 className="text-[1.3rem] font-serif mb-1">Travel Style</h3>
                <p className="text-[0.8rem] text-muted mb-4">What mood defines your ideal journey?</p>
                <div className="flex flex-wrap gap-2">
                  {STYLES.map(s => (
                    <button key={s} onClick={() => toggleArr(wizStyles, setWizStyles, s)} className={`px-4 py-1.5 rounded-full text-[0.76rem] border transition-all ${wizStyles.includes(s) ? 'border-accent text-accent bg-accentdim' : 'border-bordercolor text-muted hover:border-textcolor'}`}>{s}</button>
                  ))}
                </div>
              </>
            )}
            {wizardStep === 7 && (
              <>
                <h3 className="text-[1.3rem] font-serif mb-1">Activities</h3>
                <p className="text-[0.8rem] text-muted mb-4">Select all activities you'd like included.</p>
                <div className="space-y-1">
                  {ACTIVITIES.map(a => (
                    <div key={a} onClick={() => toggleArr(wizActivities, setWizActivities, a)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-bordercolor transition-colors">
                      <div className={`w-4.5 h-4.5 rounded border flex items-center justify-center text-[0.65rem] transition-all ${wizActivities.includes(a) ? 'bg-accent border-accent text-white' : 'border-bordercolor'}`}>{wizActivities.includes(a) ? '✓' : ''}</div>
                      <span className="text-[0.85rem]">{a}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-bordercolor">
                  <h4 className="text-base font-medium mb-3">Journey Summary</h4>
                  <div className="text-[0.8rem] text-muted leading-loose space-y-1">
                    <div>📍 <strong className="text-textcolor font-medium">{wizDestinations.slice(0,4).join(', ')|| 'None selected'}{wizDestinations.length>4?' + more':''}</strong></div>
                    <div>💰 <strong className="text-textcolor font-medium">{BUDGET_LABELS[wizBudget]}</strong></div>
                    <div>🛏 <strong className="text-textcolor font-medium">{wizNet?'Partner Network':'Own Booking'}</strong></div>
                    <div>📅 <strong className="text-textcolor font-medium">{wizDays} days</strong></div>
                    <div>🎭 <strong className="text-textcolor font-medium">{wizStyles.join(', ')||'Not specified'}</strong></div>
                  </div>
                  <button onClick={handleSaveCustomDraft} className="mt-5 w-full py-2.5 bg-accent text-white rounded-md text-[0.8rem] font-medium tracking-[0.06em] uppercase hover:opacity-85">Save Custom Journey Draft</button>
                  {draftSaved && <div className="mt-2 text-[0.78rem] text-accent text-center">Draft saved to your Profile! Redirecting...</div>}
                </div>
              </>
            )}

            <div className="flex justify-between mt-8 pt-6 border-t border-bordercolor">
              {wizardStep > 1 ? <button onClick={() => setWizardStep(wizardStep - 1)} className="px-4 py-2 bg-transparent border border-bordercolor text-textcolor rounded-md text-[0.72rem] font-medium tracking-[0.06em] uppercase hover:border-accent hover:text-accent">← Back</button> : <span></span>}
              {wizardStep < 7 ? <button onClick={() => setWizardStep(wizardStep + 1)} className="px-4 py-2 bg-accent text-white rounded-md text-[0.72rem] font-medium tracking-[0.06em] uppercase hover:opacity-85">Next →</button> : <span></span>}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default function Planner() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-muted">Loading Planner...</div>}>
      <PlannerContent />
    </Suspense>
  );
}
