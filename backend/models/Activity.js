const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: [
            // Original types for compatibility
            'outdoor', 'indoor', 'sports', 'travel', 'work',
            // Enhanced climate-focused types
            'transportation', 'energy', 'waste_reduction', 'water_conservation', 
            'food_sustainable', 'green_spaces', 'education', 'advocacy', 
            'renewable_energy', 'carbon_offset', 'community_action', 'lifestyle',
            'eco' // eco-friendly activities
        ],
        required: true
    },
    category: {
        type: String,
        enum: ['individual', 'community', 'micro_campaign', 'skill_quest'],
        default: 'individual'
    },
    date: {
        type: Date,
        required: true
    },
    
    // Hyper-Personalized Data
    personalizedData: {
        // Transportation specific
        vehicleType: {
            type: String,
            enum: ['car_gasoline', 'car_diesel', 'car_hybrid', 'car_electric', 'motorcycle', 'bicycle', 'walking', 'public_transport', 'carpool']
        },
        distanceTraveled: Number, // in km
        fuelEfficiency: Number, // km per liter or kWh per 100km for electric
        
        // Energy specific
        homeSize: Number, // square meters
        homeType: {
            type: String,
            enum: ['apartment', 'house', 'condo', 'townhouse']
        },
        energySource: {
            type: String,
            enum: ['grid_standard', 'renewable', 'solar', 'wind', 'mixed']
        },
        energyUsage: Number, // kWh
        
        // Water conservation
        waterSaved: Number, // liters
        
        // Waste reduction
        wasteReduced: Number, // kg
        wasteType: {
            type: String,
            enum: ['plastic', 'organic', 'paper', 'electronic', 'textile', 'mixed']
        },
        
        // Food
        mealType: {
            type: String,
            enum: ['plant_based', 'local_sourced', 'organic', 'reduced_meat', 'zero_waste']
        },
        foodQuantity: Number,
        
        // General quantity/duration
        quantity: Number,
        duration: Number, // minutes or hours
        participantCount: Number // for community activities
    },
    
    // Impact Calculations (Auto-calculated)
    impactMetrics: {
        co2Saved: Number, // kg CO2 equivalent
        energySaved: Number, // kWh
        waterSaved: Number, // liters
        wasteDiverted: Number, // kg
        treesEquivalent: Number, // number of trees planted equivalent
        carsOffRoadDays: Number, // equivalent days of keeping a car off road
        
        // Local context
        localImpact: {
            regionTreesPlanted: Number,
            communityParticipants: Number,
            localProjectsSupported: [String]
        }
    },
    
    // Narrative & Storytelling
    storyElements: {
        impactNarrative: String, // Auto-generated story description
        milestoneAchieved: String,
        journeyType: {
            type: String,
            enum: ['ocean_defender', 'forest_guardian', 'energy_saver', 'waste_warrior', 'climate_advocate', 'green_innovator']
        },
        journeyProgress: Number // percentage towards next milestone
    },
    
    // Community & Collaboration
    collaboration: {
        isMicroCampaign: {
            type: Boolean,
            default: false
        },
        campaignName: String,
        campaignDescription: String,
        invitedUsers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        joinedUsers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        campaignGoal: {
            goalType: String,
            description: String,
            targetValue: Number,
            currentValue: Number,
            unit: String
        },
        
        // Ripple effect tracking
        inspiredActivities: [{
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            activityId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Activity'
            },
            inspirationLevel: Number // 1-5 scale
        }],
        
        // Community voting
        communityVotes: {
            upvotes: {
                type: Number,
                default: 0
            },
            downvotes: {
                type: Number,
                default: 0
            },
            voters: [{
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                },
                vote: {
                    type: String,
                    enum: ['up', 'down']
                }
            }]
        }
    },
    
    // Real-World Integration
    actionLinks: {
        localResources: [{
            name: String,
            url: String,
            type: {
                type: String,
                enum: ['recycling_center', 'sustainable_store', 'local_organization', 'government_service']
            },
            description: String
        }],
        advocacyActions: [{
            title: String,
            description: String,
            url: String,
            type: {
                type: String,
                enum: ['petition', 'representative_contact', 'policy_support', 'donation']
            },
            completed: {
                type: Boolean,
                default: false
            }
        }]
    },
    
    // Educational Content
    education: {
        whyItMatters: {
            scientificFacts: [String],
            environmentalBenefit: String,
            globalImpact: String,
            localRelevance: String
        },
        skillQuest: {
            isQuest: {
                type: Boolean,
                default: false
            },
            questName: String,
            questDescription: String,
            steps: [{
                stepNumber: Number,
                description: String,
                completed: {
                    type: Boolean,
                    default: false
                },
                evidence: String // user can add photo or note as evidence
            }],
            skillsLearned: [String],
            completionReward: {
                points: Number,
                badge: String,
                certificate: String
            }
        },
        relatedTips: [String],
        nextSuggestedActions: [String]
    },
    
    // Gamification & Progress
    gamification: {
        pointsEarned: {
            type: Number,
            default: 0
        },
        badgesEarned: [{
            name: String,
            description: String,
            iconUrl: String,
            earnedDate: Date
        }],
        streakContribution: {
            type: Boolean,
            default: false
        },
        challengeParticipation: [{
            challengeName: String,
            contribution: Number,
            rank: Number
        }]
    },
    
    // Location & Context
    location: {
        coordinates: {
            latitude: Number,
            longitude: Number
        },
        city: {
            type: String,
            default: 'Dar es Salaam'
        },
        country: {
            type: String,
            default: 'Tanzania'
        },
        region: String,
        localWeather: {
            temperature: Number,
            description: String,
            humidity: Number,
            windSpeed: Number,
            pressure: Number,
            airQuality: String
        },
        seasonalContext: String
    },
    
    // User Experience
    userExperience: {
        difficultyLevel: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced', 'expert'],
            default: 'beginner'
        },
        satisfactionRating: {
            type: Number,
            min: 1,
            max: 5
        },
        timeInvestment: Number, // minutes
        costSaving: Number, // monetary value saved (optional)
        moodImpact: {
            type: String,
            enum: ['very_positive', 'positive', 'neutral', 'challenging', 'difficult']
        },
        willRepeat: {
            type: Boolean,
            default: true
        },
        recommendations: [String]
    },
    
    // Privacy & Sharing
    privacy: {
        isPublic: {
            type: Boolean,
            default: true
        },
        shareWithCommunity: {
            type: Boolean,
            default: true
        },
        allowInspiration: {
            type: Boolean,
            default: true
        },
        anonymizeData: {
            type: Boolean,
            default: false
        }
    },
    
    // Rich Media
    media: {
        photos: [{
            url: String,
            caption: String,
            isEvidence: Boolean
        }],
        videos: [{
            url: String,
            caption: String,
            duration: Number
        }],
        documents: [{
            url: String,
            name: String,
            type: String
        }]
    },
    
    // Additional Notes & Reflection
    reflection: {
        notes: {
            type: String,
            trim: true
        },
        learnings: String,
        challenges: String,
        improvements: String,
        emotions: {
            type: String,
            enum: ['proud', 'motivated', 'accomplished', 'inspired', 'determined', 'grateful', 'hopeful']
        }
    },
    
    // System Tracking (User Only - No Admin Access)
    system: {
        version: {
            type: String,
            default: '2.0'
        },
        source: {
            type: String,
            enum: ['manual', 'imported', 'integrated_device', 'partner_app'],
            default: 'manual'
        },
        verified: {
            type: Boolean,
            default: false
        },
        lastCalculationUpdate: Date
    }
}, {
    timestamps: true
});

