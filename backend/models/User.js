import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ['provider', 'admin'], default: 'provider' },
  businessLicenseFile: { type: String, default: '' },
  businessLocation: { type: String },
  completedJobsCount: { type: Number}, 
  adminRatingScore: { type: Number, min: 0, max: 5 } 
}, { timestamps: true });

export default mongoose.model('User', userSchema);