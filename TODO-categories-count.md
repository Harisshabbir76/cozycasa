# Add Property Counts to PropertyTypes Dashboard

## Steps:
- [ ] 1. Create this TODO.md
- [ ] 2. Verify backend already has propertyCount in GET /api/categories (backend/routes/categories.js)
- [ ] 3. Test frontend display
- [ ] 4. Restart backend if needed: cd backend && npm start
- [ ] 5. Complete

**Status**: Backend already implements propertyCount population using Property.countDocuments({ category: category._id }). Frontend displays it. Feature complete - counts will show actual property numbers per type in admin dashboard Property Types page.