// Indexes for efficient queries
activitySchema.index({ userId: 1, date: -1 });
activitySchema.index({ userId: 1, type: 1 });
activitySchema.index({ userId: 1, 'storyElements.journeyType': 1 });
activitySchema.index({ 'collaboration.isMicroCampaign': 1, 'privacy.isPublic': 1 });
activitySchema.index({ 'location.city': 1, 'privacy.shareWithCommunity': 1 });
activitySchema.index({ userId: 1, 'gamification.pointsEarned': -1 });

// Pre-save middleware to calculate impact metrics
activitySchema.pre('save', async function(next) {
    if (this.isModified('personalizedData') || this.isNew) {
        this.impactMetrics = await this.constructor.calculatePersonalizedImpact(this);
        this.storyElements.impactNarrative = this.constructor.generateImpactStory(this);
        this.gamification.pointsEarned = this.constructor.calculatePoints(this);
        this.system.lastCalculationUpdate = new Date();
        
        // Auto-assign journey type based on activity
        if (!this.storyElements.journeyType) {
            this.storyElements.journeyType = this.constructor.assignJourneyType(this);
        }
        
        // Update journey progress
        this.storyElements.journeyProgress = await this.constructor.calculateJourneyProgress(this);
    }
    next();
});

// Enhanced impact calculation methods
activitySchema.statics.calculatePersonalizedImpact = function(activity) {
    const calculations = {
        co2Saved: 0,
        energySaved: 0,
        waterSaved: 0,
        wasteDiverted: 0,
        treesEquivalent: 0,
        carsOffRoadDays: 0,
        localImpact: {
            regionTreesPlanted: 0,
            communityParticipants: activity.personalizedData.participantCount || 1,
            localProjectsSupported: []
        }
    };
    
    const personalData = activity.personalizedData || {};
    
    // Transportation impact calculations
    if (['transportation', 'outdoor', 'travel'].includes(activity.type) && personalData.distanceTraveled) {
        const distance = personalData.distanceTraveled;
        const vehicleType = personalData.vehicleType || 'car_gasoline';
        
        // Enhanced emission factors (kg CO2 per km)
        const emissionFactors = {
            'car_gasoline': 0.21,
            'car_diesel': 0.17,
            'car_hybrid': 0.12,
            'car_electric': 0.05,
            'motorcycle': 0.15,
            'bicycle': 0,
            'walking': 0,
            'public_transport': 0.08,
            'carpool': 0.105 // Half of gasoline car
        };
        
        // Calculate emissions saved by choosing this transport method instead of car
        const carEmission = emissionFactors['car_gasoline']; // What they would have emitted with a car
        const actualEmission = emissionFactors[vehicleType] || 0; // What they actually emitted
        const savedEmissions = (carEmission - actualEmission) * distance;
        
        calculations.co2Saved = Math.max(0, savedEmissions);
        calculations.treesEquivalent = calculations.co2Saved / 21.77;
        calculations.carsOffRoadDays = calculations.co2Saved / 4.6;
    }
    
    // Energy impact calculations
    if (['energy', 'indoor'].includes(activity.type) && personalData.energyUsage) {
        const energyAmount = personalData.energyUsage;
        const homeSize = personalData.homeSize || 100;
        const energySource = personalData.energySource || 'grid_standard';
        
        // CO2 emission factors for energy (kg CO2 per kWh)
        const energyEmissionFactors = {
            'grid_standard': 0.5,
            'renewable': 0.1,
            'solar': 0.05,
            'wind': 0.02,
            'mixed': 0.3
        };
        
        const gridEmission = energyEmissionFactors['grid_standard'];
        const currentEmission = energyEmissionFactors[energySource] || gridEmission;
        const savedEmissions = (gridEmission - currentEmission) * energyAmount;
        
        calculations.co2Saved += Math.max(0, savedEmissions);
        calculations.energySaved = energyAmount;
        calculations.treesEquivalent += calculations.co2Saved / 21.77;
    }
    
    // Water conservation impact
    if (['water_conservation', 'lifestyle'].includes(activity.type) && personalData.waterSaved) {
        calculations.waterSaved = personalData.waterSaved;
        // Water processing emits ~0.344g CO2 per liter
        calculations.co2Saved += (personalData.waterSaved * 0.000344);
        calculations.treesEquivalent += calculations.co2Saved / 21.77;
    }
    
    // Waste reduction impact
    if (['waste_reduction', 'eco'].includes(activity.type) && personalData.wasteReduced) {
        const wasteAmount = personalData.wasteReduced;
        const wasteType = personalData.wasteType || 'mixed';
        
        // CO2 emission factors for waste (kg CO2 per kg waste)
        const wasteEmissionFactors = {
            'plastic': 6.0,
            'organic': 0.5,
            'paper': 1.5,
            'electronic': 300,
            'textile': 15,
            'mixed': 2.5
        };
        
        const savedEmissions = wasteEmissionFactors[wasteType] * wasteAmount;
        calculations.co2Saved += savedEmissions;
        calculations.wasteDiverted = wasteAmount;
        calculations.treesEquivalent += calculations.co2Saved / 21.77;
    }
    
    // Food sustainability impact
    if (['food_sustainable', 'lifestyle'].includes(activity.type) && personalData.mealType) {
        const quantity = personalData.foodQuantity || 1;
        const mealType = personalData.mealType;
        
        // CO2 savings per meal (kg CO2)
        const mealEmissionSavings = {
            'plant_based': 2.5,
            'local_sourced': 1.2,
            'organic': 0.8,
            'reduced_meat': 1.8,
            'zero_waste': 0.6
        };
        
        const savedEmissions = (mealEmissionSavings[mealType] || 0) * quantity;
        calculations.co2Saved += savedEmissions;
        calculations.treesEquivalent += calculations.co2Saved / 21.77;
    }
    
    // Green spaces & community activities
    if (['green_spaces', 'community_action'].includes(activity.type)) {
        const participants = personalData.participantCount || 1;
        const duration = personalData.duration || 60; // minutes
        
        // Base impact per hour per person
        const baseImpact = 0.5; // kg CO2 per hour
        calculations.co2Saved += (baseImpact * (duration / 60) * participants);
        calculations.localImpact.regionTreesPlanted = Math.floor(calculations.co2Saved / 21.77);
        calculations.treesEquivalent += calculations.co2Saved / 21.77;
    }
    
    // Calculate car-off-road days equivalent
    calculations.carsOffRoadDays = calculations.co2Saved / 4.6;
    
    return calculations;
};

