// Weather controller for Tanzania climate data
const Article = require('../models/Article');

// Get weather-related articles
exports.getWeatherArticles = async (req, res) => {
  try {
    const weatherArticles = await Article.find({ 
      category: { $in: ['climate-science', 'renewable-energy'] } 
    }).sort({ createdAt: -1 }).limit(10);
    res.json(weatherArticles);
  } catch (error) {
    console.error('Error fetching weather articles:', error);
    res.status(500).json({ message: 'Failed to fetch weather articles', error: error.message });
  }
};

// Get Tanzania climate statistics
exports.getTanzaniaClimateStats = async (req, res) => {
  try {
    const stats = {
      country: 'Tanzania',
      averageTemperature: 25.2,
      annualRainfallMm: 1200,
      solarHoursPerYear: 3200,
      climateZones: ['Tropical', 'Semi-arid', 'Highland'],
      regions: [
        { 
          name: 'Dar es Salaam', 
          temp: 27.5, 
          rainfall: 1100, 
          climate: 'Tropical coastal',
          population: 6700000
        },
        { 
          name: 'Dodoma', 
          temp: 23.8, 
          rainfall: 600, 
          climate: 'Semi-arid',
          population: 2300000
        },
        { 
          name: 'Arusha', 
          temp: 21.2, 
          rainfall: 800, 
          climate: 'Highland',
          population: 1700000
        },
        { 
          name: 'Mwanza', 
          temp: 24.1, 
          rainfall: 1400, 
          climate: 'Lake Victoria basin',
          population: 1200000
        }
      ],
      climateThreats: [
        'Rising sea levels affecting coastal areas',
        'Irregular rainfall patterns',
        'Increased drought frequency',
        'Temperature rise affecting agriculture'
      ],
      renewableEnergyPotential: {
        solar: 'Excellent (2,800-3,500 hours annually)',
        wind: 'Good (coastal and highland areas)',
        hydro: 'Moderate (seasonal rivers)',
        geothermal: 'Limited (Rift Valley areas)'
      }
    };
    res.json(stats);
  } catch (error) {
    console.error('Error fetching climate stats:', error);
    res.status(500).json({ message: 'Failed to fetch climate stats', error: error.message });
  }
};

// Get climate adaptation strategies for Tanzania
exports.getAdaptationStrategies = async (req, res) => {
  try {
    const strategies = {
      agriculture: [
        'Drought-resistant crop varieties (sorghum, millet)',
        'Improved irrigation systems',
        'Crop diversification',
        'Climate-smart agriculture practices'
      ],
      water: [
        'Rainwater harvesting systems',
        'Groundwater management',
        'Water-efficient technologies',
        'Community water projects'
      ],
      energy: [
        'Solar mini-grids for rural areas',
        'Wind power development',
        'Energy-efficient cookstoves',
        'Grid modernization'
      ],
      coastal: [
        'Mangrove restoration',
        'Coastal protection infrastructure',
        'Sustainable fishing practices',
        'Tourism adaptation measures'
      ]
    };
    res.json(strategies);
  } catch (error) {
    console.error('Error fetching adaptation strategies:', error);
    res.status(500).json({ message: 'Failed to fetch adaptation strategies', error: error.message });
  }
};

// Export climate data as CSV (for admin use)
exports.exportClimateData = async (req, res) => {
  try {
    const data = [
      { region: 'Dar es Salaam', avgTemp: 27.5, rainfall: 1100, solarHours: 3100 },
      { region: 'Dodoma', avgTemp: 23.8, rainfall: 600, solarHours: 3400 },
      { region: 'Arusha', avgTemp: 21.2, rainfall: 800, solarHours: 3200 },
      { region: 'Mwanza', avgTemp: 24.1, rainfall: 1400, solarHours: 2900 }
    ];

    // Simple CSV conversion
    const csvHeader = 'Region,Average Temperature (°C),Annual Rainfall (mm),Solar Hours\n';
    const csvData = data.map(row => 
      `${row.region},${row.avgTemp},${row.rainfall},${row.solarHours}`
    ).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=tanzania-climate-data.csv');
    res.send(csvHeader + csvData);
  } catch (error) {
    console.error('Error exporting climate data:', error);
    res.status(500).json({ message: 'Failed to export climate data', error: error.message });
  }
};

// Article management functions (moved from articleController for consolidation)
exports.getAllArticles = async (req, res) => {
    try {
        const articles = await Article.find().sort({ createdAt: -1 });
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
