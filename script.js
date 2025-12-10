

class BookReader {
    constructor() {
        // Default book content - easily replaceable
        this.bookData = {
            title: "My Digital Book",
            subtitle: "An Interactive Reading Experience",
            pages: [
                {
                    id: 1,
                    content: "11:11 – A Fantasy Better Than a Thousand Realities\n\n11:11 is one of those rare novels that quietly takes your hand at the beginning, then suddenly pulls you into a deep emotional place. The author beautifully blends emotion, imagination, and real-life struggles to create a world where the number 11:11 becomes a symbol of destiny, hope, and unexpected signs from the universe."
                },
                {
                    id: 2,
                    content: "Chapter 1: Story & Themes\n\nThe story grows gently, filled with emotion and dreamy moments. It explores how imagination can sometimes heal us more than reality, and how one moment—like seeing 11:11—can change the path of a person’s life.\n\nThe novel discusses:\n   - Inner feelings and self-connection\n   - Mystery and unseen forces\n   - Time, chance, and destiny\n   - Love, longing, and loss\n   - The beauty of a dream compared to the pain of reality\n\nThe main message is simple yet powerful:Sometimes a beautiful fantasy is worth more than a thousand harsh truths."
                },
                {
                    id: 3,
                    content: "Chapter 2: Writing Style\n\nThe writing is soft, poetic, and emotional. Many lines read like heartfelt whispers, almost like journal entries from the soul. It’s romantic, philosophical, and full of quotable thoughts. Readers may often pause and think quietly, “This feels like my heart speaking.\n\n Strengths\nStrong emotional atmosphere\n• Beautifully written, poetic lines\n• A deep message about hope and imagination\n• The symbolic use of 11:11 adds a magical feel\n• Easy to connect with emotionally."
                },
                {
                    id: 4,
                    content: "Chapter 3: Weaknesses\n  - Sometimes too poetic, which may feel slow for some readers\n - Focuses more on emotion than dramatic events \n\nFinal Verdict\n 11:11 is a warm, emotional novel that pulls the reader out of everyday reality and into a softer, more meaningful world. It’s a short, soulful book perfect for anyone who loves romance, philosophical thoughts, and emotional storytelling."
                },
                {
                    id: 5,
                    content: "Chapter 4: Quotes Inspired\n\n - Sometimes your heart sees the truth long before your eyes do.\n\n - Not every reality is meant to be lived — some are meant to be escaped.\n\n - At 11:11, I don’t make a wish… I remember the person my heart still whispers for\n\n - Some encounters feel like they were written in the sky, not on earth.\n\n- You can lose people, but never the moments they created inside you..\n\n - A dream is fragile, but it’s still stronger than a thousand disappointments.\n\n Sometimes the universe sends signs because the heart is too tired to speak \n\n Your deepest feelings always arrive silently — just like 11:11 \n\n There are people who pass through our lives like miracles we weren't ready for\n\n A beautiful lie can save a breaking heart more than a painful truth ever could."
                },
                {
                    id: 6,
                    content: "Chapter 5: Short Summary of 11:11 \n\n 11:11 is an emotional, dreamy novel that blends love, fate, and imagination. The story follows a character caught between the harshness of reality and the comfort found in dreams. The number 11:11 becomes a symbol — a moment when hope, memory, and destiny meet.\n Throughout the book, the narrator reflects on lost love, unexpected moments, and the belief that sometimes imagination is more healing than truth. It’s a journey through the heart: soft, poetic, and full of quiet pain. The novel suggests that a single beautiful fantasy can be worth more than many painful realities."
                },
                {
                    
                }
            ]
        };

        // Application state
        this.currentPage = 1;
        this.totalPages = this.bookData.pages.length;
        this.isBookOpen = false;
        this.isEditMode = false;
        this.isOrganizeMode = false;
        this.isAnimating = false;
        this.settings = {
            fontSize: 16,
            theme: 'light',
            animationSpeed: 1,
            enable3D: true
        };

        // Initialize the application
        this.init();
    }

    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.setupTouchGestures();
        this.setupKeyboardNavigation();
        this.updateDisplay();
        
