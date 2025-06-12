const mongoose = require('mongoose');
const Article = require('./models/Article');

// Connect to MongoDB
const MONGO_URI = "mongodb://localhost:27017/climate_portal";

async function updateArticleViews() {
    let needToConnect = false;
    
    try {
        // Check if we need to connect to MongoDB
        if (mongoose.connection.readyState !== 1) {
            needToConnect = true;
            await mongoose.connect(MONGO_URI);
            console.log('✅ Connected to MongoDB');
        }

        // Get all articles
        const articles = await Article.find();
        console.log(`Found ${articles.length} articles`);

        // Update each article with realistic view counts
        const updatedArticles = [];
        for (const article of articles) {
            // Generate a random view count between 50 and 200
            const views = Math.floor(Math.random() * 151) + 50;
            
            // Update the article
            article.viewCount = views;
            await article.save();
            
            updatedArticles.push({
                title: article.title,
                views: article.viewCount
            });
        }

        console.log('✅ Updated article views:');
        updatedArticles.forEach(article => {
            console.log(`- "${article.title}": ${article.views} views`);
        });

        // Calculate total views
        const totalViews = updatedArticles.reduce((sum, article) => sum + article.views, 0);
        console.log(`\n📊 Total article views: ${totalViews}`);

    } catch (error) {
        console.error('❌ Error updating article views:', error);
    } finally {
        // Only disconnect if we connected in this function
        if (needToConnect) {
            await mongoose.disconnect();
            console.log('👋 Disconnected from MongoDB');
        }
    }
}

// If this script is run directly, execute the function
if (require.main === module) {
    updateArticleViews();
}

// Export the function for use in other modules
module.exports = updateArticleViews;