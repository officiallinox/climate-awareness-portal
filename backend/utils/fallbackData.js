// Utility file to provide fallback data when database is not available

// Generate fallback articles
exports.generateFallbackArticles = () => {
    const categories = ['climate-science', 'sustainability', 'renewable-energy', 'conservation', 'policy', 'education'];
    const fallbackArticles = [];
    
    // Generate 10 sample articles
    for (let i = 1; i <= 10; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30)); // Random date within last 30 days
        
        fallbackArticles.push({
            _id: `fallback-article-${i}`,
            title: `Sample Article ${i}: Understanding ${category.replace('-', ' ')}`,
            slug: `sample-article-${i}`,
            summary: `This is a sample article about ${category.replace('-', ' ')}. It provides an overview of key concepts and recent developments.`,
            content: `<p>This is a sample article generated as fallback content when the database is not available.</p>
                     <p>In a real scenario, this would contain detailed information about ${category.replace('-', ' ')}.</p>
                     <p>The article would discuss various aspects, challenges, and solutions related to this important environmental topic.</p>`,
            category: category,
            featuredImage: `/images/default-${category}.jpg`,
            createdAt: date,
            viewCount: Math.floor(Math.random() * 500) + 50,
            readTime: Math.floor(Math.random() * 10) + 3,
            author: {
                _id: 'fallback-author',
                name: 'ClimAware Team',
                avatar: '/images/default-avatar.jpg'
            },
            createdAtFormatted: date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        });
    }
    
    return fallbackArticles;
};

// Generate fallback initiatives
exports.generateFallbackInitiatives = () => {
    const categories = ['reforestation', 'cleanup', 'education', 'renewable', 'conservation', 'recycling'];
    const cities = ['Dar es Salaam', 'Dodoma', 'Arusha', 'Mwanza', 'Zanzibar', 'Mbeya'];
    const statuses = ['upcoming', 'ongoing', 'completed'];
    const fallbackInitiatives = [];
    
    // Generate 8 sample initiatives
    for (let i = 1; i <= 8; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const city = cities[Math.floor(Math.random() * cities.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        // Generate a date in the future for upcoming, past for completed
        const date = new Date();
        if (status === 'upcoming') {
            date.setDate(date.getDate() + Math.floor(Math.random() * 30) + 1);
        } else if (status === 'completed') {
            date.setDate(date.getDate() - Math.floor(Math.random() * 30) - 1);
        }
        
        fallbackInitiatives.push({
            _id: `fallback-initiative-${i}`,
            title: `${category.charAt(0).toUpperCase() + category.slice(1)} Initiative in ${city}`,
            description: `This is a sample ${category} initiative in ${city}. Join us to make a difference in our community and environment.`,
            category: category,
            status: status,
            date: date,
            time: `${Math.floor(Math.random() * 12) + 1}:00 ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
            location: {
                city: city,
                country: 'Tanzania'
            },
            organizer: {
                _id: 'fallback-organizer',
                name: 'ClimAware Organization',
                email: 'contact@climaware.org'
            },
            participants: Array.from({ length: Math.floor(Math.random() * 20) + 5 }, (_, j) => ({
                user: {
                    _id: `participant-${j}`,
                    name: `Participant ${j + 1}`
                },
                joinedAt: new Date(date.getTime() - Math.random() * 1000000000),
                status: 'joined'
            })),
            maxParticipants: 50,
            requirements: ['Bring water', 'Wear comfortable clothes', 'Positive attitude'],
            materials: ['Will be provided at the venue'],
            impact: {
                expectedCO2Reduction: Math.floor(Math.random() * 1000),
                expectedTreesPlanted: Math.floor(Math.random() * 100),
                expectedWasteCollected: Math.floor(Math.random() * 500)
            },
            isActive: true,
            featured: i <= 3 // First 3 are featured
        });
    }
    
    return fallbackInitiatives;
};