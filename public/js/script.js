// ===== NAVIGATION MENU MOBILE TOGGLE =====
// Function to update navigation based on auth status
function updateNavigation() {
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;

    const authToken = localStorage.getItem('authToken');
    const participantName = localStorage.getItem('participantName');

    // Update CSS variable for nav visibility
    document.documentElement.style.setProperty(
        '--nav-visibility',
        authToken && participantName ? 'none' : 'block'
    );

    // Find the register and login links
    const registerLink = navMenu.querySelector(
        'a[href="register.html"]'
    )?.parentElement;
    const loginLink = navMenu.querySelector(
        'a[href="login.html"]'
    )?.parentElement;

    if (authToken && participantName) {
        // User is logged in
        if (loginLink) {
            // Create user initials for avatar
            const initials = participantName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .substring(0, 2)
                .toUpperCase();

            loginLink.innerHTML = `<a href="participant.html" class="user-avatar" title="View Profile">${initials}</a>`;
            loginLink.style.display = 'block'; // Always show user avatar
        }

        // Hide register CTAs
        document
            .querySelectorAll('a[href="register.html"]:not(.nav-menu *)')
            .forEach((link) => {
                link.parentElement.classList.add('auth-hide');
            });
    } else {
        // User is not logged in
        if (loginLink) loginLink.innerHTML = '<a href="login.html">Login</a>';

        // Show register CTAs
        document
            .querySelectorAll('a[href="register.html"]:not(.nav-menu *)')
            .forEach((link) => {
                link.parentElement.classList.remove('auth-hide');
            });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Add mobile menu functionality if needed
    console.log('Codeception 2025 - Website loaded successfully');

    // Update navigation based on auth status
    updateNavigation();

    // Stage 1 Console Clue
    if (
        window.location.pathname === '/' ||
        window.location.pathname === '/index.html' ||
        window.location.pathname.endsWith('/Codeception/')
    ) {
        setTimeout(() => {
            console.log(
                '%c🔍 Good start. Try visiting /decode-me',
                'color: #00FFFF; font-size: 16px; font-weight: bold;'
            );
        }, 2000);
    }

    // Initialize page-specific functionality
    const currentPage = window.location.pathname.split('/').pop();

    if (currentPage === 'register.html' || currentPage === '') {
        initRegistrationForm();
    } else if (currentPage === 'login.html') {
        initLoginPage();
    } else if (currentPage === 'leaderboard.html') {
        initLeaderboard();
    } else if (currentPage === 'puzzle.html') {
        initPuzzleAccess();
    } else if (currentPage === 'decode-me.html') {
        initDecodeStage();
    } else if (currentPage === 'the-dark-corner.html') {
        initDarkCornerStage();
    } else if (currentPage === 'color-riddle.html') {
        initColorRiddle();
    }
});

