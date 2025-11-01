// Source Challenge - Stage 10
// Set a breakpoint on line 15 to see the secret!

(function () {
    console.log(
        '%c🔍 sourceChallenge.js loaded',
        'color: #00FFFF; font-size: 14px;'
    );
    console.log('Set a breakpoint and call window.startDebugChallenge()');

    // Hidden data
    const encryptedData = {
        level: 10,
        name: 'Sources Master',
        difficulty: 'expert',
        _hidden: btoa('final_stage_complete'),
    };

    // THIS IS THE LINE TO BREAKPOINT - Line 15
    const secretCode = 'CODECEPTION_MASTER_2025';

    // Award points for loading this file
    setTimeout(() => {
        const participantCode = localStorage.getItem('participantCode');
        const participantEmail = localStorage.getItem('participantEmail');

        if (participantCode && participantEmail) {
            fetch('/api/award-points', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    participantCode,
                    email: participantEmail,
                    points: 10,
                    stage: 'stage10_source_file',
                }),
            }).then(() => {
                console.log(
                    '%c+10 points for finding sourceChallenge.js!',
                    'color: #00FF9C; font-size: 14px;'
                );
            });
        }
    }, 1000);

    // Debug challenge function
    window.startDebugChallenge = function () {
        debugger; // This will pause execution

        console.log('Debug challenge started!');
        console.log('Check the variables in the Scope panel →');

        const result = processSecret(secretCode);

        return result;
    };

    function processSecret(code) {
        const processed = {
            original: code,
            length: code.length,
            reversed: code.split('').reverse().join(''),
            hash: btoa(code),
        };

        console.table(processed);

        document.getElementById('debugHint').innerHTML =
            `<div class="success-msg">✓ Debugger paused! Check the Scope panel and expand 'secretCode'</div>`;

        return processed;
    }

    // Extra challenge - global variables
    window.challengeMetadata = {
        totalStages: 10,
        pointsPerStage: 10,
        bonusPoints: 50,
        maxScore: 150,
        secretCode: secretCode,
    };
})();
