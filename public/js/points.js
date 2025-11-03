// Points and stages management
async function awardPoints(points, stage) {
    const participantCode = localStorage.getItem('participantCode');
    const participantEmail = localStorage.getItem('participantEmail');

    if (!participantCode || !participantEmail) return;

    try {
        const response = await fetch('/api/challenges/award-points', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                participantCode,
                email: participantEmail,
                points,
                stage,
            }),
        });

        const result = await response.json();

        if (result.success && !result.alreadyCompleted) {
            // Show score notification
            showScoreNotification(points, result.totalScore);

            // Update stages tracking
            const completedStages = JSON.parse(
                localStorage.getItem('completedStages') || '[]'
            );
            if (!completedStages.includes(stage)) {
                completedStages.push(stage);
                localStorage.setItem(
                    'completedStages',
                    JSON.stringify(completedStages)
                );
            }
        }

        return result;
    } catch (error) {
        console.error('Error awarding points:', error);
        return { success: false, error: 'Failed to award points' };
    }
}

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
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
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
