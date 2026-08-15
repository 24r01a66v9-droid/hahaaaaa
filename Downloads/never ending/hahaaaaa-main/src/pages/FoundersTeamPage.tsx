import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { ChevronDown, ChevronUp, GripVertical, Instagram, Linkedin, Pencil, Plus, Trash2, X } from "lucide-react";
import { buildAuthRequestInit } from "../auth/fetchWithAuth";
import { useAuth } from "../context/AuthContext";
import { reorderMembersById } from "../components/teamUtils";

const STORAGE_KEY = "ikshana-leadership-members";
const LEADERSHIP_RESET_KEY = "ikshana-leadership-reset-complete";

type LeadershipCategory = "founders" | "currentBoard" | "previousBoard";

interface LeadershipMember {
  id: string;
  name: string;
  role: string;
  tenure: string;
  bio: string;
  image: string;
  category: LeadershipCategory;
  displayOrder: number;
  linkedinUrl?: string;
  instagramUrl?: string;
}

const createAvatar = (name: string, accent: string) => {
  const label = name.split(" ").map((part) => part[0]).join("").slice(0, 2);
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240"><rect width="240" height="240" rx="40" fill="${accent}"/><circle cx="120" cy="96" r="46" fill="#fff7f2"/><path d="M56 196c12-34 42-52 64-52s52 18 64 52" fill="#fff7f2"/><text x="120" y="214" text-anchor="middle" font-family="Georgia, serif" font-size="26" fill="#7a1f2d">${label}</text></svg>`)}`;
};

