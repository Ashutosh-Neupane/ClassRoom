# Frontend Testing Guide

## Setup and Start

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies (if not done):**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   - Should start on `http://localhost:8080`
   - Should show no errors in terminal

## Visual Testing Checklist

### 1. Initial Load
- [ ] Page loads without errors
- [ ] Dark theme is applied by default
- [ ] Header is visible with search bar and theme toggle
- [ ] Main content area shows "Class Schedule" title
- [ ] "Schedule Class" button is visible and blue

### 2. Theme Toggle
- [ ] Click sun/moon icon in header
- [ ] Theme switches between dark and light
- [ ] All colors change appropriately
- [ ] No visual glitches during transition

### 3. Search Functionality
- [ ] Type in search bar (desktop: header, mobile: below controls)
- [ ] Search filters the displayed classes
- [ ] Clear search shows all classes again

### 4. View Modes
- [ ] Toggle between Calendar and List view
- [ ] Calendar view shows grid layout
- [ ] List view shows table layout
- [ ] Both views display mock data

### 5. Date Navigation
- [ ] Week/Month view toggles work
- [ ] Previous/Next arrows change dates
- [ ] Current date is highlighted

### 6. Schedule Class Modal
- [ ] Click "Schedule Class" button
- [ ] Modal opens with form fields
- [ ] All form inputs are functional:
   - [ ] Class name input
   - [ ] Date picker
   - [ ] Time picker
   - [ ] Instructor dropdown
   - [ ] Room dropdown
   - [ ] Recurring toggle
- [ ] Close modal with X or outside click

### 7. Recurring Settings Modal
- [ ] In Schedule Class modal, toggle "Recurring"
- [ ] Click "Recurring Settings" button
- [ ] Second modal opens with:
   - [ ] Frequency options (Daily/Weekly/Monthly)
   - [ ] Date range picker
   - [ ] Days of week selection
- [ ] Save and close functionality

### 8. Responsive Design
- [ ] Resize browser window
- [ ] Mobile layout activates (< 768px)
- [ ] Search moves below controls on mobile
- [ ] All buttons remain accessible
- [ ] Modals are mobile-friendly

### 9. Interactive Elements
- [ ] All buttons have hover effects
- [ ] Dropdowns open and close properly
- [ ] Form validation works (try submitting empty forms)
- [ ] Tooltips appear on hover where applicable

### 10. Mock Data Display
- [ ] Classes appear in both calendar and list views
- [ ] Different class statuses show (Scheduled/Complete/Cancelled)
- [ ] Recurring indicators display correctly
- [ ] Class details are readable

## Error Testing

### 1. Console Errors
- [ ] Open browser DevTools (F12)
- [ ] Check Console tab for errors
- [ ] Should see no red errors
- [ ] Warnings are acceptable

### 2. Network Tab
- [ ] Check Network tab in DevTools
- [ ] All assets load successfully (200 status)
- [ ] No failed requests

### 3. Component Errors
- [ ] Try rapid clicking on buttons
- [ ] Open/close modals quickly
- [ ] Switch themes rapidly
- [ ] No crashes or broken states

## Performance Testing

### 1. Load Time
- [ ] Page loads within 2-3 seconds
- [ ] No long loading spinners
- [ ] Smooth animations

### 2. Interactions
- [ ] Button clicks are responsive
- [ ] Modal animations are smooth
- [ ] Theme switching is instant
- [ ] Search filtering is immediate

## Expected Behavior

### What Should Work:
- ✅ All UI components render correctly
- ✅ Theme switching
- ✅ Modal opening/closing
- ✅ Form interactions
- ✅ Responsive design
- ✅ Mock data display
- ✅ Search filtering (on mock data)

### What Won't Work Yet (Backend Integration Needed):
- ❌ Actual data saving
- ❌ Real API calls
- ❌ Data persistence
- ❌ Server-side validation
- ❌ Real-time updates

## Troubleshooting

### Common Issues:
1. **Import errors**: Restart dev server
2. **Styling issues**: Check if Tailwind is loading
3. **Modal not opening**: Check console for JavaScript errors
4. **Theme not switching**: Verify next-themes is working

### If Something Doesn't Work:
1. Check browser console for errors
2. Restart the dev server
3. Clear browser cache
4. Verify all dependencies are installed

## Success Criteria

The frontend is working correctly if:
- ✅ No console errors
- ✅ All visual elements display properly
- ✅ All interactions work smoothly
- ✅ Responsive design functions
- ✅ Mock data appears correctly
- ✅ Modals and forms are functional

Once all these tests pass, the frontend is ready for backend integration in PR10!