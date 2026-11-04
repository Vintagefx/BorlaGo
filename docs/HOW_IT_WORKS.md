# How BorlaGo works

## Who uses it

| Role | What they do |
|---|---|
| Customer | Signs up, requests a pickup, follows its status, pays, rates the collector |
| Collector | Registers and waits for approval, goes online/offline, accepts or declines jobs, marks pickups collected, sees earnings |
| Administrator | Approves collectors, sets prices, views pickups and reports (web, later) |

## The pickup flow

### One-time setup (first time only)
1. **Customer signs in** with their phone number.
2. **Sets their home location** (GPS or move the pin), plus an optional landmark ("blue gate opposite the church"). This is saved, because the waste is always at home.
3. **Describes their usual waste once:** size (small bag, large bag, full bin, bulky item), how many, type (general, plastics, garden, mixed), optional photo. This is saved too.

### Every pickup after that
1. **Customer opens BorlaGo** — it opens straight on Home.
2. **Taps the big Find Collector button.** One tap. The request uses the saved location and saved usual waste. (If today is different, e.g. after a party, they can tap "Different today?" to change the waste **for this pickup only**.)
3. Screen: "Finding your collector… Looking for collectors within 3 km of your home."
4. **BorlaGo finds a collector automatically, one at a time:**
   1. Find collectors who are **online**, **not busy**, **within the search radius (3 km for now)** and **can handle this waste size**.
   2. Sort them by **distance**, closest first.
   3. Send the job request to **the closest one only**.
   4. If they **decline** or **don't answer in time**, send it to the **next closest**.
   5. If nobody is left, show **"No collector available right now"**.
5. **A collector accepts.** The customer sees the collector's name, rating, tricycle number, arrival time and the pickup details. The customer does **not** confirm a price before the collector comes.
6. **Waste is collected and paid for** (Mobile Money or cash). The price is worked out by the app from the waste (for now). The pickup closes and the customer rates the collector.

## Pickup status values

Store the status with exactly these values:

`searching` → `accepted` → `on_the_way` → `arrived` → `collected` → `paid`

plus `no_collector` and `cancelled`.

## Main data (for when we add Supabase)

- **profiles** — every user: name, phone, role (`customer`, `collector`, `admin`), **saved home location + landmark**, **saved usual waste** (size, quantity, type, photo)
- **collectors** — extra collector details: tricycle number, what sizes they can carry, approved yes/no, online yes/no, current location
- **pickups** — one row per request: customer, location, size, quantity, type, note, photo, price, status, assigned collector, times
- **pickup_offers** — each time a job is offered to a collector: which collector, when, and their answer (accepted, declined, no answer)

The `pickup_offers` table is what lets us show the panel exactly how the "one collector at a time" matching worked for each pickup.
