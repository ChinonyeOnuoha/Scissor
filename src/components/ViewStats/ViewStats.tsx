//ViewStats.tsx
import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { firebaseDatabase } from '../../utils/firebase-config';
import { useAuth } from '../../AuthContext';
import { LinkType } from '../Dashboard/Dashboard';
import './viewStats.css';


interface StatsType {
    Impressions: { count: number; change: number };
    Clicks: { count: number; change: number };
    UniqueClicks: { count: number; change: number };
    RepeatedClicks: { count: number; change: number };
  }

const initialStatsState = {
    Impressions: { count: 0, change: 0 },
    Clicks: { count: 0, change: 0 },
    UniqueClicks: { count: 0, change: 0 },
    RepeatedClicks: { count: 0, change: 0 },
  };

  interface ViewStatsProps {
    linkData: LinkType; 
    onClose: () => void;
  }

  const ViewStats = ({ linkData, onClose }: ViewStatsProps) => {
    const [stats, setStats] = useState<StatsType>(initialStatsState);
    const [dateRange, setDateRange] = useState('last7Days');
    const { currentUser } = useAuth();
  
    useEffect(() => {
      if (currentUser && linkData) {
        const statsRef = ref(firebaseDatabase, `users/${currentUser.uid}/links/${linkData.linkId}/stats`);
        const unsubscribe = onValue(statsRef, (snapshot) => {
          const data: StatsType = snapshot.val();
          if (data) setStats(data);
        });

          return () => unsubscribe(); 
        }
      }, [linkData, currentUser]);

      if (!linkData) return null;

  return (
    <aside className={`view-stats-sidebar ${stats ? 'active' : ''}`}>
      <div className="sidebar-header">
        <h2>Link statistics</h2>
        <button onClick={onClose}>
        <img src="/assets/close-filled-white.svg" alt="close icon" />
        </button>
      </div>

      <div className="stats-thumbnail">
        <div className="stats-thumbnail-top">
        <img src={linkData.thumbnailUrl || '/assets/thumbnail placeholder.svg'} alt="Thumbnail" />
        <p>{linkData.shortLink}</p>
        </div>
        <div className="stats-thumbnail-bottom">
        <p>{linkData.originalLink}</p>
        </div>   
      </div>

      <div className='divider'></div>

      <div className="stats-cards-container">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="stat-card">

            <div className="date-range">
              <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                <option value="last7Days">Last 7 days</option>
                <option value="last30Days">Last 30 days</option>
                <option value="last60Days">Last 60 days</option>
                <option value="last90Days">Last 90 days</option>
              </select>
            </div>
            <h3>{key}</h3>
            <p>{value.count}</p>
            
            <span className={`change ${value.change > 0 ? 'increase' : 'decrease'}`}>
              {value.change > 0 ? '+' : ''}{value.change}%
            </span>
    
          </div>
        ))}
      </div>
    </aside>
  );
};

export default ViewStats;
