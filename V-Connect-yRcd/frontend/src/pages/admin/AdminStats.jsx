import { FiUsers, FiCalendar, FiCheckCircle, FiClock } from 'react-icons/fi';

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center">
        <div className={`p-2 rounded-full ${color} text-white`}>
          {icon}
        </div>
        <div className="ml-3">
          <h3 className="text-gray-500 text-sm">{title}</h3>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
};

const AdminStats = ({ stats }) => {
  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Volunteers" 
          value={stats.totalVolunteers} 
          icon={<FiUsers className="w-5 h-5" />}
          color="bg-blue-500" 
        />
        <StatCard 
          title="Total Organizations" 
          value={stats.totalOrganizations} 
          icon={<FiCheckCircle className="w-5 h-5" />}
          color="bg-green-500" 
        />
        <StatCard 
          title="Total Events" 
          value={stats.totalEvents || 'N/A'} 
          icon={<FiCalendar className="w-5 h-5" />}
          color="bg-purple-500" 
        />
        <StatCard 
          title="Pending Approvals" 
          value={stats.pendingVolunteers + stats.pendingOrganizations} 
          icon={<FiClock className="w-5 h-5" />}
          color="bg-yellow-500" 
        />
      </div>
      
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-semibold text-lg mb-3">Pending Approvals</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="p-1.5 rounded-full bg-blue-100 text-blue-500 mr-2">
                  <FiUsers className="w-4 h-4" />
                </div>
                <span>Volunteers</span>
              </div>
              <span className="font-semibold">{stats.pendingVolunteers}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="p-1.5 rounded-full bg-green-100 text-green-500 mr-2">
                  <FiCheckCircle className="w-4 h-4" />
                </div>
                <span>Organizations</span>
              </div>
              <span className="font-semibold">{stats.pendingOrganizations}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-semibold text-lg mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <a 
              href="/admin-dashboard/volunteers"
              className="block py-2 px-3 bg-blue-50 text-blue-500 rounded hover:bg-blue-100"
            >
              Manage Volunteer Requests
            </a>
            <a 
              href="/admin-dashboard/organizations"
              className="block py-2 px-3 bg-green-50 text-green-500 rounded hover:bg-green-100"
            >
              Manage Organization Requests
            </a>
            <a 
              href="/admin-dashboard/events"
              className="block py-2 px-3 bg-purple-50 text-purple-500 rounded hover:bg-purple-100"
            >
              View All Events
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
