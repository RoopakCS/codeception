# Codeception 2025 - Quick Start Guide 🚀# Quick Start Guide - Codeception 2025



## 🎯 Challenge Overview## 🚀 Get Started in 5 Minutes



**Total Stages:** 10  ### Step 1: Install Dependencies

**Total Points:** 150 points  ```bash

**Estimated Time:** 2.5 - 3 hours  npm install

**Difficulty:** Progressive (Easy → Expert)```



---This will install:

- express (web framework)

## 📋 Stage-by-Stage Solutions- mongoose (MongoDB ODM)

- cors (Cross-Origin Resource Sharing)

### **Stage 1: HTML Comments** - dotenv (environment variables)

📍 Location: `/index.html`  - nodemon (development auto-reload)

🎯 Points: 0 (Starting point)

### Step 2: Setup MongoDB

**Solution:**

1. Open browser DevTools (F12)**Option A: Local MongoDB**

2. View page source or inspect element1. Install MongoDB from https://www.mongodb.com/try/download/community

3. Find HTML comment: `<!-- Maybe the console knows more about me... -->`2. Start MongoDB: `mongod`

4. Open Console tab3. Use the default connection string in `.env`

5. See message: "🔍 Good start. Try visiting /decode-me"

6. Navigate to `/decode-me`**Option B: MongoDB Atlas (Recommended)**

1. Go to https://www.mongodb.com/cloud/atlas

---2. Create a free account

3. Create a new cluster (M0 Free tier)

### **Stage 2: Base64 Decoding**4. Create a database user (Database Access → Add New User)

📍 Location: `/decode-me`  5. Whitelist your IP (Network Access → Add IP Address → Add Current IP)

🎯 Points: 106. Get connection string (Connect → Connect your application)

7. Update `.env` with your connection string

**Encrypted Message:**

```### Step 3: Configure Environment

U29tZXRpbWVzIHRoZSBvYnZpb3VzIGlzIGhpZGRlbiBpbiBwbGFpbiBzaWdodA==```bash

```# Copy the example file

cp .env.example .env

**Solution:**

1. Decode base64 in console:# Edit .env with your settings

   ```javascript# For local MongoDB:

   atob('U29tZXRpbWVzIHRoZSBvYnZpb3VzIGlzIGhpZGRlbiBpbiBwbGFpbiBzaWdodA==')MONGODB_URI=mongodb://localhost:27017/codeception

   ```

2. **Answer:** `Sometimes the obvious is hidden in plain sight`# For MongoDB Atlas:

3. Enter in input field → +10 pointsMONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codeception

4. Check console for CSS hint```

5. Inspect `look_deeper.css` → find `.hint-next::before`

6. Navigate to `/api/getHint?stage=2`### Step 4: Start the Server

```bash

---# Production mode

npm start

### **Stage 3: Network Tab & API**

📍 Location: `/api/getHint?stage=2`  # Development mode (auto-reload)

🎯 Points: 10npm run dev

```

**Solution:**

1. Open Network tab (F12 → Network)### Step 5: Open in Browser

2. Visit `/api/getHint?stage=2````

3. Click the request in Network tabhttp://localhost:3000

4. View Response:```

   ```json

   {## 📋 Testing the Application

     "next": "/the-dark-corner",

     "hint": "The network tab holds the key..."### 1. Register a Team

   }1. Go to http://localhost:3000/register.html

   ```2. Fill in:

5. +10 points awarded automatically   - Team Name: "Test Team"

6. Navigate to `/the-dark-corner`   - Email: "test@example.com"

   - Member 1: "John Doe"

---3. Click "Register Team"

4. Save the team code that appears!

### **Stage 4: Dark Corner CSS**

📍 Location: `/the-dark-corner`  ### 2. View Leaderboard

🎯 Points: 101. Go to http://localhost:3000/leaderboard.html

2. You should see an empty leaderboard initially

**Solution:**3. Click "Refresh" to update

1. Page is nearly black (opacity 0.05)

2. +10 points awarded on arrival### 3. Access Puzzle Portal

3. View page source (Ctrl+U)1. Go to http://localhost:3000/puzzle.html

4. Find comment: `<!-- look_deeper.css might help -->`2. Enter your team name and code from registration

5. Open `/look_deeper.css` in Sources tab3. Click "Access Puzzle"

6. Find `.clue` class with background URL:4. You'll see the mission control interface

   ```css

   background: url("/hidden/final?key=0x91f");## 🧪 Testing API Endpoints

   ```

7. Navigate to `/hidden/final?key=0x91f`You can test the API using curl, Postman, or your browser:



---### Health Check

```bash

### **Stage 5: Console Riddle**curl http://localhost:3000/api/health

📍 Location: `/final-challenge.html` (via redirect)  ```

🎯 Points: 20 (10 for script + 10 for answer)

### Register a Team

