// Database service for real backend implementation
import { RiskReport, InfluencerData } from '@/types';
import { toast } from '@/hooks/use-toast';

// LocalStorage keys
const INFLUENCERS_DB_KEY = 'influencers_database';
const REPORTS_DB_KEY = 'reports_database';
const ADMIN_CREDENTIALS_KEY = 'admin_credentials';

// Default admin credentials
const DEFAULT_ADMIN = {
  username: 'admin',
  password: '123456' // As requested, simple password for demo
};

// Initialize database with default admin
export const initializeDatabase = () => {
  // Set up admin credentials if not exists
  const adminExists = localStorage.getItem(ADMIN_CREDENTIALS_KEY);
  if (!adminExists) {
    localStorage.setItem(ADMIN_CREDENTIALS_KEY, JSON.stringify(DEFAULT_ADMIN));
    console.log('Admin credentials initialized');
  }
  
  // Initialize empty collections if they don't exist
  if (!localStorage.getItem(INFLUENCERS_DB_KEY)) {
    localStorage.setItem(INFLUENCERS_DB_KEY, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(REPORTS_DB_KEY)) {
    localStorage.setItem(REPORTS_DB_KEY, JSON.stringify([]));
  }
};

// Admin authentication
export const authenticateAdmin = (username: string, password: string): boolean => {
  try {
    const adminData = localStorage.getItem(ADMIN_CREDENTIALS_KEY);
    if (!adminData) return false;
    
    const admin = JSON.parse(adminData);
    return admin.username === username && admin.password === password;
  } catch (error) {
    console.error('Authentication error:', error);
    return false;
  }
};

// Influencer CRUD operations
export const getAllInfluencers = (): InfluencerData[] => {
  try {
    const data = localStorage.getItem(INFLUENCERS_DB_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting influencers:', error);
    return [];
  }
};

export const getInfluencerByHandle = (handle: string): InfluencerData | null => {
  try {
    const influencers = getAllInfluencers();
    const normalizedHandle = handle.toLowerCase().replace('@', '');
    return influencers.find(inf => inf.handle.toLowerCase() === normalizedHandle) || null;
  } catch (error) {
    console.error('Error getting influencer:', error);
    return null;
  }
};

export const saveInfluencer = (influencer: InfluencerData): boolean => {
  try {
    const influencers = getAllInfluencers();
    const existingIndex = influencers.findIndex(
      inf => inf.handle.toLowerCase() === influencer.handle.toLowerCase()
    );
    
    if (existingIndex >= 0) {
      // Update existing
      influencers[existingIndex] = influencer;
    } else {
      // Add new
      influencers.push(influencer);
    }
    
    localStorage.setItem(INFLUENCERS_DB_KEY, JSON.stringify(influencers));
    return true;
  } catch (error) {
    console.error('Error saving influencer:', error);
    return false;
  }
};

export const deleteInfluencer = (handle: string): boolean => {
  try {
    const influencers = getAllInfluencers();
    const normalizedHandle = handle.toLowerCase().replace('@', '');
    const filteredInfluencers = influencers.filter(
      inf => inf.handle.toLowerCase() !== normalizedHandle
    );
    
    localStorage.setItem(INFLUENCERS_DB_KEY, JSON.stringify(filteredInfluencers));
    return true;
  } catch (error) {
    console.error('Error deleting influencer:', error);
    return false;
  }
};

// Reports CRUD operations
export const getAllReports = (): RiskReport[] => {
  try {
    const data = localStorage.getItem(REPORTS_DB_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting reports:', error);
    return [];
  }
};

export const getReportById = (id: string): RiskReport | null => {
  try {
    const reports = getAllReports();
    return reports.find(report => report.id === id) || null;
  } catch (error) {
    console.error('Error getting report:', error);
    return null;
  }
};

export const getReportsByInfluencer = (handle: string): RiskReport[] => {
  try {
    const reports = getAllReports();
    const normalizedHandle = handle.toLowerCase().replace('@', '');
    return reports.filter(
      report => report.influencerData.handle.toLowerCase() === normalizedHandle
    );
  } catch (error) {
    console.error('Error getting reports by influencer:', error);
    return [];
  }
};

export const saveReport = (report: RiskReport): boolean => {
  try {
    const reports = getAllReports();
    const existingIndex = reports.findIndex(r => r.id === report.id);
    
    if (existingIndex >= 0) {
      // Update existing
      reports[existingIndex] = report;
    } else {
      // Add new with ID if not present
      if (!report.id) {
        report.id = `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      }
      reports.unshift(report); // Add to beginning of array
    }
    
    // Keep only the most recent 50 reports
    const trimmedReports = reports.slice(0, 50);
    localStorage.setItem(REPORTS_DB_KEY, JSON.stringify(trimmedReports));
    return true;
  } catch (error) {
    console.error('Error saving report:', error);
    return false;
  }
};

export const deleteReport = (id: string): boolean => {
  try {
    const reports = getAllReports();
    const filteredReports = reports.filter(report => report.id !== id);
    
    localStorage.setItem(REPORTS_DB_KEY, JSON.stringify(filteredReports));
    return true;
  } catch (error) {
    console.error('Error deleting report:', error);
    return false;
  }
};

// Initialize the database when this module is imported
initializeDatabase();
