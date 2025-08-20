import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiInfo, FiAlertCircle, FiCalendar, FiMapPin, FiUsers } from 'react-icons/fi';
import AdminSidebar from './AdminSidebar';
import { fetchWithFallback, getMockData } from '../../utils/apiUtils';
import ApiErrorBanner from '../../components/common/ApiErrorBanner';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [contributors, setContributors] = useState([]);
  const [contributorsLoading, setContributorsLoading] = useState(false);
  const [contributorsError, setContributorsError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and is an admin
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('user_type');
    
    if (!token || userType !== 'admin') {
      navigate('/login');
      return;
    }
    
    fetchEvents();
  }, [navigate]);

  const fetchEvents = async () => {
    setIsLoading(true);
    
    try {
      // Use our utility function to handle fallbacks
      const eventsData = await fetchWithFallback('pub/events/');
      
      if (eventsData) {
        setEvents(eventsData);
        setError(null);
      } else {
        // If API call fails, use mock data
        console.log("Using mock data as API calls failed");
        const mockEvents = getMockData('pub/events/');
        setEvents(mockEvents);
        setError('CORS issue detected: Unable to connect to the API due to cross-origin restrictions. Make sure the backend server is running and has proper CORS headers. Showing sample data instead.');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('API connectivity issue: Could not connect to the events API. This could be due to CORS restrictions or the backend server not running. Using sample data for development.');
      
      // Provide mock data even if everything fails
      const mockEvents = getMockData('pub/events/');
      setEvents(mockEvents);
    } finally {
      setIsLoading(false);
    }
  };

  const viewEventDetails = async (event) => {
    setSelectedEvent(event);
    setContributors([]);
    setContributorsError(null);
    setContributorsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const endpoint = `pub/events/${event.event_id}/contributions`;
      
      // Try public endpoint first
      const contributorsData = await fetchWithFallback(endpoint);
      
      if (contributorsData) {
        setContributors(contributorsData);
        return;
      }
      
      // Try admin endpoint as fallback with auth header
      const adminEndpoint = `api/admin/events/${event.event_id}/contributions`;
      const adminData = await fetchWithFallback(adminEndpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (adminData) {
        setContributors(adminData);
        return;
      }
      
      // If both API calls fail, use mock data
      console.log("Using mock contributor data");
      const mockContributors = getMockData(`pub/events/${event.event_id}/contributions`);
      setContributors(mockContributors);
      setContributorsError('API connectivity issue: Unable to fetch contributor data. Showing sample contributors.');
      
    } catch (err) {
      console.error('Error handling contributors:', err);
      setContributorsError('Failed to load contributors data due to connectivity issues.');
      
      // Provide mock data even if everything fails
      const fallbackContributors = getMockData(`pub/events/${event.event_id}/contributions`);
      setContributors(fallbackContributors.slice(0, 1)); // Just use one sample contributor
    } finally {
      setContributorsLoading(false);
    }
  };

  const closeEventDetails = () => {
    setSelectedEvent(null);
    setContributors([]);
    setContributorsError(null);
    setContributorsLoading(false);
  };

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not specified';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <AdminSidebar>
        <div className='p-5'>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">All Events</h1>
          <button 
            onClick={fetchEvents}
            disabled={isLoading}
            className="px-3 py-1.5 bg-primary text-white rounded-md hover:bg-primary-dark flex items-center text-sm"
          >
            {isLoading ? (
              <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></span>
            ) : (
              <span className="mr-1">↻</span>
            )}
            Refresh Data
          </button>
        </div>
        
        {error && (
          <ApiErrorBanner 
            message={error} 
            onRetry={fetchEvents} 
            className="mb-4" 
          />
        )}
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <div key={event.event_id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4">
                  {error && (
                    <div className="bg-amber-100 text-xs text-amber-700 px-2 py-1 rounded inline-flex items-center mb-2">
                      <FiInfo className="mr-1" size={12} />
                      Sample Data
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{event.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>
                  
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <FiCalendar className="mr-1.5" />
                    {formatDate(event.event_date)}
                  </div>
                  
                  {event.location && (
                    <div className="flex items-center text-gray-500 text-sm mb-2">
                      <FiMapPin className="mr-1.5" />
                      {event.location}
                    </div>
                  )}
                  
                  <div className="flex items-center text-gray-500 text-sm">
                    <FiUsers className="mr-1.5" />
                    {event.required_volunteers || 'N/A'} volunteers required
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between">
                    <span 
                      className={`px-2 py-1 text-xs font-semibold rounded-full 
                        ${event.status === 'active' ? 'bg-green-100 text-green-800' : 
                          event.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                          'bg-red-100 text-red-800'}`}
                    >
                      {event.status || 'Unknown'}
                    </span>
                    
                    <button 
                      onClick={() => viewEventDetails(event)}
                      className="text-primary hover:text-primary-dark text-sm font-medium flex items-center"
                    >
                      <FiInfo className="mr-1" /> View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {events.length === 0 && (
              <div className="col-span-full p-4 text-center text-gray-500">
                No events found
              </div>
            )}
          </div>
        )}
        </div>
      </AdminSidebar>
        
      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="p-5">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-semibold text-gray-800">{selectedEvent.title}</h3>
                <button 
                  onClick={closeEventDetails}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
              {error && (
                <ApiErrorBanner 
                  message="Viewing sample data - backend connection unavailable" 
                  className="mb-3 p-2 text-sm" 
                />
              )}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Description</h4>
                  <p className="mt-1">{selectedEvent.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Event Date</h4>
                    <p className="mt-1">{formatDate(selectedEvent.event_date)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Organization ID</h4>
                    <p className="mt-1">{selectedEvent.organization_id}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Location</h4>
                    <p className="mt-1">{selectedEvent.location || 'Not specified'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Status</h4>
                    <p className="mt-1 capitalize">{selectedEvent.status || 'Unknown'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Start Time</h4>
                    <p className="mt-1">{selectedEvent.start_time || 'Not specified'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">End Time</h4>
                    <p className="mt-1">{selectedEvent.end_time || 'Not specified'}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Volunteers Required</h4>
                  <p className="mt-1">{selectedEvent.required_volunteers || 'Not specified'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Created At</h4>
                  <p className="mt-1">{formatDate(selectedEvent.created_at)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-800 mt-4">Contributors (Volunteers)</h4>
                  {contributorsLoading ? (
                    <div className="text-gray-500">Loading contributors...</div>
                  ) : contributorsError ? (
                    <ApiErrorBanner
                      message={contributorsError}
                      className="mb-2 p-2 text-sm"
                    />
                  ) : contributors.length === 0 ? (
                    <div className="text-gray-500">No contributors found for this event.</div>
                  ) : (
                    <ul className="mt-2 space-y-2">
                      {contributors.map((contrib) => (
                        <li key={contrib.volunteer_id} className="border-b pb-2">
                          <span className="font-semibold">{contrib.name || `Volunteer #${contrib.volunteer_id}`}</span>
                          {contrib.total_hours !== undefined && (
                            <span className="ml-2 text-sm text-gray-600">Hours: {contrib.total_hours}</span>
                          )}
                          {contrib.avg_rating !== undefined && (
                            <span className="ml-2 text-sm text-gray-600">Avg Rating: {contrib.avg_rating}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="mt-5 flex justify-end">
                <button
                  onClick={closeEventDetails}
                  className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminEvents;
