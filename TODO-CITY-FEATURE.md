# Add City Field to Properties - Implementation Steps

## Status: [ ] In Progress

### 1. [ ] Backend Model Update
   - File: `backend/models/Property.js`
   - Add `city: { type: String, required: true }` to schema
   - Update text index: `{ title: 'text', city: 'text', location: 'text', description: 'text' }`

### 2. [ ] Admin AddProperty Form
   - File: `frontend/src/pages/admin/AddProperty.jsx`
   - Add `city: ''` to formData state
   - Add city input field after location input (simple text input, required)

### 3. [ ] Admin EditProperty Form
   - File: `frontend/src/pages/admin/EditProperty.jsx`
   - Add `city: p.city || ''` to formData population
   - Add `city: ''` to formData init
   - Add city input field after location

### 4. [ ] PropertyCard Display
   - File: `frontend/src/components/PropertyCard.jsx`
   - Update `getCityName`: `property.city ||` existing parse logic

### 5. [ ] Admin PropertiesList Display
   - File: `frontend/src/pages/admin/PropertiesList.jsx`
   - Replace `{p.location}` with `{p.city || getCityName(p.location)}` (use same parse fn)

### 6. [ ] Test & Restart
   - Restart backend: `cd backend && npm start`
   - Test add/edit/display
   - Existing props use fallback parse

### 7. [ ] Mark Complete
   - Update this TODO with [x] checks
   - Remove or archive when done

**Note**: Existing properties get city=null (fallback works). Searches unchanged (location regex still works).
