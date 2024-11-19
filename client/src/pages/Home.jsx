import React, { useState, useEffect } from 'react';

import { DisplayCampaigns } from '../components'; // You might consider renaming this to DisplayListings if appropriate
import { useStateContext } from '../context';

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [listings, setListings] = useState([]); // Renamed from campaigns to listings

  const { address, contract, getEnergyListings } = useStateContext(); // Updated context function

  const fetchListings = async () => {
    setIsLoading(true);
    try {
      const data = await getEnergyListings(); // Fetch all energy listings
      setListings(data);
    } catch (error) {
      console.error("Error fetching energy listings:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (contract) {
      fetchListings();
    }
  }, [address, contract]);

  return (
    <DisplayCampaigns 
      title="All Energy Listings" // Updated title
      isLoading={isLoading}
      campaigns={listings} // Passed listings instead of campaigns
    />
  );
};

export default Home;