// ===== REGISTRATION FORM =====
function initRegistrationForm() {
    const form = document.getElementById('registrationForm');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Show loading spinner
        document.getElementById('loadingSpinner').style.display = 'block';
        document.getElementById('registrationForm').style.display = 'none';

        // Get form data (individual participant registration)
        const formData = {
            name: document.getElementById('name').value.trim(),
            registerNumber: document
                .getElementById('registerNumber')
                .value.trim()
                .toUpperCase(),
            email: document.getElementById('email').value.trim(),
            department: document.getElementById('department').value,
            year: document.getElementById('year').value,
            password: document.getElementById('password').value,
        };

        try {
            // Submit to backend
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            // Hide loading spinner
            document.getElementById('loadingSpinner').style.display = 'none';

            if (response.ok) {
                // Show success message
                document.getElementById('successMessage').style.display =
                    'block';
                document.getElementById(
                    'registeredParticipantCode'
                ).textContent = result.participantCode;
                document.getElementById('registeredName').textContent =
                    result.name;

                // Store participant info and auth token in localStorage (do NOT store password)
                localStorage.setItem('participantCode', result.participantCode);
                localStorage.setItem('participantEmail', formData.email);
                localStorage.setItem('participantName', result.name);
                localStorage.setItem('authToken', result.token);
                
                // Auto redirect to challenges after a short delay
                setTimeout(() => {
                    window.location.href = '/index.html';
                }, 3000);
            } else {
                // Show error message
                document.getElementById('errorMessage').style.display = 'block';
                document.getElementById('errorText').textContent =
                    result.message || 'Registration failed. Please try again.';

                // Show form again after 3 seconds
                setTimeout(() => {
                    document.getElementById('errorMessage').style.display =
                        'none';
                    document.getElementById('registrationForm').style.display =
                        'block';
                }, 3000);
            }
        } catch (error) {
            console.error('Registration error:', error);

            // Hide loading spinner
            document.getElementById('loadingSpinner').style.display = 'none';

            // Show error message
            document.getElementById('errorMessage').style.display = 'block';
            document.getElementById('errorText').textContent =
                'Network error. Please check your connection and try again.';

            // Show form again after 3 seconds
            setTimeout(() => {
                document.getElementById('errorMessage').style.display = 'none';
                document.getElementById('registrationForm').style.display =
                    'block';
            }, 3000);
        }
    });

    // Form reset handler
    form.addEventListener('reset', function () {
        // Clear any error messages
        const errorElements = document.querySelectorAll('.form-error');
        errorElements.forEach((el) => (el.style.display = 'none'));
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
    const leaderboardContainer = document.getElementById(
        'leaderboardContainer'
    );
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
            if (leaderboardContainer)
                leaderboardContainer.style.display = 'block';
            if (noDataMessage) noDataMessage.style.display = 'none';

            // Update podium
            updatePodium(data.scores);

            // Update table
            updateLeaderboardTable(data.scores);

            // Update last update time
            updateLastUpdateTime();
        } else {
            // Show no data message
            if (leaderboardContainer)
                leaderboardContainer.style.display = 'block';
            if (noDataMessage) noDataMessage.style.display = 'block';
            document.querySelector(
                '.leaderboard-table-container'
            ).style.display = 'none';
            document.querySelector('.podium').style.display = 'none';
        }
    } catch (error) {
        console.error('Leaderboard error:', error);

        // Hide loading
        if (loadingSpinner) loadingSpinner.style.display = 'none';

        // Show error message
        if (errorMessage) {
            errorMessage.style.display = 'block';
            document.getElementById('errorText').textContent =
                'Unable to load leaderboard. Please try again.';
        }
    }
}

function updatePodium(scores) {
    // Update top 3 positions
    const positions = [1, 2, 3];
    positions.forEach((pos, index) => {
        const podiumElement = document.getElementById(`podium-${pos}`);
        if (podiumElement && scores[index]) {
            const participant = scores[index];
            const name = participant.name || '---';
            podiumElement.querySelector('.podium-team').textContent = name;
            podiumElement.querySelector('.podium-score').textContent =
                `${participant.score} pts`;
        }
    });
}

const totalStages = 8; // Updated after removing performance puzzle stage

