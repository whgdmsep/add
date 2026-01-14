const app = {
    db: {
        get: (k) => JSON.parse(localStorage.getItem(k) || '[]'),
        add: (k, v) => {
            const d = JSON.parse(localStorage.getItem(k) || '[]');
            d.unshift(v);
            localStorage.setItem(k, JSON.stringify(d));
            return d;
        }
    },

    init() {
        this.bindNav();
        this.renderBooks();
        this.initSentences();
        this.initChat();
        this.initLetter();
    },

    bindNav() {
        const btns = document.querySelectorAll('nav button');
        const pages = document.querySelectorAll('.page');
        const logo = document.querySelector('.logo');
        const introPage = document.getElementById('page-intro');

        // Logic to switch pages
        const switchPage = (targetId) => {
            // Update buttons active state
            btns.forEach(b => {
                if (b.dataset.target === targetId) b.classList.add('active');
                else b.classList.remove('active');
            });

            // Update visible page
            pages.forEach(p => {
                p.classList.remove('active');
                if (p.id === targetId) p.classList.add('active');
            });
        };

        // Nav Buttons Click
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                switchPage(btn.dataset.target);
            });
        });

        // Logo Click -> Go to Intro
        logo.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active')); // No menu active
            pages.forEach(p => p.classList.remove('active'));
            introPage.classList.add('active');
        });
    },

    toast(msg) {
        const box = document.getElementById('toast-box');
        box.querySelector('span').innerText = msg;
        box.classList.add('show');
        setTimeout(() => box.classList.remove('show'), 3000);
    },

    // --- Book Data ---
    renderBooks() {
        const books = [
            { num: '01', title: "죽은 시인의 사회", author: "N.H. 클라인바움", desc: "진정한 나를 찾는다는 건 어떤 의미일까?" },
            { num: '02', title: "기억 전달자", author: "로이스 로리", desc: "고통 없는 완벽한 사회, 그 이면의 진실." },
            { num: '03', title: "앵무새 죽이기", author: "하퍼 리", desc: "편견이라는 괴물과 싸우는 양심." },
            { num: '04', title: "아몬드", author: "손원평", desc: "타인의 고통에 공감하는 법." },
            { num: '05', title: "모모", author: "미하엘 엔데", desc: "시간을 훔쳐가는 회색 신사들." },
        ];
        const wrapper = document.querySelector('.gallery-wrapper');
        if (wrapper) {
            wrapper.innerHTML = books.map(b => `
                <div class="book-card">
                    <div class="book-num">${b.num}</div>
                    <div class="book-info">
                        <h3>${b.title}</h3>
                        <span class="author">${b.author}</span>
                        <p>${b.desc}</p>
                    </div>
                </div>
            `).join('');
        }
    },

    // --- Sentences ---
    initSentences() {
        const container = document.getElementById('notes-grid');
        const render = () => {
            const notes = this.db.get('notes');
            if (notes.length === 0) {
                container.innerHTML = `
                    <div class="note-card accent"><p>"가장 중요한 것은 눈에 보이지 않아."</p></div>
                    <div class="note-card"><p>"말은 생각의 껍데기에 불과해."</p></div>
                `;
                return;
            }
            container.innerHTML = notes.map(n => `<div class="note-card"><p>"${n.text}"</p></div>`).join('');
        };
        document.getElementById('note-add-btn').addEventListener('click', () => {
            const input = document.getElementById('note-input');
            if (input.value) {
                this.db.add('notes', { text: input.value });
                input.value = '';
                render();
                this.toast('문장이 수집되었습니다.');
            }
        });
        render();
    },

    // --- Chat ---
    initChat() {
        const feed = document.getElementById('chat-feed');
        const dbChat = this.db.get('chats');
        // Initial Dummy if empty
        if (dbChat.length === 0) {
            feed.innerHTML = `
                <div class="bubble other">선의의 거짓말도 거짓말 아닐까요?</div>
                <div class="bubble me">상황에 따라 다를 수 있다고 생각해요.</div>
            `;
        } else {
            feed.innerHTML = dbChat.map(c => `<div class="bubble ${c.isMe ? 'me' : 'other'}">${c.text}</div>`).join('');
        }
    },

    // --- Letter ---
    initLetter() {
        document.getElementById('send-letter-btn').addEventListener('click', () => {
            const t = document.getElementById('letter-content-area');
            if (t.value) {
                this.toast('편지가 우체통에 접수되었습니다.');
                t.value = '';
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => app.init());
