import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { Medicine } from './medicine.model';
import { MedicineServices } from './medicine.service';
import medicineValidationSchema from './medicine.validation';
import updateMedicineSchema from './updateMedicine.validation';
//import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';

const createAMedicine = catchAsync(async (req, res) => {
  const {
    name,
    Img,
    brand,
    price,
    symptoms,
    description,
    manufacturerDetails,
    genericName,
    strength,
    dosCategory,
    quantity,
    inStock,
    expiryDate,
  } = req.body;
  const validatedData = medicineValidationSchema.parse({
    name,
    Img,
    brand,
    price,
    symptoms,
    description,
    manufacturerDetails,
    genericName,
    strength,
    dosCategory,
    quantity,
    inStock,
    expiryDate,
  });

  const newMedicine = new Medicine(validatedData);
  const result = await newMedicine.save();

  sendResponse.sendCreateDataResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Medicine is created successfully',
    data: result,
  });
});

const getAllMedicines = catchAsync(async (req, res) => {
  const result = await MedicineServices.getAllMedicinesFromDB(req.query);
  sendResponse.sendDataResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Medicine retrieved successfully',
    data: result,
  });
});

const getASpecificMedicine = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await MedicineServices.getASpecificMedicineFromDB(id);

  sendResponse.sendDataResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Medicine retrieved successfully',
    data: result,
  });
});

const updateAMedicine = catchAsync(async (req, res) => {
  const validated = updateMedicineSchema.parse(req);
  const { id } = validated.params;
  const { price, quantity } = validated.body;

  const updatedMedicine = await MedicineServices.updateAMedicineFromDB(id, {
    price,
    quantity,
  });

  sendResponse.sendDataResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Medicine Updated Successfully',
    data: updatedMedicine,
  });
});

const deleteAMedicine = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await MedicineServices.deleteAMedicineFromDB(id);

  sendResponse.sendDataResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Medicine deleted successfully',
    data: {},
  });
});

export const MedicineControllers = {
  createAMedicine,
  getAllMedicines,
  getASpecificMedicine,
  updateAMedicine,
  deleteAMedicine,
};
