import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiCalendar, FiClock, FiCheckCircle, FiHeart, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';
import OrganizationSidebar from './OrganizationSidebar';
import LoadingSpinner from '../../components/LoadingSpinner';

// Animation variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  }
};

const OrganizationDashboard = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    pastEvents: 0,
    totalVolunteers: 0,
    pendingApplications: 0
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in and is an organization
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('user_type');
    
    if (!token || userType !== 'organization') {
      navigate('/login');
      return;
    }
    
    // Fetch dashboard data
    fetchDashboardData();
  }, [navigate]);
  
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const organizationId = localStorage.getItem('user_id');
      const token = localStorage.getItem('token');
      
      // Fetch events created by this organization
      const eventsResponse = await fetch(`/api/org/events/${organizationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!eventsResponse.ok) {
        throw new Error('Failed to fetch events data');
      }
      
      const eventsData = await eventsResponse.ok ? await eventsResponse.json() : [];
      
      // Calculate stats from events data
      const currentDate = new Date();
      const activeEvents = eventsData.filter(event => new Date(event.event_date) >= currentDate);
      const pastEvents = eventsData.filter(event => new Date(event.event_date) < currentDate);
      
      // Get all applications across all events to count volunteers
      let allVolunteers = new Set();
      let pendingApplications = 0;
      
      // For each event, fetch applications
      const applicationsPromises = eventsData.map(event => 
        fetch(`/api/org/events/${event.event_id}/applications`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      );
      
      const applicationsResponses = await Promise.all(applicationsPromises);
      const applicationsData = await Promise.all(
        applicationsResponses.map(response => 
          response.ok ? response.json() : []
        )
      );
      
      // Flatten applications and count stats
      applicationsData.forEach(eventApplications => {
        eventApplications.forEach(app => {
          allVolunteers.add(app.volunteer_id);
          if (app.status === 'pending') {
            pendingApplications++;
          }
        });
      });
      
      setStats({
        totalEvents: eventsData.length,
        activeEvents: activeEvents.length,
        pastEvents: pastEvents.length,
        totalVolunteers: allVolunteers.size,
        pendingApplications
      });
      
      // Set recent events (sort by date, newest first)
      const sortedEvents = [...eventsData].sort((a, b) => 
        new Date(b.event_date) - new Date(a.event_date)
      );
      setRecentEvents(sortedEvents.slice(0, 5)); // Get up to 5 most recent events
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
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
    <div className="flex min-h-screen bg-gray-50">
      <OrganizationSidebar>
        <div className="w-full px-4 py-1 sm:px-6 md:px-8 lg:px-10">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6"
          >
            Organization Dashboard
          </motion.h1>
          
          {isLoading ? (
            <LoadingSpinner />
          ) : error ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 text-red-600 p-4 rounded-md"
            >
              {error}
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-8"
            >
              {/* Stats Cards */}
              <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <motion.div 
                  whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                  className="bg-white rounded-lg shadow p-4 sm:p-6 flex items-center transition-shadow duration-300"
                >
                  <div className="rounded-full bg-blue-100 p-3 sm:p-4 mr-3 sm:mr-4">
                    <FiCalendar className="text-primary text-lg sm:text-xl" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Total Events</p>
                    <motion.h3 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="text-xl sm:text-2xl font-bold"
                    >
                      {stats.totalEvents}
                    </motion.h3>
                  </div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                  className="bg-white rounded-lg shadow p-4 sm:p-6 flex items-center transition-shadow duration-300"
                >
                  <div className="rounded-full bg-green-100 p-3 sm:p-4 mr-3 sm:mr-4">
                    <FiClock className="text-green-600 text-lg sm:text-xl" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Active Events</p>
                    <motion.h3 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="text-xl sm:text-2xl font-bold"
                    >
                      {stats.activeEvents}
                    </motion.h3>
                  </div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                  className="bg-white rounded-lg shadow p-4 sm:p-6 flex items-center transition-shadow duration-300"
                >
                  <div className="rounded-full bg-purple-100 p-3 sm:p-4 mr-3 sm:mr-4">
                    <FiUsers className="text-purple-600 text-lg sm:text-xl" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Total Volunteers</p>
                    <motion.h3 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="text-xl sm:text-2xl font-bold"
                    >
                      {stats.totalVolunteers}
                    </motion.h3>
                  </div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                  className="bg-white rounded-lg shadow p-4 sm:p-6 flex items-center transition-shadow duration-300"
                >
                  <div className="rounded-full bg-yellow-100 p-3 sm:p-4 mr-3 sm:mr-4">
                    <FiCheckCircle className="text-yellow-600 text-lg sm:text-xl" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Pending Applications</p>
                    <motion.h3 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      className="text-xl sm:text-2xl font-bold"
                    >
                      {stats.pendingApplications}
                    </motion.h3>
                  </div>
                </motion.div>
              </motion.div>
              
              {/* Recent Events */}
              <motion.div 
                variants={itemVariants}
                className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6 sm:mb-8"
              >
                <h2 className="text-lg sm:text-xl font-bold mb-4">Recent Events</h2>
                
                {recentEvents.length === 0 ? (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-gray-500 text-center py-8"
                  >
                    No events created yet. Create your first event!
                  </motion.p>
                ) : (
                  <>
                    {/* Desktop/tablet view */}
                    <div className="hidden sm:block overflow-x-auto -mx-4 sm:mx-0 rounded-lg">
                      <table className="min-w-full bg-white">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Location</th>
                            <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {recentEvents.map((event) => {
                            const eventDate = new Date(event.event_date);
                            const isUpcoming = eventDate >= new Date();
                            
                            return (
                              <tr 
                                key={event.event_id}
                                className="hover:bg-gray-50 transition-colors"
                              >
                                <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-900">{event.title}</td>
                                <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-gray-500">{formatDate(event.event_date)}</td>
                                <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-gray-500 hidden md:table-cell truncate max-w-[140px]">{event.location}</td>
                                <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">
                                  <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${
                                    isUpcoming ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {isUpcoming ? 'Upcoming' : 'Past'}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Mobile view */}
                    <div className="sm:hidden mt-1 space-y-3">
                      {recentEvents.map((event) => {
                        const eventDate = new Date(event.event_date);
                        const isUpcoming = eventDate >= new Date();
                        
                        return (
                          <div key={event.event_id} className="border rounded-lg p-3">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium text-sm">{event.title}</h3>
                              <span className={`ml-2 px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${
                                isUpcoming ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {isUpcoming ? 'Upcoming' : 'Past'}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mb-1">
                              <span className="font-medium">Date:</span> {formatDate(event.event_date)}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              <span className="font-medium">Location:</span> {event.location}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-4 text-right"
                >
                  <button 
                    onClick={() => navigate('/organization-dashboard/events')}
                    className="text-primary hover:underline text-sm font-medium flex ml-auto items-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    View All Events
                  </button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </OrganizationSidebar>
    </div>
  );
};

export default OrganizationDashboard;
