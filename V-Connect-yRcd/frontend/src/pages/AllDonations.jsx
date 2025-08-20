import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiHeart, FiPhone, FiMail, FiGlobe, FiArrowRight, FiArrowLeft } from 'react-icons/fi'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const AllDonations = () => {
  // In a real app, these would be fetched from an API
  const allCampaigns = [
    {
      id: 1,
      title: "Clean Water Initiative",
      organization: "EcoHelpers Foundation",
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      description: "Help us provide clean water solutions to rural communities affected by water scarcity. Your donation will support the installation of water purification systems and wells in areas without access to clean drinking water.",
      goal: 5000,
      raised: 3750,
      daysLeft: 12,
      contact: {
        phone: "+1 (555) 123-4567",
        email: "donations@ecohelpers.org",
        website: "www.ecohelpers.org"
      }
    },
    {
      id: 2,
      title: "Educational Supplies for Children",
      organization: "Learning For All",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      description: "Support our campaign to provide educational materials to underprivileged students. We're collecting funds to purchase textbooks, notebooks, stationery, and digital learning tools for children who can't afford them.",
      goal: 3000,
      raised: 1820,
      daysLeft: 8,
      contact: {
        phone: "+1 (555) 234-5678",
        email: "info@learningforall.org",
        website: "www.learningforall.org"
      }
    },
    {
      id: 3,
      title: "Food Drive for Homeless Shelters",
      organization: "Community Care Network",
      image: "https://images.unsplash.com/photo-1593113630400-ea4288922497?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      description: "Help us stock local homeless shelters with nutritious food for the coming winter months. We're partnering with local shelters to ensure that no one goes hungry during the coldest time of year.",
      goal: 2500,
      raised: 1950,
      daysLeft: 5,
      contact: {
        phone: "+1 (555) 345-6789",
        email: "donate@communitycare.org",
        website: "www.communitycarenetwork.org"
      }
    },
    {
      id: 4,
      title: "Animal Rescue Center Renovation",
      organization: "Paws & Care",
      image: "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      description: "Support our efforts to renovate and expand the local animal rescue center to help more animals in need. The funds will go toward improving animal housing, veterinary facilities, and adoption areas.",
      goal: 8000,
      raised: 2700,
      daysLeft: 21,
      contact: {
        phone: "+1 (555) 456-7890",
        email: "support@pawsandcare.org",
        website: "www.pawsandcare.org"
      }
    },
    {
      id: 5,
      title: "Community Garden Project",
      organization: "Urban Greening Initiative",
      image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      description: "Help us transform empty urban lots into thriving community gardens. Your donation will fund soil, seeds, tools, and educational workshops for community members to grow their own food.",
      goal: 3500,
      raised: 2100,
      daysLeft: 14,
      contact: {
        phone: "+1 (555) 567-8901",
        email: "info@urbangreening.org",
        website: "www.urbangreening.org"
      }
    },
    {
      id: 6,
      title: "Youth Sports Program",
      organization: "Active Kids Foundation",
      image: "https://images.unsplash.com/photo-1526676037777-05a232554f77?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      description: "Help us provide sports equipment and coaching to underprivileged youth in our community. Your donation will support healthier lifestyles and teach teamwork skills to local children.",
      goal: 4000,
      raised: 2200,
      daysLeft: 18,
      contact: {
        phone: "+1 (555) 678-9012",
        email: "donate@activekids.org",
        website: "www.activekidsfoundation.org"
      }
    },
    {
      id: 7,
      title: "Elderly Care Support",
      organization: "Golden Years Society",
      image: "https://images.unsplash.com/photo-1581579438747-104c53d755df?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      description: "Support our program providing assistance to elderly community members living alone. Funds will help with meal delivery, home repairs, transportation to medical appointments, and social activities.",
      goal: 6000,
      raised: 3200,
      daysLeft: 25,
      contact: {
        phone: "+1 (555) 789-0123",
        email: "contact@goldenyears.org",
        website: "www.goldenyearssociety.org"
      }
    },
    {
      id: 8,
      title: "Tech Education for Kids",
      organization: "Future Coders",
      image: "https://images.unsplash.com/photo-1603354350317-6f7aaa5911c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      description: "Help us teach coding and digital literacy skills to kids from underserved communities. Your donation will provide computers, learning materials, and instructor stipends.",
      goal: 7500,
      raised: 4800,
      daysLeft: 10,
      contact: {
        phone: "+1 (555) 890-1234",
        email: "hello@futurecoders.org",
        website: "www.futurecoders.org"
      }
    }
  ]
  
  const [scrollY, setScrollY] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6
  const totalPages = Math.ceil(allCampaigns.length / itemsPerPage)
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = allCampaigns.slice(indexOfFirstItem, indexOfLastItem)
  
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  return (
    <>
      <Navbar scrollY={scrollY} />
      
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
                Donation Campaigns
              </motion.h1>
              <motion.p 
                className="text-lg text-blue-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Browse all current donation campaigns from our partner organizations and support causes you believe in.
              </motion.p>
            </div>
          </div>
        </section>
        
        {/* Campaigns Grid */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentItems.map((campaign, index) => (
                <motion.div 
                  key={campaign.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col border border-gray-100">
                    <div className="relative h-48">
                      <img 
                        src={campaign.image} 
                        alt={campaign.title} 
                        className="w-full h-full object-cover"
                      />
                      <motion.div 
                        className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FiHeart className="text-primary text-xl" />
                      </motion.div>
                    </div>
                    <div className="p-5 flex-grow flex flex-col">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{campaign.title}</h3>
                        <p className="text-sm text-primary font-medium mb-3">{campaign.organization}</p>
                        <p className="text-gray-600 mb-4 line-clamp-3">{campaign.description}</p>
                      </div>
                      
                      {/* Contact Information - Highlighted */}
                      <motion.div 
                        className="border border-primary/20 p-4 rounded-lg mb-4"
                        initial={{ opacity: 0.8 }}
                        whileHover={{ 
                          boxShadow: "0 4px 12px -2px rgba(0, 112, 243, 0.1)",
                          scale: 1.01,
                          opacity: 1
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <h4 className="font-medium text-primary mb-3">Contact to Donate:</h4>
                        <div className="space-y-2">
                          <motion.div 
                            className="flex items-center"
                            whileHover={{ x: 3 }}
                            transition={{ duration: 0.2 }}
                          >
                            <FiPhone className="text-primary mr-2" />
                            <span className="text-sm font-medium">{campaign.contact.phone}</span>
                          </motion.div>
                          <motion.div 
                            className="flex items-center"
                            whileHover={{ x: 3 }}
                            transition={{ duration: 0.2 }}
                          >
                            <FiMail className="text-primary mr-2" />
                            <span className="text-sm font-medium">{campaign.contact.email}</span>
                          </motion.div>
                          <motion.div 
                            className="flex items-center"
                            whileHover={{ x: 3 }}
                            transition={{ duration: 0.2 }}
                          >
                            <FiGlobe className="text-primary mr-2" />
                            <span className="text-sm font-medium">{campaign.contact.website}</span>
                          </motion.div>
                        </div>
                      </motion.div>
                      
                      {/* Progress bar */}
                      <div className="mt-auto">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                          <motion.div 
                            className="bg-primary h-2.5 rounded-full" 
                            initial={{ width: 0 }}
                            animate={{ width: `${(campaign.raised / campaign.goal) * 100}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                          ></motion.div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">${campaign.raised.toLocaleString()} raised</span>
                          <span className="text-gray-500">of ${campaign.goal.toLocaleString()}</span>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <motion.span 
                            className="text-sm font-medium text-primary bg-primary/5 py-1 px-2 rounded"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                          >
                            {campaign.daysLeft} days remaining
                          </motion.span>
                          <motion.div 
                            className="text-xs text-gray-500 italic"
                            whileHover={{ opacity: 0.7 }}
                          >
                            Contact for donation details
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <nav className="flex items-center space-x-2">
                  <button 
                    onClick={() => currentPage > 1 && paginate(currentPage - 1)} 
                    disabled={currentPage === 1}
                    className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-primary hover:bg-primary/10'}`}
                    aria-label="Previous page"
                  >
                    <FiArrowLeft />
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => paginate(i + 1)}
                      className={`w-10 h-10 rounded-md flex items-center justify-center ${
                        currentPage === i + 1 
                          ? 'bg-primary text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button 
                    onClick={() => currentPage < totalPages && paginate(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-primary hover:bg-primary/10'}`}
                    aria-label="Next page"
                  >
                    <FiArrowRight />
                  </button>
                </nav>
              </div>
            )}
          </div>
        </section>
        
        {/* CTA */}
        <motion.section 
          className="py-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-primary to-blue-700 text-white p-8 rounded-lg">
              <motion.h2 
                className="text-3xl font-bold mb-6"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.4 }}
              >
                Looking for More Ways to Help?
              </motion.h2>
              <motion.p 
                className="text-lg opacity-90 mb-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                Besides donating, you can also volunteer your time and skills to make a difference in your community.
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <Link to="/">
                  <motion.button
                    className="bg-white text-primary hover:bg-gray-100 py-3 px-8 rounded-md font-medium transition-colors duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Back to Home
                  </motion.button>
                </Link>
                <motion.button 
                  className="border border-white bg-transparent hover:bg-white/10 py-3 px-8 rounded-md text-white font-medium transition-colors duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Join as Volunteer
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </main>
      
      <Footer />
    </>
  )
}

export default AllDonations
