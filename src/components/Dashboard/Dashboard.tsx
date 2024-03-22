// Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { ref, onValue, remove, set} from 'firebase/database';
import { firebaseDatabase } from '../../utils/firebase-config';
import { useAuth } from '../../AuthContext';
import EmptyState from '../EmptyState/EmptyState'; 
import ViewStats from '../ViewStats/ViewStats';
import * as QRCodeGenerator from 'qrcode';
import QRCode from 'qrcode.react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './dashboard.css';


export interface LinkType {
    linkId: string;
    originalLink: string;
    shortLink: string;
    thumbnailUrl?: string;
    timestamp: number;
  }  

  const Dashboard = () => {
    const { currentUser } = useAuth();
    const [links, setLinks] = useState<LinkType[]>([]);
    const [selectedLink, setSelectedLink] = useState<LinkType | null>(null);
    const [editMode, setEditMode] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [linkToDelete, setLinkToDelete] = useState<LinkType | null>(null);
    const [showViewStats, setShowViewStats] = useState(false);
    const [currentLinkStats, setCurrentLinkStats] = useState<LinkType | null>(null);
    const [activeShareLinkId, setActiveShareLinkId] = useState<string | null>(null);
    const [activeQRLinkId, setActiveQRLinkId] = useState<string | null>(null);
    const [editAlias, setEditAlias] = useState('');



  // Fetch links from Firebase
  useEffect(() => {
    if (currentUser?.uid) {
      const userLinksRef = ref(firebaseDatabase, `users/${currentUser.uid}/links`);
      onValue(userLinksRef, (snapshot) => {
        const data = snapshot.val();
        const linksArray: LinkType[] = data
          ? Object.keys(data).map(key => ({
              ...data[key],
              linkId: key,
            })).sort((a, b) => b.timestamp - a.timestamp)
          : [];
        setLinks(linksArray);
      });
    }
  }, [currentUser]);


  // Copy to clipboard
  const copyToClipboard = (shortlink: string) => {
    navigator.clipboard.writeText(shortlink).then(() => {
        toast.success('Copied to clipboard!');
    }, (error) => {
        toast.error('Failed to copy!');
    });
  };

  // Share on social media
  const shareOnSocialMedia = (platform: 'twitter' | 'facebook' | 'whatsapp', shortLink: string) => {
    const url = encodeURIComponent(shortLink);
    const text = encodeURIComponent('Check out this link');
    let shareUrl = '';

    switch (platform) {
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
            break;
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${text}%20${url}`;
            break;
        default:
            return;
    }
    window.open(shareUrl, '_blank');
};
  

  // Generate QR code
  const downloadQRCode = async (format: 'png' | 'svg', size: 150 , shortLink: string) => {
    if (format === 'png') {
      const canvas = document.createElement('canvas');
      QRCodeGenerator.toCanvas(canvas,shortLink, { width: size, margin: 2 }, (error) => {
        if (error) {
          console.error('Error generating QR code:', error);
          toast.error('Failed to generate QR code.');
          return;
        }
        canvas.toBlob((blob) => {
          if (!blob) {
            toast.error('Canvas to Blob conversion failed.');
            return;
          }
          const url = URL.createObjectURL(blob);
          const downloadLink = document.createElement('a');
          downloadLink.href = url;
          downloadLink.download = 'qr-code.png';
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          toast.success('QR Code downloaded as PNG.');
        });
      });
    } else if (format === 'svg') {
      const svgString = await QRCodeGenerator.toString(shortLink, { type: 'svg', width: size, margin: 2 });
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = 'qr-code.svg';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      toast.success('QR Code downloaded as SVG.');
    }
  };

  // Edit link
  const editLink = async (linkId: string, newOriginalLink: string, newAlias: string) => {
    if (!currentUser?.uid) return;
  
    const newLinkData = {
      originalLink: newOriginalLink,
      shortLink: `https://scissor-kappa.vercel.app/#${newAlias}`,
      timestamp: Date.now(), 
      thumbnailUrl: selectedLink?.thumbnailUrl || ''
    };
  
    try {
      const newPath = `users/${currentUser.uid}/links/${newAlias}`;
      const oldPath = `users/${currentUser.uid}/links/${linkId}`;
  
      // Update with the new link data
      if (linkId !== newAlias) {
        // Remove the old link data
        await remove(ref(firebaseDatabase, oldPath));
      }
  
      // Set the new link data
      await set(ref(firebaseDatabase, newPath), newLinkData);
      
      toast.success('Link updated successfully.');
      setEditMode(null);
  
      // Refresh links list 
      if (linkId !== newAlias) {
        setLinks(links.filter(l => l.linkId !== linkId)); 
        setLinks(prev => [...prev, { ...newLinkData, linkId: newAlias }]); 
      } else {
        setLinks(prev => prev.map(l => l.linkId === linkId ? { ...l, ...newLinkData } : l));
      }
  
    } catch (error) {
      console.error('Error updating link: ', error);
      toast.error('Failed to update link.');
    }
  };
  

  const handleEdit = (link: LinkType) => {
    setSelectedLink(link);
    setEditMode(link.linkId);
  };
  
  // Confirms the users edit
  const saveEdit = (newOriginalLink: string, newAlias: string) => {
    if (selectedLink) {
      editLink(selectedLink.linkId, newOriginalLink, newAlias);
    }
  };

  // View stats for link
  const viewStats = (link: LinkType) => {
    setCurrentLinkStats(link);
    setShowViewStats(true); 
  };

  // Delete link
  const deleteLink = (linkId: string) => {
    if (currentUser?.uid) {
      const linkRef = ref(firebaseDatabase, `users/${currentUser.uid}/links/${linkId}`);
      remove(linkRef).then(() => {
        setShowDeleteModal(false);
        toast.success('Deleted!');
      }).catch((error) => {
        toast.error('Failed to delete!');
      });
    }
  };

  // Open the delete confirmation modal
const handleDeleteConfirmation = (link: LinkType) => {
    setLinkToDelete(link);
    setShowDeleteModal(true);
  }
  
  // Cancel the deletion
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setLinkToDelete(null);
  };
  
  // Delete Confirmation Modal
  const DeleteConfirmationModal = () => {
    if (!showDeleteModal) return null;
  
    return (
      <div className="delete-confirmation-modal">
        <div className="modal-content">
        <p>Are you sure you want to delete this link?</p>
        <button onClick={() => linkToDelete && deleteLink(linkToDelete.linkId)}>Yes, delete link</button>
        <button onClick={handleCancelDelete}>Cancel</button>
        </div>
      </div>
    );
  };

  // Function to toggle share options visibility
