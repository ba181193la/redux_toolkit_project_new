const express = require('express')
const router = express.Router()
const userController=require('../controller/user')

router.route('/createUser').post(userController.createUser)
router.route('/get').get(userController.fetchUser)
router.route('/getOne/:id').get(userController.getUserDetails)
router.route('/update/:id').put(userController.updateUser)
router.route('/delete/:id').delete(userController.deleteUser)




module.exports = router