// Enhanced narrative generation with personalized storytelling
activitySchema.statics.generateImpactStory = function(activity) {
    const impact = activity.impactMetrics || {};
    const type = activity.type;
    const personalData = activity.personalizedData || {};
    
    // Create dynamic narratives based on impact and activity type
    const stories = [];
    
    if (impact.co2Saved > 0) {
        if (impact.treesEquivalent >= 10) {
            stories.push(`🌳 Your ${type} activity is like planting a mini forest of ${Math.round(impact.treesEquivalent)} trees!`);
        } else if (impact.treesEquivalent >= 1) {
            stories.push(`🌱 You've made an impact equivalent to planting ${Math.round(impact.treesEquivalent)} trees!`);
        } else if (impact.carsOffRoadDays >= 7) {
            stories.push(`🚗💨 You've helped keep a car off the road for ${Math.round(impact.carsOffRoadDays)} days - that's over a week!`);
        } else if (impact.carsOffRoadDays >= 1) {
            stories.push(`🚗 Your efforts equal keeping a car parked for ${Math.round(impact.carsOffRoadDays)} days!`);
        } else {
            stories.push(`🌍 You've prevented ${impact.co2Saved.toFixed(2)} kg of CO2 from entering our atmosphere!`);
        }
    }
    
    // Add specific activity type narratives
    if (type === 'transportation' && personalData.vehicleType === 'bicycle') {
        stories.push(`🚴‍♀️ Every pedal stroke is a step towards cleaner air!`);
    } else if (type === 'energy' && personalData.energySource === 'solar') {
        stories.push(`☀️ You're harnessing the sun's power for a brighter tomorrow!`);
    } else if (type === 'waste_reduction' && personalData.wasteType === 'plastic') {
        stories.push(`🌊 You're helping protect our oceans from plastic pollution!`);
    } else if (type === 'food_sustainable' && personalData.mealType === 'plant_based') {
        stories.push(`🥗 Your plant-powered choices are feeding change!`);
    }
    
    // Add community impact
    if (activity.category === 'community' && personalData.participantCount > 1) {
        stories.push(`👥 Together with ${personalData.participantCount} others, you're amplifying the impact!`);
    }
    
    // Add local context
    if (impact.localImpact && impact.localImpact.regionTreesPlanted > 0) {
        stories.push(`🗺️ Your region has now planted ${impact.localImpact.regionTreesPlanted} trees thanks to activities like yours!`);
    }
    
    return stories.join(' ') || `💚 Great job on your sustainable ${type} activity! Every action creates ripples of positive change.`;
};

