// ===== NAVIGATION MENU MOBILE TOGGLE =====
document.addEventListener('DOMContentLoaded', function() {
    // Add mobile menu functionality if needed
    console.log('Codeception 2025 - Website loaded successfully');
    
    // Initialize page-specific functionality
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'register.html' || currentPage === '') {
        initRegistrationForm();
    } else if (currentPage === 'leaderboard.html') {
        initLeaderboard();
    } else if (currentPage === 'puzzle.html') {
        initPuzzleAccess();
    }
});

// ===== REGISTRATION FORM =====
function initRegistrationForm() {
    const form = document.getElementById('registrationForm');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading spinner
        document.getElementById('loadingSpinner').style.display = 'block';
        document.getElementById('registrationForm').style.display = 'none';
        
        // Get form data
        const formData = {
            teamName: document.getElementById('teamName').value.trim(),
            leaderEmail: document.getElementById('leaderEmail').value.trim(),
            members: [
                document.getElementById('member1').value.trim(),
                document.getElementById('member2').value.trim(),
                document.getElementById('member3').value.trim()
            ].filter(member => member !== ''),
            registrationDate: new Date().toISOString()
        };
        
        try {
            // Submit to backend
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            // Hide loading spinner
            document.getElementById('loadingSpinner').style.display = 'none';
            
            if (response.ok) {
                // Show success message
                document.getElementById('successMessage').style.display = 'block';
                document.getElementById('teamCode').textContent = result.teamCode;
                
                // Store team code in localStorage
                localStorage.setItem('teamCode', result.teamCode);
                localStorage.setItem('teamName', formData.teamName);
            } else {
                // Show error message
                document.getElementById('errorMessage').style.display = 'block';
                document.getElementById('errorText').textContent = result.message || 'Registration failed. Please try again.';
                
                // Show form again after 3 seconds
                setTimeout(() => {
                    document.getElementById('errorMessage').style.display = 'none';
                    document.getElementById('registrationForm').style.display = 'block';
                }, 3000);
            }
        } catch (error) {
            console.error('Registration error:', error);
            
            // Hide loading spinner
            document.getElementById('loadingSpinner').style.display = 'none';
            
            // Show error message
            document.getElementById('errorMessage').style.display = 'block';
            document.getElementById('errorText').textContent = 'Network error. Please check your connection and try again.';
            
            // Show form again after 3 seconds
            setTimeout(() => {
                document.getElementById('errorMessage').style.display = 'none';
                document.getElementById('registrationForm').style.display = 'block';
            }, 3000);
        }
    });
    
    // Form reset handler
    form.addEventListener('reset', function() {
        // Clear any error messages
        const errorElements = document.querySelectorAll('.form-error');
        errorElements.forEach(el => el.style.display = 'none');
    });
}

// ===== LEADERBOARD =====
function initLeaderboard() {
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadLeaderboard);
    }
    
    // Load leaderboard on page load
    loadLeaderboard();
    
    // Auto-refresh every 30 seconds
    setInterval(loadLeaderboard, 30000);
}

async function loadLeaderboard() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const errorMessage = document.getElementById('errorMessage');
    const leaderboardContainer = document.getElementById('leaderboardContainer');
    const noDataMessage = document.getElementById('noDataMessage');
    
    try {
        // Show loading
        if (loadingSpinner) loadingSpinner.style.display = 'block';
        if (errorMessage) errorMessage.style.display = 'none';
        if (leaderboardContainer) leaderboardContainer.style.display = 'none';
        
        // Fetch leaderboard data
        const response = await fetch('/api/leaderboard');
        
        if (!response.ok) {
            throw new Error('Failed to fetch leaderboard');
        }
        
        const data = await response.json();
        
        // Hide loading
        if (loadingSpinner) loadingSpinner.style.display = 'none';
        
        if (data.scores && data.scores.length > 0) {
            // Show leaderboard
            if (leaderboardContainer) leaderboardContainer.style.display = 'block';
            if (noDataMessage) noDataMessage.style.display = 'none';
            
            // Update podium
            updatePodium(data.scores);
            
            // Update table
            updateLeaderboardTable(data.scores);
            
            // Update last update time
            updateLastUpdateTime();
        } else {
            // Show no data message
            if (leaderboardContainer) leaderboardContainer.style.display = 'block';
            if (noDataMessage) noDataMessage.style.display = 'block';
            document.querySelector('.leaderboard-table-container').style.display = 'none';
            document.querySelector('.podium').style.display = 'none';
        }
    } catch (error) {
        console.error('Leaderboard error:', error);
        
        // Hide loading
        if (loadingSpinner) loadingSpinner.style.display = 'none';
        
        // Show error message
        if (errorMessage) {
            errorMessage.style.display = 'block';
            document.getElementById('errorText').textContent = 'Unable to load leaderboard. Please try again.';
        }
    }
}

function updatePodium(scores) {
    // Update top 3 positions
    const positions = [1, 2, 3];
    positions.forEach((pos, index) => {
        const podiumElement = document.getElementById(`podium-${pos}`);
        if (podiumElement && scores[index]) {
            const team = scores[index];
            podiumElement.querySelector('.podium-team').textContent = team.teamName;
            podiumElement.querySelector('.podium-score').textContent = `${team.score} pts`;
        }
    });
}

