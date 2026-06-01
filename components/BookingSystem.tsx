'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, Clock, CheckCircle2, AlertTriangle, User, Mail, Terminal, Phone } from 'lucide-react';

export interface Booking {
  dateKey: string; // "YYYY-MM" + "-DD"
  timeSlot: string;
  name: string;
  email: string;
}

interface BookingSystemProps {
  bookedSlots: Booking[];
  onBookSlot: (booking: Booking) => void;
}

const TIME_SLOTS = [
  '11:00 - Auspicious Muhurat Pheras',
  '18:00 - Grand Regal Sangeet & Reception',
  '21:00 - Luxury Starlight Feast Banquet',
];

export default function BookingSystem({ bookedSlots, onBookSlot }: BookingSystemProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 5, 1)); // June 2026
  const [selectedDay, setSelectedDay] = useState<number | null>(15); // June 15th by default
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(TIME_SLOTS[0]);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);
  const [successModal, setSuccessModal] = useState<{ isOpen: boolean; booking: Booking | null }>({
    isOpen: false,
    booking: null,
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayOfMonth(year, month);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  const getFormattedDateKey = (day: number) => {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    return `${year}-${formattedMonth}-${formattedDay}`;
  };

  const isSlotBooked = (day: number, slot: string) => {
    const dateKey = getFormattedDateKey(day);
    return bookedSlots.some(b => b.dateKey === dateKey && b.timeSlot === slot);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDay) {
      setFormError('PLEASE SELECT A SHUBH MUHURAT (DATE)');
      return;
    }
    if (!name.trim()) {
      setFormError('GUEST NAME OR FAMILY ALIAS IS REQUIRED');
      return;
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setFormError('VALID CONTACT ROUTING ADDRESS (EMAIL) REQUIRED');
      return;
    }

    const dateKey = getFormattedDateKey(selectedDay);
    if (isSlotBooked(selectedDay, selectedTimeSlot)) {
      setFormError('THAT SPECIFIC EVENT SLOT IS ALREADY BLOCKED BY ANOTHER GUEST');
      return;
    }

    const newBooking: Booking = {
      dateKey,
      timeSlot: selectedTimeSlot,
      name,
      email,
    };

    onBookSlot(newBooking);
    setSuccessModal({ isOpen: true, booking: newBooking });
    
    // Clear forms
    setName('');
    setEmail('');
    setFormError(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="booking-system-grid">
      {/* Interactive Reservation Calendar Form (Left side) */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5" id="calendar-element">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold tracking-widest text-[#00F2FF] uppercase font-mono">
              SHUBH MUHURAT // {monthNames[month]} {year}
            </span>
            <div className="flex gap-2 text-gray-400">
              <button
                onClick={prevMonth}
                className="p-1 px-3 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-xs font-mono transition-all cursor-pointer"
              >
                &lt; PREV
              </button>
              <button
                onClick={nextMonth}
                className="p-1 px-3 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-xs font-mono transition-all cursor-pointer"
              >
                NEXT &gt;
              </button>
            </div>
          </div>

          {/* Calendar grid headers */}
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-gray-500 font-mono text-[10px] tracking-widest uppercase">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Day keys */}
          <div className="grid grid-cols-7 gap-2">
            {/* Blank offset tiles */}
            {Array.from({ length: firstDayIndex }).map((_, idx) => (
              <div key={`offset-${idx}`} className="h-10 sm:h-12 border border-transparent" />
            ))}

            {/* Living Day Buttons */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const isSelected = selectedDay === day;
              
              // Highlight auspicious days according to traditional astrology
              const isAuspicious = [8, 14, 15, 22, 28].includes(day);

              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  onClick={() => {
                    setSelectedDay(day);
                    setFormError(null);
                  }}
                  className={`h-10 sm:h-12 flex flex-col justify-between p-1.5 rounded-lg border text-sm transition-all relative font-mono cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-tr from-[#BD00FF] to-[#00F2FF] border-[#00F2FF] text-white font-bold shadow-[0_0_15px_rgba(0,242,255,0.25)]'
                      : isAuspicious
                      ? 'bg-[#BD00FF]/10 border-[#BD00FF]/30 text-[#BD00FF] hover:bg-[#BD00FF]/25'
                      : 'bg-white/[0.02] border-white/5 text-gray-400 hover:bg-white/5'
                  }`}
                >
                  <span className="text-xs">{day}</span>
                  {isAuspicious && !isSelected && (
                    <span className="text-[7px] text-[#BD00FF] block uppercase tracking-[0.15em] leading-none absolute bottom-1 right-1 font-sans">
                      Auspicious
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Input Details */}
        <form onSubmit={handleSubmit} className="space-y-4 bg-white/[0.03] border border-white/10 rounded-2xl p-5">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-2">
              Select Ceremony Session
            </label>
            <div className="relative">
              <select
                value={selectedTimeSlot}
                onChange={(e) => setSelectedTimeSlot(e.target.value)}
                className="w-full bg-cyber-dark/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00F2FF] text-white font-sans placeholder-gray-600 appearance-none bg-black/60 cursor-pointer"
              >
                {TIME_SLOTS.map((slot) => {
                  const booked = selectedDay ? isSlotBooked(selectedDay, slot) : false;
                  return (
                    <option key={slot} value={slot} disabled={booked} className="bg-[#0c0c10] text-white">
                      {slot} {booked ? '[RESERVED // FULLY BOOKED]' : ''}
                    </option>
                  );
                })}
              </select>
              <Clock className="w-4 h-4 text-gray-400 absolute right-4 top-3.5 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-widest text-gray-400 block">
              Guest Authentication & Registry
            </label>
            
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 text-gray-500 w-4.5 h-4.5" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name / Family Alias"
                className="w-full bg-[#0E0E14] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[#BD00FF] text-white font-sans placeholder-gray-600"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 text-gray-500 w-4.5 h-4.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Contact Address (Email)"
                className="w-full bg-[#0E0E14] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[#BD00FF] text-white font-sans placeholder-gray-600"
              />
            </div>
          </div>

          {formError && (
            <div className="p-3 bg-pink-500/10 border border-pink-500/20 text-pink-400 rounded-xl text-xs flex items-center gap-2 font-mono">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-[#BD00FF] to-[#7A00FF] rounded-xl font-bold uppercase tracking-[0.25em] text-xs hover:brightness-110 active:scale-95 transition-all text-white shadow-[0_4px_20px_rgba(189,0,255,0.3)] hover:shadow-[0_4px_30px_rgba(189,0,255,0.5)] cursor-pointer"
          >
            Confirm Reservation // SUBMIT
          </button>
        </form>
      </div>

      {/* Support and Owner Hotlines Widget side cards */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-gradient-to-b from-white/[0.04] to-transparent border border-white/10 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#00F2FF] mb-4">
            REGULAR COMPLIANCE PORTAL
          </h4>
          
          <div className="space-y-4">
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              Need instant changes, VIP custom seating layouts, or a private helicopter transport protocol? Connect directly with our premium director team.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 p-3 border border-white/5 bg-white/[0.01] rounded-xl">
                <Mail className="w-4.5 h-4.5 text-[#00F2FF]" />
                <div className="overflow-hidden">
                  <span className="text-[9px] uppercase tracking-wider text-gray-500 block font-mono">Direct Desk Email</span>
                  <a 
                    href="mailto:guturuhemashanmuka@gmail.com" 
                    className="text-white text-xs font-medium hover:text-[#00F2FF] hover:underline block truncate"
                  >
                    guturuhemashanmuka@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border border-white/5 bg-white/[0.01] rounded-xl">
                <Phone className="w-4.5 h-4.5 text-[#BD00FF]" />
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-gray-500 block font-mono">24/7 Concierge Hotline</span>
                  <a 
                    href="tel:8074226484" 
                    className="text-white text-xs font-medium hover:text-[#BD00FF] hover:underline block"
                  >
                    +91 80742 26484
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Astro Timing advice box */}
        <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 font-mono text-[10px] space-y-2.5 text-gray-500">
          <div className="flex items-center gap-2 text-yellow-500/80 font-bold uppercase tracking-wider text-[11px]">
            <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping" />
            <span>Lunar Muhurat Alert</span>
          </div>
          <p className="leading-relaxed">
            Astrological systems denote premium planetary houses between June 12 and June 25, 2026 as carrying maximum auspicious vibration waves.
          </p>
        </div>
      </div>

      {/* Success Modal Drawer */}
      <AnimatePresence>
        {successModal.isOpen && successModal.booking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0C0C10] border border-white/10 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display text-white tracking-wide">
                    RESERVATION CONSOLIDATED
                  </h3>
                  <p className="text-xs font-mono text-[#00F2FF]">
                    FESTIVAL SLOTS CONFIRMED
                  </p>
                </div>
              </div>

              <div className="p-3.5 border border-white/5 bg-white/[0.02] rounded-xl text-xs space-y-2">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500 uppercase text-[10px]">Auspicious Date:</span>
                  <span className="text-white font-medium">{successModal.booking.dateKey}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500 uppercase text-[10px]">Ceremony Session:</span>
                  <span className="text-[#BD00FF] font-medium">{successModal.booking.timeSlot}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500 uppercase text-[10px]">Guest Registered:</span>
                  <span className="text-white truncate font-medium max-w-[200px]">{successModal.booking.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 uppercase text-[10px]">Contact Registry:</span>
                  <span className="text-gray-400 truncate font-medium max-w-[200px]">{successModal.booking.email}</span>
                </div>
              </div>

              <div className="p-3 border border-[#00F2FF]/20 rounded-xl bg-[#00F2FF]/5 flex items-center gap-3">
                <Terminal className="w-4 h-4 text-[#00F2FF] animate-pulse shrink-0" />
                <p className="text-[10px] text-gray-300 font-mono">
                  State synchronized. Shanmuka Events database updated.
                </p>
              </div>

              <button
                onClick={() => setSuccessModal({ isOpen: false, booking: null })}
                className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-mono text-xs rounded-xl border border-white/10 transition-all font-bold cursor-pointer"
              >
                DISMISS CONFIRMATION
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
