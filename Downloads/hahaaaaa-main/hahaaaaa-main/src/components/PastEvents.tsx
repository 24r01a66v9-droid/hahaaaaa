import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Palette, PenTool, Image as ImageIcon, Heart, ShieldCheck, X, Award, ArrowRight, Upload, Trash2, Camera } from "lucide-react";
import { buildAuthRequestInit } from "../auth/fetchWithAuth";
import { useAuth } from "../context/AuthContext";

interface EventPhoto {
  id: string;
  url: string;
  title?: string;
  caption?: string;
  is_featured: boolean;
}

interface Activity {
  name: string;
  icon: any;
  description: string;
}

interface Event {
  id?: string;
  title: string;
  date: string;
  occasion: string;
  description: string;
  activities: Activity[];
  acknowledgments?: string;
  image?: string | null;
}

const ADMIN_EMAILS = ["24r01a66v9@cmrithyderabad.edu.in"];

function getActivityIcon(icon: unknown) {
  if (typeof icon === "function") {
    return icon;
  }

  if (typeof icon === "string") {
    const normalized = icon.toLowerCase();
    switch (normalized) {
      case "pentool":
        return PenTool;
      case "heart":
        return Heart;
      case "shieldcheck":
        return ShieldCheck;
      case "award":
        return Award;
      case "imageicon":
        return ImageIcon;
      case "palette":
      default:
        return Palette;
    }
  }

  return Palette;
}

function normalizeActivities(activities: unknown): Activity[] {
  if (Array.isArray(activities)) {
    return activities.map((activity: any) => ({
      name: typeof activity?.name === "string" ? activity.name : "",
      icon: getActivityIcon(activity?.icon),
      description: typeof activity?.description === "string" ? activity.description : "",
    }));
  }

  if (typeof activities === "string") {
    return activities
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((activityLine) => ({
        name: activityLine,
        icon: Palette,
        description: activityLine,
      }));
  }

  return [];
}

