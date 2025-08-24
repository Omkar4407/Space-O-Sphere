// Main JavaScript for Space-O-Sphere Home Page

class SpaceApp {
    constructor() {
        this.settings = {
            frames: 30
        };
        this.countdownTarget = new Date('2025-06-15T10:00:00Z'); // Example Mars mission date
        this.nasaApi = new NASAApi();
        this.loadSavedSettings();
        this.init();
    }

    init() {
        this.setupStarfield();
        this.setupSettings();
        this.setupCountdown();
        this.setupAnimations();
        this.setupEventListeners();
        this.loadNASAData();
    }

    loadSavedSettings() {
        const savedSettings = localStorage.getItem('spaceAppSettings');
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                this.settings = { ...this.settings, ...parsed };
                
                // Update UI to reflect saved settings
                this.updateSettingsUI();
            } catch (error) {
                console.error('Error loading saved settings:', error);
            }
        }
    }

    updateSettingsUI() {
        // Update frame rate button states
        const frameButtons = document.querySelectorAll('.frame-btn');
        frameButtons.forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.dataset.frames) === this.settings.frames) {
                btn.classList.add('active');
            }
        });
    }

    setupStarfield() {
        // Three.js Starfield Background
        const canvas = document.getElementById('starfield-canvas');
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 5000);
        camera.position.z = 1000;

        // Create starfield
        const starCount = 5000;
        const starGeometry = new THREE.BufferGeometry();
        const starPositions = [];
        
        for (let i = 0; i < starCount; i++) {
            const x = (Math.random() - 0.5) * 4000;
            const y = (Math.random() - 0.5) * 4000;
            const z = (Math.random() - 0.5) * 4000;
            starPositions.push(x, y, z);
        }
        
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
        const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1 });
        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);

        // Frame rate control variables
        let lastTime = 0;
        const frameInterval = 1000 / this.settings.frames; // Convert fps to milliseconds

        // Animation loop with frame rate control
        const animate = (currentTime) => {
            this.animationId = requestAnimationFrame(animate);
            
            // Check if enough time has passed for the next frame
            if (currentTime - lastTime >= frameInterval) {
                stars.rotation.y += 0.0005;
                stars.rotation.x += 0.0002;
                renderer.render(scene, camera);
                lastTime = currentTime;
            }
        };
        animate();

        // Store animation function reference for frame rate updates
        this.starfieldAnimation = animate;
        this.starfieldRenderer = renderer;
        this.starfieldScene = scene;
        this.starfieldCamera = camera;
        this.starfieldStars = stars;

        // Handle resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    setupSettings() {
        const gearIcon = document.getElementById('gearIcon');
        const settingsPanel = document.getElementById('settingsPanel');
        const frameButtons = document.querySelectorAll('.frame-btn');

        // Toggle settings panel
        gearIcon.addEventListener('click', () => {
            settingsPanel.classList.toggle('active');
        });

        // Close settings when clicking outside
        document.addEventListener('click', (e) => {
            if (!gearIcon.contains(e.target) && !settingsPanel.contains(e.target)) {
                settingsPanel.classList.remove('active');
            }
        });

        // Frame rate selection
        frameButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                frameButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.settings.frames = parseInt(btn.dataset.frames);
                this.updateSettings();
            });
        });

        // Update UI to reflect current settings
        this.updateSettingsUI();
    }

    setupCountdown() {
        this.updateCountdown();
        setInterval(() => this.updateCountdown(), 1000);
    }

    updateCountdown() {
        const now = new Date();
        const timeLeft = this.countdownTarget - now;

        if (timeLeft > 0) {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            document.getElementById('days').textContent = days.toString().padStart(3, '0');
            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        } else {
            // Mission launched!
            document.getElementById('countdownTimer').innerHTML = '<div class="mission-launched">MISSION LAUNCHED!</div>';
        }
    }

    setupAnimations() {
        // Add entrance animations
        const elements = document.querySelectorAll('.main-title, .subtitle, .cta-buttons');
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                el.style.transition = 'all 0.8s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
        });

        // Add floating animation to countdown
        const countdownContainer = document.querySelector('.countdown-container');
        countdownContainer.style.animation = 'float 3s ease-in-out infinite';
    }

    setupEventListeners() {
        // Learn More button
        const learnMoreBtn = document.getElementById('learnMore');
        if (learnMoreBtn) {
            learnMoreBtn.addEventListener('click', () => {
                this.showLearnMoreModal();
            });
        }

        // Add hover effects to CTA buttons
        const ctaButtons = document.querySelectorAll('.cta-btn');
        ctaButtons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-3px) scale(1.05)';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Add particle effect on button click
        ctaButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.createParticleEffect(e);
            });
        });
    }

    createParticleEffect(event) {
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: fixed;
                left: ${centerX}px;
                top: ${centerY}px;
                width: 4px;
                height: 4px;
                background: #0096ff;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
            `;

            document.body.appendChild(particle);

            const angle = (i / 10) * Math.PI * 2;
            const velocity = 100 + Math.random() * 50;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;

            let opacity = 1;
            let scale = 1;

            const animate = () => {
                const currentLeft = parseFloat(particle.style.left);
                const currentTop = parseFloat(particle.style.top);

                particle.style.left = (currentLeft + vx * 0.016) + 'px';
                particle.style.top = (currentTop + vy * 0.016) + 'px';

                opacity -= 0.02;
                scale -= 0.01;

                particle.style.opacity = opacity;
                particle.style.transform = `scale(${scale})`;

                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    document.body.removeChild(particle);
                }
            };

            requestAnimationFrame(animate);
        }
    }

    showLearnMoreModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>About Space-O-Sphere</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Space-O-Sphere is a cutting-edge 3D solar system explorer that brings the cosmos to your fingertips.</p>
                    <h3>Features:</h3>
                    <ul>
                        <li>Interactive 3D Solar System with realistic planet scaling</li>
                        <li>Real-time distance calculations</li>
                        <li>Detailed information about each celestial body</li>
                        <li>Space mission data and historical facts</li>
                        <li>Futuristic UI with smooth animations</li>
                    </ul>
                    <p>Built with Three.js for immersive 3D graphics and modern web technologies for optimal performance.</p>
                </div>
            </div>
        `;

        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
                backdrop-filter: blur(5px);
            }
            .modal-content {
                background: rgba(0, 0, 0, 0.95);
                border: 1px solid #0096ff;
                border-radius: 15px;
                padding: 30px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                backdrop-filter: blur(10px);
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 1px solid rgba(0, 150, 255, 0.3);
            }
            .modal-header h2 {
                color: #0096ff;
                font-family: 'Orbitron', monospace;
            }
            .modal-close {
                background: none;
                border: none;
                color: #ffffff;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 5px;
                border-radius: 50%;
                transition: all 0.3s ease;
            }
            .modal-close:hover {
                background: rgba(255, 107, 107, 0.2);
                color: #ff6b6b;
            }
            .modal-body {
                color: #ffffff;
                line-height: 1.6;
            }
            .modal-body h3 {
                color: #0096ff;
                margin: 20px 0 10px 0;
                font-family: 'Orbitron', monospace;
            }
            .modal-body ul {
                margin: 10px 0;
                padding-left: 20px;
            }
            .modal-body li {
                margin: 5px 0;
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(modal);

        // Close modal functionality
        const closeModal = () => {
            document.body.removeChild(modal);
            document.head.removeChild(style);
        };

        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Add entrance animation
        modal.style.opacity = '0';
        modal.style.transform = 'scale(0.8)';
        setTimeout(() => {
            modal.style.transition = 'all 0.3s ease';
            modal.style.opacity = '1';
            modal.style.transform = 'scale(1)';
        }, 10);
    }

    updateSettings() {
        // Save settings to localStorage
        localStorage.setItem('spaceAppSettings', JSON.stringify(this.settings));
        
        // Apply frame rate setting to starfield animation
        if (this.starfieldAnimation) {
            // Restart animation with new frame rate
            this.restartStarfieldAnimation();
        }
        
        console.log('Settings updated:', this.settings);
    }

    restartStarfieldAnimation() {
        // Stop current animation
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        // Frame rate control variables
        let lastTime = 0;
        const frameInterval = 1000 / this.settings.frames; // Convert fps to milliseconds

        // Restart animation loop with new frame rate
        const animate = (currentTime) => {
            this.animationId = requestAnimationFrame(animate);
            
            // Check if enough time has passed for the next frame
            if (currentTime - lastTime >= frameInterval) {
                this.starfieldStars.rotation.y += 0.0005;
                this.starfieldStars.rotation.x += 0.0002;
                this.starfieldRenderer.render(this.starfieldScene, this.starfieldCamera);
                lastTime = currentTime;
            }
        };
        animate();
    }

    // NASA API Integration Methods
    async loadNASAData() {
        await Promise.all([
            this.loadAPOD(),
            this.loadMarsGallery()
        ]);
    }

    async loadAPOD() {
        try {
            const result = await this.nasaApi.getAPOD();
            if (result.success && result.data) {
                this.displayAPOD(result.data);
            } else {
                console.warn('Failed to load APOD:', result.error);
            }
        } catch (error) {
            console.error('Error loading APOD:', error);
        }
    }

    displayAPOD(apodData) {
        const backgroundContainer = document.getElementById('apod-background-container');
        const infoContainer = document.getElementById('apod-info-container');

        if (backgroundContainer && infoContainer) {
            // Create and display APOD background
            const apodBackground = this.nasaApi.createAPODBackground(apodData);
            backgroundContainer.appendChild(apodBackground);

            // Create and display APOD info panel
            const apodInfoPanel = this.nasaApi.createAPODInfoPanel(apodData);
            infoContainer.appendChild(apodInfoPanel);

            // Add fade-in animation
            setTimeout(() => {
                apodBackground.style.opacity = '1';
                apodInfoPanel.style.opacity = '1';
            }, 1000);
        }
    }

    async loadMarsGallery() {
        try {
            const result = await this.nasaApi.getLatestMarsPhotos(6);
            if (result.success && result.data.length > 0) {
                this.displayMarsGallery(result.data);
            } else {
                console.warn('Failed to load Mars photos:', result.error);
            }
        } catch (error) {
            console.error('Error loading Mars gallery:', error);
        }
    }

    displayMarsGallery(photos) {
        const galleryContainer = document.getElementById('mars-gallery-container');
        if (galleryContainer) {
            const marsGallery = this.nasaApi.createMarsGallery(photos);
            galleryContainer.appendChild(marsGallery);

            // Add hover effects to photo items
            const photoItems = galleryContainer.querySelectorAll('.mars-photo-item');
            photoItems.forEach(item => {
                item.addEventListener('mouseenter', () => {
                    item.style.transform = 'scale(1.1)';
                    item.style.boxShadow = '0 0 20px rgba(0, 150, 255, 0.6)';
                });
                
                item.addEventListener('mouseleave', () => {
                    item.style.transform = 'scale(1)';
                    item.style.boxShadow = '0 0 10px rgba(0, 150, 255, 0.3)';
                });

                // Add click to enlarge functionality
                item.addEventListener('click', () => {
                    this.showEnlargedPhoto(item.dataset.photoUrl);
                });
            });
        }
    }

    showEnlargedPhoto(photoUrl) {
        const modal = document.createElement('div');
        modal.className = 'photo-modal';
        modal.innerHTML = `
            <div class="photo-modal-content">
                <button class="photo-modal-close">&times;</button>
                <img src="${photoUrl}" alt="Mars Rover Photo">
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal functionality
        const closeModal = () => {
            document.body.removeChild(modal);
        };

        modal.querySelector('.photo-modal-close').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Add entrance animation
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
    }
}

// Add floating animation keyframes
const floatingAnimation = document.createElement('style');
floatingAnimation.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
    }
    
    .mission-launched {
        font-family: 'Orbitron', monospace;
        font-size: 1.2rem;
        color: #00ff88;
        text-align: center;
        animation: pulse 1s ease-in-out infinite;
    }
`;
document.head.appendChild(floatingAnimation);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SpaceApp();
});

// Add smooth scrolling for navigation links
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
