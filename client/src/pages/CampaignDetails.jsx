// src/pages/CampaignDetails.jsx

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

import { useStateContext } from '../context';
import { CountBox, CustomButton, Loader } from '../components';
import { calculateBarPercentage } from '../utils';
import { thirdweb } from '../assets';
import { carbonFootprintPerKWh } from '../constants';

const CampaignDetails = () => {
  const { state } = useLocation(); // Contains the energy listing data
  const navigate = useNavigate();
  const { buyEnergy, getPurchaseHistory, contract, address } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [purchaseOption, setPurchaseOption] = useState('energy'); // 'energy' or 'payment'
  const [energyAmount, setEnergyAmount] = useState(""); // Amount of energy to purchase (kWh)
  const [paymentAmount, setPaymentAmount] = useState(""); // Amount to pay (ETH)
  const [calculatedPayment, setCalculatedPayment] = useState(''); // Calculated cost based on energy
  const [calculatedEnergy, setCalculatedEnergy] = useState(''); // Calculated energy based on payment
  const [purchases, setPurchases] = useState([]); // List of purchases
  const [error, setError] = useState(''); // Error message

  // Calculate progress percentage based on amountSold and energyAmount
  const progressPercentage = calculateBarPercentage(state.energyAmount, state.amountSold);


  /**
   * @dev Fetches the purchase history for the current energy listing.
   */
  const fetchPurchases = async () => {
    try {
      const data = await getPurchaseHistory(state.id); // Fetch purchases for listing ID

      setPurchases(data);
    } catch (error) {
      console.error("Error fetching purchase history:", error);
      setError("Failed to load purchase history.");
    }
  };

  useEffect(() => {
    if (contract && address) {
      fetchPurchases();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, address]);

  /**
   * @dev Handles the purchase of energy units.
   */
  const handleBuy = async () => {
    // Reset error message
    setError('');

    // Input validation based on selected option
    if (purchaseOption === 'energy') {
      if (!parseFloat(energyAmount) || parseFloat(energyAmount) <= 0 || isNaN(energyAmount)) {
        setError("Please enter a valid amount of energy to purchase (positive number).");
        return;
      }
      // Check if enough energy is available
      if (parseFloat(energyAmount) > (parseFloat(state.energyAmount) - state.amountSold)) {
        setError(`Only ${(state.energyAmount - state.amountSold)} kWh available.`);
        return;
      }
    } else if (purchaseOption === 'payment') {
      if (!paymentAmount || paymentAmount <= 0 || isNaN(paymentAmount)) {
        setError("Please enter a valid amount to pay.");
        return;
      }
      // Calculate maximum energy that can be bought
      const energyCanBuy = parseFloat(paymentAmount) / parseFloat(state.costPerUnit);
      if (energyCanBuy > (state.energyAmount - state.amountSold)) {
        setError(`Only ${(state.energyAmount - state.amountSold)} kWh available for your payment.`);
        return;
      }
    }


    setIsLoading(true);
    try {
      let energyToBuy;
      if (purchaseOption === 'energy') {
        // User specifies the amount of energy to buy
        energyToBuy = parseFloat(energyAmount);
        console.log("energyToBuy", energyToBuy)

        await buyEnergy(state.id, energyToBuy); // Initiate purchase
        console.log("purchase noice")
      } else if (purchaseOption === 'payment') {
        // User specifies the amount to pay
        energyToBuy = (parseFloat(paymentAmount) / parseFloat(state.costPerUnit));

        if (energyToBuy <= 0) {

          setError("Amount must be a positive integer.");
          return;
        }
        await buyEnergy(state.id, energyToBuy); // Initiate purchase
      }
      alert("Energy purchased successfully!");
      await fetchPurchases(); // Refresh purchase history
      // Reset input fields
      setEnergyAmount('');
      setPaymentAmount('');
      setCalculatedEnergy('');
      setCalculatedPayment('');
    } catch (error) {
      console.error("Error purchasing energy:", error);
      setError(error.message || "Failed to purchase energy. Please try again.");
    }
    setIsLoading(false);
  };

  /**
   * @dev Handles changes in the purchase option and resets related states.
   * @param {string} option - Selected purchase option ('energy' or 'payment')
   */
  const handleOptionChange = (option) => {
    setPurchaseOption(option);
    // Reset all related states when changing options
    setEnergyAmount('');
    setPaymentAmount('');
    setCalculatedEnergy('');
    setCalculatedPayment('');
    setError('');
  };

  /**
   * @dev Handles changes in the energy amount input and calculates the total payment.
   * @param {string} value - Input value for energy amount
   */
  const handleEnergyChange = (value) => {
    setEnergyAmount(value);
    if (value && parseFloat(value) > 0) {
      const totalCost = parseFloat(value) * parseFloat(state.costPerUnit);
      setCalculatedPayment(totalCost.toFixed(4)); // Limit to 4 decimal places
    } else {
      setCalculatedPayment('');
    }
  };


  /**
   * @dev Handles changes in the payment amount input and calculates the corresponding energy.
   * @param {string} value - Input value for payment amount
   */
  const handlePaymentChange = (value) => {
    setPaymentAmount(value);
    if (value && parseFloat(value) > 0) {
      const energy = parseFloat(value) / parseFloat(state.costPerUnit);
      setCalculatedEnergy(energy.toFixed(4)); // Limit to 4 decimal places
    } else {
      setCalculatedEnergy('');
    }
  };



  return (
    <div>
      {isLoading && <Loader />} {/* Display loader when processing */}

      {/* Energy Listing Overview */}
      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
        {/* Listing Image and Progress Bar */}
        <div className="flex-1 flex-col">
          <img src={state.image} alt="listing" className="w-full h-[410px] object-cover rounded-xl" />
          <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
            <div
              className="absolute h-full bg-[#4acd8d]"
              style={{ width: `${progressPercentage}%`, maxWidth: '100%' }}
            >
            </div>
          </div>
        </div>

        {/* Listing Statistics */}
        <div className="flex md:w-[200px] w-full flex-wrap justify-between gap-[30px]">
          <CountBox title="Energy Available (kWh)" value={state.energyAmount - state.amountSold} />
          <CountBox title="Energy Sold (kWh)" value={state.amountSold} />
          <CountBox title="Fuel Type" value={state.fuelType} />
          <CountBox title="Cost per Unit (ETH/kWh)" value={state.costPerUnit} />
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        {/* Left Column: Creator, Story, Purchases */}
        <div className="flex-[2] flex flex-col gap-[40px]">
          {/* Creator Section */}
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Creator</h4>

            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                <img src={thirdweb} alt="user" className="w-[60%] h-[60%] object-contain" />
              </div>
              <div>
                <h4 className="font-epilogue font-semibold text-[14px] text-white break-all">{state.owner}</h4>
                <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">0 Listings</p> {/* Adjust if needed */}
              </div>
            </div>
          </div>

          {/* Story Section */}
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Story</h4>

            <div className="mt-[20px]">
              <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">{state.description}</p>
            </div>
          </div>




          {/* Purchases Section */}
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Purchases</h4>
            <div className="mt-[20px] flex flex-col gap-[20px]">
              {purchases.length > 0 ? (
                purchases.map((purchase, index) => (
                  <div key={index} className="flex flex-row items-center justify-between p-4 bg-[#3a3a43] rounded-lg">
                    <div className="flex flex-col">
                      <p className="font-epilogue font-normal text-[16px] text-[#808191]">{String(parseFloat(purchase.amount))} kWh purchased</p>
                      <p className="font-epilogue font-normal text-[16px] text-[#808191]">{purchase.amount * state.costPerUnit} ETH</p>
                    </div>
                    <p className="font-epilogue font-normal text-[16px] text-[#808191]">Buyer: {purchase.buyer}</p> {/* Display buyer address */}
                  </div>
                ))
              ) : (
                <p className="font-epilogue font-normal text-[16px] text-[#808191]">No purchases yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Purchase Options */}
        <div className="flex-1 bg-[#3a3a43] rounded-[10px] p-4">
          <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Buy Energy</h4>

          {/* Purchase Options */}
          <div className="flex flex-row mt-4">
            <button
              onClick={() => handleOptionChange('energy')}
              className={`flex-1 py-2 ${purchaseOption === 'energy' ? 'bg-[#4acd8d]' : 'bg-[#2c2f32]'} text-white rounded-[10px]`}
            >
              Buy by Energy (kWh)
            </button>
            <button
              onClick={() => handleOptionChange('payment')}
              className={`flex-1 py-2 ${purchaseOption === 'payment' ? 'bg-[#4acd8d]' : 'bg-[#2c2f32]'} text-white rounded-[10px]`}
            >
              Buy by Payment (ETH)
            </button>
          </div>

          {/* Input Fields */}
          <div className="mt-6">
            {purchaseOption === 'energy' ? (
              <>
                <input
                  type="number"
                  value={energyAmount}
                  onChange={(e) => handleEnergyChange(e.target.value)}
                  placeholder="Amount of Energy (kWh)"
                  className="w-full p-2 mb-2 rounded-md"
                />
                {calculatedPayment && (
                  <p className="text-white">Total Payment: {calculatedPayment} ETH</p>
                )}
              </>
            ) : (
              <>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => handlePaymentChange(e.target.value)}
                  placeholder="Amount to Pay (ETH)"
                  className="w-full p-2 mb-2 rounded-md"
                />
                {calculatedEnergy && (
                  <p className="text-white">Energy You Can Buy: {calculatedEnergy} kWh</p>
                )}
              </>
            )}

            {/* Carbon Footprint and Savings */}
            {((purchaseOption === 'energy' && energyAmount) || (purchaseOption === 'payment' && calculatedEnergy)) && state.fuelType && (
              <>
                <p className="text-white">
                  Carbon Footprint: {(
                    (purchaseOption === 'energy' ? energyAmount : calculatedEnergy) *
                    carbonFootprintPerKWh[state.fuelType]
                  ).toFixed(2)} kg CO2e
                </p>
                <p className="text-white">
                  Saved Compared to Fossil Fuel: {(
                    (purchaseOption === 'energy' ? energyAmount : calculatedEnergy) *
                    (carbonFootprintPerKWh['Fossil Fuel'] - carbonFootprintPerKWh[state.fuelType])
                  ).toFixed(2)} kg CO2e
                </p>
              </>
            )}

            {error && <p className="text-red-500">{error}</p>}
            <CustomButton
              btnType="button"
              title="Purchase"
              styles="w-full mt-4 bg-[#1dc071]"
              handleClick={handleBuy}
            />
          </div>


        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
