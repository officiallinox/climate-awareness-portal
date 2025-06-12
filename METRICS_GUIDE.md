# Climate Awareness Portal - Metrics Guide

This document explains how the key metrics in the Climate Awareness Portal are calculated and how to update them.

## Key Metrics

### Total Article Reads

This metric represents the total number of times articles have been viewed on the platform.

**How it's calculated:**
- Each article has a `viewCount` field in the database
- The total reads is the sum of all article viewCounts

**How to update:**
```
cd backend
node update-article-views.js
```

This script will update all articles with random view counts between 50-200 views.

### CO₂ Saved (kg)

This metric represents the estimated carbon dioxide emissions prevented through user activities.

**How it's calculated:**
- Each outdoor activity saves about 0.5kg CO₂
- Each walking activity saves about 1.2kg CO₂ (vs driving)
- Each cycling activity saves about 2.5kg CO₂ (vs driving)

**Current formula:**
```javascript
carbonSaved = (
    (outdoorActivities * 0.5) + 
    (walkingActivities * 1.2) + 
    (cyclingActivities * 2.5)
).toFixed(1)
```

**How to update:**
You can modify the calculation in `backend/controllers/userController.js` in the `getDashboardStats` function.

## Other Metrics

### User Activities

Activities are tracked in the database with the following types:
- outdoor
- indoor
- sports
- travel
- work

Each activity contributes to the user's environmental impact score.

### Climate Impact

The climate impact is calculated based on:
- Number of eco-friendly activities
- Steps walked (estimated from walking activities)
- Distance cycled (estimated from cycling activities)
- Carbon saved (as described above)

## Updating the Dashboard

The dashboard metrics are updated automatically when users access the admin dashboard. The data is fetched from the `/api/admin/dashboard-stats` endpoint.

To test the dashboard metrics, you can run:
```
cd backend
node test-dashboard-api.js
```

## Customizing Metrics

If you want to customize how metrics are calculated:

1. Edit the `getDashboardStats` function in `backend/controllers/userController.js`
2. Update the frontend display in the relevant HTML files:
   - `frontend/admin.html` for admin dashboard
   - `frontend/dashboard.html` for user dashboard
   - `frontend/public/index.html` for public homepage

## Data Seeding

To reset and seed the database with test data:
```
cd backend
node seed-all-data.js
```

This will create test users, initiatives, articles, activities, and comments with realistic data.