// Enhanced point calculation system
activitySchema.statics.calculatePoints = function(activity) {
    const impact = activity.impactMetrics || {};
    const personalData = activity.personalizedData || {};
    let points = 15; // Increased base points
    
    // Impact-based points
    if (impact.co2Saved > 0) {
        points += Math.round(impact.co2Saved * 15); // Increased multiplier
    }
    if (impact.energySaved > 0) {
        points += Math.round(impact.energySaved * 2);
    }
    if (impact.waterSaved > 0) {
        points += Math.round(impact.waterSaved * 0.1);
    }
    if (impact.wasteDiverted > 0) {
        points += Math.round(impact.wasteDiverted * 5);
    }
    
    // Activity type bonuses
    const typeMultipliers = {
        'transportation': 1.2,
        'energy': 1.3,
        'waste_reduction': 1.4,
        'food_sustainable': 1.1,
        'community_action': 1.5,
        'green_spaces': 1.3,
        'advocacy': 1.6,
        'education': 1.2,
        'eco': 1.2
    };
    
    points *= (typeMultipliers[activity.type] || 1.0);
    
    // Category bonuses
    const categoryBonuses = {
        'individual': 1.0,
        'community': 1.8,
        'micro_campaign': 2.0,
        'skill_quest': 2.5
    };
    
    points *= (categoryBonuses[activity.category] || 1.0);
    
    // Personalization bonuses
    if (personalData.participantCount > 1) {
        points *= (1 + (personalData.participantCount - 1) * 0.1); // 10% bonus per additional participant
    }
    
    // Duration bonuses for longer activities
    if (personalData.duration > 60) {
        points *= 1.2; // 20% bonus for activities over 1 hour
    }
    
    // Difficulty bonuses
    const difficultyMultipliers = {
        'beginner': 1.0,
        'intermediate': 1.2,
        'advanced': 1.4,
        'expert': 1.6
    };
    
    const difficulty = activity.userExperience?.difficultyLevel || 'beginner';
    points *= difficultyMultipliers[difficulty];
    
    // Quest completion bonus
    if (activity.education?.skillQuest?.isQuest) {
        const completedSteps = activity.education.skillQuest.steps?.filter(step => step.completed).length || 0;
        const totalSteps = activity.education.skillQuest.steps?.length || 1;
        points += (completedSteps / totalSteps) * 100; // Up to 100 bonus points for quest completion
    }
    
    // First-time activity bonus
    if (activity.isNew) {
        points *= 1.1; // 10% bonus for trying new activities
    }
    
    return Math.round(Math.max(10, points)); // Minimum 10 points
};

