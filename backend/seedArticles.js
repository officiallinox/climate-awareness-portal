const mongoose = require('mongoose');
const Article = require('./models/Article');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/climaware', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const sampleArticles = [
    {
        title: "Understanding Climate Change: The Science Behind Global Warming",
        content: `Climate change refers to long-term shifts in global or regional climate patterns. Since the mid-20th century, scientists have observed unprecedented changes in Earth's climate system, primarily attributed to increased levels of greenhouse gases produced by human activities.

**The Greenhouse Effect**

The greenhouse effect is a natural process that warms Earth's surface. When the Sun's energy reaches Earth's atmosphere, some of it is reflected back to space and the rest is absorbed and re-radiated by greenhouse gases. These gases include water vapor, carbon dioxide (CO2), methane (CH4), nitrous oxide (N2O), and fluorinated gases.

**Human Impact**

Since the Industrial Revolution, human activities have significantly increased the concentration of greenhouse gases in the atmosphere. The burning of fossil fuels, deforestation, and industrial processes have led to a 47% increase in atmospheric CO2 since 1850.

**Observable Effects**

Current evidence of climate change includes:
- Rising global temperatures (1.1°C above pre-industrial levels)
- Melting ice sheets and glaciers
- Rising sea levels
- Changes in precipitation patterns
- More frequent extreme weather events

**Future Projections**

Climate models predict that without significant action to reduce greenhouse gas emissions, global temperatures could rise by 3-5°C by 2100, leading to severe consequences for ecosystems, human health, and economic systems.

Understanding the science behind climate change is crucial for developing effective mitigation and adaptation strategies.`,
        category: "climate-science",
        excerpt: "Explore the fundamental science behind climate change, from the greenhouse effect to human impacts and future projections.",
        views: 1247,
        readTime: 8
    },
    {
        title: "Renewable Energy Revolution: Solar and Wind Power Leading the Way",
        content: `The renewable energy sector has experienced unprecedented growth in recent years, with solar and wind power leading the transformation of the global energy landscape.

**Solar Power Breakthrough**

Solar photovoltaic (PV) technology has seen dramatic cost reductions, with prices falling by 90% since 2010. Key developments include:
- Improved efficiency of solar panels (now exceeding 26% for commercial panels)
- Advanced energy storage solutions
- Floating solar farms for water conservation
- Building-integrated photovoltaics (BIPV)

**Wind Energy Expansion**

Wind power has become one of the fastest-growing energy sources globally:
- Offshore wind farms accessing stronger, more consistent winds
- Larger, more efficient turbines generating more power
- Smart grid integration for better energy distribution
- Hybrid renewable energy systems

**Economic Impact**

The renewable energy sector now employs over 13 million people worldwide and has attracted over $300 billion in annual investment. Countries leading in renewable energy deployment are experiencing:
- Job creation in manufacturing and installation
- Energy independence and security
- Reduced air pollution and health benefits
- Economic competitiveness in clean technology

**Challenges and Solutions**

While renewable energy growth is promising, challenges remain:
- Grid integration and stability
- Energy storage for intermittent sources
- Infrastructure investment requirements
- Policy and regulatory frameworks

**Future Outlook**

Experts predict that renewable energy could provide 90% of the CO2 reductions needed in the energy sector to limit global warming to 1.5°C. Continued innovation and investment will be crucial for achieving this goal.`,
        category: "renewable-energy",
        excerpt: "Discover how solar and wind power are revolutionizing the energy sector with dramatic cost reductions and technological breakthroughs.",
        views: 892,
        readTime: 6
    },
    {
        title: "Sustainable Living: 10 Simple Changes for a Greener Lifestyle",
        content: `Adopting a sustainable lifestyle doesn't require drastic changes. Small, consistent actions can significantly reduce your environmental impact while often saving money and improving your quality of life.

**1. Energy Efficiency at Home**

- Switch to LED bulbs (use 75% less energy)
- Unplug electronics when not in use
- Use a programmable thermostat
- Improve home insulation
- Choose energy-efficient appliances

**2. Sustainable Transportation**

- Walk, bike, or use public transportation
- Consider carpooling or ride-sharing
- Work from home when possible
- Plan efficient routes for errands
- Explore electric or hybrid vehicles

**3. Water Conservation**

- Fix leaks promptly
- Install low-flow showerheads and faucets
- Collect rainwater for gardening
- Use drought-resistant plants in landscaping
- Run dishwashers and washing machines with full loads

**4. Waste Reduction**

- Follow the 3 R's: Reduce, Reuse, Recycle
- Compost organic waste
- Choose products with minimal packaging
- Repair items instead of replacing them
- Donate or sell items you no longer need

**5. Sustainable Food Choices**

- Eat more plant-based meals
- Buy local and seasonal produce
- Reduce food waste through meal planning
- Support sustainable farming practices
- Grow your own herbs and vegetables

**6. Conscious Consumption**

- Buy quality items that last longer
- Choose products from environmentally responsible companies
- Avoid single-use plastics
- Use reusable bags, bottles, and containers
- Consider second-hand options

**7. Green Cleaning**

- Use eco-friendly cleaning products
- Make your own cleaners with natural ingredients
- Choose concentrated products to reduce packaging
- Use microfiber cloths instead of paper towels

**8. Digital Sustainability**

- Reduce email subscriptions and digital clutter
- Use cloud storage efficiently
- Choose devices with longer lifespans
- Recycle electronics properly

**9. Water-Wise Gardening**

- Plant native species
- Use mulch to retain moisture
- Install drip irrigation systems
- Create rain gardens for stormwater management

**10. Community Engagement**

- Participate in local environmental initiatives
- Support businesses with sustainable practices
- Advocate for environmental policies
- Share knowledge with friends and family

**The Impact of Small Changes**

When adopted widely, these simple changes can have significant environmental benefits:
- Reduced greenhouse gas emissions
- Conservation of natural resources
- Decreased pollution
- Protection of biodiversity
- Improved public health

Remember, sustainability is a journey, not a destination. Start with changes that feel manageable and gradually incorporate more sustainable practices into your daily routine.`,
        category: "sustainability",
        excerpt: "Learn 10 practical and achievable ways to reduce your environmental impact and live more sustainably.",
        views: 1456,
        readTime: 10
    },
    {
        title: "Ocean Conservation: Protecting Marine Ecosystems from Climate Change",
        content: `Our oceans are facing unprecedented challenges from climate change, pollution, and overexploitation. Understanding these threats and supporting conservation efforts is crucial for maintaining healthy marine ecosystems.

**Climate Change Impacts on Oceans**

**Ocean Acidification**
As oceans absorb excess CO2 from the atmosphere, they become more acidic. This process, known as ocean acidification, threatens:
- Coral reefs and shell-forming organisms
- Marine food chains
- Fisheries and coastal economies

**Rising Sea Temperatures**
Warming oceans lead to:
- Coral bleaching events
- Changes in marine species distribution
- Disruption of ocean currents
- Melting of polar ice

**Sea Level Rise**
Thermal expansion and ice melt contribute to rising sea levels, affecting:
- Coastal communities and infrastructure
- Wetlands and estuaries
- Freshwater supplies
- Island nations

**Marine Conservation Strategies**

**Marine Protected Areas (MPAs)**
Establishing protected zones helps:
- Preserve critical habitats
- Allow fish populations to recover
- Maintain biodiversity
- Support ecosystem resilience

**Sustainable Fishing Practices**
- Implementing catch limits and quotas
- Using selective fishing gear
- Protecting spawning grounds
- Supporting small-scale, local fisheries

**Pollution Reduction**
- Reducing plastic waste and microplastics
- Controlling agricultural runoff
- Managing coastal development
- Treating wastewater effectively

**Restoration Projects**
- Coral reef restoration
- Mangrove reforestation
- Seagrass bed rehabilitation
- Oyster reef reconstruction

**Individual Actions for Ocean Conservation**

- Reduce plastic consumption
- Choose sustainable seafood
- Support ocean conservation organizations
- Participate in beach cleanups
- Use reef-safe sunscreen
- Reduce carbon footprint

**Success Stories**

Several conservation efforts have shown promising results:
- The recovery of humpback whale populations
- Successful coral restoration projects in the Caribbean
- Marine protected areas increasing fish populations
- Reduction in ozone-depleting substances helping marine life

**The Future of Ocean Conservation**

Protecting our oceans requires global cooperation and immediate action. By supporting conservation efforts and making sustainable choices, we can help ensure healthy oceans for future generations.`,
        category: "conservation",
        excerpt: "Explore the critical threats facing our oceans and discover how conservation efforts are working to protect marine ecosystems.",
        views: 734,
        readTime: 7
    },
    {
        title: "Climate Policy and the Paris Agreement: Global Cooperation for Climate Action",
        content: `The Paris Agreement represents the most significant international effort to address climate change. Understanding its goals, mechanisms, and progress is essential for grasping the global response to climate challenges.

**The Paris Agreement Overview**

Adopted in 2015, the Paris Agreement aims to:
- Limit global warming to well below 2°C above pre-industrial levels
- Pursue efforts to limit warming to 1.5°C
- Strengthen countries' ability to adapt to climate impacts
- Align financial flows with climate goals

**Key Mechanisms**

**Nationally Determined Contributions (NDCs)**
Each country submits plans outlining their climate actions, including:
- Emission reduction targets
- Adaptation measures
- Implementation timelines
- Financial and technical needs

**Global Stocktake**
Every five years, countries assess collective progress toward the agreement's goals and enhance their commitments accordingly.

**Climate Finance**
Developed countries committed to mobilizing $100 billion annually by 2020 to support developing nations' climate actions.

**Progress and Challenges**

**Achievements**
- 195 countries have joined the agreement
- Many countries have strengthened their climate commitments
- Renewable energy deployment has accelerated
- Climate finance has increased significantly

**Gaps**
- Current commitments are insufficient to meet the 1.5°C target
- Implementation varies significantly among countries
- Climate finance goals have not been fully met
- Adaptation efforts need strengthening

**National Climate Policies**

Countries are implementing various policy tools:

**Carbon Pricing**
- Carbon taxes
- Emissions trading systems
- Border carbon adjustments

**Regulatory Measures**
- Renewable energy standards
- Energy efficiency requirements
- Vehicle emission standards
- Building codes

**Investment and Incentives**
- Subsidies for clean energy
- Green bonds and sustainable finance
- Research and development funding
- Infrastructure investment

**Sectoral Approaches**
- Transportation electrification
- Industrial decarbonization
- Agricultural sustainability
- Forest conservation

**The Role of Non-State Actors**

Beyond national governments, other actors play crucial roles:
- Cities and local governments
- Businesses and investors
- Civil society organizations
- Indigenous communities

**Future Outlook**

The success of the Paris Agreement depends on:
- Enhanced ambition in NDCs
- Effective implementation of policies
- Increased climate finance
- Technological innovation
- International cooperation

**COP Conferences**

Annual Conference of the Parties (COP) meetings provide opportunities to:
- Review progress
- Negotiate new commitments
- Share best practices
- Address emerging challenges

The Paris Agreement provides a framework for global climate action, but its success requires continued commitment and enhanced efforts from all countries and stakeholders.`,
        category: "policy",
        excerpt: "Understand the Paris Agreement's role in global climate action and how international cooperation is addressing climate challenges.",
        views: 623,
        readTime: 9
    },
    {
        title: "Green Technology Innovations: AI and IoT for Environmental Solutions",
        content: `Emerging technologies like Artificial Intelligence (AI) and the Internet of Things (IoT) are revolutionizing environmental monitoring, resource management, and sustainability efforts across various sectors.

**AI for Climate Solutions**

**Climate Modeling and Prediction**
AI enhances climate science through:
- Improved weather forecasting accuracy
- Better climate change projections
- Early warning systems for extreme events
- Analysis of complex climate data patterns

**Energy Optimization**
AI applications in energy include:
- Smart grid management
- Predictive maintenance for renewable energy systems
- Energy consumption optimization in buildings
- Demand response and load balancing

**Carbon Footprint Reduction**
AI helps reduce emissions by:
- Optimizing transportation routes and logistics
- Improving industrial process efficiency
- Enabling precision agriculture
- Supporting circular economy initiatives

**IoT for Environmental Monitoring**

**Air Quality Monitoring**
IoT sensors provide:
- Real-time air pollution data
- Localized environmental information
- Early warning systems for health risks
- Data for policy decision-making

**Water Management**
IoT applications include:
- Smart irrigation systems
- Water quality monitoring
- Leak detection in distribution systems
- Flood and drought early warning

**Waste Management**
IoT improves waste systems through:
- Smart bins with fill-level sensors
- Optimized collection routes
- Recycling process automation
- Waste stream tracking and analysis

**Biodiversity Conservation**
IoT supports conservation with:
- Wildlife tracking and monitoring
- Habitat condition sensors
- Anti-poaching systems
- Ecosystem health assessment

**Smart Cities and Sustainability**

**Integrated Urban Systems**
Smart city technologies combine AI and IoT for:
- Traffic flow optimization
- Energy-efficient buildings
- Waste reduction strategies
- Green infrastructure management

**Citizen Engagement**
Technology platforms enable:
- Environmental data sharing
- Community participation in monitoring
- Sustainability behavior tracking
- Collaborative problem-solving

**Challenges and Considerations**

**Technical Challenges**
- Data quality and standardization
- Interoperability between systems
- Cybersecurity and privacy concerns
- Infrastructure requirements

**Social and Economic Factors**
- Digital divide and access issues
- Job displacement concerns
- Investment and funding needs
- Regulatory and governance frameworks

**Environmental Impact of Technology**
- Energy consumption of data centers
- Electronic waste generation
- Resource extraction for devices
- Lifecycle environmental costs

**Success Stories**

**Microsoft's AI for Earth**
Supporting projects that use AI to address environmental challenges, including:
- Biodiversity monitoring
- Climate change research
- Sustainable agriculture
- Water resource management

**Google's Environmental Insights Explorer**
Providing cities with data and tools to:
- Track greenhouse gas emissions
- Identify emission reduction opportunities
- Monitor air quality
- Plan sustainable transportation

**IBM's Green Horizon Project**
Using AI and IoT to:
- Improve air quality forecasting
- Optimize renewable energy integration
- Reduce industrial emissions
- Support environmental decision-making

**Future Prospects**

Emerging trends in green technology include:
- Edge computing for real-time environmental monitoring
- Blockchain for environmental data verification
- Digital twins for ecosystem modeling
- Quantum computing for climate simulations

**Getting Involved**

Individuals and organizations can support green technology by:
- Adopting smart home technologies
- Supporting environmental tech startups
- Participating in citizen science projects
- Advocating for sustainable technology policies

The convergence of AI, IoT, and environmental science offers unprecedented opportunities to address climate challenges and build a more sustainable future.`,
        category: "technology",
        excerpt: "Discover how AI and IoT technologies are creating innovative solutions for environmental monitoring and sustainability.",
        views: 567,
        readTime: 8
    }
];

