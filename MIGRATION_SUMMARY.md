# Codeception 2025 - Individual Event Migration Summary

## Overview
Successfully converted Codeception 2025 from a **team-based** event to an **individual participant-based** event.

---

## Database Changes

### Collection Renamed
- **Old:** `teams` collection
- **New:** `participants` collection

### Participant Schema (Individual Registration)
```javascript
{
  name: String,              // Full name
  registerNumber: String,    // College register number (unique, uppercase)
  email: String,            // Email ID (unique, lowercase)
  department: String,       // Department (dropdown selection)
  year: String,             // Academic year (1-4)
  participantCode: String,  // Unique participant code (e.g., PC1A2B3C)
  passwordHash: String,     // Bcrypt hashed password
  registrationDate: Date,
  active: Boolean
}
```

### Score Schema (Updated)
```javascript
{
  participantId: ObjectId,     // Reference to Participant
  name: String,                // Participant name
  registerNumber: String,      // Register number
  score: Number,
  timeTaken: Number,
  status: String,              // 'pending', 'active', 'completed'
  lastUpdated: Date,
  puzzlesSolved: Array
}
```

---

## API Endpoints Updated

### Registration
- **Endpoint:** `POST /api/register`
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "registerNumber": "21CS001",
    "email": "john@example.com",
    "department": "Computer Science",
    "year": "3",
    "password": "securepassword"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "participantCode": "PC1A2B3C",
    "name": "John Doe"
  }
  ```

### Login/Verification
- **Endpoint:** `POST /api/verify-team`
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "participantCode": "PC1A2B3C"
  }
  ```
- **Response:**
  ```json
  {
    "valid": true,
    "name": "John Doe",
    "participantCode": "PC1A2B3C"
  }
  ```

### Leaderboard
- **Endpoint:** `GET /api/leaderboard`
- **Returns:** Array of participants with `name`, `registerNumber`, `score`, `timeTaken`, `status`

### Admin Routes
- `PUT /api/score/:registerNumber` - Update participant score
- `GET /api/participant/:registerNumber` - Get participant details
- `GET /api/participants` - Get all participants
- `DELETE /api/participant/:registerNumber` - Delete participant

---

## Frontend Changes

### Registration Page (`register.html`)
**New Fields:**
1. Full Name *
2. Register Number * (e.g., 21CS001)
3. Email ID *
4. Department * (Dropdown: CS, IT, ECE, EEE, Mechanical, Civil, Other)
5. Year * (Dropdown: 1, 2, 3, 4)
6. Password *

**Success Message:**
- Displays unique **Participant Code** (e.g., PC1A2B3C)
- Warns user to save the code
- Shows participant name

### Puzzle Access Page (`puzzle.html`)
**Login Form:**
- Email ID (instead of username)
- Participant Code (instead of password)

**Display:**
- Shows participant name after login

### Leaderboard Page
- Shows participant **name** instead of team name
- Highlights top 3 participants with glow effects
- Real-time updates every 30 seconds

### Homepage (`index.html`)
**Event Stats Updated:**
- Changed "3 Members Per Team" to "Individual Competition"
- Updated description to use "Participants" instead of "Teams"

### About Page (`about.html`)
**Rules Updated:**
1. Individual Competition (was: Team Composition)
2. Each participant competes independently
3. No communication between participants (was: teams)
4. All references to "team" replaced with "participant"

---

## JavaScript Logic (`script.js`)

### Registration Flow
1. Collects: name, registerNumber, email, department, year, password
2. Submits to `/api/register`
3. Stores in localStorage:
   - `participantCode`
   - `participantEmail`
   - `participantName`
   - **Does NOT store password**

### Login Flow
1. User enters email + participant code
2. Verifies via `/api/verify-team`
3. On success, shows puzzle access area
4. Displays participant name

### Leaderboard
- Fetches from `/api/leaderboard`
- Displays participant `name` and `score`
- Updates podium with top 3 participants

---

## CSS Updates (`style.css`)

