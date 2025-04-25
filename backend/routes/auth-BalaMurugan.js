import express from 'express';
import * as userController from '../controller/user.js';

const router = express.Router()

router.route('/createUser').post(userController.createUser)
// router.route('/').get(userController.fetchUser)
// router.route('/:id').get(userController.getUserDetails)
// router.route('/update/:id').put(userController.updateUser)
// router.route('/delete/:id').delete(userController.deleteUser)




export default router