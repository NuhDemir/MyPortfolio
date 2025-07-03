const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Proje başlığı zorunludur.'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Proje açıklaması zorunludur.'],
    },
    technologies: [{
        type: String,
        required: true
    }],
    imageUrl: {
        type: String,
        required: [true, 'Proje görseli zorunludur.'],
    },
    demoUrl: {
        type: String,
        trim: true,
    },
    repoUrl: {
        type: String,
        trim: true,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true // createdAt ve updatedAt alanlarını otomatik ekler
});

module.exports = mongoose.model('Project', projectSchema);