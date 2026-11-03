# BorlaGo — Design Guide

Every screen must match the pictures in `design/screens/`. This file explains the rules behind them.

## 1. Colours

Three brand colours, plus neutrals. Put them all in `constants/theme.ts`.

| Name | Hex | Use |
|---|---|---|
| `primary` (royal blue) | `#1F6FEB` | Main buttons, selected items, links, map pins |
| `navy` | `#0E1F45` | Main text, dark backgrounds, collector app header |
| `accent` (orange) | `#F7931E` | Small accents only (see section 4) and the welcome screen button |
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
- The welcome screen's Continue button (orange with navy text)
- A small dot under the active tab in the bottom menu
- The centre of map pins
- The tick badge on a selected option card, and a small dot on a selected pill
- Initials in avatars (orange on navy)
- Progress bars (Accepted · On the way · Collected), the collector's countdown ring, rating stars
- Money highlights: "GH₵" on the payment amount, today's earnings
- The ring around the success tick on "Your borla is gone!"

**Do not** put an orange line under titles.

## 5. Components

| Component | Look |
|---|---|
| Primary button | Full width, 58 high, blue, white bold 18 text, orange arrow icon, radius 18 |
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
| 01 | `01-welcome.png` | Full-screen image (`design/images/welcome-hero.jpg`), logo on top, headline, orange Continue, "Are you a collector? Join here" |
| 02 | `02-sign-in.png` | Phone number (+233), 4-digit SMS code, Continue |
| 03 | `03-home.png` | Logo + avatar, map with detected location, pickup address + Edit, "Describe your waste", tab bar |
| 04 | `04-describe-waste.png` | Size cards, quantity, waste type, note, optional photo, estimated price, "Find Collector" |
| 05 | `05-finding-collector.png` | Radar animation, 3-step status list, "Cancel request" |
| 06 | `06-no-collector.png` | "No collector available right now", Try again, Back to home |
| 07 | `07-collector-accepted.png` | Map with route, arrival time, status steps, collector card, pickup details |
| 08 | `08-payment.png` | Amount, breakdown, Mobile Money / Cash, Pay |
| 09 | `09-done.png` | "Your borla is gone!", receipt, rating, Done |
| 10 | `10-collector-job-request.png` | Collector online, earnings, job card with countdown, Decline / Accept |
| 11 | `11-collector-active-job.png` | Map with route, customer card, note, "I've arrived", "Mark as collected" |
