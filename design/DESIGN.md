# BorlaGo — Design Guide

Every screen must match the pictures in `design/screens/`. This file explains the rules behind them.

## 1. Colours

Three brand colours, plus neutrals. Put them all in `constants/theme.ts`.

| Name | Hex | Use |
|---|---|---|
| `primary` (royal blue) | `#1F6FEB` | Main buttons, selected items, links, map pins |
| `navy` | `#0E1F45` | Main text, dark backgrounds, collector app header |
| `accent` (orange) | `#F7931E` | Small accents only (see section 4) |
| `welcomeBlue` | `#1E56C3` | Welcome screen background behind the image |
| `background` | `#F3F6FC` | Screen background |
| `surface` | `#FFFFFF` | Cards, inputs, bottom sheets |
| `surfaceTint` | `#EAF1FE` | Selected cards, icon tiles |
| `border` | `#DCE3F0` | Card and input borders, dividers |
| `textMuted` | `#5A6478` | Secondary text, labels |
| `danger` | `#B42318` | "Cancel request" only |
| `warningBg` / `warningText` | `#FFF0DD` / `#9A4F00` | "Collector found" badge, collector notes |

## 2. Font: Poppins

Use `@expo-google-fonts/poppins` (weights 400, 500, 600, 700, 800).

| Text | Size | Weight |
|---|---|---|
| Screen title | 26–30 | 700 |
| Section label | 14–16 | 700 |
| Body text | 15 | 400–600 |
| Helper / muted text | 13 | 400, `textMuted` |
| Big numbers (price, arrival time) | 26–44 | 800 |
| Logo word | "Borla" + "Go" written as one word: **BorlaGo**. On light screens "Go" is blue; on blue screens "Borla" is white and "Go" is orange. | 800 |

## 3. Shapes and spacing

- Screen side padding: 20
- Gap between sections: 16
- Corner radius: buttons 18 (welcome button fully round), cards 16–18, inputs 14, pills fully round, bottom sheets 26 (top corners only)
- Touch targets at least 44 high
- Flat design: no shadows, no gradients

## 4. Where orange is used

Orange is the colour of the wheel in the logo. Use it as a **small accent**, never for large areas:

- The arrow icon inside main blue buttons (Continue →, Find Collector →, Pay →)
- A small dot under the active tab in the bottom menu
- The centre of map pins
- The tick badge on a selected option card, and a small dot on a selected pill
- Initials in avatars (orange on navy)
- Progress bars (Accepted · On the way · Collected), the collector's countdown ring, rating stars
- Money highlights: "GH₵" on the payment amount, today's earnings
- The ring around the success tick on "Your borla is gone!"

**Do not** put an orange line under titles, and **no orange ring** around the Find Collector button.

## 5. Components

| Component | Look |
|---|---|
| Primary button | Full width, 58 high, blue, white bold 18 text, orange arrow icon, radius 18. Exception: on the blue welcome screen the button is white with blue text |
| Secondary button | 50–58 high, white, 1px border, navy text |
| Card | White, radius 16–18, padding 14 |
| Option card (size picker) | White card: icon, title, one-line description. Selected = 2px blue border + `surfaceTint` + orange tick badge top-right |
| Pill / chip | 38–40 high, fully round. Selected = blue with white text and a small orange dot |
| Input | 50 high, white, 1px border, radius 14. Active code box = orange border |
| Status steps | 3 bars side by side. Done = orange, not yet = border colour |
| Bottom sheet | White panel over a map, top radius 26, small grey grab handle |
| Bottom tab bar | Home · Pickups · Wallet · Profile. Active = blue + orange dot underneath |
| Icons | Outline, 2px stroke (`lucide-react-native`) |

## 6. Screens

| # | File | Screen |
|---|---|---|
| 01 | `01-welcome.png` | Full-screen image (`design/images/welcome-hero.jpg`), logo on top, headline, **white** Continue button with blue text, "Are you a collector? Join here" |
| 02 | `02-sign-in.png` | Phone number (+233), 4-digit SMS code, Continue |
| 03 | `03-setup-location.png` | One-time setup, step 1 of 2: map with pin, "Where is your waste?", pickup spot, optional landmark, "Save my location" |
| 04 | `04-setup-usual-waste.png` | One-time setup, step 2 of 2: size cards, how many, waste type, optional photo, "Save and finish" |
| 05 | `05-home.png` | Logo + avatar, saved home address + Change, **big round blue Find Collector button** (soft blue glow, no orange ring), "collectors within 3 km", usual-waste card + "Different today?", tab bar |
| 06 | `06-different-today.png` | Optional: change the waste for this pickup only, then "Find Collector". No price shown |
| 07 | `07-finding-collector.png` | Radar animation, "within 3 km of your home", 3-step status list, "Cancel request" |
| 08 | `08-no-collector.png` | "No collector available right now", Try again, Back to home |
| 09 | `09-collector-accepted.png` | Map with route, arrival time, status steps, collector card, pickup details |
| 10 | `10-payment.png` | Amount, breakdown, Mobile Money / Cash, Pay |
| 11 | `11-done.png` | "Your borla is gone!", receipt, rating, Done |
| 12 | `12-collector-job-request.png` | Collector online, earnings, job card with countdown, Decline / Accept |
| 13 | `13-collector-active-job.png` | Map with route, customer card, note, "I've arrived", "Mark as collected" |
