/**
 * Little Boss Birthday Invitation Configuration
 * Customize all party details here!
 */
const BIRTHDAY_CONFIG = {
  // Baby Details
  babyName: "Alexander",
  babyAge: "1",
  babyAgeOrdinal: "1st", // e.g. "1st", "2nd"
  tagline: "Our Little Boss Is Turning 1!",
  subtitle: "Come Celebrate With Us!",
  
  // Audio Settings
  musicUrl: "assets/sound/hbd.mp3",
  autoPlayMusic: true,

  // Event Date & Time
  eventDateISO: "2026-11-20T16:00:00", // Format: YYYY-MM-DDTHH:mm:ss for countdown
  dateText: "Saturday, November 20, 2026",
  timeText: "4:00 PM – 8:00 PM",
  
  // Venue Information
  venueName: "The Grand Executive Ballroom",
  venueAddress: "742 Evergreen Terrace, Suite 500, New York, NY 10001",
  googleMapsUrl: "https://maps.google.com/?q=742+Evergreen+Terrace+New+York",
  
  // Little Boss Bio & Stats
  bossQuote: "Our little boss is growing up! Come join us as we celebrate another amazing year filled with smiles, laughter and lots of cake.",
  stats: [
    { icon: "🍼", label: "Favorite Drink", value: "Warm Milk (Double Shot)" },
    { icon: "🧸", label: "Working Hours", value: "Nap Time & Play Time" },
    { icon: "💼", label: "Boss Moves", value: "Standing Up & Giggling" },
    { icon: "⭐", label: "CEO Experience", value: "1 Full Year of Household Management" }
  ],
  
  // Party Highlights
  highlights: [
    { title: "Cake Cutting", desc: "Watch the Little Boss smash his 1st birthday cake!", icon: "🎂" },
    { title: "Balloon Fun", desc: "Magical balloon twisting & floating creation station", icon: "🎈" },
    { title: "Gifts & Surprises", desc: "Bring joy & love to our tiny Chief Executive", icon: "🎁" },
    { title: "Baby Games", desc: "Playful interactive mini-games for kids and adults", icon: "🎉" },
    { title: "Sweet Treats Bar", desc: "Cupcakes, candy bar & delicious custom delights", icon: "🍭" },
    { title: "Memory Booth", desc: "Capture fun photo memories with Little Boss props", icon: "📸" }
  ],

  // Gallery Photos
  gallery: [
    { url: "assets/images/hero.jpg", title: "CEO at Work", tag: "Little Boss" },
    { url: "assets/images/cake.jpg", title: "Official Birthday Cake", tag: "Cake" },
    { url: "assets/images/gallery1.jpg", title: "Milestone Smiles", tag: "1 Year Old" },
    { url: "assets/images/gallery2.jpg", title: "Smash Cake Time", tag: "Smash Cake" },
    { url: "assets/images/gallery3.jpg", title: "Boss Stance", tag: "Little Boss" }
  ]
};

// Export for module or global use
if (typeof window !== 'undefined') {
  window.BIRTHDAY_CONFIG = BIRTHDAY_CONFIG;
}
