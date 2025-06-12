/**
 * Initiative Card Component
 * 
 * This component renders an initiative card with image, title, description, and metadata.
 * It can be used in initiative listings, featured sections, and related initiatives.
 * 
 * Usage:
 * <div id="initiatives-container"></div>
 * <script>
 *   const initiativesContainer = document.getElementById('initiatives-container');
 *   fetchInitiatives().then(initiatives => {
 *     initiatives.forEach(initiative => {
 *       initiativesContainer.appendChild(createInitiativeCard(initiative));
 *     });
 *   });
 * </script>
 */

/**
 * Creates an initiative card element
 * @param {Object} initiative - The initiative data
 * @param {string} size - The size of the card: 'small', 'medium', or 'large'
 * @returns {HTMLElement} The initiative card element
 */
function createInitiativeCard(initiative, size = 'medium') {
    // Create card container
    const card = document.createElement('div');
    card.className = `initiative-card initiative-card-${size}`;
    card.setAttribute('data-initiative-id', initiative._id);
    
    // Create card content
    let categoryLabel = '';
    switch(initiative.category) {
        case 'reforestation':
            categoryLabel = 'Reforestation';
            break;
        case 'cleanup':
            categoryLabel = 'Cleanup';
            break;
        case 'education':
            categoryLabel = 'Education';
            break;
        case 'renewable':
            categoryLabel = 'Renewable Energy';
            break;
        case 'conservation':
            categoryLabel = 'Conservation';
            break;
        case 'recycling':
            categoryLabel = 'Recycling';
            break;
        default:
            categoryLabel = initiative.category;
    }
    
    // Status badge
    let statusBadge = '';
    switch(initiative.status) {
        case 'upcoming':
            statusBadge = '<span class="status-badge status-upcoming">Upcoming</span>';
            break;
        case 'ongoing':
            statusBadge = '<span class="status-badge status-ongoing">Ongoing</span>';
            break;
        case 'completed':
            statusBadge = '<span class="status-badge status-completed">Completed</span>';
            break;
        case 'cancelled':
            statusBadge = '<span class="status-badge status-cancelled">Cancelled</span>';
            break;
    }
    
    // Format date
    const eventDate = new Date(initiative.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Location info
    const location = initiative.location ? 
        `${initiative.location.city}, ${initiative.location.country}` : 
        'Location not specified';
    
    // Organizer info
    const organizerName = initiative.organizer ? 
        (initiative.organizer.name || 'Unknown Organizer') : 
        'Unknown Organizer';
    
    // Default image if none provided
    const featuredImage = initiative.images && initiative.images.length > 0 ? 
        initiative.images[0] : 
        '/images/default-initiative.jpg';
    
    // Participation info
    const participantCount = initiative.participantCount || 0;
    const maxParticipants = initiative.maxParticipants || 'Unlimited';
    const availableSpots = initiative.availableSpots !== undefined ? 
        initiative.availableSpots : 
        (maxParticipants === 'Unlimited' ? 'Unlimited' : maxParticipants - participantCount);
    
    // Progress bar for participation (only for medium and large cards)
    let progressBar = '';
    if (size !== 'small' && maxParticipants !== 'Unlimited' && maxParticipants > 0) {
        const progressPercentage = Math.min(100, Math.round((participantCount / maxParticipants) * 100));
        progressBar = `
            <div class="participation-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                </div>
                <div class="progress-text">
                    ${participantCount}/${maxParticipants} participants
                </div>
            </div>
        `;
    }
    
    // HTML structure based on size
    if (size === 'large') {
        card.innerHTML = `
            <div class="initiative-card-image">
                <img src="${featuredImage}" alt="${initiative.title}" loading="lazy">
                <div class="initiative-card-category">${categoryLabel}</div>
                ${statusBadge}
            </div>
            <div class="initiative-card-content">
                <h2 class="initiative-card-title">
                    <a href="/initiative/${initiative._id}">${initiative.title}</a>
                </h2>
                <div class="initiative-card-meta">
                    <div class="initiative-card-date">
                        <i class="fas fa-calendar"></i> ${eventDate} at ${initiative.time}
                    </div>
                    <div class="initiative-card-location">
                        <i class="fas fa-map-marker-alt"></i> ${location}
                    </div>
                    <div class="initiative-card-organizer">
                        <i class="fas fa-user"></i> Organized by ${organizerName}
                    </div>
                </div>
                <p class="initiative-card-description">${initiative.description}</p>
                ${progressBar}
                <div class="initiative-card-actions">
                    <a href="/initiative/${initiative._id}" class="btn btn-primary">View Details</a>
                    ${initiative.status === 'upcoming' && !initiative.isFull ? 
                        `<button class="btn btn-secondary join-initiative-btn" data-initiative-id="${initiative._id}">Join Initiative</button>` : 
                        ''}
                </div>
            </div>
        `;
    } else if (size === 'medium') {
        card.innerHTML = `
            <div class="initiative-card-image">
                <img src="${featuredImage}" alt="${initiative.title}" loading="lazy">
                <div class="initiative-card-category">${categoryLabel}</div>
                ${statusBadge}
            </div>
            <div class="initiative-card-content">
                <h3 class="initiative-card-title">
                    <a href="/initiative/${initiative._id}">${initiative.title}</a>
                </h3>
                <div class="initiative-card-meta">
                    <div class="initiative-card-date">
                        <i class="fas fa-calendar"></i> ${eventDate}
                    </div>
                    <div class="initiative-card-location">
                        <i class="fas fa-map-marker-alt"></i> ${location}
                    </div>
                </div>
                <p class="initiative-card-description">${initiative.description.substring(0, 120)}${initiative.description.length > 120 ? '...' : ''}</p>
                ${progressBar}
                <a href="/initiative/${initiative._id}" class="initiative-card-link">View Details</a>
            </div>
        `;
    } else if (size === 'small') {
        card.innerHTML = `
            <div class="initiative-card-image">
                <img src="${featuredImage}" alt="${initiative.title}" loading="lazy">
                ${statusBadge}
            </div>
            <div class="initiative-card-content">
                <div class="initiative-card-category">${categoryLabel}</div>
                <h4 class="initiative-card-title">
                    <a href="/initiative/${initiative._id}">${initiative.title}</a>
                </h4>
                <div class="initiative-card-meta">
                    <div class="initiative-card-date">
                        <i class="fas fa-calendar"></i> ${eventDate}
                    </div>
                </div>
            </div>
        `;
    }
    
    // Add click event to navigate to initiative
    card.addEventListener('click', (e) => {
        // Only navigate if the click wasn't on a button or link
        if (!e.target.closest('a') && !e.target.closest('button')) {
            window.location.href = `/initiative/${initiative._id}`;
        }
    });
    
    // Add join button functionality
    const joinButton = card.querySelector('.join-initiative-btn');
    if (joinButton) {
        joinButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card click
            joinInitiative(initiative._id);
        });
    }
    
    return card;
}

