import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi'

const Testimonials = () => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  // Dummy testimonial data
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Volunteer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      quote: "V-Connect has completely transformed how I find volunteer opportunities. I've met amazing people and contributed to causes I'm passionate about.",
      rating: 5
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Organization Leader, GreenEarth",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      quote: "Managing volunteers used to be our biggest challenge until we found V-Connect. Now we can focus on our mission while the platform handles volunteer coordination.",
      rating: 5
    },
    {
      id: 3,
      name: "Aisha Patel",
      role: "Volunteer",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      quote: "The badges and recognition system makes volunteering even more rewarding. I love being able to track my impact and see the difference I'm making.",
      rating: 4
    },
    {
      id: 4,
      name: "Robert Williams",
      role: "Organization Director, Community Care",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      quote: "V-Connect has helped us reach more volunteers than ever before. The ability to create both public and private events gives us the flexibility we need.",
      rating: 5
    }
  ]

  const [activeIndex, setActiveIndex] = useState(0)

  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section id="testimonials" className="py-20 scroll-section">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="section-title">What Our <span className="text-primary">Community</span> Says</h2>
          <p className="section-subtitle">
            Hear from volunteers and organizations who have experienced the impact of V-Connect in their volunteering journey.
          </p>
        </motion.div>

        {/* Testimonials carousel */}
        <div className="mt-12 relative max-w-4xl mx-auto">
          {/* Testimonial card */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={testimonials[activeIndex].id}
              className="bg-white rounded-2xl shadow-lg p-8 md:p-10"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ 
                type: "spring",
                stiffness: 300, 
                damping: 30,
                duration: 0.5 
              }}
            >
              <div className="flex flex-col md:flex-row md:items-center">
                {/* Image */}
                <motion.div 
                  className="mb-6 md:mb-0 md:mr-8 flex-shrink-0"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <img 
                    src={testimonials[activeIndex].image} 
                    alt={testimonials[activeIndex].name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-secondary mx-auto"
                  />
                </motion.div>
                
                {/* Content */}
                <div>
                  <motion.div 
                    className="flex mb-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: 0.3 + i * 0.1 }}
                      >
                        <FiStar className="text-yellow-400 fill-current" />
                      </motion.div>
                    ))}
                  </motion.div>
                  
                  <motion.blockquote 
                    className="text-lg md:text-xl italic text-gray-700 mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    "{testimonials[activeIndex].quote}"
                  </motion.blockquote>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <h4 className="font-semibold text-lg">{testimonials[activeIndex].name}</h4>
                    <p className="text-gray-600">{testimonials[activeIndex].role}</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <motion.button
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100"
            onClick={prevTestimonial}
            whileHover={{ scale: 1.1, x: -25 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            aria-label="Previous testimonial"
          >
            <FiChevronLeft className="text-primary" size={20} />
          </motion.button>
          
          <motion.button
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100"
            onClick={nextTestimonial}
            whileHover={{ scale: 1.1, x: 25 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            aria-label="Next testimonial"
          >
            <FiChevronRight className="text-primary" size={20} />
          </motion.button>

          {/* Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === activeIndex ? 'bg-primary' : 'bg-gray-300'
                }`}
                onClick={() => setActiveIndex(index)}
                whileHover={{ scale: 1.5 }}
                whileTap={{ scale: 0.9 }}
                animate={index === activeIndex ? { scale: 1.2 } : { scale: 1 }}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Join CTA */}
        <motion.div
          className="mt-20 text-center bg-primary text-white py-12 px-4 rounded-2xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to Share Your Story?</h3>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
            Join our community of volunteers and organizations making a difference every day.
            Start your volunteer journey with V-Connect today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <motion.button 
              className="bg-white text-primary hover:bg-gray-100 py-3 px-8 rounded-md font-medium transition-colors duration-300"
              whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(255, 255, 255, 0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              Join as Volunteer
            </motion.button>
            <motion.button 
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary py-3 px-8 rounded-md font-medium transition-colors duration-300"
              whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(255, 255, 255, 0.2)" }}
              whileTap={{ scale: 0.95 }}
            >
              Register Organization
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Testimonials