### New Styles Added
- `.form-row` - Grid layout for department/year fields
- `.input-hint` - Helpful hints below form inputs
- `.participant-code-display` - Highlighted box for participant code
- `.code-label` - Label for participant code
- `.code-note` - Warning note to save code
- `.welcome-message` - Welcome message with participant name

---

## Security Features

### Password Handling
- Uses **bcrypt** with 10 salt rounds
- Passwords are hashed before storing in database
- Passwords are **never** stored in localStorage

### Authentication
- Login uses **Email + Participant Code** (not password)
- Participant code is randomly generated (format: PC + 6 hex chars)
- All register numbers and participant codes are uppercase
- Email addresses are stored in lowercase

### Validation
- Email format validation
- Register number uniqueness
- Email uniqueness
- Year must be 1, 2, 3, or 4
- Department must be from predefined list

---

## How to Test

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
Create `.env` file:
```
MONGODB_URI=mongodb://localhost:27017/codeception
PORT=3000
```

### 3. Start Server
```bash
npm start
# or for development:
npm run dev
```

### 4. Test Registration
1. Open `http://localhost:3000/register.html`
2. Fill in:
   - Name: John Doe
   - Register Number: 21CS001
   - Email: john@example.com
   - Department: Computer Science
   - Year: 3
   - Password: test123
3. Click "Register Now"
4. **Save the Participant Code** displayed

### 5. Test Login
1. Open `http://localhost:3000/puzzle.html`
2. Enter:
   - Email: john@example.com
   - Participant Code: (from registration)
3. Should show puzzle access area with participant name

### 6. Test Leaderboard
1. Open `http://localhost:3000/leaderboard.html`
2. Should show registered participant with score 0

---

## Migration Notes

### Data Migration
If you have existing team data in MongoDB:
1. **Backup your database first!**
2. You'll need to manually migrate team data to participant data
3. Consider creating a migration script if needed

### Breaking Changes
- All old team codes are now invalid
- Frontend localStorage keys changed:
  - `teamCode` → `participantCode`
  - `teamName` → `participantName`
  - Added: `participantEmail`
- API endpoints changed (see above)

### Backward Compatibility
- **None** - This is a complete redesign
- Old team-based registrations will not work
- Users must re-register as individual participants

---

## Event Rules Summary

### Competition Format
✅ Individual event (not team-based)
✅ 2-hour duration
✅ Web-based puzzle solving
✅ Real-time leaderboard
✅ Points awarded for speed and accuracy

### Registration Requirements
✅ Valid college register number
✅ Valid email address
✅ Department and year selection
✅ Unique participant code assigned

### Login Requirements
✅ Email ID (used during registration)
✅ Participant Code (received after registration)

---

## Next Steps / Recommendations

### Security Enhancements
1. Add JWT-based sessions for puzzle access
2. Implement admin authentication for score update endpoints
3. Add rate limiting on login/registration
4. Add email verification
5. Implement password reset functionality

### Features to Consider
1. Email notifications with participant code
2. Password recovery via email
3. Participant dashboard showing progress
4. Admin panel for managing participants
5. Analytics and reporting

### Performance
1. Add database indexes (already done for common queries)
2. Implement caching for leaderboard
3. Add pagination for participant list (admin)

---

## Files Modified

### Backend
- ✅ `server.js` - Complete rewrite of schemas and API routes

### Frontend
- ✅ `register.html` - New individual registration form
- ✅ `puzzle.html` - Updated login form (email + code)
- ✅ `index.html` - Updated event description
- ✅ `about.html` - Updated rules and format
- ✅ `script.js` - Updated all JS logic
- ✅ `style.css` - Added new styles

### Documentation
- ✅ `MIGRATION_SUMMARY.md` - This file

---

## Support

For issues or questions:
1. Check the browser console for errors
2. Check the server console for backend errors
3. Verify MongoDB connection
4. Ensure all dependencies are installed (`npm install`)
5. Check that `.env` file exists with correct `MONGODB_URI`

---

**Migration completed successfully! 🎉**

All team-based references have been replaced with individual participant logic.
The event is now ready for individual competition format.
