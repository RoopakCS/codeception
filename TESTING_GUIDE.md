# Quick Testing Guide - Codeception 2025

## 🚀 Getting Started

### 1. Install Dependencies

```powershell
npm install
```

### 2. Setup MongoDB

Make sure MongoDB is running and update `.env`:

```
MONGODB_URI=mongodb://localhost:27017/codeception
PORT=3000
```

### 3. Start the Server

```powershell
npm start
```

Server should start at `http://localhost:3000`

---

## 📝 Test Flow

### Step 1: Register a Participant

1. Navigate to: `http://localhost:3000/register.html`
2. Fill in the form:
    ```
    Name: Test User
    Register Number: 21CS001
    Email: test@example.com
    Department: Computer Science
    Year: 3
    Password: test123
    ```
3. Check "I agree to terms"
4. Click "Register Now"
5. **IMPORTANT:** Copy the Participant Code shown (e.g., `PC1A2B3C`)

### Step 2: Login to Puzzle Portal

1. Navigate to: `http://localhost:3000/puzzle.html`
2. Enter:
    ```
    Email ID: test@example.com
    Participant Code: PC1A2B3C (your actual code)
    ```
3. Click "Access Puzzle"
4. You should see the mission control area with your name

### Step 3: Check Leaderboard

1. Navigate to: `http://localhost:3000/leaderboard.html`
2. You should see your name with score 0
3. Try the refresh button

### Step 4: Test Logout

1. While logged into puzzle portal, click "Logout"
2. Should return to login screen
3. Try logging in again with your email and code

---

## 🧪 Test Cases

### Registration Tests

#### ✅ Valid Registration

- All fields filled correctly
- Should receive participant code

#### ❌ Duplicate Email

- Register with same email twice
- Should show error: "participant with this email already exists"

#### ❌ Duplicate Register Number

- Register with same register number twice
- Should show error message

#### ❌ Invalid Email

- Use email without @ or .com
- Should show validation error

#### ❌ Missing Fields

- Leave any required field empty
- Form should not submit

### Login Tests

#### ✅ Valid Login

- Correct email + participant code
- Should show puzzle access

#### ❌ Wrong Email

- Incorrect email, correct code
- Should show: "Invalid email or participant code"

#### ❌ Wrong Code

- Correct email, incorrect code
- Should show: "Invalid email or participant code"

#### ❌ Empty Fields

- Leave fields blank
- Form should not submit

### Leaderboard Tests

#### Display

- Should show all participants
- Sorted by score (highest first)
- Top 3 should have special highlighting

#### Refresh

- Click refresh button
- Should reload leaderboard data

#### Auto-refresh

- Wait 30 seconds
- Should auto-update

---

## 🔧 Admin API Testing (Using Postman or curl)

### Update Participant Score

```powershell
# PowerShell
Invoke-RestMethod -Uri "http://localhost:3000/api/score/21CS001" -Method PUT -ContentType "application/json" -Body '{"score": 100, "timeTaken": 45, "status": "completed"}'
```

Or with curl:

```bash
curl -X PUT http://localhost:3000/api/score/21CS001 \
  -H "Content-Type: application/json" \
  -d '{"score": 100, "timeTaken": 45, "status": "completed"}'
```

### Add Puzzle Points

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/score/21CS001" -Method PUT -ContentType "application/json" -Body '{"puzzleId": "puzzle1", "points": 50}'
```

### Get Participant Details

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/participant/21CS001" -Method GET
```

### Get All Participants

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/participants" -Method GET
```

### Delete Participant

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/participant/21CS001" -Method DELETE
```

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"

**Solution:**

- Make sure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Try: `mongodb://127.0.0.1:27017/codeception`

### Issue: "Port 3000 already in use"

**Solution:**

- Change PORT in `.env`
- Or kill the process using port 3000

### Issue: Participant code not showing after registration

**Solution:**

- Check browser console for errors
- Check server console for backend errors
- Verify MongoDB connection

### Issue: Login not working

**Solution:**

- Check if email matches exactly (case-insensitive)
- Check if participant code is correct (case-insensitive)
- Verify participant exists in database

### Issue: Leaderboard shows "No participants yet"

**Solution:**

- Register at least one participant first
- Check browser console
- Check `/api/leaderboard` endpoint directly

---

## 📊 Database Verification

### Using MongoDB Compass or mongosh

```javascript
// Connect to database
use codeception

// Check participants
db.participants.find().pretty()

// Check scores
db.scores.find().pretty()

// Count participants
db.participants.count()

// Find specific participant
db.participants.findOne({ email: "test@example.com" })

// Check if participant code exists
db.participants.findOne({ participantCode: "PC1A2B3C" })
```

---

## 🎯 Expected Results

### After Successful Registration

1. Success message appears
2. Participant code is displayed (format: PC + 6 hex chars)
3. Welcome message with participant name
4. Link to puzzle access page

### After Successful Login

1. Login form disappears
2. Mission control area appears
3. Participant name displayed
4. Status shows "STANDBY"
5. Access level shows "GRANTED"

### Leaderboard Display

1. All participants listed
2. Columns: Rank, Name, Score, Time, Status
3. Top 3 highlighted with special styling
4. Auto-refresh every 30 seconds

---

## 📱 Browser Console Commands (for debugging)

```javascript
// Check localStorage
console.log(localStorage.getItem('participantCode'));
console.log(localStorage.getItem('participantEmail'));
console.log(localStorage.getItem('participantName'));

// Clear localStorage
localStorage.clear();

// Test API directly
fetch('/api/leaderboard')
    .then((r) => r.json())
    .then(console.log);

fetch('/api/health')
    .then((r) => r.json())
    .then(console.log);
```

---

## ✅ Checklist Before Deployment

- [ ] All dependencies installed (`npm install`)
- [ ] `.env` file configured with MongoDB URI
- [ ] MongoDB server is running
- [ ] Can register a new participant
- [ ] Can login with email + participant code
- [ ] Leaderboard displays correctly
- [ ] Logout functionality works
- [ ] No console errors in browser
- [ ] No errors in server console
- [ ] Tested on different browsers (Chrome, Firefox, Edge)
- [ ] Mobile responsive design checked

---

## 🔐 Security Checklist

- [x] Passwords are hashed with bcrypt
- [x] Passwords are NOT stored in localStorage
- [x] Email validation implemented
- [x] Participant code is randomly generated
- [x] Register numbers are unique
- [x] Email addresses are unique
- [ ] Add rate limiting (recommended)
- [ ] Add CAPTCHA for registration (recommended)
- [ ] Add admin authentication (recommended)
- [ ] Add email verification (recommended)

---

## 📞 Need Help?

Check these files for reference:

- `MIGRATION_SUMMARY.md` - Complete migration documentation
- `README.md` - Original project setup
- `QUICKSTART.md` - Quick start guide

Happy Testing! 🎉
