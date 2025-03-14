
/**
 * Utility functions for generating and managing UUIDs
 */

/**
 * Generates a UUID v4
 * Used for mock data when not authenticated
 */
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Converts a simple ID to a UUID format
 * This is a temporary solution for development/testing
 */
export const friendIdToUuid = (id: string): string => {
  // Check if already a UUID
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return id;
  }
  
  try {
    // Ensure id is a string
    const idStr = String(id);
    
    // For simple numeric IDs in development/testing:
    // Generate a deterministic UUID based on the ID
    return `00000000-0000-0000-0000-${idStr.padStart(12, '0')}`;
  } catch (error) {
    console.error("Error converting ID to UUID:", error, "ID was:", id);
    // Default to a safer fallback if conversion fails
    return `00000000-0000-0000-0000-000000000000`;
  }
};

/**
 * Converts a UUID back to a simple ID format for client-side use
 */
export const uuidToFriendId = (uuid: string): string => {
  // Check for our specific format
  const match = uuid.match(/^00000000-0000-0000-0000-(\d{12})$/);
  if (match) {
    // Return without leading zeros
    return match[1].replace(/^0+/, '') || '0';
  }
  // If not in our specific format, return the full UUID
  return uuid;
};
