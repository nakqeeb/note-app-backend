const mongoose = require('mongoose');

const noteSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        sections: [{
            sectionTitle: {type: String},
            content: {type: String},
        }],
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Note', noteSchema);