/**
 * Creates a grid of initiative cards
 * @param {Array} initiatives - Array of initiative data
 * @param {string} size - The size of the cards: 'small', 'medium', or 'large'
 * @returns {HTMLElement} A container with initiative cards
 */
function createInitiativeGrid(initiatives, size = 'medium') {
    const grid = document.createElement('div');
    grid.className = `initiative-grid initiative-grid-${size}`;
    
    initiatives.forEach(initiative => {
        grid.appendChild(createInitiativeCard(initiative, size));
    });
    
    return grid;
}

/**
 * Creates a featured initiatives section
 * @param {Array} initiatives - Array of featured initiative data
 * @returns {HTMLElement} A container with featured initiatives
 */
function createFeaturedInitiatives(initiatives) {
    if (!initiatives || initiatives.length === 0) {
        return document.createElement('div');
    }
    
    const container = document.createElement('div');
    container.className = 'featured-initiatives';
    
    // Main featured initiative
    const mainInitiative = initiatives[0];
    const mainFeature = createInitiativeCard(mainInitiative, 'large');
    mainFeature.className += ' featured-main';
    
    // Secondary featured initiatives
    const secondaryContainer = document.createElement('div');
    secondaryContainer.className = 'featured-secondary';
    
    const secondaryInitiatives = initiatives.slice(1, 5);
    secondaryInitiatives.forEach(initiative => {
        secondaryContainer.appendChild(createInitiativeCard(initiative, 'small'));
    });
    
    container.appendChild(mainFeature);
    container.appendChild(secondaryContainer);
    
    return container;
}

