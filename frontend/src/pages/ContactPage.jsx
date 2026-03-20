import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MdArrowBack,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdSend,
  MdCheckCircle,
} from 'react-icons/md'
import './ContactPage.css'

const contactInfo = [
  {
    icon: <MdEmail size={22} />,
    label: 'Email Us',
    value: 'support@50tasks.com',
    sub: 'We reply within 24 hours',
  },
  {
    icon: <MdPhone size={22} />,
    value: '+256 700 123 456',
    label: 'Call Us',
    sub: 'Mon – Fri, 8am – 6pm EAT',
  },
  {
    icon: <MdLocationOn size={22} />,
    label: 'Visit Us',
    value: 'Kampala, Uganda',
    sub: "Worker's House, Pilkington Rd",
  },
]

export default function ContactPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    // Simulate send
    setSent(true)
  }

  return (
    <div className="cp-shell">
      {/* Decorative circles */}
      <div className="cp-decor cp-decor-tl" />
      <div className="cp-decor cp-decor-br" />

      {/* Back */}
      <button className="cp-back" onClick={() => navigate('/')}>
        <MdArrowBack size={18} />
        Back
      </button>

      {/* Page Header */}
      <div className="cp-header">
        <p className="cp-eyebrow">We'd Love to Hear From You</p>
        <h1 className="cp-title">Contact Us</h1>
        <p className="cp-sub">
          Have a question, feedback, or just want to say hello? Send us a message and we'll get back to you shortly.
        </p>
      </div>

      {/* Body */}
      <div className="cp-body">

        {/* Left — Contact Info */}
        <div className="cp-info-col">
          {contactInfo.map((item) => (
            <div key={item.label} className="cp-info-card">
              <div className="cp-info-icon">{item.icon}</div>
              <div>
                <div className="cp-info-label">{item.label}</div>
                <div className="cp-info-value">{item.value}</div>
                <div className="cp-info-sub">{item.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Right — Form */}
        <div className="cp-form-card">
          {sent ? (
            <div className="cp-success">
              <MdCheckCircle size={56} className="cp-success-icon" />
              <h2 className="cp-success-title">Message Sent!</h2>
              <p className="cp-success-sub">
                Thanks for reaching out. We'll get back to you within 24 hours.
              </p>
              <button className="cp-btn-solid" onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }}>
                Send Another
              </button>
            </div>
          ) : (
            <form className="cp-form" onSubmit={handleSubmit}>
              <h2 className="cp-form-title">Send a Message</h2>

              <div className="cp-field-row">
                <div className="cp-field">
                  <label className="cp-label">Full Name</label>
                  <input
                    className="cp-input"
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="cp-field">
                  <label className="cp-label">Email Address</label>
                  <input
                    className="cp-input"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="cp-field">
                <label className="cp-label">Subject</label>
                <input
                  className="cp-input"
                  type="text"
                  name="subject"
                  placeholder="How can we help?"
                  value={form.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="cp-field">
                <label className="cp-label">Message</label>
                <textarea
                  className="cp-textarea"
                  name="message"
                  placeholder="Write your message here..."
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="cp-btn-solid">
                <MdSend size={16} />
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
