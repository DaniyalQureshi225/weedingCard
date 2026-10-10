# Qawwali Night Digital Invitation Website ✦

A production-ready, interactive, fully responsive digital invitation website for **Qawwali Night & Sufi Mehfil**. Blends traditional Pakistani mehfil culture, Sufi aesthetics, elegant Mughal architectural design, and modern Gen Z luxury styling.

---

## ✨ Features Overview

1. **Interactive Tabla Beat Intro Screen**:
   - Unlock the invitation by tapping/clicking the centerpiece classical Tabla 3 times.
   - Real-time Web Audio API synthesized Tabla sound effects (Dayan high rim hit & Bayyan low sub-bass pitch bend).
   - Animated glowing rings, concentric canvas ripple effects, and 0/3 beat progress dots.
   - Accessibility skip-intro button and sound mute/unmute control.

2. **Main Invitation Hero**:
   - Urdu calligraphy header (*شبِ قوالی و محفلِ سماع*) and serif gold typography.
   - High-resolution Qawwali stage hero visual with gold Mughal arch border.
   - Quick event info pills for date, time, and venue.

3. **Dark & Bright Mode Theme Switcher**:
   - **Midnight Mehfil** (Dark Mode — Default): Midnight black `#080808`, antique gold `#C8A45D`, emerald green `#075B46`.
   - **Royal Ivory** (Bright Mode): Warm ivory `#F8F1E5`, champagne gold `#E8D6A3`, charcoal text.
   - Smooth animated CSS transitions & local storage state persistence.

4. **Save the Date & Live Countdown Timer**:
   - Live ticking countdown (Days, Hours, Minutes, Seconds).
   - Direct **Add to Google Calendar** integration.
   - Downloadable **.ics Calendar File** generator for iOS, Outlook, and Apple Calendar.

5. **Interactive Scratch-to-Reveal Surprise**:
   - HTML5 Canvas with metallic gold foil texture & sparkling glitter.
   - Erases dynamically on touch, mouse drag, or stylus.
   - ~55% scratch threshold auto-clears the foil with an entrance animation.
   - Accessibility text reveal fallback button.

6. **Venue & Location**:
   - Interactive embedded Google Map.
   - Get Directions button & One-click Copy Address button with toast feedback.

7. **Interactive RSVP System**:
   - Toggle between *Attending* and *Regretfully Unable*.
   - Direct **WhatsApp RSVP** button with pre-formatted invitation response message.
   - Online RSVP submission with animated confirmation card.

8. **WhatsApp & Social Media Preview (Open Graph)**:
   - Dedicated 1200×630 luxury preview card asset (`assets/images/qawwali-night-og.jpg`).
   - Netlify Edge Function (`netlify/edge-functions/dynamic-og.js`) serving static & dynamic OG meta tags in initial HTML response.
   - Native Web Share API, WhatsApp share link, and Copy Link buttons.

---

## 🛠️ Configuration (`config.js`)

All event details are centralized in `config.js`:

```javascript
const QAWWALI_CONFIG = {
  hostNames: "The Qureshi Family",
  eventTitle: "Qawwali Night",
  urduTitle: "شبِ قوالی و محفلِ سماع",
  eventDateISO: "2026-11-21T20:00:00",
  dateText: "Saturday, November 21, 2026",
  timeText: "8:00 PM onwards (PKT)",
  timeZone: "Asia/Karachi",
  venueName: "The Royal Palm Mehfil Hall",
  fullAddress: "8-Km Raiwind Road, Thokar Niaz Baig, Lahore, Punjab 54000, Pakistan",
  googleMapsUrl: "https://maps.google.com/?q=Royal+Palm+Golf+and+Country+Club+Lahore",
  dressCode: "Royal Mehfil Attire (Velvet, Sherwanis, Kurta Pajama with Nehru Jackets, Traditional Dupattas / Formal Wear in Emerald, Gold, Black & Maroon)",
  whatsappNumber: "923001234567"
};
```

---

## 📲 Social Preview Test Checklist (WhatsApp, Facebook, Twitter)

To verify rich link previews when sharing on WhatsApp:

1. **Deploy to Production Domain**: Ensure your site is deployed to a public HTTPS domain (e.g. Netlify / Vercel).
2. **Verify Initial HTML Response**: Run `curl -i https://your-domain.netlify.app/` and confirm `<meta property="og:image" ...>` is present in the initial HTML response.
3. **Test with Debuggers**:
   - [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
   - [Twitter / X Card Validator](https://cards-dev.twitter.com/validator)
   - [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
4. **WhatsApp Link Preview**: Copy the live URL and paste it into a WhatsApp chat. Allow 2-3 seconds for WhatsApp to fetch the 1200x630 preview card image (`assets/images/qawwali-night-og.jpg`).

*Note: WhatsApp caches previews aggressively. If you update metadata or images, use Facebook Sharing Debugger to scrape the URL again.*

---

## 🚀 Running Locally

```bash
# Serve static directory using Python or Node
python3 -m http.server 8085

# Open in browser:
http://localhost:8085
```
