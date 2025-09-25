import express from 'express';
import { newDonation } from '../controllers/donations.controller';
import { authenticationCheck } from '../middlewares/authorization/general.auth';
import { allUserTypes, onlyCitizens } from '../middlewares/authorization/role-based.auth';


export const donationRouter = express.Router();

donationRouter.use(express.json());

donationRouter.post('/new', authenticationCheck, onlyCitizens, newDonation)