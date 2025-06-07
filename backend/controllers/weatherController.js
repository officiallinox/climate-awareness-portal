const WeatherPrediction = require('../models/WeatherPrediction');
const json2csv = require('json2csv').parse; // npm install json2csv
const Article = require('../models/Article');

exports.getPredictions = async (req, res) => {
  try {
    const predictions = await WeatherPrediction.find();
    res.json(predictions);
  } catch (error) {
    console.error('Error fetching weather predictions:', error);
    res.status(500).json({ message: 'Failed to fetch weather predictions', error: error.message });
  }
};

exports.getPredictionById = async (req, res) => {
  const prediction = await WeatherPrediction.findById(req.params.id);
  if (!prediction) return res.status(404).json({ error: 'Not found' });
  res.json(prediction);
};

exports.createPrediction = async (req, res) => {
    try {
        // Log the received body to check the data
        console.log('Received data:', req.body);

        // Basic validation
        if (!req.body.location || !req.body.temperature || !req.body.humidity || !req.body.conditions) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newPrediction = new WeatherPrediction(req.body);
        const savedPrediction = await newPrediction.save();

        res.status(201).json(savedPrediction);
    } catch (error) {
        console.error('Error creating weather prediction:', error);
        console.error('Error details:', error); // Log the entire error object
        console.error('Data causing the error:', req.body); // Log the data

        res.status(500).json({ message: 'Failed to save weather prediction', error: error.message });
    }
};

exports.updatePrediction = async (req, res) => {
  const updated = await WeatherPrediction.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

exports.deletePrediction = async (req, res) => {
  await WeatherPrediction.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};

exports.exportPredictions = async (req, res) => {
    try {
        const predictions = await WeatherPrediction.find();
        const csv = json2csv(predictions);

        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', 'attachment; filename="weather_predictions.csv"');
        res.send(csv);
    } catch (error) {
        console.error('Error exporting weather predictions:', error);
        res.status(500).json({ message: 'Failed to export weather predictions', error: error.message });
    }
};

exports.getAllArticles = async (req, res) => {
    try {
        const articles = await Article.find().sort({ date: -1 }); // Sort by date descending
        res.json(articles);
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).json({ message: 'Failed to fetch articles', error: error.message });
    }
};

exports.getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.json(article);
    } catch (error) {
        console.error('Error fetching article:', error);
        res.status(500).json({ message: 'Failed to fetch article', error: error.message });
    }
};

exports.createArticle = async (req, res) => {
    try {
        const newArticle = new Article(req.body);
        const savedArticle = await newArticle.save();
        res.status(201).json(savedArticle);
    } catch (error) {
        console.error('Error creating article:', error);
        res.status(400).json({ message: 'Failed to create article', error: error.message });
    }
};

exports.updateArticle = async (req, res) => {
    try {
        const updatedArticle = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedArticle) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.json(updatedArticle);
    } catch (error) {
        console.error('Error updating article:', error);
        res.status(400).json({ message: 'Failed to update article', error: error.message });
    }
};

exports.deleteArticle = async (req, res) => {
    try {
        const deletedArticle = await Article.findByIdAndDelete(req.params.id);
        if (!deletedArticle) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.json({ message: 'Article deleted' });
    } catch (error) {
        console.error('Error deleting article:', error);
        res.status(500).json({ message: 'Failed to delete article', error: error.message });
    }
};
