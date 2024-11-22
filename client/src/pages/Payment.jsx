import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, CreditCard, TrendingUp, LeafIcon } from 'lucide-react';
import { useStateContext } from '../context';
import {
  biomass_energy,
  fossil_fuel,
  geothermal,
  solar_energy,
  water_energy,
  windmill
} from '../assets';
import { carbonFootprintPerKWh } from '../constants';

const Payment = () => {
  const { getUserPurchases, address } = useStateContext();
  const [isLoading, setIsLoading] = useState(false);
  const [userPurchases, setUserPurchases] = useState([]);
  const [expandedTransactions, setExpandedTransactions] = useState({});

  // Fuel type icon mapping
  const fuelTypeIcons = {
    'Biomass': biomass_energy,
    'Fossil': fossil_fuel,
    'Geothermal': geothermal,
    'Solar': solar_energy,
    'Hydro': water_energy,
    'Wind': windmill
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!address) return;
      setIsLoading(true);
      try {
        const purchases = await getUserPurchases(address);
        const groupedPurchases = purchases.reduce((acc, { listingTitle, imageUrl, purchases }) => {
          const transactionKey = listingTitle;
          if (!acc[transactionKey]) {
            acc[transactionKey] = {
              listingTitle,
              imageUrl,
              totalPurchased: 0,
              totalCost: 0,
              transactions: [],
              savedCO2: 0,
              currentEmissions: 0
            };
          }

          if (purchases && Array.isArray(purchases)) {
            purchases.forEach(({ amount, totalCost, fuelType, timestamp }) => {
              const parsedAmount = parseFloat(amount) / 1e18;
              const parsedCost = parseFloat(totalCost) / 1e18;

              const fossilEmissions = parsedAmount * carbonFootprintPerKWh['Fossil Fuel'];
              const currentEmissions = parsedAmount * carbonFootprintPerKWh[fuelType];
              const savedCO2 = fossilEmissions - currentEmissions;

              acc[transactionKey].transactions.push({
                amount: parsedAmount,
                totalCost: parsedCost,
                fuelType,
                timestamp: new Date(timestamp * 1000).toLocaleString(),
                savedCO2: savedCO2,
                currentEmissions: currentEmissions
              });

              acc[transactionKey].totalPurchased += parsedAmount;
              acc[transactionKey].totalCost += parsedCost;
              acc[transactionKey].savedCO2 += savedCO2;
              acc[transactionKey].currentEmissions += currentEmissions;
            });
          }

          return acc;
        }, {});

        setUserPurchases(Object.values(groupedPurchases));
      } catch (error) {
        console.error('Error fetching purchases:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [address, getUserPurchases]);

  const toggleTransactionExpansion = (listingTitle) => {
    setExpandedTransactions((prev) => ({
      ...prev,
      [listingTitle]: !prev[listingTitle],
    }));
  };

  const calculateTotalPurchasedAmount = () =>
    userPurchases.reduce((total, purchase) => total + purchase.totalPurchased, 0).toFixed(3);

  const calculateTotalCostIncurred = () =>
    userPurchases.reduce((total, purchase) => total + purchase.totalCost, 0).toFixed(3);

  const calculateTotalCO2Saved = () =>
    userPurchases.reduce((total, purchase) => total + purchase.savedCO2, 0).toFixed(3);

  const calculateTotalCO2Consumed = () =>
    userPurchases.reduce((total, purchase) => total + purchase.currentEmissions, 0).toFixed(3);

  const getFuelTypeIcon = (fuelType) => {
    const baseFuelType = fuelType.split(/[^a-zA-Z]/)[0];
    return fuelTypeIcons[baseFuelType] || null;
  };

  return (
    <div className="relative container mx-auto p-2 sm:p-4">
      <div className="bg-slate-900 rounded-xl shadow-2xl max-w-4xl mx-auto relative z-60">
        <div className="p-4 sm:p-6 border-b border-slate-700">
          <div className="flex justify-center items-center mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2 sm:gap-3">
              <CreditCard className="text-blue-400" />
              Your Energy Purchases
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-2">
              <p className="text-slate-400 text-sm">Total Purchased</p>
              <p className="text-lg sm:text-xl font-semibold text-green-400">
                {calculateTotalPurchasedAmount()} kWh
              </p>
            </div>
            <div className="text-center p-2">
              <p className="text-slate-400 text-sm">Total Cost</p>
              <p className="text-lg sm:text-xl font-semibold text-blue-400">
                {calculateTotalCostIncurred()} ETH
              </p>
            </div>
            <div className="text-center p-2">
              <p className="text-slate-400 text-sm">Total CO2e Produced</p>
              <p className="text-lg sm:text-xl font-semibold text-green-500">
                {calculateTotalCO2Consumed()} CO2e
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="bg-green-800 bg-opacity-20 rounded-xl p-3 sm:p-4 mb-6">
            <div className="flex items-center gap-2 sm:gap-3 justify-center sm:justify-between flex-wrap">
              <LeafIcon className="text-green-500" />
              <span className="text-white text-lg sm:text-xl font-semibold text-center">
                Wow, you saved {calculateTotalCO2Saved()} CO2e!
              </span>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : userPurchases.length > 0 ? (
            <div className="space-y-4 sm:space-y-6">
              {userPurchases.map(({ listingTitle, imageUrl, totalPurchased, totalCost, currentEmissions, savedCO2, transactions }) => (
                <div 
                  key={listingTitle} 
                  className="relative bg-slate-800 p-4 sm:p-6 rounded-xl shadow-md overflow-hidden cursor-pointer"
                  onClick={() => toggleTransactionExpansion(listingTitle)}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-20 rounded-xl"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                  />
                  <div className="relative z-10">
                    <div className="flex justify-between items-start sm:items-center mb-4 flex-wrap gap-2">
                      <div className="w-full sm:w-auto">
                        <h3 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
                          <TrendingUp className="text-blue-400" />
                          {listingTitle}
                        </h3>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2">
                          <p className="text-sm sm:text-base text-slate-300">
                            Total: {totalPurchased.toFixed(3)} kWh
                          </p>
                          <p className="text-sm sm:text-base text-slate-300">
                            Cost: {totalCost.toFixed(3)} ETH
                          </p>
                          <p className="text-sm sm:text-base text-slate-300">
                            CO2e: {currentEmissions.toFixed(3)}kg
                          </p>
                          <p className="text-sm sm:text-base text-green-300">
                            Saved: {savedCO2.toFixed(3)}kg
                          </p>
                        </div>
                      </div>
                      <button
                        className="hidden sm:block bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-md transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTransactionExpansion(listingTitle);
                        }}
                      >
                        {expandedTransactions[listingTitle] ? <ChevronUp /> : <ChevronDown />}
                      </button>
                    </div>
                    
                    {expandedTransactions[listingTitle] && (
                      <div className="mt-4 space-y-2">
                        {transactions.length > 0 ? (
                          transactions.map((transaction, index) => (
                            <div
                              key={index}
                              className="flex flex-col bg-slate-700 p-3 rounded-md mb-2 hover:bg-slate-600 transition"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                <span className="text-white font-medium">
                                  {transaction.amount.toFixed(3)} kWh
                                </span>
                                <span className="text-sm text-slate-400">{transaction.timestamp}</span>
                              </div>
                              <div className="flex flex-col sm:flex-row justify-between mt-2 gap-2">
                                <span className="text-slate-300">
                                  Cost: {transaction.totalCost.toFixed(3)} ETH
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-300">
                                    {transaction.fuelType}
                                  </span>
                                  {getFuelTypeIcon(transaction.fuelType) && (
                                    <img
                                      src={getFuelTypeIcon(transaction.fuelType)}
                                      alt={transaction.fuelType}
                                      className="w-5 h-5"
                                    />
                                  )}
                                </div>
                                <span className="text-green-300">
                                  Saved: {transaction.savedCO2.toFixed(3)}kg
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-slate-400 text-center">
                            No transactions found for this energy purchase.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-800 p-6 sm:p-8 rounded-xl text-center">
              <p className="text-lg sm:text-xl text-white mb-4">You haven't made any energy purchases yet.</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md transition transform hover:scale-105">
                Explore Energy Options
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;