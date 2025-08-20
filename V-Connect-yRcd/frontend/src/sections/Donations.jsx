import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiArrowRight, FiHeart, FiArrowLeft, FiPhone, FiMail, FiGlobe } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const Donations = () => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  // Dummy donation data (in a real app, this would come from backend)
  const donationCampaigns = [
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
    }
  ]

  // For slider functionality
  const [startIndex, setStartIndex] = useState(0)
  const cardsToShow = window?.innerWidth >= 1024 ? 3 : window?.innerWidth >= 768 ? 2 : 1

  const handleNext = () => {
    if (startIndex + cardsToShow < donationCampaigns.length) {
      setStartIndex(startIndex + 1)
    }
  }

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1)
    }
  }

  return (
    <section id="donations" className="py-20 scroll-section">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="section-title">Support Our <span className="text-primary">Causes</span></h2>
          <p className="section-subtitle">
            Organizations in our network are working on important causes that need your support.
            Your donation can make a real difference in these community-driven initiatives.
          </p>
          <p className="text-center text-gray-600 mb-8">
            <em>Note: Organizations can create donation campaigns by posting to the landing page. Contact information is provided for those interested in donating.</em>
          </p>
        </motion.div>

        {/* Donations slider */}
        <div className="mt-12 relative">
          <div className="overflow-hidden">
            <motion.div
              className="flex transition-all duration-500 ease-in-out"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                x: `-${startIndex * (100 / cardsToShow)}%` 
              }}
              transition={{ duration: 0.5 }}
            >
              {donationCampaigns.map((campaign, index) => (
                <motion.div 
                  key={campaign.id}
                  className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 p-3"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <motion.div 
                    className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col"
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <div className="relative h-48">
                      <img 
                        src={campaign.image} 
                        alt={campaign.title} 
                        className="w-full h-full object-cover"
                      />
                      <motion.div 
                        className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md"
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FiHeart className="text-primary text-xl" />
                      </motion.div>
                    </div>
                    <div className="p-5 flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold line-clamp-2">{campaign.title}</h3>
                      </div>
                      <p className="text-sm text-primary font-medium mb-3">{campaign.organization}</p>
                      <p className="text-gray-600 mb-4">{campaign.description}</p>
                      
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
                            whileInView={{ width: `${(campaign.raised / campaign.goal) * 100}%` }}
                            viewport={{ once: false, amount: 0.8 }}
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
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Navigation buttons */}
          <motion.button 
            onClick={handlePrev}
            disabled={startIndex === 0}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 bg-white p-3 rounded-full shadow-lg z-10 ${
              startIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
            }`}
            whileHover={startIndex !== 0 ? { scale: 1.1, x: -12 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            aria-label="Previous campaign"
          >
            <FiArrowLeft className="text-primary" />
          </motion.button>

          <motion.button 
            onClick={handleNext}
            disabled={startIndex + cardsToShow >= donationCampaigns.length}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 bg-white p-3 rounded-full shadow-lg z-10 ${
              startIndex + cardsToShow >= donationCampaigns.length ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
            }`}
            whileHover={startIndex + cardsToShow < donationCampaigns.length ? { scale: 1.1, x: 12 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            aria-label="Next campaign"
          >
            <FiArrowRight className="text-primary" />
          </motion.button>
        </div>

        {/* Show More Button */}
        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.35 }}
        >
          <Link to="/donations">
            <motion.button 
              className="bg-white border border-primary text-primary hover:bg-primary/5 px-8 py-3 rounded-md flex items-center mx-auto font-medium transition-colors duration-300"
              whileHover={{ scale: 1.02, x: 3 }}
              whileTap={{ scale: 0.98 }}
            >
              View All Causes <FiArrowRight className="ml-2" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default Donations
