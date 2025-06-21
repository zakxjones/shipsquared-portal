// Utility to map a DB order (and optionally a platform order) to the API response shape
export function mapOrderForApi(dbOrder: any, platformOrder?: any) {
  return {
    ...dbOrder,
    orderNumber: dbOrder.orderNumber || dbOrder.name,
    customerName:
      dbOrder.customerName ||
      dbOrder.shippingAddress?.name ||
      dbOrder.billingAddress?.name ||
      '',
    paymentStatus:
      dbOrder.paymentStatus ||
      platformOrder?.paymentStatus ||
      dbOrder.displayFinancialStatus ||
      dbOrder.status ||
      '-',
    total:
      typeof dbOrder.total === 'number'
        ? dbOrder.total
        : dbOrder.totalPriceSet?.shopMoney?.amount
        ? parseFloat(dbOrder.totalPriceSet.shopMoney.amount)
        : 0,
  };
} 