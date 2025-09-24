// Utility functions for consistent date handling without timezone issues

/**
 * Get today's date in YYYY-MM-DD format without timezone issues
 */
export const getToday = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Convert a date to YYYY-MM-DD format without timezone issues
 */
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Create a Date object from YYYY-MM-DD string in local timezone
 */
export const parseLocalDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Extract date part from any date string/timestamp without timezone issues
 */
export const extractDatePart = (dateInput: string | Date): string => {
  if (typeof dateInput === 'string') {
    // If it's already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
      return dateInput;
    }
    // If it's a timestamp, parse it safely
    const date = new Date(dateInput);
    return formatDate(date);
  }
  return formatDate(dateInput);
};

/**
 * Compare two dates (strings or Date objects) safely
 */
export const isSameDate = (date1: string | Date, date2: string | Date): boolean => {
  const dateStr1 = typeof date1 === 'string' ? extractDatePart(date1) : formatDate(date1);
  const dateStr2 = typeof date2 === 'string' ? extractDatePart(date2) : formatDate(date2);
  return dateStr1 === dateStr2;
};

/**
 * Add days to a date safely
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Get day name from date
 */
export const getDayName = (date: Date): string => {
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return dayNames[date.getDay()];
};

/**
 * Format date for display
 */
export const formatDateForDisplay = (dateString: string): string => {
  const date = parseLocalDate(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};