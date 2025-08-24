// NASA API Integration for Space-O-Sphere
// API Key: vaOVMR9qEKwuomJVQgyg24TZhetg9dkHF2T97d3a

class NASAApi {
    constructor() {
        this.apiKey = 'vaOVMR9qEKwuomJVQgyg24TZhetg9dkHF2T97d3a';
        this.baseUrl = 'https://api.nasa.gov';
    }

    // Fetch Astronomy Picture of the Day
    async getAPOD(date = null) {
        try {
            let url = `${this.baseUrl}/planetary/apod?api_key=${this.apiKey}`;
            if (date) {
                url += `&date=${date}`;
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            console.error('Error fetching APOD:', error);
            return {
                success: false,
                error: error.message,
                data: null
            };
        }
    }

    // Fetch Mars Rover Photos
    async getMarsRoverPhotos(rover = 'curiosity', sol = 1000, limit = 6) {
        try {
            const url = `${this.baseUrl}/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&api_key=${this.apiKey}`;
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Limit the number of photos
            const limitedPhotos = data.photos ? data.photos.slice(0, limit) : [];
            
            return {
                success: true,
                data: {
                    photos: limitedPhotos,
                    total: data.photos ? data.photos.length : 0
                }
            };
        } catch (error) {
            console.error('Error fetching Mars rover photos:', error);
            return {
                success: false,
                error: error.message,
                data: { photos: [], total: 0 }
            };
        }
    }

    // Fetch Planetary Data (for solar system info panels)
    async getPlanetaryData(planet) {
        try {
            // For now, we'll use a combination of APOD and some static data
            // In the future, you could integrate with other NASA APIs
            const apodResult = await this.getAPOD();
            
            // Get some Mars-specific data if requested
            let marsData = null;
            if (planet.toLowerCase() === 'mars') {
                const marsResult = await this.getMarsRoverPhotos('curiosity', 1000, 3);
                if (marsResult.success) {
                    marsData = marsResult.data;
                }
            }

            return {
                success: true,
                data: {
                    apod: apodResult.success ? apodResult.data : null,
                    marsPhotos: marsData,
                    planet: planet
                }
            };
        } catch (error) {
            console.error('Error fetching planetary data:', error);
            return {
                success: false,
                error: error.message,
                data: null
            };
        }
    }

    // Get latest Mars rover photos for homepage gallery
    async getLatestMarsPhotos(limit = 6) {
        try {
            // Try to get photos from the most recent sol available
            const url = `${this.baseUrl}/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=${this.apiKey}`;
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Limit and shuffle the photos for variety
            const shuffledPhotos = data.photos ? this.shuffleArray(data.photos).slice(0, limit) : [];
            
            return {
                success: true,
                data: shuffledPhotos
            };
        } catch (error) {
            console.error('Error fetching latest Mars photos:', error);
            return {
                success: false,
                error: error.message,
                data: []
            };
        }
    }

    // Utility function to shuffle array
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Create APOD background element
    createAPODBackground(apodData) {
        const container = document.createElement('div');
        container.className = 'apod-background';
        
        if (apodData.media_type === 'image') {
            container.style.backgroundImage = `url(${apodData.url})`;
            container.style.backgroundSize = 'cover';
            container.style.backgroundPosition = 'center';
            container.style.backgroundAttachment = 'fixed';
        } else if (apodData.media_type === 'video') {
            // For videos, we'll create an iframe
            const iframe = document.createElement('iframe');
            iframe.src = apodData.url;
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            iframe.style.position = 'absolute';
            iframe.style.top = '0';
            iframe.style.left = '0';
            iframe.style.zIndex = '-1';
            container.appendChild(iframe);
        }

        return container;
    }

    // Create APOD info panel
    createAPODInfoPanel(apodData) {
        const panel = document.createElement('div');
        panel.className = 'apod-info-panel';
        
        panel.innerHTML = `
            <div class="apod-header">
                <h3>NASA Astronomy Picture of the Day</h3>
                <span class="apod-date">${apodData.date}</span>
            </div>
            <div class="apod-content">
                <h4>${apodData.title}</h4>
                <p>${apodData.explanation}</p>
                ${apodData.copyright ? `<p class="apod-copyright">© ${apodData.copyright}</p>` : ''}
            </div>
        `;

        return panel;
    }

    // Create Mars photos gallery
    createMarsGallery(photos) {
        const gallery = document.createElement('div');
        gallery.className = 'mars-gallery';
        
        gallery.innerHTML = `
            <h3>Latest Mars Rover Photos</h3>
            <div class="mars-photos-grid">
                ${photos.map(photo => `
                    <div class="mars-photo-item" data-photo-url="${photo.img_src}">
                        <img src="${photo.img_src}" alt="Mars Rover Photo" loading="lazy">
                        <div class="photo-overlay">
                            <span class="photo-date">Sol ${photo.sol}</span>
                            <span class="photo-camera">${photo.camera.name}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        return gallery;
    }

    // Create planet info panel with NASA data
    createPlanetInfoPanel(planetData, planetName) {
        const panel = document.createElement('div');
        panel.className = 'planet-nasa-panel';
        
        let content = `
            <div class="planet-nasa-header">
                <h3>NASA Data for ${planetName}</h3>
            </div>
            <div class="planet-nasa-content">
        `;

        // Add APOD if available
        if (planetData.apod) {
            content += `
                <div class="planet-apod-section">
                    <h4>Today's Astronomy Picture</h4>
                    <div class="planet-apod-preview">
                        <img src="${planetData.apod.url}" alt="${planetData.apod.title}" loading="lazy">
                        <div class="apod-preview-info">
                            <h5>${planetData.apod.title}</h5>
                            <p>${planetData.apod.explanation.substring(0, 150)}...</p>
                        </div>
                    </div>
                </div>
            `;
        }

        // Add Mars-specific data
        if (planetName.toLowerCase() === 'mars' && planetData.marsPhotos && planetData.marsPhotos.photos.length > 0) {
            content += `
                <div class="planet-mars-section">
                    <h4>Latest Mars Rover Images</h4>
                    <div class="planet-mars-photos">
                        ${planetData.marsPhotos.photos.map(photo => `
                            <div class="planet-mars-photo">
                                <img src="${photo.img_src}" alt="Mars Rover Photo" loading="lazy">
                                <span class="photo-sol">Sol ${photo.sol}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        content += `
            </div>
        `;

        panel.innerHTML = content;
        return panel;
    }
}

// Export for use in other files
window.NASAApi = NASAApi;
