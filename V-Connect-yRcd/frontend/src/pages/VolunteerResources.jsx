import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const VolunteerResources = () => {
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
                Volunteer Resources
              </motion.h1>
              <motion.p 
                className="text-lg text-blue-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Helpful resources, guides, and tips to enhance your volunteering experience.
              </motion.p>
            </div>
          </div>
        </section>
        
        {/* Content */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">Volunteering Guides</h2>
              <p className="text-gray-600 mb-6">
                This is placeholder content for the Volunteer Resources page. In a real implementation, this page would contain guides, tips, and best practices for volunteers.
              </p>
              
              <h2 className="text-2xl font-bold mb-4 mt-8">Training Materials</h2>
              <p className="text-gray-600 mb-6">
                Placeholder content for training materials that would help volunteers prepare for different types of volunteer opportunities.
              </p>
              
              <h2 className="text-2xl font-bold mb-4 mt-8">Volunteer Stories</h2>
              <p className="text-gray-600 mb-6">
                Placeholder content for stories from volunteers about their experiences and the impact of their work.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  )
}

export default VolunteerResources