export default function PastEvents() {
  const { user } = useAuth();
  const normalizedRole = user?.role?.toLowerCase();
  const isAdmin = Boolean(
    normalizedRole === "admin" ||
    (user?.email && ADMIN_EMAILS.includes(user.email))
  );
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventPhotos, setEventPhotos] = useState<EventPhoto[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadCaption, setUploadCaption] = useState("");
  const [showUploadOnOpen, setShowUploadOnOpen] = useState(false);
  const [editedEvents, setEditedEvents] = useState<Record<string, Event>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const saved = window.localStorage.getItem("ikshana_edited_events");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [deletedEventIds, setDeletedEventIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = window.localStorage.getItem("ikshana_deleted_events");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [serverEvents, setServerEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    occasion: "",
    description: "",
    acknowledgments: "",
    activities: "",
  });
  const [newEventUploadFile, setNewEventUploadFile] = useState<File | null>(null);
  const [newEventUploadCaption, setNewEventUploadCaption] = useState("");
  const newEventFileRef = useRef<HTMLInputElement>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingActivities, setEditingActivities] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUuid = () => {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    return `event-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString().slice(-4)}`;
  };

  const normalizeId = (text: string, index: number) =>
    `${text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")}-${index}`;

  const events: Event[] = [
    {
      title: "Donation Drive for World Cancer Awareness Day",
      date: "November 9th, 2024",
      occasion: "Cancer Awareness & Medical Support",
      description: "On November 9, 2024, Ikshana Student Organization hosted a donation drive on campus to raise funds for Bommu Lakhmi Garu, a patient suffering from a serious pulmonary disease. The event aimed to raise ₹3,000,000 but successfully garnered ₹40,000, showcasing strong support from students and faculty. Donation booths were set up across the campus, and engaging activities like tug of war, relay races, quiz competitions, and raffle draws were organized to encourage participation. The drive not only aimed to raise funds but also to raise awareness about cancer and related diseases.",
      activities: [
        {
          name: "Donation Booths",
          icon: Heart,
          description: "Multiple donation booths were strategically set up across the campus to collect contributions from students and faculty members."
        },
        {
          name: "Engaging Activities",
          icon: Palette,
          description: "Fun and competitive activities including tug of war, relay races, quiz competitions, and raffle draws were organized to encourage participation and raise funds."
        },
        {
          name: "Awareness Campaign",
          icon: ShieldCheck,
          description: "The drive raised awareness about cancer and related diseases, helping the college community understand the importance of health and support for medical causes."
        }
      ],
      acknowledgments: "Special thanks to all students and faculty who came forward to raise their helping hand for this noble cause. The overwhelming support raised ₹40,000 for Bommu Lakhmi Garu's medical treatment.",
      image: null
    },
    {
      title: "Visit to Gundla Pochampalley",
      date: "June 1st, 2024",
      occasion: "Educational Awareness & Community Support",
      description: "On June 1st, 2024, the Ikshana team visited Gundla Pochampalley village to promote the importance of education. They began by going door-to-door, educating families about the significance of children's education. Afterward, they gathered the children for engaging entertainment activities, including dance and singing performances, while reinforcing the value of learning. The team distributed chocolates and drinks to the children, followed by the distribution of essential stationery items such as books, pens, and other supplies to support their studies. The visit was a successful initiative that not only spread awareness about education but also brought joy and support to the community.",
      activities: [
        {
          name: "Door-to-Door Education",
          icon: Heart,
          description: "Team members visited homes in Gundla Pochampalley to educate families about the significance and importance of children's education."
        },
        {
          name: "Entertainment & Engagement",
          icon: Palette,
          description: "Organized engaging entertainment activities including dance and singing performances to keep children entertained while reinforcing the value of learning."
        },
        {
          name: "Distribution of Supplies",
          icon: ShieldCheck,
          description: "Distributed chocolates, drinks, and essential stationery items including books, pens, and other supplies to support children's educational pursuits."
        }
      ],
      acknowledgments: "Thanks to all 33 volunteers who participated in this initiative and helped spread awareness and support to the community.",
      image: null
    },
    {
      title: "Seasons of Care",
      date: "June 6th, 2026",
      occasion: "Weather Support & Community Relief",
      description: "Team Ikshana successfully conducted a seasonal donation drive titled 'Seasons of Care' from Secunderabad to Old Alwal with the objective of supporting individuals affected by extreme summer heat and the rainy season. The initiative focused on providing essential protective items to vulnerable communities, including street vendors, daily wage workers, elderly individuals, beggars, and people living in temporary roadside shelters. The team distributed umbrellas, raincoats, and other necessities to ensure better protection and comfort during changing weather conditions. Through this drive, Team Ikshana aimed to spread kindness, compassion, and hope while making a meaningful difference in the lives of those in need.",
      activities: [
        {
          name: "Distribution of Raincoats & Umbrellas",
          icon: Heart,
          description: "Distributed raincoats to elderly individuals, beggars, and daily wage workers. Donated large tent umbrellas to elderly street vendors and fruit sellers to help them continue their work under harsh weather conditions."
        },
        {
          name: "Outreach to Shelter Communities",
          icon: ShieldCheck,
          description: "Reached out to people living in roadside tents and temporary shelters who lacked proper protection from sun and rain, providing them with essential protective items."
        },
        {
          name: "Individual Support",
          icon: Heart,
          description: "Supported a financially struggling mother and her young daughter by providing them with slippers and other essential items after noticing their need."
        },
        {
          name: "Community Engagement",
          icon: Palette,
          description: "Interacted with numerous beneficiaries throughout the journey, ensuring assistance reached those who needed it most and creating moments of joy and human connection."
        }
      ],
      acknowledgments: "Team Ikshana extends heartfelt gratitude to all members who dedicated their time, effort, and resources to make the 'Seasons of Care' drive a success. Special thanks to the founders and leadership team whose continuous support, encouragement, and guidance played a crucial role in the successful execution of this initiative. We also thank every volunteer who actively participated in the drive and contributed towards creating a meaningful impact in the community, reinforcing the importance of social responsibility and compassion.",
      image: null
    },
    {
      title: "Go with the Flow",
      date: "August 30th, 2018",
      occasion: "Menstrual Health Awareness & Community Support",
      description: "Team IKSHANA has taken a significant step towards breaking societal taboos and fostering awareness with the impactful 'Go With The Flow' event on August 30th, 2018, dedicated to shedding light on menstruation and emphasizing the importance of donating sanitary napkins to girl orphanages. This initiative goes beyond conventional boundaries, seeking to educate and normalize conversations around menstrual health. The event serves as a platform for open discussions, dispelling myths and promoting a positive outlook on menstruation. By raising awareness about the challenges of access to hygienic menstrual products and addressing the crucial need for such access to hygiene in orphanages, the campaign encourages participants to contribute to the cause by donating sanitary napkins, emphasizing that small acts of kindness can profoundly impact the lives of young girls, ensuring their dignity, comfort, and overall well-being. 'Go With The Flow' not only marks a milestone in destigmatizing menstruation but also exemplifies Team IKSHANA's commitment to addressing fundamental issues with compassion and inclusivity.",
      activities: [
        {
          name: "Awareness & Education",
          icon: ShieldCheck,
          description: "Hosted open discussions about menstrual health, dispelling myths and misconceptions about menstruation while promoting a positive and informed outlook on this natural process."
        },
        {
          name: "Donation Drive",
          icon: Heart,
          description: "Organized a collection drive for sanitary napkins and other menstrual hygiene products to donate to girl orphanages, addressing the crucial need for hygienic menstrual product access."
        },
        {
          name: "Community Engagement",
          icon: Palette,
          description: "Encouraged participants to contribute to the cause, emphasizing how small acts of kindness can profoundly impact the lives of young girls, ensuring their dignity, comfort, and overall well-being."
        },
        {
          name: "Breaking Stigma",
          icon: Award,
          description: "Worked to destigmatize menstruation and create meaningful conversations around menstrual health, exemplifying Team IKSHANA's commitment to addressing fundamental social issues with compassion and inclusivity."
        }
      ],
      acknowledgments: "Special thanks to all Team IKSHANA members and volunteers who dedicated their efforts to make this important initiative a success. We extend our gratitude to everyone who participated in discussions, contributed to the donation drive, and helped break societal taboos around menstrual health. Together, we've demonstrated that compassion and awareness can transform lives and foster a more inclusive community.",
      image: null
    }
  ];

  const allEvents = [...events, ...serverEvents];

  const mergedEvents = allEvents.map((event, index) => ({
    ...event,
    id: event.id || normalizeId(event.title, index),
    activities: normalizeActivities(event.activities),
  }));

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setEventsLoading(true);
        const response = await fetch("/api/events");
        if (!response.ok) throw new Error("Failed to load events");
        const data = await response.json();
        const normalized = Array.isArray(data) ? data : [];
        setServerEvents(normalized as Event[]);
      } catch (error) {
        setEventsError("Unable to load event data right now.");
      } finally {
        setEventsLoading(false);
      }
    };

    loadEvents();
  }, []);

  useEffect(() => {
    if (!selectedEvent) return;
    fetchEventPhotos(selectedEvent.title);
  }, [selectedEvent]);

  useEffect(() => {
    if (selectedEvent && showUploadOnOpen) {
      // open file picker shortly after modal opens
      setTimeout(() => fileInputRef.current?.click(), 120);
      setShowUploadOnOpen(false);
    }
  }, [selectedEvent, showUploadOnOpen]);

  const fetchEventPhotos = async (title: string) => {
    try {
      setLoadingPhotos(true);
      setPhotoError(null);
      const response = await fetch(`/api/photos?sub_category=${encodeURIComponent(title)}`);
      if (!response.ok) throw new Error("Failed to load photos");
      const data = await response.json();
      setEventPhotos(Array.isArray(data) ? data : []);
    } catch (error) {
      setPhotoError("Unable to load event gallery right now.");
    } finally {
      setLoadingPhotos(false);
    }
  };

  const handleShowAddEvent = () => {
    setShowAddEventForm(true);
    setSaveMessage(null);
  };

  const handleNewEventChange = (field: string, value: string) => {
    setNewEvent((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditEventChange = (field: string, value: string) => {
    setEditingEvent((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const saveEditedEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    const updatedEvent = {
      ...editingEvent,
      activities: normalizeActivities(editingActivities),
    };

    setEditedEvents((prev) => ({ ...prev, [editingEvent.id!]: updatedEvent }));
    setEditingEvent(null);
    setEditingActivities("");
  };

  const createEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title.trim() || !newEvent.date.trim() || !newEvent.description.trim()) {
      alert("Please provide at least a title, date, and description for the new event.");
      return;
    }

    const newRecord = {
      title: newEvent.title.trim(),
      date: newEvent.date.trim(),
      occasion: newEvent.occasion.trim(),
      description: newEvent.description.trim(),
      acknowledgments: newEvent.acknowledgments.trim(),
      activities: normalizeActivities(newEvent.activities),
    };

    setServerEvents((prev) => [newRecord, ...prev]);
    // If admin attached a photo while creating this event, upload it to the event gallery
    if (isAdmin && newEventUploadFile) {
      try {
        const formData = new FormData();
        formData.append("file", newEventUploadFile);
        formData.append("title", newEventUploadCaption || newRecord.title);
        formData.append("category", "event");
        formData.append("sub_category", newRecord.title);
        formData.append("date", newRecord.date || new Date().toLocaleDateString());

        const resp = await fetch("/api/photos", buildAuthRequestInit({
          method: "POST",
          body: formData,
        }));

        if (!resp.ok) {
          const err = await resp.json().catch(() => null);
          console.error("New event photo upload failed", err);
        }
      } catch (err) {
        console.error("Failed to upload new event photo", err);
      }
    }

    setShowAddEventForm(false);
    setNewEvent({ title: "", date: "", occasion: "", description: "", acknowledgments: "", activities: "" });
    setNewEventUploadFile(null);
    setNewEventUploadCaption("");
  };

  const openEditEvent = (event: Event) => {
    if (!isAdmin) return;
    setEditingEvent(event);
    setEditingActivities(event.activities.map((activity) => `${activity.name}: ${activity.description}`).join("\n"));
  };

  const deleteEvent = async (eventId: string) => {
    if (!isAdmin) return;
    setDeletedEventIds((prev) => [...prev, eventId]);
    setServerEvents((prev) => prev.filter((event) => event.id !== eventId));
  };

  const handleEventPhotoUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !uploadFile || !selectedEvent || uploading) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("title", uploadCaption || selectedEvent.title);
    formData.append("category", "event");
    formData.append("sub_category", selectedEvent.title);
    formData.append("date", selectedEvent.date);

    try {
      const response = await fetch("/api/photos", buildAuthRequestInit({
        method: "POST",
        body: formData,
      }));

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Upload failed");
      }

      await fetchEventPhotos(selectedEvent.title);
      setUploadFile(null);
      setUploadCaption("");
    } catch (error) {
      console.error("Failed to upload event photo", error);
      alert(error instanceof Error ? error.message : "Failed to upload event photo");
    } finally {
      setUploading(false);
    }
  };

  return (
    <section id="past-events" className="py-24 px-6 bg-brand-cream min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-block mb-6 px-4 py-2 rounded-full bg-brand-maroon/10 text-brand-maroon text-[10px] font-bold uppercase tracking-[0.3em]">
            Past Events & Initiatives
          </div>
          <h1 className="text-5xl md:text-7xl font-serif text-brand-maroon leading-tight">
            Moments That Moved Us
          </h1>
          <p className="text-brand-maroon/75 text-lg md:text-xl max-w-3xl mx-auto mt-6 leading-relaxed">
            A collection of the initiatives, outreach programs, and celebrations that shaped our journey and strengthened our community.
          </p>
        </div>

        {isAdmin && (
          <div className="mb-12 flex justify-center">
            <button
              onClick={handleShowAddEvent}
              className="inline-flex items-center gap-2 rounded-full bg-brand-maroon px-8 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white shadow-lg shadow-brand-maroon/20 transition-all hover:bg-stone-900"
            >
              <Camera size={16} />
              Add New Event
            </button>
          </div>
        )}

        {showAddEventForm && (
          <form onSubmit={createEvent} className="mb-16 rounded-[2rem] border border-stone-200 bg-white p-8 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-2xl font-serif text-brand-maroon">Add New Event</h3>
              <button type="button" onClick={() => setShowAddEventForm(false)} className="text-stone-400 hover:text-brand-maroon">
                <X size={20} />
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <label className="block">
                <span className="text-sm text-brand-maroon uppercase tracking-[0.2em] font-bold">Title</span>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => handleNewEventChange("title", e.target.value)}
                  className="mt-2 w-full rounded-3xl border border-stone-200 px-4 py-3 text-sm text-brand-maroon focus:outline-none focus:border-brand-maroon"
                  placeholder="Event title"
                />
              </label>

              <label className="block">
                <span className="text-sm text-brand-maroon uppercase tracking-[0.2em] font-bold">Date</span>
                <input
                  type="text"
                  value={newEvent.date}
                  onChange={(e) => handleNewEventChange("date", e.target.value)}
                  className="mt-2 w-full rounded-3xl border border-stone-200 px-4 py-3 text-sm text-brand-maroon focus:outline-none focus:border-brand-maroon"
                  placeholder="e.g. July 20th, 2025"
                />
              </label>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <label className="block">
                <span className="text-sm text-brand-maroon uppercase tracking-[0.2em] font-bold">Occasion</span>
                <input
                  type="text"
                  value={newEvent.occasion}
                  onChange={(e) => handleNewEventChange("occasion", e.target.value)}
                  className="mt-2 w-full rounded-3xl border border-stone-200 px-4 py-3 text-sm text-brand-maroon focus:outline-none focus:border-brand-maroon"
                  placeholder="Brief occasion name"
                />
              </label>

              <label className="block">
                <span className="text-sm text-brand-maroon uppercase tracking-[0.2em] font-bold">Acknowledgments</span>
                <input
                  type="text"
                  value={newEvent.acknowledgments}
                  onChange={(e) => handleNewEventChange("acknowledgments", e.target.value)}
                  className="mt-2 w-full rounded-3xl border border-stone-200 px-4 py-3 text-sm text-brand-maroon focus:outline-none focus:border-brand-maroon"
                  placeholder="Optional note or thanks"
                />
              </label>
            </div>

            <label className="mt-6 block">
              <span className="text-sm text-brand-maroon uppercase tracking-[0.2em] font-bold">Description</span>
              <textarea
                value={newEvent.description}
                onChange={(e) => handleNewEventChange("description", e.target.value)}
                rows={4}
                className="mt-2 w-full rounded-3xl border border-stone-200 px-4 py-3 text-sm text-brand-maroon focus:outline-none focus:border-brand-maroon"
                placeholder="Detailed event description"
              />
            </label>

            {isAdmin && (
              <div className="mt-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-maroon">Attach Cover Photo (optional)</p>
                <div className="mt-3 flex items-center gap-4">
                  <div
                    className="flex cursor-pointer items-center gap-3 rounded-[1rem] border border-dashed border-stone-300 p-3 text-center transition hover:border-brand-maroon/40"
                    onClick={() => newEventFileRef.current?.click()}
                  >
                    {newEventUploadFile ? (
                      <img src={URL.createObjectURL(newEventUploadFile)} alt="preview" className="h-20 w-20 rounded-md object-cover" />
                    ) : (
                      <Upload size={20} className="text-stone-400" />
                    )}
                    <input
                      ref={newEventFileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && setNewEventUploadFile(e.target.files[0])}
                    />
                    <div>
                      <p className="text-sm text-brand-maroon/70">Click to attach an event photo</p>
                      <p className="text-xs text-stone-400">Will be saved to the event gallery after creating the event</p>
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="Caption (optional)"
                    value={newEventUploadCaption}
                    onChange={(e) => setNewEventUploadCaption(e.target.value)}
                    className="flex-1 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm text-brand-maroon outline-none focus:border-brand-maroon"
                  />
                </div>
              </div>
            )}

            <label className="mt-6 block">
              <span className="text-sm text-brand-maroon uppercase tracking-[0.2em] font-bold">Activities</span>
              <textarea
                value={newEvent.activities}
                onChange={(e) => handleNewEventChange("activities", e.target.value)}
                rows={4}
                className="mt-2 w-full rounded-3xl border border-stone-200 px-4 py-3 text-sm text-brand-maroon focus:outline-none focus:border-brand-maroon"
                placeholder="Enter one activity per line"
              />
            </label>

            <button
              type="submit"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-brand-maroon px-8 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white transition-all hover:bg-stone-900"
            >
              Save Event
            </button>
          </form>
        )}

        <div className="space-y-20">
          {mergedEvents.map((event, eventIdx) => (
            <div key={`${event.title}-${eventIdx}`} className="rounded-[2.5rem] border border-stone-200/70 bg-white p-8 shadow-[0_25px_80px_-40px_rgba(120,37,30,0.32)] sm:p-10 lg:p-12">
              <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                  <div className="mb-4 flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-maroon/50">
                    <span>{event.date}</span>
                    <span className="rounded-full bg-brand-maroon/10 px-3 py-1 text-[9px] text-brand-maroon">
                      {event.occasion}
                    </span>
                  </div>
                  <h2 className="text-3xl font-serif text-brand-maroon sm:text-4xl">{event.title}</h2>
                  <p className="mt-6 text-lg leading-relaxed text-brand-maroon/80">{event.description}</p>

                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="mt-8 inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-maroon transition-all hover:gap-4"
                  >
                    View Full Event Details
                    <ArrowRight size={14} />
                  </button>

                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => { setSelectedEvent(event); setShowUploadOnOpen(true); }}
                      className="ml-4 mt-8 inline-flex items-center gap-2 rounded-full border border-stone-300 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-maroon transition-all hover:border-brand-maroon hover:bg-brand-maroon hover:text-white"
                    >
                      <Camera size={14} />
                      Add Photo
                    </button>
                  )}

                  {isAdmin && (
                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => openEditEvent(event)}
                        className="rounded-full bg-brand-maroon px-5 py-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white transition-all hover:bg-stone-900"
                      >
                        Edit Event
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteEvent(event.id!)}
                        className="rounded-full border border-stone-300 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-maroon transition-all hover:border-brand-maroon hover:bg-brand-maroon hover:text-white"
                      >
                        Delete Event
                      </button>
                    </div>
                  )}
                </div>

                <div className="rounded-[2rem] border border-stone-200/70 bg-brand-maroon/5 p-6 text-sm text-brand-maroon/80 lg:min-w-[280px]">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-maroon/40">Highlights</p>
                  <div className="mt-4 space-y-3">
                    {event.activities.slice(0, 3).map((activity, index) => (
                      <div key={`${activity.name}-${index}`} className="flex items-start gap-3">
                        <div className="mt-1 rounded-full bg-white p-2 text-brand-maroon shadow-sm">
                          <Heart size={12} />
                        </div>
                        <p className="text-sm leading-relaxed">{activity.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/90 p-6 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-[2.5rem] bg-brand-cream shadow-2xl"
            >
              <div className="flex items-start justify-between border-b border-stone-200/70 bg-white p-8">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-maroon/40">{selectedEvent.occasion}</p>
                  <h3 className="mt-3 text-3xl font-serif text-brand-maroon">{selectedEvent.title}</h3>
                </div>
                <button onClick={() => setSelectedEvent(null)} className="rounded-full bg-stone-100 p-3 text-stone-500 transition-all hover:bg-brand-maroon hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="max-h-[calc(90vh-180px)] overflow-y-auto p-8">
                <p className="text-lg leading-relaxed text-brand-maroon/90">{selectedEvent.description}</p>

                <div className="mt-10 grid gap-6 md:grid-cols-2">
                  <div className="rounded-[2rem] border border-stone-200/70 bg-white p-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-maroon/40">Activities</p>
                    <div className="mt-6 space-y-4">
                      {selectedEvent.activities.map((activity, index) => (
                        <div key={`${activity.name}-${index}`} className="flex gap-3">
                          <div className="rounded-full bg-brand-maroon/10 p-2 text-brand-maroon">
                            <Heart size={14} />
                          </div>
                          <div>
                            <p className="font-serif text-brand-maroon">{activity.name}</p>
                            <p className="mt-1 text-sm leading-relaxed text-brand-maroon/75">{activity.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[2rem] border border-stone-200/70 bg-white p-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-maroon/40">Event Gallery</p>

                    {isAdmin && (
                      <form onSubmit={handleEventPhotoUpload} className="mt-6 space-y-4 rounded-[1.5rem] border border-stone-200 bg-stone-50 p-4">
                        <div
                          className="flex cursor-pointer flex-col items-center justify-center rounded-[1.25rem] border border-dashed border-stone-300 p-5 text-center transition hover:border-brand-maroon/40"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          {uploadFile ? (
                            <div className="flex flex-col items-center gap-2">
                              <img src={URL.createObjectURL(uploadFile)} alt="Preview" className="h-24 w-24 rounded-xl object-cover" />
                              <p className="text-xs text-brand-maroon/70">{uploadFile.name}</p>
                            </div>
                          ) : (
                            <>
                              <Upload size={20} className="mb-2 text-stone-400" />
                              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">Click to upload event photo</p>
                            </>
                          )}
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => e.target.files?.[0] && setUploadFile(e.target.files[0])}
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Caption (optional)"
                          value={uploadCaption}
                          onChange={(e) => setUploadCaption(e.target.value)}
                          className="w-full rounded-full border border-stone-200 bg-white px-4 py-2 text-sm text-brand-maroon outline-none focus:border-brand-maroon"
                        />
                        <button
                          type="submit"
                          disabled={!uploadFile || uploading}
                          className="w-full rounded-full bg-brand-maroon px-4 py-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white transition hover:bg-stone-900 disabled:cursor-not-allowed disabled:bg-stone-300"
                        >
                          {uploading ? "Uploading..." : "Upload to Event"}
                        </button>
                      </form>
                    )}

                    {loadingPhotos ? (
                      <p className="mt-6 text-sm text-brand-maroon/60">Loading gallery...</p>
                    ) : photoError ? (
                      <p className="mt-6 text-sm text-brand-maroon/60">{photoError}</p>
                    ) : eventPhotos.length > 0 ? (
                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        {eventPhotos.map((photo) => (
                          <img key={photo.id} src={photo.url} alt={photo.caption || selectedEvent.title} className="h-32 w-full rounded-[1.25rem] object-cover" />
                        ))}
                      </div>
                    ) : (
                      <p className="mt-6 text-sm text-brand-maroon/60">No photos available yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
