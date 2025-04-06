
import { 
  markFreeReportUsed as saveUsedReport, 
  hasFreeReportUsed as checkReportUsed 
} from '@/services/storageService';

// Mark free report as used
export const markFreeReportUsed = (address: string): void => {
  saveUsedReport(address);
};

// Check if user has used free report
export const hasFreeReportUsed = (address: string): boolean => {
  return checkReportUsed(address);
};
