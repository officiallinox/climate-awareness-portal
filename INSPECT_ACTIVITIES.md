# How to Inspect Your Climate Activities Data

## 🔍 Check Your Activities in Browser Console

### **Method 1: Quick Check**
1. Open browser console (F12)
2. Copy and paste this command:
```javascript
// Check your activities
const storageKey = 'user_guest_climate_activities';
const activities = JSON.parse(localStorage.getItem(storageKey) || '[]');
console.log('📊 Your Activities:', activities);
console.log('📈 Total Activities:', activities.length);
```

### **Method 2: Detailed Inspection**
```javascript
// Detailed activity inspection
const storageKey = 'user_guest_climate_activities';
const activities = JSON.parse(localStorage.getItem(storageKey) || '[]');

console.log('📊 CLIMATE ACTIVITIES REPORT');
console.log('============================');
console.log('Total Activities:', activities.length);

if (activities.length > 0) {
    // Group by type
    const byType = activities.reduce((acc, activity) => {
        acc[activity.type] = (acc[activity.type] || 0) + 1;
        return acc;
    }, {});
    
    console.log('📈 By Type:', byType);
    
    // Recent activities
    const recent = activities.filter(a => {
        const activityDate = new Date(a.date);
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return activityDate > oneDayAgo;
    });
    
    console.log('🕐 Recent (24h):', recent.length);
    
    // Show first few activities
    console.log('📋 Sample Activities:');
    activities.slice(0, 3).forEach((activity, index) => {
        console.log(`${index + 1}. ${activity.name} (${activity.type})`);
    });
} else {
    console.log('❌ No activities found');
}
```

### **Method 3: View Raw Storage Data**
```javascript
// View all your storage keys
Object.keys(localStorage).filter(key => key.includes('climate')).forEach(key => {
    console.log(`🔑 ${key}:`, localStorage.getItem(key));
});
```

## 🛠️ Useful Commands

### **Add Test Activity via Console**
```javascript
// Add a test activity
const testActivity = {
    name: 'Console Test Activity',
    type: 'energy',
    location: 'Test Location',
    notes: 'Added via browser console for testing'
};

// This assumes the addNewActivity function exists
if (typeof addNewActivity === 'function') {
    addNewActivity(testActivity);
    console.log('✅ Test activity added');
} else {
    console.log('❌ addNewActivity function not available');
}
```

### **Clear All Activities via Console**
```javascript
// WARNING: This will delete all your activities!
localStorage.removeItem('user_guest_climate_activities');
console.log('🗑️ All activities cleared');
// Refresh the page to see changes
```

### **Export Your Activities**
```javascript
// Export activities to JSON file
const storageKey = 'user_guest_climate_activities';
const activities = JSON.parse(localStorage.getItem(storageKey) || '[]');
const dataStr = JSON.stringify(activities, null, 2);
const dataBlob = new Blob([dataStr], {type: 'application/json'});
const url = URL.createObjectURL(dataBlob);
const link = document.createElement('a');
link.href = url;
link.download = 'my-climate-activities.json';
link.click();
console.log('📥 Activities exported to file');
```

## 🔧 Troubleshooting

### **If No Activities Show Up**
1. Check storage:
```javascript
console.log('Storage check:', localStorage.getItem('user_guest_climate_activities'));
```

2. Check if activities array exists in memory:
```javascript
console.log('Memory check:', typeof activities !== 'undefined' ? activities : 'activities variable not found');
```

3. Force reload activities:
```javascript
if (typeof loadUserActivities === 'function') {
    loadUserActivities();
    console.log('🔄 Activities reloaded');
}
```

### **If Activities Appear But Don't Display**
1. Check if display function exists:
```javascript
if (typeof displayActivities === 'function') {
    displayActivities();
    console.log('🖼️ Display function called');
}
```

2. Check if activity list element exists:
```javascript
const activityList = document.getElementById('activityList');
console.log('📋 Activity list element:', activityList);
```

## 📋 Current Status Commands

Copy these into console to check current status:

```javascript
// Full status report
console.log('🌍 CLIMATE PORTAL STATUS');
console.log('========================');
console.log('Activities in memory:', typeof activities !== 'undefined' ? activities.length : 'Not loaded');
console.log('Activities in storage:', JSON.parse(localStorage.getItem('user_guest_climate_activities') || '[]').length);
console.log('Display element exists:', !!document.getElementById('activityList'));
console.log('Functions available:', {
    loadUserActivities: typeof loadUserActivities !== 'undefined',
    displayActivities: typeof displayActivities !== 'undefined',
    addNewActivity: typeof addNewActivity !== 'undefined'
});
```

Use these commands to diagnose any issues with your climate activities system!