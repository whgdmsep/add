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
            "정직은 가장 확실한 자본이다. - 에머슨",
            "남에게 대접받고자 하는 대로 남을 대접하라."
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

        // Notes
        this.noteInput = document.getElementById('note-input');
        this.noteAddBtn = document.getElementById('note-add-btn');
        this.notesGrid = document.getElementById('notes-grid');

        // Chat
        this.chatInput = document.getElementById('chat-input');
        this.chatSendBtn = document.getElementById('chat-send');
        this.chatFeed = document.getElementById('chat-feed');
        this.voteBar = document.getElementById('vote-bar');

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

        // Notes
        if (this.noteAddBtn) {
            this.noteAddBtn.addEventListener('click', () => this.addNote());
        }

        // Chat
        if (this.chatSendBtn) {
            this.chatSendBtn.addEventListener('click', () => this.sendMessage());
        }
        if (this.chatInput) {
            this.chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendMessage();
            });
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
        this.renderChat();
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
            { title: "시간을 파는 상점", author: "김선영", category: "시간/철학", desc: "시간의 의미를 찾아가는 미스터리한 상점의 이야기", color: "#CE93D8" }
        ];

        if (!this.galleryContainer) return;
        this.galleryContainer.innerHTML = books.map(book => `
            <div class="book-card">
                <div class="book-img" style="background-color: ${book.color}; display:flex; align-items:center; justify-content:center; font-size:3rem;">📖</div>
                <div class="book-info">
                    <span style="font-size:0.8rem; color:#888; text-transform:uppercase; letter-spacing:1px;">${book.category}</span>
                    <h3 style="margin:5px 0;">${book.title}</h3>
                    <p style="font-weight:bold; color:#555; font-size:0.9rem;">${book.author}</p>
                    <p style="margin-top:10px; font-size:0.85rem; color:#777; line-height:1.4;">${book.desc}</p>
                </div>
            </div>
        `).join('');
    },

    /* --- Feature: Notes (Forest of Sentences) --- */
    addNote() {
        const text = this.noteInput.value.trim();
        if (!text) return;
        this.state.notes.unshift(text); // Add to front
        this.renderNotes();
        this.noteInput.value = '';
    },
    renderNotes() {
        if (!this.notesGrid) return;
        this.notesGrid.innerHTML = this.state.notes.map(note => `
            <div class="note-item">"${note}"</div>
        `).join('');
    },

    /* --- Feature: Chat + Balance Game --- */
    sendMessage() {
        const text = this.chatInput.value.trim();
        if (!text) return;

        // User message
        this.addChatBubble(text, 'user');
        this.chatInput.value = '';

        // Auto reply simulation
        setTimeout(() => {
            this.addChatBubble("좋은 의견이네요! 다른 친구들은 어떻게 생각할까요?", 'bot');
        }, 1000);
    },
    addChatBubble(text, type) {
        const bubble = document.createElement('div');
        bubble.className = `bubble ${type}`;
        bubble.innerText = text;
        this.chatFeed.appendChild(bubble);
        this.chatFeed.scrollTop = this.chatFeed.scrollHeight;
    },
    renderChat() {
        // Load initial history
        this.state.chatHistory.forEach(msg => this.addChatBubble(msg.text, msg.user));
    },
    vote(option) {
        alert(option === 'yes' ? "⭕ '그렇다'에 한 표 행사했습니다!" : "❌ '아니다'에 한 표 행사했습니다!");
        // Simple visual feedback
        if (this.voteBar) {
            this.voteBar.style.width = '62%';
            this.voteBar.style.opacity = '1';
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
    }
};

// Start
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