**Solution:**```bash

1. View page sourcecurl -X POST http://localhost:3000/api/register \

2. Find `<script src="/static/decodeFinal.js"></script>`  -H "Content-Type: application/json" \

3. Script loads → +10 points  -d '{

4. Console shows riddle after 1.5s    "teamName": "API Test Team",

5. **Answer:** Any cyan color format:    "leaderEmail": "api@test.com",

   - `cyan`    "members": ["Member 1", "Member 2"]

   - `#00FFFF`  }'

   - `00FFFF````

   - `rgb(0, 255, 255)`

6. Submit → +10 points### Get Leaderboard

7. Navigate to `/localStorage-vault````bash

curl http://localhost:3000/api/leaderboard

---```



### **Stage 6: localStorage Vault**### Update Score (Save the teamCode from registration first)

📍 Location: `/localStorage-vault`  ```bash

🎯 Points: 15curl -X PUT http://localhost:3000/api/score/ABCD1234 \

  -H "Content-Type: application/json" \

**Solution:**  -d '{

1. Open Application tab (F12 → Application)    "score": 100,

2. Expand "Local Storage" → `http://localhost:3000`    "timeTaken": 45,

3. Find key: `secret_vault_key`    "status": "completed"

4. **Value:** `CODECEPTION_2025_VAULT_OPEN`  }'

5. Enter in input field → +15 points```

6. Console message: "Check the Network tab on this page..."

7. Refresh page while Network tab is open## 🔧 Troubleshooting

8. Find request to `/api/vault-unlock`

9. View Response Headers### Server won't start

10. Find `X-Next-Stage` header: `/network-master`- Check if MongoDB is running

11. Navigate to `/network-master.html`- Verify `.env` file exists and has correct values

- Try deleting `node_modules` and running `npm install` again

---

### Can't connect to MongoDB

### **Stage 7: Network Master**- If using local MongoDB, ensure it's running (`mongod`)

📍 Location: `/network-master.html`  - If using Atlas, check your connection string

🎯 Points: 15- Verify IP whitelist in MongoDB Atlas

- Check username and password are correct

**Solution:**

1. Open Network tab### Registration not working

2. Page makes POST request to `/api/network-challenge`- Open browser console (F12) to see errors

3. Click the request in Network tab- Check server console for error messages

4. Go to **Headers** section- Verify MongoDB connection is active

5. Find custom header: `X-Challenge-Code: NTW_2025_MASTER`

6. Enter in input field → +15 points### Leaderboard shows "Unable to Load"

7. Console shows: "Cookies hold the next clue..."- Make sure server is running

8. Open Application tab → Cookies- Check if there are any CORS errors in browser console

9. Find cookie: `next_challenge`- Verify MongoDB connection

10. **Value:** `/cookies-matter`

11. Navigate to `/cookies-matter.html`## 📝 Common Tasks



---### Add Sample Data for Testing

```javascript

### **Stage 8: Cookies Matter**// Connect to MongoDB shell

📍 Location: `/cookies-matter.html`  mongo

🎯 Points: 15

// Use codeception database

**Solution:**use codeception

1. Open Application tab → Cookies

2. Find cookie: `challenge_cookie`// Add a sample team

3. **Value:** `COOKIE_MONSTER_2025`db.teams.insertOne({

4. Enter in input field → +15 points  teamName: "Sample Team",

5. Page sets new cookie: `performance_key`  leaderEmail: "sample@test.com",

6. Value: `/performance-puzzle`  members: ["Alice", "Bob"],

7. Navigate to `/performance-puzzle.html`  teamCode: "TEST1234",

  registrationDate: new Date(),

---  active: true

})

### **Stage 9: Performance Puzzle**

📍 Location: `/performance-puzzle.html`  // Add a sample score

🎯 Points: 15db.scores.insertOne({

  teamName: "Sample Team",

**Solution:**  teamCode: "TEST1234",

1. Open Performance tab (F12 → Performance)  score: 150,

2. Click "Record" button (circle icon)  timeTaken: 60,

3. Click "Trigger Performance Event" button on page  status: "completed",

4. Stop recording  lastUpdated: new Date()

5. In timeline, find custom User Timing mark})

6. Look for "codeception-secret" mark```

7. Click it to see details

8. **Answer:** `PERF_MASTER_2025`### View All Teams

9. Enter in input field → +15 points```bash

10. Console message about advanced console featurescurl http://localhost:3000/api/teams

11. Type in console: `window.getNextStage()````

12. Returns: `/console-wizardry`

13. Navigate to `/console-wizardry.html`### Clear All Data

```javascript

---// In MongoDB shell

use codeception

### **Stage 10: Console Wizardry**db.teams.deleteMany({})

📍 Location: `/console-wizardry.html`  db.scores.deleteMany({})

🎯 Points: 15```



**Solution:**## 🎨 Customization

1. Open Console tab

2. Page logs: "Type help() to begin"### Change Event Date

3. Type: `help()`Edit `script.js` line ~350:

4. Returns function names to call```javascript

