//import express from 'express';
import express from 'express';
import { MedicineControllers } from './medicine.controller';

import validateRequest from 'src/app/middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import medicineValidationSchema from './medicine.validation';
//import { updateMedicineSchema  } from './updateProduct.validation';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.admin),
  validateRequest(medicineValidationSchema),
  MedicineControllers.createAMedicine
);

router.get(
  '/',
  //auth( USER_ROLE.admin,USER_ROLE.customer),
  MedicineControllers.getAllMedicines
);

router.get('/:id', MedicineControllers.getASpecificMedicine);

router.put('/:id', auth(USER_ROLE.admin), MedicineControllers.updateAMedicine);

router.delete(
  '/:id',
  auth(USER_ROLE.admin),
  MedicineControllers.deleteAMedicine
);

export const MedicineRoutes = router;
