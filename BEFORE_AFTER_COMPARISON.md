# Before & After Comparison - Codeception 2025

## 🔄 Event Type Change

| Aspect                  | BEFORE (Team-based)   | AFTER (Individual)                |
| ----------------------- | --------------------- | --------------------------------- |
| **Competition Format**  | Team of 1-3 members   | Individual participants           |
| **Registration Unit**   | Team (with team name) | Individual (with register number) |
| **Login Credentials**   | Team Name + Team Code | Email + Participant Code          |
| **Leaderboard Display** | Team names            | Participant names                 |
| **Database Collection** | `teams`               | `participants`                    |

---

## 📝 Registration Form

### BEFORE (Team Registration)

```
Fields:
- Team Name *
- Team Leader Email *
- Team Members (1-3) *
  - Member 1 Name
  - Member 2 Name
  - Member 3 Name

Generated:
- Team Code (e.g., A1B2C3D4)
```

### AFTER (Individual Registration)

```
Fields:
- Full Name *
- Register Number *
- Email ID *
- Department * (Dropdown)
- Year * (1-4)
- Password *

Generated:
- Participant Code (e.g., PC1A2B3C)
```

---

## 🔐 Login / Authentication

### BEFORE

```javascript
// Login with
username + password

// Backend verification
- Find user by username
- Compare password with bcrypt
```

### AFTER

```javascript
// Login with
email + participantCode

// Backend verification
- Find participant by email
- Match participant code
```

---

## 💾 Database Schema

### BEFORE - Team Schema

```javascript
{
  teamName: String,
  leaderEmail: String,
  members: [String],
  teamCode: String,
  passwordHash: String,
  registrationDate: Date,
  active: Boolean
}
```

### AFTER - Participant Schema

```javascript
{
  name: String,
  registerNumber: String,      // NEW
  email: String,
  department: String,           // NEW
  year: String,                 // NEW
  participantCode: String,      // Replaces teamCode
  passwordHash: String,
  registrationDate: Date,
  active: Boolean
}
```

### BEFORE - Score Schema

```javascript
{
  teamName: String,
  teamCode: String,
  username: String,            // Confused mix
  score: Number,
  timeTaken: Number,
  status: String,
  lastUpdated: Date,
  puzzlesSolved: [...]
}
```

### AFTER - Score Schema

```javascript
{
  participantId: ObjectId,     // Reference to Participant
  name: String,                // Participant name
  registerNumber: String,      // NEW - unique identifier
  score: Number,
  timeTaken: Number,
  status: String,
  lastUpdated: Date,
  puzzlesSolved: [...]
}
```

---

## 🌐 API Endpoints

### Registration Endpoint

**BEFORE:** `POST /api/register`

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "password": "test123"
}

Response:
{
  "success": true,
  "username": "johndoe"
}
```

**AFTER:** `POST /api/register`

```json
{
  "name": "John Doe",
  "registerNumber": "21CS001",
  "email": "john@example.com",
  "department": "Computer Science",
  "year": "3",
  "password": "test123"
}

Response:
{
  "success": true,
  "participantCode": "PC1A2B3C",
  "name": "John Doe"
}
```

### Login Endpoint

**BEFORE:** `POST /api/verify-team`

```json
{
  "username": "johndoe",
  "password": "test123"
}

Response:
{
  "valid": true,
  "username": "johndoe"
}
```

**AFTER:** `POST /api/verify-team`

```json
{
  "email": "john@example.com",
  "participantCode": "PC1A2B3C"
}

Response:
{
  "valid": true,
  "name": "John Doe",
  "participantCode": "PC1A2B3C"
}
```

### Leaderboard Endpoint

**BEFORE:** `GET /api/leaderboard`

```json
{
    "scores": [
        {
            "username": "johndoe",
            "score": 100,
            "timeTaken": 45,
            "status": "completed"
        }
    ]
}
```

**AFTER:** `GET /api/leaderboard`

```json
{
    "scores": [
        {
            "name": "John Doe",
            "registerNumber": "21CS001",
            "score": 100,
            "timeTaken": 45,
            "status": "completed"
        }
    ]
}
```

### Admin Endpoints

| BEFORE                       | AFTER                                     |
| ---------------------------- | ----------------------------------------- |
| `PUT /api/score/:username`   | `PUT /api/score/:registerNumber`          |
| `GET /api/user/:username`    | `GET /api/participant/:registerNumber`    |
| `GET /api/users`             | `GET /api/participants`                   |
| `DELETE /api/user/:username` | `DELETE /api/participant/:registerNumber` |

---

## 🎨 Frontend Changes

### Index Page (Home)

**BEFORE:**

```
Event Stats:
- ⏱️ 2 Hours | Duration
- 👥 3 Members | Per Team
- 🎯 ∞ | Possibilities

