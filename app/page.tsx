'use client';

import React, { useState, useEffect } from 'react';
import PastEvents from '../components/PastEvents';
import BookingSystem, { Booking } from '../components/BookingSystem';
import AdminDashboard from '../components/AdminDashboard';
import { Terminal, Shield, Sparkles, Database, Wifi, Globe, Layers, Mail, Phone, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  
  // Shared state keeping track of booked slots
  const [bookedSlots, setBookedSlots] = useState<Booking[]>([
    { dateKey: '2026-06-12', timeSlot: '11:00 - Auspicious Muhurat Pheras', name: 'Singhania Family', email: 'vip@singhania.in' },
    { dateKey: '2026-06-15', timeSlot: '18:00 - Grand Regal Sangeet & Reception', name: 'Kapoor Dynasty', email: 'contact@kapoor.co' },
  ]);

  const handleBookSlot = (newBooking: Booking) => {
    setBookedSlots(prev => [...prev, newBooking]);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#020205] flex items-center justify-center font-mono text-xs text-[#00F2FF] tracking-widest">
        LOADING SHANMUKA COSMO-ROYAL PORTAL SYSTEM...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020205] text-[#D1D1D8] font-sans relative overflow-x-hidden selection:bg-[#BD00FF]/30 selection:text-white pb-16">
      
      {/* Background Neon ambient overlays */}
      <div className="absolute top-[-10%] left-[-20%] w-[60%] h-[50%] bg-[#BD00FF]/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-20%] w-[50%] h-[60%] bg-[#00F2FF]/5 rounded-full blur-[180px] pointer-events-none" />

      {/* Embedded visual Grid Lines overlay for tech-traditional cyber luxury */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Top Professional Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#020205]/80 backdrop-blur-md border-b border-white/5 h-20 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-[#BD00FF] to-[#00F2FF] p-0.5 flex items-center justify-center shadow-[0_0_15px_rgba(0,F2,FF,0.2)]">
              <div className="w-full h-full rounded-[10px] bg-[#020205] flex items-center justify-center font-mono font-black text-xs text-[#00F2FF]">
                SE
              </div>
            </div>
            <div>
              <span className="font-bold text-white tracking-widest text-sm block uppercase font-mono">
                SHANMUKA
              </span>
              <span className="text-[9px] text-gray-500 font-mono block tracking-widest uppercase">
                Events & Celebrations // 2049
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-mono tracking-widest uppercase text-gray-400">
            <a href="#archives" className="hover:text-white transition-colors">
              Showcases
            </a>
            <a href="#booking" className="hover:text-white transition-colors">
              Reserve Slots
            </a>
            <a href="#contact" className="hover:text-white transition-colors">
              Concierge Contact
            </a>
            <button 
              onClick={() => setIsAdminOpen(true)} 
              className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 text-white font-mono text-xs cursor-pointer transition-all"
            >
              Agent Portal
            </button>
          </div>
        </div>
      </header>

      {/* Hero presentation panel */}
      <section className="relative pt-16 pb-20 md:py-32" id="hero-section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#BD00FF]/15 border border-[#BD00FF]/30 rounded-full font-mono text-[9px] tracking-widest uppercase text-[#BD00FF] shadow-[0_0_15px_rgba(189,0,255,0.1)]">
              <Sparkles className="w-3.5 h-3.5 animate-spin" /> Next-Gen Cosmic Royal Indian Weddings
            </div>

            <h1 className="text-4xl sm:text-6xl font-medium text-white tracking-tight leading-[1.1] uppercase font-display">
              Where Ancient Vedic <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#BD00FF] via-[#9D4BFF] to-[#00F2FF]">
                Splendor Meets Sci-Fi
              </span>
            </h1>

            <p className="text-sm sm:text-base text-gray-400 font-sans leading-relaxed max-w-xl">
              We design and coordinate ultra-luxurious, digital-traditional celebration events. From interactive planetarium mandaps to synchronized drone-show pheras, experience an unforgettable synthesis of heritage and technology.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a 
                href="#booking"
                className="px-8 py-3.5 bg-gradient-to-r from-[#BD00FF] to-[#7A00FF] text-white text-xs font-bold font-mono tracking-widest uppercase rounded-xl shadow-[0_4px_20px_rgba(189,0,255,0.35)] hover:shadow-[0_4px_30px_rgba(189,0,255,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Plan Ceremony Muhurat // RESERVE
              </a>
              <a 
                href="#archives"
                className="px-8 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold font-mono tracking-widest uppercase rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Inspect Aura Showcases
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main content grid */}
      <main className="max-w-7xl mx-auto px-6 space-y-24">
        
        {/* Statistics highlights bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
          <div className="space-y-1">
            <span className="text-[9px] font-mono tracking-widest text-[#00F2FF] uppercase block">ACTIVE SHUBH SESSIONS</span>
            <span className="text-xl sm:text-2xl font-mono text-white font-bold block">120+ CEREMONIES</span>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] font-mono tracking-widest text-[#BD00FF] uppercase block">TECHNOLOGY RESOLUTION</span>
            <span className="text-xl sm:text-2xl font-mono text-white font-bold block">12K MULTI-DISPLAY</span>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] font-mono tracking-widest text-[#00F2FF] uppercase block">PREMIUM DRONE FLEET</span>
            <span className="text-xl sm:text-2xl font-mono text-white font-bold block">1,250 ACTIVE DRONES</span>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] font-mono tracking-widest text-[#BD00FF] uppercase block">SUPPORT DIRECT DESK</span>
            <span className="text-xs sm:text-sm font-mono text-white font-bold block truncate">guturuhemashanmuka@gmail.com</span>
          </div>
        </div>

        {/* Section: Showcases */}
        <section id="archives" className="scroll-mt-24">
          <PastEvents />
        </section>

        {/* Section: Muhurat Booking and Reservation Form */}
        <section id="booking" className="space-y-8 scroll-mt-24">
          <div className="space-y-1">
            <span className="text-[10px] tracking-widest font-mono text-[#BD00FF] uppercase block">
              REAL-TIME SPACE-TIME RESERVATION SLOTS
            </span>
            <h2 className="text-3xl font-display font-medium text-white tracking-tight uppercase">
              Muhurat & Seating Registry
            </h2>
            <p className="text-xs text-gray-400 font-sans leading-relaxed max-w-xl">
              Lock in your auspicious date with our secure event queue. Direct scheduling syncs with your Google calendar and our active core database instantly.
            </p>
          </div>

          <BookingSystem bookedSlots={bookedSlots} onBookSlot={handleBookSlot} />
        </section>

        {/* Section: Direct Concierge Hotline Dashboard */}
        <section id="contact" className="p-8 sm:p-12 bg-white/[0.02] border border-white/5 rounded-3xl relative overflow-hidden scroll-mt-24">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#00F2FF]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-2xl space-y-6 relative">
            <span className="text-[10px] tracking-widest font-mono text-[#00F2FF] uppercase block">
              24/7 GUEST AND VIP SUPPORT DIRECT HOTLINE
            </span>
            <h2 className="text-3xl font-display font-medium text-white tracking-tight uppercase">
              Connect With The Founder Director
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-sans">
              Have unique spatial coordinates, custom culinary dietary instructions, or wish to deploy customized holographic displays? Direct your query straight to the verified founder inbox.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 border border-white/5 bg-white/[0.01] rounded-xl flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#BD00FF]/10 border border-[#BD00FF]/35 flex items-center justify-center text-[#BD00FF] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[9px] uppercase tracking-wider text-gray-500 font-mono block">Direct Support Mail</span>
                  <a 
                    href="mailto:guturuhemashanmuka@gmail.com" 
                    className="text-white text-xs font-semibold hover:text-[#00F2FF] hover:underline block truncate"
                  >
                    guturuhemashanmuka@gmail.com
                  </a>
                </div>
              </div>

              <div className="p-4 border border-white/5 bg-white/[0.01] rounded-xl flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#00F2FF]/10 border border-[#00F2FF]/35 flex items-center justify-center text-[#00F2FF] shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-gray-500 font-mono block">VIP Concierge Number</span>
                  <a 
                    href="tel:8074226484" 
                    className="text-white text-xs font-semibold hover:text-[#BD00FF] hover:underline block"
                  >
                    +91 80742 26484
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Page Footer */}
      <footer className="border-t border-white/5 mt-32 pt-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-500">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#00F2FF]" />
            <span>SHANMUKA INFRASTRUCTURE // SECURE PORT_3000</span>
          </div>
          <span className="text-[#00F2FF]">© SHANMUKA EVENTS 2049</span>
        </div>
      </footer>

      {/* Dynamic Partner CMS drawer */}
      <AdminDashboard isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </div>
  );
}
