const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    goalAmount: { 
        type: Number, 
        required: true 
    },
    slug: { 
        type: String, 
        required: true, 
        unique: true 
    },
    isActive: { 
        type: Boolean, 
        default: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('Campaign', campaignSchema);
