import  express  from 'express';
import protectedRoutes from '../middleware/protectedRoutes.js';
import createToken from '../controllers/call.controller.js';

const router = express.Router();

router.get('/getToken',protectedRoutes,createToken);

export default router;
