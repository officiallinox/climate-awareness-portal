const mongoose = require('mongoose');

const initiativeSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  description: { 
    type: String, 
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['reforestation', 'cleanup', 'education', 'renewable', 'conservation', 'recycling'],
    default: 'conservation'
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  location: {
    address: String,
    city: String,
    state: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['joined', 'attended', 'completed', 'cancelled'],
      default: 'joined'
    }
  }],
  maxParticipants: {
    type: Number,
    default: 100
  },
  requirements: [String],
  materials: [String],
  impact: {
    expectedCO2Reduction: Number,
    expectedTreesPlanted: Number,
    expectedWasteCollected: Number,
    actualCO2Reduction: Number,
    actualTreesPlanted: Number,
    actualWasteCollected: Number
  },
  images: [String],
  contactInfo: {
    email: String,
    phone: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for participant count
initiativeSchema.virtual('participantCount').get(function() {
  return this.participants ? this.participants.length : 0;
});

// Virtual for available spots
initiativeSchema.virtual('availableSpots').get(function() {
  return this.maxParticipants - this.participantCount;
});

// Virtual for is full
initiativeSchema.virtual('isFull').get(function() {
  return this.participantCount >= this.maxParticipants;
});

// Index for better query performance
initiativeSchema.index({ category: 1, status: 1, date: 1 });
initiativeSchema.index({ 'location.city': 1 });
initiativeSchema.index({ organizer: 1 });

module.exports = mongoose.model('Initiative', initiativeSchema);