async function seedArticles() {
    try {
        console.log('📚 Starting article seeding...');
        
        // Find an admin user to be the author
        let adminUser = await User.findOne({ role: 'admin' });
        
        // If no admin exists, create one
        if (!adminUser) {
            console.log('📝 Creating admin user for articles...');
            adminUser = new User({
                name: 'ClimAware Editorial Team',
                email: 'editorial@climaware.org',
                password: 'admin123',
                phone: '+1-555-0200',
                gender: 'male',
                dob: new Date('1980-01-01'),
                role: 'admin'
            });
            await adminUser.save();
            console.log('✅ Admin user created');
        }
        
        // Clear existing articles
        await Article.deleteMany({});
        console.log('🗑️ Cleared existing articles');
        
        // Add author to each article
        const articlesWithAuthor = sampleArticles.map(article => ({
            ...article,
            author: adminUser._id,
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
            updatedAt: new Date()
        }));
        
        // Insert new articles
        const createdArticles = await Article.insertMany(articlesWithAuthor);
        console.log(`✅ Created ${createdArticles.length} articles`);
        
        console.log('🎉 Article seeding completed successfully!');
        console.log('\n📊 Created articles:');
        createdArticles.forEach((article, index) => {
            console.log(`${index + 1}. ${article.title} (${article.category}) - ${article.views} views`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding articles:', error);
        process.exit(1);
    }
}

// Run the seeding
seedArticles();