//FAQs.tsx
import React, { useState } from 'react';
import './faqs.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqList = [
    {
      question: "How does URL shortening work?",
      answer: "URL shortening works by taking a long URL and creating a shorter, condensed version that redirects to the original URL. When a user clicks on the shortened link, they are redirected to the intended destination."
    },
    {
      question: "Is it necessary to create an account to use the URL shortening service?",
      answer: "While you can use our service without an account, creating an account provides additional features such as link tracking and management."
    },
    {
      question: "Are the shortened links permanent? Will they expire?",
      answer: "Shortened links are permanent as long as they comply with our service policy. They do not expire unless they violate our terms of service."
    },
    {
      question: "Are there any limitations on the number of URLs I can shorten?",
      answer: "For non-registered users, there is a daily limit to prevent abuse. Registered users have higher limits, and premium accounts have no limitations."
    },
    {
      question: "Can I customize the shortened URLs to reflect my brand or content?",
      answer: "Yes, registered users can customize their shortened URLs to align with their branding or content themes."
    },
    {
      question: "Can I track the performance of my shortened URLs?",
      answer: "Absolutely, our service provides detailed analytics for your shortened URLs so you can track clicks, geographic data, and more."
    },
    {
      question: "How secure is the URL shortening service? Are the shortened links protected against spam or malicious activity?",
      answer: "We prioritize security. All links are scanned for malicious content, and we implement measures to prevent spamming activities."
    },
    {
      question: "What is a QR code and what can it do?",
      answer: "A QR code is a type of barcode that can be scanned using a smartphone camera. It's used to take a piece of information from a transitory media and put it into your cell phone."
    },
    {
      question: "Is there an API available for integrating the URL shortening service into my own applications or websites?",
      answer: "Yes, we offer an API for developers to integrate our URL shortening capabilities into their applications or websites."
    }
  ];

  return (
    <div className="faqs-container">
      <h2>Frequently asked questions</h2>
      <div className="faqs">
        {faqList.map((faq, index) => (
          <div key={index} className="faq-item">
            <div className="faq-question" onClick={() => toggleFAQ(index)}>
              <h3>{faq.question}</h3>
              <FontAwesomeIcon icon={activeIndex === index ? faMinus : faPlus} />
            </div>
            <div className={`faq-answer ${activeIndex === index ? 'active' : ''}`}>
              <p>{faq.answer}</p>
            </div>
            <div className="divider"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQs;

