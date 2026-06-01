'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Terminal, ArrowUpRight, MapPin, Tag, X, Sparkles, Sliders } from 'lucide-react';
import { getStoredEvents, isFirebaseConfigured, db, EventItem } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

export default function PastEvents() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const loadAllEvents = async (active: boolean) => {
    try {
      const data = await getStoredEvents();
      if (active) {
        const sorted = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setEvents(sorted);
        setLoading(false);
      }
    } catch (e) {
      console.error("Failed to load events:", e);
    }
  };

  useEffect(() => {
    let active = true;
    loadAllEvents(active);

    if (isFirebaseConfigured() && db) {
      try {
        const unsub = onSnapshot(collection(db, 'events'), (snap) => {
          if (!snap.empty && active) {
            const list = snap.docs.map(doc => doc.data() as EventItem);
            const sorted = list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setEvents(sorted);
          }
        }, (error) => {
          console.warn("Firestore snapshot error, falling back:", error);
          loadAllEvents(active);
        });
        return () => {
          active = false;
          unsub();
        };
      } catch (err) {
        console.warn("Could not initiate live Firestore event streams:", err);
      }
    } else {
      const handleLocalUpdates = () => {
        loadAllEvents(active);
      };
      window.addEventListener('shanmuka_events_updated', handleLocalUpdates);
      return () => {
        active = false;
        window.removeEventListener('shanmuka_events_updated', handleLocalUpdates);
      };
    }
  }, []);

  // Helper color map
  const getColorClasses = (color: 'cyan' | 'pink' | 'purple') => {
    switch (color) {
      case 'cyan':
        return {
          bg: 'bg-[#00F2FF]/10',
          border: 'border-[#00F2FF]/40',
          text: 'text-[#00F2FF]',
          glow: 'shadow-[0_0_20px_rgba(0,242,255,0.15)] border-[#00F2FF]/50',
          gradientBg: 'from-[#00F2FF]/20 to-transparent',
        };
      case 'pink':
        return {
          bg: 'bg-[#BD00FF]/10',
          border: 'border-[#BD00FF]/40',
          text: 'text-[#BD00FF]',
          glow: 'shadow-[0_0_20px_rgba(189,0,255,0.15)] border-[#BD00FF]/50',
          gradientBg: 'from-[#BD00FF]/20 to-transparent',
        };
      case 'purple':
        default:
        return {
          bg: 'bg-[#7A00FF]/10',
          border: 'border-[#7A00FF]/40',
          text: 'text-[#9D4BFF]',
          glow: 'shadow-[0_0_20px_rgba(122,0,255,0.15)] border-[#7A00FF]/50',
          gradientBg: 'from-[#7A00FF]/25 to-transparent',
        };
    }
  };

  return (
    <div id="past-events-section" className="space-y-8">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <span className="text-[10px] tracking-widest font-mono text-[#00F2FF] uppercase block">
            HISTORIC LEDGER RECORDINGS
          </span>
          <h2 className="text-3xl font-display font-medium text-white tracking-tight uppercase">
            Aura Archive & Showcases
          </h2>
        </div>
      </div>

      {/* Masonry Grid Layout using CSS native columns */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 border border-white/5 bg-white/[0.01] rounded-2xl w-full">
          <div className="w-8 h-8 rounded-full border border-[#00F2FF]/30 border-t-[#00F2FF] animate-spin mb-4" />
          <p className="text-xs font-mono tracking-widest text-[#00F2FF]">RETRIEVING ENCRYPTED EVENT ARCHIVES...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="p-20 border border-white/5 bg-white/[0.01] rounded-2xl w-full text-center">
          <p className="text-sm font-sans text-gray-500">No active archives compiled yet.</p>
        </div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 [column-fill:_balance]">
          {events.map((event, index) => {
            const colorStyles = getColorClasses(event.themeColor);
            const isHovered = hoveredId === event.id;

            return (
              <motion.div
                key={event.id}
                id={`past-event-card-${event.id}`}
                className={`break-inside-avoid relative bg-[#0B0B0F]/80 backdrop-blur-md rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border border-white/5 ${
                  isHovered ? colorStyles.glow : ''
                }`}
                onMouseEnter={() => setHoveredId(event.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setSelectedEvent(event)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Image Container with subtle filter */}
                <div className="relative w-full overflow-hidden aspect-video sm:aspect-auto sm:h-52 md:h-64 lg:h-72">
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    referrerPolicy="no-referrer"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${colorStyles.gradientBg}`} />
                  <div className="absolute top-4 right-4 bg-black/65 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full font-mono text-[9px] tracking-wider text-white uppercase flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-[#00F2FF]" /> {event.date}
                  </div>
                </div>

                {/* Event core summary detail */}
                <div className="p-5 space-y-4">
                  <div className="space-y-1">
                    <div className="flex gap-1.5 flex-wrap">
                      {event.tags.map(t => (
                        <span key={t} className={`px-2 py-0.5 rounded text-[8px] font-mono font-medium tracking-wide border uppercase ${colorStyles.bg} ${colorStyles.border} ${colorStyles.text}`}>
                          {t}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-lg font-bold font-display text-white tracking-wide uppercase leading-snug pt-1">
                      {event.title}
                    </h3>
                  </div>

                  <p className="text-xs text-gray-400 font-sans leading-relaxed">
                    {event.headline}
                  </p>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between font-mono text-[9px] text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-500" /> {event.location.split('//')[0]}
                    </span>
                    <button className="flex items-center gap-1 text-white hover:underline uppercase tracking-widest font-bold">
                      Open Archive <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Expanded Detail Modal Panel */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0B0B0F] border border-white/10 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl relative my-8"
            >
              {/* Cover visual banner */}
              <div className="relative w-full h-56 sm:h-72">
                <Image
                  src={selectedEvent.imageUrl}
                  alt={selectedEvent.title}
                  fill
                  referrerPolicy="no-referrer"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] to-transparent" />
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black/85 flex items-center justify-center text-white border border-white/10 cursor-pointer transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 md:p-8 space-y-6">
                <div className="space-y-2">
                  <div className="flex gap-2 font-mono text-[10px]">
                    <span className="px-2.5 py-1 bg-white/5 rounded border border-white/10 text-white uppercase flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-pink-500" /> {selectedEvent.date}
                    </span>
                    <span className="px-2.5 py-1 bg-white/5 rounded border border-white/10 text-gray-400 uppercase flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#00F2FF]" /> {selectedEvent.location}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold font-display text-white tracking-wide uppercase leading-tight pt-2">
                    {selectedEvent.title}
                  </h2>
                </div>

                <div className="space-y-4 text-xs font-sans text-gray-300 leading-relaxed">
                  <p className="font-medium text-white italic text-sm">
                    &ldquo;{selectedEvent.headline}&rdquo;
                  </p>
                  <p>{selectedEvent.description}</p>
                  <p className="text-gray-400">{selectedEvent.longDescription}</p>
                </div>

                {/* Spatial data ledger / statistics block */}
                {selectedEvent.metrics && selectedEvent.metrics.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    {selectedEvent.metrics.map(m => (
                      <div key={m.label} className="p-3 border border-white/5 bg-white/[0.01] rounded-xl flex items-center gap-3">
                        <Terminal className="w-4 h-4 text-[#00F2FF]" />
                        <div>
                          <span className="text-[8px] font-mono uppercase tracking-wider text-gray-500 block">{m.label}</span>
                          <span className="text-sm font-bold text-white font-mono">{m.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
