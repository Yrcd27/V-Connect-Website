import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Events = () => {
  const events = [
    {
      id: 1,
      title: "Beach Cleanup Day",
      date: "September 15, 2025",
      time: "9:00 AM - 1:00 PM",
      location: "Sunset Beach",
      description: "Join us for our annual beach cleanup event! Help us remove trash and debris from our local beaches to protect marine life and keep our coastlines beautiful.",
      spots: 45
    },
    {
      id: 2,
      title: "Food Bank Volunteer Drive",
      date: "September 22, 2025",
      time: "10:00 AM - 2:00 PM",
      location: "Community Food Bank",
      description: "Help sort and package food items for distribution to families in need throughout our community.",
      spots: 20
    },
    {
      id: 3,
      title: "Habitat Build Day",
      date: "October 5, 2025",
      time: "8:00 AM - 4:00 PM",
      location: "Oak Street Construction Site",
      description: "No construction experience needed! Help build homes for families in need. Training and tools provided on site.",
      spots: 15
    },
    {
      id: 4,
      title: "Senior Center Game Day",
      date: "October 12, 2025",
      time: "2:00 PM - 5:00 PM",
      location: "Sunshine Senior Living Center",
      description: "Spend an afternoon playing board games and cards with seniors at our local retirement community.",
      spots: 10
    }
  ]
  
  return (
    <>
      <Navbar scrollY={100} />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-primary text-white py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <motion.h1 
                className="text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Upcoming Events
              </motion.h1>
              <motion.p 
                className="text-lg text-blue-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Find opportunities to make a difference in your community
              </motion.p>
            </div>
          </div>
        </section>
        
        {/* Events Listing */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {events.map((event, index) => (
                <motion.div 
                  key={event.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold">{event.title}</h3>
                      <span className="bg-blue-100 text-primary text-sm font-medium px-2 py-1 rounded">
                        {event.spots} spots left
                      </span>
                    </div>
                    
                    <div className="mb-4 space-y-2 text-gray-600">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{event.location}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-6">{event.description}</p>
                    
                    <button className="w-full btn-primary text-center py-2 rounded">
                      Register Now
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-6">
                This is placeholder content for the Events page. In a real implementation, this would integrate with a events management system and allow users to register.
              </p>
              <button className="btn-outline px-8 py-3">
                View More Events
              </button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  )
}

export default Events
