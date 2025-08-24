// Missions Page JavaScript

class MissionsPage {
    constructor() {
        this.apiKey = 'vaOVMR9qEKwuomJVQgyg24TZhetg9dkHF2T97d3a';
        this.baseUrl = 'https://api.nasa.gov/planetary/rest/';
        this.currentPage = 1;
        this.missionsPerPage = 12;
        this.missions = [];
        this.filteredMissions = [];
        
        this.init();
    }

    init() {
        this.setupStarfield();
        this.setupEventListeners();
        this.loadMissions();
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

    setupEventListeners() {
        // Search functionality
        const searchBtn = document.getElementById('searchBtn');
        const searchInput = document.getElementById('searchInput');
        
        searchBtn.addEventListener('click', () => this.handleSearch());
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });

        // Filter functionality
        const missionType = document.getElementById('missionType');
        const targetBody = document.getElementById('targetBody');
        
        missionType.addEventListener('change', () => this.applyFilters());
        targetBody.addEventListener('change', () => this.applyFilters());

        // Pagination
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        prevBtn.addEventListener('click', () => this.previousPage());
        nextBtn.addEventListener('click', () => this.nextPage());

        // Modal functionality
        const modalClose = document.getElementById('modalClose');
        const missionModal = document.getElementById('missionModal');
        
