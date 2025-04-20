import QueryBuilder from '../../builder/QueryBuilder';
import { medicineSearchableFields } from './medicine.constant';
import { TMedicine } from './medicine.interface';
import { Medicine } from './medicine.model';
const createAMedicineIntoDB = async (medicineData: TMedicine) => {
  const medicineExists = await Medicine.findOne({ _id: medicineData._id });
  if (medicineExists) {
    throw new Error('Medicine with this ID already exists!');
  }

  const result = await Medicine.create(medicineData);
  return result;
};

const updateAMedicineFromDB = async (
  id: string,
  updatedMedicineData: Partial<{ price: number; quantity: number }>
) => {
  const medicine = await Medicine.findById(id);
  if (!medicine) {
    throw new Error('Medicine not found');
  }

  if (updatedMedicineData.price) {
    medicine.price = updatedMedicineData.price;
  }

  if (updatedMedicineData.quantity) {
    medicine.quantity = updatedMedicineData.quantity;
  }

  await medicine.save();

  return medicine;
};

const getAllMedicinesFromDB = async (query: Record<string, unknown>) => {
  const medicineQuery = new QueryBuilder(Medicine.find(), query)

    .search(medicineSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const meta = await medicineQuery.countTotal();
  const result = await medicineQuery.modelQuery;
  return { meta, result };
};

const getASpecificMedicineFromDB = async (id: string) => {
  const result = await Medicine.findById(id);
  if (!result) {
    throw new Error('Medicine not found!');
  }
  return result;
};

const deleteAMedicineFromDB = async (id: string) => {
  const result = await Medicine.findByIdAndDelete(id);

  if (!result) {
    throw new Error('Medicine not found!');
  }
  return result;
};

const updateMedicineInventory = async (
  medicineId: string,
  quantity: number
) => {
  const medicine = await Medicine.findById(medicineId);
  if (!medicine) {
    throw new Error('Medicine not found');
  }

  if (medicine.quantity < quantity) {
    throw new Error('Insufficient stock available');
  }
  medicine.quantity -= quantity;

  if (medicine.quantity === 0) {
    medicine.inStock = false;
  }

  await medicine.save();

  return medicine;
};

export const MedicineServices = {
  createAMedicineIntoDB,
  updateAMedicineFromDB,
  getAllMedicinesFromDB,
  getASpecificMedicineFromDB,
  deleteAMedicineFromDB,
  updateMedicineInventory,
};
