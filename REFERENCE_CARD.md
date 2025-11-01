# 🎯 Codeception 2025 - Quick Reference Card

## Essential Info

- **Total Stages:** 10
- **Total Points:** 150 (100 from stages + 50 completion bonus)
- **Time:** 2.5-3 hours
- **Requirement:** Browser DevTools proficiency

---

## 🗺️ Stage Navigation Map

```
Homepage (Stage 1)
    ↓ (console clue)
/decode-me (Stage 2) [+10]
    ↓ (CSS hint + API)
/the-dark-corner (Stage 3 & 4) [+10 + +10]
    ↓ (CSS background URL)
/final-challenge (Stage 5) [+10 + +10]
    ↓ (answer riddle)
/localStorage-vault (Stage 6) [+15]
    ↓ (response header)
/network-master (Stage 7) [+15]
    ↓ (cookie value)
/cookies-matter (Stage 8) [+15]
    ↓ (cookie navigation)
/performance-puzzle (Stage 9) [+15]
    ↓ (console command)
/console-wizardry (Stage 10) [+15 + +15]
    ↓ (debugger secret)
/final-access [+50 BONUS] = 150 TOTAL
```

---

## 🔑 All Answers & Secrets

| Stage | What to Find     | Answer/Value                                     |
| ----- | ---------------- | ------------------------------------------------ |
| 1     | Console clue     | Navigate to `/decode-me`                         |
| 2     | Base64 decode    | `Sometimes the obvious is hidden in plain sight` |
| 3     | API hint         | Navigate to `/the-dark-corner`                   |
| 4     | CSS clue         | Navigate to `/hidden/final?key=0x91f`            |
| 5     | Console riddle   | `cyan` or `#00FFFF` or `rgb(0,255,255)`          |
| 6     | localStorage key | `CODECEPTION_2025_VAULT_OPEN`                    |
| 6     | Response header  | Navigate to `/network-master`                    |
| 7     | Network header   | `NTW_2025_MASTER`                                |
| 7     | Cookie           | Navigate to `/cookies-matter`                    |
| 8     | Cookie value     | `COOKIE_MONSTER_2025`                            |
| 9     | Performance mark | `PERF_MASTER_2025`                               |
| 9     | Console command  | `window.getNextStage()` → `/console-wizardry`    |
| 10    | Console API      | `CONSOLE_WIZARD_2025`                            |
| 10    | Debugger secret  | `SOURCE_DEBUGGER_MASTER`                         |

---

## 💻 Essential Console Commands

```javascript
// Stage 2: Decode base64
atob('U29tZXRpbWVzIHRoZSBvYnZpb3VzIGlzIGhpZGRlbiBpbiBwbGFpbiBzaWdodA==');

// Stage 6: View localStorage
localStorage;
localStorage.getItem('secret_vault_key');

// Stage 9: Get next stage
window.getNextStage();

// Stage 10: Console wizardry
help();
revealClue();
checkNetwork();

// Stage 10: Trigger debugger
getFinalKey(); // Then inspect in Sources tab
```

---

## 🛠️ DevTools Tab Checklist

### Stage 1-2: Elements + Console

- [ ] View HTML comments
- [ ] Open Console tab
- [ ] Execute `atob()` command

### Stage 3: Network

- [ ] Open Network tab
- [ ] Navigate to API endpoint
- [ ] View JSON response

### Stage 4-5: Sources

- [ ] Navigate to CSS file
- [ ] Find JavaScript file
- [ ] View console riddles

### Stage 6: Application → localStorage

- [ ] Open Application tab
- [ ] Expand "Local Storage"
- [ ] Find vault key

### Stage 7: Network → Headers

- [ ] View request in Network tab
- [ ] Check "Response Headers"
- [ ] Find custom `X-Challenge-Code` header

### Stage 8: Application → Cookies

- [ ] Open Application tab
- [ ] Navigate to Cookies
- [ ] Find `challenge_cookie`

