import React from 'react';
import { MapPin, Plane, Bus, Hotel, Gift, ExternalLink } from 'lucide-react';
import { WeddingDetails } from '../types/wedding';

interface VenueSectionProps {
  details: WeddingDetails;
}

export const VenueSection: React.FC<VenueSectionProps> = ({ details }) => {
  return (
    <section id="venue" className="py-24 sm:py-32 bg-[#FAF8F5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#8C6B45]">
            Destination &amp; Logistics
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#1A1918] mt-2 tracking-tight">
            The Venue &amp; Accommodations
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#5C554E] font-serif italic">
            {details.ceremonyVenue} · Fiesole, Florence
          </p>
          <div className="w-16 h-px bg-[#D8B77D] mx-auto mt-4" />
        </div>

        {/* Gallery Grid of Estate & Reception */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="group overflow-hidden rounded-sm bg-white p-2 shadow-lg border border-[#E0D5C7]">
            <div className="overflow-hidden aspect-4/3 relative">
              <img
                src="/src/assets/images/wedding_venue_estate_1793022884019.jpg"
                alt="Villa Bella Vista Historic Estate in Florence at Twilight"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />
            </div>
            <div className="p-4 bg-white">
              <h3 className="font-serif text-xl text-[#1A1918]">Villa Bella Vista Estate</h3>
              <p className="text-xs text-[#5C554E] mt-1">
                A 16th-century Renaissance villa nestled on the hills of Fiesole, surrounded by century-old olive groves and sweeping vistas of the Florence Duomo.
              </p>
            </div>
          </div>

          <div className="group overflow-hidden rounded-sm bg-white p-2 shadow-lg border border-[#E0D5C7]">
            <div className="overflow-hidden aspect-4/3 relative">
              <img
                src="/src/assets/images/wedding_reception_dinner_1793022883812.jpg"
                alt="Open-air wedding reception dinner banquet under festoon lights"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />
            </div>
            <div className="p-4 bg-white">
              <h3 className="font-serif text-xl text-[#1A1918]">The Belvedere Courtyard</h3>
              <p className="text-xs text-[#5C554E] mt-1">
                Open-air candlelit banquet tables beneath Tuscan string lights, where we will share a 4-course Italian feast, local wines, and dance under the starlight.
              </p>
            </div>
          </div>
        </div>

        {/* Travel, Shuttles & Hotels Bento Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Getting There */}
          <div className="bg-white p-6 sm:p-7 rounded-md border border-[#E0D5C7] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF2E6] flex items-center justify-center text-[#8C6B45]">
              <Plane className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#1A1918]">Arriving in Florence</h3>
            <p className="text-xs sm:text-sm text-[#5C554E] leading-relaxed">
              Nearest international hubs:
            </p>
            <ul className="text-xs text-[#5C554E] space-y-2 list-disc list-inside">
              <li><strong>Florence Airport (FLR)</strong>: 25 minutes by taxi to city center.</li>
              <li><strong>Pisa Airport (PSA)</strong>: 60 minutes via high-speed train or airport express.</li>
              <li><strong>Rome Fiumicino (FCO)</strong>: 1 hour 30 mins via Frecciarossa high-speed train.</li>
            </ul>
          </div>

          {/* Card 2: Guest Shuttles */}
          <div className="bg-white p-6 sm:p-7 rounded-md border border-[#E0D5C7] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF2E6] flex items-center justify-center text-[#8C6B45]">
              <Bus className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#1A1918]">Complimentary Shuttles</h3>
            <p className="text-xs sm:text-sm text-[#5C554E] leading-relaxed">
              {details.accommodationsNote}
            </p>
            <div className="bg-[#FAF8F5] p-3 rounded border border-[#E8E2D9] text-xs text-[#5C554E] space-y-1">
              <p><strong>Departure to Villa:</strong> 2:45 PM &amp; 3:15 PM</p>
              <p><strong>Return to Florence:</strong> 11:30 PM &amp; 1:30 AM</p>
            </div>
          </div>

          {/* Card 3: Registry & Wishing Well */}
          <div className="bg-white p-6 sm:p-7 rounded-md border border-[#E0D5C7] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF2E6] flex items-center justify-center text-[#8C6B45]">
              <Gift className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#1A1918]">Gift Registry &amp; Wishing Well</h3>
            <p className="text-xs sm:text-sm text-[#5C554E] leading-relaxed">
              {details.registryMessage}
            </p>
            <div className="pt-2">
              <button
                onClick={() => alert('Honeymoon Registry: Eleanor Bennett & Arthur James · IBAN / Registry details sent with gratitude.')}
                className="text-xs font-semibold uppercase tracking-wider text-[#8C6B45] hover:text-[#1A1918] inline-flex items-center gap-1 cursor-pointer"
              >
                <span>View Honeymoon Registry</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
