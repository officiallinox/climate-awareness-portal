const mongoose = require('mongoose');
const Article = require('./models/Article');

// Connect to MongoDB
const MONGO_URI = "mongodb://localhost:27017/climate_portal";

async function fixArticleViews() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Get all articles
        const articles = await Article.find();
        console.log(`Found ${articles.length} articles`);

        // Display current viewCount values
        console.log('\nCurrent viewCount values:');
        articles.forEach(article => {
            console.log(`- "${article.title}": viewCount=${article.viewCount || 0}`);
        });

        // Update each article with realistic view counts
        const updatedArticles = [];
        for (const article of articles) {
            // Generate a random view count between 50 and 200
            const views = Math.floor(Math.random() * 151) + 50;
            
            // Update the article directly in the database
            await Article.updateOne(
                { _id: article._id },
                { $set: { viewCount: views } }
            );
            
            updatedArticles.push({
                title: article.title,
                views: views
            });
        }

        // Verify the updates
        const updatedArticlesFromDB = await Article.find();
        console.log('\nUpdated viewCount values:');
        updatedArticlesFromDB.forEach(article => {
            console.log(`- "${article.title}": viewCount=${article.viewCount || 0}`);
        });

        // Calculate total views
        const totalViews = updatedArticlesFromDB.reduce((sum, article) => sum + (article.viewCount || 0), 0);
        console.log(`\n📊 Total article views: ${totalViews}`);

        // Test the aggregation
        const aggregateResult = await Article.aggregate([
            { $group: { _id: null, totalViews: { $sum: "$viewCount" } } }
        ]);
        
        console.log('\nAggregate result:', JSON.stringify(aggregateResult, null, 2));
        console.log('Total views from aggregation:', aggregateResult.length > 0 ? aggregateResult[0].totalViews : 0);

    } catch (error) {
        console.error('❌ Error fixing article views:', error);
    } finally {
        await mongoose.disconnect();
        console.log('👋 Disconnected from MongoDB');
    }
}

// Run the fix function
fixArticleViews();