import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const PrivacyPolicy = () => {
  const [scrollY, setScrollY] = useState(100) // Initial value to keep navbar solid
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0)
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
                Privacy Policy
              </motion.h1>
              <motion.p 
                className="text-lg text-blue-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Last updated: August 15, 2025
              </motion.p>
            </div>
          </div>
        </section>
        
        {/* Privacy Policy Content */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              {/* Table of Contents */}
              <motion.div 
                className="bg-gray-50 p-6 rounded-lg mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-xl font-bold mb-4">Table of Contents</h3>
                <ol className="list-decimal list-inside space-y-2">
                  <li><a href="#introduction" className="text-primary hover:underline">Introduction</a></li>
                  <li><a href="#data-collected" className="text-primary hover:underline">Data We Collect</a></li>
                  <li><a href="#data-use" className="text-primary hover:underline">How We Use Your Data</a></li>
                  <li><a href="#data-security" className="text-primary hover:underline">Data Security</a></li>
                  <li><a href="#data-retention" className="text-primary hover:underline">Data Retention</a></li>
                  <li><a href="#legal-rights" className="text-primary hover:underline">Your Legal Rights</a></li>
                  <li><a href="#policy-changes" className="text-primary hover:underline">Changes to This Policy</a></li>
                  <li><a href="#contact" className="text-primary hover:underline">Contact Us</a></li>
                </ol>
              </motion.div>
              
              <motion.div 
                className="prose prose-lg mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h2 id="introduction" className="text-2xl font-bold pt-6 mb-4 border-b pb-2">1. Introduction</h2>
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-primary mb-6">
                  <p className="m-0">Welcome to V-Connect. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
                </div>
                
                <h2 id="data-collected" className="text-2xl font-bold pt-6 mb-4 border-b pb-2">2. Data We Collect</h2>
                <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-6">
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-primary mb-2">Identity Data</h3>
                    <p>First name, last name, username or similar identifier</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-primary mb-2">Contact Data</h3>
                    <p>Email address and telephone numbers</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-primary mb-2">Technical Data</h3>
                    <p>IP address, login data, browser type and version, time zone setting and location</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-primary mb-2">Profile Data</h3>
                    <p>Username, password, interests, preferences, feedback, and survey responses</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm md:col-span-2">
                    <h3 className="font-bold text-primary mb-2">Usage Data</h3>
                    <p>Information about how you use our website and services</p>
                  </div>
                </div>
                
                <h2 id="data-use" className="text-2xl font-bold pt-6 mb-4 border-b pb-2">3. How We Use Your Data</h2>
                <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm my-4">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-primary mr-2 text-lg">•</span>
                      <span>To register you as a new user</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2 text-lg">•</span>
                      <span>To manage our relationship with you</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2 text-lg">•</span>
                      <span>To enable you to participate in volunteer activities</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2 text-lg">•</span>
                      <span>To improve our website, products/services, marketing or customer relationships</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2 text-lg">•</span>
                      <span>To recommend opportunities that may be of interest to you</span>
                    </li>
                  </ul>
                </div>
                
                <h2 id="data-security" className="text-2xl font-bold pt-6 mb-4 border-b pb-2">4. Data Security</h2>
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500 mb-6">
                  <p className="m-0">We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.</p>
                </div>
                
                <h2 id="data-retention" className="text-2xl font-bold pt-6 mb-4 border-b pb-2">5. Data Retention</h2>
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm my-4">
                  <p>We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.</p>
                </div>
                
                <h2 id="legal-rights" className="text-2xl font-bold pt-6 mb-4 border-b pb-2">6. Your Legal Rights</h2>
                <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data including:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-6">
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <p className="font-medium">Request access to your personal data</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <p className="font-medium">Request correction of your personal data</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <p className="font-medium">Request erasure of your personal data</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <p className="font-medium">Object to processing of your personal data</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <p className="font-medium">Request restriction of processing</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <p className="font-medium">Right to withdraw consent</p>
                  </div>
                </div>
                
                <h2 id="policy-changes" className="text-2xl font-bold pt-6 mb-4 border-b pb-2">7. Changes to This Privacy Policy</h2>
                <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500 mb-6">
                  <p className="m-0">We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "last updated" date at the top of this policy.</p>
                </div>
                
                <h2 id="contact" className="text-2xl font-bold pt-6 mb-4 border-b pb-2">8. Contact Us</h2>
                <p>If you have any questions about this privacy policy or our privacy practices, please contact us at:</p>
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm my-4">
                  <div className="flex items-center mb-2">
                    <span className="font-bold w-24">Email:</span>
                    <a href="mailto:privacy@v-connect.org" className="text-primary">privacy@v-connect.org</a>
                  </div>
                  <div className="flex items-center mb-2">
                    <span className="font-bold w-24">Phone:</span>
                    <span>(555) 123-4567</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-bold w-24">Address:</span>
                    <span>123 Volunteer Street, Suite 456, Community City, ST 12345</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  )
}

export default PrivacyPolicy
