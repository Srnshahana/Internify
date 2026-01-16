import '../../App.css'

// Lucide-inspired SVG Icons
const ShieldCheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)

const CreditCardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" x2="22" y1="10" y2="10" />
  </svg>
)

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const CheckCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

const InfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
)

export default function Payment({ onBack, onPaymentSuccess, course }) {
  const courseTitle = course?.title || "Mentorship Program";
  const coursePrice = course?.price || "$299";
  const courseDesc = course?.description || "Includes full course access and personalized mentorship sessions.";

  return (
    <div className="dashboard-page payment-page">
      <div className="payment-premium-container">
        {/* Header Section */}
        <div className="payment-header-premium">
          <div className="secure-badge">
            <ShieldCheckIcon />
            <span>Secure SSL Encrypted Transaction</span>
          </div>
          <h1>Complete Your Enrollment</h1>
          <p className="page-subtitle">
            Securely enroll in <strong>{courseTitle}</strong>. Your funds are protected by our platform-controlled escrow system.
          </p>
        </div>

        <div className="payment-grid-layout">
          {/* Left Side: Summary & Trust */}
          <div className="payment-summary-section">
            <div className="payment-card-premium">
              <h2>
                <ClockIcon />
                <span>Order Summary</span>
              </h2>

              <div className="premium-summary-item">
                <div className="summary-course-info">
                  <h4>{courseTitle}</h4>
                  <p>{courseDesc}</p>
                </div>
                <div className="price-display-premium">
                  <span className="label">Total Amount</span>
                  <span className="amount">{coursePrice}</span>
                </div>
              </div>

              <h2 style={{ marginTop: '40px' }}>
                <ShieldCheckIcon />
                <span>How Escrow Protection Works</span>
              </h2>

              <div className="escrow-trust-flow">
                <div className="trust-step active">
                  <div className="trust-dot">1</div>
                  <span className="trust-label">Payment Held</span>
                </div>
                <div className="trust-step">
                  <div className="trust-dot">2</div>
                  <span className="trust-label">Course Start</span>
                </div>
                <div className="trust-step">
                  <div className="trust-dot">3</div>
                  <span className="trust-label">Completion</span>
                </div>
                <div className="trust-step">
                  <div className="trust-dot">4</div>
                  <span className="trust-label">Mentor Paid</span>
                </div>
              </div>

              <div className="guarantee-note-premium">
                <InfoIcon />
                <div className="guarantee-text">
                  <h5>100% Satisfaction Guarantee</h5>
                  <p>If you're not satisfied after the first 2 sessions, we'll provide a full refund of your escrow balance, no questions asked.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Payment Form */}
          <div className="payment-form-section">
            <div className="payment-card-premium">
              <h2>
                <CreditCardIcon />
                <span>Payment Details</span>
              </h2>

              <div className="payment-form-soft">
                <div className="soft-input-group">
                  <label htmlFor="card-name">Name on Card</label>
                  <input id="card-name" type="text" placeholder="Sherin K" />
                </div>

                <div className="soft-input-group">
                  <label htmlFor="card-number">Card Number</label>
                  <input id="card-number" type="text" placeholder="0000 0000 0000 0000" />
                </div>

                <div className="input-row-premium">
                  <div className="soft-input-group">
                    <label htmlFor="card-expiry">Expiry Date</label>
                    <input id="card-expiry" type="text" placeholder="MM / YY" />
                  </div>
                  <div className="soft-input-group">
                    <label htmlFor="card-cvv">CVV</label>
                    <input id="card-cvv" type="password" placeholder="***" />
                  </div>
                </div>

                <div className="soft-input-group">
                  <label htmlFor="payment-method">Payment Method</label>
                  <select id="payment-method">
                    <option>Credit / Debit Card</option>
                    <option>UPI / PhonePe / GPay</option>
                    <option>Net Banking</option>
                  </select>
                </div>

                <div className="payment-actions" style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button className="btn-buy-course" style={{ width: '100%' }} onClick={onPaymentSuccess}>
                    Confirm & Pay {coursePrice}
                  </button>
                  <button className="soft-search-btn" style={{ width: '100%', background: 'transparent', color: '#64748b' }} onClick={onBack}>
                    Go Back
                  </button>
                </div>
              </div>

              <div style={{ marginTop: '24px', textAlign: 'center' }}>
                <p style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <ShieldCheckIcon style={{ width: '12px', height: '12px' }} />
                  Bank-grade security by Internify Payments
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
