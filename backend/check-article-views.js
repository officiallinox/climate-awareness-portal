const mongoose = require('mongoose');
const Article = require('./models/Article');

// Connect to MongoDB
const MONGO_URI = "mongodb://localhost:27017/climate_portal";

async function checkArticleViews() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Get all articles
        const articles = await Article.find();
        console.log(`Found ${articles.length} articles`);

        // Display each article's views
        console.log('\nArticles with views:');
        articles.forEach(article => {
            console.log(`- "${article.title}": ${article.viewCount || 0} views`);
        });

        // Calculate total views
        const totalViews = articles.reduce((sum, article) => sum + (article.viewCount || 0), 0);
        console.log(`\n📊 Total article views: ${totalViews}`);

    } catch (error) {
        console.error('❌ Error checking article views:', error);
    } finally {
        await mongoose.disconnect();
        console.log('👋 Disconnected from MongoDB');
    }
}

// Run the check function
checkArticleViews();