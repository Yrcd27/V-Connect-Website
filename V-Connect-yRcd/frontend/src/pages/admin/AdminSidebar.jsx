import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiUsers, FiCalendar, FiLogOut, FiMenu, FiX, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const AdminSidebar = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  
  // State for sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // Get user type from local storage
  const userType = localStorage.getItem('user_type') || 'admin';
  
  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);
  
  // Show logout confirmation modal
  const showLogoutConfirmation = () => {
    setShowLogoutModal(true);
  };
  
  // Handle logout
  const handleLogout = () => {
    // Clear all auth related items from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_type');
    
    // Close the modal
    setShowLogoutModal(false);
    
    // Navigate to login page
    navigate('/login');
  };
  
  // Menu items
  const getMenuItems = () => [
    {
      path: '/admin-dashboard',
      label: 'Dashboard',
      icon: <FiHome size={20} />
    },
    {
      path: '/admin-dashboard/volunteers',
      label: 'Volunteers',
      icon: <FiUsers size={20} />
    },
    {
      path: '/admin-dashboard/organizations',
      label: 'Organizations',
      icon: <FiCheckCircle size={20} />
    },
    {
      path: '/admin-dashboard/events',
      label: 'Events',
      icon: <FiCalendar size={20} />
    }
  ];
  
  const menuItems = getMenuItems();
  
  // Animation variants
  const sidebarVariants = {
    open: { width: 280, transition: { duration: 0.3 } },
    closed: { width: 80, transition: { duration: 0.3 } },
    mobileOpen: { x: 0, transition: { duration: 0.3 } },
    mobileClosed: { x: '-100%', transition: { duration: 0.3 } }
  };
  
  const contentVariants = {
    sidebarOpen: { marginLeft: 280, transition: { duration: 0.3 } },
    sidebarClosed: { marginLeft: 80, transition: { duration: 0.3 } }
  };
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white p-2 rounded-md shadow-md text-primary"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>
      
      {/* Mobile Sidebar */}
      <motion.div 
        className="md:hidden fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg"
        variants={sidebarVariants}
        initial="mobileClosed"
        animate={isMobileMenuOpen ? "mobileOpen" : "mobileClosed"}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-2xl">
                <span className="text-primary">V</span>
                <span className="text-dark">-Connect</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Admin Dashboard
            </p>
          </div>
          
          <nav className="mt-4 flex-grow overflow-y-auto">
            <ul className="space-y-1 px-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      currentPath === item.path 
                        ? 'bg-primary/10 text-primary font-medium' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className={`flex items-center justify-center h-7 ${currentPath === item.path ? 'text-primary' : 'text-gray-500'}`}>
                      {item.icon}
                    </div>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={showLogoutConfirmation}
              className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
            >
              <div className="flex items-center justify-center h-7">
                <FiLogOut size={20} />
              </div>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </motion.div>
      
      {/* Desktop Sidebar */}
      <motion.div 
        className="hidden md:block fixed inset-y-0 left-0 z-30 bg-white shadow-lg overflow-x-hidden"
        variants={sidebarVariants}
        initial="open"
        animate={isSidebarOpen ? "open" : "closed"}
      >
        <div className="flex flex-col h-full">
          <div className="pt-8 pb-6 px-8 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-3xl">
                <span className="text-primary">V</span>
                <span className={`text-dark ${!isSidebarOpen ? 'hidden' : 'inline'}`}>-Connect</span>
              </span>
            </div>
            {isSidebarOpen && (
              <p className="text-sm text-gray-500 mt-1">
                Admin Dashboard
              </p>
            )}
          </div>
          
          <nav className="mt-6 flex-grow overflow-y-auto">
            <ul className="space-y-2 px-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    className={`flex items-center ${isSidebarOpen ? 'space-x-3' : 'justify-center'} px-6 py-3 rounded-lg transition-colors ${
                      currentPath === item.path 
                        ? 'bg-primary/10 text-primary font-medium' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className={`flex items-center justify-center ${currentPath === item.path ? 'text-primary' : 'text-gray-500'}`} style={{ height: "32px", paddingTop: "1px" }}>
                      {item.icon}
                    </div>
                    {isSidebarOpen && <span className="pt-0.5">{item.label}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={showLogoutConfirmation}
              className={`flex items-center ${isSidebarOpen ? 'space-x-3' : 'justify-center'} w-full px-6 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors`}
            >
              <div className="flex items-center justify-center" style={{ height: "32px", paddingTop: "1px" }}>
                <FiLogOut size={20} />
              </div>
              {isSidebarOpen && <span className="pt-0.5">Logout</span>}
            </button>
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex items-center justify-center w-full p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {isSidebarOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              )}
            </button>
          </div>
        </div>
      </motion.div>
      
      {/* Main Content */}
      <motion.main 
        className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50"
        variants={contentVariants}
        initial="sidebarOpen"
        animate={isSidebarOpen ? "sidebarOpen" : "sidebarClosed"}
        transition={{ duration: 0.3 }}
      >
        <div className="md:hidden h-16"></div> {/* Space for mobile header */}
        <div className="w-full px-4 py-4 sm:px-4 md:px-6">
          {children}
        </div>
      </motion.main>
      
      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <>
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowLogoutModal(false)}
            >
              {/* Modal Content */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 20 }}
                className="bg-white rounded-lg shadow-lg max-w-md w-full mx-auto p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                    <FiAlertTriangle className="text-red-500 text-xl" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Confirm Logout</h3>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Are you sure you want to log out? Any unsaved changes will be lost.
                </p>
                
                <div className="flex justify-end space-x-3">
                  <button
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
                    onClick={() => setShowLogoutModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition-colors"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminSidebar;
