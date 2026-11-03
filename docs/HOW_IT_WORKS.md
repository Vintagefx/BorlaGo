# How BorlaGo works

## Who uses it

| Role | What they do |
|---|---|
| Customer | Signs up, requests a pickup, follows its status, pays, rates the collector |
| Collector | Registers and waits for approval, goes online/offline, accepts or declines jobs, marks pickups collected, sees earnings |
| Administrator | Approves collectors, sets prices, views pickups and reports (web, later) |

## The pickup flow

1. **Customer opens BorlaGo.** Their pickup location is detected by GPS or typed in.
2. **Customer describes the waste:** size (small bag, large bag, full bin, bulky item), quantity, type (general, plastics, garden, mixed), optional note and photo.
3. **Customer taps "Find Collector".** Screen: "Finding your collector… Searching for available collectors near your pickup location."
4. **BorlaGo finds a collector automatically, one at a time:**
   1. Find collectors who are **online**, **not busy**, and **can handle this waste size**.
   2. Sort them by **distance** to the pickup location, closest first.
   3. Send the job request to **the closest one only**.
   4. If they **decline** or **don't answer in time**, send it to the **next closest**.
   5. If nobody is left, show **"No collector available right now"**.
5. **A collector accepts.** The customer sees the collector's name, rating, tricycle number, arrival time and the pickup details.
6. **Waste is collected and paid for** (Mobile Money or cash). The pickup closes and the customer rates the collector.

## Pickup status values

Store the status with exactly these values:

`searching` → `accepted` → `on_the_way` → `arrived` → `collected` → `paid`

plus `no_collector` and `cancelled`.

## Main data (for when we add Supabase)

- **profiles** — every user: name, phone, role (`customer`, `collector`, `admin`)
- **collectors** — extra collector details: tricycle number, what sizes they can carry, approved yes/no, online yes/no, current location
- **pickups** — one row per request: customer, location, size, quantity, type, note, photo, price, status, assigned collector, times
- **pickup_offers** — each time a job is offered to a collector: which collector, when, and their answer (accepted, declined, no answer)

The `pickup_offers` table is what lets us show the panel exactly how the "one collector at a time" matching worked for each pickup.
