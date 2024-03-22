// ViewStats.tsx
import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { firebaseDatabase } from '../../utils/firebase-config';
import { useAuth } from '../../AuthContext';
import { LinkType } from '../Dashboard/Dashboard';
import './viewStats.css';

interface StatsType {
  Impressions: number;
  Clicks: number;
  UniqueClicks: number;
  RepeatedClicks: number;
}

interface ViewStatsProps {
  linkData: LinkType;
  onClose: () => void;
}

const ViewStats = ({ linkData, onClose }: ViewStatsProps) => {
  const [stats, setStats] = useState<StatsType>({
    Impressions: 0,
    Clicks: 0,
    UniqueClicks: 0,
    RepeatedClicks: 0,
  });
  const { currentUser } = useAuth();

  useEffect(() => {
    if (linkData) {
      // Fetch public link clicks
      const publicClicksRef = ref(firebaseDatabase, `publicLinks/${linkData.linkId}/Clicks`);
      onValue(publicClicksRef, (snapshot) => {
        const publicClicks = snapshot.val() || 0;

        // Fetch user-specific stats and combine with public clicks
        if (currentUser) {
          const userStatsRef = ref(firebaseDatabase, `users/${currentUser.uid}/links/${linkData.linkId}/stats`);
          onValue(userStatsRef, (snapshot) => {
            const userStats: StatsType = snapshot.val() || { Impressions: 0, Clicks: 0, UniqueClicks: 0, RepeatedClicks: 0 };
            setStats({
              ...userStats,
              Clicks: userStats.Clicks + publicClicks,
            });
          });
        } else {
          setStats(prevStats => ({ ...prevStats, Clicks: publicClicks }));
        }
      });
    }
  }, [currentUser, linkData]);

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
            <h3>{key}</h3>
            <p>{value}</p>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default ViewStats;
