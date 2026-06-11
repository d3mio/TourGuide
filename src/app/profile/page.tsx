"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation, useAppStore, Draft } from "@/store";
import { Leaf, Landmark, Camera, Waves, Star, Calendar, Heart, Upload, X, CheckCircle2, MessageCircle, Edit2, Hotel, Palmtree, Castle, ChevronDown, Mail, Trash2 } from "lucide-react";
import { DESTINATIONS } from "@/data/mockData";

import { getPlaceImage } from "@/data/images";
import Image from "next/image";

const LODGE_OPTIONS = [
  { key: "boutique", Icon: Hotel, name: "Boutique Hotels" },
  { key: "beach", Icon: Palmtree, name: "Beach Resorts" },
  { key: "heritage", Icon: Castle, name: "Heritage Hotels" },
  { key: "eco", Icon: Leaf, name: "Eco Lodges" },
];

const ACTIVITIES = ["Wild Safari", "Cultural Sites", "Beach Time", "Mountain Hikes", "Water Sports"];
const THEMES = ["History", "Culture", "Adventure", "Eco", "MICE", "Family", "Leisure", "Education"];

export default function Profile() {
  const { t } = useTranslation();
  const { drafts, wishlist, reviews, toggleWishlist, updateDraftStatus, updateDraft, deleteDraft, deleteReview, user } = useAppStore();

  // User details fallback
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || "Traveller";
  const userEmail = user?.email || "Colombo, Sri Lanka";
  const userInitial = userName.charAt(0).toUpperCase();

  // Receipt upload state for profile modal
  const [receiptDraft, setReceiptDraft] = useState<string | null>(null);
  const [receiptNotes, setReceiptNotes] = useState("");
  const [receiptSubmitted, setReceiptSubmitted] = useState(false);

  // Edit Draft States
  const [editingDraft, setEditingDraft] = useState<Draft | null>(null);
  const [editDestinations, setEditDestinations] = useState<string[]>([]);
  const [editDuration, setEditDuration] = useState<number>(10);
  const [editCompanions, setEditCompanions] = useState<string>("");
  const [editNotes, setEditNotes] = useState<string>("");
  const [editClientName, setEditClientName] = useState<string>("");
  const [editClientEmail, setEditClientEmail] = useState<string>("");
  const [editThemes, setEditThemes] = useState<string[]>([]);
  const [editActivities, setEditActivities] = useState<string[]>([]);
  const [editLodgingStyles, setEditLodgingStyles] = useState<string[]>([]);
  const [editSaveStatus, setEditSaveStatus] = useState<boolean>(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const GUIDE_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "";
  const GUIDE_WHATSAPP = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || "";

  const startEditing = (draft: Draft) => {
    setEditingDraft(draft);
    setEditDestinations(draft.destinations || []);
    setEditDuration(draft.duration || 10);
    setEditCompanions(draft.companions || "");
    setEditNotes(draft.specialNotes || "");
    setEditClientName(draft.clientName || "");
    setEditClientEmail(draft.clientEmail || "");
    setEditThemes(draft.themes || []);
    setEditActivities(draft.activities || []);
    setEditLodgingStyles(draft.lodgingStyles || []);
    setEditSaveStatus(false);
  };

  const toggleArr = (arr: string[], setArr: (v: string[]) => void, val: string) => {
    setArr(arr.includes(val) ? arr.filter((a) => a !== val) : [...arr, val]);
  };

  const handleSaveEdit = () => {
    if (!editingDraft) return;
    const name = `Custom ${editDuration}-Day Journey`;
    const updatedDraft = {
      destinations: editDestinations,
      duration: editDuration,
      companions: editCompanions,
      specialNotes: editNotes,
      clientName: editClientName,
      clientEmail: editClientEmail,
      themes: editThemes,
      activities: editActivities,
      lodgingStyles: editLodgingStyles,
      name,
    };
    updateDraft(editingDraft.id, updatedDraft);
    setEditingDraft({
      ...editingDraft,
      ...updatedDraft,
    });
    setEditSaveStatus(true);
    setTimeout(() => setEditSaveStatus(false), 2000);
  };

  const getDraftBookingSummary = (draft: Draft) => {
    const lines = [
      `Package: ${draft.packageName || "Custom"}`,
      `Destinations: ${(draft.destinations || []).join(", ") || "—"}`,
      `Duration: ${draft.duration || 10} days`,
      `Companions: ${draft.companions || "—"}`,
      `Themes: ${(draft.themes || []).join(", ") || "None"}`,
      `Activities: ${(draft.activities || []).join(", ") || "None"}`,
      `Lodging: ${(draft.lodgingStyles || []).join(", ") || "Standard"}`,
    ];
    if (draft.clientName) lines.unshift(`Name: ${draft.clientName}`);
    if (draft.clientEmail) lines.unshift(`Email: ${draft.clientEmail}`);
    if (draft.specialNotes) lines.push(`Notes: ${draft.specialNotes}`);
    return lines.join("\n");
  };

  const handleApiBooking = async (draft: Draft, method: "email" | "whatsapp" = "email") => {
    const clientEmail = draft.clientEmail || user?.email || window.prompt("Please enter your email address:");
    if (!clientEmail) return;

    setBookingLoading(true);
    try {
      fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: draft.clientName || user?.user_metadata?.full_name || "Traveler",
          clientEmail,
          title: draft.name,
          details: getDraftBookingSummary(draft)
        })
      }).catch(e => console.error(e));

      if (method === "email") {
        const subject = encodeURIComponent(`Tour Booking Request — ${draft.name}`);
        const body = encodeURIComponent(getDraftBookingSummary(draft));
        window.open(`mailto:${GUIDE_EMAIL}?subject=${subject}&body=${body}`, "_blank");
      } else {
        const text = encodeURIComponent(`Hi! I'd like to book a tour.\n\n${getDraftBookingSummary(draft)}`);
        window.open(`https://wa.me/${GUIDE_WHATSAPP.replace(/\+/g, "")}?text=${text}`, "_blank");
      }
      
      updateDraftStatus(draft.id, "completed");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleReceiptSubmit = () => {
    if (!receiptDraft) return;
    
    const draftName = drafts.find(d => d.id === receiptDraft || d.name === receiptDraft)?.name || receiptDraft;
    const subject = encodeURIComponent(`Payment Receipt: ${draftName}`);
    const body = encodeURIComponent(`Hello Dineth,\n\nI have attached the payment receipt for my booking: ${draftName}.\n\nNotes: ${receiptNotes}\n\nThank you.`);

    // Mark draft as completed
    updateDraftStatus(receiptDraft as string, "completed");
    
    // Open default email client
    setTimeout(() => {
      window.location.href = `mailto:${GUIDE_EMAIL}?subject=${subject}&body=${body}`;
      setReceiptSubmitted(true);
    }, 300);
  };

  const closeReceiptModal = () => {
    setReceiptDraft(null);
    setReceiptNotes("");
    setReceiptSubmitted(false);
  };

  // Filter reviews written by the client
  const myReviews = reviews.filter((r) => r.isMine);

  const PROFILE_TAGS = [
    { icon: Leaf, label: 'Wildlife' },
    { icon: Landmark, label: 'Heritage' },
    { icon: Camera, label: 'Photography' },
    { icon: Waves, label: 'Beaches' }
  ];

  return (
    <>
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
      {/* Page Header */}
      <div className="mb-12">
        <span className="text-[0.68rem] tracking-[0.15em] uppercase text-accent font-bold mb-3 block">
          {t("prof_eyebrow") || "Traveller Dashboard"}
        </span>
        <h1 className="font-serif text-[2.5rem] md:text-[3.2rem] leading-tight mb-4 text-textcolor">
          {t("prof_title") || "My Profile"}
        </h1>
        <p className="text-muted text-[0.88rem] md:text-[0.95rem]">
          {t("prof_desc")}
        </p>
      </div>
      
      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 md:gap-8 items-start">
        
        {/* Profile Sidebar */}
        <div className="bg-surface border border-bordercolor rounded-2xl p-5 sm:p-6 shadow-sm">
          {/* Avatar + name row (horizontal on mobile) */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start lg:flex-col lg:items-center gap-4 mb-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-accentdim/20 border-2 border-accent flex items-center justify-center font-serif text-[1.6rem] sm:text-[2rem] text-accent shrink-0 shadow-md shadow-accent/10 overflow-hidden">
              {user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                userInitial
              )}
            </div>
            <div className="text-center sm:text-left lg:text-center">
              <h2 className="text-xl font-serif text-textcolor mb-1">{userName}</h2>
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[0.65rem] tracking-wider font-bold border border-accent/20 text-accent bg-accentdim/15 uppercase">
                {t("Explorer Elite")}
              </span>
              <p className="text-xs text-muted mt-2">{userEmail}</p>
            </div>
          </div>

          {/* Stats Box */}
          <div className="grid grid-cols-3 gap-2 py-4 mb-5 border-y border-bordercolor text-center">
            <div>
              <span className="block text-lg font-bold text-textcolor">{drafts.length}</span>
              <span className="text-[0.62rem] text-muted uppercase">{t("Drafts")}</span>
            </div>
            <div>
              <span className="block text-lg font-bold text-textcolor">{wishlist.length}</span>
              <span className="text-[0.62rem] text-muted uppercase">{t("Saved")}</span>
            </div>
            <div>
              <span className="block text-lg font-bold text-textcolor">{myReviews.length}</span>
              <span className="text-[0.62rem] text-muted uppercase">{t("Reviews")}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-1.5">
            {PROFILE_TAGS.map((tag) => {
              const Icon = tag.icon;
              return (
                <span key={tag.label} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.72rem] border border-bordercolor text-muted">
                  <Icon className="w-3.5 h-3.5 text-accent" />
                  {t(tag.label)}
                </span>
              );
            })}
          </div>
        </div>

        {/* Profile Content Column */}
        <div className="space-y-6">
          
          {/* Section 1: Saved Drafts & Completed */}
          <div className="bg-surface border border-bordercolor rounded-2xl p-6 md:p-8 shadow-sm space-y-8">
            {/* Saved Drafts */}
            <div>
              <div className="text-[0.68rem] tracking-[0.1em] uppercase text-textcolor font-bold mb-4 pb-2 border-b border-bordercolor flex items-center justify-between">
                <span>{t("prof_drafts") || "Saved Trip Drafts"}</span>
                <span className="text-[0.62rem] bg-accentdim/20 text-accent px-2 py-0.5 rounded font-bold uppercase">{drafts.filter(d => d.status !== 'completed').length} {t("Drafts")}</span>
              </div>
              
              {drafts.filter(d => d.status !== 'completed').length > 0 ? (
                <div className="divide-y divide-bordercolor">
                  {drafts.filter(d => d.status !== 'completed').map((d, i) => (
                    <div key={d.id || i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 text-xs text-textcolor first:pt-0 last:pb-0 gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-medium truncate">{d.name}</span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[0.58rem] tracking-wider font-bold uppercase shrink-0 bg-amber-500/10 text-amber-500 border border-amber-500/20">
                          {t("status_pending")}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-muted flex items-center gap-1.5 text-[0.68rem]">
                          <Calendar className="w-3.5 h-3.5 text-accent" /> {d.date}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEditing(d)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[0.6rem] font-bold uppercase tracking-wider border border-bordercolor hover:border-accent text-textcolor hover:text-accent cursor-pointer transition-all"
                          >
                            <Edit2 className="w-2.5 h-2.5" /> {t("Edit & Book") || "Edit & Book"}
                          </button>
                          <button
                            onClick={() => setReceiptDraft(d.id || d.name)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[0.6rem] font-bold uppercase tracking-wider bg-surface hover:bg-accent hover:text-white text-muted cursor-pointer transition-all border border-bordercolor hover:border-accent"
                          >
                            <CheckCircle2 className="w-3 h-3" /> {t("prof_btn_receipt")}
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm("Are you sure you want to delete this draft?")) {
                                deleteDraft(d.id);
                              }
                            }}
                            className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[0.6rem] font-bold uppercase tracking-wider hover:bg-rose-500/10 hover:text-rose-500 text-muted cursor-pointer transition-all"
                            title="Delete Draft"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 border border-dashed border-bordercolor rounded-xl bg-bg/20 text-xs text-muted">
                  {t("prof_no_drafts_1")}<Link href="/planner" className="text-accent underline font-semibold">{t("prof_no_drafts_link")}</Link>{t("prof_no_drafts_2")}
                </div>
              )}
            </div>

            {/* Completed Tours */}
            <div>
              <div className="text-[0.68rem] tracking-[0.1em] uppercase text-textcolor font-bold mb-4 pb-2 border-b border-bordercolor">
                {t("prof_completed") || "Completed Tours"}
              </div>
              <div className="divide-y divide-bordercolor">
                {drafts.filter(d => d.status === 'completed').length > 0 ? drafts.filter(d => d.status === 'completed').map((d, i) => (
                  <div key={d.id || i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 text-xs md:text-sm text-textcolor first:pt-0 last:pb-0 gap-2">
                    <span className="font-medium truncate">{d.name}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-muted flex items-center gap-1.5 text-[0.68rem]">
                        <Calendar className="w-3.5 h-3.5 text-accent" /> {d.date}
                      </span>
                      <span className="inline-flex px-2.5 py-0.5 rounded text-[0.62rem] tracking-wider font-bold border border-accent/20 text-accent bg-accentdim/15 uppercase">{t("status_completed") || "Completed"}</span>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-6 border border-dashed border-bordercolor rounded-xl bg-bg/20 text-xs text-muted">
                    {t("No completed tours yet.") || "No completed tours yet."}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Destination Wishlist */}
          <div className="bg-surface border border-bordercolor rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="text-[0.68rem] tracking-[0.1em] uppercase text-textcolor font-bold mb-5 pb-2 border-b border-bordercolor">
              {t("prof_wishlist") || "Destination Wishlist"}
            </div>
            
            {wishlist.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {wishlist.map(w => {
                  const imageSrc = getPlaceImage(w);
                  return (
                    <div 
                      key={w} 
                      className="group bg-bg border border-bordercolor rounded-xl overflow-hidden p-3.5 flex gap-4 items-center justify-between hover:border-accent/40 transition-colors"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Little square thumbnail image */}
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-surface relative">
                          <Image src={imageSrc} alt={w} fill sizes="48px" className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-xs text-textcolor truncate">{t(w)}</h4>
                          <span className="text-[0.62rem] uppercase font-bold text-accent bg-accentdim/10 px-2 py-0.5 rounded">{t("Saved")}</span>
                        </div>
                      </div>
                      
                      {/* Heart/Trash Toggle Button */}
                      <button 
                        onClick={() => toggleWishlist(w)}
                        className="w-8 h-8 rounded-full bg-surface hover:bg-rose-500/10 text-muted hover:text-rose-500 flex items-center justify-center border border-bordercolor transition-colors cursor-pointer shrink-0"
                        title="Remove from wishlist"
                      >
                        <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 border border-dashed border-bordercolor rounded-xl bg-bg/20 text-xs text-muted">
                {t("prof_wishlist_empty_1")}<Link href="/explore" className="text-accent underline font-semibold">{t("prof_wishlist_empty_link")}</Link>!
              </div>
            )}
          </div>

          {/* Section 3: Traveler Reviews */}
          <div className="bg-surface border border-bordercolor rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="text-[0.68rem] tracking-[0.1em] uppercase text-textcolor font-bold mb-4 pb-2 border-b border-bordercolor">
              {t("prof_reviews") || "My Reviews"}
            </div>
            
            {myReviews.length > 0 ? (
              <div className="space-y-4">
                {myReviews.map((r, i) => (
                  <div key={i} className="py-4 border-b border-bordercolor last:border-0 last:pb-0 first:pt-0">
                    <div className="flex justify-between items-center gap-2 mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-textcolor">{r.date}</span>
                        <span className="flex gap-0.5 text-amber-500">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star 
                              key={idx} 
                              className={`w-3.5 h-3.5 ${
                                idx < r.stars ? 'fill-amber-500 text-amber-500' : 'text-bordercolor'
                              }`}
                            />
                          ))}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete this review?")) {
                            deleteReview(r.id);
                          }
                        }}
                        className="p-1 rounded-full hover:bg-rose-500/10 text-muted hover:text-rose-500 transition-colors cursor-pointer"
                        title="Delete Review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-[0.82rem] text-muted leading-relaxed">
                      "{r.text}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-bordercolor rounded-xl bg-bg/20 text-xs text-muted">
                {t("prof_no_reviews_1")}<Link href="/experiences" className="text-accent underline font-semibold">{t("prof_no_reviews_link")}</Link>!
              </div>
            )}
          </div>

        </div>
      </div>
    </section>

    {/* Receipt Upload Modal (from profile) */}
    <div className={`modal-overlay ${receiptDraft ? "open" : ""}`}>
      <div className="modal-card max-w-[460px]">
        {!receiptSubmitted ? (
          <>
            <div className="text-center mb-5">
              <div className="mx-auto w-12 h-12 bg-accentdim/20 text-accent rounded-full flex items-center justify-center mb-4">
                <Upload className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-textcolor mb-2">{t("complete_booking")}</h3>
              <p className="text-muted text-xs sm:text-sm leading-relaxed">{t("upload_receipt_desc")}</p>
            </div>

            <div className="w-full text-left bg-surface/30 border border-bordercolor rounded-lg p-4 mb-4">
              <p className="text-xs text-muted mb-1">{t("prof_drafts")}:</p>
              <p className="text-sm font-medium text-textcolor">
                {drafts.find(d => d.id === receiptDraft || d.name === receiptDraft)?.name || receiptDraft}
              </p>
            </div>

            <div className="w-full text-center bg-surface/30 border border-bordercolor rounded-lg p-4 mb-4">
              <p className="text-xs text-muted mb-2">Please send an email to Dineth with your payment receipt attached to complete the booking process.</p>
              <p className="text-sm font-medium text-textcolor font-mono bg-bg/50 py-1.5 rounded inline-block px-3 border border-bordercolor/50">
                {GUIDE_EMAIL || "contact@ceylonluxetravels.com"}
              </p>
            </div>

            <textarea
              value={receiptNotes}
              onChange={(e) => setReceiptNotes(e.target.value)}
              placeholder={t("receipt_notes_label")}
              className="w-full min-h-[50px] bg-bg/40 border border-bordercolor rounded-lg px-3 py-2 text-xs text-textcolor outline-none focus:border-accent resize-y placeholder:text-muted/50 mb-3"
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={closeReceiptModal}
                className="flex-1 py-2.5 bg-surface hover:bg-surface2 text-textdim text-xs font-semibold uppercase tracking-wider rounded-lg cursor-pointer border border-bordercolor transition-all"
              >
                {t("modal_close")}
              </button>
              <button
                type="button"
                onClick={handleReceiptSubmit}
                className="flex-1 py-2.5 bg-accent hover:opacity-85 text-white shadow-md shadow-accent/25 text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <Mail className="w-3.5 h-3.5" />
                Send Email & Complete
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="mx-auto w-14 h-14 bg-accentdim/20 text-accent rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-textcolor mb-2">{t("receipt_success_title")}</h3>
            <p className="text-muted text-xs sm:text-sm leading-relaxed mb-6">{t("receipt_success_desc")}</p>
            <button
              onClick={closeReceiptModal}
              className="w-full py-2.5 bg-accent hover:opacity-85 text-white text-xs font-semibold uppercase tracking-wider rounded-lg cursor-pointer"
            >
              {t("modal_close")}
            </button>
          </div>
        )}
      </div>
    </div>

    {/* Edit Draft Modal */}
    {editingDraft && (
      <div className="modal-overlay open">
        <div className="modal-card max-w-[500px] max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-5 pb-3 border-b border-bordercolor">
            <h3 className="font-serif text-xl text-textcolor">{t("edit_draft_title") === "edit_draft_title" ? "Edit Draft" : t("edit_draft_title")}</h3>
            <button onClick={() => setEditingDraft(null)} className="text-muted hover:text-textcolor transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 mb-6 text-left">
            {/* Destinations */}
            <div>
              <label className="block text-[0.68rem] uppercase tracking-wider font-semibold text-muted mb-1.5">{t("modal_destinations")}</label>
              <div className="flex flex-wrap gap-1.5 max-h-[130px] overflow-y-auto pr-1 border border-bordercolor rounded-lg p-2 bg-bg/30">
                {DESTINATIONS.map((d) => {
                  const isSelected = editDestinations.includes(d);
                  return (
                    <button
                      key={d} type="button"
                      onClick={() => toggleArr(editDestinations, setEditDestinations, d)}
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
              <label className="block text-[0.68rem] uppercase tracking-wider font-semibold text-muted mb-1.5">{t("modal_themes")}</label>
              <div className="flex flex-wrap gap-1.5">
                {THEMES.map((theme) => {
                  const isSelected = editThemes.includes(theme);
                  return (
                    <button
                      key={theme} type="button"
                      onClick={() => toggleArr(editThemes, setEditThemes, theme)}
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

            {/* Activities & Lodging */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[0.68rem] uppercase tracking-wider font-semibold text-muted mb-1.5">{t("modal_activities")}</label>
                <div className="flex flex-col gap-2">
                  {ACTIVITIES.map((a) => {
                    const isSelected = editActivities.includes(a);
                    return (
                      <div
                        key={a}
                        onClick={() => toggleArr(editActivities, setEditActivities, a)}
                        className={`p-2 rounded-lg border cursor-pointer flex items-center gap-2 transition-colors ${isSelected ? "border-accent/40 bg-accentdim/5" : "border-bordercolor bg-bg/20 hover:border-accent/30"
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
              <div>
                <label className="block text-[0.68rem] uppercase tracking-wider font-semibold text-muted mb-1.5">{t("modal_lodging")}</label>
                <div className="flex flex-col gap-2">
                  {LODGE_OPTIONS.map((l) => {
                    const isSelected = editLodgingStyles.includes(l.key);
                    return (
                      <div
                        key={l.key}
                        onClick={() => toggleArr(editLodgingStyles, setEditLodgingStyles, l.key)}
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[0.68rem] uppercase tracking-wider font-semibold text-muted mb-1.5">{t("modal_duration")}</label>
                <div className="flex items-center gap-3 bg-bg/40 border border-bordercolor rounded-lg px-3 py-1 text-xs">
                    <input
                      type="range" min="3" max="28"
                      value={editDuration}
                      onChange={(e) => setEditDuration(parseInt(e.target.value) || 0)}
                      className="w-full cursor-pointer"
                    />
                    <strong className="text-accent font-serif whitespace-nowrap">{editDuration} {t("days")}</strong>
                </div>
              </div>
              <div>
                <label className="block text-[0.68rem] uppercase tracking-wider font-semibold text-muted mb-1.5">{t("modal_companions")}</label>
                <div className="relative">
                  <select
                    value={editCompanions}
                    onChange={(e) => setEditCompanions(e.target.value)}
                    className="w-full bg-bg/40 border border-bordercolor rounded-lg px-3 py-2 text-xs text-textcolor outline-none focus:border-accent cursor-pointer appearance-none"
                  >
                    <option value="" disabled>{t("plan_cohort_placeholder") || "Select Companions"}</option>
                    <option value="Solo">{t("plan_cohort_solo") || "Solo Traveller"}</option>
                    <option value="Couple">{t("plan_cohort_couple") || "Couple"}</option>
                    <option value="Family">{t("plan_cohort_family") || "Family"}</option>
                    <option value="Group">{t("plan_cohort_group") || "Group"}</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-muted pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[0.68rem] uppercase tracking-wider font-semibold text-muted mb-1.5">{t("plan_name")}</label>
                <input
                  type="text"
                  value={editClientName}
                  onChange={(e) => setEditClientName(e.target.value)}
                  className="w-full bg-bg/40 border border-bordercolor rounded-lg px-3 py-2 text-xs text-textcolor outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-[0.68rem] uppercase tracking-wider font-semibold text-muted mb-1.5">{t("plan_email")}</label>
                <input
                  type="email"
                  value={editClientEmail}
                  onChange={(e) => setEditClientEmail(e.target.value)}
                  className="w-full bg-bg/40 border border-bordercolor rounded-lg px-3 py-2 text-xs text-textcolor outline-none focus:border-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-[0.68rem] uppercase tracking-wider font-semibold text-muted mb-1.5">{t("plan_notes")}</label>
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                className="w-full min-h-[80px] bg-bg/40 border border-bordercolor rounded-lg px-3 py-2 text-xs text-textcolor outline-none focus:border-accent resize-y"
              />
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleSaveEdit}
              className={`w-full py-2 border text-xs font-semibold uppercase tracking-wider rounded-lg transition-all ${
                editSaveStatus
                  ? "bg-green-500/10 border-green-500/30 text-green-500"
                  : "bg-surface hover:bg-surface2 border-bordercolor text-textcolor"
              }`}
            >
              {editSaveStatus ? (
                <span className="flex items-center justify-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> {t("saved") === "saved" ? "Saved" : t("saved")}</span>
              ) : (t("save_changes") === "save_changes" ? "Save Changes" : t("save_changes"))}
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => handleApiBooking(editingDraft, "email")}
                disabled={bookingLoading}
                className="flex-1 py-2.5 bg-accent hover:opacity-90 text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-md shadow-accent/25 cursor-pointer disabled:opacity-50"
              >
                <Mail className="w-3.5 h-3.5" />
                {bookingLoading ? "..." : (t("book_via_email") || "Email")}
              </button>
              <button
                onClick={() => handleApiBooking(editingDraft, "whatsapp")}
                disabled={bookingLoading}
                className="flex-1 py-2.5 bg-[#25D366] hover:opacity-90 text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#25D366]/25 cursor-pointer disabled:opacity-50"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                {bookingLoading ? "..." : (t("book_via_whatsapp") || "WhatsApp")}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </>
  );
}
