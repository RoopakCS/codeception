# Codeception 2025 - Mystery Challenge Guide

## 🎯 Challenge Overview

Codeception 2025 is an individual browser-based mystery challenge where participants use Developer Tools to uncover hidden clues across the website and reach the final secret page.

**Estimated Completion Time:** 2.5 - 3 hours  
**Total Points Available:** 150 points  
**Number of Stages:** 10 stages + Final Page  
**DevTools Features:** Elements, Console, Network, Application, Performance, Sources

---

## 🗺️ Challenge Flow & Walkthrough

### **Stage 1: The Homepage** (20 minutes expected)

**Points:** N/A (Starting point)

**Location:** `/index.html` or `/`

**What Participants See:**

- Normal event homepage with information about Codeception 2025

**Hidden Clue:**

```html
<!-- Maybe the console knows more about me... -->
```

**Steps to Complete:**

1. View page source or inspect element
2. Find the HTML comment above the hero description
3. Open browser console (F12 → Console tab)
4. See console message after 2 seconds:
    ```
    🔍 Good start. Try visiting /decode-me
    ```

**Next Step:** Navigate to `/decode-me`

---

### **Stage 2: /decode-me** (20 minutes expected)

**Points:** 10 points (decode) + 10 points (CSS hint) = 20 points

**What Participants See:**

- Encrypted base64 text:
    ```
    U29tZXRpbWVzIHRoZSBvYnZpb3VzIGlzIGhpZGRlbiBpbiBwbGFpbiBzaWdodA==
    ```
- Input field to enter decoded message
- Hint: "Base64 decoding might help..."

**Steps to Complete:**

1. Decode the base64 string using:
    - Online tool (base64decode.org)
    - Browser console: `atob('U29tZXRp...')`
    - Command line: `echo "..." | base64 -d`

2. Decoded message:

    ```
    Sometimes the obvious is hidden in plain sight
    ```

3. Enter the decoded message in the input field
4. Submit → Receive success message and +10 points
5. Console message appears:

    ```
    🎯 Excellent! Check the CSS carefully. Look for .hint-next
    ```

6. Inspect page CSS (look_deeper.css)
7. Find `.hint-next::before` with content:
    ```css
    content: '/api/getHint?stage=2';
    ```

**Next Step:** Visit `/api/getHint?stage=2`

---

### **Stage 3: Network Tab Hint** (40 minutes expected)

**Points:** 10 points

**What Participants Do:**

1. Open Network tab in DevTools
2. Navigate to `/api/getHint?stage=2`
3. View the API response (JSON):
    ```json
    {
        "next": "/the-dark-corner",
        "hint": "The network tab holds the key to your next destination."
    }
    ```
4. Automatically receive +10 points for accessing this API

**Next Step:** Navigate to `/the-dark-corner`

---

### **Stage 4: The Dark Corner** (40 minutes expected)

**Points:** 10 points (finding page) + 10 points (finding CSS hint) = 20 points

**Location:** `/the-dark-corner`

**What Participants See:**

- Almost completely black page (opacity: 0.05)
- Very faint text: "You're getting closer..."

**Steps to Complete:**

1. Upon visiting, automatically receive +10 points
2. Console message:

    ```
    🌑 Welcome to the dark corner. Inspect the HTML source carefully...
    ```

3. View page source
4. Find HTML comment:

    ```html
    <!-- look_deeper.css might help -->
    ```

5. Open `/look_deeper.css` directly or inspect stylesheet
6. Find the `.clue` class:
    ```css
    .clue {
        background: url('/hidden/final?key=0x91f');
    }
    ```

**Next Step:** Navigate to `/hidden/final?key=0x91f`

---

### **Stage 5: Console Riddle** (30 minutes expected)

**Points:** 10 points (finding script) + 10 points (correct answer) = 20 points

**Location:** `/final-challenge.html` (accessed via `/hidden/final?key=0x91f`)

**What Participants See:**

- Glitching title: "Y0U'R3 4LM0ST TH3R3"
- Binary scrambled text
- Message: "Check the console for your final riddle..."
- Input field for final answer

**Steps to Complete:**

1. Inspect page source
2. Find hidden JavaScript file:

    ```html
    <script src="/static/decodeFinal.js"></script>
    ```

