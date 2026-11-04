# BorlaGo progress

Last updated: 4 November 2026

## Build steps

- Steps 1–3 done: Expo Router, shared theme, Poppins, Welcome, and fake phone sign-in with name entry. Confirmed on the phone.
- Step 4 built: location setup and usual-waste setup. Still needs an iPhone check before moving on.
- Steps 5 onward not built. Home is only a placeholder showing saved details.

## What we did today

- Built the Welcome screen, tightened the logo spacing, and made a centred copy of the background artwork.
- Built phone entry, four code boxes, resend countdown, and name entry. The fake correct code is `1234`; no SMS is sent.
- Added GPS permission, a draggable map, address lookup with coordinates as a fallback, and an optional landmark.
- Added waste size, quantity (1–10), type, and an optional photo.
- Saved setup on the phone with AsyncStorage and kept photos in app files. Completed setup opens Home directly; Reset returns to Welcome.
- TypeScript, iPhone bundling, five storage tests, and Expo Doctor (20/20) passed.

## Still to check or finish

- Check step 4 in Expo Go: allow and deny location permission, drag the map, pick a photo, save, reopen, and reset.
- No confirmed step 4 bugs yet; native phone behaviour and the screen layouts still need checking.
- Login is fake. Names are remembered only until the app restarts. The collector link does nothing yet.
- No Supabase or real pickup requests. Current changes have not been committed.

## Next step

Run `npx.cmd expo start --clear` and check step 4 on the iPhone first. Fix any issues, then build step 5: the real Home screen from `design/screens/05-home.png`.
