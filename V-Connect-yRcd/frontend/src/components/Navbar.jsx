import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiMenu, FiX } from 'react-icons/fi'
import { Link, useNavigate, useLocation } from 'react-router-dom'

const Navbar = ({ scrollY }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const isScrolled = scrollY > 50
  const isHomePage = location.pathname === '/'
  
  // Set login button width as CSS variable for donate button to match
  useEffect(() => {
    const updateLoginBtnWidth = () => {
      const loginBtn = document.querySelector('.login-btn');
      const mobileLoginBtn = document.querySelector('.mobile-login-btn');
      
      if (loginBtn) {
        document.documentElement.style.setProperty('--login-btn-width', `${loginBtn.offsetWidth}px`);
      }
      
      if (mobileLoginBtn) {
        document.documentElement.style.setProperty('--mobile-login-btn-width', `${mobileLoginBtn.offsetWidth}px`);
      }
    };
    
    // Run once after render and then on window resize
    window.addEventListener('resize', updateLoginBtnWidth);
    // Small delay to ensure components are rendered
    setTimeout(updateLoginBtnWidth, 100);
    
    return () => window.removeEventListener('resize', updateLoginBtnWidth);
  }, []);

  const navbarClasses = `fixed top-0 left-0 right-0 z-50 py-3 transition-all duration-300 w-full ${
    isScrolled || !isHomePage ? 'bg-white shadow-md py-2' : 'bg-transparent'
  }`

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMenuOpen && !e.target.closest('.nav-menu') && !e.target.closest('.menu-button')) {
        setIsMenuOpen(false)
      }
    }

    // Add a small delay before adding the event listener to prevent immediate closing
    let timeoutId;
    if (isMenuOpen) {
      timeoutId = setTimeout(() => {
        document.addEventListener('click', handleClickOutside)
      }, 100)
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside)
      clearTimeout(timeoutId)
    }
  }, [isMenuOpen])

  // Handle scrolling to top for home button
  const handleScrollToTop = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    setTimeout(() => {
      setIsMenuOpen(false);
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 10);
  }

  // Handle nav item click - navigate to home page section or smooth scroll
  const handleNavClick = (id, event) => {
    // Prevent default behavior to avoid any conflicts
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    // Close the menu with a slight delay to ensure the click is processed first
    setTimeout(() => {
      setIsMenuOpen(false);
      
      if (isHomePage) {
        // If we're already on the home page, just scroll to the section
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      } else {
        // If we're on another page, navigate to home with the section hash
        navigate(`/#${id}`)
      }
    }, 10);
  }

  return (
    <motion.header 
      className={navbarClasses}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-2xl md:text-3xl">
            <span className="text-primary">V</span>
            <span className="text-dark"> - Connect</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-12">
          <a 
            onClick={(e) => isHomePage ? handleScrollToTop(e) : navigate('/')} 
            className={`text-dark hover:text-primary cursor-pointer transition-colors font-bold ${location.pathname === '/' ? 'text-primary' : ''}`}
          >
            Home
          </a>
          <a onClick={(e) => handleNavClick('about', e)} className="text-dark hover:text-primary cursor-pointer transition-colors font-bold">About</a>
          <a onClick={(e) => handleNavClick('how-to-use', e)} className="text-dark hover:text-primary cursor-pointer transition-colors font-bold">Guide</a>
          <Link to="/contact" className={`text-dark hover:text-primary cursor-pointer transition-colors font-bold ${location.pathname === '/contact' ? 'text-primary' : ''}`}>Contact</Link>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <button onClick={() => handleNavClick('donations')} style={{width: 'var(--login-btn-width)', textAlign: 'center', display: 'flex', justifyContent: 'center'}} className="btn-outline px-4">Donate</button>
          <Link to="/login" className="btn-primary px-4 login-btn">Log In</Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-dark p-2 menu-button" 
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div 
          className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg py-4 px-4 nav-menu"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          <nav className="flex flex-col space-y-4">
            <a 
              onClick={(e) => isHomePage ? handleScrollToTop(e) : navigate('/')}
              className="text-dark hover:text-primary cursor-pointer px-4 py-2 hover:bg-gray-50 rounded-md font-bold"
            >
              Home
            </a>
            <a onClick={(e) => handleNavClick('about', e)} className="text-dark hover:text-primary cursor-pointer px-4 py-2 hover:bg-gray-50 rounded-md font-bold">About</a>
            <a onClick={(e) => handleNavClick('how-to-use', e)} className="text-dark hover:text-primary cursor-pointer px-4 py-2 hover:bg-gray-50 rounded-md font-bold">How It Works</a>
            <Link to="/contact" className={`text-dark hover:text-primary px-4 py-2 hover:bg-gray-50 rounded-md font-bold ${location.pathname === '/contact' ? 'text-primary' : ''}`}>Contact</Link>
            <div className="flex flex-col space-y-2 pt-2 border-t border-gray-100">
              <Link to="/donations" style={{width: 'var(--mobile-login-btn-width)', textAlign: 'center', display: 'flex', justifyContent: 'center'}} className="btn-outline mx-auto">Donate</Link>
              <Link to="/login" className="btn-primary mx-auto text-center mobile-login-btn">Log In</Link>
            </div>
          </nav>
        </motion.div>
      )}
    </motion.header>
  )
}

export default Navbar
