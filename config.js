/**
 * Romantic Anniversary Digital Invitation Configuration
 * Customize all details of your love story and celebration here!
 */
const ANNIVERSARY_CONFIG = {
  // Couple Information
  partner1: "Alexander",
  partner2: "Sophia",
  coupleTitle: "Alexander & Sophia",
  anniversaryYears: "5th", // e.g. "5th", "1st", "10th"
  tagline: "Every Love Story Is Beautiful, But Ours Is My Favorite ❤️",
  invitationTitle: "You're Invited to Celebrate Our Anniversary",
  heroSubtitle: "Another year of laughter, countless memories, and a love that grows stronger with every passing day.",
  
  // Website & Sharing Settings (WhatsApp & Social Media Link Preview Image)
  siteUrl: "", // Optional: Your deployed site domain (e.g. "https://ouranniversary.netlify.app")
  shareImageUrl: "assets/img/romantic_hero_bg.jpg", // Preview image shown when sharing on WhatsApp

  // Audio Settings
  musicUrl: "assets/sound/bkw.mp3", // Romantic audio track
  musicTitle: "A Thousand Years (Piano & Violin)",

  // Event Date & Time (for Countdown & Calendar)
  eventDateISO: "2026-11-20T19:00:00", // YYYY-MM-DDTHH:mm:ss format
  dateText: "Saturday, November 20, 2026",
  timeText: "7:00 PM – 11:00 PM",
  
  // Venue Information
  venueName: "Le Jardin Romantic Dining & Ballroom",
  venueAddress: "742 Evergreen Terrace, Suite 500, New York, NY 10001",
  googleMapsUrl: "https://maps.google.com/?q=742+Evergreen+Terrace+New+York",
  dressCode: "Elegant & Romantic (Burgundy, Gold & Dark Tie)",

  // Opening Envelope Text & Secret Letter
  openingText: "Someone has a little surprise for you…",
  letterOpeningMessage: "To My Dearest Love,\n\nFive years ago, two paths crossed and created a story more beautiful than I ever dreamed. Today, I invite you to step into our magical world and celebrate every milestone, every laugh, and every promise of forever.\n\nWith all my love ❤️",

  // Interactive Love Story Timeline Milestones
  timeline: [
    {
      id: "meet",
      icon: "✨",
      date: "October 14, 2021",
      title: "The Day We Met",
      message: "A casual coffee shop glance turned into a conversation that lasted until the stars filled the night sky. We knew right then something extraordinary had begun.",
      photo: "assets/img/gallery-bokeh.jpg"
    },
    {
      id: "talk",
      icon: "💕",
      date: "November 02, 2021",
      title: "Our First Conversation",
      message: "Hours disappeared like minutes. Talking to you felt as natural as breathing, like finding a home I didn't know I was looking for.",
      photo: "assets/img/couple.jpg"
    },
    {
      id: "date",
      icon: "🌹",
      date: "December 18, 2021",
      title: "Our First Date",
      message: "Dinner under candlelit lanterns, nervous laughter, and a magical walk in the crisp night air. That evening sealed our hearts together.",
      photo: "assets/img/gallery-lanterns.jpg"
    },
    {
      id: "love",
      icon: "💖",
      date: "February 14, 2022",
      title: "The Moment We Fell in Love",
      message: "Under a blanket of soft snow and quiet starlight, holding hands, we both realized we had found our soulmate and forever partner.",
      photo: "assets/img/story-forest.jpg"
    },
    {
      id: "memory",
      icon: "💍",
      date: "November 20, 2024",
      title: "Our Most Beautiful Memory",
      message: "Whispering promises of eternal love under a canopy of romantic white lights and rose petals, promising to stand together forever.",
      photo: "assets/img/hero-castle-alt.jpg"
    },
    {
      id: "forever",
      icon: "♾️",
      date: "Today & Forever",
      title: "Another Year of Forever",
      message: "Celebrating another year of shared dreams, boundless joy, and an enduring love that grows deeper with every single heartbeat.",
      photo: "assets/img/gallery-couple.jpg"
    }
  ],

  // Romantic Photo Gallery (6 polaroid style photos)
  gallery: [
    { url: "assets/img/couple.jpg", caption: "Our Favorite Golden Hour Sunset Walk", tag: "Golden Hour" },
    { url: "assets/img/gallery-roses.jpg", caption: "Fresh Red Roses & Candlelight Evenings", tag: "Pure Romance" },
    { url: "assets/img/gallery-couple.jpg", caption: "Laughter, Warm Hugs & Sweet Memories", tag: "Together" },
    { url: "assets/img/gallery-lanterns.jpg", caption: "Under the Warm Glowing Lanterns", tag: "Magical Night" },
    { url: "assets/img/gallery-sunset.jpg", caption: "Holding Hands by the Peaceful Shore", tag: "Ocean Breeze" },
    { url: "assets/img/story-forest.jpg", caption: "Enchanted Escape into the Woods", tag: "Forever Mine" }
  ],

  // Interactive Love Notes (6 cards)
  loveNotes: [
    { id: 1, text: "You make ordinary days feel extraordinary." },
    { id: 2, text: "Your smile is still my favorite sight." },
    { id: 3, text: "You make me feel at home wherever we are." },
    { id: 4, text: "You understand me in ways words cannot explain." },
    { id: 5, text: "Every memory with you is worth keeping." },
    { id: 6, text: "If I had to choose again, I would still choose you." }
  ],

  // Interactive Anniversary Surprise Box Message
  surpriseHeading: "There's One More Thing…",
  surpriseMessage: "My favorite place in the world will always be beside you. Thank you for being part of my life, my happiness, and my forever. Here's to every beautiful memory we've made and every wonderful moment still waiting for us. I love you, today and always. ❤️",

  // Final Closing Quote
  finalTitle: "One Lifetime Would Never Be Enough.",
  finalSubtitle: "Here's to us, to our story, and to a love that keeps choosing each other — again and again, forever."
};

// Global window registration
if (typeof window !== 'undefined') {
  window.ANNIVERSARY_CONFIG = ANNIVERSARY_CONFIG;
}
