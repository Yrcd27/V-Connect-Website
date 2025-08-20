import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const TermsOfService = () => {
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
                Terms of Service
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
        
        {/* Terms of Service Content */}
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
                  <li><a href="#definitions" className="text-primary hover:underline">Definitions</a></li>
                  <li><a href="#registration" className="text-primary hover:underline">Account Registration</a></li>
                  <li><a href="#conduct" className="text-primary hover:underline">User Conduct</a></li>
                  <li><a href="#opportunities" className="text-primary hover:underline">Volunteer Opportunities</a></li>
                  <li><a href="#intellectual" className="text-primary hover:underline">Intellectual Property Rights</a></li>
                  <li><a href="#limitation" className="text-primary hover:underline">Limitation of Liability</a></li>
                  <li><a href="#changes" className="text-primary hover:underline">Changes to Terms</a></li>
                  <li><a href="#governing" className="text-primary hover:underline">Governing Law</a></li>
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
                  <p className="m-0">Welcome to V-Connect. These Terms of Service govern your use of our website and services. By using V-Connect, you agree to these Terms. Please read them carefully.</p>
                </div>
                
                <h2 id="definitions" className="text-2xl font-bold pt-6 mb-4 border-b pb-2">2. Definitions</h2>
                <p>In these Terms:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-6">
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-primary mb-2">"Platform"</h3>
                    <p>The V-Connect website and services</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-primary mb-2">"User"</h3>
                    <p>Any individual who accesses or uses the Platform</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-primary mb-2">"Volunteer"</h3>
                    <p>Any User who registers to participate in volunteer activities</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-primary mb-2">"Organization"</h3>
                    <p>Any entity that registers to post volunteer opportunities</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm md:col-span-2">
                    <h3 className="font-bold text-primary mb-2">"Content"</h3>
                    <p>Any information, text, graphics, photos or other materials uploaded, downloaded or appearing on the Platform</p>
                  </div>
                </div>
                
                <h2 id="registration" className="text-2xl font-bold pt-6 mb-4 border-b pb-2">3. Account Registration</h2>
                <p>To access certain features of the Platform, you may be required to create an account. You are responsible for:</p>
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm my-4">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-primary mr-2 text-lg">•</span>
                      <span>Providing accurate and complete information during registration</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2 text-lg">•</span>
                      <span>Maintaining the security of your password and account</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2 text-lg">•</span>
                      <span>All activities that occur under your account</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2 text-lg">•</span>
                      <span>Notifying us immediately of any unauthorized use of your account</span>
                    </li>
                  </ul>
                </div>
                
                <h2 id="conduct" className="text-2xl font-bold pt-6 mb-4 border-b pb-2">4. User Conduct</h2>
                <p>When using the Platform, you agree not to:</p>
                <div className="bg-red-50 p-5 rounded-lg border-l-4 border-red-400 my-4">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">×</span>
                      <span>Violate any applicable laws or regulations</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">×</span>
                      <span>Impersonate any person or entity</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">×</span>
                      <span>Post or transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">×</span>
                      <span>Interfere with the proper working of the Platform</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">×</span>
                      <span>Attempt to bypass any measures we use to prevent or restrict access to the Platform</span>
                    </li>
                  </ul>
                </div>
                
                <h2 id="opportunities" className="text-2xl font-bold pt-6 mb-4 border-b pb-2">5. Volunteer Opportunities</h2>
                <p className="mb-4">V-Connect is a platform connecting volunteers with organizations. We do not:</p>
                <div className="bg-yellow-50 p-5 rounded-lg border-l-4 border-yellow-400 my-4">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-yellow-600 mr-2">!</span>
                      <span>Guarantee the quality, safety, or legality of any volunteer opportunity</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-600 mr-2">!</span>
                      <span>Endorse any organization or their activities</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-600 mr-2">!</span>
                      <span>Guarantee that volunteer opportunities will meet your expectations</span>
                    </li>
                  </ul>
                </div>
                <p className="mt-4 font-medium">You are solely responsible for evaluating and selecting volunteer opportunities.</p>
                
                <h2 id="intellectual" className="text-2xl font-bold pt-6 mb-4 border-b pb-2">6. Intellectual Property Rights</h2>
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm my-4">
                  <p>The Platform and its original content, features, and functionality are owned by V-Connect and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.</p>
                </div>
                
                <h2 id="limitation" className="text-2xl font-bold pt-6 mb-4 border-b pb-2">7. Limitation of Liability</h2>
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 my-4">
                  <p className="font-medium">Important Notice:</p>
                  <p>To the fullest extent permitted by applicable law, V-Connect shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to, loss of profits, data, use, goodwill, or other intangible losses.</p>
                </div>
                
                <h2 id="changes" className="text-2xl font-bold pt-6 mb-4 border-b pb-2">8. Changes to Terms</h2>
                <div className="bg-blue-50 p-5 rounded-lg border-l-4 border-blue-400 my-4">
                  <p>We may modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page and updating the "last updated" date. Your continued use of the Platform after any changes indicates your acceptance of the new Terms.</p>
                </div>
                
                <h2 id="governing" className="text-2xl font-bold pt-6 mb-4 border-b pb-2">9. Governing Law</h2>
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm my-4">
                  <p>These Terms shall be governed by the laws of the state where V-Connect is headquartered, without regard to its conflict of law provisions.</p>
                </div>
                
                <h2 id="contact" className="text-2xl font-bold pt-6 mb-4 border-b pb-2">10. Contact Us</h2>
                <p>If you have any questions about these Terms, please contact us at:</p>
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm my-4">
                  <div className="flex items-center mb-2">
                    <span className="font-bold w-24">Email:</span>
                    <a href="mailto:terms@v-connect.org" className="text-primary">terms@v-connect.org</a>
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

export default TermsOfService
