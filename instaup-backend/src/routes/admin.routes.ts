import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';

const router = Router();

// 대시보드 메트릭스
router.get('/dashboard', adminController.getMetrics);

// Product 관리 API
router.get('/products', adminController.getProducts);
router.post('/products', adminController.createProduct);
router.put('/products/:id', adminController.updateProduct);
router.patch('/products/:id/toggle', adminController.toggleProductStatus);
router.post('/products/:id/duplicate', adminController.duplicateProduct);
router.delete('/products/:id', adminController.deleteProduct);

// 플랫폼 관리 API
router.get('/platforms', adminController.getPlatforms);
router.post('/platforms', adminController.createPlatform);
router.put('/platforms/:id', adminController.updatePlatform);
router.delete('/platforms/:id', adminController.deletePlatform);

// 주문 관리 API
router.get('/orders', adminController.getOrders);
router.put('/orders/:id/status', adminController.updateOrderStatus);

// 알림 관리 API
router.get('/notifications', adminController.getNotifications);

export default router;
