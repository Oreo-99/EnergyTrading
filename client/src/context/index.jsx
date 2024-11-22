import React, { useContext, createContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';

// Import your contract's ABI and address
import EnergyTradingData from 'C:/Users/Admin/cf2/EnergyTrading/TruffleWeb3/build/contracts/EnergyTrading.json';
const EnergyTradingABI = EnergyTradingData.abi;
const ContractAdd= EnergyTradingData.networks[5777].address;
// Create a Context for the application state
const StateContext = createContext(); 

/**
 * @dev Provider component that wraps the application and provides state and functions
 */
export const StateContextProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [address, setAddress] = useState('');

  // Initialize provider and signer
  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(tempProvider);

          // Request account access if needed
          await tempProvider.send("eth_requestAccounts", []);

          const tempSigner = tempProvider.getSigner();
          setSigner(tempSigner);

          const userAddress = await tempSigner.getAddress();
          setAddress(userAddress);

          // Use the updated environment variable for the contract address
          const tempContract = new ethers.Contract(
            ContractAdd, // Updated variable name
            EnergyTradingABI,
            tempSigner
          );
          setContract(tempContract);
        } catch (error) {
          console.error("Error initializing provider and signer:", error);
        }
      } else {
        console.error("Please install MetaMask!");
      }
    };

    init();
  }, []);

  /**
   * @dev Function to connect to MetaMask
   */
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }
    try {
      const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(tempProvider);

      // Request account access
      await tempProvider.send("eth_requestAccounts", []);

      const tempSigner = tempProvider.getSigner();
      setSigner(tempSigner);

      const userAddress = await tempSigner.getAddress();
      setAddress(userAddress);

      // Use the updated environment variable for the contract address
      const tempContract = new ethers.Contract(
        ContractAdd, // Updated variable name
        EnergyTradingABI,
        tempSigner
      );
      setContract(tempContract);
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
    }
  };

  /**
 * @dev Function to disconnect the wallet
 */