Description mentions "Teams will navigate..."
```

**AFTER:**

```
Event Stats:
- ⏱️ 2 Hours | Duration
- 👤 Individual | Competition
- 🎯 ∞ | Possibilities

Description mentions "Participants will navigate..."
```

### About Page (Rules)

**BEFORE:**

- Rule 01: Team Composition (1-3 members)
- Rule 06: No communication between teams

**AFTER:**

- Rule 01: Individual Competition
- Rule 06: No communication between participants

### Registration Page

**BEFORE:**

```
Form Title: "Team Registration"
Button: "Register Team"

Success Message:
"Your team has been registered!"
"Team Code: A1B2C3D4"
```

**AFTER:**

```
Form Title: "Participant Registration"
Button: "Register Now"

Success Message:
"You have been successfully registered!"
"Your Participant Code: PC1A2B3C"
"⚠️ Save this code! You'll need it to log in."
```

### Puzzle Access Page

**BEFORE:**

```html
<input type="text" id="loginUsername" placeholder="Your username" />
<input type="password" id="loginPassword" placeholder="Your password" />

Display: "Team: johndoe"
```

**AFTER:**

```html
<input type="email" id="loginEmail" placeholder="Your registered email" />
<input type="text" id="loginParticipantCode" placeholder="PC1A2B3C" />

Display: "Participant: John Doe"
```

### Leaderboard

**BEFORE:**

- Column: Team Name
- Displays: username or teamName

**AFTER:**

- Column: Name
- Displays: participant's full name

---

## 📦 LocalStorage

### BEFORE

```javascript
localStorage.setItem('username', 'johndoe');

// Accessed as:
const username = localStorage.getItem('username');
```

### AFTER

```javascript
localStorage.setItem('participantCode', 'PC1A2B3C');
localStorage.setItem('participantEmail', 'john@example.com');
localStorage.setItem('participantName', 'John Doe');

// Accessed as:
const code = localStorage.getItem('participantCode');
const email = localStorage.getItem('participantEmail');
const name = localStorage.getItem('participantName');
```

**Important:** Password is NEVER stored (in both versions, bcrypt hash only on backend)

---

## 🎯 Key Improvements

| Feature                 | Improvement                                         |
| ----------------------- | --------------------------------------------------- |
| **Clarity**             | No confusion between team/username/individual       |
| **Academic Context**    | Register Number field for college identification    |
| **Department Tracking** | Track participant departments for analytics         |
| **Year Tracking**       | Know which academic year participants are from      |
| **Simpler Login**       | Email + Code (no password to remember for login)    |
| **Better UX**           | Clear participant code display with warning to save |
| **Consistent Naming**   | All references use "participant" terminology        |

---

## 🚨 Breaking Changes

### Data Migration Required

- Old `teams` collection data is incompatible
- Users must re-register as individual participants
- All old team codes are invalid

### Frontend Changes

- All localStorage keys changed
- All form field IDs changed
- All API request/response formats changed

### Backend Changes

- All Mongoose models renamed
- All API endpoint paths changed (for consistency)
- Different authentication mechanism

---

## ✅ What Stayed the Same

- Password security (bcrypt hashing)
- Score tracking system
- Puzzle solving mechanism
- Leaderboard ranking logic (score + time)
- 2-hour event duration
- Same dark neon theme and design
- Same MongoDB database (different collections)
- Same Express.js backend structure

---

## 📋 Migration Checklist

If migrating from old system:

- [ ] Backup MongoDB database
- [ ] Export team data if needed for records
- [ ] Clear old `teams` collection (or rename database)
- [ ] Update `.env` if needed
- [ ] Run `npm install` (bcrypt already present)
- [ ] Test registration flow
- [ ] Test login flow
- [ ] Test leaderboard display
- [ ] Test admin score update
- [ ] Inform users about re-registration
- [ ] Update any external documentation

---

## 🎓 Summary

**Main Change:**
Converted from a **team-based competition** where groups of 1-3 members competed together, to an **individual competition** where each participant competes independently using their college register number and email for identification.

**User Impact:**

- Simpler registration (no team coordination needed)
- Clearer identification (register number + name)
- Easier login (email + code, no password needed for puzzle access)
- Individual recognition on leaderboard

**Technical Impact:**

- Cleaner data model (one participant = one score)
- Better academic integration (department, year, register number)
- Simplified authentication flow
- More scalable for large participant counts

---

**Result:** A streamlined, individual-focused event that's easier to manage and participate in! 🎉
