const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Kullanıcı adı zorunludur.'],
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'E-posta zorunludur.'],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Şifre zorunludur.'],
        minlength: 6,
        select: false, // Sorgularda şifreyi getirme
    },
    role: {
        type: String,
        enum: ['admin', 'visitor'],
        default: 'visitor',
    },
});

//Şifre hash'leme (kaydetmeden önce)
userSchema.pre('save',async function (next) {
if(!this.isModified('password')) return next();

const salt = await bcrypt.genSalt(10);
this.password = await bcrypt.hash(this.password, salt);
    next();
});

