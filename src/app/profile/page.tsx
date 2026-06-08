"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation, useAppStore, Draft } from "@/store";
import { Leaf, Landmark, Camera, Waves, Star, Calendar, Heart, Upload, FileImage, X, Send, CheckCircle2, MessageCircle, Edit2 } from "lucide-react";

// Image mapping for destinations in Sri Lanka to match Explore page
const DEST_IMAGES: Record<string, string> = {
  "Sigiriya": "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?q=80&w=800&auto=format&fit=crop",
  "Ella": "https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=800&auto=format&fit=crop",
  "Mirissa": "https://images.unsplash.com/photo-1542856391-010fb87dcfed?q=80&w=800&auto=format&fit=crop",
  "Kandy": "https://images.unsplash.com/photo-1620619730591-e4064506c9a2?q=80&w=800&auto=format&fit=crop",
  "Galle Fort": "https://images.unsplash.com/photo-1588598126852-d7b4d994141d?q=80&w=800&auto=format&fit=crop",
  "Yala National Park": "https://images.unsplash.com/photo-1581888227599-779811939961?q=80&w=800&auto=format&fit=crop",
  "Nuwara Eliya": "https://images.unsplash.com/photo-1545249390-6bdfa286032f?q=80&w=800&auto=format&fit=crop",
  "Trincomalee": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop",
  "Anuradhapura": "https://images.unsplash.com/photo-1565463690623-e18e390cbf37?q=80&w=800&auto=format&fit=crop",
  "Polonnaruwa": "https://images.unsplash.com/photo-1578593139888-39622e207264?q=80&w=800&auto=format&fit=crop",
  "Dambulla": "https://images.unsplash.com/photo-1627589704256-df3029f6de34?q=80&w=800&auto=format&fit=crop",
  "Arugam Bay": "https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=800&auto=format&fit=crop",
  "Horton Plains": "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=800&auto=format&fit=crop",
  "Adams Peak": "https://images.unsplash.com/photo-1563968743333-044cef800494?q=80&w=800&auto=format&fit=crop",
  "Bentota": "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?q=80&w=800&auto=format&fit=crop",
  "Hikkaduwa": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop",
  "Pinnawala": "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?q=80&w=800&auto=format&fit=crop",
  "Knuckles Range": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop",
  "Jaffna": "https://images.unsplash.com/photo-1568849676085-51415703900f?q=80&w=800&auto=format&fit=crop",
  "Wilpattu": "https://images.unsplash.com/photo-1456926631375-92c8ce872def?q=80&w=800&auto=format&fit=crop",
  "Kalpitiya": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop"
};

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop";

