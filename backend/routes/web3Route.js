
import express from 'express';
import * as etherCntrl from '../controller/web3Testnet';

const router = express.Router()

router.route('/ethTransfer').post(etherCntrl.sendSepoliaTransaction)

export default router