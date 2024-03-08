//Hompage.tsx
import React, { } from 'react';
import { Helmet } from 'react-helmet';
import LinkShortener from '../components/LinkShortener/LinkShortener';
import './HomePage.css'; 


const HomePage = () => {
  const siteTitle = 'Scissor - Simplify Your Links';
  const description = 'Scissor provides seamless link shortening and tracking, enabling you to condense long URLs, track link activity, and manage branded domains with ease. Perfect for businesses and individuals looking to enhance their digital presence.';
  const keywords = 'Scissor, URL shortener, link tracking, branded links, QR codes, digital presence, simplify links';
  
  return (
    <>
      <Helmet>
      <html lang="en" />
        <title>{siteTitle}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
      </Helmet>
    <div className="home-container container" >
      <div className="left-container">
      <h1 className="home-title">Link <span className="home-title-emphasis">shortening </span> made easy <br /> Try it now 😊 </h1>
      <div className="benefits">
        <div className="benefit-item">
          <img src="/assets/mdi_content-cut.svg" alt="Link Icon" className="benefit-icon" />
          <p className="benefit-text">Make your links shorter</p>
        </div>
        <div className="benefit-item">
          <img src="/assets/mdi_chart-box-multiple.svg" alt="Stats Icon" className="benefit-icon" />
          <p className="benefit-text">Monitor and assess the clicks on your links</p>
        </div>
        <div className="benefit-item">
          <img src="/assets/icon-park-solid_personal-collection.svg" alt="Brand Icon" className="benefit-icon" />
          <p className="benefit-text">Personalize your links with your own branded domains</p>
        </div>
        <div className="benefit-item">
          <img src="/assets/ri_qr-code-fill.svg" alt="QR Code Icon" className="benefit-icon" />
          <p className="benefit-text">QR Code options for all customers, businesses, and brands</p>
        </div>
      </div>
      </div>
      <LinkShortener className='link-shortening-component home-container container'/>
    </div>
    </>
  );
};

export default HomePage;
