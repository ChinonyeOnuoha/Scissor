// LinkShortener.tsx
import React, { useState } from 'react';
import './linkShortener.css';
import { ref, set } from 'firebase/database';
import { firebaseDatabase } from '../../utils/firebase-config';
import QRCode from 'qrcode.react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../../AuthContext';
import * as QRCodeGenerator from 'qrcode';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface LinkShortenerProps {
  className?: string;
}

const LinkShortener: React.FC<LinkShortenerProps> = ({ className }) => {
  const { currentUser } = useAuth();
  const [originalLink, setOriginalLink] = useState('');
  const [shortenedLink, setShortenedLink] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [domain, setDomain] = useState('scissor.com');
  const [showQRCode, setShowQRCode] = useState(false);
  const [error, setError] = useState('');
  const [showDBShareOptions, setShowDBShareOptions] = useState(false);
  const [showDBQRPopup, setShowDBQRPopup] = useState(false);
  const [linkError] = useState('');


  const shortenLink = async () => {
    setError('');
    if (!originalLink) {
      setError('Please enter a URL to shorten.');
      return;
    }

    if (!/^(http|https):\/\/[^ "]+$/.test(originalLink)) {
      setError('Please enter a valid URL.');
      return;
    }

    if (!currentUser) {
      setError('You must be logged in to shorten links.');
      return;
    }

    const linkId = customAlias.trim() ? customAlias : uuidv4().slice(0, 8);
    const newShortenedLink = `https://scissor-kappa.vercel.app/#${linkId}`;

    try {
      const linkData = {
        originalLink,
        shortLink: newShortenedLink,
        linkId,
        userId: currentUser.uid
      };

      await set(ref(firebaseDatabase, `publicLinks/${linkId}`), linkData);
      if (currentUser) {
        await set(ref(firebaseDatabase, `users/${currentUser.uid}/links/${linkId}`), linkData);
      }

      setShortenedLink(newShortenedLink);
      setShowQRCode(true);
      toast.success('Link shortened successfully.');
    } catch (error) {
      console.error('Error creating shortened link: ', error);
      setError('Failed to shorten the link. Please try again.');
    }
  };

 

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortenedLink);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy!');
      console.error('Copy to clipboard failed:', error);
    }
  };

  
  const shareOnSocialMedia = (platform: 'twitter' | 'facebook' | 'whatsapp') => {
    const url = encodeURIComponent(shortenedLink);
    const text = encodeURIComponent('`Check out this link`');
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

  const downloadQRCode = async (format: 'png' | 'svg', size: 150) => {
    if (format === 'png') {
      const canvas = document.createElement('canvas');
      QRCodeGenerator.toCanvas(canvas, shortenedLink, { width: size, margin: 2 }, (error) => {
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
      const svgString = await QRCodeGenerator.toString(shortenedLink, { type: 'svg', width: size, margin: 2 });
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

  const toggleShareOptions = () => {
    if (showDBQRPopup) {
      setShowDBQRPopup(false);
    }
    setShowDBShareOptions(!showDBShareOptions);
  };
  
  const toggleQRPopup = () => {
    if (showDBShareOptions) {
      setShowDBShareOptions(false);
    }
    setShowDBQRPopup(!showDBQRPopup);
  };


  const resetComponent = () => {
    setOriginalLink('');
    setShortenedLink('');
    setCustomAlias('');
    setShowQRCode(false);
  };

  

  return (
    <div className="link-shortener container home-container">
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
      style={{ width: "auto"}}
      closeButton={false}
      />

      {!showQRCode ? (
        <>
          <label htmlFor="originalLink">Paste your long link here</label>
          <input
            id="originalLink"
            type="text"
            placeholder="Paste link here"
            value={originalLink}
            onChange={(e) => setOriginalLink(e.target.value)}
          />
          {linkError && <p className="error-message">{linkError}</p>}
          <div className='customize-container'>
            <div className="domain-label">
            <label htmlFor="domain" >Choose your domain</label>
            <select
              id="domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            >
              <option value="">scissor-kappa.vercel.app</option>
            </select>
            </div>
            <div className="custom-label">
            <label htmlFor="customAlias" >Custom alias (optional)</label>
            <input
              id="customAlias"
              type="text"
              placeholder="Enter alias"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
            />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button onClick={shortenLink}>Shorten link</button>
          <p className="terms-text">
            By clicking shorten link, I agree to the terms of service, privacy policy, and use of cookies.
          </p>
        </>
      ) : (
        <>
          <label>Your long link:</label>
          <input type="text" value={originalLink} readOnly/>
          <label>Shortened link:</label>
          <input type="text" value={shortenedLink} readOnly />

          <div className="link-options">
            <button onClick={copyToClipboard} className="copy-btn"> <img src="/assets/akar-icons_copy.svg" alt="copy-img"/> Copy</button>
            <button onClick={toggleShareOptions} className="share-btn" > <img src="/assets/share-2.svg" alt="share-img"/> Share Link</button>
            <button onClick={toggleQRPopup}> <img src="/assets/clarity_qr-code-line.svg" alt="qrcode-img"/> QR Code</button>
          </div>

          {showDBShareOptions && (
          <div className="dbshare-options-popup">
            <div className="dbshare-options-popup-content" >
                <span onClick={() => setShowDBShareOptions(false)} className="close"><img src="/assets/close-filled.svg" alt="close icon" /></span>
                <h4>Share link on social media </h4>
            <button onClick={() => shareOnSocialMedia('twitter')}> <img src="/assets/Twitter po.svg" alt="twitter-img"/> </button>
            <button onClick={() => shareOnSocialMedia('facebook')}><img src="/assets/Facebook po.svg" alt="facebook-img"/> </button>
            <button onClick={() => shareOnSocialMedia('whatsapp')}> <img src="/assets/Whatsapp po.svg" alt="whatsapp-img"/> </button>
            </div>
          </div>
          )}

          {showDBQRPopup && (
          <div className="dbqr-popup">
            <div className="dbqr-popup-content"> 
            <span onClick={() => setShowDBQRPopup(false)} className="close"><img src="/assets/close-filled.svg" alt="close icon" /></span>
            <h4>Download QR Code </h4>
            <QRCode value={shortenedLink} size={150} level={"H"} includeMargin={true} />
            <button onClick={() => downloadQRCode('png', 150)}>Download PNG</button>
            <button onClick={() => downloadQRCode('svg', 150)}>Download SVG</button>
            </div>
          </div>
          )}

          <button onClick={resetComponent} className="shorten-another-btn">
            Shorten another link
          </button>
        </>
      )}
    </div>
  );
};

export default LinkShortener;

