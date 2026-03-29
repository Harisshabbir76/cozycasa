# Forgot Password Implementation TODO

## Approved Plan Steps (Step-by-step execution):

1. **[Backend] Update User model** - Add otpCode/otpExpiry fields + generateOTP/matchOTP methods to backend/models/User.js

2. **[Backend] Add nodemailer dependency** - Update backend/package.json, execute `cd backend && npm install nodemailer`

3. **[Backend] Implement auth endpoints** - Add /forgot-password, /verify-otp, /reset-password to backend/routes/auth.js with email sending

4. **[Frontend] Update Login page** - Add forgot password UI/logic/states to frontend/src/pages/Login.jsx matching existing styles

5. **Test backend endpoints** - Restart server, test with curl/Postman (send OTP, verify, reset)

6. **Test full flow** - Frontend: login page → forgot → email → OTP → new pass → login success

7. **Clean up** - Remove this TODO.md, handle any errors/edge cases

## Progress:
- [x] 1. Backend User model updated
- [x] 2. Backend nodemailer dependency added/installed
- [x] 3. Backend auth endpoints implemented
- [x] 4. Frontend Login page updated with forgot UI/logic

**Next step: 5/7 - Test backend**
