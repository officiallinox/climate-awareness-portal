const mongoose = require('mongoose');
const Initiative = require('./models/Initiative');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/climaware', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const sampleInitiatives = [
    {
        title: "Kilimanjaro Forest Restoration Project",
        description: "Join us in restoring the indigenous forests around Mount Kilimanjaro. We'll be planting native species like African olive and camphor trees to help restore the ecosystem and support local communities. All tools and seedlings provided. Help us preserve Tanzania's natural heritage!",
        category: "reforestation",
        status: "upcoming",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        time: "07:00 AM",
        location: {
            address: "Kilimanjaro National Park, Machame Gate",
            city: "Moshi",
            region: "Kilimanjaro",
            country: "Tanzania",
            coordinates: { lat: -3.0674, lng: 37.3556 }
        },
        maxParticipants: 100,
        requirements: ["Hiking boots", "Water bottle", "Hat and sunscreen", "Long pants"],
        materials: ["Shovels", "Native tree seedlings", "Organic fertilizer", "Watering equipment"],
        impact: {
            expectedTreesPlanted: 500,
            expectedCO2Reduction: 1250,
            localBenefits: "Watershed protection, soil conservation"
        },
        contactInfo: {
            email: "kilimanjaro@climaware.tz",
            phone: "+255-27-275-0123"
        },
        featured: true
    },
    {
        title: "Dar es Salaam Mangrove Restoration",
        description: "Help us restore the vital mangrove ecosystems along Dar es Salaam's coastline. We'll be planting mangrove seedlings and cleaning up plastic waste that threatens marine life. This project directly protects our coast from rising sea levels while supporting local fishing communities.",
        category: "coastal-restoration",
        status: "upcoming",
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
        time: "06:30 AM",
        location: {
            address: "Msimbazi Creek, Mangrove Boardwalk",
            city: "Dar es Salaam",
            region: "Dar es Salaam",
            country: "Tanzania",
            coordinates: { lat: 34.0522, lng: -118.2437 }
        },
        maxParticipants: 100,
        requirements: ["Sunscreen", "Reusable water bottle", "Comfortable walking shoes"],
        materials: ["Trash bags", "Gloves", "Pickup tools", "Data collection sheets"],
        impact: {
            expectedWasteCollected: 500,
            expectedCO2Reduction: 100
        },
        contactInfo: {
            email: "cleanup@climaware.org",
            phone: "+1-555-0124"
        },
        featured: true
    },
    {
        title: "Solar Panel Installation Workshop",
        description: "Learn how to install solar panels and help a local community center go green. This hands-on workshop will teach you valuable skills while making a real difference. Perfect for beginners and experienced volunteers alike.",
        category: "renewable",
        status: "upcoming",
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 3 weeks from now
        time: "10:00 AM",
        location: {
            address: "Community Center, 123 Green St",
            city: "Austin",
            state: "TX",
            country: "USA",
            coordinates: { lat: 30.2672, lng: -97.7431 }
        },
        maxParticipants: 25,
        requirements: ["Safety boots", "Work gloves", "Basic tool knowledge helpful"],
        materials: ["Solar panels", "Mounting equipment", "Safety gear", "Tools"],
        impact: {
            expectedCO2Reduction: 2000
        },
        contactInfo: {
            email: "solar@climaware.org",
            phone: "+1-555-0125"
        }
    },
    {
        title: "Urban Garden Creation",
        description: "Transform an empty lot into a thriving community garden. We'll be building raised beds, setting up irrigation, and planting vegetables that will feed local families. A perfect project for those who love gardening and community building.",
        category: "conservation",
        status: "ongoing",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Started 1 week ago
        time: "09:00 AM",
        location: {
            address: "Empty Lot, 456 Community Ave",
            city: "Portland",
            state: "OR",
            country: "USA",
            coordinates: { lat: 45.5152, lng: -122.6784 }
        },
        maxParticipants: 50,
        requirements: ["Gardening clothes", "Water bottle", "Enthusiasm for gardening"],
        materials: ["Seeds", "Soil", "Garden tools", "Irrigation supplies"],
        impact: {
            expectedCO2Reduction: 300,
            expectedTreesPlanted: 0
        },
        contactInfo: {
            email: "garden@climaware.org",
            phone: "+1-555-0126"
        }
    },
    {
        title: "Climate Education Workshop",
        description: "Interactive workshop for high school students about climate science and environmental solutions. Help us educate the next generation of climate leaders through engaging presentations, experiments, and discussions.",
        category: "education",
        status: "upcoming",
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        time: "02:00 PM",
        location: {
            address: "Lincoln High School, Room 201",
            city: "Seattle",
            state: "WA",
            country: "USA",
            coordinates: { lat: 47.6062, lng: -122.3321 }
        },
        maxParticipants: 30,
        requirements: ["Teaching or presentation experience preferred", "Passion for education"],
        materials: ["Presentation materials", "Science experiment kits", "Educational handouts"],
        impact: {
            expectedCO2Reduction: 50
        },
        contactInfo: {
            email: "education@climaware.org",
            phone: "+1-555-0127"
        }
    },
    {
        title: "Recycling Drive & Sorting Event",
        description: "Massive community recycling event where we'll collect, sort, and properly dispose of electronic waste, plastics, and other recyclables. Learn about proper recycling techniques while making a huge environmental impact.",
        category: "recycling",
        status: "upcoming",
        date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), // 4 weeks from now
        time: "08:00 AM",
        location: {
            address: "City Recycling Center",
            city: "Denver",
            state: "CO",
            country: "USA",
            coordinates: { lat: 39.7392, lng: -104.9903 }
        },
        maxParticipants: 75,
        requirements: ["Work gloves", "Comfortable clothes", "Willingness to get hands dirty"],
        materials: ["Sorting bins", "Safety equipment", "Transportation trucks"],
        impact: {
            expectedWasteCollected: 1000,
            expectedCO2Reduction: 200
        },
        contactInfo: {
            email: "recycle@climaware.org",
            phone: "+1-555-0128"
        }
    },
    {
        title: "River Restoration Project",
        description: "Help restore the natural habitat along Miller Creek by removing invasive species, planting native vegetation, and installing erosion control measures. This long-term project will have lasting environmental benefits.",
        category: "conservation",
        status: "ongoing",
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // Started 2 weeks ago
        time: "08:30 AM",
        location: {
            address: "Miller Creek Trail Head",
            city: "Minneapolis",
            state: "MN",
            country: "USA",
            coordinates: { lat: 44.9778, lng: -93.2650 }
        },
        maxParticipants: 40,
        requirements: ["Waterproof boots", "Work clothes", "Physical fitness for outdoor work"],
        materials: ["Native plants", "Erosion control materials", "Hand tools"],
        impact: {
            expectedTreesPlanted: 100,
            expectedCO2Reduction: 400
        },
        contactInfo: {
            email: "restoration@climaware.org",
            phone: "+1-555-0129"
        }
    },
    {
        title: "Green Roof Installation",
        description: "Install a green roof on a local apartment building to improve insulation, reduce stormwater runoff, and create habitat for urban wildlife. This technical project offers hands-on experience with sustainable building practices.",
        category: "renewable",
        status: "upcoming",
        date: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000), // 5 weeks from now
        time: "07:00 AM",
        location: {
            address: "Eco Apartments, 789 Sustainable St",
            city: "San Francisco",
            state: "CA",
            country: "USA",
            coordinates: { lat: 37.7749, lng: -122.4194 }
        },
        maxParticipants: 20,
        requirements: ["Construction experience helpful", "Not afraid of heights", "Safety certification preferred"],
        materials: ["Roofing materials", "Plants", "Soil", "Safety equipment"],
        impact: {
            expectedCO2Reduction: 800,
            expectedTreesPlanted: 50
        },
        contactInfo: {
            email: "greenroof@climaware.org",
            phone: "+1-555-0130"
        }
    },
    {
        title: "Composting Workshop Series",
        description: "Three-part workshop series teaching community members how to compost at home and in community spaces. Reduce waste, create nutrient-rich soil, and learn sustainable living practices.",
        category: "education",
        status: "upcoming",
        date: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000), // 6 weeks from now
        time: "11:00 AM",
        location: {
            address: "Community Garden Center",
            city: "Nashville",
            state: "TN",
            country: "USA",
            coordinates: { lat: 36.1627, lng: -86.7816 }
        },
        maxParticipants: 35,
        requirements: ["Interest in sustainable living", "Notebook for taking notes"],
        materials: ["Compost bins", "Educational materials", "Sample compost"],
        impact: {
            expectedWasteCollected: 200,
            expectedCO2Reduction: 150
        },
        contactInfo: {
            email: "compost@climaware.org",
            phone: "+1-555-0131"
        }
    },
    {
        title: "Pollinator Garden Establishment",
        description: "Create a beautiful pollinator garden to support local bee and butterfly populations. We'll plant native flowers, install bee houses, and create educational signage about the importance of pollinators.",
        category: "reforestation",
        status: "completed",
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Completed 1 month ago
        time: "09:00 AM",
        location: {
            address: "City Park, Meadow Section",
            city: "Boulder",
            state: "CO",
            country: "USA",
            coordinates: { lat: 40.0150, lng: -105.2705 }
        },
        maxParticipants: 60,
        requirements: ["Gardening gloves", "Sun hat", "Water bottle"],
        materials: ["Native flower seeds", "Bee houses", "Garden tools", "Mulch"],
        impact: {
            actualTreesPlanted: 0,
            actualCO2Reduction: 100,
            expectedTreesPlanted: 0,
            expectedCO2Reduction: 100
        },
        contactInfo: {
            email: "pollinators@climaware.org",
            phone: "+1-555-0132"
        }
    }
];

