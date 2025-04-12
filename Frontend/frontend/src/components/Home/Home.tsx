import React, { useState, useEffect } from 'react';
import './Home.css';
import { getClinicData } from '../../controllers/hirer/hirer';
import { useNavigate } from 'react-router-dom'; 
import { BsHouseDoor, BsListUl, BsEnvelope, BsPerson, BsClipboardData, BsPencilSquare, BsGrid, BsQuestionCircle, BsCardImage } from 'react-icons/bs';
import Dashboard from '../../components/Dashboard/Dashboard';
import JobListingsDashboard from '../../components/JobListing/JobListing';
import AddJobOpportunity from '../Dashboard/Dashboard'
import AddDoctor from '../AddDoctor/AddDoctor';

const Home: React.FC = () => {
  const [clinicData, setclinicData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchclinicData = async () => {
      if (!accessToken) {
        console.log("Access token not found, redirecting to login.");
        navigate('/accounts/login');
        return;
      }

      try {
        const response = await getClinicData(accessToken);
        const data = response.data[0] 
        setclinicData(data); 
        setCompanyName(data.name);
        setAccountType(data.account_type);
        setActiveListings(data.doctors ? data.doctors.length : 0); 
        setTotalListing(data.doctors ? data.doctors.length : 0); 
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log("Clinic data not found, redirecting to clinic registration.");
          navigate('/accounts/register/clinic');
        }else if (error.response && error.response.status === 401){
          console.log('system logged out, redirecting to login page')
          navigate('/accounts/login')
        }
         else {
          console.error("Failed to fetch hirer data:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchclinicData(); 
  }, [accessToken, navigate]); 

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
console.log(companyName)
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
            {['Dashboard', 'Doctor','Add Doctor',"Appointments"].map((item) => (
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
        <JobListingsDashboard jobOpportunities={clinicData?.doctors || []} />
      )}
      {activeNavItem === 'Appointments' && (
        <AddJobOpportunity jobopportunities={clinicData?.doctors || []} />
      )}
      {activeNavItem === 'Add Doctor' && (
        <div className="add-doctor-container">
          <AddDoctor />

        </div>
      )}
    </div>
  );
};

export default Home;