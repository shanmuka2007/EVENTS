'use client';

import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Upload, 
  Check, 
  Terminal, 
  Edit3, 
  Calendar, 
  MapPin, 
  LogOut, 
  Lock, 
  ShieldCheck, 
  Loader2,
  ListFilter
} from 'lucide-react';
import { 
  getStoredEvents, 
  updateStoredEvent, 
  uploadMediaAsset, 
  loginWithGoogle, 
  logoutUser, 
  EventItem 
} from '../lib/firebase';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminDashboard({ isOpen, onClose }: AdminDashboardProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  
  // Form states for editing
  const [formTitle, setFormTitle] = useState('');
  const [formHeadline, setFormHeadline] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formLongDesc, setFormLongDesc] = useState('');
  const [formTheme, setFormTheme] = useState<'cyan' | 'pink' | 'purple'>('pink');
  
  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Console log virtual ticker
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'SYSTEM INITIALIZED :: CMS CORE LAYER ACTIVE',
    'AWAITING OWNER AUTHENTICATION MATRIX...'
  ]);

  const addLog = (msg: string) => {
    setTerminalLogs(prev => [...prev.slice(-4), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  // Main loader helper safely placed above references
  async function loadEvents() {
    setLoading(true);
    try {
      const list = await getStoredEvents();
      const sorted = [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setEvents(sorted);
      addLog(`COMPILED ${sorted.length} ACTIVE EVENTS FROM RELATIONAL DB`);
    } catch {
      addLog(`DB_LIST_FAIL: Unable to fetch archives`);
    } finally {
      setLoading(false);
    }
  }

  // Handle Session checking within effects
  useEffect(() => {
    if (!isOpen) return;

    const checkAuthStatus = async () => {
      const mockSession = localStorage.getItem('shanmuka_mock_auth');
      if (mockSession) {
        try {
          const parsed = JSON.parse(mockSession);
          if (parsed.email === 'guturuhemashanmuka@gmail.com') {
            setIsAdmin(true);
            setUserEmail(parsed.email);
            addLog(`RESTORED SIMULATED ADMIN SESSION: ${parsed.email}`);
            
            setLoading(true);
            try {
              const list = await getStoredEvents();
              const sorted = [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
              setEvents(sorted);
              addLog(`COMPILED ${sorted.length} ACTIVE EVENTS FROM RELATIONAL DB`);
            } catch {
              addLog(`DB_LIST_FAIL: Unable to fetch archives`);
            } finally {
              setLoading(false);
            }
          }
        } catch {
          localStorage.removeItem('shanmuka_mock_auth');
        }
      }
    };

    checkAuthStatus();
  }, [isOpen]);

  // Authenticate login action
  const handleLogin = async () => {
    try {
      addLog('INITIATING IDENTITY PROTOCOL GATES...');
      const session = await loginWithGoogle();
      
      if (session && session.email === 'guturuhemashanmuka@gmail.com') {
        setIsAdmin(true);
        setUserEmail(session.email);
        addLog(`ACCESS GRANTED. WELCOME SITE OWNER: ${session.email}`);
        await loadEvents();
      } else {
        addLog(`ACCESS DENIED :: INVALID ALIAS ${session?.email || 'N/A'}`);
        alert('Access Restricted to guturuhemashanmuka@gmail.com');
        await logoutUser();
      }
    } catch (error) {
      addLog(`AUTH_ERR: Secure handshake refused`);
      console.error(error);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setIsAdmin(false);
    setUserEmail(null);
    setEvents([]);
    addLog('ADMIN SESSION DEACTIVATED. SHIELDS LOCKED.');
  };

  const openEditModal = (event: EventItem) => {
    setEditingEvent(event);
    setFormTitle(event.title);
    setFormHeadline(event.headline);
    setFormDate(event.date);
    setFormLocation(event.location);
    setFormTags(event.tags.join(', '));
    setFormDesc(event.description);
    setFormLongDesc(event.longDescription);
    setFormTheme(event.themeColor);
    setPreviewUrl(event.imageUrl);
    setSelectedFile(null);
    setUploadProgress(0);
    addLog(`LOADED EVENT MATRIX: ${event.id.toUpperCase()}`);
  };

  // Drag-and-drop upload hook callbacks
  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      addLog(`STAGED OBJECT STREAM: ${file.name} (${Math.round(file.size / 1024)} KB)`);
      
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    multiple: false
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    setIsSaving(true);
    addLog('COMMITTING FIELD PAYLOADS TO REGISTRY...');

    try {
      let finalImageUrl = editingEvent.imageUrl;

      if (selectedFile) {
        setIsUploading(true);
        addLog(`TRANSMITTING FILES TO SECURE STORAGE BUCKETS...`);
        setUploadProgress(40);
        
        finalImageUrl = await uploadMediaAsset(selectedFile, selectedFile.name);
        
        setUploadProgress(100);
        addLog(`MEDIA UPLOAD SECURED :: ASSET_URL ACQUIRED`);
        setIsUploading(false);
      }

      const updatedEvent: EventItem = {
        ...editingEvent,
        title: formTitle,
        headline: formHeadline,
        date: formDate,
        location: formLocation,
        tags: formTags.split(',').map(t => t.trim()).filter(t => t.length > 0),
        description: formDesc,
        longDescription: formLongDesc,
        themeColor: formTheme,
        imageUrl: finalImageUrl,
      };

      await updateStoredEvent(updatedEvent);
      addLog(`MUTATION DEPLOYED : SUCCESS IN STREAM "events/${editingEvent.id}"`);
      
      setEvents(prev => prev.map(ev => ev.id === editingEvent.id ? updatedEvent : ev));
      setEditingEvent(null);
    } catch (err) {
      addLog(`SAVE_FAIL: Write constraint breach`);
      console.error(err);
      alert('Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#09090C]/95 backdrop-blur-md overflow-hidden font-sans">
      <div 
        className="w-full max-w-4xl bg-[#0D0D12]/90 border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        id="cms-dashboard-container"
      >
        {/* Top Header */}
        <div className="h-16 border-b border-white/10 px-6 flex items-center justify-between bg-black/45">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#00F2FF]" />
            <span className="text-sm font-bold uppercase tracking-[0.2em] font-mono text-white">
              SHANMUKA CMS // SECURE PARTNER DESK
            </span>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all border border-white/10 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Panel Forms content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-6">
          {!isAdmin ? (
            <div className="max-w-md w-full mx-auto py-12 flex flex-col items-center text-center space-y-6 self-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#00F2FF] to-[#BD00FF] p-0.5 flex items-center justify-center shadow-[0_0_30px_rgba(0,242,255,0.25)]">
                <div className="bg-[#0D0D12] w-full h-full rounded-[14px] flex items-center justify-center">
                  <Lock className="w-6 h-6 text-[#00F2FF]" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-xl font-bold font-display uppercase tracking-wider text-white">
                  Handshake Constraint Triggered
                </h2>
                <p className="text-xs text-gray-400 leading-relaxed max-w-xs font-mono">
                  This system panel controls public archive records. Access is strictly reserved for the owner verification matrix.
                </p>
              </div>

              <div className="p-4 border border-white/5 bg-white/[0.01] rounded-xl font-mono text-[10px] text-left text-gray-500 w-full space-y-2">
                <span className="text-[#BD00FF] font-bold block uppercase tracking-wider">Required Profile:</span>
                <span className="text-gray-300 block">Email: guturuhemashanmuka@gmail.com</span>
                <span className="text-gray-300 block">Hotline: +91 80742 26484</span>
              </div>

              <button
                onClick={handleLogin}
                className="w-full py-3.5 bg-gradient-to-r from-[#00F2FF] to-[#BD00FF] text-black font-bold uppercase rounded-xl tracking-widest text-xs hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,242,255,0.25)] cursor-pointer"
              >
                Authenticate Site Owner // LOGIN
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Active Profile Info */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-white/5 bg-white/[0.01] rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#BD00FF]/15 border border-[#BD00FF]/40 flex items-center justify-center font-mono font-bold text-sm text-[#BD00FF]">
                    SE
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                      GST REGISTERED USER
                    </h4>
                    <p className="text-[10px] font-mono text-[#00F2FF]">
                      {userEmail} (VERIFIED CORRESPONDENT)
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={loadEvents}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-mono text-gray-300 flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <ListFilter className="w-3.5 h-3.5" /> REFRESH
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20 rounded-xl text-xs font-mono text-pink-400 flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <LogOut className="w-3.5 h-3.5" /> DE-AUTHENTICATE
                  </button>
                </div>
              </div>

              {/* Roster Grid */}
              <div className="space-y-3">
                <span className="text-[9px] tracking-widest font-mono uppercase text-gray-500 block">
                  Compiled Archival Roster ({events.length} registries)
                </span>
                
                {loading ? (
                  <div className="py-20 text-center text-gray-400 font-mono text-xs flex flex-col items-center gap-3">
                    <Loader2 className="w-6 h-6 animate-spin text-[#00F2FF]" />
                    <span>SYNCHRONIZING REPOSITORIES...</span>
                  </div>
                ) : (
                  <div className="border border-white/5 rounded-2xl overflow-hidden bg-black/20">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/[0.02] text-gray-400 font-mono text-[10px] uppercase tracking-wider">
                          <th className="p-4">Visual Cover</th>
                          <th className="p-4">Event Registry Name</th>
                          <th className="p-4">Space-Time Coordinates</th>
                          <th className="p-4 text-center">Operation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {events.map((event) => (
                          <tr key={event.id} className="hover:bg-white/[0.01] transition-all">
                            <td className="p-4">
                              <div className="relative w-16 h-10 rounded overflow-hidden border border-white/10 shrink-0">
                                <img src={event.imageUrl} alt={event.title} className="object-cover w-full h-full" referrerPolicy="no-referrer" />
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="font-semibold text-white text-sm block">{event.title}</span>
                              <span className="text-[10px] text-gray-400 truncate max-w-[240px] block">{event.headline}</span>
                            </td>
                            <td className="p-4 font-mono text-gray-400 text-[10px]">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-3 h-3 text-[#BD00FF]" /> {event.date}
                              </div>
                              <div className="flex items-center gap-1.5 mt-1 text-gray-500">
                                <MapPin className="w-3 h-3" /> {event.location.split('//')[0]}
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => openEditModal(event)}
                                className="px-3.5 py-2 bg-[#00F2FF]/10 text-[#00F2FF] hover:bg-[#00F2FF]/20 border border-[#00F2FF]/20 rounded-lg font-mono text-[10px] font-bold tracking-widest uppercase cursor-pointer"
                              >
                                <Edit3 className="w-3" /> Edit Event
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dashboard virtual terminal */}
        <div className="bg-black border-t border-white/10 p-4 font-mono text-[10px] flex items-center justify-between text-gray-400">
          <div className="flex items-center gap-2 overflow-hidden w-full whitespace-nowrap bg-black">
            <Terminal className="w-3.5 h-3.5 text-[#00F2FF] shrink-0" />
            <div className="space-x-4 animate-pulse flex select-none overflow-hidden max-w-full">
              {terminalLogs.slice().reverse().map((log, i) => (
                <span key={i} className={i === 0 ? "text-emerald-400 font-bold" : "text-gray-500"}>
                  {log}
                </span>
              ))}
            </div>
          </div>
          <span className="text-[#00F2FF] shrink-0 font-bold hidden sm:inline ml-4">STILL_SECURE // PORT_3000</span>
        </div>
      </div>

      {/* Editor Inner Modal */}
      <AnimatePresence>
        {editingEvent && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0B0B0F] border border-white/10 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col my-8 max-h-[90vh]"
            >
              {/* Header */}
              <div className="h-14 border-b border-white/10 px-6 flex items-center justify-between bg-white/[0.01]">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  VISUAL EDITOR // {editingEvent.id.toUpperCase()}
                </span>
                <button
                  onClick={() => setEditingEvent(null)}
                  className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all border border-white/10 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Form fields */}
              <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Upload core container */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block font-bold">
                    DRAG-AND-DROP DECORATIVE MEDIA COVER
                  </label>
                  
                  <div 
                    {...getRootProps()} 
                    className={`border-2 border-dashed rounded-xl p-6 transition-all text-center flex flex-col items-center justify-center cursor-pointer ${
                      isDragActive 
                        ? 'border-[#00F2FF] bg-[#00F2FF]/5 shadow-[0_0_20px_rgba(0,242,255,0.15)]' 
                        : 'border-white/10 hover:border-white/25 bg-white/[0.01]'
                    }`}
                  >
                    <input {...getInputProps()} />
                    
                    {previewUrl ? (
                      <div className="relative w-full h-36 rounded-lg overflow-hidden border border-white/10 group mb-3">
                        <img 
                          src={previewUrl} 
                          alt="Staged Cover" 
                          className="object-cover w-full h-full brightness-90 group-hover:brightness-100 transition-all" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-transparent flex items-center justify-center group-hover:bg-black/40 transition-all text-transparent group-hover:text-white font-mono text-[9px] uppercase tracking-widest">
                          <Upload className="w-4 h-4 mr-1" /> Drop new file to replace
                        </div>
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-3 text-gray-400 group-hover:text-white">
                        <Upload className="w-5 h-5 animate-bounce" />
                      </div>
                    )}

                    <p className="text-xs text-white tracking-wide font-medium">
                      {isDragActive ? 'Release Asset' : 'Drag photos here or click to browse'}
                    </p>
                    <p className="text-[9px] text-gray-500 font-mono mt-1">
                      Supports PNG, JPG, WEBP, GIF (Auto-compressed to responsive assets)
                    </p>
                  </div>

                  {isUploading && (
                    <div className="space-y-1.5 p-3.5 border border-[#00F2FF]/20 rounded-xl bg-[#00F2FF]/5">
                      <div className="flex justify-between font-mono text-[9px] text-gray-300 animate-pulse">
                        <span className="flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin text-[#00F2FF]" />
                          STREAMING FILE BINARIES...
                        </span>
                        <span className="text-[#00F2FF] font-bold">{uploadProgress}%</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#00F2FF] to-[#BD00FF] transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Edit grids */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400">Event Title</label>
                    <input
                      type="text"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      required
                      placeholder="Title"
                      className="w-full bg-[#141416] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00F2FF] text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400">Headline</label>
                    <input
                      type="text"
                      value={formHeadline}
                      onChange={(e) => setFormHeadline(e.target.value)}
                      required
                      placeholder="Headline text"
                      className="w-full bg-[#141416] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00F2FF] text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400">Date</label>
                    <input
                      type="date"
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      required
                      className="w-full bg-[#141416] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00F2FF] text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400">Location Coordinates</label>
                    <input
                      type="text"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      required
                      className="w-full bg-[#141416] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00F2FF] text-white"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400">Tags (Separated by Commas)</label>
                    <input
                      type="text"
                      value={formTags}
                      onChange={(e) => setFormTags(e.target.value)}
                      required
                      className="w-full bg-[#141416] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00F2FF] text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400">Neon Aura Glow Hue</label>
                    <div className="flex gap-4">
                      {['pink', 'cyan', 'purple'].map((theme) => (
                        <label key={theme} className="flex items-center gap-2 font-mono text-xs text-gray-400 capitalize cursor-pointer">
                          <input
                            type="radio"
                            name="themeColor"
                            value={theme}
                            checked={formTheme === theme}
                            onChange={() => setFormTheme(theme as any)}
                            className="text-[#00F2FF] border-white/10 focus:ring-0 bg-[#121216]"
                          />
                          <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                            theme === 'cyan' ? 'bg-cyan-400' : theme === 'pink' ? 'bg-pink-500' : 'bg-purple-500'
                          }`} />
                          <span>{theme} Accent</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400">Short Summary</label>
                    <textarea
                      rows={2}
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      required
                      className="w-full bg-[#141416] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00F2FF] text-white font-sans"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400">Detailed Ledger Account (Long Description)</label>
                    <textarea
                      rows={4}
                      value={formLongDesc}
                      onChange={(e) => setFormLongDesc(e.target.value)}
                      required
                      className="w-full bg-[#141416] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00F2FF] text-white font-sans"
                    />
                  </div>
                </div>

                {/* Submissions */}
                <div className="pt-4 border-t border-white/10 flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setEditingEvent(null)}
                    className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white font-mono text-xs rounded-xl border border-white/10 transition-all cursor-pointer"
                  >
                    DISCARD MUTATIONS
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving || isUploading}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#BD00FF] to-[#7A00FF] hover:brightness-110 text-white font-mono text-xs font-bold rounded-xl tracking-widest uppercase transition-all shadow-[0_4px_15px_rgba(189,0,255,0.3)] cursor-pointer flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> SYNCHRONIZING...
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" /> SAVE DEPLOYMENT // SUBMIT
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