function updateLeaderboardTable(scores) {
    const tbody = document.getElementById('leaderboardBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    scores.forEach((participant, index) => {
        const rank = index + 1;
        const row = document.createElement('tr');

        // Add special class for top 3
        if (rank <= 3) {
            row.classList.add('top-3', `rank-${rank}`);
        }

        // Format time taken
        const timeTaken = formatTime(participant.timeTaken);

        // Determine status
        const status =
            participant.status ||
            (participant.timeTaken ? 'completed' : 'active');
        const displayName = escapeHtml(participant.name || '---');

        row.innerHTML = `
            <td>${rank}</td>
            <td>${displayName}</td>
            <td>${participant.score}</td>
            <td>${participant.completedStages ? participant.completedStages.length : 0}/${totalStages}</td>
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
        "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}

// ===== PUZZLE ACCESS =====
function initPuzzleAccess() {
    // Check if participant is authenticated
    const authToken = localStorage.getItem('authToken');
    const storedName = localStorage.getItem('participantName');

    if (authToken && storedName) {
        // Verify token is still valid
        verifyAuthToken(authToken).then((isValid) => {
            if (isValid) {
                showPuzzleSection(storedName);
            } else {
                handleLogout(); // Token expired or invalid
            }
        });
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

// Handle login form submission
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');
    const loadingSpinner = document.getElementById('loadingSpinner');

    try {
        if (loadingSpinner) loadingSpinner.style.display = 'block';

        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (response.ok) {
            // Store auth token and participant info (never store password)
            localStorage.setItem('authToken', result.token);
            localStorage.setItem(
                'participantCode',
                result.participant.participantCode
            );
            localStorage.setItem('participantEmail', result.participant.email);
            localStorage.setItem('participantName', result.participant.name);

            // Update navigation and redirect to home
            updateNavigation();
            window.location.href = '/index.html';
        } else {
            if (errorDiv) {
                errorDiv.textContent =
                    result.message || 'Login failed. Please try again.';
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
    } finally {
        if (loadingSpinner) loadingSpinner.style.display = 'none';
    }
}

async function handlePuzzleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const participantCode = document
        .getElementById('loginParticipantCode')
        .value.trim()
        .toUpperCase();
    const errorDiv = document.getElementById('loginError');

    try {
        // Verify credentials with backend
        const response = await fetch('/api/verify-team', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, participantCode }),
        });

        const result = await response.json();

        if (response.ok && result.valid) {
            // Store participant info (never store password)
            localStorage.setItem('participantCode', participantCode);
            localStorage.setItem('participantEmail', email);
            localStorage.setItem('participantName', result.name);

            // Show puzzle section
            showPuzzleSection(result.name);
        } else {
            // Show error
            if (errorDiv) {
                errorDiv.textContent =
                    result.message ||
                    'Invalid email or participant code. Please try again.';
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

function showPuzzleSection(participantName) {
    const loginSection = document.getElementById('loginSection');
    const puzzleSection = document.getElementById('puzzleSection');
    const loggedParticipantName = document.getElementById(
        'loggedParticipantName'
    );

    if (loginSection) loginSection.style.display = 'none';
    if (puzzleSection) puzzleSection.style.display = 'block';
    if (loggedParticipantName)
        loggedParticipantName.textContent = participantName;
}

function handleLogout() {
    // Clear stored credentials
    localStorage.removeItem('authToken');
    localStorage.removeItem('participantCode');
    localStorage.removeItem('participantEmail');
    localStorage.removeItem('participantName');

    // Update navigation and redirect to home
    updateNavigation();
    window.location.href = '/index.html';
}

function startCountdown() {
    // Set event date (March 15, 2025, 10:00 AM)
    const eventDate = new Date('2025-03-15T10:00:00');

    function updateTimer() {
        const now = new Date();
        const diff = eventDate - now;

        if (diff <= 0) {
            // Event has started
            document.querySelector('.timer-display').innerHTML =
                '<p style="color: var(--success); font-size: 1.5rem;">EVENT IS LIVE!</p>';
            return;
        }

        // Calculate time remaining
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
            (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
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
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    });
});

// ===== ADD LOADING ANIMATION TO BUTTONS =====
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('btn') || e.target.closest('.btn')) {
        const btn = e.target.classList.contains('btn')
            ? e.target
            : e.target.closest('.btn');
        btn.style.transform = 'scale(0.98)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 100);
    }
});

// ===== LOGIN PAGE =====
function initLoginPage() {
    const form = document.getElementById('loginForm');
    if (form) {
        form.addEventListener('submit', handleLogin);
    }

    // Check if already logged in
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
        // Verify token
        verifyAuthToken(authToken).then((isValid) => {
            if (isValid) {
                window.location.href = '/index.html'; // Redirect to puzzle if already logged in
            }
        });
    }
}

// ===== AUTH HELPERS =====
async function verifyAuthToken(token) {
    try {
        // Make an authenticated request to award-points endpoint
        // This will return 403 if token is invalid
        const response = await fetch('/api/challenges/award-points', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}), // Empty body - will fail but that's ok
        });
        return response.status !== 403; // Token is valid if not forbidden
    } catch (error) {
        console.error('Token verification error:', error);
        return false;
    }
}

// Helper function for making authenticated API requests
async function makeAuthenticatedRequest(url, options = {}) {
    const token = localStorage.getItem('authToken');
    if (!token) {
        throw new Error('No auth token available');
    }

    const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...(options.headers || {}),
    };

    const response = await fetch(url, {
        ...options,
        headers,
    });

    // If token is invalid, logout
    if (response.status === 403) {
        handleLogout();
        throw new Error('Authentication failed');
    }

    return response;
}

// ===== SCORE NOTIFICATION =====
function showScoreNotification(points, totalScore) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'score-notification';
    notification.innerHTML = `
        <div class="score-popup">
            <div class="score-icon">🎯</div>
            <div class="score-text">
                <p>+${points} points!</p>
                <p class="total-score">Total: ${totalScore}</p>
            </div>
        </div>
    `;

    // Add styles if not already present
    if (!document.getElementById('score-notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'score-notification-styles';
        styles.textContent = `
            .score-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
                animation: slideIn 0.5s ease-out;
            }
            .score-popup {
                background: linear-gradient(45deg, #2C3E50, #3498db);
                color: white;
                padding: 15px;
                border-radius: 8px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .score-icon {
                font-size: 24px;
            }
            .score-text {
                margin: 0;
            }
            .score-text p {
                margin: 0;
                font-size: 16px;
            }
            .total-score {
                font-size: 14px !important;
                opacity: 0.9;
            }
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    // Add to document
    document.body.appendChild(notification);

    // Remove after animation
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease-in forwards';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

// ===== DECODE STAGE =====
function initDecodeStage() {
    // Check if already completed
    const completedStages = JSON.parse(localStorage.getItem('completedStages') || '[]');
    if (completedStages.includes('stage2_decode')) {
        const result = document.getElementById('decodeResult');
        if (result) {
            result.innerHTML = '<div class="success-msg">✓ Stage already completed!</div>';
            result.className = 'result-message success';
        }
    }

    // Add enter key support for decode input
    const decodeInput = document.getElementById('decodeInput');
    if (decodeInput) {
        decodeInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                checkDecode();
            }
        });
    }
}

