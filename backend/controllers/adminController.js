import Service from '../models/Service.js';
import User from '../models/User.js';
import { catchError } from '../utils/catchError.js';

export const getAdminDashboard = catchError(async (req, res) => {
  const services = await Service.find()
    .populate('provider', 'name email phone businessLicenseFile businessLocation adminRatingScore completedJobsCount');
  res.json(services);
});

export const moderateService = catchError(async (req, res) => {
  const { status } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    res.status(400);
    throw new Error('Invalid status option. Must be "approved" or "rejected".');
  }

  const service = await Service.findById(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error('Target service listing not found.');
  }

  service.status = status;
  await service.save();
  res.json({ success: true, data: service });
});

export const approveServiceUpdate = catchError(async (req, res) => {
  const { action } = req.body;
  const service = await Service.findById(req.params.id);

  if (!service || !service.isUpdatePending) {
    res.status(400);
    throw new Error('There are no pending configuration updates awaiting audit for this listing.');
  }

  if (action === 'approve') {
    service.title = service.pendingUpdates.title || service.title;
    service.category = service.pendingUpdates.category || service.category;
    service.description = service.pendingUpdates.description || service.description;
    service.certificationFile = service.pendingUpdates.certificationFile || service.certificationFile;
    service.yearsOfExperience = service.pendingUpdates.yearsOfExperience || service.yearsOfExperience;
  }

  service.isUpdatePending = false;
  service.pendingUpdates = undefined;

  await service.save();
  res.json({ success: true, message: `Update request successfully evaluated as: ${action}d.` });
});

export const updateProviderRating = catchError(async (req, res) => {
  const { completedJobsCount, adminRatingScore, rating } = req.body;
  const targetScore = adminRatingScore ?? rating;

  const provider = await User.findById(req.params.providerId);
  if (!provider || provider.role !== 'provider') {
    res.status(404);
    throw new Error('Target provider user profile was not found.');
  }

  if (completedJobsCount !== undefined) provider.completedJobsCount = completedJobsCount;
  if (targetScore !== undefined) provider.adminRatingScore = targetScore;

  await provider.save();

  if (targetScore !== undefined) {
    await Service.updateMany(
      { provider: provider._id },
      { rating: targetScore }
    );
  }
  res.json({ success: true, message: 'Provider internal tracking index updated successfully.' });
});

export const deleteService = catchError(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error('Target service listing could not be found to delete.');
  }
  res.json({ success: true, message: 'Service listing cleanly expunged from database.' });
});

export const deleteProvider = catchError(async (req, res) => {
  const provider = await User.findByIdAndDelete(req.params.id);
  if (!provider) {
    res.status(404);
    throw new Error('Target provider account check failed.');
  }

  await Service.deleteMany({ provider: provider._id });
  res.json({ success: true, message: 'Provider account and linked metrics permanently dissolved.' });
});