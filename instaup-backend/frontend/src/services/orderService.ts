import { backendApi } from "./backendApi";
import { Order } from "./backendApi";

export const orderService = {
  async createOrder(serviceId: string, quantity: number, targetUrl: string) {
    return backendApi.createOrder({ serviceId, quantity, targetUrl });
  },

  async getOrders(status?: string, page?: number, limit?: number) {
    return backendApi.getOrders({ status, page, limit });
  },

  async updateOrderStatus(id: string, status: string) {
    return backendApi.updateOrderStatus(id, status);
  },
};
