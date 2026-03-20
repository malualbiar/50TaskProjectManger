import { useNavigate } from 'react-router-dom'
import { MdCheck, MdClose, MdArrowBack, MdBolt, MdGroups, MdSecurity } from 'react-icons/md'
import './PricingPage.css'

const plans = [
  {
    name: 'Starter',
    icon: <MdBolt />,
    price: 'Free',
    period: '',
    sub: 'Perfect for individuals & small teams getting started.',
    highlight: false,
    cta: 'Start Free Trial',
    ctaRoute: '/register',
    features: [
      { label: 'Up to 5 team members', ok: true },
      { label: '3 active projects', ok: true },
      { label: 'Basic task management', ok: true },
      { label: '1 GB storage', ok: true },
      { label: 'Email support', ok: true },
      { label: 'Advanced analytics', ok: false },
      { label: 'Custom roles & permissions', ok: false },
      { label: 'Priority support', ok: false },
    ],
  },
  {
    name: 'Pro',
    icon: <MdGroups />,
    price: 'UGX 75,000',
    period: '/ month',
    sub: 'For growing teams that need more power and flexibility.',
    highlight: true,
    badge: 'Most Popular',
    cta: 'Start Free Trial',
    ctaRoute: '/register',
    features: [
      { label: 'Up to 30 team members', ok: true },
      { label: 'Unlimited projects', ok: true },
      { label: 'Advanced task management', ok: true },
      { label: '20 GB storage', ok: true },
      { label: 'Priority email & chat support', ok: true },
      { label: 'Advanced analytics', ok: true },
      { label: 'Custom roles & permissions', ok: true },
      { label: 'Dedicated account manager', ok: false },
    ],
  },
  {
    name: 'Enterprise',
    icon: <MdSecurity />,
    price: 'UGX 250,000',
    period: '/ month',
    sub: 'For large organisations that need full control and security.',
    highlight: false,
    cta: 'Contact Sales',
    ctaRoute: '/contact',
    features: [
      { label: 'Unlimited team members', ok: true },
      { label: 'Unlimited projects', ok: true },
      { label: 'Full task & workflow automation', ok: true },
      { label: '200 GB storage', ok: true },
      { label: '24/7 priority support', ok: true },
      { label: 'Advanced analytics & reports', ok: true },
      { label: 'Custom roles & permissions', ok: true },
      { label: 'Dedicated account manager', ok: true },
    ],
  },
]

export default function PricingPage() {
  const navigate = useNavigate()

  return (
    <div className="pp-shell">
      {/* Decorative background circles */}
      <div className="pp-decor pp-decor-tl" />
      <div className="pp-decor pp-decor-br" />

      {/* Back button */}
      <button className="pp-back" onClick={() => navigate('/')}>
        <MdArrowBack size={18} />
        Back
      </button>

      {/* Header */}
      <div className="pp-header">
        <p className="pp-eyebrow">Simple, Transparent Pricing</p>
        <h1 className="pp-title">Choose Your Plan</h1>
        <p className="pp-sub">
          All prices in <strong>Ugandan Shillings (UGX)</strong>. No hidden fees. Cancel anytime.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="pp-grid">
        {plans.map((plan) => (
          <div key={plan.name} className={`pp-card ${plan.highlight ? 'pp-card-highlight' : ''}`}>
            {plan.badge && <div className="pp-badge">{plan.badge}</div>}

            <div className="pp-card-icon">{plan.icon}</div>
            <h2 className="pp-plan-name">{plan.name}</h2>
            <p className="pp-plan-sub">{plan.sub}</p>

            <div className="pp-price-row">
              <span className="pp-price">{plan.price}</span>
              {plan.period && <span className="pp-period">{plan.period}</span>}
            </div>

            <button
              className={`pp-cta ${plan.highlight ? 'pp-cta-solid' : 'pp-cta-outline'}`}
              onClick={() => {
                localStorage.setItem('selectedPlan', JSON.stringify({
                  name: plan.name,
                  price: plan.price,
                  period: plan.period,
                  sub: plan.sub
                }));
                navigate(plan.ctaRoute);
              }}
            >
              {plan.cta}
            </button>

            <ul className="pp-features">
              {plan.features.map((f) => (
                <li key={f.label} className={`pp-feature-item ${f.ok ? '' : 'pp-feature-off'}`}>
                  <span className={`pp-feature-icon ${f.ok ? 'pp-icon-ok' : 'pp-icon-no'}`}>
                    {f.ok ? <MdCheck size={16} /> : <MdClose size={16} />}
                  </span>
                  {f.label}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p className="pp-note">
        All plans include a <strong>14-day free trial</strong>. No credit card required to start.
      </p>
    </div>
  )
}
