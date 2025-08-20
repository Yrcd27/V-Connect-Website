import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FiSave, FiEdit, FiMapPin, FiGlobe, FiCheckCircle, FiInfo, FiUser } from 'react-icons/fi';
import OrganizationSidebar from './OrganizationSidebar';

const OrganizationProfile = () => {
  const [profile, setProfile] = useState({
    organization_id: '',
    description: '',
    address: '',
    website: '',
    is_verified: false,
    // Additional fields for display purposes from user record
    name: '',
    email: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in and is an organization
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('user_type');
    
    if (!token || userType !== 'organization') {
      navigate('/login');
      return;
    }
    
    fetchProfile();
  }, [navigate]);
  
  // Function to decode JWT token
  const decodeJWT = (token) => {
    try {
      // Get the payload part of the token (second part)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      // Decode the base64 string
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  };

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const organizationId = localStorage.getItem('user_id');
      const userEmail = localStorage.getItem('user_email') || '';
      
      // Try to get organization name from JWT token first
      let orgName = '';
      const decodedToken = decodeJWT(token);
      if (decodedToken && decodedToken.name) {
        orgName = decodedToken.name;
        // Save the name to localStorage for future use
        localStorage.setItem('user_name', decodedToken.name);
      } else {
        // Fall back to localStorage if JWT doesn't contain name
        orgName = localStorage.getItem('user_name') || '';
      }
      
      // Fetch organization profile data from the API
      const response = await fetch(`/api/org/profile/${organizationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      
      const profileData = await response.json();
      
      // Use the data from the API, JWT token and localStorage
      setProfile({
        ...profileData,
        organization_id: organizationId,
        name: orgName,
        email: userEmail
      });
      
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const organizationId = localStorage.getItem('user_id');
      
      // Only include the fields supported by the API
      const response = await fetch(`/api/org/profile/${organizationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          description: profile.description,
          address: profile.address,
          website: profile.website,
          is_verified: profile.is_verified
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      setIsEditing(false);
      setSaveSuccess(true);
      
      // Show success message for 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    }
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <OrganizationSidebar>
        <div className="w-full px-4 py-1 sm:px-6 md:px-8 lg:px-10">
          {/* Main header - always show */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Organization Profile</h1>
              {!isLoading && profile.name && (
                <h2 className="text-lg sm:text-xl text-gray-600 mt-1">{profile.name}</h2>
              )}
            </div>
            
            {/* Edit button only appears when not loading and not editing */}
            {!isLoading && !isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-primary text-white py-1 sm:py-2 px-3 sm:px-4 text-sm sm:text-base rounded-md hover:bg-primary/90 transition-colors flex items-center w-max"
              >
                <FiEdit className="mr-1 sm:mr-2" /> Edit Profile
              </button>
            )}
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
              {error}
            </div>
          )}
          
          {saveSuccess && (
            <div className="bg-green-50 text-green-600 p-4 rounded-md mb-6 flex items-center">
              <FiCheckCircle className="mr-2" /> Profile updated successfully!
            </div>
          )}
          
          {/* Show loading spinner or content */}
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden w-full">
            {profile.is_verified && (
              <div className="bg-green-50 text-green-700 px-4 py-2 flex items-center text-sm border-b">
                <FiCheckCircle className="mr-2" /> This organization is verified
              </div>
            )}
            
            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="p-4 sm:p-6">
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  <div className="mb-3 sm:mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Organization Description
                    </label>
                    <textarea 
                      value={profile.description || ''}
                      onChange={e => setProfile({...profile, description: e.target.value})}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-primary/50 text-sm sm:text-base"
                      rows={window.innerWidth < 640 ? "4" : "6"}
                      placeholder="Describe your organization, its mission, values, and impact..."
                    />
                    <p className="text-xs text-gray-500 mt-1">This description will be visible to volunteers and donors.</p>
                  </div>
                  
                  <div className="mb-4">
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      <FiMapPin className="mr-2 text-yellow-500" /> 
                      Organization Address
                    </label>
                    <textarea 
                      value={profile.address || ''}
                      onChange={e => setProfile({...profile, address: e.target.value})}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-primary/50"
                      rows="3"
                      placeholder="Enter your physical address..."
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      <FiGlobe className="mr-2 text-green-500" /> 
                      Website URL
                    </label>
                    <input 
                      type="url"
                      value={profile.website || ''}
                      onChange={e => setProfile({...profile, website: e.target.value})}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-primary/50"
                      placeholder="https://www.example.org"
                    />
                  </div>
                </div>
                
                <div className="flex flex-wrap justify-end gap-2">
                  <button 
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-200 text-gray-700 py-1 sm:py-2 px-3 sm:px-4 text-sm sm:text-base rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="bg-primary text-white py-1 sm:py-2 px-3 sm:px-4 text-sm sm:text-base rounded-md hover:bg-primary/90 transition-colors flex items-center"
                  >
                    <FiSave className="mr-1 sm:mr-2" /> Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                        <FiInfo className="text-primary" size={20} />
                      </div>
                      <h3 className="text-lg font-bold">About</h3>
                    </div>
                    
                    <div className="mb-4 pb-3 border-b">
                      <p className="text-sm text-gray-500 mb-1">Organization Name</p>
                      <p className="font-medium">
                        {profile.name || 'Not specified'}
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">Description</p>
                      <div>
                        {profile.description ? (
                          <p className="whitespace-pre-line">
                            {profile.description}
                          </p>
                        ) : (
                          <p className="text-gray-500 italic">No description provided.</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold">Contact Information</h3>
                    </div>
                    
                    <div className="space-y-4">
                      
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Address</p>
                        <div className="flex items-start">
                          <FiMapPin className="text-yellow-500 mr-2 flex-shrink-0 mt-1" />
                          <div className="flex-1 break-words">
                            {profile.address ? (
                              <p className="whitespace-pre-line text-sm sm:text-base">
                                {profile.address}
                              </p>
                            ) : (
                              <p className="text-gray-500 italic text-sm sm:text-base">No address provided.</p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Website</p>
                        <div className="flex items-start">
                          <FiGlobe className="text-green-500 mr-2 flex-shrink-0 mt-1" />
                          <div className="flex-1 break-all">
                            {profile.website ? (
                              <a 
                                href={profile.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline text-sm sm:text-base"
                              >
                                {profile.website}
                              </a>
                            ) : (
                              <p className="text-gray-500 italic text-sm sm:text-base">No website provided.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          )}
        </div>
      </OrganizationSidebar>
    </div>
  );
};

export default OrganizationProfile;
