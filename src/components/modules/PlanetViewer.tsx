import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { planets } from '../../data/planets';
import { RotateCcw, ZoomIn, ZoomOut, Info, Play, Pause } from 'lucide-react';

const PlanetViewer = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const planetMeshRef = useRef<THREE.Mesh | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const controlsRef = useRef<any>(null);
  
  const [selectedPlanet, setSelectedPlanet] = useState(planets[2]); // Start with Earth
  const [showInfo, setShowInfo] = useState(false);
  const [isRotating, setIsRotating] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000011);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 3);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Enhanced lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Add point light for better illumination
    const pointLight = new THREE.PointLight(0xffffff, 0.8, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Mouse controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (event: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging || !planetMeshRef.current) return;

      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y
      };

      planetMeshRef.current.rotation.y += deltaMove.x * 0.01;
      planetMeshRef.current.rotation.x += deltaMove.y * 0.01;

      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (!cameraRef.current) return;

      const zoomSpeed = 0.1;
      const newZ = cameraRef.current.position.z + (event.deltaY > 0 ? zoomSpeed : -zoomSpeed);
      cameraRef.current.position.z = Math.max(1.5, Math.min(10, newZ));
    };

    // Add event listeners
    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('wheel', handleWheel);
    renderer.domElement.style.cursor = 'grab';

    // Create planet
    createPlanet();

    // Stars background
    createStarField();

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      if (planetMeshRef.current && isRotating && !isDragging) {
        planetMeshRef.current.rotation.y += 0.005;
      }
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('mouseup', handleMouseUp);
      renderer.domElement.removeEventListener('wheel', handleWheel);
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isRotating]);

  useEffect(() => {
    createPlanet();
  }, [selectedPlanet]);

  const createPlanet = () => {
    if (!sceneRef.current) return;

    setIsLoading(true);

    // Remove existing planet
    if (planetMeshRef.current) {
      sceneRef.current.remove(planetMeshRef.current);
    }

    // Planet geometry
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    
    // Load texture
    const textureLoader = new THREE.TextureLoader();
    
    textureLoader.load(
      selectedPlanet.texture || selectedPlanet.image,
      (texture) => {
        // Configure texture
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

        // Create material with texture
        const material = new THREE.MeshPhongMaterial({
          map: texture,
          shininess: selectedPlanet.type === 'gas giant' ? 100 : 30,
          transparent: false,
        });

        // Create planet mesh
        const planet = new THREE.Mesh(geometry, material);
        planet.castShadow = true;
        planet.receiveShadow = true;
        
        // Scale planet based on relative size
        const scale = Math.max(0.5, Math.min(2, selectedPlanet.diameter / 12756));
        planet.scale.setScalar(scale);
        
        sceneRef.current!.add(planet);
        planetMeshRef.current = planet;
        setIsLoading(false);
      },
      (progress) => {
        // Loading progress
        console.log('Loading progress:', (progress.loaded / progress.total) * 100 + '%');
      },
      (error) => {
        console.error('Error loading texture:', error);
        // Fallback to colored material
        const material = new THREE.MeshPhongMaterial({
          color: selectedPlanet.color,
          shininess: selectedPlanet.type === 'gas giant' ? 100 : 30,
        });

        const planet = new THREE.Mesh(geometry, material);
        planet.castShadow = true;
        planet.receiveShadow = true;
        
        const scale = Math.max(0.5, Math.min(2, selectedPlanet.diameter / 12756));
        planet.scale.setScalar(scale);
        
        sceneRef.current!.add(planet);
        planetMeshRef.current = planet;
        setIsLoading(false);
      }
    );
  };

  const createStarField = () => {
    if (!sceneRef.current) return;

    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({ 
      color: 0xffffff, 
      size: 1,
      sizeAttenuation: false
    });

    const starsVertices = [];
    const colors = [];
    const starColors = [
      new THREE.Color(0xff6b35), // Orange
      new THREE.Color(0xff006e), // Pink
      new THREE.Color(0x8338ec), // Purple
      new THREE.Color(0x3a86ff), // Blue
      new THREE.Color(0xffbe0b), // Yellow
      new THREE.Color(0x06ffa5), // Green
      new THREE.Color(0xffffff), // White
    ];

    for (let i = 0; i < 15000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starsVertices.push(x, y, z);

      // Random color for each star
      const color = starColors[Math.floor(Math.random() * starColors.length)];
      colors.push(color.r, color.g, color.b);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    starsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    starsMaterial.vertexColors = true;
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    sceneRef.current.add(starField);
  };

  const handleZoomIn = () => {
    if (cameraRef.current) {
      cameraRef.current.position.z = Math.max(1.5, cameraRef.current.position.z - 0.5);
    }
  };

  const handleZoomOut = () => {
    if (cameraRef.current) {
      cameraRef.current.position.z = Math.min(10, cameraRef.current.position.z + 0.5);
    }
  };

  const resetView = () => {
    if (cameraRef.current && planetMeshRef.current) {
      cameraRef.current.position.set(0, 0, 3);
      planetMeshRef.current.rotation.set(0, 0, 0);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            3D Planet Viewer
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore interactive 3D models with real NASA imagery of planets in our solar system
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Planet Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Select Planet</h3>
              <div className="space-y-2">
                {planets.map((planet) => (
                  <button
                    key={planet.id}
                    onClick={() => setSelectedPlanet(planet)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
                      selectedPlanet.id === planet.id
                        ? 'bg-orange-500/20 border border-orange-400/30 text-orange-400'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={planet.image}
                        alt={planet.name}
                        className="w-8 h-8 rounded-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling!.classList.remove('hidden');
                        }}
                      />
                      <div
                        className="w-8 h-8 rounded-full hidden"
                        style={{ backgroundColor: planet.color }}
                      />
                      <span>{planet.name}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Controls */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <h4 className="text-lg font-medium text-white mb-4">Controls</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleZoomIn}
                    className="p-2 bg-white/10 rounded-lg hover:bg-orange-500/20 transition-colors text-white"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleZoomOut}
                    className="p-2 bg-white/10 rounded-lg hover:bg-orange-500/20 transition-colors text-white"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    onClick={resetView}
                    className="p-2 bg-white/10 rounded-lg hover:bg-orange-500/20 transition-colors text-white"
                    title="Reset View"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowInfo(!showInfo)}
                    className="p-2 bg-white/10 rounded-lg hover:bg-orange-500/20 transition-colors text-white"
                    title="Toggle Info"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="mt-4 space-y-3">
                  <label className="flex items-center space-x-2 text-white">
                    <input
                      type="checkbox"
                      checked={isRotating}
                      onChange={(e) => setIsRotating(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Auto Rotate</span>
                  </label>
                  
                  <div className="text-xs text-gray-400">
                    <p>• Click and drag to rotate</p>
                    <p>• Scroll to zoom in/out</p>
                    <p>• Use controls for precision</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3D Viewer */}
          <div className="lg:col-span-3">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden relative">
              {isLoading && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white">Loading {selectedPlanet.name}...</p>
                  </div>
                </div>
              )}
              
              <div
                ref={mountRef}
                className="w-full h-[600px] relative"
                style={{ cursor: 'grab' }}
              />
              
              {/* Planet Info Overlay */}
              {showInfo && (
                <div className="absolute top-4 left-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-4 text-white">
                  <h3 className="text-2xl font-bold mb-2 text-orange-400">{selectedPlanet.name}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Distance:</span>
                      <p>{selectedPlanet.distanceFromSun} AU</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Diameter:</span>
                      <p>{selectedPlanet.diameter.toLocaleString()} km</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Gravity:</span>
                      <p>{selectedPlanet.gravity}x Earth</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Moons:</span>
                      <p>{selectedPlanet.moons}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Rotation indicator */}
              <div className="absolute bottom-4 right-4">
                <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                  isRotating ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {isRotating ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  <span className="text-sm">{isRotating ? 'Auto Rotating' : 'Manual Control'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Planet Details */}
        <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <h3 className="text-2xl font-bold text-white mb-6">{selectedPlanet.name} Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-orange-400 mb-2">Physical Properties</h4>
              <ul className="space-y-1 text-gray-300">
                <li><span className="text-gray-400">Type:</span> {selectedPlanet.type}</li>
                <li><span className="text-gray-400">Diameter:</span> {selectedPlanet.diameter.toLocaleString()} km</li>
                <li><span className="text-gray-400">Mass:</span> {selectedPlanet.mass} Earth masses</li>
                <li><span className="text-gray-400">Gravity:</span> {selectedPlanet.gravity}x Earth</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-pink-400 mb-2">Orbital Properties</h4>
              <ul className="space-y-1 text-gray-300">
                <li><span className="text-gray-400">Distance:</span> {selectedPlanet.distanceFromSun} AU</li>
                <li><span className="text-gray-400">Day Length:</span> {selectedPlanet.dayLength} hours</li>
                <li><span className="text-gray-400">Year Length:</span> {selectedPlanet.yearLength} days</li>
                <li><span className="text-gray-400">Moons:</span> {selectedPlanet.moons}</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-purple-400 mb-2">Environment</h4>
              <ul className="space-y-1 text-gray-300">
                <li><span className="text-gray-400">Avg Temp:</span> {selectedPlanet.temperature.average}°C</li>
                <li><span className="text-gray-400">Atmosphere:</span> {selectedPlanet.atmosphere.composition[0]}</li>
                <li><span className="text-gray-400">Pressure:</span> {selectedPlanet.atmosphere.pressure}x Earth</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-blue-400 mb-3">Fun Facts</h4>
            <ul className="space-y-2">
              {selectedPlanet.funFacts.map((fact, index) => (
                <li key={index} className="text-gray-300 flex items-start">
                  <span className="text-orange-400 mr-2">•</span>
                  {fact}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanetViewer;