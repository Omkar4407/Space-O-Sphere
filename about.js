// About Page JavaScript

class AboutPage {
    constructor() {
        this.init();
    }

    init() {
        this.setupStarfield();
        this.setupAnimations();
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

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            stars.rotation.y += 0.0005;
            stars.rotation.x += 0.0002;
            renderer.render(scene, camera);
        }
        animate();

        // Handle resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    setupAnimations() {
        // Add entrance animations to sections
        const sections = document.querySelectorAll('.about-section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        sections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'all 0.8s ease';
            section.style.transitionDelay = `${index * 0.2}s`;
            observer.observe(section);
        });

        // Add hover effects to feature cards
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Add hover effects to tech items
        const techItems = document.querySelectorAll('.tech-item');
        techItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.borderColor = '#00d4ff';
                item.style.boxShadow = '0 0 20px rgba(0, 150, 255, 0.3)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.borderColor = 'rgba(0, 150, 255, 0.3)';
                item.style.boxShadow = 'none';
            });
        });

        // Add hover effects to future items
        const futureItems = document.querySelectorAll('.future-item');
        futureItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.borderColor = '#00d4ff';
                item.style.boxShadow = '0 0 20px rgba(0, 150, 255, 0.3)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.borderColor = 'rgba(0, 150, 255, 0.3)';
                item.style.boxShadow = 'none';
            });
        });

        // Add hover effects to contact items
        const contactItems = document.querySelectorAll('.contact-item');
        contactItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.borderColor = '#00d4ff';
                item.style.transform = 'translateY(-5px)';
                item.style.boxShadow = '0 10px 30px rgba(0, 150, 255, 0.2)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.borderColor = 'rgba(0, 150, 255, 0.3)';
                item.style.transform = 'translateY(0)';
                item.style.boxShadow = 'none';
            });
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
    }
}

// Initialize the about page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AboutPage();
});