// ===== DARK CORNER STAGE =====
function initDarkCornerStage() {
    const authToken = localStorage.getItem('authToken');
    const participantCode = localStorage.getItem('participantCode');
    const participantEmail = localStorage.getItem('participantEmail');

    // Check auth first
    if (!authToken || !participantCode || !participantEmail) {
        window.location.href = '/login.html';
        return;
    }

    // Check if already completed
    const completedStages = JSON.parse(localStorage.getItem('completedStages') || '[]');
    if (completedStages.includes('stage3_dark_corner')) {
        console.log(
            '%c🌑 You have already conquered the darkness...',
            'color: #9D4EDD; font-size: 14px;'
        );
    }
}

// ===== COLOR RIDDLE STAGE =====
function initColorRiddle() {
    const authToken = localStorage.getItem('authToken');
    const participantCode = localStorage.getItem('participantCode');
    const participantEmail = localStorage.getItem('participantEmail');

    // Check auth first
    if (!authToken || !participantCode || !participantEmail) {
        window.location.href = '/login.html';
        return;
    }

    // Check if already completed
    const completedStages = JSON.parse(localStorage.getItem('completedStages') || '[]');
    if (completedStages.includes('stage4_color_riddle')) {
        const result = document.getElementById('finalResult');
        if (result) {
            result.innerHTML = '<div class="success-msg">✓ Stage already completed!</div>';
            result.className = 'result-message success';
        }
    }

    // Add enter key support
    const answerInput = document.getElementById('finalAnswer');
    if (answerInput) {
        answerInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                checkFinalAnswer();
            }
        });
    }
}

// ===== CUSTOM ENCODING UTILITIES =====
function rotateChar(char, shift) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const isUpperCase = char === char.toUpperCase();
    char = char.toLowerCase();
    
    if (alphabet.includes(char)) {
        let index = alphabet.indexOf(char);
        index = (index + shift) % 26;
        if (index < 0) index += 26;
        char = alphabet[index];
        return isUpperCase ? char.toUpperCase() : char;
    }
    return char;
}

function xorString(str, key) {
    let result = '';
    for(let i = 0; i < str.length; i++) {
        result += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
}

function customEncode(text) {
    // First convert to base64
    const base64 = btoa(text);
    // Then encode to ROT13
    return base64.split('').map(char => rotateChar(char, 13)).join('');
}

function customDecode(text) {
    try {
        // First decode ROT13
        const rot13decoded = text.split('').map(char => rotateChar(char, -13)).join('');
        // Then decode base64
        return atob(rot13decoded);
    } catch (e) {
        return '';
    }
}

// ===== FORM VALIDATION ENHANCEMENTS =====
document.querySelectorAll('input[required]').forEach((input) => {
    input.addEventListener('invalid', function (e) {
        e.preventDefault();
        this.classList.add('error');
    });

    input.addEventListener('input', function () {
        this.classList.remove('error');
    });
});
