import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MdSpeed, MdGroups, MdTimeline, MdSecurity, MdCloudQueue, MdBolt } from 'react-icons/md'
import './LandingPage.css'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="landing-container">
      {/* Background Layers */}
      <div className="section-bg hero-bg"></div>
      <div className="section-bg features-bg"></div>

      {/* Decorative Circles - Global to the page */}
      <div className="decor-circle top-left"></div>
      <div className="decor-circle bottom-right"></div>

      {/* Top Navbar */}
      <nav className="landing-nav">
        <img
          src="/logo.png"
          alt="50 Tasks Logo"
          className="landing-nav-logo"
          onClick={() => navigate('/')}
        />
        <div className="landing-nav-actions">
          <button className="btn-nav-outline" onClick={() => navigate('/pricing')}>
            PRICING
          </button>
          <button className="btn-nav-outline" onClick={() => navigate('/login')}>
            SIGN IN
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section">

        {/* Main Content */}
        <motion.div 
          className="landing-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="landing-subtitle">WELCOME TO</h2>
          <h1 className="landing-title">50 TASKS</h1>
          <p className="landing-tagline">
            Simple and easy to use Project Manager
          </p>

          <div className="landing-actions">
            <button className="btn-contact" onClick={() => navigate('/contact')}>
              CONTACT US
            </button>
            <button className="btn-demo" onClick={() => navigate('/pricing')}>
              REQUEST DEMO
            </button>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <section className="features-section">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="features-title">Why 50 Tasks?</h2>
          <div className="title-underline"></div>
        </motion.div>

        <div className="features-grid">
          {[
            {
              icon: <MdBolt />,
              title: "Blazing Fast",
              desc: "Engineered for speed. Manage your workflows with zero lag and real-time updates."
            },
            {
              icon: <MdGroups />,
              title: "Built for Teams",
              desc: "Seamless collaboration tools that keep everyone synced, no matter where they work."
            },
            {
              icon: <MdTimeline />,
              title: "Visual Clarity",
              desc: "Beautiful timeline views and progress tracking to see the big picture at a glance."
            },
            {
              icon: <MdSecurity />,
              title: "Enterprise Grade",
              desc: "Your data is protected with industry-leading security protocols and encryption."
            },
            {
              icon: <MdCloudQueue />,
              title: "Cloud Native",
              desc: "Access your projects from any device, anywhere in the world, at any time."
            },
            {
              icon: <MdSpeed />,
              title: "Productivity First",
              desc: "A clutter-free interface designed to help you focus on what truly matters."
            }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -10 }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-card-title">{feature.title}</h3>
              <p className="feature-card-desc">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>© 2026 50 Tasks. All rights reserved.</p>
      </footer>
    </div>
  )
}