/**
 * Fetches initiatives from the API
 * @param {Object} options - Fetch options (page, limit, category, status, etc.)
 * @returns {Promise<Array>} Promise resolving to array of initiatives
 */
async function fetchInitiatives(options = {}) {
    try {
        // Build query string from options
        const queryParams = new URLSearchParams();
        
        if (options.page) queryParams.append('page', options.page);
        if (options.limit) queryParams.append('limit', options.limit);
        if (options.category) queryParams.append('category', options.category);
        if (options.status) queryParams.append('status', options.status);
        if (options.search) queryParams.append('search', options.search);
        if (options.sort) queryParams.append('sort', options.sort);
        if (options.featured) queryParams.append('featured', options.featured);
        if (options.location) queryParams.append('location', options.location);
        
        const queryString = queryParams.toString();
        const url = `/api/initiatives${queryString ? `?${queryString}` : ''}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch initiatives: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        return data.initiatives || data; // Handle both paginated and non-paginated responses
    } catch (error) {
        console.error('Error fetching initiatives:', error);
        return [];
    }
}

/**
 * Fetches a single initiative by ID
 * @param {string} id - The initiative ID
 * @returns {Promise<Object>} Promise resolving to initiative data
 */
async function fetchInitiativeById(id) {
    try {
        const response = await fetch(`/api/initiatives/${id}`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch initiative: ${response.status} ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error fetching initiative with ID ${id}:`, error);
        return null;
    }
}

/**
 * Fetches featured initiatives
 * @returns {Promise<Array>} Promise resolving to array of featured initiatives
 */
async function fetchFeaturedInitiatives() {
    try {
        const response = await fetch('/api/initiatives/featured');
        
        if (!response.ok) {
            throw new Error(`Failed to fetch featured initiatives: ${response.status} ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching featured initiatives:', error);
        return [];
    }
}

/**
 * Fetches upcoming initiatives
 * @param {number} limit - Number of initiatives to fetch
 * @returns {Promise<Array>} Promise resolving to array of upcoming initiatives
 */
async function fetchUpcomingInitiatives(limit = 5) {
    try {
        const response = await fetch(`/api/initiatives/upcoming?limit=${limit}`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch upcoming initiatives: ${response.status} ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching upcoming initiatives:', error);
        return [];
    }
}

/**
 * Joins an initiative
 * @param {string} initiativeId - The initiative ID to join
 * @returns {Promise<Object>} Promise resolving to join result
 */
async function joinInitiative(initiativeId) {
    try {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in to join this initiative');
            window.location.href = '/login_new.html';
            return;
        }
        
        const response = await fetch(`/api/initiatives/${initiativeId}/join`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to join initiative: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // Show success message
        alert(result.message || 'Successfully joined the initiative!');
        
        // Reload the page to reflect changes
        window.location.reload();
        
        return result;
    } catch (error) {
        console.error(`Error joining initiative ${initiativeId}:`, error);
        alert(error.message || 'Failed to join initiative. Please try again later.');
        return null;
    }
}

// Export functions for use in other scripts
window.InitiativeComponents = {
    createInitiativeCard,
    createInitiativeGrid,
    createFeaturedInitiatives,
    fetchInitiatives,
    fetchInitiativeById,
    fetchFeaturedInitiatives,
    fetchUpcomingInitiatives,
    joinInitiative
};