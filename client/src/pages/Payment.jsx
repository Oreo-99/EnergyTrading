import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useStateContext } from '../context';

const Payment = () => {
  const { getUserPurchases, address } = useStateContext();
  const [isLoading, setIsLoading] = useState(false);
  const [userPurchases, setUserPurchases] = useState([]);
  const [expandedTransactions, setExpandedTransactions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (!address) return; // Avoid fetching if no address is provided
      setIsLoading(true);
      try {
        const purchases = await getUserPurchases(address);
        console.log('Fetched purchases:', purchases);

        // Group purchases by listingTitle (company name)
        const groupedPurchases = purchases.reduce((acc, { listingTitle, imageUrl, purchases }) => {
          const transactionKey = listingTitle;
          if (!acc[transactionKey]) {
            acc[transactionKey] = {
              listingTitle,
              imageUrl,
              totalPurchased: 0,
              transactions: [],
            };
          }

          // Safely check if purchases array exists
          if (purchases && Array.isArray(purchases)) {
            purchases.forEach(({ amount, timestamp }) => {
              const parsedAmount = parseFloat(amount)/1e18; // Adjust for the data format
              acc[transactionKey].transactions.push({
                amount: parsedAmount,
                timestamp: new Date(timestamp * 1000).toLocaleString(),
              });
              acc[transactionKey].totalPurchased += parsedAmount; // Sum the amounts for totalPurchased
            });
          }

          return acc;
        }, {});

        console.log('Grouped purchases:', groupedPurchases);
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

  const totalPurchaseAmount = (transactions) =>
    transactions.reduce((total, { amount }) => total + amount, 0).toFixed(3);

  return (
    <div className="relative container mx-auto p-4">
      <div className="bg-gray-900 rounded-lg shadow-lg max-w-4xl mx-auto relative z-10">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-3xl font-bold text-center text-white">Your Energy Purchases</h1>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : userPurchases.length > 0 ? (
            <div className="space-y-6">
              {userPurchases.map(({ listingTitle, imageUrl, totalPurchased, transactions }) => (
                <div key={listingTitle} className="relative bg-gray-800 p-6 rounded-lg shadow-md">
                  {/* Faded background image for each energy transaction */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-20 rounded-lg" 
                    style={{ backgroundImage: `url(${imageUrl})` }} 
                  />
                  <div className="relative z-10"> {/* Content above the background */}
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white">{listingTitle}</h3>
                        <p className="text-gray-400 mt-1">
                          Total Purchased: {totalPurchased.toFixed(3)} ETH
                        </p>
                      </div>
                      <button
                        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                        onClick={() => toggleTransactionExpansion(listingTitle)}
                      >
                        {expandedTransactions[listingTitle] ? <ChevronUp /> : <ChevronDown />}
                      </button>
                    </div>
                    {expandedTransactions[listingTitle] && (
                      <div className="mt-4 space-y-2">
                        {transactions.length > 0 ? (
                          transactions.map((transaction, index) => (
                            <div key={index} className="flex justify-between items-center bg-gray-700 p-2 rounded">
                              <span>{transaction.amount.toFixed(3)} ETH</span>
                              <span className="text-sm text-gray-400">{transaction.timestamp}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-400">No transactions found for this energy purchase.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <p className="text-xl text-white">You haven't made any energy purchases yet.</p>
              <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md">
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
