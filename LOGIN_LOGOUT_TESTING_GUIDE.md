# 🔐 Login/Logout Activity Persistence Testing Guide

## 🎯 **The Problem You Described:**
- Activities show up when you track them
- But when you logout and login again, they disappear
- This happens because storage keys change between guest and authenticated users

## 🔧 **What I Fixed:**

### **1. ✅ Consistent User Identification**
- Enhanced `getUserActivitiesKey()` function
- Tries multiple methods to identify the same user
- Stores `currentUserId` for consistency

### **2. ✅ Activity Migration System**
- Automatically finds activities stored under different keys
- Migrates them to the current user's key
- Prevents data loss during login/logout cycles

### **3. ✅ Enhanced Debugging**
- Added debug button to check user status
- Console logging to track storage keys
- Migration notifications

## 🧪 **Step-by-Step Testing Process:**

### **Test 1: As Guest User**
1. **Open dashboard** (should be open now)
2. **Click "🐛 Debug"** - note the storage key (probably `user_guest_climate_activities`)
3. **Click "🌱 Add Sample"** - add some test activities
4. **Verify activities appear** in horizontal layout
5. **Click "🐛 Debug" again** - note that activities are saved

### **Test 2: Login Process**
1. **Go to login page**: `http://localhost:3000/login_new.html`
2. **Login with your credentials**
3. **Return to dashboard**: `http://localhost:3000/dashboard.html`
4. **Click "🐛 Debug"** - note the NEW storage key (should include your username/ID)
5. **Check if activities appear** - they should migrate automatically

### **Test 3: Logout Process**
1. **Logout** using the logout button
2. **Return to dashboard** 
3. **Click "🐛 Debug"** - storage key should be back to `user_guest_climate_activities`
4. **Check if activities appear** - they should still be there

### **Test 4: Login Again**
1. **Login again** with same credentials
2. **Return to dashboard**
3. **Activities should still be there** (migrated back to your user account)

## 🔍 **Debugging Commands**

Open browser console (F12) and use these commands:

### **Check All Storage Keys:**
```javascript
// See all activity-related storage keys
Object.keys(localStorage).filter(key => key.includes('climate') || key.includes('activities')).forEach(key => {
    const data = localStorage.getItem(key);
    try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
            console.log(`${key}: ${parsed.length} activities`);
        }
    } catch(e) {
        console.log(`${key}: ${data ? 'data exists' : 'no data'}`);
    }
});
```

### **Force Migration:**
```javascript
// Manually trigger migration
if (typeof attemptActivityMigration === 'function') {
    const migrated = attemptActivityMigration();
    console.log('Migrated activities:', migrated.length);
    if (migrated.length > 0) {
        activities = migrated;
        displayActivities();
    }
}
```

### **Check Current User Info:**
```javascript
// Check user identification
console.log('Current User Info:');
console.log('Token:', !!localStorage.getItem('token'));
console.log('Username:', localStorage.getItem('username'));
console.log('Stored User ID:', localStorage.getItem('currentUserId'));
console.log('Storage Key:', getUserActivitiesKey());
```

## 🎯 **Expected Behavior:**

### **Before Login (Guest):**
- Storage Key: `user_guest_climate_activities`
- Activities saved under guest account

### **After Login:**
- Storage Key: `user_{username}_climate_activities` or `user_{userID}_climate_activities`
- Activities automatically migrate from guest to user account
- You see notification: "🔄 Migrated X activities to your account"

### **After Logout:**
- Storage Key: Back to `user_guest_climate_activities`
- Activities remain accessible
- No data loss

### **After Login Again:**
- Storage Key: Back to user-specific key
- Activities migrate back to user account
- Data preserved throughout the cycle

## ⚠️ **Troubleshooting:**

### **If Activities Still Disappear:**
1. **Check Console for Errors**
2. **Use Debug Button** - shows all storage keys and activity counts
3. **Check Migration Messages** - should see "Migrated X activities" notifications
4. **Manual Migration** - use console commands above

### **If Migration Doesn't Work:**
```javascript
// Emergency: Copy activities between keys manually
const guestKey = 'user_guest_climate_activities';
const userKey = 'user_YOUR_USERNAME_climate_activities'; // Replace with your username

const guestActivities = JSON.parse(localStorage.getItem(guestKey) || '[]');
const userActivities = JSON.parse(localStorage.getItem(userKey) || '[]');

// Merge activities
const allActivities = [...userActivities, ...guestActivities];
localStorage.setItem(userKey, JSON.stringify(allActivities));
console.log('Manual migration complete:', allActivities.length);
```

## 🚀 **Testing Sequence:**

1. **Start Fresh**: Click "🗑️ Clear All" to start with clean slate
2. **Add Test Data**: Click "🌱 Add Sample" to add test activities
3. **Debug**: Click "🐛 Debug" to see current status
4. **Login**: Go to login page and login
5. **Check Migration**: Return to dashboard, activities should migrate
6. **Debug Again**: Click "🐛 Debug" to verify new storage key
7. **Logout**: Logout and return to dashboard
8. **Verify Persistence**: Activities should still be there
9. **Login Again**: Login again, activities should migrate back

The system should now maintain your activities across login/logout cycles! 🎉

## 📝 **Migration Notification Messages:**

- ✅ **"🔄 Migrated X activities to your account"** - Migration successful
- ✅ **"📦 Found X activities in [key]"** - Activities found in storage
- ❌ **"No saved activities found"** - No activities to migrate

Let me know if you still experience data loss after testing this sequence!