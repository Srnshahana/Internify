import './App.css'

function Payment({ onBack, onPaymentSuccess }) {
  return (
    <div className="dashboard-page payment-page">
      <div className="page-header">
        <h1>Secure Payment</h1>
        <p className="page-subtitle">
          Complete your enrollment with platform-controlled escrow for full safety.
        </p>
      </div>

      <div className="payment-layout">
        {/* Left: Summary & escrow explanation */}
        <div className="payment-card payment-summary">
          <h2>Checkout summary</h2>
          <div className="payment-summary-plan">
            <div>
              <p className="payment-plan-name">1:1 mentorship plan</p>
              <p className="payment-plan-meta">Includes 3 free trial sessions + full course access</p>
            </div>
            <div className="payment-amount">
              <span className="payment-price">$299</span>
              <span className="payment-price-meta">one-time</span>
            </div>
          </div>

          <div className="payment-breakdown">
            <div className="payment-breakdown-row">
              <span>Free trial (3 sessions)</span>
              <span>$0</span>
            </div>
            <div className="payment-breakdown-row">
              <span>Remaining mentorship sessions</span>
              <span>$299</span>
            </div>
            <div className="payment-breakdown-row total">
              <span>Total held in escrow</span>
              <span>$299</span>
            </div>
          </div>

          <h3 className="payment-subtitle">How your payment works</h3>
          <p className="payment-highlight">
            Your idea was <strong>platform-controlled escrow payment</strong>.
          </p>
          <ul className="payment-points">
            <li>
              <strong>3 free trial sessions first</strong> – the mentee pays only after they finish
              the free sessions and confirm they want to continue.
            </li>
            <li>
              <strong>Money held by the platform</strong> – the full amount is stored safely in
              escrow, not sent to the mentor immediately.
            </li>
            <li>
              <strong>Mentor is paid on completion</strong> – funds are released to the mentor only
              after the course or sessions are successfully completed.
            </li>
            <li>
              <strong>Trust & support</strong> – this removes trust issues for both sides and the
              platform handles any disputes or support.
            </li>
          </ul>
        </div>

        {/* Right: Payment form UI */}
        <div className="payment-card payment-form-card">
          <h2>Payment details</h2>
          <div className="payment-form">
            <div className="payment-field">
              <label htmlFor="card-name">Name on card</label>
              <input id="card-name" type="text" placeholder="Sherin K" />
            </div>
            <div className="payment-field">
              <label htmlFor="card-number">Card number</label>
              <input id="card-number" type="text" placeholder="1234 5678 9012 3456" />
            </div>
            <div className="payment-field payment-field-row">
              <div>
                <label htmlFor="card-expiry">Expiry</label>
                <input id="card-expiry" type="text" placeholder="MM / YY" />
              </div>
              <div>
                <label htmlFor="card-cvv">CVV</label>
                <input id="card-cvv" type="password" placeholder="***" />
              </div>
            </div>

            <div className="payment-field">
              <label htmlFor="payment-method">Payment method</label>
              <select id="payment-method">
                <option>Credit / Debit Card</option>
                <option>UPI</option>
                <option>Net Banking</option>
              </select>
            </div>

            <div className="payment-secure-note">
              Payments are processed securely and held in escrow by Internify until your course
              is completed.
            </div>

            <div className="payment-actions">
              <button className="primary" onClick={onPaymentSuccess}>
                Confirm & Pay Securely
              </button>
              <button className="ghost" onClick={onBack}>
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payment