        modalClose.addEventListener('click', () => this.closeModal());
        missionModal.addEventListener('click', (e) => {
            if (e.target === missionModal) this.closeModal();
        });
    }

    async loadMissions() {
        this.showLoading(true);
        
        try {
            // Load missions from NASA API
            const response = await fetch(`${this.baseUrl}missions?api_key=${this.apiKey}`);
            const data = await response.json();
            
            if (data && data.missions) {
                this.missions = data.missions;
                this.filteredMissions = [...this.missions];
                this.displayMissions();
            } else {
                // Fallback to sample data if API fails
                this.loadSampleMissions();
            }
        } catch (error) {
            console.error('Error loading missions:', error);
            this.loadSampleMissions();
        }
        
        this.showLoading(false);
    }

    loadSampleMissions() {
        this.missions = [
            {
                id: 1,
                name: "Perseverance",
                type: "Rover",
                target: "Mars",
                status: "Active",
                description: "NASA's Perseverance rover is searching for signs of ancient life on Mars and collecting samples for future return to Earth.",
                launch_date: "2020-07-30",
                landing_date: "2021-02-18"
            },
            {
                id: 2,
                name: "Curiosity",
                type: "Rover",
                target: "Mars",
                status: "Active",
                description: "Curiosity is exploring Gale Crater to determine if Mars ever had the right environmental conditions to support microbial life.",
                launch_date: "2011-11-26",
                landing_date: "2012-08-06"
            },
            {
                id: 3,
                name: "Juno",
                type: "Orbiter",
                target: "Jupiter",
                status: "Active",
                description: "Juno is studying Jupiter's composition, gravity field, magnetic field, and polar magnetosphere.",
                launch_date: "2011-08-05",
                arrival_date: "2016-07-04"
            },
            {
                id: 4,
                name: "Cassini",
                type: "Orbiter",
                target: "Saturn",
                status: "Completed",
                description: "Cassini studied Saturn and its rings and moons for 13 years before ending its mission in 2017.",
                launch_date: "1997-10-15",
                end_date: "2017-09-15"
            },
            {
                id: 5,
                name: "Voyager 1",
                type: "Flyby",
                target: "Interstellar Space",
                status: "Active",
                description: "Voyager 1 is the first spacecraft to reach interstellar space, continuing to send data from beyond our solar system.",
                launch_date: "1977-09-05"
            },
            {
                id: 6,
                name: "Voyager 2",
                type: "Flyby",
                target: "Interstellar Space",
                status: "Active",
                description: "Voyager 2 is the only spacecraft to have visited Uranus and Neptune, now exploring interstellar space.",
                launch_date: "1977-08-20"
            },
            {
                id: 7,
                name: "Apollo 11",
                type: "Lander",
                target: "Moon",
                status: "Completed",
                description: "The first manned mission to land on the Moon, with Neil Armstrong and Buzz Aldrin becoming the first humans to walk on the lunar surface.",
                launch_date: "1969-07-16",
                landing_date: "1969-07-20"
            },
            {
                id: 8,
                name: "New Horizons",
                type: "Flyby",
                target: "Pluto",
                status: "Active",
                description: "New Horizons provided the first close-up images of Pluto and is now exploring the Kuiper Belt.",
                launch_date: "2006-01-19",
                flyby_date: "2015-07-14"
            }
        ];
        
        this.filteredMissions = [...this.missions];
        this.displayMissions();
    }

    handleSearch() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        this.currentPage = 1;
        this.applyFilters();
    }

    applyFilters() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const missionType = document.getElementById('missionType').value;
        const targetBody = document.getElementById('targetBody').value;

        this.filteredMissions = this.missions.filter(mission => {
            const matchesSearch = mission.name.toLowerCase().includes(searchTerm) ||
                                mission.description.toLowerCase().includes(searchTerm);
            const matchesType = !missionType || mission.type === missionType;
            const matchesTarget = !targetBody || mission.target === targetBody;

            return matchesSearch && matchesType && matchesTarget;
        });

        this.displayMissions();
    }

    displayMissions() {
        const grid = document.getElementById('missionsGrid');
        const startIndex = (this.currentPage - 1) * this.missionsPerPage;
        const endIndex = startIndex + this.missionsPerPage;
        const pageMissions = this.filteredMissions.slice(startIndex, endIndex);

        grid.innerHTML = '';

        if (pageMissions.length === 0) {
            grid.innerHTML = '<div class="no-missions">No missions found matching your criteria.</div>';
            return;
        }

        pageMissions.forEach(mission => {
            const card = this.createMissionCard(mission);
            grid.appendChild(card);
        });

        this.updatePagination();
    }

    createMissionCard(mission) {
        const card = document.createElement('div');
        card.className = 'mission-card';
        card.addEventListener('click', () => this.showMissionDetails(mission));

        const statusClass = mission.status === 'Active' ? 'mission-status' : 'mission-type';
        
        card.innerHTML = `
            <h3 class="mission-title">${mission.name}</h3>
            <div class="mission-info">
                <span class="mission-type">${mission.type}</span>
                <span class="${statusClass}">${mission.status}</span>
            </div>
            <p>${mission.description.substring(0, 150)}${mission.description.length > 150 ? '...' : ''}</p>
            <div class="mission-details">
                <strong>Target:</strong> ${mission.target}<br>
                <strong>Launch:</strong> ${mission.launch_date || 'N/A'}
            </div>
        `;

        return card;
    }

    showMissionDetails(mission) {
        const modal = document.getElementById('missionModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        modalTitle.textContent = mission.name;
        
        const statusClass = mission.status === 'Active' ? 'mission-status' : 'mission-type';
        
        modalBody.innerHTML = `
            <div class="mission-detail-info">
                <span class="mission-type">${mission.type}</span>
                <span class="${statusClass}">${mission.status}</span>
            </div>
            <p><strong>Target:</strong> ${mission.target}</p>
            <p><strong>Launch Date:</strong> ${mission.launch_date || 'N/A'}</p>
            ${mission.landing_date ? `<p><strong>Landing Date:</strong> ${mission.landing_date}</p>` : ''}
            ${mission.arrival_date ? `<p><strong>Arrival Date:</strong> ${mission.arrival_date}</p>` : ''}
            ${mission.flyby_date ? `<p><strong>Flyby Date:</strong> ${mission.flyby_date}</p>` : ''}
            ${mission.end_date ? `<p><strong>End Date:</strong> ${mission.end_date}</p>` : ''}
            <div class="mission-description">
                <h4>Mission Description</h4>
                <p>${mission.description}</p>
            </div>
        `;

        modal.classList.add('active');
    }

    closeModal() {
        const modal = document.getElementById('missionModal');
        modal.classList.remove('active');
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.displayMissions();
        }
    }

    nextPage() {
        const maxPages = Math.ceil(this.filteredMissions.length / this.missionsPerPage);
        if (this.currentPage < maxPages) {
            this.currentPage++;
            this.displayMissions();
        }
    }

    updatePagination() {
        const maxPages = Math.ceil(this.filteredMissions.length / this.missionsPerPage);
        const pageInfo = document.getElementById('pageInfo');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        pageInfo.textContent = `Page ${this.currentPage} of ${maxPages}`;
        prevBtn.disabled = this.currentPage === 1;
        nextBtn.disabled = this.currentPage === maxPages;
    }

    showLoading(show) {
        const loadingIndicator = document.getElementById('loadingIndicator');
        const missionsGrid = document.getElementById('missionsGrid');
        
        if (show) {
            loadingIndicator.style.display = 'block';
            missionsGrid.style.display = 'none';
        } else {
            loadingIndicator.style.display = 'none';
            missionsGrid.style.display = 'grid';
        }
    }
}

// Initialize the missions page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MissionsPage();
});
