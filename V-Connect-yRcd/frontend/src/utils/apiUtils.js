// apiUtils.js - Utilities for API calls with CORS handling
const API_BASE_URL = 'http://localhost:9000';

/**
 * Fetch data from API with built-in fallbacks
 * This function will attempt to:
 * 1. Use the Vite proxy (for development)
 * 2. Try direct access (for production)
 * 3. Return null if both fail
 */
export async function fetchWithFallback(endpoint, options = {}) {
  // First try with the proxy (which avoids CORS issues in development)
  try {
    const proxyUrl = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const response = await fetch(proxyUrl, options);
    
    if (response.ok) {
      return await response.json();
    }
  } catch (proxyError) {
    console.error('Error fetching via proxy:', proxyError);
  }
  
  // If that fails, try direct access (might work in production environments)
  try {
    const directUrl = endpoint.startsWith('/') 
      ? `${API_BASE_URL}${endpoint}` 
      : `${API_BASE_URL}/${endpoint}`;
      
    const response = await fetch(directUrl, options);
    
    if (response.ok) {
      return await response.json();
    }
  } catch (directError) {
    console.error('Error fetching directly:', directError);
  }
  
  return null;
}

/**
 * Get mock data for a specific endpoint when API is unavailable
 */
export function getMockData(endpoint) {
  // Mock data for events endpoint
  if (endpoint.includes('/pub/events') && !endpoint.includes('contributions')) {
    return [
      {
        event_id: 1,
        title: "Community Cleanup",
        description: "Help clean up the local park and surrounding areas. Bring gloves and comfortable shoes.",
        event_date: "2025-09-15",
        location: "Central Park",
        status: "active",
        start_time: "09:00:00",
        end_time: "13:00:00",
        required_volunteers: 20,
        organization_id: 1,
        created_at: "2025-08-01"
      },
      {
        event_id: 2,
        title: "Food Drive",
        description: "Collecting non-perishable food items for local food banks.",
        event_date: "2025-10-05",
        location: "Community Center",
        status: "active",
        start_time: "10:00:00",
        end_time: "16:00:00",
        required_volunteers: 15,
        organization_id: 2,
        created_at: "2025-08-10"
      },
      {
        event_id: 3,
        title: "Charity Run",
        description: "Annual 5K charity run to raise funds for children's education.",
        event_date: "2025-11-20",
        location: "Downtown",
        status: "active",
        start_time: "07:30:00",
        end_time: "12:00:00",
        required_volunteers: 25,
        organization_id: 3,
        created_at: "2025-08-15"
      }
    ];
  }
  
  // Mock data for contributions endpoint
  if (endpoint.includes('/contributions')) {
    return [
      {
        volunteer_id: 101,
        name: "Alex Johnson",
        total_hours: 12,
        avg_rating: 4.8
      },
      {
        volunteer_id: 102,
        name: "Sam Wilson",
        total_hours: 8,
        avg_rating: 4.5
      },
      {
        volunteer_id: 103,
        name: "Taylor Chen",
        total_hours: 15,
        avg_rating: 4.9
      }
    ];
  }
  
  // Default empty mock data
  return [];
}
