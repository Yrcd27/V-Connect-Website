import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { FiCheckCircle, FiShield, FiUsers, FiHelpCircle, FiUserPlus, FiSearch, FiCalendar, FiEdit, FiCheck, FiBriefcase, FiTrendingUp, FiMonitor, FiClock, FiDownload, FiArrowRight, FiFileText } from 'react-icons/fi'

const LearnMore = () => {
  const [scrollY, setScrollY] = useState(0)
  const [activeTab, setActiveTab] = useState('volunteers')
  
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
  
  const volunteerWorkflow = [
    {
      icon: <FiUserPlus className="text-white text-3xl" />,
      title: "Sign Up & Profile",
      description: "Create your volunteer profile, add your skills, interests, and availability to get personalized opportunities.",
      color: "bg-primary"
    },
    {
      icon: <FiSearch className="text-white text-3xl" />,
      title: "Browse & Apply",
      description: "Find volunteering opportunities that match your interests, skills, and schedule, then apply directly.",
      color: "bg-accent"
    },
    {
      icon: <FiCalendar className="text-white text-3xl" />,
      title: "Participate & Serve",
      description: "Attend orientation sessions, complete required training, and fulfill your volunteer commitments.",
      color: "bg-primary"
    },
    {
      icon: <FiFileText className="text-white text-3xl" />,
      title: "Track & Verify",
      description: "Log your hours, get them verified by organizations, and build your volunteer portfolio with impact metrics.",
      color: "bg-accent"
    }
  ]
  
  const organizationWorkflow = [
    {
      icon: <FiUserPlus className="text-white text-3xl" />,
      title: "Register & Verify",
      description: "Register your organization, provide necessary documentation, and get verified by our admin team.",
      color: "bg-accent"
    },
    {
      icon: <FiEdit className="text-white text-3xl" />,
      title: "Create Events",
      description: "Create public or private events, set requirements, and manage volunteer applications all in one place.",
      color: "bg-primary"
    },
    {
      icon: <FiUsers className="text-white text-3xl" />,
      title: "Manage Volunteers",
      description: "Screen applications, approve volunteers, track attendance, and communicate with your volunteer team.",
      color: "bg-accent"
    },
    {
      icon: <FiCheck className="text-white text-3xl" />,
      title: "Track & Report",
      description: "Track volunteer hours, generate reports, and manage your organization's impact metrics effortlessly.",
      color: "bg-primary"
    }
  ]
  
  const adminWorkflow = [
    {
      icon: <FiMonitor className="text-white text-3xl" />,
      title: "Platform Management",
      description: "Monitor and manage platform activity, user accounts, and ensure everything runs smoothly.",
      color: "bg-primary"
    },
    {
      icon: <FiUserPlus className="text-white text-3xl" />,
      title: "Organization Verification",
      description: "Review documentation and verify organizations to ensure legitimacy and build user trust.",
      color: "bg-accent"
    },
    {
      icon: <FiClock className="text-white text-3xl" />,
      title: "Event Approval",
      description: "Review and approve events created by organizations to ensure they meet community standards.",
      color: "bg-primary"
    },
    {
      icon: <FiDownload className="text-white text-3xl" />,
      title: "Analytics & Reporting",
      description: "Generate platform-wide reports, track growth metrics, and provide insights to stakeholders.",
      color: "bg-accent"
    }
  ]

  return (
    <>
      <Navbar scrollY={scrollY} />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-primary text-white py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Learn More About V-Connect
              </motion.h1>
              <motion.p 
                className="text-xl text-blue-100 max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Discover how our platform connects passionate volunteers with meaningful opportunities and helps organizations maximize their impact through efficient volunteer management
              </motion.p>
              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <a
                  href="#workflows" 
                  className="bg-white text-primary hover:bg-blue-50 py-3 px-8 rounded-md font-medium transition-colors duration-300 inline-block"
                >
                  Explore Platform Features
                </a>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Mission */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <motion.h2 
                className="text-3xl font-bold mb-8 text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Our Mission
              </motion.h2>
              <motion.p 
                className="text-lg mb-6 text-gray-600"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                At V-Connect, we believe that volunteering is one of the most powerful ways to create positive change in communities around the world. Our mission is to break down barriers that prevent people from volunteering and make it easier for organizations to find and manage the help they need.
              </motion.p>
              <motion.p 
                className="text-lg text-gray-600"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                We've built a platform that simplifies the entire volunteering process—from discovering opportunities that match your skills and interests to tracking your impact and building a portfolio of your contributions. For organizations, we provide powerful tools to create events, manage volunteers, and measure the impact of their programs.
              </motion.p>
            </div>
          </div>
        </section>
        
        {/* Detailed Workflow Section */}
        <section className="py-20 bg-gray-50" id="workflows">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.4 }}
              className="mb-12 text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How V-Connect Works</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our platform is designed to make volunteering and volunteer management simple and effective for everyone involved
              </p>
            </motion.div>

            {/* Tabs */}
            <div className="flex justify-center mb-12">
              <div className="inline-flex bg-white rounded-full p-1 border shadow-sm">
                <button
                  onClick={() => setActiveTab('volunteers')}
                  className={`px-5 py-2 rounded-full transition-all duration-300 ${
                    activeTab === 'volunteers' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  For Volunteers
                </button>
                <button
                  onClick={() => setActiveTab('organizations')}
                  className={`px-5 py-2 rounded-full transition-all duration-300 ${
                    activeTab === 'organizations' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  For Organizations
                </button>
                <button
                  onClick={() => setActiveTab('admins')}
                  className={`px-5 py-2 rounded-full transition-all duration-300 ${
                    activeTab === 'admins' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  For Admins
                </button>
              </div>
            </div>

            {/* Workflow Steps */}
            <div className="mt-8 relative">
              {activeTab === 'volunteers' && (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  key="volunteers"
                >
                  {volunteerWorkflow.map((step, index) => (
                    <motion.div
                      key={index}
                      className="relative z-10"
                      variants={itemVariants}
                    >
                      <div className="flex flex-col items-center p-6 hover:shadow-md rounded-lg bg-white transition-shadow duration-300">
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
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + index * 0.15, duration: 0.25, type: "spring" }}
                          >
                            {index + 1}
                          </motion.div>
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-center">{step.title}</h3>
                        <p className="text-gray-600 text-center">{step.description}</p>
                        
                        {index < volunteerWorkflow.length - 1 && (
                          <motion.div 
                            className="hidden lg:flex absolute -right-4 top-1/2 transform -translate-y-1/2 z-10"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                          >
                            <FiArrowRight className="text-accent text-2xl" />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'organizations' && (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  key="organizations"
                >
                  {organizationWorkflow.map((step, index) => (
                    <motion.div
                      key={index}
                      className="relative z-10"
                      variants={itemVariants}
                    >
                      <div className="flex flex-col items-center p-6 hover:shadow-md rounded-lg bg-white transition-shadow duration-300">
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
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + index * 0.15, duration: 0.25, type: "spring" }}
                          >
                            {index + 1}
                          </motion.div>
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-center">{step.title}</h3>
                        <p className="text-gray-600 text-center">{step.description}</p>
                        
                        {index < organizationWorkflow.length - 1 && (
                          <motion.div 
                            className="hidden lg:flex absolute -right-4 top-1/2 transform -translate-y-1/2 z-10"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                          >
                            <FiArrowRight className="text-accent text-2xl" />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'admins' && (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  key="admins"
                >
                  {adminWorkflow.map((step, index) => (
                    <motion.div
                      key={index}
                      className="relative z-10"
                      variants={itemVariants}
                    >
                      <div className="flex flex-col items-center p-6 hover:shadow-md rounded-lg bg-white transition-shadow duration-300">
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
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + index * 0.15, duration: 0.25, type: "spring" }}
                          >
                            {index + 1}
                          </motion.div>
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-center">{step.title}</h3>
                        <p className="text-gray-600 text-center">{step.description}</p>
                        
                        {index < adminWorkflow.length - 1 && (
                          <motion.div 
                            className="hidden lg:flex absolute -right-4 top-1/2 transform -translate-y-1/2 z-10"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                          >
                            <FiArrowRight className="text-accent text-2xl" />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </section>
        
        {/* Key Features */}
        <section className="py-16" id="detailed-features">
          <div className="container mx-auto px-6">
            <motion.h2 
              className="text-3xl font-bold mb-12 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Platform Features
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {/* For Volunteers */}
              <motion.div 
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-semibold mb-6 text-primary">For Volunteers</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <FiCheckCircle className="text-primary mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Personalized Opportunity Matching</span>
                      <p className="text-gray-600 mt-1">Our smart algorithm matches you with opportunities based on your skills, interests, and availability preferences.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <FiCheckCircle className="text-primary mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Digital Volunteer Portfolio</span>
                      <p className="text-gray-600 mt-1">Track all your volunteer hours, achievements, and impact metrics in one place. Generate reports for school, work, or personal records.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <FiCheckCircle className="text-primary mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Skill Development Tracking</span>
                      <p className="text-gray-600 mt-1">Track which skills you're developing through different volunteer experiences and showcase your growth.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <FiCheckCircle className="text-primary mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Verified Certificates</span>
                      <p className="text-gray-600 mt-1">Receive digital certificates for completed volunteer work that can be shared on LinkedIn or included in resumes.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <FiCheckCircle className="text-primary mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Volunteer Community</span>
                      <p className="text-gray-600 mt-1">Connect with other volunteers, share experiences, and build a network of like-minded individuals.</p>
                    </div>
                  </li>
                </ul>
              </motion.div>
              
              {/* For Organizations */}
              <motion.div 
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-2xl font-semibold mb-6 text-accent">For Organizations</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <FiCheckCircle className="text-accent mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Complete Volunteer Management</span>
                      <p className="text-gray-600 mt-1">Create events, manage applications, track attendance, and communicate with volunteers all in one platform.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <FiCheckCircle className="text-accent mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Detailed Analytics & Reporting</span>
                      <p className="text-gray-600 mt-1">Access real-time data on volunteer engagement, hours contributed, and impact metrics for grant applications and annual reports.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <FiCheckCircle className="text-accent mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Verification System</span>
                      <p className="text-gray-600 mt-1">Easily verify volunteer hours and contributions with our secure digital verification system.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <FiCheckCircle className="text-accent mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Customizable Screening</span>
                      <p className="text-gray-600 mt-1">Create custom application forms and screening processes for different volunteer positions.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <FiCheckCircle className="text-accent mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Donation Campaigns</span>
                      <p className="text-gray-600 mt-1">Launch donation campaigns connected to your volunteer events for integrated fundraising capabilities.</p>
                    </div>
                  </li>
                </ul>
              </motion.div>
            </div>

            <motion.div
              className="mt-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-gray-50 p-8 rounded-xl max-w-5xl mx-auto border border-gray-100">
                <h3 className="text-2xl font-semibold mb-6 text-center">For Platform Administrators</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <FiCheckCircle className="text-primary mt-1 mr-3" />
                      <span>Organization verification and management</span>
                    </li>
                    <li className="flex items-start">
                      <FiCheckCircle className="text-primary mt-1 mr-3" />
                      <span>User account oversight and support</span>
                    </li>
                    <li className="flex items-start">
                      <FiCheckCircle className="text-primary mt-1 mr-3" />
                      <span>Content moderation and quality control</span>
                    </li>
                  </ul>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <FiCheckCircle className="text-primary mt-1 mr-3" />
                      <span>Platform-wide analytics and reporting</span>
                    </li>
                    <li className="flex items-start">
                      <FiCheckCircle className="text-primary mt-1 mr-3" />
                      <span>System maintenance and updates</span>
                    </li>
                    <li className="flex items-start">
                      <FiCheckCircle className="text-primary mt-1 mr-3" />
                      <span>Event approval and featured content selection</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Benefits Comparison */}
        <section className="py-20 bg-gray-50" id="get-started">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.4 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">Why Choose V-Connect?</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our platform is designed to maximize impact for both volunteers and organizations
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Benefits for Volunteers */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-primary mb-6">For Volunteers</h3>
                <motion.div
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.4 }}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                >
                  <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mb-4 text-primary text-2xl">
                    <FiSearch />
                  </div>
                  <h4 className="text-xl font-bold mb-3">Personalized Opportunities</h4>
                  <p className="text-gray-600">Find volunteer opportunities that match your skills, interests, and availability.</p>
                </motion.div>
                
                <motion.div
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                >
                  <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mb-4 text-primary text-2xl">
                    <FiFileText />
                  </div>
                  <h4 className="text-xl font-bold mb-3">Impact Portfolio</h4>
                  <p className="text-gray-600">Build a verified record of your volunteer contributions and skills development.</p>
                </motion.div>
                
                <motion.div
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                >
                  <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mb-4 text-primary text-2xl">
                    <FiUsers />
                  </div>
                  <h4 className="text-xl font-bold mb-3">Community Connection</h4>
                  <p className="text-gray-600">Connect with like-minded volunteers and organizations making a difference.</p>
                </motion.div>
              </div>

              {/* Benefits for Organizations */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-accent mb-6">For Organizations</h3>
                <motion.div
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                >
                  <div className="bg-accent/10 w-14 h-14 rounded-full flex items-center justify-center mb-4 text-accent text-2xl">
                    <FiUsers />
                  </div>
                  <h4 className="text-xl font-bold mb-3">Access to Verified Volunteers</h4>
                  <p className="text-gray-600">Connect with pre-vetted volunteers who match your organization's needs and mission.</p>
                </motion.div>
                
                <motion.div
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.4, delay: 0.25 }}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                >
                  <div className="bg-accent/10 w-14 h-14 rounded-full flex items-center justify-center mb-4 text-accent text-2xl">
                    <FiBriefcase />
                  </div>
                  <h4 className="text-xl font-bold mb-3">Simplified Management</h4>
                  <p className="text-gray-600">Easy-to-use tools for creating events, tracking hours, and managing volunteer communications.</p>
                </motion.div>
                
                <motion.div
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.4, delay: 0.35 }}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                >
                  <div className="bg-accent/10 w-14 h-14 rounded-full flex items-center justify-center mb-4 text-accent text-2xl">
                    <FiTrendingUp />
                  </div>
                  <h4 className="text-xl font-bold mb-3">Enhanced Visibility</h4>
                  <p className="text-gray-600">Showcase your mission and impact to a community passionate about volunteer work.</p>
                </motion.div>
              </div>
            </div>
            
            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <h3 className="text-2xl font-bold mb-6">Ready to Join Our Community?</h3>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <motion.button
                  className="bg-primary text-white hover:bg-primary/90 py-3 px-8 rounded-md font-medium transition-colors duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Sign Up as Volunteer
                </motion.button>
                <motion.button
                  className="bg-accent text-white hover:bg-accent/90 py-3 px-8 rounded-md font-medium transition-colors duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Register Organization
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Security & Privacy */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <motion.div 
              className="max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-center mb-6">
                <FiShield className="text-primary text-4xl" />
              </div>
              <h2 className="text-2xl font-bold mb-6 text-center">Security & Privacy</h2>
              <p className="text-lg mb-6 text-gray-600">
                We take the security and privacy of our users seriously. All data on V-Connect is encrypted and stored securely. We never share your personal information with third parties without your explicit consent.
              </p>
              <p className="text-lg mb-6 text-gray-600">
                For organizations, we provide verification processes to ensure the legitimacy of all registered entities on our platform. This creates a safe environment for both volunteers and organizations.
              </p>
              <p className="text-center mt-8">
                <Link to="/privacy-policy" className="text-primary hover:underline">
                  Read our full Privacy Policy
                </Link>
              </p>
            </motion.div>
          </div>
        </section>

        {/* FAQs Teaser */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <motion.div
                className="flex items-center justify-center mb-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <FiHelpCircle className="text-primary text-4xl" />
              </motion.div>
              <motion.h2 
                className="text-2xl font-bold mb-6 text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Frequently Asked Questions
              </motion.h2>
              
              <div className="space-y-6">
                <motion.div 
                  className="bg-white p-6 rounded-lg shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h3 className="font-medium mb-2">How do I sign up as a volunteer?</h3>
                  <p className="text-gray-600">
                    You can sign up by clicking the "Join as Volunteer" button on our homepage, filling out a short profile, and verifying your email address. You'll then have access to browse and apply for volunteer opportunities.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="bg-white p-6 rounded-lg shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="font-medium mb-2">How does an organization get verified?</h3>
                  <p className="text-gray-600">
                    Organizations register by providing their details and documentation. Our team verifies the information, typically within 1-2 business days. Once verified, organizations can create events and campaigns.
                  </p>
                </motion.div>

                <motion.div 
                  className="bg-white p-6 rounded-lg shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="font-medium mb-2">Is there a cost to use V-Connect?</h3>
                  <p className="text-gray-600">
                    V-Connect is completely free for volunteers. Organizations can access basic features for free, with premium features available through subscription plans that help support the platform's operations.
                  </p>
                </motion.div>
              </div>
              
              <motion.div 
                className="mt-10 text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <Link 
                  to="/faqs"
                  className="bg-primary text-white hover:bg-primary/90 px-8 py-3 rounded-md font-medium transition-colors duration-300 inline-block"
                >
                  View All FAQs
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-primary to-blue-700 text-white">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <motion.h2 
                className="text-3xl font-bold mb-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Ready to Get Started?
              </motion.h2>
              <motion.p 
                className="text-xl mb-8 text-blue-100"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                Join our community of volunteers and organizations making a difference in communities around the world.
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <button className="bg-white text-primary hover:bg-blue-50 py-3 px-8 rounded-md font-medium transition-colors">
                  Sign Up Now
                </button>
                <Link to="/" className="border-2 border-white bg-transparent hover:bg-white/10 py-3 px-8 rounded-md font-medium transition-colors">
                  Back to Home
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  )
}

export default LearnMore
