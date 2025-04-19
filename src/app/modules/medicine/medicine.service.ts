import { TMedicine } from './medicine.interface';
import { medicineSearchableFields } from './medicine.constant';
import QueryBuilder from 'src/app/builder/QueryBuilder';
import MedicineModel from './medicine.model';
const createAMedicineIntoDB = async ( medicineData: TMedicine) => {

  const medicineExists = await MedicineModel.findOne({ _id: medicineData._id }); 
  if (medicineExists) {
    throw new Error('Medicine with this ID already exists!');
  };
  
  const result = await MedicineModel.create(medicineData); 
  return result;
};

const updateAMedicineFromDB = async (
  id: string,
  updatedMedicineData: Partial<{ price: number; quantity: number}>
) => {

  const medicine = await MedicineModel.findById(id);
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
  const medicineQuery = new QueryBuilder(
    MedicineModel.find()
      .populate('user'),
    query,
  )

    .search(medicineSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
    const meta = await medicineQuery.countTotal();
  const result = await MedicineModel.find(); 
  return {meta,result};
};

const getASpecificMedicineFromDB = async (id: string) => {
  const result = await MedicineModel.findById(id); 
  if (!result) {
    throw new Error('Medicine not found!');
  }
  return result;
};


const deleteAMedicineFromDB = async (id: string) => {
  const result = await MedicineModel.findByIdAndDelete(id)
    
  if (!result) {
    throw new Error('Medicine not found!');
  }
  return result;
};



const updateMedicineInventory = async (medicineId: string, quantity: number) => {
  const medicine = await MedicineModel.findById(medicineId);
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