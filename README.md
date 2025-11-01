# Codeception 2025 - The Website Inside a Website

A futuristic, dark-themed website for a web development puzzle competition called **Codeception 2025**. This project features a complete event management system with team registration, live leaderboard, and puzzle access portal.

## 🎯 Features

- **Dark Neon Aesthetic**: Futuristic hacker-style design with glowing effects
- **Responsive Design**: Fully responsive layout for desktop and mobile devices
- **Team Registration**: Simple form to register teams with up to 3 members
- **Live Leaderboard**: Real-time leaderboard with top 3 podium display
- **Puzzle Access Portal**: Secure login for teams to access puzzles
- **MongoDB Backend**: Full-stack application with Express.js and MongoDB
- **Interactive UI**: Smooth animations and transitions throughout

## 🎨 Color Palette

- **Background**: `#0A0F1C`
- **Primary Accent (Cyan)**: `#00FFFF`
- **Secondary Accent (Purple)**: `#9D4EDD`
- **Text (Main)**: `#E0E0E0`
- **Text (Muted)**: `#9AA0A6`
- **Button/Interactive**: `#00D4FF`
- **Success**: `#00FF9C`
- **Error**: `#FF3B5C`

## 📁 Project Structure

```
codeception/
├── index.html           # Home page
├── about.html          # About the event
├── register.html       # Team registration
├── leaderboard.html    # Live leaderboard
├── puzzle.html         # Puzzle access portal
├── ./css/style.css           # All styles
├── script.js           # Frontend JavaScript
├── server.js           # Backend server
├── package.json        # Dependencies
├── .env.example        # Environment variables template
└── README.md           # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn**

### Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/RoopakCS/codeception.git
    cd codeception
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Set up environment variables**

    ```bash
    cp .env.example .env
    ```

    Edit `.env` and configure your MongoDB connection:

    ```
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/codeception
    ```

    For MongoDB Atlas:

    ```
    MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/codeception?retryWrites=true&w=majority
    ```

4. **Start MongoDB** (if using local MongoDB)

    ```bash
    mongod
    ```

5. **Start the server**

    ```bash
    npm start
    ```

    For development with auto-reload:

    ```bash
    npm run dev
    ```

6. **Access the website**
   Open your browser and navigate to:
    ```
    http://localhost:3000
    ```

## 📊 MongoDB Collections

The application uses two main collections:

### `teams` Collection

```javascript
{
  teamName: String,
  leaderEmail: String,
  members: [String],
  teamCode: String,
  registrationDate: Date,
  active: Boolean
}
```

### `scores` Collection

```javascript
{
  teamName: String,
  teamCode: String,
  score: Number,
  timeTaken: Number,
  status: String,
  lastUpdated: Date,
  puzzlesSolved: [{
    puzzleId: String,
    solvedAt: Date,
    points: Number
  }]
}
```

## 🔌 API Endpoints

### Public Endpoints

- `GET /api/health` - Health check
- `POST /api/register` - Register a new team
- `POST /api/verify-team` - Verify team credentials
- `GET /api/leaderboard` - Get leaderboard data

### Admin Endpoints (Add authentication in production)

- `PUT /api/score/:teamCode` - Update team score
- `GET /api/team/:teamCode` - Get team details
- `GET /api/teams` - Get all teams
- `DELETE /api/team/:teamCode` - Delete a team

## 🎮 Usage

### Registering a Team

1. Navigate to the **Register** page
2. Fill in the team information:
    - Team name
    - Team leader email
    - Member names (1-3 members)
3. Accept the terms and conditions
4. Submit the form
5. Save the generated team code

### Accessing Puzzles

1. Go to the **Puzzle Access** page
2. Enter your team name and team code
3. Once authenticated, you'll see the mission control interface
4. Wait for the event to begin

### Viewing the Leaderboard

1. Visit the **Leaderboard** page
2. View the top 3 teams on the podium
3. See all teams ranked by score and time
4. Click refresh to update in real-time

## 🛠️ Customization

### Changing Event Date

Edit the date in `script.js`:

```javascript
const eventDate = new Date('2025-03-15T10:00:00');
```

### Updating Styles

All styles are in `./css/style.css`. CSS variables are defined at the top:

```css
:root {
    --bg-primary: #0a0f1c;
    --accent-cyan: #00ffff;
    /* ... */
}
```

### Adding Admin Authentication

For production, add authentication middleware to protect admin endpoints in `server.js`.

## 🔒 Security Notes

⚠️ **Important**: This is a basic implementation. For production use:

1. Add proper authentication for admin endpoints
2. Implement rate limiting
3. Add input validation and sanitization
4. Use HTTPS
5. Secure MongoDB connection
6. Add CSRF protection
7. Implement proper session management

## 🌐 Deployment

### MongoDB Atlas Setup

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address
5. Get your connection string
6. Update `.env` with your connection string

### Deploy to Heroku

1. Install Heroku CLI
2. Login to Heroku: `heroku login`
3. Create a new app: `heroku create codeception-2025`
4. Set environment variables: `heroku config:set MONGODB_URI=your_connection_string`
5. Deploy: `git push heroku main`

### Deploy to Vercel/Netlify

For serverless deployment, consider separating frontend and backend or using serverless functions.

## 📝 License

This project is licensed under the MIT License.

## 👥 Contributors

- **Tech Society** - Initial development

## 🙏 Acknowledgments

- Orbitron and Poppins fonts from Google Fonts
- Design inspiration from cyberpunk and hacker aesthetics

## 📧 Contact

For questions or support, please contact the Tech Society.

---

**Made with 💻 and ☕ for Codeception 2025**
