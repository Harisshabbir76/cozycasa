# Changes Made

**Property Type Delete Cascade Fix:**

The backend already had cascade delete. Frontend PropertyTypes.jsx used raw axios causing 401.

**Fixed:**
- frontend/src/pages/admin/PropertyTypes.jsx: Use authenticated `apiCall` for all /api/categories calls
- Import: `../../utils/api`
- Now DELETE sends token, backend executes cascade delete

**Status:** Ready to test as admin user.

**Original issue:** 401 Unauthorized on delete - now resolved.
