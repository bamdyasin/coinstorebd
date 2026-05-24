# COINSTORE.BD - Comprehensive Project Documentation

## 📌 Project Concept
COINSTORE.BD holo Bangladesh-e TikTok ecosystem-er jonno ekta premium service platform. Eta muloto "Serverless" concept-e built, jekhane client-side logic ebong third-party communication-ke priority deoya hoyeche.

---

## 🛠 Technical Architecture

### 1. Dynamic Component Engine
Platform-ti ekta custom JavaScript loader use kore (`loadComponents()` function):
- **Modularization:** Header ebong Footer separate `includes/` folder-e thake.
- **Auto-Path Correction:** `getPathPrefix()` function-er madhome root (`/`) ebong sub-folder (`/pages/` or `/blog/`) theke component fetch korle URL path gulo auto-adjust hoy.
- **Async Fetching:** `fetch()` API use kore async vabe content load kora hoy jate initial page load fast hoy.

### 2. Config-Driven Logic (`config.js`)
Pura system-er heart holo `assets/js/config.js`. Jekhane:
- **Payment Gateway Info:** BKash/Nagad number ebong account type.
- **Service Rates:** Budget-onujayi View/Like/Follower-er conversion rate.
- **Global Variables:** WhatsApp support number ebong social media integration links.

### 3. Smart Ordering & Estimation Logic
- **Estimation Algorithm:** User-er budget-ke `siteConfig.rates` diye gun kore live results dekhano hoy. 
- **Animation System:** `requestAnimationFrame` use kore counters gulo animate kora hoy, ja user interface-ke 'alive' feel koray.
- **Form Persistence:** `localStorage` use kore user-er order history save kora hoy. TrxID check korle ei local storage theke data fetch kore status dekhano hoy.

---

## 🚀 Advanced Functional Features

### 1. Real-time Order Tracking
TrxID search korle system-ti dynamic UI prodon kore:
- **Active Countdown:** Order korar prothom ১ minute porjonto MM:SS format-e live countdown dekhay (Service Received state).
- **Progressive Status:** 
    - < 1 min: *Received* (with countdown)
    - 1 - 10 min: *Pending* (Processing)
    - > 10 min: *Completed*
- **Direct Support Integration:** Prottek order status-er sathe direct WhatsApp chat link thake.

### 2. Payment UI/UX
- **Visual Feedback:** Payment method select korle specific card UI open hoy.
- **Copy-to-Clipboard:** Account number copy korar jonno success feedback system ache.
- **Input Sanitization:** WhatsApp number (11 digit) ebong TrxID-er format-er jonno regex-based validation.

---

## 🎨 Design System & Branding
- **Theme:** "TikTok Dark" aesthetic. 
- **Colors:** Primary `#fe2c55` (TikTok Pink), Secondary `#24E8E3` (TikTok Cyan), and Deep Navy Background.
- **Typography:** 'Hind Siliguri' (Bengali) combined with 'Segoe UI'.
- **Interactivity:** Custom button hover effects, pulse animations for important elements, ebong smooth transitions.

---

## 📈 SEO & Content Strategy
- **Static Site SEO:** Prottekta blog file-e unique canonical tags ebong meta metadata use kora hoyeche.
- **Schema.org Integration:** `Organization` ebong `WebSite` schema (JSON-LD) use kora hoyeche local business rank baranor jonno.
- **Keyword Targeting:** Content gulo high-volume keywords (e.g., "tiktok coin buy bd", "tiktok promotion bangladesh") focus kore likha.

---

## 📁 File System Depth
- `/assets/js/script.js`: Core business logic, form handling, ebong component loading.
- `/assets/js/config.js`: Centralized settings.
- `/assets/css/style.css`: Custom design framework (Dark theme).
- `/blog/`: Content marketing files (15+ articles).
- `/includes/`: Global reusable HTML fragments.

---
*Last Updated: May 23, 2026*
