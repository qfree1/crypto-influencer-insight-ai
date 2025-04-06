
// Mark free report as used
export const markFreeReportUsed = (address: string): void => {
  localStorage.setItem(`freeReport_${address}`, 'true');
};

// Check if user has used free report
export const hasFreeReportUsed = (address: string): boolean => {
  return localStorage.getItem(`freeReport_${address}`) === 'true';
};