const toggleShareOptions = (linkId: string) => {
  setActiveShareLinkId(activeShareLinkId === linkId ? null : linkId);
  setActiveQRLinkId(null); 
};

// Function to toggle QR code popup visibility
const toggleQRPopup = (linkId: string) => {
  setActiveQRLinkId(activeQRLinkId === linkId ? null : linkId);
  setActiveShareLinkId(null); 
};


function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString();
}


  return (
    <div className="dashboard-container container">
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ width: "auto" }}
        closeButton={false}
      />
  
      {links.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <h1>My links</h1>
          <div className="links-list">
            {links.map((linkItem) => (
              <div key={linkItem.linkId} className="link-card">
                <div className='link-card-image'>
                <img src={linkItem.thumbnailUrl || '/assets/thumbnail placeholder.svg'} alt="Thumbnail" />
                </div>

                <div className="link-details">
                  <div className="short-link">
                    <p>{linkItem.shortLink}</p>
                    <button onClick={() => copyToClipboard(linkItem.shortLink)}> <img src="/assets/akar-icons_copy.svg" alt="copy icon" />
                    </button>
                  </div>
    
                  {editMode === linkItem.linkId ? (
                  <div className="edit-mode">
                      <label>Edit your long link:</label>
                      <input
                          type="text"
                          value={selectedLink?.originalLink || ''}
                          onChange={(e) => setSelectedLink(prev => prev ? { ...prev, originalLink: e.target.value } : null)}
                          className="edit-input"
                      />
                      <label>Edit your alias:</label>
                      <input
                          type="text"
                          value={editAlias}
                          onChange={(e) => {
                            setEditAlias(e.target.value);
                            if (selectedLink) {
                                setSelectedLink({ ...selectedLink, linkId: e.target.value });
                            }
                        }}
                        className="edit-input"
                      />
                      <div className="edit-actions">
                      <button onClick={() => saveEdit(selectedLink?.originalLink || '', editAlias)}>
                          Save
                      </button>
                          <button onClick={() => setEditMode(null)}>
                              Cancel
                          </button>
                      </div>
                  </div>
                  ) : (
                      <div>
                          <input type="text" className='long-link-input' value={linkItem.originalLink} readOnly />
                      </div>
                  )}

                  <div className="link-actions">
                    <button onClick={() => toggleShareOptions(linkItem.linkId)}><img src="/assets/share-2.svg" alt="share icon" /> Share link</button>
                    
                    <button onClick={() => toggleQRPopup(linkItem.linkId)}><img src="/assets/clarity_qr-code-line.svg" alt="qr icon" /> QR Code</button>
                    
                    <button onClick={() => handleEdit(linkItem)}>
                        <img src="/assets/lucide_edit.svg" alt="edit icon" /> Edit
                    </button>
                    
                    <button onClick={() => viewStats(linkItem)}> <img src="/assets/nimbus_stats.svg" alt="stats icon" /> View stats</button>
                    
                    <button onClick={() => handleDeleteConfirmation(linkItem)} className="delete-btn"> <img src="/assets/uiw_delete.svg" alt="delete icon" /></button>
                  </div>

                  <div className="link-timestamp">
                        {formatDate(linkItem.timestamp || Date.now())}
                     </div>
    
                    {activeShareLinkId === linkItem.linkId && (
                    <div className="dbshare-options-popup">
                        <div className="dbshare-options-popup-content" >
                        <span onClick={() => setActiveShareLinkId(null)} className="close"><img src="/assets/close-filled.svg" alt="close icon" /></span>
                        <h4>Share link on social media </h4>
                        <button onClick={() => shareOnSocialMedia('twitter', linkItem.shortLink)}><img src="/assets/Twitter po.svg" alt="twitter-img"/> </button>
                        <button onClick={() => shareOnSocialMedia('facebook', linkItem.shortLink)}><img src="/assets/Facebook po.svg" alt="facebook-img"/> </button>
                        <button onClick={() => shareOnSocialMedia('whatsapp', linkItem.shortLink)}> <img src="/assets/Whatsapp po.svg" alt="whatsapp-img"/> </button>
                        </div>
                    </div>
                    )}
    
                    {activeQRLinkId === linkItem.linkId && (
                    <div className="dbqr-popup">
                        <div className="dbqr-popup-content"> 
                        <span onClick={() => setActiveQRLinkId(null)} className="close"><img src="/assets/close-filled.svg" alt="close icon" /></span>
                        <h4>Download QR Code </h4>
                        <QRCode value={linkItem.shortLink} size={150} level={"H"} includeMargin={true} />
                        <button onClick={() => downloadQRCode('png', 150, linkItem.shortLink)}>Download PNG</button>
                        <button onClick={() => downloadQRCode('svg', 150, linkItem.shortLink)}>Download SVG</button>
                        </div>
                    </div>
                    )}
                    </div>
                </div>  
            ))}
          </div>
          {showViewStats && currentLinkStats && (
            <ViewStats linkData={currentLinkStats} onClose={() => setShowViewStats(false)} />)}
          <DeleteConfirmationModal />
        </>
      )}
    </div>
  );     
};   
export default Dashboard;
