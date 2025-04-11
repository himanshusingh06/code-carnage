import React, { useState, useEffect } from 'react';
import './Home.css';
import { getHirerData } from '../../controllers/hirer/hirer';
import { useNavigate } from 'react-router-dom'; 
import { BsHouseDoor, BsListUl, BsEnvelope, BsPerson, BsClipboardData, BsPencilSquare, BsGrid, BsQuestionCircle, BsCardImage } from 'react-icons/bs';
import Dashboard from '../../components/Dashboard/Dashboard';
import JobListingsDashboard from '../../components/JobListing/JobListing';
import AddJobOpportunity from '../Dashboard/Dashboard'

const Home: React.FC = () => {
  const [hirerData, setHirerData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 
  const accessToken = localStorage.getItem('accessToken'); 

  const [activeNavItem, setActiveNavItem] = useState('Dashboard');
  const [companyName, setCompanyName] = useState('');
  const [accountType, setAccountType] = useState('');
  const [activeListings, setActiveListings] = useState(0);
  const [totalListing, setTotalListing] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const [totalApplicants, setTotalApplicants] = useState(0);
  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: 'client',
      title: 'New Client Registration',
      timeAgo: '2 minutes ago',
      icon: <BsPerson />
    },
    {
      id: 2,
      type: 'payment',
      title: 'Payment Received',
      timeAgo: '1 hour ago',
      icon: <BsClipboardData />
    }
  ]);
  const [quickActions, setQuickActions] = useState([
    {
      id: 1,
      title: 'Manage Listings',
      icon: <BsHouseDoor />,
      isNew: false
    },
    {
      id: 2,
      title: 'View Analytics',
      icon: <BsListUl />,
      isNew: false
    },
    {
      id: 3,
      title: 'Support',
      icon: <BsEnvelope />,
      isNew: false
    },
    {
      id:4,
      title:'Media Gallary',
      icon: <BsCardImage/>,
      isNew:true
    }
  ]);

  // useEffect(() => {
  //   const fetchHirerData = async () => {
  //     if (!accessToken) {
  //       console.log("Access token not found, redirecting to login.");
  //       navigate('/accounts/login');
  //       return;
  //     }

  //     try {
  //       const data = await getHirerData(accessToken); 
  //       setHirerData(data); 
  //       setCompanyName(data.company_name);
  //       setAccountType(data.industry);
  //       setActiveListings(data.job_opportunities ? data.job_opportunities.length : 0); 
  //       setTotalListing(data.job_opportunities ? data.job_opportunities.length : 0); 
  //     } catch (error) {
  //       if (error.response && error.response.status === 404) {
  //         console.log("Hirer data not found, redirecting to company registration.");
  //         navigate('/accounts/register/company');
  //       } else {
  //         console.error("Failed to fetch hirer data:", error);
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchHirerData(); 
  // }, [accessToken, navigate]); 

  if (loading) {
    return <div>Loading...</div>; 
  }

  const handleNavClick = (navItem: string) => {
    setActiveNavItem(navItem);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="company-profile">
          <div className="company-image">
            <div className="image-placeholder">Image</div>
          </div>
          <div className="company-info">
            <h3>{companyName}</h3>
            <p>{accountType}</p>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            {['Dashboard', 'Doctor',"Appointments"].map((item) => (
              <li 
                key={item} 
                className={activeNavItem === item ? 'active' : ''}
                onClick={() => handleNavClick(item)}
              >
                {item === 'Dashboard' && <BsHouseDoor />}
                {item === 'Doctor' && <BsListUl />}
                {item === 'Appointments' && <BsListUl />}
                {item === 'Messages' && <BsEnvelope />}
                {item === 'Profile' && <BsPerson />}
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {activeNavItem === 'Dashboard' && (
        <Dashboard 
          companyName={companyName}
          accountType={accountType}
          activeListings={activeListings}
          totalListing={totalListing}
          totalViews={totalViews}
          totalApplicants={totalApplicants}
          recentActivities={recentActivities}
          quickActions={quickActions}
          onNavClick={handleNavClick}
        />
      )}
      {activeNavItem === 'Doctor' && (
        <JobListingsDashboard jobOpportunities={hirerData?.job_opportunities || []} />
      )}
      {activeNavItem === 'Appointments' && (
        <AddJobOpportunity />
      )}
    </div>
  );
};

export default Home;