const disconnectWallet = () => {
  setProvider(null);
  setSigner(null);
  setContract(null);
  setAddress('');
  console.log("Wallet disconnected");
};

  /**
   * @dev Function to create a new energy listing
   * @param {Object} form - Contains listing details
   */
  const createEnergyListing = async (form) => {
    try {
      const tx = await contract.createEnergyListing(
        address, // Owner address
        form.name, // Company name
        form.costPerUnit, // Cost per unit in wei
        form.energyAmount, // Energy amount in kWh
        form.fuelType, // Fuel type
        form.description, // Description
        form.image // Image URL
      );
      await tx.wait();
      console.log("Energy listing created successfully:", tx);
    } catch (error) {
      console.error("Error creating energy listing:", error);
      throw error; // Propagate error for UI handling
    }
  };

  /**
   * @dev Function to purchase energy units from a listing
   * @param {number} listingId - ID of the energy listing
   * @param {number} amount - Amount of energy to purchase in kWh
   */
  const buyEnergy = async (listingId, amount) => {
    try {
      // Fetch the specific energy listing to get the costPerUnit in Wei
      const listing = await getEnergyListing(listingId);
      if (!listing) {
        throw new Error("Listing not found.");
      }
      amount=amount.toFixed(5)
      
      amount=ethers.utils.parseUnits(amount, 18)

      console.log("Amount in wei:", amount.toString());


      const costPerUnit = listing.costPerUnit.toString();
      console.log("Cost per unit in wei:", costPerUnit.toString());
      // Calculate the total cost in Wei
      
      var totalCost = listing.costPerUnit.mul(amount); // costPerUnit is already in Wei
      //divide the total cost by 10^18 to get the cost in ether
      totalCost=totalCost.div(ethers.BigNumber.from("1000000000000000000"))

      //console.log(listingId,amount,totalCost,parseFloat(totalCost),parseFloat(listing.costPerUnit))
      console.log("Total cost in wei:", totalCost.toString());
  
      // Execute the buyEnergy function on the contract
      const tx = await contract.buyEnergy(listingId, amount, { value: totalCost });
      await tx.wait();
      console.log("Energy purchased successfully:", tx);
    } catch (error) {
      console.error("Error purchasing energy:", error);
      throw error; // Propagate error for UI handling
    }
  };
  

  /**
   * @dev Function to fetch all energy listings
   * @returns {Array} - Array of parsed energy listings
   */
  const getEnergyListings = async () => {
    try {
      const listings = await contract.getEnergyListings();

      // Parse and format the listings for frontend use
      const parsedListings = listings.map((listing, i) => ({
        id: i,
        owner: listing.owner,
        name: listing.name,
        description: listing.description,
        costPerUnit: ethers.utils.formatEther(listing.costPerUnit), // Convert wei to ETH
        energyAmount: ethers.utils.formatEther(listing.energyAmount),
        fuelType: listing.fuelType,
        image: listing.image,
        amountSold: ethers.utils.formatEther(listing.amountSold),
        createdAt: new Date(listing.createdAt.toNumber() * 1000).toLocaleString() // Convert timestamp to readable date
      }));

      console.log("yo",parsedListings);
      return parsedListings;
    } catch (error) {
      console.error("Error fetching energy listings:", error);
      return [];
    }
  };

  /**
   * @dev Function to fetch a specific energy listing by ID
   * @param {number} id - ID of the energy listing
   * @returns {Object|null} - Parsed energy listing or null if not found
   */
  const getEnergyListing = async (id) => {
    try {
      const listing = await contract.getEnergyListing(id);
  
      const parsedListing = {
        id: id,
        owner: listing.owner,
        name: listing.name,
        description: listing.description,
        costPerUnit: listing.costPerUnit, // Keep in Wei (BigNumber)
        energyAmount: listing.energyAmount,
        fuelType: listing.fuelType,
        image: listing.image,
        amountSold: ethers.utils.formatEther(listing.amountSold),
        createdAt: new Date(listing.createdAt.toNumber() * 1000).toLocaleString() // Convert timestamp to readable date
      };
  
      return parsedListing;
    } catch (error) {
      console.error("Error fetching energy listing:", error);
      return null;
    }
  };
  

  /**
   * @dev Function to fetch energy listings created by the connected user
   * @returns {Array} - Array of parsed energy listings by the owner
   */
  const getEnergyListingsByOwner = async () => {
    if (!address) return [];

    try {
      const listings = await contract.getEnergyListingsByOwner(address);


      // Parse and format the listings for frontend use
      const parsedListings = listings.map((listing, i) => ({
        id: i,
        owner: listing.owner,
        name: listing.name,
        description: listing.description,
        costPerUnit: ethers.utils.formatEther(listing.costPerUnit), // Convert wei to ETH
        energyAmount: ethers.utils.formatEther(listing.energyAmount),
        fuelType: listing.fuelType,
        image: listing.image,
        amountSold: ethers.utils.formatEther(listing.amountSold),
        createdAt: new Date(listing.createdAt.toNumber() * 1000).toLocaleString() // Convert timestamp to readable date
      }));


      return parsedListings;
    } catch (error) {
      console.error("Error fetching energy listings by owner:", error);
      return [];
    }
  };

  /**
   * @dev Function to fetch the purchase history for a specific energy listing
   * @param {number} id - ID of the energy listing
   * @returns {Array} - Array of parsed purchase records
   */
  const getPurchaseHistory = async (id) => {
    try {
      const purchases = await contract.getPurchaseHistory(id);

      // Parse and format the purchase history for frontend use
      const parsedPurchases = purchases.map((purchase) => ({
        buyer: purchase.buyer,
        amount: ethers.utils.formatEther(purchase.amount), // Convert wei to ETH
        timestamp: new Date(purchase.timestamp.toNumber() * 1000).toLocaleString() // Convert timestamp to readable date
      }));

      return parsedPurchases;
    } catch (error) {
      console.error("Error fetching purchase history:", error);
      return [];
    }
  };

   // Fetch number of campaigns
   const getNumberOfCampaigns = async () => {
    try {
      const numberOfCampaigns = await contract.getNumberOfCampaigns();
      return numberOfCampaigns.toNumber();
    } catch (error) {
      console.error("Error fetching number of campaigns:", error);
      return 0;
    }
  };

  const getUserPurchases = async (userAddress) => {
    try {
      // Get the user's purchase details from the smart contract
      const purchaseDetails = await contract.getUserPurchases(userAddress);
  
      // Get the energy listings from the smart contract
      const listingsData = await contract.getEnergyListings();
  
      console.log("Purchase details:", purchaseDetails);
      console.log("Energy listings data:", listingsData);
      
      const userPurchases = purchaseDetails.map(purchase => {
        const listing = listingsData[purchase.listingId];
        const totalPurchased = purchaseDetails
          .filter(p => p.listingId === purchase.listingId)
          .reduce((total, p) => total + parseFloat(ethers.utils.formatEther(p.amount)), 0);
  
        return {
          listingTitle: listing.name,
          costPerUnit: ethers.utils.formatEther(listing.costPerUnit),
          energyAmount: listing.energyAmount,
          fuelType: listing.fuelType,
          imageUrl: listing.image,
          purchases: purchaseDetails.filter(p => p.listingId === purchase.listingId),
          totalPurchased,
        };
      });
  
      return userPurchases;
    } catch (error) {
      console.error("Error fetching user purchases:", error);
      return [];
    }
  };
  

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connectWallet,           // Function to connect MetaMask
        disconnectWallet,        // Function to disconnect MetaMask
        createEnergyListing,     // Function to create a new energy listing
        buyEnergy,               // Function to purchase energy
        getEnergyListings,       // Function to fetch all energy listings
        getEnergyListing,        // Function to fetch a specific energy listing
        getEnergyListingsByOwner,// Function to fetch listings by the connected owner
        getPurchaseHistory,       // Function to fetch purchase history for a listing
        getUserPurchases,
        getNumberOfCampaigns
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

/**
 * @dev Custom hook to use the StateContext
 * @returns {Object} - Context value
 */
export const useStateContext = () => useContext(StateContext);
