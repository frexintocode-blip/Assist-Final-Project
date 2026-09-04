import Service from '../models/Service.js';
import { catchError } from '../utils/catchError.js';

export const createService = catchError(async (req, res) => {
  const { title, category, description, yearsOfExperience } = req.body;

  const service = await Service.create({
    provider: req.user._id,
    title,
    category,
    description,
    yearsOfExperience,
    certificationFile: req.file ? `/${req.file.path.replace(/\\/g, '/')}` : ''
  });

  res.status(201).json({ success: true, data: service });
});

export const getApprovedServices = catchError(async (req, res) => {
  const { category } = req.query;
  const filter = { status: 'approved' };

  if (category) filter.category = category;

  // Exclude phone & email from provider population to protect direct contact details
  const services = await Service.find(filter)
    .populate('provider', 'name adminRatingScore completedJobsCount businessLocation businessLicenseFile certifcationFile')
    .sort({ 'provider.adminRatingScore': -1 });

  // Centralized admin contact payload from environment variables or defaults
  const adminContact = {
    phone: process.env.ADMIN_PHONE || "+251 911 00 00 00",
    email: process.env.ADMIN_EMAIL || "support@assistmarketplace.com"
  };

  res.json({
    success: true,
    data: services,
    adminContact
  });
});

export const requestServiceUpdate = catchError(async (req, res) => {
  const service = await Service.findOne({ _id: req.params.id, provider: req.user._id });

  if (!service) {
    res.status(404);
    throw new Error('Active service listing matching your account ownership was not found.');
  }

  const updateData = { ...req.body };

  delete updateData.rating;
  if (req.file) {
    updateData.certificationFile = `/${req.file.path.replace(/\\/g, '/')}`;
  }

  service.pendingUpdates = updateData;
  service.isUpdatePending = true;

  await service.save();
  res.json({ success: true, message: 'Your service updates have been queued for administrative review.' });
});

export const getMyServices = async (req, res) => {
  try {
    const services = await Service.find({ provider: req.user._id });
    res.status(200).json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('provider', 'name adminRatingScore completedJobsCount');
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};