import React, { useState } from 'react';
import { Heart, Send, Sparkles, MessageCircle } from 'lucide-react';
import { GuestbookMessage } from '../types/wedding';
import { weddingStorage } from '../services/weddingStorage';

interface GuestbookSectionProps {
  messages: GuestbookMessage[];
  onMessageAdded: (messages: GuestbookMessage[]) => void;
}

export const GuestbookSection: React.FC<GuestbookSectionProps> = ({
  messages,
  onMessageAdded,
}) => {
  const [authorName, setAuthorName] = useState('');
  const [messageText, setMessageText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !messageText.trim()) return;

    setIsSubmitting(true);
    weddingStorage.addGuestbookMessage({
      id: 'msg-' + Date.now(),
      author: authorName.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      message: messageText.trim(),
      status: 'friend',
    });

    onMessageAdded(weddingStorage.getGuestbook());
    setAuthorName('');
    setMessageText('');
    setIsSubmitting(false);
  };

  return (
    <section id="guestbook" className="py-24 sm:py-32 bg-[#F5F0E8] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#8C6B45]">
            Wishes &amp; Blessings
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#1A1918] mt-2 tracking-tight">
            The Wedding Guestbook
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#5C554E] font-serif italic">
            Warm thoughts, blessings, and well-wishes from our loved ones near and far
          </p>
          <div className="w-16 h-px bg-[#D8B77D] mx-auto mt-4" />
        </div>

        {/* 2-Column: Form on left or top, messages grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Write a Message Form (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-md border border-[#E0D5C7] shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-4 h-4 text-[#8C6B45] fill-[#8C6B45]" />
              <h3 className="text-base font-serif font-bold text-[#1A1918]">
                Leave a Toast or Note
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C554E] mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Aunt Maria &amp; Uncle Marco"
                  className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-[#D5C7B7] rounded-sm focus:outline-none focus:border-[#8C6B45]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C554E] mb-1">
                  Your Blessing or Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Share a toast, favorite memory, or warm wish for Eleanor and Arthur..."
                  className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-[#D5C7B7] rounded-sm focus:outline-none focus:border-[#8C6B45]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#8C6B45] hover:bg-[#745533] rounded-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Sign the Guestbook</span>
              </button>
            </form>
          </div>

          {/* Messages Scroll Area (7 cols) */}
          <div className="lg:col-span-7 space-y-4 max-h-[520px] overflow-y-auto pr-1">
            {messages.length === 0 ? (
              <div className="bg-white p-8 rounded-md border border-[#E0D5C7] text-center text-[#7A7269]">
                Be the first to sign the guestbook!
              </div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className="bg-white p-5 rounded-md border border-[#E0D5C7] shadow-xs relative"
                >
                  <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-2 mb-2">
                    <p className="font-serif font-bold text-base text-[#1A1918]">
                      {m.author}
                    </p>
                    <span className="text-[11px] text-[#7A7269]">{m.date}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#5C554E] leading-relaxed italic font-serif">
                    "{m.message}"
                  </p>
                  {m.status === 'attending' && (
                    <span className="mt-2 text-[10px] text-emerald-800 font-medium inline-block">
                      · Confirmed Attending
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
