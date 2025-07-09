import  express  from 'express';
import protectedRoutes from '../middleware/protectedRoutes.js';
import { createGroup, deleteGroup, getGroupMessages, getUserGroups, sendGroupMessage } from '../controllers/group.controller.js';

const router = express.Router();

router.post('/create',protectedRoutes,createGroup);
router.post('/send/:groupId',protectedRoutes,sendGroupMessage);
router.delete('/:groupId',protectedRoutes,deleteGroup);
router.get('/group/:groupId',protectedRoutes,getGroupMessages);
router.get('/',protectedRoutes,getUserGroups);

export default router;
