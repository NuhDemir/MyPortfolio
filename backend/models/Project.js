const mongoose = require('mongoose');


const projectSchema = new mongoose.Schema({

    title:{
    type: String,
    required: [true, 'Title is required.'],
    trim:true
},

description : {
    type: String,
    required: [true,'Description is required.'],
    trim: true
},
imageUrl: {
    type: String,
    trim: true
},
projectUrl: {//Canlı demo veya ana link
    type: String,
    trim: true
},

githubUrl: {
    type: String,
    trim: true
},

technologies: [{
    type: String,
    trim: true
}],

displayOrder: {//isteğe bağlı sıralama için
    type: Number,
    default: 0 // Varsayılan olarak 0, sıralama için kullanılabilir
},
createdAt: {
    type: Date,
    default: Date.now
}

});

const Project = mongoose.model('Project', performancerojectSchema);

module.exports = Project;