function updateLeaderboardTable(scores) {
    const tbody = document.getElementById('leaderboardBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    scores.forEach((team, index) => {
        const rank = index + 1;
        const row = document.createElement('tr');
        
        // Add special class for top 3
        if (rank <= 3) {
            row.classList.add('top-3', `rank-${rank}`);
        }
        
        // Format time taken
        const timeTaken = formatTime(team.timeTaken);
        
        // Determine status
        const status = team.status || (team.timeTaken ? 'completed' : 'active');
        
        row.innerHTML = `
            <td>${rank}</td>
            <td>${escapeHtml(team.teamName)}</td>
            <td>${team.score}</td>
            <td>${timeTaken}</td>
            <td><span class="status-badge ${status}">${status}</span></td>
        `;
        
        tbody.appendChild(row);
    });
}

function formatTime(minutes) {
    if (!minutes) return '--:--';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
        return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
}

function updateLastUpdateTime() {
    const lastUpdate = document.getElementById('lastUpdate');
    if (lastUpdate) {
        const now = new Date();
        lastUpdate.textContent = now.toLocaleTimeString();
    }
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ===== PUZZLE ACCESS =====
function initPuzzleAccess() {
    // Check if user is already logged in
    const storedTeamCode = localStorage.getItem('teamCode');
    const storedTeamName = localStorage.getItem('teamName');
    
    if (storedTeamCode && storedTeamName) {
        showPuzzleSection(storedTeamName);
    }
    
    // Handle login form
    const loginForm = document.getElementById('puzzleLoginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handlePuzzleLogin);
    }
    
    // Handle logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Start countdown timer
    startCountdown();
}

async function handlePuzzleLogin(e) {
    e.preventDefault();
    
    const teamName = document.getElementById('loginTeamName').value.trim();
    const teamCode = document.getElementById('loginTeamCode').value.trim();
    const errorDiv = document.getElementById('loginError');
    
    try {
        // Verify credentials with backend
        const response = await fetch('/api/verify-team', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ teamName, teamCode })
        });
        
        const result = await response.json();
        
        if (response.ok && result.valid) {
            // Store credentials
            localStorage.setItem('teamCode', teamCode);
            localStorage.setItem('teamName', teamName);
            
            // Show puzzle section
            showPuzzleSection(teamName);
        } else {
            // Show error
            if (errorDiv) {
                errorDiv.textContent = result.message || 'Invalid team name or code. Please try again.';
                errorDiv.style.display = 'block';
                
                setTimeout(() => {
                    errorDiv.style.display = 'none';
                }, 3000);
            }
        }
    } catch (error) {
        console.error('Login error:', error);
        if (errorDiv) {
            errorDiv.textContent = 'Network error. Please try again.';
            errorDiv.style.display = 'block';
            
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 3000);
        }
    }
}

function showPuzzleSection(teamName) {
    const loginSection = document.getElementById('loginSection');
    const puzzleSection = document.getElementById('puzzleSection');
    const loggedTeamName = document.getElementById('loggedTeamName');
    
    if (loginSection) loginSection.style.display = 'none';
    if (puzzleSection) puzzleSection.style.display = 'block';
    if (loggedTeamName) loggedTeamName.textContent = teamName;
}

function handleLogout() {
    // Clear stored credentials
    localStorage.removeItem('teamCode');
    localStorage.removeItem('teamName');
    
    // Reload page
    window.location.reload();
}

function startCountdown() {
    // Set event date (March 15, 2025, 10:00 AM)
    const eventDate = new Date('2025-03-15T10:00:00');
    
    function updateTimer() {
        const now = new Date();
        const diff = eventDate - now;
        
        if (diff <= 0) {
            // Event has started
            document.querySelector('.timer-display').innerHTML = '<p style="color: var(--success); font-size: 1.5rem;">EVENT IS LIVE!</p>';
            return;
        }
        
        // Calculate time remaining
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        // Update display
        const timerValues = document.querySelectorAll('.timer-value');
        if (timerValues.length >= 4) {
            timerValues[0].textContent = String(days).padStart(2, '0');
            timerValues[1].textContent = String(hours).padStart(2, '0');
            timerValues[2].textContent = String(minutes).padStart(2, '0');
            timerValues[3].textContent = String(seconds).padStart(2, '0');
        }
    }
    
    // Update immediately and then every second
    updateTimer();
    setInterval(updateTimer, 1000);
}

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== ADD LOADING ANIMATION TO BUTTONS =====
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn') || e.target.closest('.btn')) {
        const btn = e.target.classList.contains('btn') ? e.target : e.target.closest('.btn');
        btn.style.transform = 'scale(0.98)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 100);
    }
});

// ===== FORM VALIDATION ENHANCEMENTS =====
document.querySelectorAll('input[required]').forEach(input => {
    input.addEventListener('invalid', function(e) {
        e.preventDefault();
        this.classList.add('error');
    });
    
    input.addEventListener('input', function() {
        this.classList.remove('error');
    });
});