3. Script loads and automatically awards +10 points
4. Console displays riddle after 1.5 seconds:

    ```
    ╔════════════════════════════════════════╗
    ║   🔐 FINAL RIDDLE - READ CAREFULLY   ║
    ╚════════════════════════════════════════╝

    You've made it this far.
    What's the color of success?

    💡 Hint: Look at the theme of this website...
    ```

5. Answer: **cyan** (or #00FFFF or 00ffff or rgb(0,255,255))
6. Submit answer → +10 points
7. Redirect to next stage

**Next Step:** `/localStorage-vault`

---

### **Stage 6: localStorage Vault** (20 minutes expected)

**Points:** 15 points

**Location:** `/localStorage-vault`

**What Participants See:**

- Vault door graphic
- Message: "The vault is locked. Find the key in your storage..."
- Input field for vault key

**Steps to Complete:**

1. Open Application tab (F12 → Application)
2. Navigate to "Local Storage" → `http://localhost:3000`
3. Find the key: `secret_vault_key`
4. Value: `CODECEPTION_2025_VAULT_OPEN`
5. Enter the value in input field → +15 points
6. Console message: "Check the Network tab on this page..."
7. Refresh the page with Network tab open
8. Find the request to `/api/vault-unlock`
9. Click on it → Go to "Response Headers"
10. Find custom header: `X-Next-Stage: /network-master`

**Next Step:** Navigate to `/network-master.html`

---

### **Stage 7: Network Master** (25 minutes expected)

**Points:** 15 points

**Location:** `/network-master.html`

**What Participants See:**

- Network visualization graphic
- Message: "A secret code travels through the network..."
- Input field for challenge code

**Steps to Complete:**

1. Open Network tab
2. Page automatically makes POST request to `/api/network-challenge`
3. Click on the request in Network tab
4. Navigate to "Headers" section
5. Scroll down to "Response Headers"
6. Find: `X-Challenge-Code: NTW_2025_MASTER`
7. Enter `NTW_2025_MASTER` in input field → +15 points
8. Console shows: "Cookies hold the sweetest secrets..."
9. Open Application tab → Cookies → `http://localhost:3000`
10. Find cookie: `next_challenge` with value `/cookies-matter`

**Next Step:** Navigate to `/cookies-matter.html`

---

### **Stage 8: Cookies Matter** (20 minutes expected)

**Points:** 15 points

**Location:** `/cookies-matter.html`

**What Participants See:**

- Cookie jar graphic
- Message: "One of these cookies holds the answer..."
- Input field for cookie value

**Steps to Complete:**

1. Open Application tab → Cookies → `http://localhost:3000`
2. Find cookie: `challenge_cookie`
3. Value: `COOKIE_MONSTER_2025`
4. Enter in input field → +15 points
5. New cookie is set: `performance_key` with value `/performance-puzzle`
6. Check cookies again to find the next location

**Next Step:** Navigate to `/performance-puzzle.html`

---

### **Stage 9: Performance Puzzle** (30 minutes expected)

**Points:** 15 points

**Location:** `/performance-puzzle.html`

**What Participants See:**

- Performance chart graphic
- Button: "Trigger Performance Event"
- Message: "Record the performance to find the hidden mark..."
- Input field for secret code

**Steps to Complete:**

1. Open Performance tab (F12 → Performance)
2. Click the "Record" button (red circle)
3. Click "Trigger Performance Event" button on the page
4. Stop recording
5. In the timeline, look for "User Timing" section
6. Find the custom mark: "codeception-secret"
7. Click on it to see details
8. The mark contains the secret: `PERF_MASTER_2025`
9. Enter in input field → +15 points
10. Console message: "Master the console... try window.getNextStage()"
11. In console, type: `window.getNextStage()`
12. Returns: `/console-wizardry`

**Next Step:** Navigate to `/console-wizardry.html`

---

### **Stage 10: Console Wizardry & Sources Debugging** (40 minutes expected)

**Points:** 15 points (console) + 15 points (sources) = 30 points

**Location:** `/console-wizardry.html`

**What Participants See:**

- Console terminal graphic
- Message: "The console holds the power. Type help() to begin..."
- Two input fields: one for console code, one for debugger secret

**Steps to Complete - Part 1 (Console):**

1. Open Console tab
2. Page logs: "🔮 Type help() to reveal your path..."
3. Type in console: `help()`
4. Returns list of available functions
5. Type: `revealClue()`
6. Console shows: "The answer lies in the network..."
7. Type: `checkNetwork()`
8. This makes an API call to `/api/console-final`
9. Open Network tab
10. Find the request to `/api/console-final`
11. View Response:
    ```json
    { "finalCode": "CONSOLE_WIZARD_2025" }
    ```
12. Enter `CONSOLE_WIZARD_2025` in first input field → +15 points

**Steps to Complete - Part 2 (Sources):**

1. Console message: "One more challenge... explore the Sources tab"
2. Go to Sources tab (F12 → Sources)
3. Navigate to `static/sourceChallenge.js`
4. Find the function `getFinalKey()`
5. Set a breakpoint on the line with `secretKey` variable (click line number)
6. In console, call: `getFinalKey()`
7. Debugger pauses at breakpoint
8. Hover over the `secretKey` variable or check Scope panel
9. Value: `SOURCE_DEBUGGER_MASTER`
10. Enter in second input field → +15 points
11. Redirect to final access page

**Final Step:** `/final-access.html`

---

### **Final Page: Access Granted**

**Points:** +50 completion bonus

**What Participants See:**

- Large "ACCESS GRANTED" message
- Congratulations with participant name
- Completion statistics:
    - Total Points
    - Completion Time
    - Rank on leaderboard
- Link to view final leaderboard

**What Happens:**

- Challenge marked as completed
- +50 bonus points awarded
- Total time calculated
- Status changed to "completed"

---

## 📊 Scoring Breakdown

| Stage     | Activity                         | Points         |
| --------- | -------------------------------- | -------------- |
| Stage 1   | Find HTML comment & console clue | 0              |
| Stage 2   | Decode base64 message            | 10             |
| Stage 3   | Use Network tab to find API hint | 10             |
| Stage 4   | Access dark corner page          | 10             |
| Stage 5   | Find hidden JavaScript file      | 10             |
| Stage 5   | Answer console riddle (color)    | 10             |
| Stage 6   | Find localStorage vault key      | 15             |
| Stage 7   | Extract Network header code      | 15             |
| Stage 8   | Find cookie value                | 15             |
| Stage 9   | Discover Performance mark        | 15             |
| Stage 10  | Console wizardry challenge       | 15             |
| Stage 10  | Sources debugger challenge       | 15             |
| **Final** | **Complete entire challenge**    | **+50**        |
| **TOTAL** |                                  | **150 points** |

---

## 🎨 Theme & Immersion Elements

### Console Messages

Throughout the challenge, participants encounter themed console messages:

- Stage 1: Cyan colored hint about /decode-me
- Stage 2: Green success message about CSS
- Stage 4: Purple message about dark corner
- Stage 5: Boxed riddle with color hints

### Visual Effects

- **Glitch animations** on final challenge title
- **Scanning lines** on challenge cards
- **Neon glow effects** on success messages
- **Dark atmospheric** design throughout
- **Success pulse animation** on completion page

### Hidden Warnings (Extra Immersion)

Could add:

- Fake console warnings: "You're getting closer... but are you sure this is the right path?"
- Fake error messages in some pages
- Audio effects on clue discovery (optional)
- Flicker effects when finding hidden elements

---

## 🛠️ Tools Participants Need

1. **Browser DevTools (F12)**
    - **Elements tab:** Inspect HTML structure and comments
    - **Console tab:** View messages, execute JavaScript commands
    - **Network tab:** Monitor API requests, view headers and responses
    - **Application tab:** Inspect localStorage, cookies, session storage
    - **Performance tab:** Record performance profiles, find User Timing marks
    - **Sources tab:** View JavaScript files, set breakpoints, debug code

2. **Base64 Decoder**
    - Online: base64decode.org
    - Browser console: `atob('encoded_string')`
    - Command line tools

3. **Console Commands Used**
    - `atob()` - Decode base64
    - `localStorage.getItem()` - Access localStorage
    - `help()` - Stage 10 command
    - `revealClue()` - Stage 10 command
    - `checkNetwork()` - Stage 10 command
    - `window.getNextStage()` - Stage 9 command
    - `getFinalKey()` - Stage 10 debugger trigger

4. **Text Editor (Optional)**
    - To view downloaded CSS/JS files
    - To organize clues and notes

---

## 🔧 Admin Features

### Scoring Endpoints

```javascript
POST /api/award-points
{
  "participantCode": "PC1A2B3C",
  "email": "participant@example.com",
  "points": 10,
  "stage": "stage2_decode"
}
```

### Completion Endpoint

```javascript
POST /api/complete-challenge
{
  "participantCode": "PC1A2B3C",
  "email": "participant@example.com"
}
```

### Hint API

```javascript
GET /api/getHint?stage=2
Response: {
  "next": "/the-dark-corner",
  "hint": "The network tab holds the key..."
}
```

---

## 📝 Database Schema Updates

### Score Document Fields

```javascript
{
  // Existing fields...
  completedStages: [String],  // NEW: Track completed stages
  startTime: Date,            // NEW: When they started
  completionTime: Date,       // NEW: When they finished
  score: Number,              // Updated with points
  timeTaken: Number,          // Calculated in minutes
  status: String              // 'pending' → 'active' → 'completed'
}
```

### Stage Names

- `stage2_decode`
- `stage3_dark_corner`
- `stage4_found_script`
- `stage4_final_challenge`

---

## 🧪 Testing the Challenge

### Quick Test Flow

1. Register participant
2. Log in to puzzle portal
3. Return to homepage
4. Open console → see first clue
5. Navigate through each stage
6. Check points awarding after each stage
7. Complete final challenge
8. Verify completion page shows stats
9. Check leaderboard for rank

### Verification Checklist

- [ ] HTML comment visible in homepage source
- [ ] Console message appears after 2 seconds
- [ ] Base64 decode works correctly
- [ ] CSS hint `.hint-next` contains API URL
- [ ] Network tab shows /api/getHint response
- [ ] Dark corner page is nearly invisible
- [ ] look_deeper.css contains .clue URL
- [ ] decodeFinal.js loads and shows riddle
- [ ] "cyan" answer redirects to final page
- [ ] Completion bonus +50 points awarded
- [ ] Time calculated correctly
- [ ] Rank displayed on completion page

---

## 🎯 Expected Difficulty Timeline

| Time Range  | Activity                                                |
| ----------- | ------------------------------------------------------- |
| 0-20 min    | Find HTML comment, open console, navigate to /decode-me |
| 20-40 min   | Decode base64, find CSS hint, discover Network tab clue |
| 40-60 min   | Navigate dark corner, find CSS file, locate hidden URL  |
| 60-90 min   | Solve console riddle, discover localStorage vault       |
| 90-110 min  | Network master challenge, extract headers               |
| 110-130 min | Cookies challenge, find cookie values                   |
| 130-160 min | Performance puzzle, find User Timing marks              |
| 160-200 min | Console wizardry and Sources debugging                  |

**Total: ~180 minutes (2.5-3 hours)**

---

## 💡 Hints for Participants (If Stuck)

### Stuck on Stage 1?

- "Try right-clicking the page and selecting 'View Page Source'"
- "Have you opened the browser console? (Press F12)"

### Stuck on Stage 2?

- "Base64 is a common encoding method - try searching 'base64 decoder'"
- "After decoding, look carefully at the page's stylesheets"

### Stuck on Stage 3?

- "The Network tab in DevTools shows all requests - try visiting that URL"

### Stuck on Stage 4?

- "The page is dark, but the HTML source is still readable"
- "CSS files can contain more than just styling..."

### Stuck on Stage 5?

- "Check if there are any external JavaScript files loaded"
- "The console holds your final riddle"
- "Think about the color scheme of this website"

---

## 🚀 Deployment Notes

1. Ensure all challenge HTML files are in the project root
2. Create `/static/` directory for decodeFinal.js
3. Add `look_deeper.css` to project root
4. MongoDB must be running for scoring
5. Participants must be logged in to earn points
6. Leaderboard updates in real-time as points are awarded

---

**Good luck, and may the best coder win!** 🎉
