import React from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid";
import FundCard from './FundCard';
import { loader } from '../assets';

const DisplayCampaigns = ({ title, isLoading, campaigns }) => {
  const navigate = useNavigate();

  const handleNavigate = (campaign) => {
    navigate(`/campaign-details/${campaign.name}`, { state: campaign });
  };

  return (
    <div>
      <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">{title} ({campaigns.length})</h1>

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
        )}

        {!isLoading && campaigns.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            You have not created any campaigns yet
          </p>
        )}

        {!isLoading && campaigns.length > 0 && campaigns.map((campaign) => (
          <div key={uuidv4()} className="campaign-card-container">
            <FundCard 
              {...campaign} 
              handleClick={() => handleNavigate(campaign)} 
            />
            {/* Display Purchase Timestamps */}
            <div className="purchase-timestamps mt-2 text-gray-400 text-sm">
              {campaign.purchaseTimestamps && campaign.purchaseTimestamps.length > 0 ? (
                <ul>
                  {campaign.purchaseTimestamps.map((timestamp, index) => (
                    <li key={uuidv4()}>{`Purchase ${index + 1}: ${new Date(timestamp).toLocaleString()}`}</li>
                  ))}
                </ul>
              ) : (
                <p>No purchases yet.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayCampaigns;
