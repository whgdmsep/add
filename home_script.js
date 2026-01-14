document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Pet Card Logic (Wiggle & Grow) ---
    const petCard = document.getElementById('card-pet');
    const petIcon = petCard.querySelector('.fa-dragon');
    const petBar = document.querySelector('.pet-bar');
    let petExp = 40;

    petCard.addEventListener('click', () => {
        // Wiggle Animation
        petIcon.style.animation = 'none';
        petIcon.offsetHeight; // trigger reflow
        petIcon.style.animation = 'wiggle 0.5s ease';

        // Gain EXP fake logic
        if (petExp < 100) {
            petExp += 10;
            petBar.style.width = `${petExp}%`;
        } else {
            petBar.style.background = '#FFD700'; // Gold
            showToast('레벨업! 공룡이 성장했습니다!');
            petExp = 0;
            setTimeout(() => {
                petBar.style.width = '10%';
                petBar.style.background = 'var(--primary-orange)';
            }, 1000);
        }
    });

    // Define wiggle keyframes via JS or rely on CSS class if added. 
    // Let's inject style for wiggle
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes wiggle { 0% { transform: rotate(0deg); } 25% { transform: rotate(-10deg); } 75% { transform: rotate(10deg); } 100% { transform: rotate(0deg); } }
    `;
    document.head.appendChild(styleSheet);


    // --- 2. Timer Logic (Simple Pomodoro) ---
    let timerInterval;
    let timeLeft = 25 * 60; // 25 min
    const timerDisplay = document.querySelector('.timer-display');
    const btnStart = document.getElementById('btn-timer-start');
    const btnReset = document.getElementById('btn-timer-reset');
    let isRunning = false;

    function updateDisplay() {
        const m = Math.floor(timeLeft / 60);
        const s = timeLeft % 60;
        timerDisplay.textContent = `${m}:${s < 10 ? '0' + s : s}`;
    }

    btnStart.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent card click
        if (isRunning) {
            clearInterval(timerInterval);
            isRunning = false;
            btnStart.textContent = 'Start';
        } else {
            isRunning = true;
            btnStart.textContent = 'Pause';
            timerInterval = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    updateDisplay();
                } else {
                    clearInterval(timerInterval);
                    showToast('집중 시간이 끝났습니다! 휴식하세요.');
                    btnStart.textContent = 'Start';
                    isRunning = false;
                }
            }, 1000);
        }
    });

    btnReset.addEventListener('click', (e) => {
        e.stopPropagation();
        clearInterval(timerInterval);
        isRunning = false;
        btnStart.textContent = 'Start';
        timeLeft = 25 * 60;
        updateDisplay();
    });


    // --- 3. Tree Story (Drag Mockup) ---
    // Just a click effect for now
    const treeCard = document.getElementById('card-tree');
    treeCard.addEventListener('click', () => {
        showToast('나무 심기 퍼즐로 이동합니다 (준비중)');
    });


    // --- 4. Life Book (Random Recommendation) ---
    const bookCard = document.getElementById('card-book');
    const bookTitles = ["어린 왕자", "모모", "아몬드", "해리포터"];
    bookCard.addEventListener('click', () => {
        const randomTitle = bookTitles[Math.floor(Math.random() * bookTitles.length)];
        showToast(`추천 도서: [${randomTitle}] 어때요?`);
    });

    // --- Toast Helper ---
    function showToast(msg) {
        // Remove existing
        const existing = document.querySelector('.mini-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'mini-toast';
        toast.textContent = msg;
        toast.style.cssText = `
            position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
            background: #333; color: white; padding: 10px 20px; border-radius: 20px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2); z-index: 1000; animation: popUp 0.3s;
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 2000);
    }

    // Keyframe for Toast
    const styleSheet2 = document.createElement("style");
    styleSheet2.innerText = `
        @keyframes popUp { from { transform: translateX(-50%) translateY(20px); opacity: 0; } to { transform: translateX(-50%) translateY(0); opacity: 1; } }
    `;
    document.head.appendChild(styleSheet2);

});
