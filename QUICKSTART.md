# Quick Start Guide - Codeception 2025

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

This will install:
- express (web framework)
- mongoose (MongoDB ODM)
- cors (Cross-Origin Resource Sharing)
- dotenv (environment variables)
- nodemon (development auto-reload)

### Step 2: Setup MongoDB

**Option A: Local MongoDB**
1. Install MongoDB from https://www.mongodb.com/try/download/community
2. Start MongoDB: `mongod`
3. Use the default connection string in `.env`

**Option B: MongoDB Atlas (Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (M0 Free tier)
4. Create a database user (Database Access → Add New User)
5. Whitelist your IP (Network Access → Add IP Address → Add Current IP)
6. Get connection string (Connect → Connect your application)
7. Update `.env` with your connection string

### Step 3: Configure Environment
```bash
# Copy the example file
cp .env.example .env

# Edit .env with your settings
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/codeception

# For MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codeception
```

### Step 4: Start the Server
```bash
# Production mode
npm start

# Development mode (auto-reload)
npm run dev
```

### Step 5: Open in Browser
```
http://localhost:3000
```

## 📋 Testing the Application

### 1. Register a Team
1. Go to http://localhost:3000/register.html
2. Fill in:
   - Team Name: "Test Team"
   - Email: "test@example.com"
   - Member 1: "John Doe"
3. Click "Register Team"
4. Save the team code that appears!

### 2. View Leaderboard
1. Go to http://localhost:3000/leaderboard.html
2. You should see an empty leaderboard initially
3. Click "Refresh" to update

### 3. Access Puzzle Portal
1. Go to http://localhost:3000/puzzle.html
2. Enter your team name and code from registration
3. Click "Access Puzzle"
4. You'll see the mission control interface

## 🧪 Testing API Endpoints

You can test the API using curl, Postman, or your browser:

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Register a Team
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "teamName": "API Test Team",
    "leaderEmail": "api@test.com",
    "members": ["Member 1", "Member 2"]
  }'
```

### Get Leaderboard
```bash
curl http://localhost:3000/api/leaderboard
```

### Update Score (Save the teamCode from registration first)
```bash
curl -X PUT http://localhost:3000/api/score/ABCD1234 \
  -H "Content-Type: application/json" \
  -d '{
    "score": 100,
    "timeTaken": 45,
    "status": "completed"
  }'
```

## 🔧 Troubleshooting

### Server won't start
- Check if MongoDB is running
- Verify `.env` file exists and has correct values
- Try deleting `node_modules` and running `npm install` again

### Can't connect to MongoDB
- If using local MongoDB, ensure it's running (`mongod`)
- If using Atlas, check your connection string
- Verify IP whitelist in MongoDB Atlas
- Check username and password are correct

### Registration not working
- Open browser console (F12) to see errors
- Check server console for error messages
- Verify MongoDB connection is active

### Leaderboard shows "Unable to Load"
- Make sure server is running
- Check if there are any CORS errors in browser console
- Verify MongoDB connection

## 📝 Common Tasks

### Add Sample Data for Testing
```javascript
// Connect to MongoDB shell
mongo

// Use codeception database
use codeception

// Add a sample team
db.teams.insertOne({
  teamName: "Sample Team",
  leaderEmail: "sample@test.com",
  members: ["Alice", "Bob"],
  teamCode: "TEST1234",
  registrationDate: new Date(),
  active: true
})

// Add a sample score
db.scores.insertOne({
  teamName: "Sample Team",
  teamCode: "TEST1234",
  score: 150,
  timeTaken: 60,
  status: "completed",
  lastUpdated: new Date()
})
```

### View All Teams
```bash
curl http://localhost:3000/api/teams
```

### Clear All Data
```javascript
// In MongoDB shell
use codeception
db.teams.deleteMany({})
db.scores.deleteMany({})
```

## 🎨 Customization

### Change Event Date
Edit `script.js` line ~350:
```javascript
const eventDate = new Date('2025-03-15T10:00:00');
```

### Change Port
Edit `.env`:
```
PORT=8080
```

### Change Colors
Edit `style.css` at the top:
```css
:root {
    --bg-primary: #0A0F1C;
    --accent-cyan: #00FFFF;
    /* ... modify as needed */
}
```

## 📚 Next Steps

1. **Add Authentication**: Implement JWT for admin endpoints
2. **Add Email Notifications**: Send confirmation emails on registration
3. **Create Admin Panel**: Build an admin interface to manage teams
4. **Add Puzzle System**: Implement the actual puzzle website
5. **Deploy to Production**: Deploy to Heroku, Vercel, or AWS

## 🆘 Need Help?

- Check `README.md` for detailed documentation
- Review code comments in `server.js` and `script.js`
- Test API endpoints using the examples above
- Check browser console and server logs for errors

---

**Happy Coding! 🚀**
