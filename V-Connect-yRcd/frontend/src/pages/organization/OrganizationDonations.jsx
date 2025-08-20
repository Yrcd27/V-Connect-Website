import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiHeart, FiPhone } from 'react-icons/fi';
import OrganizationSidebar from './OrganizationSidebar';
import LoadingSpinner from '../../components/LoadingSpinner';

const OrganizationDonations = () => {
  const [donationRequests, setDonationRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentDonation, setCurrentDonation] = useState(null);
  const navigate = useNavigate();
  
  // Form state for creating/editing donation requests
  const [donationForm, setDonationForm] = useState({
    title: '',
    description: '',
    target_amount: 0,
    contact_info: '',
    status: 'active'
  });
  
  useEffect(() => {
    // Check if user is logged in and is an organization
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('user_type');
    
    if (!token || userType !== 'organization') {
      navigate('/login');
      return;
    }
    
    fetchDonationRequests();
  }, [navigate]);
  
  const fetchDonationRequests = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const organizationId = localStorage.getItem('user_id');
      
      const response = await fetch(`/api/org/donation_requests/org/${organizationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch donation requests');
      }
      
      const data = await response.json();
      setDonationRequests(data);
      
    } catch (error) {
      console.error('Error fetching donation requests:', error);
      setError('Failed to load donation requests. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateDonation = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const organizationId = localStorage.getItem('user_id');
      
      const response = await fetch('/api/org/donation_requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...donationForm,
          organization_id: parseInt(organizationId),
          target_amount: parseInt(donationForm.target_amount)
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create donation request');
      }
      
      // Refresh donation requests list and close modal
      fetchDonationRequests();
      setShowCreateModal(false);
      // Reset form
      setDonationForm({
        title: '',
        description: '',
        target_amount: 0,
        contact_info: '',
        status: 'active'
      });
      
    } catch (error) {
      console.error('Error creating donation request:', error);
      setError('Failed to create donation request. Please try again.');
    }
  };
  
  const handleEditDonation = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/org/donation_requests/${currentDonation.request_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...donationForm,
          target_amount: parseInt(donationForm.target_amount)
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update donation request');
      }
      
      // Refresh donation requests list and close modal
      fetchDonationRequests();
      setShowEditModal(false);
      
    } catch (error) {
      console.error('Error updating donation request:', error);
      setError('Failed to update donation request. Please try again.');
    }
  };
  
  const handleDeleteDonation = async (requestId) => {
    if (window.confirm('Are you sure you want to delete this donation request?')) {
      try {
        const token = localStorage.getItem('token');
        
        const response = await fetch(`/api/org/donation_requests/${requestId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete donation request');
        }
        
        // Refresh donation requests list
        fetchDonationRequests();
        
      } catch (error) {
        console.error('Error deleting donation request:', error);
        setError('Failed to delete donation request. Please try again.');
      }
    }
  };
  
  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      maximumFractionDigits: 0
    }).format(amount);
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
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
            <h1 className="text-xl sm:text-2xl font-bold">Donation Campaigns</h1>
            {/* Only show the button when not loading */}
            {!isLoading && (
              <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-primary text-white py-1 sm:py-2 px-3 sm:px-4 text-sm sm:text-base rounded-md hover:bg-primary/90 transition-colors flex items-center whitespace-nowrap w-max"
              >
                <FiPlus className="mr-1 sm:mr-2" /> Create Campaign
              </button>
            )}
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
              {error}
            </div>
          )}
        
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Donation Campaigns List */}
            {donationRequests.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-500 mb-4">You haven't created any donation campaigns yet.</p>
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
                >
                  Create Your First Campaign
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {donationRequests.map((donation, index) => (
                  <div 
                    key={donation.request_id}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden h-full flex flex-col transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="bg-red-50 p-3 flex justify-center items-center border-b border-primary/10">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-100 rounded-full flex items-center justify-center">
                        <FiHeart size={24} className="text-red-500 sm:text-2xl" />
                      </div>
                    </div>
                    <div className="p-3 sm:p-5 flex-grow flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-base sm:text-lg font-semibold line-clamp-2">{donation.title}</h3>
                        <div className="flex space-x-2 ml-2">
                          <button 
                            onClick={() => {
                              setCurrentDonation(donation);
                              setDonationForm({
                                title: donation.title,
                                description: donation.description,
                                target_amount: donation.target_amount,
                                contact_info: donation.contact_info,
                                status: donation.status
                              });
                              setShowEditModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 p-1"
                          >
                            <FiEdit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteDonation(donation.request_id)}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-primary font-medium mb-2 text-sm">
                        <FiHeart className="mr-2 text-red-500" size={16} />
                        <span>Target: {formatCurrency(donation.target_amount)}</span>
                      </div>
                      
                      <p className="text-gray-600 mb-3 line-clamp-3 text-sm">
                        {donation.description}
                      </p>
                      
                      {/* Contact Information - Highlighted */}
                      <div className="border border-primary/20 p-2 sm:p-3 rounded-lg mb-2 sm:mb-3 hover:shadow-md transition-shadow">
                        <h4 className="font-medium text-primary mb-1 sm:mb-2 text-xs sm:text-sm">Contact Information:</h4>
                        <div className="space-y-1.5">
                          <div className="flex items-start hover:translate-x-1 transition-transform">
                            <FiPhone className="text-primary mr-2 flex-shrink-0 mt-0.5" size={14} />
                            <span className="text-xs sm:text-sm font-medium break-words">{donation.contact_info}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-auto flex flex-wrap justify-between text-xs sm:text-sm gap-2">
                        <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          donation.status === 'active' ? 'bg-green-100 text-green-800' : 
                          donation.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                        </span>
                        
                        <span className="text-xs sm:text-sm text-gray-500 truncate">
                          {window.innerWidth < 350 ? 'Created:' : 'Created:'} {formatDate(donation.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        
        {/* Create Donation Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-start md:items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-auto my-4 md:my-8 overflow-hidden">
              <div className="flex justify-between items-center p-3 sm:p-4 md:p-6 border-b sticky top-0 bg-white z-10">
                <h3 className="text-base sm:text-lg font-bold">Create Donation Campaign</h3>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl ml-4"
                >
                  &times;
                </button>
              </div>
              
              <form onSubmit={handleCreateDonation} className="p-4 sm:p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Campaign Title
                  </label>
                  <input 
                    type="text"
                    required
                    value={donationForm.title}
                    onChange={e => setDonationForm({...donationForm, title: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-primary/50"
                    placeholder="Enter a clear, descriptive title"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea 
                    required
                    value={donationForm.description}
                    onChange={e => setDonationForm({...donationForm, description: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-primary/50"
                    rows="4"
                    placeholder="Describe your campaign's purpose and impact"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <FiHeart className="mr-2 text-red-500" />
                    Target Amount (LKR)
                  </label>
                  <input 
                    type="number"
                    required
                    min="1"
                    value={donationForm.target_amount}
                    onChange={e => setDonationForm({...donationForm, target_amount: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-primary/50"
                    placeholder="Enter fundraising goal amount"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <FiPhone className="mr-2 text-primary" />
                    Contact Information
                  </label>
                  <input 
                    type="text"
                    required
                    value={donationForm.contact_info}
                    onChange={e => setDonationForm({...donationForm, contact_info: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-primary/50"
                    placeholder="Phone number, email, etc."
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select 
                    value={donationForm.status}
                    onChange={e => setDonationForm({...donationForm, status: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-primary/50"
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                
                <div className="flex justify-end">
                  <button 
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md mr-2 hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors flex items-center"
                  >
                    <FiPlus className="mr-2" /> Create Campaign
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Edit Donation Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-auto my-8 overflow-hidden">
              <div className="flex justify-between items-center p-4 sm:p-6 border-b sticky top-0 bg-white z-10">
                <h3 className="text-lg font-bold">Edit Donation Campaign</h3>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl ml-4"
                >
                  &times;
                </button>
              </div>
              
              <form onSubmit={handleEditDonation} className="p-4 sm:p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Campaign Title
                  </label>
                  <input 
                    type="text"
                    required
                    value={donationForm.title}
                    onChange={e => setDonationForm({...donationForm, title: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-primary/50"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea 
                    required
                    value={donationForm.description}
                    onChange={e => setDonationForm({...donationForm, description: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-primary/50"
                    rows="4"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <FiHeart className="mr-2 text-red-500" />
                    Target Amount (LKR)
                  </label>
                  <input 
                    type="number"
                    required
                    min="1"
                    value={donationForm.target_amount}
                    onChange={e => setDonationForm({...donationForm, target_amount: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-primary/50"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <FiPhone className="mr-2 text-primary" />
                    Contact Information
                  </label>
                  <input 
                    type="text"
                    required
                    value={donationForm.contact_info}
                    onChange={e => setDonationForm({...donationForm, contact_info: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-primary/50"
                    placeholder="Phone number, email, etc."
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select 
                    value={donationForm.status}
                    onChange={e => setDonationForm({...donationForm, status: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-primary/50"
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                
                <div className="flex justify-end">
                  <button 
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md mr-2 hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors flex items-center"
                  >
                    <FiEdit className="mr-2" /> Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        </div>
      </OrganizationSidebar>
    </div>
  );
};

export default OrganizationDonations;
