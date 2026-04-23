import { Router } from 'express';
import * as memoController from '../controllers/memo.controller.js';

const router = Router();

router.get('/', memoController.getMemos);
router.post('/', memoController.createMemo);
router.put('/:id', memoController.updateMemo);
router.delete('/:id', memoController.deleteMemo);

export default router;
