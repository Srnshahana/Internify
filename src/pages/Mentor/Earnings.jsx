import { useState } from 'react'
import '../../App.css'

const earningsData = {
  totalEarnings: 125000,
  pendingPayouts: 15000,
  thisMonth: 25000,
  lastMonth: 30000,
}

const transactions = [
  {
    id: 1,
    date: '2024-03-15',
    type: 'Payout',
    amount: 25000,
    status: 'Completed',
    description: 'Monthly payout for March 2024',
  },
  {
    id: 2,
    date: '2024-03-10',
    type: 'Earning',
    amount: 5000,
    status: 'Completed',
    description: 'Course: React Advanced Patterns - 5 enrollments',
  },
  {
    id: 3,
    date: '2024-03-08',
    type: 'Earning',
    amount: 3000,
    status: 'Completed',
    description: 'Course: UI/UX Design Principles - 3 enrollments',
  },
  {
    id: 4,
    date: '2024-03-05',
    type: 'Earning',
    amount: 8000,
    status: 'Completed',
    description: 'Course: DSA Mastery - 8 enrollments',
  },
  {
    id: 5,
    date: '2024-03-01',
    type: 'Payout',
    amount: 30000,
    status: 'Completed',
    description: 'Monthly payout for February 2024',
  },
  {
    id: 6,
    date: '2024-02-28',
    type: 'Earning',
    amount: 4000,
    status: 'Pending',
    description: 'Course: System Design Fundamentals - 4 enrollments',
  },
  {
    id: 7,
    date: '2024-02-25',
    type: 'Earning',
    amount: 6000,
    status: 'Pending',
    description: 'Course: React Advanced Patterns - 6 enrollments',
  },
  {
    id: 8,
    date: '2024-02-20',
    type: 'Earning',
    amount: 5000,
    status: 'Pending',
    description: 'Course: UI/UX Design Principles - 5 enrollments',
  },
]

function Earnings() {
  const [filter, setFilter] = useState('all') // all, completed, pending

  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === 'all') return true
    return transaction.status.toLowerCase() === filter
  })

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`
  }

  const getStatusColor = (status) => {
    return status === 'Completed' ? '#22c55e' : '#f59e0b'
  }

  return (
    <div className="dashboard-page-new">
      <div className="dashboard-section">
        <div className="section-header-with-button">
          <div>
            <h2 className="section-title">Earnings</h2>
            <p className="section-subtitle" style={{ marginTop: '8px', opacity: 0.7 }}>Track your earnings, payouts, and transaction history</p>
          </div>
      </div>

      {/* Earnings Overview Cards */}
        <div className="progress-overview-section-new" style={{ marginTop: '24px', marginBottom: '32px' }}>
          <div className="progress-overview-cards-new">
          <div className="progress-overview-card">
            <div className="progress-card-icon">💰</div>
            <div className="progress-card-content">
              <h3 className="progress-card-title">Total Earnings</h3>
              <p className="progress-card-value" style={{ color: '#22c55e' }}>
                {formatCurrency(earningsData.totalEarnings)}
              </p>
            </div>
          </div>

          <div className="progress-overview-card">
            <div className="progress-card-icon">⏳</div>
            <div className="progress-card-content">
              <h3 className="progress-card-title">Pending Payouts</h3>
              <p className="progress-card-value" style={{ color: '#f59e0b' }}>
                {formatCurrency(earningsData.pendingPayouts)}
              </p>
            </div>
          </div>

          <div className="progress-overview-card">
            <div className="progress-card-icon">📅</div>
            <div className="progress-card-content">
              <h3 className="progress-card-title">This Month</h3>
              <p className="progress-card-value" style={{ color: '#3b82f6' }}>
                {formatCurrency(earningsData.thisMonth)}
              </p>
            </div>
          </div>

          <div className="progress-overview-card">
            <div className="progress-card-icon">📊</div>
            <div className="progress-card-content">
              <h3 className="progress-card-title">Last Month</h3>
              <p className="progress-card-value" style={{ color: '#8b5cf6' }}>
                {formatCurrency(earningsData.lastMonth)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
        <div style={{ marginTop: '32px' }}>
        <div className="section-header-with-button">
          <h2 className="section-title">Transaction History</h2>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
            <button
              className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending
            </button>
          </div>
        </div>

        <div className="transactions-list">
          {filteredTransactions.length === 0 ? (
            <div className="empty-state">
              <p>No transactions found.</p>
            </div>
          ) : (
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => {
                  const statusColor = getStatusColor(transaction.status)
                  const isEarning = transaction.type === 'Earning'
                  
                  return (
                    <tr key={transaction.id}>
                      <td>{new Date(transaction.date).toLocaleDateString('en-IN')}</td>
                      <td>
                        <span className={`transaction-type ${transaction.type.toLowerCase()}`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td>{transaction.description}</td>
                      <td style={{ 
                        color: isEarning ? '#22c55e' : '#3b82f6',
                        fontWeight: '600'
                      }}>
                        {isEarning ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </td>
                      <td>
                        <span 
                          className="transaction-status"
                          style={{
                            backgroundColor: `${statusColor}20`,
                            color: statusColor,
                            borderColor: statusColor
                          }}
                        >
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Payout Information */}
        <div style={{ marginTop: '32px' }}>
        <h2 className="section-title">Payout Information</h2>
        <div className="payout-info-card">
          <div className="info-item">
            <span className="info-label">Next Payout Date:</span>
            <span className="info-value">April 1, 2024</span>
          </div>
          <div className="info-item">
            <span className="info-label">Pending Amount:</span>
            <span className="info-value" style={{ color: '#f59e0b', fontWeight: '600' }}>
              {formatCurrency(earningsData.pendingPayouts)}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Bank Account:</span>
            <span className="info-value">****1234 (HDFC Bank)</span>
          </div>
          <div className="payout-actions">
            <button className="btn-secondary">Update Bank Details</button>
            <button className="btn-primary">Request Early Payout</button>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Earnings

