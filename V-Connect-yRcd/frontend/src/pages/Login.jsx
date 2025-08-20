import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiPhone, FiMapPin, FiGlobe, FiCheck } from 'react-icons/fi';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Import the login and signup images
import loginImg from '../assets/loginimg.png';
import signupImg from '../assets/signupimg.png';

const Login = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [signupType, setSignupType] = useState('volunteer');
  const navigate = useNavigate();
  const location = useLocation();
  
  // Parse URL parameters when component mounts
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get('type');
    
    // If type parameter exists, switch to signup tab and set the appropriate signup type
    if (type) {
      setActiveTab('signup');
      if (type === 'volunteer' || type === 'organization') {
        setSignupType(type);
      }
    }
  }, [location]);
  
  // Form states
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [volunteerForm, setVolunteerForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    phone: '',
  });
  const [organizationForm, setOrganizationForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  
  // Error and loading states
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formStep, setFormStep] = useState(1); // For multi-step signup forms

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
  const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: loginForm.email, 
          password: loginForm.password
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      // Store token and user info in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user_id', data.user_id);
      localStorage.setItem('user_type', data.user_type);
      // Redirect to appropriate dashboard based on user type
      if (data.user_type === 'volunteer') {
        navigate('/volunteer-dashboard');
      } else if (data.user_type === 'organization') {
        navigate('/organization-dashboard');
      } else if (data.user_type === 'admin') {
        navigate('/admin-dashboard');
      }
      
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle volunteer signup
  const handleVolunteerSignup = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    if (volunteerForm.password !== volunteerForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Register the volunteer using the new API structure
  const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: volunteerForm.email,
          password: volunteerForm.password,
          user_type: 'volunteer',
          name: volunteerForm.name,
          phone: volunteerForm.phone
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      // Automatically switch to login
      setActiveTab('login');
      setLoginForm({
        email: volunteerForm.email,
        password: volunteerForm.password
      });
      setError('');
      alert('Registration successful! You can now log in.');
      
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle organization signup
  const handleOrganizationSignup = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    if (organizationForm.password !== organizationForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Register the organization using the new API structure
  const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: organizationForm.email,
          password: organizationForm.password,
          user_type: 'organization',
          name: organizationForm.name,
          phone: organizationForm.phone
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      // Automatically switch to login
      setActiveTab('login');
      setLoginForm({
        email: organizationForm.email,
        password: organizationForm.password
      });
      setError('');
      alert('Registration successful! Your organization account is now pending approval. You can log in once approved.');
      
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants for tab switching
  const tabVariants = {
    hidden: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 24,
        duration: 0.3
      }
    },
    exit: (direction) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
      transition: {
        duration: 0.2
      }
    })
  };

  // Animation custom direction tracking
  const [direction, setDirection] = useState(0);
  const handleTabChange = (tab) => {
    setDirection(tab === 'login' ? -1 : 1);
    setActiveTab(tab);
    setError('');
  };

  return (
    <>
      <Navbar />
      
      <main className="pt-20 min-h-screen flex flex-col">
        <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-6xl w-full bg-white rounded-xl overflow-hidden shadow-lg">
            <div className="flex flex-col md:flex-row">
              {/* Left side - Image */}
              <div className="md:w-1/2 bg-primary">
                <motion.div 
                  className="h-full w-full"
                  animate={{ opacity: 1 }}
                  initial={{ opacity: 0.8 }}
                  transition={{ duration: 0.5 }}
                >
                  <img 
                    src={activeTab === 'login' ? loginImg : signupImg} 
                    alt={activeTab === 'login' ? "Login Image" : "Signup Image"} 
                    className="h-full w-full object-cover"
                  />
                </motion.div>
              </div>

              {/* Right side - Form */}
              <div className="md:w-1/2 p-8">
                {/* Tab Navigation */}
                <div className="flex mb-8 border-b">
                  <button
                    className={`flex-1 py-3 text-lg font-medium ${
                      activeTab === 'login' 
                        ? 'text-primary border-b-2 border-primary' 
                        : 'text-gray-500 hover:text-primary'
                    } transition-colors`}
                    onClick={() => handleTabChange('login')}
                  >
                    Login
                  </button>
                  <button
                    className={`flex-1 py-3 text-lg font-medium ${
                      activeTab === 'signup' 
                        ? 'text-primary border-b-2 border-primary' 
                        : 'text-gray-500 hover:text-primary'
                    } transition-colors`}
                    onClick={() => handleTabChange('signup')}
                  >
                    Sign Up
                  </button>
                </div>

                <AnimatePresence mode="wait" custom={direction}>
                  {activeTab === 'login' ? (
                    <motion.div
                      key="login"
                      custom={direction}
                      variants={tabVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <h2 className="text-3xl font-bold text-center mb-6">Welcome Back!</h2>
                      
                      {/* Login Form */}
                      <form onSubmit={handleLogin}>
                        {error && (
                          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                            {error}
                          </div>
                        )}
                        
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                            Email Address
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <FiMail className="text-gray-400" />
                            </div>
                            <input
                              id="email"
                              type="email"
                              required
                              value={loginForm.email}
                              onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                              placeholder="your-email@example.com"
                            />
                          </div>
                        </div>
                        
                        <div className="mb-6">
                          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                            Password
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <FiLock className="text-gray-400" />
                            </div>
                            <input
                              id="password"
                              type="password"
                              required
                              value={loginForm.password}
                              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                              placeholder="••••••••"
                            />
                          </div>
                          <div className="flex justify-end mt-2">
                            <a href="#" className="text-sm text-primary hover:underline">
                              Forgot password?
                            </a>
                          </div>
                        </div>
                        
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                        >
                          {isLoading ? 'Logging in...' : 'Log In'}
                        </button>
                        
                        <div className="mt-4 text-center text-sm text-gray-600">
                          Don't have an account?{' '}
                          <button 
                            type="button"
                            onClick={() => handleTabChange('signup')}
                            className="text-primary hover:underline"
                          >
                            Create an Account
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="signup"
                      custom={direction}
                      variants={tabVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <h2 className="text-3xl font-bold text-center mb-6">Create an Account</h2>
                      
                      {/* Signup Type Toggle */}
                      <div className="flex justify-center mb-6">
                        <div className="inline-flex bg-gray-100 rounded-full p-1">
                          <button
                            className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                              signupType === 'volunteer' 
                                ? 'bg-primary text-white' 
                                : 'text-gray-600'
                            }`}
                            onClick={() => setSignupType('volunteer')}
                          >
                            Volunteer
                          </button>
                          <button
                            className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                              signupType === 'organization' 
                                ? 'bg-accent text-white' 
                                : 'text-gray-600'
                            }`}
                            onClick={() => setSignupType('organization')}
                          >
                            Organization
                          </button>
                        </div>
                      </div>
                      
                      {/* Signup Forms */}
                      {signupType === 'volunteer' ? (
                        <form onSubmit={handleVolunteerSignup}>
                          {error && (
                            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                              {error}
                            </div>
                          )}
                          
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="volunteer-name">
                              Full Name
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <FiUser className="text-gray-400" />
                              </div>
                              <input
                                id="volunteer-name"
                                type="text"
                                required
                                value={volunteerForm.name}
                                onChange={(e) => setVolunteerForm({...volunteerForm, name: e.target.value})}
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                                placeholder="John Doe"
                              />
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="volunteer-email">
                              Email Address
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <FiMail className="text-gray-400" />
                              </div>
                              <input
                                id="volunteer-email"
                                type="email"
                                required
                                value={volunteerForm.email}
                                onChange={(e) => setVolunteerForm({...volunteerForm, email: e.target.value})}
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                                placeholder="your-email@example.com"
                              />
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="volunteer-password">
                              Password
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <FiLock className="text-gray-400" />
                              </div>
                              <input
                                id="volunteer-password"
                                type="password"
                                required
                                value={volunteerForm.password}
                                onChange={(e) => setVolunteerForm({...volunteerForm, password: e.target.value})}
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                                placeholder="••••••••"
                              />
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="volunteer-confirm-password">
                              Confirm Password
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <FiLock className="text-gray-400" />
                              </div>
                              <input
                                id="volunteer-confirm-password"
                                type="password"
                                required
                                value={volunteerForm.confirmPassword}
                                onChange={(e) => setVolunteerForm({...volunteerForm, confirmPassword: e.target.value})}
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                                placeholder="••••••••"
                              />
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="volunteer-bio">
                              Bio (Optional)
                            </label>
                            <textarea
                              id="volunteer-bio"
                              value={volunteerForm.bio}
                              onChange={(e) => setVolunteerForm({...volunteerForm, bio: e.target.value})}
                              className="block w-full py-2.5 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                              placeholder="Tell us about yourself..."
                              rows="3"
                            />
                          </div>
                          
                          <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="volunteer-skills">
                              Skills (Optional - comma separated)
                            </label>
                            <input
                              id="volunteer-skills"
                              type="text"
                              value={volunteerForm.skills}
                              onChange={(e) => setVolunteerForm({...volunteerForm, skills: e.target.value})}
                              className="block w-full py-2.5 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                              placeholder="e.g. teaching, first aid, organization"
                            />
                          </div>
                          
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                          >
                            {isLoading ? 'Creating Account...' : 'Sign Up'}
                          </button>
                          
                          <div className="mt-4 text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <button 
                              type="button"
                              onClick={() => handleTabChange('login')}
                              className="text-primary hover:underline"
                            >
                              Log In
                            </button>
                          </div>
                        </form>
                      ) : (
                        <form onSubmit={handleOrganizationSignup}>
                          {error && (
                            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                              {error}
                            </div>
                          )}
                          
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="org-name">
                              Organization Name
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <FiUser className="text-gray-400" />
                              </div>
                              <input
                                id="org-name"
                                type="text"
                                required
                                value={organizationForm.name}
                                onChange={(e) => setOrganizationForm({...organizationForm, name: e.target.value})}
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                                placeholder="Organization Name"
                              />
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="org-email">
                              Email Address
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <FiMail className="text-gray-400" />
                              </div>
                              <input
                                id="org-email"
                                type="email"
                                required
                                value={organizationForm.email}
                                onChange={(e) => setOrganizationForm({...organizationForm, email: e.target.value})}
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                                placeholder="organization@example.com"
                              />
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="org-password">
                              Password
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <FiLock className="text-gray-400" />
                              </div>
                              <input
                                id="org-password"
                                type="password"
                                required
                                value={organizationForm.password}
                                onChange={(e) => setOrganizationForm({...organizationForm, password: e.target.value})}
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                                placeholder="••••••••"
                              />
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="org-confirm-password">
                              Confirm Password
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <FiLock className="text-gray-400" />
                              </div>
                              <input
                                id="org-confirm-password"
                                type="password"
                                required
                                value={organizationForm.confirmPassword}
                                onChange={(e) => setOrganizationForm({...organizationForm, confirmPassword: e.target.value})}
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                                placeholder="••••••••"
                              />
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="org-description">
                              Description
                            </label>
                            <textarea
                              id="org-description"
                              value={organizationForm.description}
                              onChange={(e) => setOrganizationForm({...organizationForm, description: e.target.value})}
                              className="block w-full py-2.5 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                              placeholder="Tell us about your organization..."
                              rows="3"
                              required
                            />
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="org-address">
                              Address
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <FiMapPin className="text-gray-400" />
                              </div>
                              <input
                                id="org-address"
                                type="text"
                                value={organizationForm.address}
                                onChange={(e) => setOrganizationForm({...organizationForm, address: e.target.value})}
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                                placeholder="123 Main St, City, Country"
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="org-website">
                              Website (Optional)
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <FiGlobe className="text-gray-400" />
                              </div>
                              <input
                                id="org-website"
                                type="url"
                                value={organizationForm.website}
                                onChange={(e) => setOrganizationForm({...organizationForm, website: e.target.value})}
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                                placeholder="https://www.yourorganization.org"
                              />
                            </div>
                          </div>
                          
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-accent hover:bg-accent/90 text-white font-medium py-2.5 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50"
                          >
                            {isLoading ? 'Creating Organization...' : 'Register Organization'}
                          </button>
                          
                          <div className="mt-4 text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <button 
                              type="button"
                              onClick={() => handleTabChange('login')}
                              className="text-accent hover:underline"
                            >
                              Log In
                            </button>
                          </div>
                        </form>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Login;
