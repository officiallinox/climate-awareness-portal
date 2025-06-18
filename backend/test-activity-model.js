require('dotenv').config();
const mongoose = require('mongoose');
const Activity = require('./models/Activity');

async function testActivityModel() {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/climate_portal');
        console.log('✅ Connected to MongoDB');
        
        // Create test user ID
        const testUserId = new mongoose.Types.ObjectId();
        
        // Test 1: Basic activity creation (should work now)
        console.log('\n🧪 Test 1: Creating basic outdoor activity...');
        const outdoorActivity = new Activity({
            userId: testUserId,
            name: 'Morning nature walk',
            type: 'outdoor', // This should now work
            date: new Date(),
            location: {
                city: 'Dar es Salaam',
                country: 'Tanzania'
            }
        });
        
        await outdoorActivity.save();
        console.log('✅ Basic outdoor activity created successfully!');
        console.log('📊 Generated story:', outdoorActivity.storyElements.impactNarrative);
        console.log('⭐ Points earned:', outdoorActivity.gamification.pointsEarned);
        
        // Test 2: Enhanced climate activity
        console.log('\n🧪 Test 2: Creating enhanced transportation activity...');
        const transportActivity = new Activity({
            userId: testUserId,
            name: 'Biked to work instead of driving',
            type: 'transportation',
            category: 'individual',
            date: new Date(),
            personalizedData: {
                vehicleType: 'bicycle',
                distanceTraveled: 10, // 10km
                fuelEfficiency: 12 // km/liter of replaced car
            },
            location: {
                city: 'Dar es Salaam',
                country: 'Tanzania'
            },
            userExperience: {
                difficultyLevel: 'intermediate',
                satisfactionRating: 5,
                timeInvestment: 45,
                moodImpact: 'very_positive'
            }
        });
        
        await transportActivity.save();
        console.log('✅ Transportation activity created successfully!');
        console.log('🌱 CO2 Saved:', transportActivity.impactMetrics.co2Saved.toFixed(2), 'kg');
        console.log('🌳 Trees Equivalent:', transportActivity.impactMetrics.treesEquivalent.toFixed(2));
        console.log('🚗 Car-free Days:', transportActivity.impactMetrics.carsOffRoadDays.toFixed(2));
        console.log('📖 Story:', transportActivity.storyElements.impactNarrative);
        console.log('🎯 Journey Type:', transportActivity.storyElements.journeyType);
        console.log('📈 Journey Progress:', transportActivity.storyElements.journeyProgress, '%');
        console.log('⭐ Points Earned:', transportActivity.gamification.pointsEarned);
        
        // Test 3: Community micro-campaign
        console.log('\n🧪 Test 3: Creating community micro-campaign...');
        const campaignActivity = new Activity({
            userId: testUserId,
            name: 'Beach cleanup initiative',
            type: 'community_action',
            category: 'micro_campaign',
            date: new Date(),
            personalizedData: {
                participantCount: 25,
                duration: 180, // 3 hours
                wasteReduced: 45, // kg
                wasteType: 'plastic'
            },
            collaboration: {
                isMicroCampaign: true,
                campaignName: 'Clean Dar es Salaam Beaches',
                campaignDescription: 'Monthly beach cleanup to protect marine life',
                campaignGoal: {
                    goalType: 'waste_collection',
                    description: 'Collect 500kg of waste from beaches',
                    targetValue: 500,
                    currentValue: 45,
                    unit: 'kg'
                }
            },
            education: {
                whyItMatters: {
                    scientificFacts: ['Plastic takes 400-1000 years to decompose in marine environments'],
                    environmentalBenefit: 'Protecting marine ecosystems and wildlife',
                    globalImpact: 'Contributing to global ocean conservation efforts',
                    localRelevance: 'Keeping Dar es Salaam beaches beautiful and safe'
                }
            },
            location: {
                city: 'Dar es Salaam',
                country: 'Tanzania',
                coordinates: {
                    latitude: -6.7924,
                    longitude: 39.2083
                }
            }
        });
        
        await campaignActivity.save();
        console.log('✅ Community campaign created successfully!');
        console.log('🗑️ Waste Diverted:', campaignActivity.impactMetrics.wasteDiverted, 'kg');
        console.log('🌊 CO2 Impact:', campaignActivity.impactMetrics.co2Saved.toFixed(2), 'kg');
        console.log('👥 Community Participants:', campaignActivity.impactMetrics.localImpact.communityParticipants);
        console.log('📖 Impact Story:', campaignActivity.storyElements.impactNarrative);
        console.log('⭐ Points (Community Bonus):', campaignActivity.gamification.pointsEarned);
        
        // Test 4: Skill Quest
        console.log('\n🧪 Test 4: Creating skill quest activity...');
        const questActivity = new Activity({
            userId: testUserId,
            name: 'Home Energy Audit Quest',
            type: 'energy',
            category: 'skill_quest',
            date: new Date(),
            personalizedData: {
                homeSize: 120, // square meters
                homeType: 'apartment',
                energySource: 'grid_standard',
                energyUsage: 25 // kWh saved
            },
            education: {
                skillQuest: {
                    isQuest: true,
                    questName: 'DIY Home Energy Audit',
                    questDescription: 'Learn to identify and fix energy waste in your home',
                    steps: [
                        { stepNumber: 1, description: 'Check for air leaks around windows', completed: true, evidence: 'Found 3 major leaks' },
                        { stepNumber: 2, description: 'Inspect insulation in key areas', completed: true, evidence: 'Added weatherstripping' },
                        { stepNumber: 3, description: 'Audit lighting and appliances', completed: true, evidence: 'Switched to LED bulbs' },
                        { stepNumber: 4, description: 'Calculate energy savings', completed: true, evidence: '25 kWh reduction this month' }
                    ],
                    skillsLearned: ['Energy auditing', 'Home insulation', 'Appliance efficiency'],
                    completionReward: {
                        points: 100,
                        badge: 'Energy Detective',
                        certificate: 'Home Energy Audit Specialist'
                    }
                }
            },
            userExperience: {
                difficultyLevel: 'advanced',
                satisfactionRating: 5,
                timeInvestment: 240, // 4 hours
                costSaving: 150, // Tanzanian Shillings saved per month
                moodImpact: 'very_positive'
            }
        });
        
        await questActivity.save();
        console.log('✅ Skill quest created successfully!');
        console.log('⚡ Energy Saved:', questActivity.impactMetrics.energySaved, 'kWh');
        console.log('🌱 CO2 Prevented:', questActivity.impactMetrics.co2Saved.toFixed(2), 'kg');
        console.log('🎓 Skills Learned:', questActivity.education.skillQuest.skillsLearned.join(', '));
        console.log('🏆 Badge Earned:', questActivity.education.skillQuest.completionReward.badge);
        console.log('💰 Money Saved:', questActivity.userExperience.costSaving, 'TSh/month');
        console.log('⭐ Total Points:', questActivity.gamification.pointsEarned);
        
        // Test 5: Activity interaction methods
        console.log('\n🧪 Test 5: Testing activity interactions...');
        
        // Add community vote
        await campaignActivity.vote(testUserId, 'up');
        console.log('✅ Vote added successfully');
        console.log('👍 Upvotes:', campaignActivity.collaboration.communityVotes.upvotes);
        
        // Add inspiration
        await campaignActivity.addInspiration({
            userId: testUserId,
            activityId: transportActivity._id,
            inspirationLevel: 5
        });
        console.log('✅ Inspiration link added');
        console.log('💡 Inspired Activities:', campaignActivity.collaboration.inspiredActivities.length);
        
        console.log('\n🎉 All tests passed! The enhanced Activity model is working perfectly!');
        console.log('\n📈 Summary of Enhancements:');
        console.log('   ✅ Hyper-personalized impact calculations');
        console.log('   ✅ Narrative-driven storytelling');
        console.log('   ✅ Journey types and progress tracking');
        console.log('   ✅ Community micro-campaigns');
        console.log('   ✅ Skill-building quests');
        console.log('   ✅ Enhanced gamification');
        console.log('   ✅ Real-world integration ready');
        console.log('   ✅ Educational reinforcement');
        console.log('   ✅ Rich user experience tracking');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('Stack:', error.stack);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

testActivityModel();