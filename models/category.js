const mongoose = require('mongoose');

const categorySchema = mongoose.Schema(
    {
        name: {
            type: String,
        },
        icon: {
            type: String,
        },
        color: {
            type: String,
        },
        creator: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model('Category', categorySchema);
