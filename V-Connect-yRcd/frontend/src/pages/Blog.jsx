import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The Impact of Volunteering on Mental Health",
      excerpt: "Explore how volunteering can improve mental health and well-being through community connection and purpose.",
      date: "August 10, 2025",
      author: "Jane Smith",
      category: "Health & Wellness"
    },
    {
      id: 2,
      title: "Best Practices for Volunteer Management",
      excerpt: "Learn effective strategies for organizations to recruit, train, and retain volunteers for their programs.",
      date: "July 28, 2025",
      author: "Michael Johnson",
      category: "Organization Tips"
    },
    {
      id: 3,
      title: "Virtual Volunteering: Making an Impact from Home",
      excerpt: "Discover opportunities to volunteer remotely and contribute to causes from anywhere in the world.",
      date: "July 15, 2025",
      author: "Sarah Williams",
      category: "Remote Volunteering"
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
                V-Connect Blog
              </motion.h1>
              <motion.p 
                className="text-lg text-blue-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Insights, stories, and resources for volunteers and organizations.
              </motion.p>
            </div>
          </div>
        </section>
        
        {/* Blog Posts */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="space-y-12">
                {blogPosts.map((post, index) => (
                  <motion.article 
                    key={post.id}
                    className="border-b border-gray-200 pb-12 last:border-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <span className="text-sm text-primary font-medium">{post.category}</span>
                    <h2 className="text-2xl font-bold mt-2 mb-3">{post.title}</h2>
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <span>{post.author}</span>
                      <span className="mx-2">•</span>
                      <span>{post.date}</span>
                    </div>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <button className="text-primary font-medium hover:underline">Read More</button>
                  </motion.article>
                ))}
              </div>
              
              <div className="mt-12 text-center">
                <p className="text-gray-600 mb-6">
                  This is placeholder content for the Blog page. In a real implementation, this page would contain a list of actual blog posts with full content pages.
                </p>
                <button className="btn-outline px-8 py-3">
                  Load More Posts
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  )
}

export default Blog