async function seedInitiatives() {
    try {
        console.log('🌱 Starting initiative seeding...');
        
        // Find an admin user to be the organizer
        let adminUser = await User.findOne({ role: 'admin' });
        
        // If no admin exists, create one
        if (!adminUser) {
            console.log('📝 Creating admin user...');
            adminUser = new User({
                name: 'ClimAware Admin',
                email: 'admin@climaware.org',
                password: 'admin123',
                phone: '+1-555-0100',
                gender: 'male',
                dob: new Date('1985-01-01'),
                role: 'admin',
                profile: {
                    bio: 'ClimAware Portal Administrator',
                    location: {
                        city: 'San Francisco',
                        state: 'CA',
                        country: 'USA'
                    }
                }
            });
            await adminUser.save();
            console.log('✅ Admin user created');
        }
        
        // Clear existing initiatives
        await Initiative.deleteMany({});
        console.log('🗑️ Cleared existing initiatives');
        
        // Add organizer to each initiative
        const initiativesWithOrganizer = sampleInitiatives.map(initiative => ({
            ...initiative,
            organizer: adminUser._id
        }));
        
        // Insert new initiatives
        const createdInitiatives = await Initiative.insertMany(initiativesWithOrganizer);
        console.log(`✅ Created ${createdInitiatives.length} initiatives`);
        
        // Update admin user's organized initiatives
        await User.findByIdAndUpdate(adminUser._id, {
            'initiatives.organized': createdInitiatives.map(init => init._id),
            'stats.initiativesOrganized': createdInitiatives.length
        });
        
        console.log('🎉 Initiative seeding completed successfully!');
        console.log('\n📊 Created initiatives:');
        createdInitiatives.forEach((init, index) => {
            console.log(`${index + 1}. ${init.title} (${init.category}) - ${init.status}`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding initiatives:', error);
        process.exit(1);
    }
}

// Run the seeding
seedInitiatives();