// Journey type assignment based on activity patterns
activitySchema.statics.assignJourneyType = function(activity) {
    const type = activity.type;
    const personalData = activity.personalizedData || {};
    
    // Journey type mapping
    const journeyMapping = {
        'waste_reduction': 'waste_warrior',
        'water_conservation': 'ocean_defender',
        'transportation': personalData.vehicleType === 'bicycle' || personalData.vehicleType === 'walking' ? 'green_innovator' : 'climate_advocate',
        'energy': 'energy_saver',
        'food_sustainable': 'green_innovator',
        'green_spaces': 'forest_guardian',
        'community_action': 'climate_advocate',
        'advocacy': 'climate_advocate',
        'education': 'green_innovator',
        'eco': 'ocean_defender',
        'outdoor': 'forest_guardian',
        'lifestyle': 'green_innovator'
    };
    
    return journeyMapping[type] || 'climate_advocate';
};

// Journey progress calculation
activitySchema.statics.calculateJourneyProgress = async function(activity) {
    try {
        const userId = activity.userId;
        const journeyType = activity.storyElements?.journeyType;
        
        if (!journeyType) return 0;
        
        // Get user's activities in this journey type
        const journeyActivities = await this.find({
            userId: userId,
            'storyElements.journeyType': journeyType
        });
        
        // Calculate progress milestones
        const milestones = {
            'ocean_defender': [5, 15, 30, 50, 100], // Activities needed for each milestone
            'forest_guardian': [3, 10, 25, 50, 100],
            'energy_saver': [5, 15, 30, 60, 120],
            'waste_warrior': [10, 25, 50, 100, 200],
            'climate_advocate': [3, 8, 20, 40, 80],
            'green_innovator': [5, 12, 25, 50, 100]
        };
        
        const currentCount = journeyActivities.length;
        const milestoneArray = milestones[journeyType] || [5, 15, 30, 50, 100];
        
        // Find current milestone
        let currentMilestone = 0;
        let nextMilestone = milestoneArray[0];
        
        for (let i = 0; i < milestoneArray.length; i++) {
            if (currentCount >= milestoneArray[i]) {
                currentMilestone = i + 1;
                nextMilestone = milestoneArray[i + 1] || milestoneArray[i];
            } else {
                nextMilestone = milestoneArray[i];
                break;
            }
        }
        
        // Calculate progress percentage
        const prevMilestone = currentMilestone > 0 ? milestoneArray[currentMilestone - 1] : 0;
        const progressInCurrentLevel = currentCount - prevMilestone;
        const levelSpan = nextMilestone - prevMilestone;
        
        return Math.min(100, Math.round((progressInCurrentLevel / levelSpan) * 100));
        
    } catch (error) {
        console.error('Error calculating journey progress:', error);
        return 0;
    }
};

