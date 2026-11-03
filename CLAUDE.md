# BorlaGo — instructions for the AI

Read this file first, every time. It tells you what we are building, how it must look, and how to work with me.

## What we are building

**BorlaGo** is an on-demand waste pickup app for Ghana, like a ride-hailing app for rubbish ("borla").
A customer describes their waste, BorlaGo finds the nearest available collector, the collector comes, the waste is collected and paid for.

Tagline: **Tap. Picked up. Gone.**

This is a university final year project (Computer Science). I must be able to explain every part of the code to my panel.

## About me — how to work with me

- I am a **beginner**. Explain things in simple, plain words. No jargon without explaining it.
- Build **one small step at a time**. Never build several screens in one go.
- After every step, tell me:
  1. which files you created or changed, and what each one does (one line each),
  2. how to check it on my phone (Expo Go),
  3. what the next step will be.
- Keep code **simple and readable**. No clever tricks, no extra libraries unless really needed. If you add a library, tell me why.
- If something is unclear or not decided yet, **ask me** instead of guessing.

## Tech stack

- **React Native + Expo** (Expo Router for screens), **TypeScript**
- **Font:** Poppins (`@expo-google-fonts/poppins`)
- **Icons:** `lucide-react-native` (outline icons)
- **Backend (later, not now):** Supabase — database, login, live updates
- Testing on a real phone with **Expo Go**

## Where to find the design

| What | Where |
|---|---|
| Design rules (colours, font, buttons, cards, orange accents) | `design/DESIGN.md` |
| Picture of every screen — copy these exactly | `design/screens/` |
| All screens on one page | `design/screens/00-all-screens.png` |
| Logo | `design/logo/` |
| Welcome screen background image | `design/images/welcome-hero.jpg` |
| How the app works (the pickup flow, matching, statuses) | `docs/HOW_IT_WORKS.md` |

**Rule:** when you build a screen, open its picture in `design/screens/` and match it as closely as you can: layout, wording, colours, spacing. Names, prices and addresses on the screens are examples only.

## Code rules

- All colours live in **one file**: `constants/theme.ts`. Never type a colour code inside a screen.
- Use **Poppins** everywhere.
- Copy images and logos you need from `design/` into the app's `assets/images/` folder.
- One screen = one file in the `app/` folder (Expo Router).
- Use sample (fake) data for now. Do **not** connect Supabase until I say so.

## Build order

Do these in order. Finish and test one before starting the next.

1. **Setup:** `constants/theme.ts` (colours, font sizes, spacing) and load the Poppins font.
2. **01 Welcome** (`design/screens/01-welcome.png`)
3. **02 Sign in** (phone number + 4-digit code — no real SMS yet)
4. **03 Home** (map can be a placeholder image at first)
5. **04 Describe your waste**
6. **05 Finding your collector** and **06 No collector available**
7. **07 Collector accepted**
8. **08 Payment** and **09 Borla gone**
9. **10 Collector job request** and **11 Collector active job**
10. Later, together: Supabase (login, database), real map and location, the collector matching, live updates.

## Not decided yet — ask me before building these

- How long a collector has to accept a job (suggestion: 30 seconds)
- Is the price fixed by the app, or agreed with the collector?
- Mobile Money, cash, or both? Which Mobile Money provider?
- How we know a collector can carry a certain waste size
- Some features are still being discussed with waste collectors
