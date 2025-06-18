# Climate Activity CRUD System - User Guide

## 🎯 Overview
The Climate Activity system now supports full CRUD (Create, Read, Update, Delete) operations with persistent storage.

## 🔧 Features

### 1. **Data Persistence**
- ✅ Activities are saved to localStorage with user-specific keys
- ✅ Data persists across browser sessions and page refreshes
- ✅ Each user has their own separate activity storage

### 2. **CRUD Operations**

#### **CREATE (➕ Add Activity)**
- Click "Add Activity" button in the Recent Climate Actions section
- Fill in activity details:
  - **Name**: Required (e.g., "Switched to LED bulbs")
  - **Type**: Required (Energy, Transportation, Water, etc.)
  - **Location**: Optional (e.g., "Dar es Salaam")
  - **Date**: Optional (defaults to current time)
  - **Notes**: Optional (detailed description)
- Click "✅ Add Activity" to save

#### **READ (👀 View Activities)**
- All activities are displayed in horizontal card format
- Shows activity name, type badge, location, date, and notes
- Recent activities (within 24 hours) have special highlighting

#### **UPDATE (✏️ Edit Activity)**
- Click the "✏️" edit button on any activity card
- Modify any field in the edit modal
- Click "💾 Save Changes" to update

#### **DELETE (🗑️ Remove Activity)**
- Click the "🗑️" delete button in the top-right corner of any activity card
- Confirm deletion in the popup dialog
- Activity is permanently removed

### 3. **Save Draft Functionality** 💾

#### **What is "Save Draft"?**
The "Save Draft" button allows you to save your progress when adding a new activity without actually creating the activity yet.

#### **When to Use Draft:**
- 📝 **Partial Information**: When you don't have all the details ready
- ⏰ **Time Constraints**: When you need to stop and continue later
- 🔄 **Frequent Updates**: When you're still deciding on the exact details
- 📱 **Mobile Usage**: When you might accidentally close the browser

#### **How Draft Works:**
1. Fill in some (or all) fields in the "Add Activity" modal
2. Click "💾 Save Draft" 
3. Close the modal - your progress is saved
4. When you next open "Add Activity", your draft will be automatically loaded
5. You can continue editing and either:
   - Save as a complete activity
   - Update the draft again
   - Clear the draft and start over

#### **Draft Benefits:**
- ✅ Never lose your work
- ✅ Continue where you left off
- ✅ Perfect for detailed activities that take time to document
- ✅ Helps when you need to verify information before saving

## 🎨 Horizontal Card Layout

### **Visual Features:**
- **Wide Layout**: Cards span the full width for better information display
- **Type Badges**: Color-coded badges on the right side
- **Smart Positioning**: Delete button in top-right corner
- **Responsive Design**: Adapts to mobile screens
- **Hover Effects**: Smooth animations on interaction

### **Information Hierarchy:**
1. **Header**: Activity name + type badge
2. **Details**: Date, location, weather (if available)
3. **Notes**: Full description with special formatting
4. **Actions**: Edit and share buttons

## 🔄 Data Flow

### **Storage Structure:**
```
localStorage key: user_{userId}_climate_activities
Format: JSON array of activity objects
```

### **Activity Object Structure:**
```javascript
{
  _id: "activity_1234567890_abc123",
  name: "Switched to LED light bulbs",
  type: "energy",
  date: "2024-12-14T10:30:00.000Z",
  location: "Dar es Salaam",
  weather: { temperature: 28 },
  notes: "Replaced 8 traditional bulbs...",
  createdAt: "2024-12-14T10:30:00.000Z",
  updatedAt: "2024-12-14T10:30:00.000Z"
}
```

## 🛠️ Technical Implementation

### **Key Functions:**
- `loadUserActivities()` - Loads activities from localStorage
- `saveUserActivities()` - Saves activities to localStorage
- `addNewActivity()` - Creates new activity
- `updateActivity()` - Modifies existing activity
- `deleteActivity()` - Removes activity
- `ensureHorizontalLayout()` - Applies horizontal styling

### **Error Handling:**
- ✅ Graceful fallbacks for localStorage errors
- ✅ Validation for required fields
- ✅ User-friendly error messages
- ✅ Confirmation dialogs for destructive actions

## 📱 Mobile Responsiveness

The horizontal cards automatically adapt to mobile screens:
- Header elements stack vertically
- Detail badges stack in columns
- Delete button becomes static instead of absolute positioned
- Touch-friendly button sizes

## 🎯 Next Steps

1. **Add your first activity** using the "Add Activity" button
2. **Test the draft functionality** by partially filling a form and saving draft
3. **Edit existing activities** to update information
4. **Share activities** using the share button
5. **Filter activities** by type and time period

The system is now fully functional with persistent data storage and comprehensive CRUD operations!