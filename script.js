/* 
   ETHIC LIBRARY GARDEN SCRIPT
   - Tab Navigation
   - Dynamic Content Generation
   - Interactive Features (Chat, Relay, Notes)
*/

const app = {
    state: {
        currentPage: 'page-home', // Default: Home Intro
        relayStory: [
            "어느 날, 도서관의 책 속 주인공들이 모두 현실로 튀어나왔다..."
        ],
        notes: [
            { text: "정직은 가장 확실한 자본이다.", source: "에머슨, 자기신뢰" },
            { text: "남에게 대접받고자 하는 대로 남을 대접하라.", source: "황금률" }
        ],
        chatHistory: [
            { user: 'bot', text: '어서오세요! 오늘의 밸런스 게임 투표하셨나요? 🗳️' }
        ]
    },

    init() {
        this.cacheDOM();
        this.bindEvents();
        this.render();
    },

    cacheDOM() {
        this.navButtons = document.querySelectorAll('nav button');
        this.pages = document.querySelectorAll('.page');
        // this.introSection removed
        this.appContainer = document.querySelector('.app-container');
        this.logoBtn = document.getElementById('logo-btn');

        // Gallery
        this.galleryContainer = document.querySelector('.gallery-container');
        this.scrollLeftBtn = document.getElementById('scroll-left');
        this.scrollRightBtn = document.getElementById('scroll-right');

        // Notes
        this.noteInput = document.getElementById('note-input');
        this.noteSourceInput = document.getElementById('note-source-input'); // New ID
        this.noteAddBtn = document.getElementById('note-add-btn');
        this.notesGrid = document.getElementById('notes-grid');

        // Opinion & Vote
        this.voteBtns = document.querySelectorAll('.vote-btn');
        this.voteBar = document.getElementById('vote-bar');

        this.opinionInput = document.getElementById('opinion-input');
        this.opinionSubmitBtn = document.getElementById('opinion-submit-btn');
        this.opinionFeed = document.getElementById('opinion-feed');

        // Relay Story
        this.relayInput = document.getElementById('relay-input');
        this.relayAddBtn = document.getElementById('relay-add-btn');
        this.storyBoard = document.getElementById('story-board');
    },

    bindEvents() {
        // Navigation
        this.navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetId = e.target.getAttribute('data-target');
                this.changePage(targetId);
            });
        });

        // Logo click -> Home
        if (this.logoBtn) {
            this.logoBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.changePage('page-home');
            });
        }

        // Gallery Scroll
        if (this.scrollLeftBtn && this.galleryContainer) {
            this.scrollLeftBtn.addEventListener('click', () => {
                this.galleryContainer.scrollBy({ left: -300, behavior: 'smooth' });
            });
        }
        if (this.scrollRightBtn && this.galleryContainer) {
            this.scrollRightBtn.addEventListener('click', () => {
                this.galleryContainer.scrollBy({ left: 300, behavior: 'smooth' });
            });
        }

        // Notes
        if (this.noteAddBtn) {
            this.noteAddBtn.addEventListener('click', () => this.addNote());
        }

        // Vote
        this.voteBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleVote(e.target));
        });

        // Opinion Submit
        if (this.opinionSubmitBtn) {
            this.opinionSubmitBtn.addEventListener('click', () => this.addOpinion());
        }
        if (this.opinionInput) {
            // Optional: submit on Ctrl+Enter? Let's just keep button for textarea
        }

        // Relay Story
        if (this.relayAddBtn) {
            this.relayAddBtn.addEventListener('click', () => this.addRelayLine());
        }
        if (this.relayInput) {
            this.relayInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.addRelayLine();
            });
        }
    },

    changePage(targetId) {
        // Update Nav
        this.navButtons.forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.querySelector(`button[data-target="${targetId}"]`);
        if (activeBtn) activeBtn.classList.add('active');

        // Update Page
        this.pages.forEach(page => page.classList.remove('active'));
        const targetPage = document.getElementById(targetId);
        if (targetPage) targetPage.classList.add('active');

        this.state.currentPage = targetId;
    },

    render() {
        this.changePage(this.state.currentPage);
        this.renderBooks();
        this.renderNotes();
        this.renderRelay();
        // this.renderChat(); -> No longer needed to init render, opinions are static + dynamic
    },

    /* --- Feature: Recommended Books --- */
    renderBooks() {
        // 도서 데이터 (카테고리 및 설명 추가)
        const books = [
            { title: "앵무새 죽이기", author: "하퍼 리", category: "정의/차별", desc: "편견에 맞서 양심을 지키는 변호사 아티커스의 용기 있는 이야기", color: "#C5CAE9" },
            { title: "기억 전달자", author: "로이스 라우리", category: "자유/선택", desc: "완벽해 보이는 통제 사회, 그 속에 숨겨진 진실과 자유의 무게", color: "#B2DFDB" },
            { title: "아몬드", author: "손원평", category: "공감/성장", desc: "감정을 느끼지 못하는 소년이 타인과 관계를 맺으며 성장하는 과정", color: "#F8BBD0" },
            { title: "죽은 시인의 사회", author: "N.H. 클라인바움", category: "교육/자아", desc: "'카르페 디엠', 진정한 배움과 나다움을 찾아가는 학생들의 이야기", color: "#D7CCC8" },
            { title: "원더", author: "R.J. 팔라시오", category: "편견/친절", desc: "헬멧 속에 숨었던 아이 어기, 세상 밖으로 나와 기적을 만들다", color: "#BBDEFB" },

            { title: "침묵의 봄", author: "레이첼 카슨", category: "환경/생태", desc: "무분별한 살충제 사용이 가져올 재앙을 경고한 환경학의 고전", color: "#A5D6A7" },
            { title: "고릴라는 핸드폰을 미워해", author: "박경화", category: "환경/소비", desc: "우리가 쓰는 물건 속에 숨겨진 환경 파괴의 진실과 실천 방법", color: "#E6EE9C" },

            { title: "1984", author: "조지 오웰", category: "정보/인권", desc: "거대 감시 사회 빅브라더를 통해 본 정보 인권과 개인의 자유", color: "#CFD8DC" },
            { title: "프랑켄슈타인", author: "메리 셸리", category: "과학/책임", desc: "과학 기술의 발전과 그에 따른 인간의 윤리적 책임에 대한 질문", color: "#B0BEC5" },
            { title: "로봇 시대, 인간의 일", author: "구본권", category: "AI/미래", desc: "인공지능 시대, 대체되지 않는 인간만의 가치는 무엇일까?", color: "#90CAF9" },

            { title: "꾸뻬 씨의 행복 여행", author: "프랑수아 를로르", category: "행복/가치", desc: "진정한 행복이란 무엇일까? 전 세계를 여행하며 얻은 배움들", color: "#FFCC80" },

            { title: "우아한 거짓말", author: "김려령", category: "학교폭력/가족", desc: "무심코 던진 말이 남긴 상처, 그리고 남겨진 사람들의 용서와 화해", color: "#EF9A9A" },
            { title: "시간을 파는 상점", author: "김선영", category: "시간/철학", desc: "시간의 의미를 찾아가는 미스터리한 상점의 이야기", color: "#CE93D8" },
            { title: "오베라는 남자", author: "프레드릭 배크만", category: "이웃/연대", desc: "까칠한 원칙주의자 오베가 성가신 이웃들과 얽히며 발견하는 삶의 온기", color: "#FFAB91" }
        ];

        if (!this.galleryContainer) return;
        this.galleryContainer.innerHTML = books.map(book => `
            <div class="book-card">
                <div class="book-img" style="background-color: ${book.color}; font-size:2.5rem;">📖</div>
                <div class="book-info">
                    <span>${book.category}</span>
                    <h3>${book.title}</h3>
                    <p class="author">${book.author}</p>
                    <p class="desc">${book.desc}</p>
                </div>
            </div>
        `).join('');
    },

    /* --- Feature: Notes (Forest of Sentences) --- */
    addNote() {
        const text = this.noteInput.value.trim();
        const source = this.noteSourceInput.value.trim(); // Get Source

        if (!text) {
            alert('문장을 입력해주세요!');
            return;
        }

        const newNote = {
            text: text,
            source: source || "미상" // Default if empty
        };

        this.state.notes.unshift(newNote); // Add to front
        this.renderNotes();
        this.noteInput.value = '';
        this.noteSourceInput.value = '';
    },
    renderNotes() {
        if (!this.notesGrid) return;
        this.notesGrid.innerHTML = this.state.notes.map(note => `
            <div class="note-item">
                <p class="note-text">"${note.text}"</p>
                <p class="note-source">- ${note.source}</p>
            </div>
        `).join('');
    },

    /* --- Feature: Debate Vote & Opinion --- */
    handleVote(target) {
        if (!this.voteBar) return;
        // Simulate Vote
        const isA = target.id === 'vote-a';

        // Show Bar
        this.voteBar.style.display = 'block';

        // Randomize slightly for realism or set fixed
        const percentageA = isA ? 60 : 40;

        // Animate
        setTimeout(() => {
            const barFill = document.getElementById('bar-fill-a');
            const text = document.getElementById('vote-count-text');
            if (barFill) barFill.style.width = percentageA + '%';
            if (text) text.innerText = `${percentageA}% : ${100 - percentageA}%`;
        }, 100);

        // Disable buttons
        this.voteBtns.forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.style.cursor = 'default';
        });
    },

    addOpinion() {
        const text = this.opinionInput.value.trim();
        if (!text) return;

        const opinionHTML = `
            <div class="opinion-card">
                <p class="opinion-text">${text}</p>
                <div class="opinion-footer">
                    <span class="opinion-author">나 (Student)</span>
                    <span class="opinion-time">방금 전</span>
                </div>
            </div>
        `;

        this.opinionFeed.insertAdjacentHTML('afterbegin', opinionHTML);
        this.opinionInput.value = '';
    },

    /* --- Feature: Chat --- */
    addChatBubble(text, type) {
        const bubble = document.createElement('div');
        bubble.className = `bubble ${type}`;
        bubble.innerText = text;
        this.chatFeed.appendChild(bubble);
        this.chatFeed.scrollTop = this.chatFeed.scrollHeight;
    },
    renderChat() {
        if (!this.chatFeed) return;
        this.chatFeed.innerHTML = ''; // Clear existing
        this.state.chatHistory.forEach(msg => this.addChatBubble(msg.text, msg.user));
    },
    sendChat() {
        const text = this.chatInput.value.trim();
        if (!text) return;

        this.state.chatHistory.push({ user: 'user', text: text });
        this.addChatBubble(text, 'user');
        this.chatInput.value = '';

        // Simulate bot response
        setTimeout(() => {
            const botResponse = this.getBotResponse(text);
            this.state.chatHistory.push({ user: 'bot', text: botResponse });
            this.addChatBubble(botResponse, 'bot');
        }, 1000);
    },
    getBotResponse(userMessage) {
        const lowerMsg = userMessage.toLowerCase();
        if (lowerMsg.includes('안녕') || lowerMsg.includes('하이')) {
            return '안녕하세요! 무엇을 도와드릴까요?';
        } else if (lowerMsg.includes('고마워') || lowerMsg.includes('감사')) {
            return '천만에요! 또 궁금한 점 있으시면 언제든지 물어보세요.';
        } else if (lowerMsg.includes('책 추천')) {
            return '어떤 종류의 책을 찾으시나요? 정의, 환경, AI 등 다양한 주제의 책들이 준비되어 있어요!';
        } else if (lowerMsg.includes('윤리') || lowerMsg.includes('도덕')) {
            return '윤리는 우리가 어떻게 살아야 할지에 대한 질문을 던지는 중요한 학문이죠. 이곳에서 다양한 관점을 탐색해보세요.';
        } else if (lowerMsg.includes('날씨')) {
            return '저는 날씨 정보는 알 수 없지만, 당신의 하루가 맑기를 바랍니다! ☀️';
        } else if (lowerMsg.includes('이름')) {
            return '저는 에틱 라이브러리 가든의 챗봇, 에티라고 합니다! 😊';
        } else {
            const responses = [
                '흥미로운 질문이네요!',
                '더 자세히 말씀해주시겠어요?',
                '그것에 대해 함께 생각해볼까요?',
                '좋은 의견 감사합니다!',
                '다른 질문은 없으신가요?'
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
    },

    /* --- Feature: Relay Story --- */
    addRelayLine() {
        const line = this.relayInput.value.trim();
        if (!line) return;
        this.state.relayStory.push(line);
        this.renderRelay();
        this.relayInput.value = '';

        // Auto scroll to bottom
        setTimeout(() => {
            this.storyBoard.scrollTop = this.storyBoard.scrollHeight;
        }, 100);
    },
    renderRelay() {
        if (!this.storyBoard) return;
        // Keep the start line separate or part of array? 
        // Let's just render array items except the first one if it's static in HTML
        // Actually, let's clear and re-render all dynamic lines

        // Get existing start text if needed, but easier to just append new divs
        // We will clear only added lines.
        // Simplified: Clear board and rewrite.

        this.storyBoard.innerHTML = `<p class="story-start">📌 첫 문장: 어느 날, 도서관의 책 속 주인공들이 모두 현실로 튀어나왔다...</p>`;

        // Render lines (skip index 0 if it's the prompt, but here our array starts with prompt in state for storage reasons? No let's just use state for user inputs)
        // Let's assume state.relayStory has ONLY user inputs for now to avoid duplication with HTML hardcoded start.
        // Wait, init state has one line. Let's start from index 1.

        this.state.relayStory.slice(1).forEach((line, index) => {
            const div = document.createElement('div');
            div.className = 'story-line';
            div.innerHTML = `${line} <span class="story-author">#익명${index + 1}</span>`;
            this.storyBoard.appendChild(div);
        });

        // Auto scroll to bottom
        setTimeout(() => {
            this.storyBoard.scrollTop = this.storyBoard.scrollHeight;
        }, 100);
    }

};

// Start
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
