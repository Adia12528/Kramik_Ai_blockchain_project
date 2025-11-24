# 🧪 Attendance System Testing Guide

## Quick Test (5 minutes)

### 1. Test Login Attendance Marking
1. Open browser: http://localhost:3002/
2. Login with any credentials
3. **Expected**: Dashboard loads with attendance percentage
4. **Check Console**: Should see "📅 Login Attendance Update"
5. **Verify**: Quick Stats card shows percentage (e.g., "100.0%")

### 2. Test Attendance Modal
1. Click on the ✅ icon in Attendance quick stats card
2. **Expected**: Modal opens with:
   - Month name at top
   - 4 stat boxes (Present/Absent/Percentage/Streak)
   - "✅ Attendance Marked for Today!" message
   - Calendar grid with colors
   - Today's date has blue ring
   - Today is marked green (present)

### 3. Test Multiple Logins Same Day
1. Refresh the page (F5)
2. **Expected**: 
   - Attendance still same (not doubled)
   - Console: "Attendance marked on session restore"
   - Percentage unchanged
3. Logout and login again
4. **Expected**: Still counts as same day

### 4. Test Calendar Display
1. Open attendance modal
2. Check calendar grid:
   - **Green boxes** = days you logged in
   - **Red boxes** = days you missed (if any)
   - **Gray boxes** = future days
   - **Blue ring** = today's date
3. **Verify**: Each day shows correct status

### 5. Test Profile Editor
1. Click "Update Profile" button
2. Scroll to "Monthly Attendance" field
3. **Expected**:
   - Field is READ-ONLY (gray background)
   - Shows current percentage
   - Shows "X/Y days" below
   - Note: "Auto-tracked based on daily logins"

### 6. Test Streak Counter
1. Open attendance modal
2. Check "Current Streak" box (purple)
3. **Expected**: Shows number of consecutive login days
4. Note: Will be 1 if first login, or higher if logged in yesterday too

## Manual localStorage Inspection

### Check Stored Data
1. Open browser DevTools (F12)
2. Go to **Application** tab → **Local Storage** → **http://localhost:3002**
3. Find key: `student_attendance`
4. **Expected structure**:
```json
{
  "currentMonth": "2025-11",
  "presentDays": ["2025-11-22"],
  "lastLoginDate": "2025-11-22T10:30:00.000Z",
  "totalDaysInMonth": 30,
  "createdAt": "2025-11-22T10:30:00.000Z"
}
```

### Simulate Day Change (Advanced)
1. In DevTools, edit `student_attendance` value
2. Change date in `presentDays` to yesterday:
```json
{
  "currentMonth": "2025-11",
  "presentDays": ["2025-11-21"],
  "lastLoginDate": "2025-11-21T10:00:00.000Z",
  "totalDaysInMonth": 30,
  "createdAt": "2025-11-21T10:00:00.000Z"
}
```
3. Refresh page and login
4. **Expected**: 
   - `presentDays` now has two dates
   - Attendance percentage increases
   - Calendar shows both days green

### Simulate Month Change (Advanced)
1. Edit `student_attendance` in localStorage
2. Change month to previous:
```json
{
  "currentMonth": "2025-10",
  "presentDays": ["2025-10-15", "2025-10-16"],
  "lastLoginDate": "2025-10-16T10:00:00.000Z",
  "totalDaysInMonth": 31,
  "createdAt": "2025-10-01T10:00:00.000Z"
}
```
3. Refresh page
4. **Expected**: System creates new month data automatically

## Console Output Verification

### On Login
```
📅 Login Attendance Update {markedToday: true, currentAttendance: 100, presentDays: 1, workingDays: 1}
```

### On Dashboard Load
```
📊 Attendance Stats Loaded: {
  presentDays: 1,
  absentDays: 0,
  workingDays: 1,
  percentage: 100,
  totalDaysInMonth: 30,
  lastLoginDate: "2025-11-22T...",
  currentStreak: 1
}
```

## Visual Verification Checklist

- [ ] Quick Stats card shows attendance percentage
- [ ] Percentage updates in real-time
- [ ] Modal opens when clicking ✅ icon
- [ ] Calendar displays current month
- [ ] Today has blue ring around it
- [ ] Today is marked green (present)
- [ ] Statistics are accurate
- [ ] Streak counter works
- [ ] "Attendance Marked" message shows if logged in
- [ ] Profile editor shows read-only attendance
- [ ] No errors in console
- [ ] Page doesn't crash on refresh

## Known Behaviors (Not Bugs)

✅ **First login of month shows 100%**: Correct! 1/1 days = 100%  
✅ **Percentage changes daily**: Correct! Denominator increases each day  
✅ **Future days are gray**: Correct! Can't mark attendance for future  
✅ **Multiple logins = one attendance**: Correct! By design  
✅ **Attendance field is read-only**: Correct! Auto-calculated  

## If Something Doesn't Work

### Issue: Attendance not showing
**Solution**: 
1. Check browser console for errors
2. Verify `attendanceUtils.js` exists
3. Check localStorage for `student_attendance` key

### Issue: Modal not opening
**Solution**:
1. Check console for errors
2. Verify `showAttendanceModal` state
3. Try clicking the ✅ icon directly

### Issue: Wrong percentage
**Solution**:
1. Check localStorage data
2. Verify today's date in `presentDays` array
3. Console log `getAttendanceStats()` result

### Issue: Calendar not showing
**Solution**:
1. Check `getMonthCalendarData()` function
2. Verify current month data exists
3. Check calendar component rendering

## Quick Reset

To start fresh:
1. Open DevTools → Application → Local Storage
2. Delete `student_attendance` key
3. Refresh page and login
4. New attendance data will be created

---

**Development Server**: http://localhost:3002/  
**Testing Time**: ~5 minutes for full test  
**Status**: Ready for Testing ✅
