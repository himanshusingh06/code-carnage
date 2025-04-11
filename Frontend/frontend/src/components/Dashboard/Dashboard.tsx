import React from 'react';
import { BsClipboardData } from 'react-icons/bs';

interface DashboardProps {
  companyName: string;
  activeListings: number;
  totalListing: number;
  totalViews: number;
  totalApplicants: number;
  recentActivities: any[];
  quickActions: any[];
  onNavClick: (navItem: string) => void; // Callback function for navigation
}

const Dashboard: React.FC<DashboardProps> = ({
  companyName,
  activeListings,
  totalListing,
  totalViews,
  totalApplicants,
  recentActivities,
  quickActions,
  onNavClick,
}) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <main className="main-content">
      {/* Welcome Section */}
      <section className="welcome-section">
        <div className="welcome-header">
          <h1>Welcome, {companyName}! 🎉</h1>

        </div>

        {/* Listings Summary Card */}
        <div className="listings-summary-card">
          <div className="card-header">
            <h3>Your Listings</h3>
            <span className="icon"><BsClipboardData /></span>
          </div>
          <div className="listings-stats">
            <div className="stat">
              <h2>Active: {activeListings}</h2>
              <h2>Total: {totalListing}</h2>
            </div>
          </div>
        </div>

        {/* Performance Overview Card */}
        <div className="performance-card">
          <div className="card-header">
            <h3>Performance Overview</h3>
          </div>
          <div className="performance-stats">
            <div className="stat">
              <h2>{formatNumber(totalViews)} views</h2>
            </div>
            <div className="stat">
              <h2>{totalApplicants} applicants</h2>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Section - Activities and Quick Actions */}
      <div className="bottom-section">
        {/* Recent Activity */}
        <section className="recent-activity">
          <div className="section-header">
            <h2>Recent Activity</h2>
            <a href="#" className="view-all">View All</a>
          </div>
          
          <div className="activity-list">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className={`activity-icon ${activity.type}-icon`}>
                  {activity.icon}
                </div>
                <div className="activity-details">
                  <h4>{activity.title}</h4>
                  <p>{activity.timeAgo}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions">
          <div className="section-header">
            <h2>Quick Actions</h2>
          </div>
          
          <div className="actions-grid">
            {quickActions.map((action) => (
              <div key={action.id} className="action-card">
                {action.isNew ? (
                  <div className="action-card-header">
                    {action.icon}
                    <span className="new-badge">New</span>
                  </div>
                ) : (
                  <div className="action-icon">
                    {action.icon}
                  </div>
                )}
                <p>{action.title}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Dashboard;