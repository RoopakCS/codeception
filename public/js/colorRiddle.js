// Final Stage JavaScript Clue
// Codeception 2025

(function () {
    'use strict';

    setTimeout(() => {
        console.log(
            '%c╔════════════════════════════════════════╗',
            'color: #00FFFF; font-weight: bold;'
        );
        console.log(
            '%c║   🔐 FINAL RIDDLE - READ CAREFULLY   ║',
            'color: #00FFFF; font-weight: bold;'
        );
        console.log(
            '%c╚════════════════════════════════════════╝',
            'color: #00FFFF; font-weight: bold;'
        );
        console.log('');
        console.log(
            "%cYou've made it this far.",
            'color: #00FF9C; font-size: 14px;'
        );
        console.log(
            "%cWhat's the color of success?",
            'color: #00FF9C; font-size: 14px; font-weight: bold;'
        );
        console.log('');
        console.log(
            '%c💡 Hint: Color code of something in this website',
            'color: #9D4EDD; font-size: 12px;'
        );
        console.log('');

        // Award points for finding the script
        const participantCode = localStorage.getItem('participantCode');
        if (participantCode) {
            awardScriptPoints();
        }
    }, 1500);

    async function awardScriptPoints() {
        const participantCode = localStorage.getItem('participantCode');
        const participantEmail = localStorage.getItem('participantEmail');

        if (!participantCode || !participantEmail) return;

        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                console.log('Session expired. Please log in again.');
                window.location.href = '/login.html';
                return;
            }

            await fetch('/api/challenges/award-points', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    participantCode,
                    email: participantEmail,
                    points: 10,
                    stage: 'stage4_found_script',
                }),
            });
        } catch (error) {
            console.error('Error awarding points:', error);
        }
    }
})();
