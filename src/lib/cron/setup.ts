import cron from 'node-cron';
import { refreshOrders } from './refreshOrders';

// Run every 4 hours
export function setupCronJobs() {
  cron.schedule('0 */4 * * *', () => {
    console.log('Running scheduled order refresh...');
    refreshOrders().catch(console.error);
  });
} 