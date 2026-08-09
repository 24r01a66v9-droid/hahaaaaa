import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { ChevronDown, ChevronUp, GripVertical, Pencil, Plus, Trash2, X } from "lucide-react";
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
  image: string;
  category: LeadershipCategory;
  displayOrder: number;
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
  const [newMember, setNewMember] = useState({
    name: "",
    role: "",
    category: "founders" as LeadershipCategory,
  });

  const fetchLeadershipMembers = async () => {
    try {
      const response = await fetch("/api/leadership-members");
      if (response.ok) {
        const members: any[] = await response.json();
        if (Array.isArray(members) && members.length > 0) {
          const mapped: LeadershipMember[] = members.map((item, index) => {
            const rawCategory = (item.category || "").trim();
            let category: LeadershipCategory;

            if (rawCategory === "founders" || rawCategory === "previousBoard" || rawCategory === "currentBoard") {
              category = rawCategory as LeadershipCategory;
            } else {
              category = "currentBoard";
            }

            return {
              id: String(item.id),
              name: item.name || "Leadership Member",
              role: item.role || (category === "founders" ? "Founder" : category === "previousBoard" ? "Former Board Member" : "Executive Board Member"),
              image: item.image || createAvatar(item.name || "Member", "#8b1d3b"),
              category,
              displayOrder: typeof item.displayOrder === "number" ? item.displayOrder : (index + 1),
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
    if (!newMember.name.trim() || !newMember.role.trim()) return;

    try {
      const isEditing = Boolean(editingMemberId && /^\d+$/.test(editingMemberId));
      const requestInit = uploadedFile
        ? (() => {
            const formData = new FormData();
            formData.append("file", uploadedFile);
            formData.append("name", newMember.name.trim());
            formData.append("role", newMember.role.trim());
            formData.append("category", newMember.category);
            return buildAuthRequestInit({
              method: isEditing ? "PATCH" : "POST",
              body: formData,
            });
          })()
        : buildAuthRequestInit({
            method: isEditing ? "PATCH" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: newMember.name.trim(),
              role: newMember.role.trim(),
              category: newMember.category,
            }),
          });

      const response = await fetch(isEditing ? `/api/leadership-members/${editingMemberId}` : "/api/leadership-members", requestInit);

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Unknown error";
        try {
          const parsed = JSON.parse(errorText);
          errorMessage = parsed?.error || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        alert(`Member save failed: ${errorMessage}`);
        return;
      }

      const result = await response.json().catch(() => ({}));
      const savedImage = result?.member?.image || "";
      if (savedImage) {
        setPreviewImage(savedImage);
      }
    } catch (error) {
      console.error("Failed to save leadership member", error);
      alert(`Member save failed: ${error instanceof Error ? error.message : "Please try again."}`);
      return;
    }

    const member: LeadershipMember = {
      id: editingMemberId || `${newMember.category}-${Date.now()}`,
      name: newMember.name.trim(),
      role: newMember.role.trim(),
      image: previewImage || createAvatar(newMember.name.trim(), "#8b1d3b"),
      category: newMember.category,
      displayOrder: editingMemberId
        ? leadershipMembers.find((item) => item.id === editingMemberId)?.displayOrder ?? 0
        : Math.max(0, ...leadershipMembers.map((item) => item.displayOrder)) + 1,
    };

    const updated = editingMemberId
      ? leadershipMembers.map((item) => (item.id === editingMemberId ? member : item))
      : [...leadershipMembers, member];

    const sorted = updated.slice().sort((a, b) => a.displayOrder - b.displayOrder);
    setLeadershipMembers(sorted);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
    setShowAddMemberForm(false);
    setEditingMemberId(null);
    setUploadedFile(null);
    setPreviewImage(null);
    setNewMember({ name: "", role: "", category: "founders" });
  };

  const handleEditMember = (member: LeadershipMember) => {
    setEditingMemberId(member.id);
    setNewMember({
      name: member.name,
      role: member.role,
      category: member.category,
    });
    setPreviewImage(member.image);
    setUploadedFile(null);
    setShowAddMemberForm(true);
  };

  const handleDeleteMember = async (memberId: string) => {
    if (/^\d+$/.test(memberId)) {
      try {
        await fetch(`/api/leadership-members/${memberId}`, buildAuthRequestInit({ method: "DELETE" }));
      } catch (err) {
        console.error("Failed to delete leadership member from DB", err);
      }
    }
    const updated = leadershipMembers.filter((item) => item.id !== memberId);
    const sorted = updated.slice().sort((a, b) => a.displayOrder - b.displayOrder);
    setLeadershipMembers(sorted);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
  };

  const handleReorderMembers = (draggedId: string, targetId: string) => {
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
          <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-brand-maroon/15 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-maroon transition hover:bg-brand-maroon hover:text-white">
            ← Back to Home
          </Link>
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
          className="rounded-[2.5rem] border border-brand-maroon/10 bg-white p-8 shadow-[0_30px_90px_-30px_rgba(91,63,212,0.28)] sm:p-10 lg:p-12"
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
                <section key={section.key} className="rounded-[2rem] border border-brand-maroon/10 bg-gradient-to-br from-[#fdfcff] via-white to-[#f6f2ff] p-5 shadow-[0_20px_60px_-30px_rgba(91,63,212,0.2)] sm:p-6">
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
                    <div className="rounded-[1.25rem] border border-dashed border-brand-maroon/20 bg-white/70 p-6 text-sm text-brand-maroon/70">
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
                <option value="currentBoard">Executive Board</option>
                <option value="previousBoard">Previous Executive Board</option>
              </select>
              <input value={newMember.name} onChange={(event) => setNewMember({ ...newMember, name: event.target.value })} placeholder="Name" className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3" required />
              <input value={newMember.role} onChange={(event) => setNewMember({ ...newMember, role: event.target.value })} placeholder="Role" className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3" required />
              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                <label className="mb-2 block text-sm font-semibold text-brand-maroon">Upload image</label>
                <input type="file" accept="image/*" onChange={handleImageSelect} className="w-full text-sm text-stone-500" />
                {previewImage && <img src={previewImage} alt="Preview" className="mt-3 h-24 w-24 rounded-full border-4 border-brand-maroon/10 object-cover" />}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddMemberForm(false)}
                  className="rounded-2xl border border-brand-maroon/15 px-4 py-3 font-semibold text-brand-maroon transition hover:bg-brand-maroon/5"
                >
                  Cancel
                </button>
                <button type="submit" className="rounded-2xl bg-brand-maroon px-4 py-3 font-semibold text-white">
                  {editingMemberId ? "Update Member" : "Save Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