### Stage 9: Performance

- [ ] Open Performance tab
- [ ] Click Record button
- [ ] Trigger event
- [ ] Stop recording
- [ ] Find User Timing mark

### Stage 10: Console + Sources

- [ ] Call custom functions in Console
- [ ] View Network response
- [ ] Navigate to Sources tab
- [ ] Set breakpoint
- [ ] Inspect variable

---

## 📍 Where to Find What

### HTML Comments:

- Homepage (Stage 1)
- The Dark Corner (Stage 4)

### Console Messages:

- Homepage (Stage 1)
- decode-me (Stage 2)
- final-challenge (Stage 5)
- All stages (success messages)

### localStorage:

- Application tab → Local Storage → `http://localhost:3000`
- Key: `secret_vault_key`

### Cookies:

- Application tab → Cookies → `http://localhost:3000`
- `challenge_cookie` (Stage 8)
- `next_challenge` (Stage 7)
- `performance_key` (Stage 9)

### Network Headers:

- `/api/vault-unlock` → `X-Next-Stage` header
- `/api/network-challenge` → `X-Challenge-Code` header

### Performance Marks:

- Performance tab → User Timing section
- Mark name: `codeception-secret`

### JavaScript Files:

- `/static/decodeFinal.js` (Stage 5)
- `/static/sourceChallenge.js` (Stage 10)

---

## ⚡ Quick Tips

### Stuck on Base64?

```javascript
atob('encoded_string_here');
```

### Can't find localStorage?

Press F12 → Application → Local Storage → http://localhost:3000

### Network tab empty?

Refresh the page while Network tab is open

### Cookie not showing?

Make sure you're looking at the right domain (localhost:3000)

### Performance mark not visible?

1. Start recording FIRST
2. THEN click the button
3. Stop recording
4. Look in "User Timing" section

### Debugger not pausing?

1. Set breakpoint on the line with the variable
2. THEN call the function in Console
3. Hover over variables or check Scope panel

---

## 🎯 Point Distribution

- Stages 1-5: **10 points each** (50 total)
- Stages 6-10: **15 points each** (75 total, includes Stage 10's 2 parts)
- **Completion Bonus:** +50 points
- **GRAND TOTAL:** 150 points

---

## 🏁 Completion Checklist

- [ ] Stage 1: Found HTML comment
- [ ] Stage 2: Decoded base64 (+10)
- [ ] Stage 3: Found API hint (+10)
- [ ] Stage 4: Accessed dark corner (+10)
- [ ] Stage 5: Found script file (+10)
- [ ] Stage 5: Answered riddle (+10)
- [ ] Stage 6: Found localStorage key (+15)
- [ ] Stage 7: Extracted network header (+15)
- [ ] Stage 8: Found cookie value (+15)
- [ ] Stage 9: Discovered performance mark (+15)
- [ ] Stage 10: Console wizardry (+15)
- [ ] Stage 10: Debugger secret (+15)
- [ ] Final: Reached completion page (+50)
- [ ] **Total: 150 points ✓**

---

## 📱 Browser Shortcuts

- **F12** - Open DevTools
- **Ctrl+Shift+C** - Inspect Element
- **Ctrl+Shift+J** - Open Console
- **Ctrl+U** - View Page Source
- **Ctrl+Shift+I** - DevTools (alternate)
- **Ctrl+R** - Refresh page
- **Ctrl+Shift+R** - Hard refresh

---

## 🚨 Common Mistakes

1. **Not refreshing** with Network tab open
2. **Missing response headers** in Network tab
3. **Wrong cookie domain** (use localhost:3000)
4. **Recording performance AFTER** clicking button
5. **Not setting breakpoint BEFORE** calling function
6. **Case-sensitive answers** (most are case-insensitive)
7. **Forgetting to login** (points won't be awarded)

---

**Print this card and keep it handy during the challenge!**

**Good luck! 🎉**
