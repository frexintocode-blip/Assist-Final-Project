import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  category: { type: String, enum: ['electrician', 'tutor', 'plumber', 'dishworker', 'carpenter', 'painter', 'cleaner', 'mechanic'], required: true },
  description: { type: String, required: true },
  certificationFile: { data: Buffer, contentType: String, default: '' },
  yearsOfExperience: { type: Number, default: '' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  
  contactChannel: {
    phone: { type: String, default: () => process.env.ADMIN_PHONE },
    representative: { type: String, default: () => process.env.ADMIN_REPRESENTATIVE },
    instruction: { type: String, default: 'Call the ASSIT coordination registry desk to schedule this specialist.' }
  },

  isUpdatePending: { type: Boolean, default: false },
  
  pendingUpdates: {
  title: { type: String },
  category: { type: String },
  description: { type: String },
  certificationFile: { data: Buffer, contentType: String}, // Updated here as well
  yearsOfExperience: { type: Number }
}
}, { timestamps: true });

export default mongoose.model('Service', serviceSchema);