// Instance methods for user interactions
activitySchema.methods.joinMicroCampaign = function(userId) {
    if (!this.collaboration.joinedUsers.includes(userId)) {
        this.collaboration.joinedUsers.push(userId);
        return this.save();
    }
};

activitySchema.methods.addInspiration = function(inspiredActivity) {
    this.collaboration.inspiredActivities.push(inspiredActivity);
    return this.save();
};

activitySchema.methods.vote = function(userId, voteType) {
    // Initialize vote counts if they don't exist
    if (!this.collaboration.communityVotes) {
        this.collaboration.communityVotes = {
            upvotes: 0,
            downvotes: 0,
            voters: []
        };
    }
    
    // Ensure vote counts are numbers
    this.collaboration.communityVotes.upvotes = this.collaboration.communityVotes.upvotes || 0;
    this.collaboration.communityVotes.downvotes = this.collaboration.communityVotes.downvotes || 0;
    this.collaboration.communityVotes.voters = this.collaboration.communityVotes.voters || [];
    
    const existingVote = this.collaboration.communityVotes.voters.find(v => v.userId.toString() === userId.toString());
    
    if (existingVote) {
        // Update existing vote
        if (existingVote.vote !== voteType) {
            if (existingVote.vote === 'up') {
                this.collaboration.communityVotes.upvotes--;
            } else {
                this.collaboration.communityVotes.downvotes--;
            }
            
            existingVote.vote = voteType;
            if (voteType === 'up') {
                this.collaboration.communityVotes.upvotes++;
            } else {
                this.collaboration.communityVotes.downvotes++;
            }
        }
    } else {
        // New vote
        this.collaboration.communityVotes.voters.push({ userId, vote: voteType });
        if (voteType === 'up') {
            this.collaboration.communityVotes.upvotes++;
        } else {
            this.collaboration.communityVotes.downvotes++;
        }
    }
    
    return this.save();
};

// Exclude admin fields - everything is user-managed
activitySchema.set('toJSON', {
    transform: function(doc, ret) {
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('Activity', activitySchema);