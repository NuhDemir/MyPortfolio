const mongoose = require('mongoose');


const commentSchema = new mongoose.Schema({
authorName: {
    type: String,
    required: [true, 'Author name is required.'],
    trim: true,
},
authorEmail: {
    //opsiyonel frontend kısmında gösterilmeyebilir
    type:String,
    trim:true,
    lowercase:true,
},
content:  {
    type:String,
    required: [true, 'Content is required.'],
    trim:true
},
targetId: {
    type: String,
    required: [true, 'Target ID is required.'],
},
targetType: {
    type:String,
    required: [true, 'Target type is required.'],
    enum:  ['project','article']//olası değerler

},


isApproved: {
    type: Boolean,
    default: false
},
createdAt: {
    type: Date,
    default: Date.now
}

});

const Comment = mongoose.model('Comment',commentSchema);

module.exports = Comment;