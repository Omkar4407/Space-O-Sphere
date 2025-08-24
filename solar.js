// Three.js Solar System Implementation

class SolarSystem {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.planets = {};
        this.sun = null;
        this.controls = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.selectedObject = null;
        this.isZoomed = false;
        this.originalCameraPosition = null;
        this.originalCameraTarget = null;
        this.planetData = this.getPlanetData();
        this.missions = this.getMissionsData();
        this.nasaApi = new NASAApi();
        
        // Frame rate settings
        this.settings = {
            frames: 30
        };
        this.loadSavedSettings();
        
        this.init();
    }

    init() {
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupControls();
        this.createStarfield();
        this.createSun();
        this.createPlanets();
        this.setupEventListeners();
        this.setupSettings();
        this.animate();
        this.hideLoadingScreen();
        this.loadAPOD();
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000011);
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 20, 50);
        this.originalCameraPosition = this.camera.position.clone();
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        const container = document.getElementById('scene-container');
        container.appendChild(this.renderer.domElement);
    }

    setupStarfield() {
        // Create starfield background using Three.js (same as homepage)
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
        this.scene.add(stars);

        // Store stars reference for frame rate control
        this.starfieldStars = stars;
    }

    setupControls() {
        // Simple orbit controls
        this.controls = {
            rotationX: 0,
            rotationY: 0,
            distance: 50,
            target: new THREE.Vector3(0, 0, 0),
            isDragging: false,
            previousMousePosition: { x: 0, y: 0 }
        };
    }

    createStarfield() {
        // Create starfield background
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 10000;
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 2000;
            positions[i + 1] = (Math.random() - 0.5) * 2000;
            positions[i + 2] = (Math.random() - 0.5) * 2000;

            const color = new THREE.Color();
            color.setHSL(Math.random() * 0.1 + 0.9, 0.5, Math.random() * 0.5 + 0.5);
            colors[i] = color.r;
            colors[i + 1] = color.g;
            colors[i + 2] = color.b;
        }

        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const starMaterial = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });

        const stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(stars);
    }

    createSun() {
        const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
        const sunMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            emissive: 0xffff00,
            emissiveIntensity: 0.5
        });

        this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
        this.sun.name = 'Sun';
        this.sun.userData = {
            type: 'sun',
            distance: 0,
            facts: 'The Sun is the star at the center of our Solar System. It contains 99.86% of the system\'s mass and provides the energy that sustains life on Earth.',
            missions: []
        };

        // Add sun glow effect
        const sunGlow = new THREE.PointLight(0xffff00, 2, 100);
        sunGlow.position.copy(this.sun.position);
        this.scene.add(sunGlow);

        this.scene.add(this.sun);
    }

    createPlanets() {
        const planetConfigs = [
            { name: 'Mercury', distance: 8, size: 0.8, color: 0x8c7853, speed: 0.01, facts: 'Mercury is the smallest and innermost planet in the Solar System. It has no moons and no atmosphere.' },
            { name: 'Venus', distance: 12, size: 1.2, color: 0xffd700, speed: 0.008, facts: 'Venus is the second planet from the Sun and is Earth\'s closest planetary neighbor. It\'s one of the four inner, terrestrial planets.' },
            { name: 'Earth', distance: 16, size: 1.3, color: 0x0077be, speed: 0.006, facts: 'Earth is the third planet from the Sun and the only astronomical object known to harbor life. It has one natural satellite, the Moon.' },
            { name: 'Mars', distance: 20, size: 1.1, color: 0xff4500, speed: 0.005, facts: 'Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System. It\'s often called the "Red Planet" due to its reddish appearance.' },
            { name: 'Jupiter', distance: 28, size: 2.5, color: 0xffa500, speed: 0.003, facts: 'Jupiter is the fifth planet from the Sun and the largest in the Solar System. It is a gas giant with a mass more than two and a half times that of all the other planets combined.' },
            { name: 'Saturn', distance: 36, size: 2.2, color: 0xffd700, speed: 0.002, facts: 'Saturn is the sixth planet from the Sun and the second-largest in the Solar System, after Jupiter. It is known for its distinctive ring system.' },
            { name: 'Uranus', distance: 44, size: 1.8, color: 0x00ffff, speed: 0.0015, facts: 'Uranus is the seventh planet from the Sun. It has the third-largest diameter in our solar system and was the first planet discovered with a telescope.' },
            { name: 'Neptune', distance: 52, size: 1.7, color: 0x0000ff, speed: 0.001, facts: 'Neptune is the eighth and farthest known planet from the Sun. It was the first planet located through mathematical calculations rather than observation.' }
        ];

        planetConfigs.forEach((config, index) => {
            const planet = this.createPlanet(config, index);
            this.planets[config.name] = planet;
        });
    }

    createPlanet(config, index) {
        const planetGeometry = new THREE.SphereGeometry(config.size, 32, 32);
        
        // Use real planet textures for Earth, Mars, and Jupiter
        let planetMaterial;
        
        if (config.name === 'Earth') {
            const textureLoader = new THREE.TextureLoader();
            const earthTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg');
            const earthBumpMap = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg');
            const earthSpecularMap = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg');
            
            planetMaterial = new THREE.MeshPhongMaterial({
                map: earthTexture,
                bumpMap: earthBumpMap,
                bumpScale: 0.05,
                specularMap: earthSpecularMap,
                specular: new THREE.Color('grey'),
                shininess: 10
            });
        } else if (config.name === 'Mars') {
            const textureLoader = new THREE.TextureLoader();
            const marsTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/mars_1k_color.jpg');
            const marsBumpMap = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/mars_1k_topo.jpg');
            
            planetMaterial = new THREE.MeshPhongMaterial({
                map: marsTexture,
                bumpMap: marsBumpMap,
                bumpScale: 0.1,
                specular: new THREE.Color('grey'),
                shininess: 5
            });
        } else if (config.name === 'Jupiter') {
            const textureLoader = new THREE.TextureLoader();
            const jupiterTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/jupiter_1k.jpg');
            
            planetMaterial = new THREE.MeshPhongMaterial({
                map: jupiterTexture,
                specular: new THREE.Color('grey'),
                shininess: 5
            });
        } else {
            // Use original colored material for other planets
            planetMaterial = new THREE.MeshLambertMaterial({
                color: config.color,
                emissive: config.color,
                emissiveIntensity: 0.1
            });
        }

        const planet = new THREE.Mesh(planetGeometry, planetMaterial);
        planet.name = config.name;
        planet.userData = {
            type: 'planet',
            distance: config.distance,
            facts: config.facts,
            missions: this.missions[config.name] || [],
            rotationSpeed: config.speed,
            originalDistance: config.distance
        };

        // Position planet
        const angle = (index / 8) * Math.PI * 2;
        planet.position.x = Math.cos(angle) * config.distance;
        planet.position.z = Math.sin(angle) * config.distance;

        // Add planet glow (only for non-textured planets)
        if (!['Earth', 'Mars', 'Jupiter'].includes(config.name)) {
            const planetLight = new THREE.PointLight(config.color, 0.5, 20);
            planetLight.position.copy(planet.position);
            planet.add(planetLight);
        }

        this.scene.add(planet);
        return planet;
    }

    setupEventListeners() {
        // Mouse events
        this.renderer.domElement.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.renderer.domElement.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.renderer.domElement.addEventListener('mouseup', (e) => this.onMouseUp(e));
        this.renderer.domElement.addEventListener('click', (e) => this.onClick(e));
        this.renderer.domElement.addEventListener('wheel', (e) => this.onWheel(e));

        // Window resize
        window.addEventListener('resize', () => this.onWindowResize());

        // Info panel close button
        const closeBtn = document.getElementById('closeInfo');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeInfoPanel());
        }
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
                const newFrameRate = parseInt(btn.dataset.frames);
                this.updateFrameRate(newFrameRate);
            });
        });

        // Update UI to reflect current settings
        this.updateSettingsUI();
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

    onMouseDown(event) {
        this.controls.isDragging = true;
        this.controls.previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }

    onMouseMove(event) {
        if (this.controls.isDragging && !this.isZoomed) {
            const deltaMove = {
                x: event.clientX - this.controls.previousMousePosition.x,
                y: event.clientY - this.controls.previousMousePosition.y
            };

            this.controls.rotationY += deltaMove.x * 0.01;
            this.controls.rotationX += deltaMove.y * 0.01;

            this.controls.rotationX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.controls.rotationX));

            this.controls.previousMousePosition = {
                x: event.clientX,
                y: event.clientY
            };
        }

        // Update mouse position for raycaster
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.updateDistanceDisplay();
    }

    onMouseUp(event) {
        this.controls.isDragging = false;
    }

    onClick(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects([this.sun, ...Object.values(this.planets)]);

        if (intersects.length > 0) {
            const object = intersects[0].object;
            this.zoomToObject(object);
        }
    }

    onWheel(event) {
        if (!this.isZoomed) {
            this.controls.distance += event.deltaY * 0.01;
            this.controls.distance = Math.max(10, Math.min(100, this.controls.distance));
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    updateDistanceDisplay() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects([this.sun, ...Object.values(this.planets)]);

        if (intersects.length > 0) {
            const object = intersects[0].object;
            const distance = object.userData.distance;
            const distanceElement = document.getElementById('distanceValue');
            if (distanceElement) {
                distanceElement.textContent = `${distance.toFixed(1)} AU`;
            }
        }
    }

    zoomToObject(object) {
        if (this.isZoomed) {
            this.resetView();
            return;
        }

        this.isZoomed = true;
        this.selectedObject = object;

        // Store original camera position
        this.originalCameraPosition = this.camera.position.clone();
        this.originalCameraTarget = this.controls.target.clone();

        // Calculate zoom position
        const zoomDistance = object === this.sun ? 15 : 8;
        const targetPosition = object.position.clone();
        const direction = new THREE.Vector3().subVectors(this.camera.position, object.position).normalize();
        const newPosition = targetPosition.clone().add(direction.multiplyScalar(zoomDistance));

        // Animate camera to new position
        this.animateCamera(newPosition, targetPosition, () => {
            this.showInfoPanel(object);
        });
    }

    resetView() {
        this.isZoomed = false;
        this.selectedObject = null;
        this.closeInfoPanel();

        this.animateCamera(this.originalCameraPosition, this.originalCameraTarget, () => {
            this.controls.target.copy(this.originalCameraTarget);
        });
    }

    animateCamera(targetPosition, targetLookAt, callback) {
        const startPosition = this.camera.position.clone();
        const startLookAt = this.controls.target.clone();
        const duration = 2000; // 2 seconds
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = this.easeInOutCubic(progress);

            this.camera.position.lerpVectors(startPosition, targetPosition, easeProgress);
            this.controls.target.lerpVectors(startLookAt, targetLookAt, easeProgress);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else if (callback) {
                callback();
            }
        };

        animate();
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    async showInfoPanel(object) {
        const infoPanel = document.getElementById('infoPanel');
        const objectName = document.getElementById('objectName');
        const objectDistance = document.getElementById('objectDistance');
        const objectFacts = document.getElementById('objectFacts');
        const missionsSection = document.getElementById('missionsSection');
        const objectMissions = document.getElementById('objectMissions');

        if (infoPanel && objectName && objectDistance && objectFacts) {
            objectName.textContent = object.name;
            objectDistance.textContent = `${object.userData.distance} AU`;
            objectFacts.textContent = object.userData.facts;

            // Show missions if available
            if (object.userData.missions && object.userData.missions.length > 0) {
                missionsSection.style.display = 'block';
                objectMissions.innerHTML = '';
                object.userData.missions.forEach(mission => {
                    const li = document.createElement('li');
                    li.textContent = `${mission.name} (${mission.year})`;
                    objectMissions.appendChild(li);
                });
            } else {
                missionsSection.style.display = 'none';
            }

            infoPanel.classList.add('active');

            // Load NASA data for the selected planet
            await this.loadNASADataForPlanet(object.name);
        }
    }

    async loadNASADataForPlanet(planetName) {
        try {
            const result = await this.nasaApi.getPlanetaryData(planetName);
            if (result.success && result.data) {
                this.displayNASADataInPanel(result.data, planetName);
            }
        } catch (error) {
            console.error('Error loading NASA data for planet:', error);
        }
    }

    displayNASADataInPanel(planetData, planetName) {
        const infoPanel = document.getElementById('infoPanel');
        if (!infoPanel) return;

        // Remove existing NASA panel if any
        const existingNasaPanel = infoPanel.querySelector('.planet-nasa-panel');
        if (existingNasaPanel) {
            existingNasaPanel.remove();
        }

        // Create and add NASA data panel
        const nasaPanel = this.nasaApi.createPlanetInfoPanel(planetData, planetName);
        infoPanel.appendChild(nasaPanel);

        // Add fade-in animation
        nasaPanel.style.opacity = '0';
        setTimeout(() => {
            nasaPanel.style.opacity = '1';
        }, 100);
    }

    closeInfoPanel() {
        const infoPanel = document.getElementById('infoPanel');
        if (infoPanel) {
            infoPanel.classList.remove('active');
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
            }, 1000);
        }
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        // Frame rate control
        const currentTime = performance.now();
        if (!this.lastFrameTime) this.lastFrameTime = currentTime;
        
        const frameInterval = 1000 / this.settings.frames;
        if (currentTime - this.lastFrameTime >= frameInterval) {
            // Rotate sun
            if (this.sun) {
                this.sun.rotation.y += 0.005;
            }

            // Rotate and orbit planets
            Object.values(this.planets).forEach(planet => {
                // Rotate planet on its axis
                planet.rotation.y += planet.userData.rotationSpeed;

                // Orbit around sun
                const time = Date.now() * 0.0001;
                const distance = planet.userData.originalDistance;
                const speed = planet.userData.rotationSpeed * 10;
                
                planet.position.x = Math.cos(time * speed) * distance;
                planet.position.z = Math.sin(time * speed) * distance;

                // Update planet light position
                if (planet.children.length > 0) {
                    planet.children[0].position.copy(planet.position);
                }
            });

            // Rotate starfield
            if (this.starfieldStars) {
                this.starfieldStars.rotation.y += 0.0005;
                this.starfieldStars.rotation.x += 0.0002;
            }

            // Update camera position if not zoomed
            if (!this.isZoomed) {
                const x = Math.sin(this.controls.rotationY) * Math.cos(this.controls.rotationX) * this.controls.distance;
                const y = Math.sin(this.controls.rotationX) * this.controls.distance;
                const z = Math.cos(this.controls.rotationY) * Math.cos(this.controls.rotationX) * this.controls.distance;

                this.camera.position.set(x, y, z);
                this.camera.lookAt(this.controls.target);
            }

            this.renderer.render(this.scene, this.camera);
            this.lastFrameTime = currentTime;
        }
    }

    getPlanetData() {
        return {
            Mercury: { distance: 0.39, facts: 'Mercury is the smallest and innermost planet in the Solar System.' },
            Venus: { distance: 0.72, facts: 'Venus is the second planet from the Sun and is Earth\'s closest planetary neighbor.' },
            Earth: { distance: 1.0, facts: 'Earth is the third planet from the Sun and the only astronomical object known to harbor life.' },
            Mars: { distance: 1.52, facts: 'Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System.' },
            Jupiter: { distance: 5.20, facts: 'Jupiter is the fifth planet from the Sun and the largest in the Solar System.' },
            Saturn: { distance: 9.58, facts: 'Saturn is the sixth planet from the Sun and the second-largest in the Solar System.' },
            Uranus: { distance: 19.18, facts: 'Uranus is the seventh planet from the Sun and has the third-largest diameter in our solar system.' },
            Neptune: { distance: 30.07, facts: 'Neptune is the eighth and farthest known planet from the Sun.' }
        };
    }

    getMissionsData() {
        return {
            Mars: [
                { name: 'Perseverance', year: 2020 },
                { name: 'Curiosity', year: 2011 },
                { name: 'Opportunity', year: 2003 },
                { name: 'Spirit', year: 2003 }
            ],
            Jupiter: [
                { name: 'Juno', year: 2011 },
                { name: 'Galileo', year: 1989 },
                { name: 'Voyager 1', year: 1977 },
                { name: 'Voyager 2', year: 1977 }
            ],
            Saturn: [
                { name: 'Cassini', year: 1997 },
                { name: 'Voyager 1', year: 1977 },
                { name: 'Voyager 2', year: 1977 }
            ],
            Earth: [
                { name: 'Apollo Program', year: 1961 },
                { name: 'Space Shuttle', year: 1981 },
                { name: 'ISS', year: 1998 }
            ]
        };
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

    loadSavedSettings() {
        const savedSettings = localStorage.getItem('spaceAppSettings');
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                this.settings = { ...this.settings, ...parsed };
            } catch (error) {
                console.error('Error loading saved settings:', error);
            }
        }
    }

    updateFrameRate(newFrameRate) {
        this.settings.frames = newFrameRate;
        localStorage.setItem('spaceAppSettings', JSON.stringify(this.settings));
        console.log('Solar system frame rate updated to:', newFrameRate);
    }
}

// Initialize the solar system when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SolarSystem();
});
