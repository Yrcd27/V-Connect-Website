import { motion } from 'framer-motion'

const Hero = () => {
  return (
    <section id="hero" className="min-h-screen h-[105vh] flex items-center justify-center relative overflow-hidden wave-bg pt-30">
      <div className="container mx-auto px-6 py-20 md:py-24">
        <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
          {/* Hero Content */}
          <motion.div 
            className="w-full"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.4,
              type: "spring",
              stiffness: 100
            }}
          >
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <motion.span 
                className="block mb-2"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.15 }}
              >
                Connect, Collaborate
              </motion.span>
              <motion.span
                className="block text-primary"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.25 }}
              >
                Change the World
              </motion.span>
            </motion.h1>
            <motion.p 
              className="text-lg md:text-lg mb-10 text-gray-700 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              "Volunteering is the ultimate exercise in democracy. You vote in elections once a year, but when you volunteer, you vote every day about the kind of community you want to live in."
            </motion.p>
            
            {/* Buttons aligned as per reference image */}
            <motion.div
            className="flex flex-col sm:flex-row justify-center sm:items-stretch space-y-4 sm:space-y-0 sm:space-x-4 mt-4"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.4 }}
            >
            <motion.button
                className="btn-primary text-lg px-8 py-3 w-full sm:w-[320px] text-center"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
                Sign up as an Individual
            </motion.button>

            <motion.button
                className="btn-outline text-lg px-8 py-3 w-full sm:w-[320px] text-center"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
                Sign up as an Organization
            </motion.button>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
