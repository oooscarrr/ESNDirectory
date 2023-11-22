import express from 'express';
import {
    validate_login_info,
    create_user,
    list_users,
    logout,
    change_last_status,
    getUserSosMessage
} from '../controllers/userController.js';
import authorization from '../middlewares/authorization.js';

const router = express.Router();

router.get('/:username/validation', validate_login_info);
router.post('', create_user);
router.post('/logout', authorization, logout);
router.get('', authorization, list_users);
router.post('/status', authorization, change_last_status);
router.get('/sos-message/:userId', authorization, getUserSosMessage);


export default router;