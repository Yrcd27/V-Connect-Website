import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiXCircle, FiTrash2, FiAlertCircle } from 'react-icons/fi';
import AdminSidebar from './AdminSidebar';

const AdminVolunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
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
    
    fetchVolunteers();
  }, [navigate]);

  const fetchVolunteers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch volunteers');
      }
      
      const allUsers = await response.json();
      // Filter only volunteers
      const volunteers = allUsers.filter(user => user.user_type === 'volunteer');
      setVolunteers(volunteers);
      setError(null);
      
    } catch (error) {
      console.error('Error fetching volunteers:', error);
      setError('Failed to load volunteers. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (userId, isActive) => {
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
      setVolunteers(volunteers.map(vol => 
        vol.user_id === userId ? { ...vol, is_active: isActive } : vol
      ));
      
    } catch (error) {
      console.error('Error updating volunteer status:', error);
      alert('Failed to update volunteer status. Please try again.');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this volunteer?')) {
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
        throw new Error('Failed to delete volunteer');
      }
      
      // Remove from local state
      setVolunteers(volunteers.filter(vol => vol.user_id !== userId));
      
    } catch (error) {
      console.error('Error deleting volunteer:', error);
      alert('Failed to delete volunteer. Please try again.');
    }
  };

  return (
    <AdminSidebar>
      <div className='p-5'>
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Manage Volunteers</h1>
      
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4 flex items-center">
          <FiAlertCircle className="mr-2" />
          {error}
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
              {volunteers.map((volunteer) => (
                <tr key={volunteer.user_id}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {volunteer.user_id}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{volunteer.name}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{volunteer.email}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span 
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${volunteer.is_active ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                    >
                      {volunteer.is_active ? 'Active' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    {volunteer.is_active ? (
                      <button 
                        onClick={() => handleStatusUpdate(volunteer.user_id, false)}
                        className="text-yellow-500 hover:text-yellow-600 mr-3"
                        title="Deactivate"
                      >
                        <FiXCircle className="w-5 h-5" />
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleStatusUpdate(volunteer.user_id, true)}
                        className="text-green-500 hover:text-green-600 mr-3"
                        title="Approve"
                      >
                        <FiCheckCircle className="w-5 h-5" />
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(volunteer.user_id)}
                      className="text-red-500 hover:text-red-600"
                      title="Delete"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {volunteers.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-3 text-center text-sm text-gray-500">
                    No volunteers found
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

export default AdminVolunteers;
