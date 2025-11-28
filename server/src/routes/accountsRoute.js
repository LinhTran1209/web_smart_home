import express from 'express';

import { getAllAccounts, getAccountByEmail, createAccount, updateAccount, deleteAccount} from '../controllers/accountsController.js';

const router = express.Router();

router.get('/', getAllAccounts);

router.post('/', createAccount);

router.get('/:email', getAccountByEmail);

router.put('/:email', updateAccount);

router.delete('/:email', deleteAccount);

export default router;