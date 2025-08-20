import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiUserPlus, FiSearch, FiCalendar, FiCheck, FiArrowRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const HowToUse = () => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })
  
  // Define staggered animation variants with refined motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08, // Further reduced stagger interval
        delayChildren: 0.15
      }
    }
  }
  
  const itemVariants = {
    hidden: { y: 6, opacity: 0 }, // Further reduced translation distance
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24, 
        duration: 0.3  // Further reduced duration
      }
    }
  }
  
  // Refined motion variants for organizations section
  const orgItemVariants = {
    hidden: { y: 6, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24, 
        duration: 0.3
      }
    }
  }

  const steps = [
    {
      icon: <FiUserPlus className="text-white text-3xl" />,
      title: "Create an Account",
      description: "Sign up as a volunteer or register your organization in minutes.",
      color: "bg-primary"
    },
    {
      icon: <FiSearch className="text-white text-3xl" />,
      title: "Find Opportunities",
      description: "Browse public events or join an organization to access exclusive opportunities.",
      color: "bg-accent"
    },
    {
      icon: <FiCalendar className="text-white text-3xl" />,
      title: "Participate in Events",
      description: "Apply to events that match your interests and availability.",
      color: "bg-primary"
    },
    {
      icon: <FiCheck className="text-white text-3xl" />,
      title: "Track Your Impact",
      description: "Earn badges, track hours, and build your volunteer portfolio.",
      color: "bg-accent"
    }
  ]

  return (
    <section id="how-to-use" className="py-20 scroll-section">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="section-title">How to Use <span className="text-primary">V-Connect</span></h2>
          <p className="section-subtitle">
            Getting started with V-Connect is easy. Follow these simple steps to begin your volunteering journey
            or to enhance your organization's volunteer management.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="mt-16 relative">
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="relative z-10"
                variants={itemVariants}
              >
                <div className="flex flex-col items-center p-6 hover:shadow-md transition-shadow duration-300">
                  <div className="relative">
                    <motion.div 
                      className={`${step.color} w-16 h-16 rounded-full flex items-center justify-center mb-5 shadow-md`}
                      whileHover={{ 
                        scale: 1.08,
                        rotate: [0, -3, 3, -3, 0],
                        transition: { 
                          rotate: { repeat: 0, duration: 0.4 },
                          scale: { duration: 0.2 }
                        }
                      }}
                    >
                      {step.icon}
                    </motion.div>
                    <motion.div
                      className="absolute -top-1 -right-1 bg-white rounded-full w-7 h-7 flex items-center justify-center border border-gray-100 font-bold text-primary"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: false }}
                      transition={{ delay: 0.3 + index * 0.15, duration: 0.25, type: "spring" }}
                    >
                      {index + 1}
                    </motion.div>
                  </div>
                  <motion.h3 
                    className="text-xl font-semibold mb-3 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: false }}
                    transition={{ delay: 0.1 + index * 0.1, duration: 0.5 }}
                  >
                    {step.title}
                  </motion.h3>
                  <motion.p 
                    className="text-gray-600 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: false }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                  >
                    {step.description}
                  </motion.p>
                  
                  {index < steps.length - 1 && (
                    <motion.div 
                      className="hidden lg:flex absolute -right-4 top-1/2 transform -translate-y-1/2 z-10"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                    >
                      <FiArrowRight className="text-primary text-2xl" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Organization Process */}
        <div className="mt-20 pt-8">
          <motion.h3
            className="text-2xl font-bold text-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ 
              duration: 0.4,
              type: "spring",
              stiffness: 100
            }}
          >
            For <span className="text-accent">Organizations</span>
          </motion.h3>
          
          <motion.p
            className="text-center text-gray-600 max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Organizations can efficiently manage volunteers and events through our streamlined process
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="p-6"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.35, delay: 0.15 }}
              whileHover={{ y: -4, boxShadow: "0 10px 15px -5px rgba(0, 0, 0, 0.08)" }}
            >
              <div className="w-16 h-16 rounded-full border border-accent/20 flex items-center justify-center mb-4 mx-auto">
                <FiUserPlus className="text-accent text-2xl" />
              </div>
              <h4 className="font-semibold text-lg mb-3 text-center">Register & Verify</h4>
              <p className="text-gray-600 text-center">Register your organization, provide necessary documentation, and get verified by our admin team.</p>
            </motion.div>
            
            <motion.div
              className="p-6"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.35, delay: 0.25 }}
              whileHover={{ y: -4, boxShadow: "0 10px 15px -5px rgba(0, 0, 0, 0.08)" }}
            >
              <div className="w-16 h-16 rounded-full border border-accent/20 flex items-center justify-center mb-4 mx-auto">
                <FiCalendar className="text-accent text-2xl" />
              </div>
              <h4 className="font-semibold text-lg mb-3 text-center">Create Events</h4>
              <p className="text-gray-600 text-center">Create public or private events, set requirements, and manage volunteer applications all in one place.</p>
            </motion.div>
            
            <motion.div
              className="p-6"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.35, delay: 0.35 }}
              whileHover={{ y: -4, boxShadow: "0 10px 15px -5px rgba(0, 0, 0, 0.08)" }}
            >
              <div className="w-16 h-16 rounded-full border border-accent/20 flex items-center justify-center mb-4 mx-auto">
                <FiCheck className="text-accent text-2xl" />
              </div>
              <h4 className="font-semibold text-lg mb-3 text-center">Track & Report</h4>
              <p className="text-gray-600 text-center">Track volunteer hours, generate reports, and manage your organization's impact metrics effortlessly.</p>
            </motion.div>
          </div>
        </div>
        
        {/* User Types */}
        <div className="mt-24">
          <motion.h3
            className="text-2xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ 
              duration: 0.8,
              type: "spring",
              stiffness: 100
            }}
          >
            Who Can Use <span className="text-primary">V-Connect</span>?
          </motion.h3>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
          >
            {/* Volunteers */}
            <motion.div
              className="rounded-lg border border-gray-50 overflow-hidden h-full"
              variants={itemVariants}
              whileHover={{ 
                y: -4,
                boxShadow: "0 10px 15px -5px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <motion.div 
                className="bg-primary h-1"
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              />
              <motion.div 
                className="p-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <motion.div 
                  className="w-14 h-14 rounded-full border border-primary/20 flex items-center justify-center mx-auto mb-5"
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <FiUserPlus className="text-primary text-xl" />
                </motion.div>
                
                <h4 className="text-xl font-semibold mb-4 text-center">For Volunteers</h4>
                
                <ul className="space-y-4">
                  {[
                    "Browse and apply to public events",
                    "Register with volunteer organizations",
                    "Access private organization events",
                    "Track volunteer hours and achievements",
                    "Build a volunteer portfolio with badges"
                  ].map((item, index) => (
                    <motion.li 
                      key={index} 
                      className="flex items-start"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false }}
                      transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
                    >
                      <motion.span 
                        className="text-primary mr-2 text-xl"
                        whileHover={{ scale: 1.2 }}
                      >•</motion.span>
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>

            {/* Organizations */}
            <motion.div
              className="rounded-lg border border-gray-50 overflow-hidden h-full"
              variants={itemVariants}
              whileHover={{ 
                y: -4,
                boxShadow: "0 10px 15px -5px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <motion.div 
                className="bg-accent h-1"
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
              <motion.div 
                className="p-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 0.3, delay: 0.25 }}
              >
                <motion.div 
                  className="w-14 h-14 rounded-full border border-accent/20 flex items-center justify-center mx-auto mb-5"
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <FiCalendar className="text-accent text-xl" />
                </motion.div>
                
                <h4 className="text-xl font-semibold mb-4 text-center">For Organizations</h4>
                
                <ul className="space-y-4">
                  {[
                    "Create and manage events",
                    "Approve volunteer membership requests",
                    "Create public or private events",
                    "Create donation campaigns",
                    "Showcase organization achievements"
                  ].map((item, index) => (
                    <motion.li 
                      key={index} 
                      className="flex items-start"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                    >
                      <motion.span 
                        className="text-accent mr-2 text-xl"
                        whileHover={{ scale: 1.2 }}
                      >•</motion.span>
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>

            {/* Admins */}
            <motion.div
              className="rounded-lg border border-gray-50 overflow-hidden h-full"
              variants={itemVariants}
              whileHover={{ 
                y: -4,
                boxShadow: "0 10px 15px -5px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <motion.div 
                className="bg-dark h-1"
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.25 }}
              />
              <motion.div 
                className="p-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <motion.div 
                  className="w-14 h-14 rounded-full border border-gray-300 flex items-center justify-center mx-auto mb-5"
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <FiCheck className="text-gray-800 text-xl" />
                </motion.div>
                
                <h4 className="text-xl font-semibold mb-4 text-center">For Admins</h4>
                
                <ul className="space-y-4">
                  {[
                    "Approve volunteer platform registrations",
                    "Approve event creation requests",
                    "Award badges to volunteers",
                    "Manage platform content",
                    "Oversee platform operations"
                  ].map((item, index) => (
                    <motion.li 
                      key={index} 
                      className="flex items-start"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
                    >
                      <motion.span 
                        className="text-dark mr-2 text-xl"
                        whileHover={{ scale: 1.2 }}
                      >•</motion.span>
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          className="mt-16 text-center bg-gradient-to-r from-primary to-blue-700 text-white p-8 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.45 }}
          whileHover={{ 
            boxShadow: "0 10px 20px -8px rgba(0, 90, 255, 0.15)",
            scale: 1.002
          }}
        >
          <motion.h3 
            className="text-2xl md:text-3xl font-bold mb-4"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.35, delay: 0.15 }}
          >
            Ready to Get Started?
          </motion.h3>
          <motion.p 
            className="text-lg opacity-90 mb-8 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.35, delay: 0.2 }}
          >
            Join our community of volunteers and organizations making a difference in communities around the world.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
          >
            <motion.button 
              className="bg-white text-primary hover:bg-gray-100 py-3 px-8 rounded-md font-medium transition-colors duration-300"
              whileHover={{ 
                scale: 1.02, 
                boxShadow: "0 3px 6px -2px rgba(255, 255, 255, 0.15)"
              }}
              whileTap={{ scale: 0.98 }}
              variants={itemVariants}
            >
              Sign Up Now
            </motion.button>
            <Link to="/learn-more">
              <motion.button 
                className="border border-white bg-transparent hover:bg-white/10 py-3 px-8 rounded-md font-medium transition-colors duration-300"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 3px 6px -2px rgba(255, 255, 255, 0.08)"
                }}
                whileTap={{ scale: 0.98 }}
                variants={itemVariants}
              >
                Learn More
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowToUse;