        // Hide loading screen after initialization
        setTimeout(() => {
            document.getElementById('loading-screen').classList.add('hidden');
        }, 1000);
    }

    setupEventListeners() {
        // Book interaction
        document.getElementById('closed-book').addEventListener('click', () => this.openBook());
        document.getElementById('close-book-btn').addEventListener('click', () => this.closeBook());

        // Navigation
        document.getElementById('prev-btn').addEventListener('click', () => this.previousPage());
        document.getElementById('next-btn').addEventListener('click', () => this.nextPage());

        // Mode toggles
        document.getElementById('edit-mode-btn').addEventListener('click', () => this.toggleEditMode());
        document.getElementById('organize-mode-btn').addEventListener('click', () => this.toggleOrganizeMode());

        // File operations
        document.getElementById('import-btn').addEventListener('click', () => this.importBook());
        document.getElementById('export-btn').addEventListener('click', () => this.exportBook());
        document.getElementById('file-input').addEventListener('change', (e) => this.handleFileImport(e));

        // Settings
        document.getElementById('settings-btn').addEventListener('click', () => this.toggleSettings());
        document.getElementById('close-settings-btn').addEventListener('click', () => this.toggleSettings());
        document.getElementById('font-size-slider').addEventListener('input', (e) => this.updateFontSize(e.target.value));
        document.getElementById('theme-select').addEventListener('change', (e) => this.updateTheme(e.target.value));
        document.getElementById('animation-speed').addEventListener('input', (e) => this.updateAnimationSpeed(e.target.value));
        document.getElementById('enable-3d').addEventListener('change', (e) => this.toggle3D(e.target.checked));

        // Edit panel
        document.getElementById('save-edit-btn').addEventListener('click', () => this.saveEdit());

        // Fullscreen
        document.getElementById('fullscreen-btn').addEventListener('click', () => this.toggleFullscreen());

        // Touch areas for page navigation
        document.getElementById('touch-left').addEventListener('click', () => this.previousPage());
        document.getElementById('touch-right').addEventListener('click', () => this.nextPage());
    }

    setupTouchGestures() {
        let startX = 0;
        let startY = 0;
        const minSwipeDistance = 50;

        const bookContainer = document.getElementById('book-container');

        bookContainer.addEventListener('touchstart', (e) => {
            if (!this.isBookOpen) return;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        bookContainer.addEventListener('touchend', (e) => {
            if (!this.isBookOpen) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const deltaX = endX - startX;
            const deltaY = endY - startY;

            // Check if it's a horizontal swipe
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    this.previousPage();
                } else {
                    this.nextPage();
                }
            }
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!this.isBookOpen) return;

            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previousPage();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextPage();
                    break;
                case 'Escape':
                    if (this.isEditMode) {
                        this.toggleEditMode();
                    } else {
                        this.closeBook();
                    }
                    break;
                case 'e':
                case 'E':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.toggleEditMode();
                    }
                    break;
            }
        });
    }

    openBook() {
        if (this.isAnimating) return;

        this.isBookOpen = true;
        this.isAnimating = true;

        // Hide closed book, show open book
        document.getElementById('closed-book').classList.add('hidden');
        document.getElementById('open-book').classList.remove('hidden');
        document.getElementById('reader-controls').classList.remove('hidden');
        document.getElementById('touch-left').classList.remove('hidden');
        document.getElementById('touch-right').classList.remove('hidden');

        // Update page content
        this.updatePageContent();
        this.updateProgress();

        // Animation complete
        setTimeout(() => {
            this.isAnimating = false;
        }, 1500);
    }

    closeBook() {
        if (this.isAnimating) return;

        this.isBookOpen = false;
        this.isAnimating = true;

        // Hide edit mode if active
        if (this.isEditMode) {
            this.toggleEditMode();
        }

        // Show closed book, hide open book
        document.getElementById('open-book').classList.add('hidden');
        document.getElementById('reader-controls').classList.add('hidden');
        document.getElementById('touch-left').classList.add('hidden');
        document.getElementById('touch-right').classList.add('hidden');
        document.getElementById('closed-book').classList.remove('hidden');

        // Animation complete
        setTimeout(() => {
            this.isAnimating = false;
        }, 500);
    }

    nextPage() {
        if (this.isAnimating || this.currentPage >= this.totalPages) return;

        this.animatePageTurn('right');
        this.currentPage++;
        this.updateAfterPageTurn();
    }

    previousPage() {
        if (this.isAnimating || this.currentPage <= 1) return;

        this.animatePageTurn('left');
        this.currentPage--;
        this.updateAfterPageTurn();
    }

    animatePageTurn(direction) {
        if (!this.settings.enable3D) {
            // Simple fade transition for non-3D mode
            this.updatePageContent();
            return;
        }

        this.isAnimating = true;

        const turningPage = document.getElementById('turning-page');
        const pageLayer = document.getElementById('page-turn-layer');
        
        // Setup turning page content
        if (direction === 'right') {
            // Show current page on front, next page on back
            document.getElementById('turning-page-front-text').textContent = this.getCurrentPageContent();
            document.getElementById('turning-page-back-text').textContent = this.getPageContent(this.currentPage + 1);
            turningPage.style.right = '0';
            turningPage.style.left = 'auto';
        } else {
            // Show previous page on front, current page on back
            document.getElementById('turning-page-front-text').textContent = this.getPageContent(this.currentPage - 1);
            document.getElementById('turning-page-back-text').textContent = this.getCurrentPageContent();
            turningPage.style.left = '0';
            turningPage.style.right = 'auto';
        }

        // Show page turn layer
        pageLayer.style.display = 'block';
        turningPage.className = `turning-page turn-${direction}`;

        // Update animation speed
        turningPage.style.animationDuration = `${0.8 * this.settings.animationSpeed}s`;

        // Hide after animation
        setTimeout(() => {
            pageLayer.style.display = 'none';
            turningPage.className = 'turning-page';
            this.isAnimating = false;
        }, 800 * this.settings.animationSpeed);
    }

    updateAfterPageTurn() {
        // Small delay to sync with animation
        setTimeout(() => {
            this.updatePageContent();
            this.updateProgress();
            this.saveSettings();
        }, 400 * this.settings.animationSpeed);
    }

    updatePageContent() {
        const leftPageText = document.getElementById('left-page-text');
        const rightPageText = document.getElementById('right-page-text');
        const leftPageNum = document.getElementById('left-page-num');
        const rightPageNum = document.getElementById('right-page-num');

        // For single page view, show current page on right, previous on left
        if (this.currentPage > 1) {
            leftPageText.textContent = this.getPageContent(this.currentPage - 1);
            leftPageNum.textContent = this.currentPage - 1;
        } else {
            leftPageText.textContent = '';
            leftPageNum.textContent = '';
        }

        rightPageText.textContent = this.getCurrentPageContent();
        rightPageNum.textContent = this.currentPage;

        // Update navigation button states
        document.getElementById('prev-btn').disabled = this.currentPage <= 1;
        document.getElementById('next-btn').disabled = this.currentPage >= this.totalPages;
    }

    updateProgress() {
        const progress = (this.currentPage / this.totalPages) * 100;
        document.getElementById('progress-fill').style.width = `${progress}%`;
        document.getElementById('current-page').textContent = this.currentPage;
        document.getElementById('total-pages').textContent = this.totalPages;
    }

    getCurrentPageContent() {
        return this.getPageContent(this.currentPage);
    }

    getPageContent(pageNum) {
        const page = this.bookData.pages.find(p => p.id === pageNum);
        return page ? page.content : '';
    }

    toggleEditMode() {
        this.isEditMode = !this.isEditMode;
        const editPanel = document.getElementById('edit-panel');
        const editBtn = document.getElementById('edit-mode-btn');

        if (this.isEditMode) {
            editPanel.classList.remove('hidden');
            editBtn.classList.add('active');
            document.getElementById('edit-textarea').value = this.getCurrentPageContent();
            document.getElementById('edit-textarea').focus();
        } else {
            editPanel.classList.add('hidden');
            editBtn.classList.remove('active');
        }
    }

    saveEdit() {
        const newContent = document.getElementById('edit-textarea').value;
        const currentPageData = this.bookData.pages.find(p => p.id === this.currentPage);
        
        if (currentPageData) {
            currentPageData.content = newContent;
            this.updatePageContent();
            this.saveBookData();
            this.toggleEditMode();
        }
    }

    toggleOrganizeMode() {
        this.isOrganizeMode = !this.isOrganizeMode;
        // TODO: Implement drag-and-drop page organization
        console.log('Organize mode:', this.isOrganizeMode);
    }

    importBook() {
        document.getElementById('file-input').click();
    }

    handleFileImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                this.bookData = importedData;
                this.totalPages = this.bookData.pages.length;
                this.currentPage = 1;
                this.updateDisplay();
                this.saveBookData();
                alert('Book imported successfully!');
            } catch (error) {
                alert('Error importing book: Invalid JSON format');
            }
        };
        reader.readAsText(file);
    }

    exportBook() {
        const dataStr = JSON.stringify(this.bookData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `${this.bookData.title.replace(/\s+/g, '_')}.json`;
        link.click();
    }

    toggleSettings() {
        const settingsPanel = document.getElementById('settings-panel');
        settingsPanel.classList.toggle('hidden');
        
        if (!settingsPanel.classList.contains('hidden')) {
            // Update settings display
            document.getElementById('font-size-slider').value = this.settings.fontSize;
            document.getElementById('font-size-value').textContent = `${this.settings.fontSize}px`;
            document.getElementById('theme-select').value = this.settings.theme;
            document.getElementById('animation-speed').value = this.settings.animationSpeed;
            document.getElementById('animation-speed-value').textContent = `${this.settings.animationSpeed}x`;
            document.getElementById('enable-3d').checked = this.settings.enable3D;
        }
    }

    updateFontSize(size) {
        this.settings.fontSize = parseInt(size);
        document.getElementById('font-size-value').textContent = `${size}px`;
        document.documentElement.style.setProperty('--font-size', `${size}px`);
        this.saveSettings();
    }

    updateTheme(theme) {
        this.settings.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        this.saveSettings();
    }

    updateAnimationSpeed(speed) {
        this.settings.animationSpeed = parseFloat(speed);
        document.getElementById('animation-speed-value').textContent = `${speed}x`;
        document.documentElement.style.setProperty('--animation-speed', `${speed}s`);
        this.saveSettings();
    }

    toggle3D(enabled) {
        this.settings.enable3D = enabled;
        this.saveSettings();
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    updateDisplay() {
        this.updatePageContent();
        this.updateProgress();
        
        // Update book title
        document.querySelector('.book-title').textContent = this.bookData.title;
        document.querySelector('.book-subtitle').textContent = this.bookData.subtitle;
    }

    loadSettings() {
        const saved = localStorage.getItem('bookReaderSettings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }

        // Apply loaded settings
        document.documentElement.style.setProperty('--font-size', `${this.settings.fontSize}px`);
        document.documentElement.setAttribute('data-theme', this.settings.theme);
        document.documentElement.style.setProperty('--animation-speed', `${this.settings.animationSpeed}s`);

        // Load book data
        const savedBook = localStorage.getItem('bookReaderData');
        if (savedBook) {
            try {
                this.bookData = JSON.parse(savedBook);
                this.totalPages = this.bookData.pages.length;
            } catch (error) {
                console.warn('Error loading saved book data');
            }
        }
    }

    saveSettings() {
        localStorage.setItem('bookReaderSettings', JSON.stringify(this.settings));
    }

    saveBookData() {
        localStorage.setItem('bookReaderData', JSON.stringify(this.bookData));
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.bookReader = new BookReader();
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is hidden
        document.documentElement.style.setProperty('--animation-speed', '0s');
    } else {
        // Resume animations when page is visible
        const speed = window.bookReader?.settings?.animationSpeed || 1;
        document.documentElement.style.setProperty('--animation-speed', `${speed}s`);
    }
});

/**
 * Example JSON structure for book content:
 * 
 * {
 *   "title": "My Book Title",
 *   "subtitle": "A subtitle or description",
 *   "pages": [
 *     {
 *       "id": 1,
 *       "content": "First page content here..."
 *     },
 *     {
 *       "id": 2,
 *       "content": "Second page content..."
 *     }
 *   ]
 * }
 * 
 * To replace the book content:
 * 1. Modify the bookData object in the BookReader constructor
 * 2. Update the pages array with your content
 * 3. Change the title and subtitle as needed
 * 
 * To replace the cover image:
 * 1. Replace './public/assets/book-cover-leather.jpg' with your image
 * 2. Update the src attribute in the HTML if using a different filename
 * 3. Ensure the image has appropriate dimensions (recommended: 300x400px)

 */
