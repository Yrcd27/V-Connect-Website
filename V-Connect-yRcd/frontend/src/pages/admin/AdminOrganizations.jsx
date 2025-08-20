import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiXCircle, FiTrash2, FiAlertCircle, FiInfo } from 'react-icons/fi';
import AdminSidebar from './AdminSidebar';

const AdminOrganizations = () => {
  const [organizations, setOrganizations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and is an admin
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('user_type');
    
    if (!token || userType !== 'admin') {
      navigate('/login');
      return;
    }
    
    fetchOrganizations();
  }, [navigate]);

  const fetchOrganizations = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      try {
        // Try fetching organizations from the API
        const response = await fetch('/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const allUsers = await response.json();
          // Filter only organizations
          const organizations = allUsers.filter(user => user.user_type === 'organization');
          setOrganizations(organizations);
          setError(null);
          return;
        } else {
          console.error('Organizations API returned status:', response.status);
        }
      } catch (firstError) {
        console.error('Error fetching from admin/users endpoint:', firstError);
        // Continue to fallback
      }
      
      try {
        // Try alternative endpoint for organizations
        const response = await fetch('http://localhost:9000/pub/organizations/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const organizations = await response.json();
          setOrganizations(organizations);
          setError(null);
          return;
        }
      } catch (secondError) {
        console.error('Alternative endpoint fetch failed:', secondError);
        // Continue to fallback mock data
      }
      
      // If both API calls fail, use mock data
      console.log("Using mock organization data as API calls failed");
      const mockOrganizations = [
        {
          user_id: 101,
          name: "Global Relief Initiative",
          email: "contact@globalrelief.org",
          user_type: "organization",
          is_active: true,
          created_at: "2025-07-15"
        },
        {
          user_id: 102,
          name: "Animal Welfare Society",
          email: "info@animalwelfare.org",
          user_type: "organization",
          is_active: true,
          created_at: "2025-07-20"
        },
        {
          user_id: 103,
          name: "Community Garden Project",
          email: "hello@communitygardens.org",
          user_type: "organization",
          is_active: false,
          created_at: "2025-07-25"
        },
        {
          user_id: 104,
          name: "Children's Education Fund",
          email: "admin@educationfund.org",
          user_type: "organization",
          is_active: false,
          created_at: "2025-08-01"
        }
      ];
      setOrganizations(mockOrganizations);
      setError('Unable to connect to the organizations API. Showing sample data instead.');
      
    } catch (error) {
      console.error('Error fetching organizations:', error);
      setError('Failed to load organizations. Using sample data instead.');
      
      // Provide mock data even if everything fails
      const fallbackOrganizations = [
        {
          user_id: 101,
          name: "Global Relief Initiative",
          email: "contact@globalrelief.org",
          user_type: "organization",
          is_active: true
        }
      ];
      setOrganizations(fallbackOrganizations);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (userId, isActive) => {
    // If we're in sample data mode, just update the UI without API call
    if (error) {
      setOrganizations(organizations.map(org => 
        org.user_id === userId ? { ...org, is_active: isActive } : org
      ));
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_active: isActive })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      
      // Update the local state
      setOrganizations(organizations.map(org => 
        org.user_id === userId ? { ...org, is_active: isActive } : org
      ));
      
    } catch (updateError) {
      console.error('Error updating organization status:', updateError);
      alert('Failed to update organization status. Please try again.');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this organization?')) {
      return;
    }
    
    // If we're in sample data mode, just update the UI without API call
    if (error) {
      setOrganizations(organizations.filter(org => org.user_id !== userId));
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete organization');
      }
      
      // Remove from local state
      setOrganizations(organizations.filter(org => org.user_id !== userId));
      
    } catch (deleteError) {
      console.error('Error deleting organization:', deleteError);
      alert('Failed to delete organization. Please try again.');
    }
  };

  return (
    <AdminSidebar>
      <div className='p-5'>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">Manage Organizations</h1>
        <button 
          onClick={fetchOrganizations}
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
        <div className="bg-amber-50 border-l-4 border-amber-500 text-amber-700 p-4 rounded-md mb-4">
          <div className="flex items-center mb-1">
            <FiAlertCircle className="text-amber-500 mr-2" size={18} />
            <span className="font-medium">Using Sample Data</span>
          </div>
          <p className="ml-6 text-sm">{error}</p>
          <button 
            onClick={fetchOrganizations} 
            className="ml-6 mt-2 text-sm bg-amber-100 hover:bg-amber-200 text-amber-700 px-3 py-1 rounded-md flex items-center"
          >
            <span className="mr-1">↻</span> Retry Connection
          </button>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {organizations.map((organization) => (
                <tr key={organization.user_id} className={error ? "bg-amber-50" : ""}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {organization.user_id}
                    {error && (
                      <span className="ml-1 text-xs text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-full">
                        Sample
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{organization.name}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{organization.email}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span 
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${organization.is_active ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                    >
                      {organization.is_active ? 'Active' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    {organization.is_active ? (
                      <button 
                        onClick={() => handleStatusUpdate(organization.user_id, false)}
                        className="text-yellow-500 hover:text-yellow-600 mr-3"
                        title="Deactivate"
                      >
                        <FiXCircle className="w-5 h-5" />
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleStatusUpdate(organization.user_id, true)}
                        className="text-green-500 hover:text-green-600 mr-3"
                        title="Approve"
                      >
                        <FiCheckCircle className="w-5 h-5" />
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(organization.user_id)}
                      className="text-red-500 hover:text-red-600"
                      title="Delete"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {organizations.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-3 text-center text-sm text-gray-500">
                    No organizations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      </div>
    </AdminSidebar>
  );
};

export default AdminOrganizations;
