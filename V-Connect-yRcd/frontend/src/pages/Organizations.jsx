import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiUserPlus, FiSearch, FiCalendar, FiCheck, FiArrowRight, FiBriefcase, FiUsers, FiTrendingUp } from 'react-icons/fi'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Organizations = () => {
  const [scrollY, setScrollY] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    
    window.addEventListener('scroll', handleScroll)
    window.scrollTo(0, 0) // Scroll to top on component mount
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  
  // Define staggered animation variants with refined motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15
      }
    }
  }
  
  const itemVariants = {
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
      title: "Register & Verify",
      description: "Register your organization, provide necessary documentation, and get verified by our admin team.",
      color: "bg-accent"
    },
    {
      icon: <FiCalendar className="text-white text-3xl" />,
      title: "Create Events",
      description: "Create public or private events, set requirements, and manage volunteer applications all in one place.",
      color: "bg-primary"
    },
    {
      icon: <FiCheck className="text-white text-3xl" />,
      title: "Track & Report",
      description: "Track volunteer hours, generate reports, and manage your organization's impact metrics effortlessly.",
      color: "bg-accent"
    },
    {
      icon: <FiUsers className="text-white text-3xl" />,
      title: "Build Community",
      description: "Connect with volunteers who share your mission and build a dedicated community of supporters.",
      color: "bg-primary"
    }
  ]
  
  const benefits = [
    {
      icon: <FiUsers />,
      title: "Access to Verified Volunteers",
      description: "Connect with pre-vetted volunteers who match your organization's needs and mission."
    },
    {
      icon: <FiBriefcase />,
      title: "Simplified Management",
      description: "Easy-to-use tools for creating events, tracking hours, and managing volunteer communications."
    },
    {
      icon: <FiTrendingUp />,
      title: "Enhanced Visibility",
      description: "Showcase your mission and impact to a community passionate about volunteer work."
    }
  ]

  return (
    <>
      <Navbar scrollY={scrollY} />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-primary text-white py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                For Organizations
              </motion.h1>
              <motion.p 
                className="text-xl text-blue-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Empower your mission by connecting with passionate volunteers and streamlining your volunteer management
              </motion.p>
              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Link 
                  to="#get-started" 
                  className="bg-white text-primary hover:bg-blue-50 py-3 px-8 rounded-md font-medium transition-colors duration-300 inline-block"
                >
                  Get Started Today
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">How It Works for <span className="text-accent">Organizations</span></h2>
              <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto">
                Getting started with V-Connect is easy. Follow these simple steps to enhance your organization's volunteer management.
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
                          className="absolute -top-1 -right-1 bg-white rounded-full w-7 h-7 flex items-center justify-center border border-gray-100 font-bold text-accent"
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
                          <FiArrowRight className="text-accent text-2xl" />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Benefits */}
        <section className="py-16 bg-gray-50" id="get-started">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.4 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">Why Organizations Choose V-Connect</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Join hundreds of organizations that are already streamlining their volunteer management with our platform
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-lg border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                >
                  <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mb-4 text-primary text-2xl">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="text-2xl font-bold mb-6">Ready to Get Started?</h3>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <motion.button
                  className="btn-primary py-3 px-8"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Register Your Organization
                </motion.button>
                <Link to="/contact">
                  <motion.button
                    className="btn-outline py-3 px-8"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Contact Our Team
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Success Stories Teaser */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.4 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                See how organizations like yours have achieved their goals with V-Connect
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((item, index) => (
                <motion.div
                  key={index}
                  className="border border-gray-100 rounded-lg overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-2">Organization Success Story {item}</h3>
                    <p className="text-gray-600 mb-4">
                      This organization increased volunteer engagement by 45% within three months of joining V-Connect.
                    </p>
                    <Link to="/case-studies" className="text-primary font-medium flex items-center">
                      Read Case Study <FiArrowRight className="ml-2" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <motion.section
          className="bg-gradient-to-r from-primary to-blue-700 text-white py-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto px-6 text-center">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.4 }}
            >
              Ready to Get Started?
            </motion.h2>
            <motion.p
              className="text-xl mb-8 max-w-2xl mx-auto opacity-90"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              Join our community of organizations making a difference in communities around the world.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
            >
              <motion.button
                className="bg-white text-primary hover:bg-gray-100 py-3 px-8 rounded-md font-medium transition-colors duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                variants={itemVariants}
              >
                Sign Up Now
              </motion.button>
              <Link to="/learn-more">
                <motion.button
                  className="border border-white bg-transparent hover:bg-white/10 py-3 px-8 rounded-md text-white font-medium transition-colors duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  variants={itemVariants}
                >
                  Learn More
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.section>
      </main>
      
      <Footer />
    </>
  )
}

export default Organizations
