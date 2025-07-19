import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true, // Başındaki ve sonundaki boşlukları siler
    minlength: 3,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["admin", "user"], // Bu alan sadece 'admin' veya 'user' olabilir
    default: "user", // Varsayılan değer 'user' olacak
  },
  createdAt: {
    type: Date,
    default: Date.now, // Oluşturulma tarihi otomatik olarak atanır
  },
});

const User = mongoose.model("User", userSchema);

export default User;
