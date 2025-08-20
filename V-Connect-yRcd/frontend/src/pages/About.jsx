import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const About = () => {
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
                About V-Connect
              </motion.h1>
              <motion.p 
                className="text-lg text-blue-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Learn more about our platform, mission, and the team behind V-Connect.
              </motion.p>
            </div>
          </div>
        </section>
        
        {/* Content */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">Our Story</h2>
              <p className="text-gray-600 mb-6">
                This is placeholder content for the About page. In a real implementation, this page would contain detailed information about the V-Connect platform, its history, mission, vision, and the team behind it.
              </p>
              
              <h2 className="text-2xl font-bold mb-4 mt-8">Our Mission</h2>
              <p className="text-gray-600 mb-6">
                Placeholder content for the mission statement of V-Connect. This would describe the organization's purpose and goals in connecting volunteers with meaningful opportunities.
              </p>
              
              <h2 className="text-2xl font-bold mb-4 mt-8">Our Team</h2>
              <p className="text-gray-600 mb-6">
                Placeholder content for information about the team behind V-Connect. This would include profiles of key team members, their roles, and their backgrounds.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  )
}

export default About
