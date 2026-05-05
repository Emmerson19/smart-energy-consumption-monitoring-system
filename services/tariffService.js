import Tariff from '../models/Tariff.js';

export const getActiveTariff = async () => {
    let tariff = await Tariff.findOne({ isActive: true }).sort({ effectiveDate: -1 });
    if (!tariff) {
        tariff = await Tariff.create({ ratePerKWh: 0.15, currency: 'USD', description: 'Default tariff rate' });
    }
    return tariff;
};

export const listTariffs = async (limit = 50, page = 1) => {
    const skip = (page - 1) * limit;
    const tariffs = await Tariff.find()
        .sort({ effectiveDate: -1 })
        .limit(limit)
        .skip(skip);
    const total = await Tariff.countDocuments();
    return { tariffs, pagination: { total, page, pages: Math.ceil(total / limit) } };
};

export const createTariff = async (tariffData) => {
    if (tariffData.isActive) {
        await Tariff.updateMany({ isActive: true }, { isActive: false });
    }
    const tariff = new Tariff(tariffData);
    await tariff.save();
    return tariff;
};

export const updateTariff = async (tariffId, updateData) => {
    if (updateData.isActive) {
        await Tariff.updateMany({ isActive: true }, { isActive: false });
    }
    const tariff = await Tariff.findByIdAndUpdate(tariffId, updateData, { new: true, runValidators: true });
    if (!tariff) {
        throw new Error('Tariff not found');
    }
    return tariff;
};
