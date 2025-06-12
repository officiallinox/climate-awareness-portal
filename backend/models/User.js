const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other', 'prefer not to say'],
        required: false
    },
    dob: {
        type: Date,
        required: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    initiatives: {
        joined: [{
            initiative: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Initiative'
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
        organized: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Initiative'
        }]
    },
    stats: {
        initiativesJoined: {
            type: Number,
            default: 0
        },
        initiativesCompleted: {
            type: Number,
            default: 0
        },
        initiativesOrganized: {
            type: Number,
            default: 0
        },
        co2Reduced: {
            type: Number,
            default: 0
        },
        treesPlanted: {
            type: Number,
            default: 0
        },
        wasteCollected: {
            type: Number,
            default: 0
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();
    
    try {
        console.log('Hashing password for user:', this._id);
        // Hash password with cost of 12
        const hashedPassword = await bcrypt.hash(this.password, 12);
        this.password = hashedPassword;
        console.log('Password hashed successfully');
        next();
    } catch (error) {
        console.error('Error hashing password:', error);
        next(error);
    }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
    console.log('Comparing password for user:', this._id);
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        console.log('Password match result:', isMatch);
        return isMatch;
    } catch (error) {
        console.error('Error comparing passwords:', error);
        throw error;
    }
};

// Method to join initiative
userSchema.methods.joinInitiative = function(initiativeId) {
    const alreadyJoined = this.initiatives.joined.some(
        item => item.initiative.toString() === initiativeId.toString()
    );
    
    if (!alreadyJoined) {
        this.initiatives.joined.push({
            initiative: initiativeId,
            status: 'joined'
        });
        this.stats.initiativesJoined += 1;
    }
    
    return this.save();
};

// Method to complete initiative
userSchema.methods.completeInitiative = function(initiativeId, impact = {}) {
    const joinedInitiative = this.initiatives.joined.find(
        item => item.initiative.toString() === initiativeId.toString()
    );
    
    if (joinedInitiative) {
        joinedInitiative.status = 'completed';
        this.stats.initiativesCompleted += 1;
        
        // Add impact to user stats
        if (impact.co2Reduced) this.stats.co2Reduced += impact.co2Reduced;
        if (impact.treesPlanted) this.stats.treesPlanted += impact.treesPlanted;
        if (impact.wasteCollected) this.stats.wasteCollected += impact.wasteCollected;
    }
    
    return this.save();
};

module.exports = mongoose.model('User', userSchema);
