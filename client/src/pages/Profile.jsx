// src/pages/Profile.jsx

import React, { useState, useEffect } from 'react';
import { DisplayCampaigns } from '../components';
import { useStateContext } from '../context';

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [listings, setListings] = useState([]); // Renamed from campaigns to listings

  const { address, contract, getEnergyListingsByOwner } = useStateContext(); // Updated context function

  /**
   * @dev Fetches the energy listings created by the connected user.
   */
  const fetchListings = async () => {
    setIsLoading(true);
    try {
      const data = await getEnergyListingsByOwner(); // Fetch listings by owner
      setListings(data);
    } catch (error) {
      console.error("Error fetching energy listings:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (contract && address) {
      fetchListings();
    }
  }, [address, contract]);

  return (
    <DisplayCampaigns 
      title="My Energy Listings" // Updated title
      isLoading={isLoading}
      campaigns={listings} // Passed listings instead of campaigns
    />
  );
};

export default Profile;