export default function Profile() {
  const { t } = useTranslation();
  const { drafts, wishlist, reviews, toggleWishlist, updateDraftStatus, updateDraft, user } = useAppStore();

  // User details fallback
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || "Traveller";
  const userEmail = user?.email || "Colombo, Sri Lanka";
  const userInitial = userName.charAt(0).toUpperCase();

  // Receipt upload state for profile modal
  const [receiptDraft, setReceiptDraft] = useState<string | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [receiptNotes, setReceiptNotes] = useState("");
  const [receiptSubmitted, setReceiptSubmitted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Edit Draft States
  const [editingDraft, setEditingDraft] = useState<Draft | null>(null);
  const [editDestinations, setEditDestinations] = useState<string>("");
  const [editDuration, setEditDuration] = useState<number>(10);
  const [editCompanions, setEditCompanions] = useState<string>("");
  const [editNotes, setEditNotes] = useState<string>("");
  const [editClientName, setEditClientName] = useState<string>("");
  const [editClientEmail, setEditClientEmail] = useState<string>("");
  const [editSaveStatus, setEditSaveStatus] = useState<boolean>(false);

  const GUIDE_EMAIL = "serandibtours@gmail.com";
  const GUIDE_WHATSAPP = "+94705836005";

  const startEditing = (draft: Draft) => {
    setEditingDraft(draft);
    setEditDestinations((draft.destinations || []).join(", "));
    setEditDuration(draft.duration || 10);
    setEditCompanions(draft.companions || "");
    setEditNotes(draft.specialNotes || "");
    setEditClientName(draft.clientName || "");
    setEditClientEmail(draft.clientEmail || "");
    setEditSaveStatus(false);
  };

  const handleSaveEdit = () => {
    if (!editingDraft) return;
    const name = `Custom ${editDuration}-Day Journey`;
    updateDraft(editingDraft.id, {
      destinations: editDestinations.split(",").map(d => d.trim()).filter(Boolean),
      duration: editDuration,
      companions: editCompanions,
      specialNotes: editNotes,
      clientName: editClientName,
      clientEmail: editClientEmail,
      name,
    });
    setEditingDraft({
      ...editingDraft,
      destinations: editDestinations.split(",").map(d => d.trim()).filter(Boolean),
      duration: editDuration,
      companions: editCompanions,
      specialNotes: editNotes,
      clientName: editClientName,
      clientEmail: editClientEmail,
      name,
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

  const handleWhatsAppBooking = (draft: Draft) => {
    const text = encodeURIComponent(`Hi! I'd like to book a tour from my saved drafts.\n\n${getDraftBookingSummary(draft)}`);
    window.open(`https://wa.me/${GUIDE_WHATSAPP.replace(/\+/g, "").replace(/\s/g, "")}?text=${text}`, "_blank");
  };

  const handleEmailBooking = (draft: Draft) => {
    const subject = encodeURIComponent(`Tour Booking Request — ${draft.name}`);
    const body = encodeURIComponent(getDraftBookingSummary(draft));
    window.open(`mailto:${GUIDE_EMAIL}?subject=${subject}&body=${body}`, "_blank");
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
    if (!receiptDraft) return;
    const selectedDraftObj = drafts.find(d => d.id === receiptDraft || d.name === receiptDraft);
    const draftName = selectedDraftObj ? selectedDraftObj.name : receiptDraft;
    const subject = encodeURIComponent(`Payment Receipt — ${draftName}`);
    const body = encodeURIComponent(
      `Please find my payment receipt attached.\n\nFile: ${receiptFile?.name || "N/A"}\n${receiptNotes ? `Notes: ${receiptNotes}` : ""}\n\nBooking: ${draftName}`
    );
    window.open(`mailto:${GUIDE_EMAIL}?subject=${subject}&body=${body}`, "_blank");
    updateDraftStatus(receiptDraft, "completed");
    setReceiptSubmitted(true);
  };

  const closeReceiptModal = () => {
    setReceiptDraft(null);
    setReceiptFile(null);
    setReceiptPreview(null);
    setReceiptNotes("");
    setReceiptSubmitted(false);
  };

  // Filter reviews written by the client
  const myReviews = reviews.filter((r) => r.isMine || r.name === 'Aanya Sharma');

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
                <span className="text-[0.62rem] bg-accentdim/20 text-accent px-2 py-0.5 rounded font-bold uppercase">{drafts.length} {t("Drafts")}</span>
              </div>
              
              {drafts.length > 0 ? (
                <div className="divide-y divide-bordercolor">
                  {drafts.map((d, i) => (
                    <div key={d.id || i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 text-xs text-textcolor first:pt-0 last:pb-0 gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-medium truncate">{d.name}</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[0.58rem] tracking-wider font-bold uppercase shrink-0 ${
                          d.status === "completed"
                            ? "bg-accentdim/20 text-accent border border-accent/20"
                            : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                        }`}>
                          {d.status === "completed" ? t("status_completed") : t("status_pending")}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-muted flex items-center gap-1.5 text-[0.68rem]">
                          <Calendar className="w-3.5 h-3.5 text-accent" /> {d.date}
                        </span>
                        {d.status === "pending" && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => startEditing(d)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[0.6rem] font-bold uppercase tracking-wider border border-bordercolor hover:border-accent text-textcolor hover:text-accent cursor-pointer transition-all"
                            >
                              <Edit2 className="w-2.5 h-2.5" /> {t("Edit & Book") || "Edit & Book"}
                            </button>
                            <button
                              onClick={() => setReceiptDraft(d.id || d.name)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[0.6rem] font-bold uppercase tracking-wider bg-accent hover:opacity-85 text-white cursor-pointer transition-all"
                            >
                              <Upload className="w-3 h-3" /> {t("complete_booking")}
                            </button>
                          </div>
                        )}
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
                <div className="flex items-center justify-between py-3 text-xs md:text-sm first:pt-0">
                  <span className="font-medium text-textcolor">{t("Cultural Heritage Circuit (10 Days)")}</span>
                  <span className="inline-flex px-2.5 py-0.5 rounded text-[0.62rem] tracking-wider font-bold border border-accent/20 text-accent bg-accentdim/15 uppercase">{t("Done")}</span>
                </div>
                <div className="flex items-center justify-between py-3 text-xs md:text-sm last:pb-0">
                  <span className="font-medium text-textcolor">{t("Southern Coastal Retreat (7 Days)")}</span>
                  <span className="inline-flex px-2.5 py-0.5 rounded text-[0.62rem] tracking-wider font-bold border border-accent/20 text-accent bg-accentdim/15 uppercase">{t("Done")}</span>
                </div>
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
                  const imageSrc = DEST_IMAGES[w] || DEFAULT_IMAGE;
                  return (
                    <div 
                      key={w} 
                      className="group bg-bg border border-bordercolor rounded-xl overflow-hidden p-3.5 flex gap-4 items-center justify-between hover:border-accent/40 transition-colors"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Little square thumbnail image */}
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-surface">
                          <img src={imageSrc} alt={w} className="w-full h-full object-cover" />
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

            {/* Drop zone */}
            <div
              className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-all cursor-pointer mb-3 ${isDragging ? "border-accent bg-accentdim/10" : "border-bordercolor hover:border-accent/40"
                }`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const file = e.dataTransfer.files[0];
                if (file) handleReceiptFile(file);
              }}
              onClick={() => document.getElementById("profileReceiptInput")?.click()}
            >
              <input
                id="profileReceiptInput"
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
                disabled={!receiptFile}
                onClick={handleReceiptSubmit}
                className={`flex-1 py-2.5 text-white text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all ${receiptFile
                  ? "bg-accent hover:opacity-85 shadow-md shadow-accent/25"
                  : "bg-muted/30 text-muted cursor-not-allowed"
                  }`}
              >
                <Send className="w-3 h-3" />
                {t("receipt_submit")}
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
            <h3 className="font-serif text-xl text-textcolor">{t("edit_draft_title") || "Edit Trip Draft"}</h3>
            <button onClick={() => setEditingDraft(null)} className="text-muted hover:text-textcolor transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 mb-6 text-left">
            <div>
              <label className="block text-[0.68rem] uppercase tracking-wider font-semibold text-muted mb-1.5">{t("destinations") || "Destinations (comma-separated)"}</label>
              <input
                type="text"
                value={editDestinations}
                onChange={(e) => setEditDestinations(e.target.value)}
                className="w-full bg-bg/40 border border-bordercolor rounded-lg px-3 py-2 text-xs text-textcolor outline-none focus:border-accent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[0.68rem] uppercase tracking-wider font-semibold text-muted mb-1.5">{t("duration_days") || "Duration (Days)"}</label>
                <input
                  type="number"
                  value={editDuration}
                  onChange={(e) => setEditDuration(parseInt(e.target.value) || 0)}
                  className="w-full bg-bg/40 border border-bordercolor rounded-lg px-3 py-2 text-xs text-textcolor outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-[0.68rem] uppercase tracking-wider font-semibold text-muted mb-1.5">{t("companions") || "Companions"}</label>
                <input
                  type="text"
                  value={editCompanions}
                  onChange={(e) => setEditCompanions(e.target.value)}
                  className="w-full bg-bg/40 border border-bordercolor rounded-lg px-3 py-2 text-xs text-textcolor outline-none focus:border-accent"
                  placeholder="e.g. 2 Adults, 1 Kid"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[0.68rem] uppercase tracking-wider font-semibold text-muted mb-1.5">{t("client_name") || "Your Name"}</label>
                <input
                  type="text"
                  value={editClientName}
                  onChange={(e) => setEditClientName(e.target.value)}
                  className="w-full bg-bg/40 border border-bordercolor rounded-lg px-3 py-2 text-xs text-textcolor outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-[0.68rem] uppercase tracking-wider font-semibold text-muted mb-1.5">{t("client_email") || "Your Email"}</label>
                <input
                  type="email"
                  value={editClientEmail}
                  onChange={(e) => setEditClientEmail(e.target.value)}
                  className="w-full bg-bg/40 border border-bordercolor rounded-lg px-3 py-2 text-xs text-textcolor outline-none focus:border-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-[0.68rem] uppercase tracking-wider font-semibold text-muted mb-1.5">{t("special_notes") || "Special Notes"}</label>
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
              {editSaveStatus ? (t("saved") || "Saved ✅") : (t("save_changes") || "Save Changes")}
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleWhatsAppBooking(editingDraft)}
                className="py-2.5 bg-[#25D366] hover:opacity-90 text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-md shadow-green-500/10 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                {t("book_via_whatsapp")}
              </button>
              <button
                onClick={() => handleEmailBooking(editingDraft)}
                className="py-2.5 bg-accent hover:opacity-90 text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-md shadow-accent/25 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                {t("book_via_email")}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </>
  );
}
