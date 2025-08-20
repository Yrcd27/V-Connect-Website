import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { FiPlus, FiMinus } from 'react-icons/fi'
import { useState } from 'react'

const FAQs = () => {
  const [openFaqs, setOpenFaqs] = useState([])
  
  const toggleFaq = (index) => {
    if (openFaqs.includes(index)) {
      setOpenFaqs(openFaqs.filter(item => item !== index))
    } else {
      setOpenFaqs([...openFaqs, index])
    }
  }
  
  const faqItems = [
    {
      question: "How do I sign up as a volunteer?",
      answer: "This is placeholder content for the answer to this FAQ question. In a real implementation, this would provide step-by-step instructions on how to sign up as a volunteer on the V-Connect platform."
    },
    {
      question: "How does an organization get verified?",
      answer: "This is placeholder content for the answer to this FAQ question. In a real implementation, this would explain the verification process for organizations including required documentation and timeline."
    },
    {
      question: "What types of volunteer opportunities are available?",
      answer: "This is placeholder content for the answer to this FAQ question. In a real implementation, this would describe the various types of volunteer opportunities available on the V-Connect platform."
    },
    {
      question: "How do I track my volunteer hours?",
      answer: "This is placeholder content for the answer to this FAQ question. In a real implementation, this would explain how volunteers can track their hours and contributions on the V-Connect platform."
    },
    {
      question: "Can I volunteer remotely?",
      answer: "This is placeholder content for the answer to this FAQ question. In a real implementation, this would describe remote volunteering options available through the V-Connect platform."
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
                Frequently Asked Questions
              </motion.h1>
              <motion.p 
                className="text-lg text-blue-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Find answers to common questions about using the V-Connect platform.
              </motion.p>
            </div>
          </div>
        </section>
        
        {/* FAQs */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <div className="space-y-6">
                {faqItems.map((faq, index) => (
                  <motion.div 
                    key={index}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <button
                      className="flex items-center justify-between w-full p-4 text-left bg-white hover:bg-gray-50 transition-colors"
                      onClick={() => toggleFaq(index)}
                    >
                      <span className="font-medium">{faq.question}</span>
                      <span className="text-primary">
                        {openFaqs.includes(index) ? <FiMinus /> : <FiPlus />}
                      </span>
                    </button>
                    
                    {openFaqs.includes(index) && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-4 bg-gray-50 border-t border-gray-200"
                      >
                        <p className="text-gray-600">{faq.answer}</p>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-12 text-center">
                <h3 className="text-xl font-bold mb-4">Still have questions?</h3>
                <p className="text-gray-600 mb-8">
                  If you couldn't find the answer to your question, feel free to contact our support team.
                </p>
                <Link to="/contact" className="btn-primary px-8 py-3 inline-block">
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  )
}

export default FAQs
