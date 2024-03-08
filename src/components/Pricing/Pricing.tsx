//Pricing.tsx
import React, { useState } from 'react';
import './pricing.css';

interface Plan {
    title: string;
    monthlyCost: string;
    yearlyCost: string;
    audience: string;
    benefits: string[];
  }

const Pricing = () => {
  const [planPeriod, setPlanPeriod] = useState('monthly');

  const yearlyMultiplier = 2.2; 

  const plans: Plan[] =  [
    {
      title: 'Basic',
      monthlyCost: 'Free',
      yearlyCost: 'Free',
      audience: 'Free plan for all users',
      benefits: [
        'Unlimited URL Shortening',
        'Basic Link Analytics',
        'Customizable Short Links',
        'Standard Support',
        'Ad-supported',
      ],
    },
    {
      title: 'Professional',
      monthlyCost: '$15/month',
      yearlyCost: `$${(15 * yearlyMultiplier).toFixed(0)}/year`,
      audience: 'Ideal for business creators',
      benefits: [
        'Enhanced Link Analytics',
        'Custom Branded Domains',
        'Advanced Link Customization',
        'Priority Support',
        'Ad-free Experience',
      ],
    },
    {
      title: 'Teams',
      monthlyCost: '$25/month',
      yearlyCost: `$${(25 * yearlyMultiplier).toFixed(0)}/year`,
      audience: 'Share with up to 10 users',
      benefits: [
        'Team Collaboration',
        'User Roles and Permissions',
        'Enhanced Security',
        'API Access',
        'Dedicated Account Manager',
      ],
    },
  ];

  return (
    <div className="pricing-container container">
      <h1 className="pricing-title">Find a plan that suits your needs</h1>
      <div className="plan-switch">
        <button className={`plan-switch-btn ${planPeriod === 'monthly' ? 'active' : ''}`} onClick={() => setPlanPeriod('monthly')}>Monthly</button>
        <button className={`plan-switch-btn ${planPeriod === 'yearly' ? 'active' : ''}`} onClick={() => setPlanPeriod('yearly')}>Yearly</button>
      </div>
      <div className="plans">
      {plans.map((plan, index) => (
        <div key={index} className={`plan-card ${plan.title === 'Professional' ? 'plan-card-highlighted' : ''}`}>
            <h2 className="plan-title">{plan.title}</h2>
            <p className="plan-cost">{planPeriod === 'monthly' ? plan.monthlyCost : plan.yearlyCost}</p>
            <p className="plan-audience">{plan.audience}</p>
            <ul className="plan-benefits">
            {plan.benefits.map((benefit, benefitIndex) => (
                <li key={benefitIndex} className="benefit-item">
                <img src="/assets/check-circle.svg" alt="Check" className="benefit-icon"/>
                {benefit}
                </li>
            ))}
            </ul>
            <button className="plan-select-btn">Select plan</button>
        </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;