export default function FoundersTeamPage() {
  const { user } = useAuth();
  const normalizedRole = user?.role?.toLowerCase();
  const isAdmin = Boolean(
    normalizedRole === "admin" || (user?.email && user.email === "24r01a66v9@cmrithyderabad.edu.in")
  );

  const [leadershipMembers, setLeadershipMembers] = useState<LeadershipMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [viewMoreByCategory, setViewMoreByCategory] = useState<Record<LeadershipCategory, boolean>>({ founders: false, currentBoard: false, previousBoard: false });
  const [draggedMemberId, setDraggedMemberId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    role: "",
    tenure: "",
    bio: "",
    linkedinUrl: "",
    instagramUrl: "",
    category: "founders" as LeadershipCategory,
  });

  const fetchLeadershipMembers = async () => {
    try {
      const response = await fetch("/api/leadership-members");
      if (response.ok) {
        const data: any[] = await response.json();
        if (Array.isArray(data)) {
          const mapped: LeadershipMember[] = data.map((item, index) => {
            const category: LeadershipCategory =
              item.category === "founders" || item.category === "currentBoard" || item.category === "previousBoard"
                ? item.category
                : "founders";

            const rawBio = typeof item.bio === "string" ? item.bio.trim() : "";
            return {
              id: String(item.id),
              name: item.name || "Leadership Member",
              role: item.role || (category === "founders" ? "Founder" : category === "previousBoard" ? "Former Board Member" : "Executive Board Member"),
              tenure: item.tenure || "2026",
              bio: rawBio,
              image: item.image || createAvatar(item.name || "Member", "#8b1d3b"),
              category,
              displayOrder: Number(item.display_order ?? index + 1),
              linkedinUrl: item.linkedin_url || item.linkedinUrl || undefined,
              instagramUrl: item.instagram_url || item.instagramUrl || undefined,
            };
          });

          setLeadershipMembers(mapped);
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
          return;
        }
      }
    } catch (err) {
      console.error("Failed to fetch leadership members from DB:", err);
    } finally {
      setLoading(false);
    }

    const storedMembers = window.localStorage.getItem(STORAGE_KEY);
    if (storedMembers) {
      try {
        const parsed = JSON.parse(storedMembers) as LeadershipMember[];
        if (parsed.length > 0) {
          setLeadershipMembers(parsed);
          return;
        }
      } catch {}
    }
  };

  useEffect(() => {
    if (!showAddMemberForm || !isAdmin) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowAddMemberForm(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showAddMemberForm, isAdmin]);

  useEffect(() => {
    fetchLeadershipMembers();
  }, []);

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadedFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleAddMember = async (event: FormEvent) => {
    event.preventDefault();
    if (isSubmitting || !newMember.name.trim() || !newMember.role.trim()) return;

    setIsSubmitting(true);

    try {
      const targetDisplayOrder = editingMemberId
        ? leadershipMembers.find((item) => item.id === editingMemberId)?.displayOrder ?? 1
        : Math.max(0, ...leadershipMembers.map((item) => item.displayOrder)) + 1;

      const formData = new FormData();
      formData.append("name", newMember.name.trim());
      formData.append("role", newMember.role.trim());
      formData.append("tenure", newMember.tenure.trim() || "2026");
      formData.append("bio", newMember.bio.trim());
      formData.append("category", newMember.category);
      formData.append("display_order", String(targetDisplayOrder));
      formData.append("linkedin_url", newMember.linkedinUrl.trim());
      formData.append("instagram_url", newMember.instagramUrl.trim());

      if (!newMember.bio.trim()) {
        formData.set("bio", "");
      }

      if (uploadedFile) {
        formData.append("file", uploadedFile);
      } else if (previewImage) {
        formData.append("image", previewImage);
      }

      let dbIdToUpdate = editingMemberId;

      // If editing id is non-numeric, try resolving a numeric DB id from server before submitting
      if (editingMemberId && !/^\d+$/.test(editingMemberId)) {
        try {
          const resp = await fetch("/api/leadership-members");
          if (resp.ok) {
            const list: any[] = await resp.json();
            const match = list.find((m) => m.name === newMember.name.trim() && m.category === newMember.category && /^\d+$/.test(String(m.id)));
            if (match && match.id) dbIdToUpdate = String(match.id);
          }
        } catch (err) {
          console.error("Failed to resolve DB id before submit:", err);
        }
      }

      const isRealDbMember = Boolean(dbIdToUpdate && /^\d+$/.test(dbIdToUpdate));
      const url = isRealDbMember ? `/api/leadership-members/${dbIdToUpdate}` : "/api/leadership-members";
      const method = isRealDbMember ? "PATCH" : "POST";

      console.log("Submitting leadership member", { method, url, editingMemberId, dbIdToUpdate });
      const response = await fetch(url, buildAuthRequestInit({ method, body: formData }));

      if (!response.ok) {
        const bodyText = await response.text().catch(() => null);
        console.error("Leadership member save failed", { status: response.status, body: bodyText });
        const errorData = bodyText ? (() => { try { return JSON.parse(bodyText); } catch { return { error: bodyText }; } })() : {};
        alert(errorData.error || `Failed to save (${response.status})`);
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API request failed:", errorData);
      }

      setShowAddMemberForm(false);
      setEditingMemberId(null);
      setUploadedFile(null);
      setPreviewImage(null);
      setNewMember({ name: "", role: "", tenure: "", bio: "", linkedinUrl: "", instagramUrl: "", category: "founders" });

      await fetchLeadershipMembers();
    } catch (error) {
      console.error("Failed to save leadership member to DB", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditMember = async (member: LeadershipMember) => {
    let dbId = member.id;
    if (!/^\d+$/.test(member.id)) {
      try {
        const resp = await fetch("/api/leadership-members");
        if (resp.ok) {
          const list: any[] = await resp.json();
          const match = list.find((m) => m.name === member.name && m.category === member.category && /^\d+$/.test(String(m.id)));
          if (match && match.id) dbId = String(match.id);
        }
      } catch (err) {
        console.error("Failed to resolve DB id for member edit:", err);
      }
    }

    setEditingMemberId(dbId);
    setNewMember({
      name: member.name,
      role: member.role,
      tenure: member.tenure,
      bio: member.bio,
      linkedinUrl: member.linkedinUrl ?? "",
      instagramUrl: member.instagramUrl ?? "",
      category: member.category,
    });
    setPreviewImage(member.image);
    setUploadedFile(null);
    setShowAddMemberForm(true);
  };

  const handleDeleteMember = async (memberId: string) => {
    const targetMember = leadershipMembers.find((item) => item.id === memberId);
    
    // Optimistic UI update
    const updated = leadershipMembers.filter((item) => item.id !== memberId);
    const sorted = updated.slice().sort((a, b) => a.displayOrder - b.displayOrder);
    setLeadershipMembers(sorted);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));

    if (/^\d+$/.test(memberId)) {
      try {
        await fetch(`/api/leadership-members/${memberId}`, buildAuthRequestInit({ method: "DELETE" }));
      } catch (err) {
        console.error("Failed to delete leadership member from DB", err);
      }
    } else if (targetMember) {
      // If temporary string ID, find matching DB row by name and category and delete it
      try {
        const resp = await fetch("/api/leadership-members");
        if (resp.ok) {
          const list: any[] = await resp.json();
          const match = list.find((item) => item.name === targetMember.name && item.category === targetMember.category);
          if (match && match.id) {
            await fetch(`/api/leadership-members/${match.id}`, buildAuthRequestInit({ method: "DELETE" }));
          }
        }
      } catch (err) {
        console.error("Failed to delete matching leadership member from DB", err);
      }
    }
  };

  const handleReorderMembers = async (draggedId: string, targetId: string) => {
    const draggedMember = leadershipMembers.find((member) => member.id === draggedId);
    const targetMember = leadershipMembers.find((member) => member.id === targetId);

    if (!draggedMember || !targetMember || draggedMember.category !== targetMember.category) {
      setDraggedMemberId(null);
      setDropTargetId(null);
      return;
    }

    const sameCategoryMembers = leadershipMembers.filter((member) => member.category === draggedMember.category);
    const reordered = reorderMembersById(sameCategoryMembers, draggedId, targetId);
    const reorderedById = new Map(reordered.map((member, index) => [member.id, { ...member, displayOrder: index + 1 }]));

    const updatedMembers = leadershipMembers.map((member) => reorderedById.get(member.id) ?? member);
    const sorted = updatedMembers.slice().sort((a, b) => a.displayOrder - b.displayOrder);

    setLeadershipMembers(sorted);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
    setDraggedMemberId(null);
    setDropTargetId(null);

    // Sync display orders with backend DB
    for (const member of reordered) {
      if (/^\d+$/.test(member.id)) {
        try {
          const newOrder = reorderedById.get(member.id)?.displayOrder;
          if (newOrder !== undefined) {
            await fetch(`/api/leadership-members/${member.id}`, buildAuthRequestInit({
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ display_order: newOrder }),
            }));
          }
        } catch (err) {
          console.error("Failed to sync reorder with DB:", err);
        }
      }
    }
  };



  const normalizeSocialUrl = (value: string) => {
    if (!value) return "";
    return value.startsWith("http://") || value.startsWith("https://") ? value : `https://${value}`;
  };

  const founders = leadershipMembers.filter((member) => member.category === "founders").sort((a, b) => a.displayOrder - b.displayOrder);
  const currentBoard = leadershipMembers.filter((member) => member.category === "currentBoard").sort((a, b) => a.displayOrder - b.displayOrder);
  const previousBoard = leadershipMembers.filter((member) => member.category === "previousBoard").sort((a, b) => a.displayOrder - b.displayOrder);
  const visibleMembers = (members: LeadershipMember[]) => members.slice(0, 4);

  const toggleViewMore = (category: LeadershipCategory) => {
    setViewMoreByCategory((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  return (
    <section className="min-h-screen bg-[#fffcfc] px-4 py-24 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <div className="flex items-center justify-between gap-4">
          <div />
          {isAdmin && (
            <button
              type="button"
              onClick={() => setShowAddMemberForm(true)}
              className="inline-flex items-center gap-2 rounded-full bg-brand-maroon px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-maroon/20 transition hover:bg-stone-900"
            >
              <Plus size={16} />
              Add Member
            </button>
          )}
        </div>

        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="rounded-[1.75rem] border border-brand-maroon/10 bg-white p-6 shadow-[0_30px_90px_-30px_rgba(91,63,212,0.28)] sm:p-8 lg:p-10"
        >
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#5B3FD4]">Our Founders & Team</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-brand-maroon sm:text-5xl">
              The passionate individuals behind our mission and the driving force of change.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-brand-maroon/70">
              Meet the people who lead with purpose, compassion, and a shared commitment to creating lasting impact.
            </p>
          </div>

          <div className="mt-10 space-y-8">
            {[
              { key: "founders", title: "Founders", subtitle: "The visionaries who started this journey", members: founders, emptyText: "founders" },
              { key: "currentBoard", title: "Executive Board", subtitle: "The leaders guiding our work today", members: currentBoard, emptyText: "executive board members" },
              { key: "previousBoard", title: "Previous Board", subtitle: "Former leaders who helped shape our journey", members: previousBoard, emptyText: "previous board members" },
            ].map((section) => {
              const showAll = viewMoreByCategory[section.key as LeadershipCategory];
              const visible = showAll ? section.members : section.members.slice(0, 4);

              return (
                <section key={section.key} className="rounded-[1.5rem] border border-brand-maroon/10 bg-gradient-to-br from-[#fdfcff] via-white to-[#f6f2ff] p-4 shadow-[0_20px_60px_-30px_rgba(91,63,212,0.2)] sm:p-5">
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-2xl font-semibold text-brand-maroon">{section.title}</h2>
                      <p className="text-sm text-brand-maroon/60">{section.subtitle}</p>
                    </div>
                    {section.members.length > 4 && (
                      <button
                        type="button"
                        onClick={() => toggleViewMore(section.key as LeadershipCategory)}
                        className="inline-flex items-center gap-2 rounded-full border border-[#5B3FD4]/20 bg-[#5B3FD4]/5 px-4 py-2 text-sm font-semibold text-[#5B3FD4] transition hover:bg-[#5B3FD4] hover:text-white"
                      >
                        {showAll ? "Show Less" : "View More"}
                        {showAll ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    )}
                  </div>

                  {section.members.length === 0 ? (
                    <div className="rounded-[1rem] border border-dashed border-brand-maroon/20 bg-white/70 p-4 text-sm text-brand-maroon/70">
                      No {section.emptyText} added yet.
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
                      {visible.map((person) => {
                        const isDragged = draggedMemberId === person.id;
                        const isDropTarget = dropTargetId === person.id;
                        return (
                          <motion.article
                            key={person.id}
                            initial={{ y: 18, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            whileHover={{ y: -6, scale: 1.01, boxShadow: "0 18px 45px -25px rgba(91,63,212,0.35)" }}
                            transition={{ type: "spring", stiffness: 220, damping: 18 }}
                            draggable={isAdmin}
                            onDragStart={(event) => {
                              const dragEvent = event as unknown as { dataTransfer?: DataTransfer | null };
                              setDraggedMemberId(person.id);
                              setDropTargetId(person.id);
                              if (dragEvent.dataTransfer) {
                                dragEvent.dataTransfer.effectAllowed = "move";
                                dragEvent.dataTransfer.setData("application/ikshana-member-id", person.id);
                                dragEvent.dataTransfer.setData("text/plain", person.id);
                              }
                            }}
                            onDragEnter={(event) => {
                              event.preventDefault();
                              setDropTargetId(person.id);
                            }}
                            onDragOver={(event) => {
                              const dragEvent = event as unknown as { dataTransfer?: DataTransfer | null };
                              event.preventDefault();
                              if (dragEvent.dataTransfer) {
                                dragEvent.dataTransfer.dropEffect = "move";
                              }
                              setDropTargetId(person.id);
                            }}
                            onDrop={(event) => {
                              const dragEvent = event as unknown as { dataTransfer?: DataTransfer | null };
                              event.preventDefault();
                              event.stopPropagation();
                              const draggedId = dragEvent.dataTransfer
                                ? dragEvent.dataTransfer.getData("application/ikshana-member-id") || dragEvent.dataTransfer.getData("text/plain") || draggedMemberId
                                : draggedMemberId;
                              if (draggedId && draggedId !== person.id) {
                                handleReorderMembers(draggedId, person.id);
                              } else {
                                setDraggedMemberId(null);
                                setDropTargetId(null);
                              }
                            }}
                            onDragEnd={() => {
                              setDraggedMemberId(null);
                              setDropTargetId(null);
                            }}
                            className={`flex h-full min-h-[290px] flex-col rounded-[1.6rem] border border-brand-maroon/10 bg-white p-5 shadow-[0_12px_35px_-18px_rgba(91,63,212,0.25)] transition-all ${isDragged ? "scale-[0.98] opacity-50" : ""} ${isDropTarget ? "border-[#5B3FD4] ring-2 ring-[#5B3FD4]/20" : ""} ${isAdmin ? "cursor-grab active:cursor-grabbing" : ""}`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-4">
                                <img src={person.image} alt={person.name} className="h-[140px] w-[140px] rounded-full border-4 border-[#5B3FD4]/10 object-cover shadow-lg sm:h-[152px] sm:w-[152px]" />
                                <div className="min-w-0">
                                  <h3 className="text-lg font-semibold text-brand-maroon">{person.name}</h3>
                                  <p className="mt-1 text-sm font-semibold text-[#2d1620]">{person.role}</p>
                                </div>
                              </div>
                              {isAdmin && (
                                <div className="flex shrink-0 flex-col gap-2">
                                  <div className="flex items-center justify-center rounded-full border border-dashed border-[#5B3FD4]/20 bg-[#5B3FD4]/5 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#5B3FD4]">
                                    <GripVertical size={12} />
                                    Drag
                                  </div>
                                  <button type="button" onClick={() => handleEditMember(person)} className="rounded-full border border-brand-maroon/10 p-2 text-brand-maroon transition hover:bg-brand-maroon hover:text-white" title="Edit">
                                    <Pencil size={14} />
                                  </button>
                                  <button type="button" onClick={() => handleDeleteMember(person.id)} className="rounded-full border border-brand-maroon/10 p-2 text-brand-maroon transition hover:bg-brand-maroon hover:text-white" title="Delete">
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              )}
                            </div>

                            {person.bio ? (
                              <p className="mt-4 text-sm leading-6 text-brand-maroon/70">{person.bio}</p>
                            ) : null}

                            <div className="mt-5 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2 text-[#5B3FD4]">
                                {person.linkedinUrl && (
                                  <a href={normalizeSocialUrl(person.linkedinUrl)} target="_blank" rel="noreferrer" className="rounded-full border border-[#5B3FD4]/15 p-2 transition hover:bg-[#5B3FD4] hover:text-white" aria-label={`Visit ${person.name}'s LinkedIn`}>
                                    <Linkedin size={16} />
                                  </a>
                                )}
                                {person.instagramUrl && (
                                  <a href={normalizeSocialUrl(person.instagramUrl)} target="_blank" rel="noreferrer" className="rounded-full border border-[#5B3FD4]/15 p-2 transition hover:bg-[#5B3FD4] hover:text-white" aria-label={`Visit ${person.name}'s Instagram`}>
                                    <Instagram size={16} />
                                  </a>
                                )}
                              </div>
                              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-maroon/40">{person.tenure}</span>
                            </div>

                          </motion.article>
                        );
                      })}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </motion.div>
      </div>

      {showAddMemberForm && isAdmin && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-stone-900/70 p-3 sm:p-4"
          onClick={() => setShowAddMemberForm(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] bg-white p-5 shadow-2xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 z-10 mb-6 flex items-center justify-between gap-4 rounded-2xl border border-brand-maroon/10 bg-white/90 px-2 py-2 backdrop-blur">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-maroon/40">Admin</p>
                <h3 className="text-2xl font-serif text-brand-maroon">{editingMemberId ? "Update leadership member" : "Add leadership member"}</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddMemberForm(false)}
                className="inline-flex items-center gap-2 rounded-full border border-brand-maroon/15 bg-white px-3 py-2 text-sm font-semibold text-brand-maroon transition hover:bg-brand-maroon hover:text-white"
                aria-label="Close form"
              >
                <X size={16} />
                Close
              </button>
            </div>
            <form onSubmit={handleAddMember} className="grid gap-4">
              <select
                value={newMember.category}
                onChange={(event) => setNewMember({ ...newMember, category: event.target.value as LeadershipCategory })}
                className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3"
              >
                <option value="founders">Founders</option>
                <option value="currentBoard">Current Executive Board</option>
                <option value="previousBoard">Previous Boards</option>
              </select>
              <input value={newMember.name} onChange={(event) => setNewMember({ ...newMember, name: event.target.value })} placeholder="Name" className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3" required />
              <input value={newMember.role} onChange={(event) => setNewMember({ ...newMember, role: event.target.value })} placeholder="Role" className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3" required />
              <input value={newMember.tenure} onChange={(event) => setNewMember({ ...newMember, tenure: event.target.value })} placeholder="Tenure year" className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3" />
              <input value={newMember.linkedinUrl} onChange={(event) => setNewMember({ ...newMember, linkedinUrl: event.target.value })} placeholder="LinkedIn URL (optional)" className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3" />
              <input value={newMember.instagramUrl} onChange={(event) => setNewMember({ ...newMember, instagramUrl: event.target.value })} placeholder="Instagram URL (optional)" className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3" />
              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                <label className="mb-2 block text-sm font-semibold text-brand-maroon">Upload image</label>
                <input type="file" accept="image/*" onChange={handleImageSelect} className="w-full text-sm text-stone-500" />
                {previewImage && <img src={previewImage} alt="Preview" className="mt-3 h-24 w-24 rounded-full border-4 border-brand-maroon/10 object-cover" />}
              </div>
              <textarea value={newMember.bio} onChange={(event) => setNewMember({ ...newMember, bio: event.target.value })} placeholder="Short bio" className="min-h-24 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3" />
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddMemberForm(false)}
                  className="rounded-2xl border border-brand-maroon/15 px-4 py-3 font-semibold text-brand-maroon transition hover:bg-brand-maroon/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`rounded-2xl bg-brand-maroon px-4 py-3 font-semibold text-white transition ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-stone-900"}`}
                >
                  {isSubmitting ? "Saving..." : editingMemberId ? "Update Member" : "Save Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
