import React, { useState } from 'react';
import { X, Users, CheckCircle2, XCircle, Clock, Download, Plus, Search, Trash2, Edit3, Share2, Utensils, Bus, RefreshCw, Save } from 'lucide-react';
import { Guest, WeddingDetails, MealOption } from '../types/wedding';
import { weddingStorage } from '../services/weddingStorage';

interface CouplePortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  guests: Guest[];
  details: WeddingDetails;
  onGuestsUpdated: (updatedGuests: Guest[]) => void;
  onDetailsUpdated: (updatedDetails: WeddingDetails) => void;
  onInviteGuest: (guest: Guest) => void;
}

export const CouplePortalModal: React.FC<CouplePortalModalProps> = ({
  isOpen,
  onClose,
  guests,
  details,
  onGuestsUpdated,
  onDetailsUpdated,
  onInviteGuest,
}) => {
  const [activeTab, setActiveTab] = useState<'guests' | 'analytics' | 'settings'>('guests');
  const [filterStatus, setFilterStatus] = useState<'all' | 'attending' | 'declined' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Add Guest Modal / State
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestEmail, setNewGuestEmail] = useState('');
  const [newGuestSeats, setNewGuestSeats] = useState(2);

  // Settings editable state
  const [editableDetails, setEditableDetails] = useState<WeddingDetails>(details);
  const [settingsSaved, setSettingsSaved] = useState(false);

  if (!isOpen) return null;

  // Filtered guests
  const filteredGuests = guests.filter((g) => {
    const matchesFilter = filterStatus === 'all' || g.status === filterStatus;
    const cleanSearch = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      g.name.toLowerCase().includes(cleanSearch) ||
      (g.email && g.email.toLowerCase().includes(cleanSearch)) ||
      g.inviteCode.toLowerCase().includes(cleanSearch);
    return matchesFilter && matchesSearch;
  });

  // Analytics Math
  const totalInvitedGuests = guests.length;
  const totalSeatsAllotted = guests.reduce((sum, g) => sum + (g.allottedSeats || 1), 0);
  const attendingGuests = guests.filter((g) => g.status === 'attending');
  const totalAttendingHeadcount = attendingGuests.reduce(
    (sum, g) => sum + (g.attendingCount || (g.hasPlusOne ? 2 : 1)),
    0
  );
  const declinedCount = guests.filter((g) => g.status === 'declined').length;
  const pendingCount = guests.filter((g) => g.status === 'pending').length;

  // Meal counts
  const mealCounts: Record<string, number> = {
    'Herb-Crusted Filet Mignon': 0,
    'Pan-Seared Mediterranean Sea Bass': 0,
    'Truffle & Wild Mushroom Risotto (V/GF)': 0,
    'Other / Unspecified': 0,
  };

  attendingGuests.forEach((g) => {
    if (g.mealChoice && mealCounts[g.mealChoice] !== undefined) {
      mealCounts[g.mealChoice]++;
    } else if (g.mealChoice) {
      mealCounts['Other / Unspecified']++;
    }
    if (g.hasPlusOne && g.plusOneMealChoice) {
      if (mealCounts[g.plusOneMealChoice] !== undefined) {
        mealCounts[g.plusOneMealChoice]++;
      } else {
        mealCounts['Other / Unspecified']++;
      }
    }
  });

  const shuttleHeadcount = attendingGuests.filter((g) => g.needsShuttle).length;

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;

    const randomCode = 'WED-' + Math.floor(1000 + Math.random() * 9000);
    const added = weddingStorage.addGuest({
      name: newGuestName.trim(),
      email: newGuestEmail.trim(),
      inviteCode: randomCode,
      allottedSeats: newGuestSeats,
      status: 'pending',
    });

    onGuestsUpdated(weddingStorage.getGuests());
    setNewGuestName('');
    setNewGuestEmail('');
    setNewGuestSeats(2);
    setShowAddGuest(false);
  };

  const handleStatusChange = (id: string, newStatus: 'attending' | 'declined' | 'pending') => {
    weddingStorage.updateGuest(id, {
      status: newStatus,
      rsvpDate: newStatus !== 'pending' ? new Date().toISOString().split('T')[0] : undefined,
    });
    onGuestsUpdated(weddingStorage.getGuests());
  };

  const handleDeleteGuest = (id: string, name: string) => {
    if (confirm(`Remove ${name} from guest list?`)) {
      weddingStorage.deleteGuest(id);
      onGuestsUpdated(weddingStorage.getGuests());
    }
  };

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    weddingStorage.saveDetails(editableDetails);
    onDetailsUpdated(editableDetails);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const handleResetData = () => {
    if (confirm('Reset to initial sample guests and wedding configuration?')) {
      weddingStorage.resetAll();
      onGuestsUpdated(weddingStorage.getGuests());
      onDetailsUpdated(weddingStorage.getDetails());
      setEditableDetails(weddingStorage.getDetails());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-5xl bg-[#FAF8F5] rounded-lg shadow-2xl border border-[#D5C7B7] overflow-hidden my-8">
        {/* Header */}
        <div className="bg-[#1A1918] text-white px-6 py-5 flex items-center justify-between border-b border-[#D8B77D]/40">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#E7CFA3] font-medium">
                Organizer Dashboard
              </span>
              <span className="text-white/40">·</span>
              <span className="text-xs text-white/70">Eleanor &amp; Arthur</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif text-white mt-0.5">
              Wedding Guest List &amp; RSVP Management
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => weddingStorage.exportCsv()}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#1A1918] bg-[#E7CFA3] hover:bg-[#F3E5AB] rounded-sm cursor-pointer shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-white/70 hover:text-white rounded-md hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="px-6 border-b border-[#E8E2D9] bg-white flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('guests')}
              className={`py-3.5 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
                activeTab === 'guests'
                  ? 'border-[#8C6B45] text-[#8C6B45]'
                  : 'border-transparent text-[#7A7269] hover:text-[#1A1918]'
              }`}
            >
              Guest List ({guests.length})
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-3.5 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
                activeTab === 'analytics'
                  ? 'border-[#8C6B45] text-[#8C6B45]'
                  : 'border-transparent text-[#7A7269] hover:text-[#1A1918]'
              }`}
            >
              Catering &amp; Logistics
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-3.5 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
                activeTab === 'settings'
                  ? 'border-[#8C6B45] text-[#8C6B45]'
                  : 'border-transparent text-[#7A7269] hover:text-[#1A1918]'
              }`}
            >
              Event Details
            </button>
          </div>

          <button
            onClick={() => weddingStorage.exportCsv()}
            className="sm:hidden text-xs text-[#8C6B45] font-semibold underline"
          >
            Export CSV
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {/* TAB 1: GUESTS */}
          {activeTab === 'guests' && (
            <div className="space-y-6">
              {/* Quick Stat Bar (Clean unboxed figures with tabular-nums) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-4 rounded-md border border-[#E0D5C7]">
                  <span className="text-[11px] uppercase tracking-wider text-[#7A7269] font-medium block">
                    Total Parties
                  </span>
                  <span className="text-2xl font-serif font-bold text-[#1A1918] tabular-nums">
                    {totalInvitedGuests}
                  </span>
                  <span className="text-xs text-[#5C554E] block mt-0.5">
                    {totalSeatsAllotted} max seats
                  </span>
                </div>

                <div className="bg-white p-4 rounded-md border border-[#CDE1CE]">
                  <span className="text-[11px] uppercase tracking-wider text-emerald-800 font-medium block">
                    Confirmed Attending
                  </span>
                  <span className="text-2xl font-serif font-bold text-emerald-900 tabular-nums">
                    {totalAttendingHeadcount}
                  </span>
                  <span className="text-xs text-emerald-700 block mt-0.5">
                    {attendingGuests.length} parties
                  </span>
                </div>

                <div className="bg-white p-4 rounded-md border border-[#F3CECE]">
                  <span className="text-[11px] uppercase tracking-wider text-rose-800 font-medium block">
                    Declined
                  </span>
                  <span className="text-2xl font-serif font-bold text-rose-900 tabular-nums">
                    {declinedCount}
                  </span>
                  <span className="text-xs text-rose-700 block mt-0.5">parties unable</span>
                </div>

                <div className="bg-white p-4 rounded-md border border-[#E0D5C7]">
                  <span className="text-[11px] uppercase tracking-wider text-[#8C6B45] font-medium block">
                    Awaiting Response
                  </span>
                  <span className="text-2xl font-serif font-bold text-[#8C6B45] tabular-nums">
                    {pendingCount}
                  </span>
                  <span className="text-xs text-[#7A7269] block mt-0.5">pending follow-up</span>
                </div>
              </div>

              {/* Toolbar: Search, Filters & Add Guest */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex flex-1 items-center gap-2">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-4 h-4 text-[#7A7269] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search guests by name or code..."
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#D5C7B7] rounded-sm focus:outline-none focus:border-[#8C6B45]"
                    />
                  </div>

                  {/* Filter segmented buttons */}
                  <div className="flex items-center gap-1 p-1 bg-[#E8E2D9] rounded">
                    <button
                      onClick={() => setFilterStatus('all')}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded cursor-pointer transition-colors ${
                        filterStatus === 'all' ? 'bg-white text-[#1A1918] shadow-sm' : 'text-[#5C554E]'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilterStatus('attending')}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded cursor-pointer transition-colors ${
                        filterStatus === 'attending' ? 'bg-white text-emerald-800 shadow-sm' : 'text-[#5C554E]'
                      }`}
                    >
                      Attending
                    </button>
                    <button
                      onClick={() => setFilterStatus('declined')}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded cursor-pointer transition-colors ${
                        filterStatus === 'declined' ? 'bg-white text-rose-800 shadow-sm' : 'text-[#5C554E]'
                      }`}
                    >
                      Declined
                    </button>
                    <button
                      onClick={() => setFilterStatus('pending')}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded cursor-pointer transition-colors ${
                        filterStatus === 'pending' ? 'bg-white text-[#8C6B45] shadow-sm' : 'text-[#5C554E]'
                      }`}
                    >
                      Pending
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setShowAddGuest(!showAddGuest)}
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#8C6B45] text-white hover:bg-[#745533] rounded-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Guest</span>
                </button>
              </div>

              {/* Add Guest Inline Form */}
              {showAddGuest && (
                <form onSubmit={handleAddGuest} className="p-4 bg-white rounded-md border border-[#8C6B45]/40 space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#8C6B45] block">
                    Add Guest Party to List
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] uppercase font-semibold text-[#5C554E] mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={newGuestName}
                        onChange={(e) => setNewGuestName(e.target.value)}
                        placeholder="e.g. Julian Henderson"
                        className="w-full px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#D5C7B7] rounded-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase font-semibold text-[#5C554E] mb-1">
                        Email (Optional)
                      </label>
                      <input
                        type="email"
                        value={newGuestEmail}
                        onChange={(e) => setNewGuestEmail(e.target.value)}
                        placeholder="guest@example.com"
                        className="w-full px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#D5C7B7] rounded-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase font-semibold text-[#5C554E] mb-1">
                        Reserved Seats
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={6}
                        value={newGuestSeats}
                        onChange={(e) => setNewGuestSeats(parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#D5C7B7] rounded-sm"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddGuest(false)}
                      className="px-3 py-1 text-xs text-[#5C554E] hover:text-[#1A1918]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider bg-[#8C6B45] text-white rounded-sm"
                    >
                      Save Guest
                    </button>
                  </div>
                </form>
              )}

              {/* Guest Table */}
              <div className="bg-white rounded-md border border-[#E0D5C7] overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#F2ECE4] border-b border-[#E0D5C7] text-[#5C554E] uppercase tracking-wider text-[11px] font-semibold">
                      <th className="py-3 px-4">Guest</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Seats</th>
                      <th className="py-3 px-3">Meal Selection</th>
                      <th className="py-3 px-3">Shuttle</th>
                      <th className="py-3 px-3">Invite Code</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E2D9]">
                    {filteredGuests.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-[#7A7269]">
                          No guests match your criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredGuests.map((g) => {
                        const statusColor =
                          g.status === 'attending'
                            ? 'text-emerald-700 font-semibold'
                            : g.status === 'declined'
                            ? 'text-rose-700 font-semibold'
                            : 'text-[#8C6B45] font-semibold';

                        return (
                          <tr key={g.id} className="hover:bg-[#FAF8F5] transition-colors">
                            <td className="py-3.5 px-4">
                              <p className="font-medium text-[#1A1918]">{g.name}</p>
                              {g.hasPlusOne && g.plusOneName && (
                                <p className="text-[11px] text-[#7A7269] italic">
                                  + {g.plusOneName}
                                </p>
                              )}
                              {g.email && <p className="text-[11px] text-[#7A7269]">{g.email}</p>}
                            </td>
                            <td className="py-3.5 px-3">
                              <select
                                value={g.status}
                                onChange={(e) => handleStatusChange(g.id, e.target.value as any)}
                                className={`text-[11px] px-2 py-1 rounded bg-[#FAF8F5] border border-[#D5C7B7] cursor-pointer ${statusColor}`}
                              >
                                <option value="attending">Attending</option>
                                <option value="declined">Declined</option>
                                <option value="pending">Pending</option>
                              </select>
                            </td>
                            <td className="py-3.5 px-3 tabular-nums">
                              {g.status === 'attending' ? (
                                <span className="font-semibold text-emerald-800">
                                  {g.attendingCount || 1} / {g.allottedSeats}
                                </span>
                              ) : (
                                <span className="text-[#7A7269]">{g.allottedSeats} reserved</span>
                              )}
                            </td>
                            <td className="py-3.5 px-3 max-w-[180px]">
                              {g.status === 'attending' ? (
                                <div>
                                  <p className="truncate font-medium">{g.mealChoice || 'Not selected'}</p>
                                  {g.dietaryRestrictions && g.dietaryRestrictions !== 'None' && (
                                    <p className="text-[10px] text-amber-800 truncate">
                                      Allergy: {g.dietaryRestrictions}
                                    </p>
                                  )}
                                  {g.hasPlusOne && g.plusOneMealChoice && (
                                    <p className="text-[10px] text-[#7A7269] truncate">
                                      +1: {g.plusOneMealChoice}
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <span className="text-[#A59D94]">—</span>
                              )}
                            </td>
                            <td className="py-3.5 px-3">
                              {g.needsShuttle ? (
                                <span className="text-emerald-700 font-medium">Yes</span>
                              ) : (
                                <span className="text-[#A59D94]">No</span>
                              )}
                            </td>
                            <td className="py-3.5 px-3 font-mono text-[11px] text-[#5C554E]">
                              {g.inviteCode}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => onInviteGuest(g)}
                                  title="Send Personalized Invite"
                                  className="p-1.5 text-[#8C6B45] hover:bg-[#FAF2E6] rounded cursor-pointer"
                                >
                                  <Share2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteGuest(g.id, g.name)}
                                  title="Delete Guest"
                                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: CATERING & LOGISTICS ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Entree Counts */}
                <div className="bg-white p-5 rounded-md border border-[#E0D5C7] space-y-4">
                  <div className="flex items-center gap-2 border-b border-[#F0EBE1] pb-3">
                    <Utensils className="w-4 h-4 text-[#8C6B45]" />
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-[#1A1918]">
                      Entrée Counts for Chef &amp; Catering
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {Object.entries(mealCounts).map(([dish, count]) => (
                      <div key={dish} className="flex items-center justify-between p-3 rounded bg-[#FAF8F5] border border-[#E8E2D9]">
                        <div>
                          <p className="font-serif font-bold text-sm text-[#1A1918]">{dish}</p>
                          <p className="text-[11px] text-[#7A7269]">Confirmed plated orders</p>
                        </div>
                        <span className="font-serif text-2xl font-bold text-[#8C6B45] tabular-nums">
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Transportation & Dietary */}
                <div className="space-y-6">
                  {/* Shuttle Bus */}
                  <div className="bg-white p-5 rounded-md border border-[#E0D5C7] space-y-3">
                    <div className="flex items-center gap-2 border-b border-[#F0EBE1] pb-3">
                      <Bus className="w-4 h-4 text-[#8C6B45]" />
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-[#1A1918]">
                        Florence Shuttle Bus Logistics
                      </h3>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded bg-[#FAF8F5] border border-[#E8E2D9]">
                      <div>
                        <p className="font-medium text-sm text-[#1A1918]">Round-Trip Private Shuttle</p>
                        <p className="text-xs text-[#5C554E]">Pickup: Florence Santa Maria Novella station</p>
                      </div>
                      <span className="font-serif text-2xl font-bold text-emerald-800 tabular-nums">
                        {shuttleHeadcount} guests
                      </span>
                    </div>
                  </div>

                  {/* Dietary Restrictions Log */}
                  <div className="bg-white p-5 rounded-md border border-[#E0D5C7] space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-[#1A1918] border-b border-[#F0EBE1] pb-3">
                      Special Dietary Requirements Reported
                    </h3>
                    <div className="space-y-2">
                      {attendingGuests
                        .filter((g) => (g.dietaryRestrictions && g.dietaryRestrictions !== 'None') || g.plusOneDietary)
                        .map((g) => (
                          <div key={g.id} className="text-xs p-2.5 rounded bg-[#FAF8F5] border border-[#E8E2D9] flex justify-between">
                            <span className="font-semibold text-[#1A1918]">{g.name}</span>
                            <span className="text-amber-900 font-medium">
                              {g.dietaryRestrictions || g.plusOneDietary}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EVENT SETTINGS */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveDetails} className="space-y-6 max-w-2xl bg-white p-6 rounded-md border border-[#E0D5C7]">
              <div className="border-b border-[#F0EBE1] pb-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#1A1918]">
                  Wedding Event Information
                </h3>
                <p className="text-xs text-[#7A7269] mt-0.5">
                  Update the couple names, date, venue, dress code, and RSVP deadline.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#5C554E] mb-1">
                    Partner 1
                  </label>
                  <input
                    type="text"
                    value={editableDetails.partner1}
                    onChange={(e) => setEditableDetails({ ...editableDetails, partner1: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-[#D5C7B7] rounded-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#5C554E] mb-1">
                    Partner 2
                  </label>
                  <input
                    type="text"
                    value={editableDetails.partner2}
                    onChange={(e) => setEditableDetails({ ...editableDetails, partner2: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-[#D5C7B7] rounded-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#5C554E] mb-1">
                    Display Date
                  </label>
                  <input
                    type="text"
                    value={editableDetails.displayDate}
                    onChange={(e) => setEditableDetails({ ...editableDetails, displayDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-[#D5C7B7] rounded-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#5C554E] mb-1">
                    RSVP Deadline
                  </label>
                  <input
                    type="text"
                    value={editableDetails.rsvpDeadline}
                    onChange={(e) => setEditableDetails({ ...editableDetails, rsvpDeadline: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-[#D5C7B7] rounded-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-[#5C554E] mb-1">
                    Ceremony Venue
                  </label>
                  <input
                    type="text"
                    value={editableDetails.ceremonyVenue}
                    onChange={(e) => setEditableDetails({ ...editableDetails, ceremonyVenue: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-[#D5C7B7] rounded-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-[#5C554E] mb-1">
                    Ceremony Address
                  </label>
                  <input
                    type="text"
                    value={editableDetails.ceremonyAddress}
                    onChange={(e) => setEditableDetails({ ...editableDetails, ceremonyAddress: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-[#D5C7B7] rounded-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-[#5C554E] mb-1">
                    Dress Code Guidance
                  </label>
                  <input
                    type="text"
                    value={editableDetails.dressCode}
                    onChange={(e) => setEditableDetails({ ...editableDetails, dressCode: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-[#D5C7B7] rounded-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#F0EBE1]">
                <button
                  type="button"
                  onClick={handleResetData}
                  className="text-xs text-rose-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Demo Data</span>
                </button>

                <div className="flex items-center gap-2">
                  {settingsSaved && (
                    <span className="text-xs text-emerald-700 font-semibold">Settings Saved!</span>
                  )}
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold uppercase tracking-wider bg-[#8C6B45] text-white rounded-sm hover:bg-[#745533] flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