5. Call functions in order:const eventDate = new Date('2025-03-15T10:00:00');

   ```javascript```

   revealClue()      // Shows: "The answer is hidden in the network"

   checkNetwork()    // Makes API call to /api/console-final### Change Port

   ```Edit `.env`:

6. Open Network tab```

7. Find `/api/console-final` requestPORT=8080

8. View Response:```

   ```json

   { "finalCode": "CONSOLE_WIZARD_2025" }### Change Colors

   ```Edit `style.css` at the top:

9. Enter in input field → +15 points```css

10. Console shows: "One more step... check Sources tab":root {

11. Go to Sources tab    --bg-primary: #0A0F1C;

12. Navigate to `/static/sourceChallenge.js`    --accent-cyan: #00FFFF;

13. Find function `getFinalKey()`    /* ... modify as needed */

14. Set breakpoint on line with `secretKey` variable}

15. In console, call: `getFinalKey()````

16. Debugger pauses, hover over `secretKey`

17. **Value:** `SOURCE_DEBUGGER_MASTER`## 📚 Next Steps

18. Enter in input field → redirects to `/final-access.html`

1. **Add Authentication**: Implement JWT for admin endpoints

---2. **Add Email Notifications**: Send confirmation emails on registration

3. **Create Admin Panel**: Build an admin interface to manage teams

### **Final Page: Access Granted**4. **Add Puzzle System**: Implement the actual puzzle website

📍 Location: `/final-access.html`  5. **Deploy to Production**: Deploy to Heroku, Vercel, or AWS

🎯 Points: +50 Completion Bonus

## 🆘 Need Help?

**What You Get:**

- **Total Points:** 150- Check `README.md` for detailed documentation

- **Completion Time:** (your time)- Review code comments in `server.js` and `script.js`

- **Rank:** (your position)- Test API endpoints using the examples above

- **Achievement Unlocked:** DevTools Master 🏆- Check browser console and server logs for errors



------



## 📊 Points Breakdown**Happy Coding! 🚀**


| Stage | Challenge | Points |
|-------|-----------|--------|
| 1 | HTML Comment | 0 |
| 2 | Base64 Decode | 10 |
| 3 | Network Tab API | 10 |
| 4 | Dark Corner CSS | 10 |
| 5 | Console Riddle (script) | 10 |
| 5 | Console Riddle (answer) | 10 |
| 6 | localStorage Vault | 15 |
| 7 | Network Master | 15 |
| 8 | Cookies Matter | 15 |
| 9 | Performance Puzzle | 15 |
| 10 | Console Wizardry | 15 |
| 10 | Sources Debugger | 15 |
| **Bonus** | **Completion** | **+50** |
| **TOTAL** | | **150** |

---

## 🛠️ DevTools Features Used

### Elements Tab
- ✅ Inspect HTML structure
- ✅ View HTML comments
- ✅ Check CSS in Styles panel

### Console Tab
- ✅ View console messages
- ✅ Execute JavaScript commands
- ✅ Call custom functions
- ✅ Decode base64 with `atob()`

### Network Tab
- ✅ Monitor HTTP requests
- ✅ View API responses
- ✅ Inspect request/response headers
- ✅ Check cookies in requests

### Application Tab
- ✅ View localStorage items
- ✅ Inspect cookies
- ✅ Check session storage

### Performance Tab
- ✅ Record performance profiles
- ✅ Find User Timing marks
- ✅ Analyze custom events

### Sources Tab
- ✅ View JavaScript files
- ✅ Set breakpoints
- ✅ Step through code
- ✅ Inspect variables during debug

---

## 🎯 Pro Tips

### For Base64 Decoding:
```javascript
// In console
atob('encoded_string')
```

### For localStorage:
```javascript
// View all
localStorage

// Get specific key
localStorage.getItem('key_name')
```

### For Cookies:
Application Tab → Cookies → http://localhost:3000

### For Network Headers:
Network tab → Click request → Headers section

### For Performance:
1. Open Performance tab
2. Click Record (circle)
3. Perform action
4. Stop recording
5. Look for User Timing marks

### For Sources Debugging:
1. Sources tab → navigate to file
2. Click line number to set breakpoint
3. Execute function in Console
4. Hover over variables when paused

---

## 🔥 Quick Command Reference

```javascript
// Console commands you'll need
atob('...')                    // Decode base64
localStorage.getItem('key')    // Get localStorage
window.getNextStage()          // Stage 9 command
help()                         // Stage 10 command
revealClue()                   // Stage 10 command
checkNetwork()                 // Stage 10 command
getFinalKey()                  // Stage 10 command (sets breakpoint)
```

---

## 🚀 Getting Started

1. **Register:** `/register.html`
2. **Login:** `/puzzle.html` (use email + participant code)
3. **Start Challenge:** Go to homepage (`/`)
4. **Open DevTools:** Press F12
5. **Follow the clues!**

---

**Total Estimated Time:** 2.5 - 3 hours  
**Difficulty:** 📈 Progressively harder  
**Requirement:** Strong understanding of browser DevTools

Good luck, and may the best developer win! 🎉
