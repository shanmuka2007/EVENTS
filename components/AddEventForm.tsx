'use client';

import React, { useState } from 'react';
import { PlusCircle, Image as ImageIcon, Calendar, MapPin, Tag, Terminal, Sparkles, Check } from 'lucide-react';
import { motion } from 'motion/react';

export interface EventItem {
  id: string;
  title: string;
  headline: string;
  description: string;
  longDescription: string;
  date: string;
  location: string;
  tags: string[];
  imageUrl: string;
  themeColor: 'cyan' | 'pink' | 'purple';
  metrics: { label: string; value: string }[];
}

interface AddEventFormProps {
  onAddEvent: (event: EventItem) => void;
  onClose?: () => void;
}

const PRESET_IMAGES = [
  { url: 'https://picsum.photos/seed/matrix/600/400', label: 'Neural Matrix' },
  { url: 'https://picsum.photos/seed/synthwave/600/400', label: 'Synthwave Night' },
  { url: 'https://picsum.photos/seed/neoen/600/400', label: 'Quantum Spire' },
  { url: 'https://picsum.photos/seed/mechmod/600/400', label: 'Mech Assembly' },
];

export default function AddEventForm({ onAddEvent, onClose }: AddEventFormProps) {
  const [title, setTitle] = useState('');
  const [headline, setHeadline] = useState('');
  const [description, setDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [date, setDate] = useState('2024-11-20');
  const [location, setLocation] = useState('');
  const [themeColor, setThemeColor] = useState<'cyan' | 'pink' | 'purple'>('cyan');
  const [imageType, setImageType] = useState<'url' | 'preset'>('preset');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(PRESET_IMAGES[0].url);
  const [tagsInput, setTagsInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Field Validations
    if (!title.trim()) return setErrorMessage('Event title is required.');
    if (!headline.trim()) return setErrorMessage('Headline statement is required.');
    if (!description.trim()) return setErrorMessage('Short description is required.');
    if (!date) return setErrorMessage('Event date is required.');
    if (!location.trim()) return setErrorMessage('Location coordinate is required.');

    const finalImageUrl = imageType === 'preset' ? selectedPreset : customImageUrl.trim();
    if (!finalImageUrl) return setErrorMessage('Please specify an image resource locator (URL).');

    const tags = tagsInput
      ? tagsInput.split(',').map((t) => t.trim()).filter((t) => t.length > 0)
      : ['Custom Entry', 'Synthetics'];

    const newEvent: EventItem = {
      id: `custom-event-${Date.now()}`,
      title: title.trim(),
      headline: headline.trim(),
      description: description.trim(),
      longDescription: longDescription.trim() || description.trim(),
      date,
      location: location.trim(),
      tags,
      imageUrl: finalImageUrl,
      themeColor,
      metrics: [
        { label: 'Signal Vector', value: 'Offline Capture' },
        { label: 'Integrity Rating', value: '100% Authorized' },
      ],
    };

    onAddEvent(newEvent);
    setSuccess(true);

    // Reset fields
    setTimeout(() => {
      setSuccess(false);
      setTitle('');
      setHeadline('');
      setDescription('');
      setLongDescription('');
      setLocation('');
      setTagsInput('');
      if (onClose) onClose();
    }, 1500);
  };

  return (
    <div className="space-y-4" id="add-event-form">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-neon-purple animate-pulse" />
          <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-white">
            ARCHIVE LOGGER // NEW ENTRY
          </h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white font-sans text-xs"
            type="button"
          >
            ✕
          </button>
        )}
      </div>

      {success ? (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center space-y-3"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400 border border-emerald-500/30">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-widest">
              UPLINK SYNC SUCCESSFUL
            </p>
            <p className="text-[10px] text-gray-400 font-mono mt-1">
              Event ledger updated instantly in the holographic slider archive.
            </p>
          </div>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono text-gray-300">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase text-gray-500 mb-1">Coded Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Synthwave Rave 2049"
                className="w-full bg-cyber-dark border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-neon-cyan text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase text-gray-500 mb-1">Headline Statement</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g., Multi-frequency neural broadcast"
                className="w-full bg-cyber-dark border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-neon-cyan text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase text-gray-500 mb-1">Teaser Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a sleek summary describing the visual coordinates and attendee reception..."
              rows={2}
              className="w-full bg-cyber-dark border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-neon-pink text-white font-sans text-xs"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase text-gray-500 mb-1">Extended Decrypted Archival log (Optional)</label>
            <textarea
              value={longDescription}
              onChange={(e) => setLongDescription(e.target.value)}
              placeholder="Extended full details to render upon clicking a card..."
              rows={2}
              className="w-full bg-cyber-dark border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-neon-pink text-white font-sans text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase text-gray-500 mb-1">Registry Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-cyber-dark border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-neon-purple text-white cursor-pointer"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] uppercase text-gray-500 mb-1">Spatial Coordinates (Location)</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Sector-99 Upper Deck"
                className="w-full bg-cyber-dark border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-neon-purple text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase text-gray-500 mb-1">Aura Theme Color</label>
              <div className="flex gap-2">
                {(['cyan', 'pink', 'purple'] as const).map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setThemeColor(color)}
                    className={`flex-1 py-1 px-2.5 rounded border text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
                      themeColor === color
                        ? color === 'cyan'
                          ? 'border-[#00F2FF] bg-[#00F2FF]/10 text-[#00F2FF]'
                          : color === 'pink'
                          ? 'border-[#ec4899] bg-[#ec4899]/10 text-[#ec4899]'
                          : 'border-[#BD00FF] bg-[#BD00FF]/10 text-[#BD00FF]'
                        : 'border-white/5 bg-white/[0.02] text-gray-500 hover:text-white'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${color === 'cyan' ? 'bg-[#00F2FF]' : color === 'pink' ? 'bg-[#ec4899]' : 'bg-[#BD00FF]'}`} />
                    {color}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[10px] uppercase text-gray-500 mb-1">Decentralized core tags (CSV)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Cyber, Launch, Wetware"
                className="w-full bg-cyber-dark border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-neon-cyan text-white"
              />
            </div>
          </div>

          {/* Holographic Preset Image selection */}
          <div className="space-y-2 border border-white/5 p-3 rounded-lg bg-white/[0.01]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-gray-400 font-bold uppercase">ARCHIVAL PHOTOGRAPHY SOURCE</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setImageType('preset')}
                  className={`text-[9px] uppercase px-1.5 py-0.5 rounded transition-all ${
                    imageType === 'preset' ? 'bg-white/10 text-white font-bold' : 'text-gray-500'
                  }`}
                >
                  PRESET MOCK
                </button>
                <button
                  type="button"
                  onClick={() => setImageType('url')}
                  className={`text-[9px] uppercase px-1.5 py-0.5 rounded transition-all ${
                    imageType === 'url' ? 'bg-white/10 text-white font-bold' : 'text-gray-500'
                  }`}
                >
                  EXTERNAL URL
                </button>
              </div>
            </div>

            {imageType === 'preset' ? (
              <div className="grid grid-cols-2 xs:grid-cols-4 gap-2">
                {PRESET_IMAGES.map((img) => (
                  <button
                    key={img.url}
                    type="button"
                    onClick={() => setSelectedPreset(img.url)}
                    className={`p-1 rounded border transition-all truncate text-left relative overflow-hidden ${
                      selectedPreset === img.url
                        ? 'border-neon-cyan bg-neon-cyan/5 text-neon-cyan'
                        : 'border-white/10 text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    <span className="text-[9px] font-mono block truncate">{img.label}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="relative">
                <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none">
                  <ImageIcon className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <input
                  type="url"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  placeholder="Paste secure https image address..."
                  className="w-full bg-cyber-dark border border-white/10 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-neon-cyan text-white text-[10px]"
                />
              </div>
            )}
          </div>

          {errorMessage && (
            <div className="text-[10px] text-red-500 font-sans p-2 rounded bg-red-500/5 border border-red-500/10 flex items-center gap-1.5">
              <span>✕</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-white/10 hover:bg-[#00F2FF]/20 text-[#00F2FF] border border-[#00F2FF]/30 hover:border-[#00F2FF] rounded-lg font-bold uppercase tracking-wider text-[10px] transition-all cursor-pointer"
          >
            COMMIT TRANSACTION DATA // SUBMIT
          </button>
        </form>
      )}
    </div>
  );
}
