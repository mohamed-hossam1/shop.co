# Quickstart: Admin Analytics Dashboard

## Prerequisites
- Node.js and npm available locally.
- Supabase env vars configured in the existing project setup.
- A user with admin privileges for accessing `/admin`.

## Run the App
```bash
npm install
npm run dev
```

## Verify the Feature
1. Open `/admin` while signed in as an admin.
2. Confirm the page defaults to the last 30 days and shows KPI cards, trend charts, and the recent transactions table.
3. Change the range using the filter bar to `last_7_days`, `mtd`, and `custom`.
4. For `custom`, test both a valid span and an invalid `from > to` case.
5. Confirm module shortcut cards still appear below the analytics blocks.
6. Open a recent transaction row and verify it links to the matching admin order detail page.

## Behavior to Check
- Non-admin access remains blocked.
- Revenue reflects delivered orders only.
- Empty ranges render gracefully.
- Query string changes update the dashboard state.
