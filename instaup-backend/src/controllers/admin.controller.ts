import { Request, Response } from 'express';
import * as adminService from '../services/admin.service';

export const getMetrics = async (req: Request, res: Response) => {
  try {
    const metrics = await adminService.getDashboardMetrics();
    res.status(200).json(metrics);
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Failed to get dashboard metrics', error: error.message });
    } else {
        res.status(500).json({ message: 'Failed to get dashboard metrics', error: 'An unknown error occurred' });
    }
  }
};

// Product 관리 API 컨트롤러들
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, platform, search, page, limit, isActive } = req.query;

    const filters = {
      category: category as string,
      platform: platform as string,
      search: search as string,
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 50,
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
    };

    const result = await adminService.getProducts(filters);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get products',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const productData = req.body;
    const product = await adminService.createProduct(productData);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const productData = req.body;
    const product = await adminService.updateProduct(id, productData);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await adminService.deleteProduct(id);
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// 플랫폼 관리 API 컨트롤러들
export const getPlatforms = async (req: Request, res: Response) => {
  try {
    const platforms = await adminService.getPlatforms();
    res.status(200).json({ success: true, data: platforms });
  } catch (error) {
    console.error('Error getting platforms:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get platforms',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const createPlatform = async (req: Request, res: Response) => {
  try {
    const platformData = req.body;
    const platform = await adminService.createPlatform(platformData);
    res.status(201).json({ success: true, data: platform });
  } catch (error) {
    console.error('Error creating platform:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create platform',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updatePlatform = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const platformData = req.body;
    const platform = await adminService.updatePlatform(id, platformData);
    res.status(200).json({ success: true, data: platform });
  } catch (error) {
    console.error('Error updating platform:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update platform',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deletePlatform = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await adminService.deletePlatform(id);
    res.status(200).json({ success: true, message: 'Platform deleted successfully' });
  } catch (error) {
    console.error('Error deleting platform:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete platform',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// 주문 관리 API 컨트롤러들
export const getOrders = async (req: Request, res: Response) => {
  try {
    const { status, platform, search, page, limit } = req.query;

    const filters = {
      status: status as string,
      platform: platform as string,
      search: search as string,
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 50,
    };

    const result = await adminService.getOrders(filters);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error getting orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get orders',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await adminService.updateOrderStatus(id, status);
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// 알림 관리 API 컨트롤러들
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await adminService.getNotifications();
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    console.error('Error getting notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get notifications',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
