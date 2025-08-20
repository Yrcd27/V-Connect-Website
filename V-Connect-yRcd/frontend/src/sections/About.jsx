import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiUsers, FiCalendar, FiAward, FiHeart, FiTarget, FiTrendingUp } from 'react-icons/fi'

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  const features = [
    {
      icon: <FiUsers className="text-primary text-3xl" />,
      title: "For Volunteers",
      description: "Discover public events open to anyone. No organizational affiliation required. Join events that match your interests and availability."
    },
    {
      icon: <FiCalendar className="text-primary text-3xl" />,
      title: "For Organizations",
      description: "Create and manage events, approve volunteer requests, and showcase your organization's achievements and impact."
    },
    {
      icon: <FiAward className="text-primary text-3xl" />,
      title: "Recognition System",
      description: "Earn badges and recognition for your volunteer work. Track your impact and showcase your contributions."
    },
    {
      icon: <FiHeart className="text-primary text-3xl" />,
      title: "Community Impact",
      description: "Join forces with other volunteers and organizations to create meaningful change in your community."
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }
  
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 12
      } 
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  }
  
  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: { 
        type: "spring",
        stiffness: 260, 
        damping: 20 
      } 
    },
    hover: { 
      rotate: 360,
      transition: { duration: 0.8 }
    }
  }

  return (
    <section id="about" className="py-20 bg-gray-50 scroll-section">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          ref={ref}
        >
          <h2 className="section-title">About <span className="text-primary">V-Connect</span></h2>
          <p className="section-subtitle">
            V-Connect is a platform that bridges the gap between volunteers, organizations, and impactful events.
            Our mission is to make volunteering accessible, rewarding, and efficient for everyone involved.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl p-8 shadow-md border border-gray-100"
              variants={cardVariants}
              whileHover="hover"
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mb-6"
                variants={iconVariants}
                whileHover="hover"
              >
                {feature.icon}
              </motion.div>
              <motion.h3 
                className="text-xl font-semibold mb-3"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
              >
                {feature.title}
              </motion.h3>
              <motion.p 
                className="text-gray-600"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
              >
                {feature.description}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>

        {/* Vision and Mission */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            className="bg-white rounded-xl p-8 shadow-md border border-gray-100 overflow-hidden relative"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            whileHover={{ 
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
          >
            <motion.div
              className="absolute top-0 left-0 w-2 h-full bg-primary"
              initial={{ height: 0 }}
              whileInView={{ height: "100%" }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <motion.div 
                  className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mr-4"
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: false }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  whileHover={{ rotate: 360 }}
                >
                  <FiTarget className="text-primary text-xl" />
                </motion.div>
                <motion.h3 
                  className="text-2xl font-bold text-primary"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  Our Vision
                </motion.h3>
              </div>
              <motion.p 
                className="text-gray-600"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                To create a world where every individual can easily contribute to causes they care about, 
                and every organization can efficiently mobilize volunteers to achieve their mission.
              </motion.p>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl p-8 shadow-md border border-gray-100 overflow-hidden relative"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100, delay: 0.2 }}
            whileHover={{ 
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
          >
            <motion.div
              className="absolute top-0 left-0 w-2 h-full bg-primary"
              initial={{ height: 0 }}
              whileInView={{ height: "100%" }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <motion.div 
                  className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mr-4"
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: false }}
                  transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                  whileHover={{ rotate: 360 }}
                >
                  <FiTrendingUp className="text-primary text-xl" />
                </motion.div>
                <motion.h3 
                  className="text-2xl font-bold text-primary"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  Our Mission
                </motion.h3>
              </div>
              <motion.p 
                className="text-gray-600"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                To provide a comprehensive platform that connects volunteers with meaningful opportunities, 
                helps organizations manage their volunteer programs, and celebrates the impact of collective action.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
