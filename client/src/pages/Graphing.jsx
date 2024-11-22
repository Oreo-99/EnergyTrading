import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, MapPin, Building2, Calendar, Info, Download } from 'lucide-react';
import { cityData } from '../constants';
import axios from 'axios';


const Graphing = () => {
  const [selectedFuel, setSelectedFuel] = useState('all');
  const [selectedCity, setSelectedCity] = useState('pune');
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');
  const [showInfo, setShowInfo] = useState(true);

  const cities = {
    'pune': 'Pune',
    'mumbai': 'Mumbai',
    'delhi': 'Delhi',
    'new-york': 'New York',
  };

 /*  const fetchPredictions = async (cityName) => {
    try {
      const response = await axios.post('http://localhost:8888/.netlify/v1/functions/predict', {
        city: cityName,  // Ensure the key here matches the backend's expected key
      });
  
      // Assuming the response data has a `predictions` object
      const predictedValue = response.data.predictions;
      
      // Do something with the predictions (e.g., log them or set in state)
      console.log(predictedValue);
      
      // Optionally, you could return the predictions to use them elsewhere in your app
      return predictedValue;
  
    } catch (error) {
      console.error('Error fetching prediction:', error);
    }
  };
  

  //for each city, store the call the fetchPredictions function and store like {city name:predictions}, just use for loop on the cities array

  const citiesPredictions={}
  for (const city in cities){
    citiesPredictions[city]=fetchPredictions(city);
  } */

  // Replace this with your actual cityData - this is just sample data
  

  /* for (const city in cityData){
    for (const fuel in cityData[city]){
        cityData[city][fuel][6]['production']=citiesPredictions[city][fuel]*100;
    }
  } */




  const fuelColors = {
    Coal: '#374151',
    Solar: '#FBBF24',
    Wind: '#10B981',
    Hydro: '#3B82F6',
  };

  const fuelIcons = {
    Coal: '🏭',
    Solar: '☀️',
    Wind: '💨',
    Hydro: '💧',
  };

  const getCityData = (city) => cityData[city] || cityData['pune'];

  const combinedData = getCityData(selectedCity).coal.map((item, index) => ({
    week: item.week,
    Coal: item.production,
    Solar: getCityData(selectedCity).solar[index].production,
    Wind: getCityData(selectedCity).wind[index].production,
    Hydro: getCityData(selectedCity).hydro[index].production,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 p-4 rounded-lg shadow-lg backdrop-blur-sm">
          <p className="text-slate-300 mb-2 font-medium">Week {label}</p>
          <div className="space-y-2">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-lg">{fuelIcons[entry.name]}</span>
                <p className="text-sm font-medium" style={{ color: entry.color }}>
                  {entry.name}: {entry.value.toLocaleString()} MWh
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className="text-2xl font-bold mt-2" style={{ color }}>
            {value}
          </p>
        </div>
        <Icon className="w-8 h-8 text-slate-600" />
      </div>
    </div>
  );

  const renderChart = () => {
    const chartData = selectedFuel === 'all' 
      ? combinedData 
      : getCityData(selectedCity)[selectedFuel.toLowerCase()].map(item => ({
          week: item.week,
          [selectedFuel]: item.production
        }));

    return (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 60, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.5} />
          <XAxis
            dataKey="week"
            label={{ value: 'Weeks from Current', position: 'bottom', fill: '#9CA3AF' }}
            tick={{ fill: '#9CA3AF' }}
          />
          <YAxis
            label={{
              value: 'Energy Production (MWh)',
              angle: -90,
              position: 'left',
              fill: '#9CA3AF',
            }}
            tick={{ fill: '#9CA3AF' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => (
              <span className="text-slate-300">
                {fuelIcons[value]} {value}
              </span>
            )}
          />
          {selectedFuel === 'all' ? (
            Object.keys(fuelColors).map((fuel) => (
              <Line
                key={fuel}
                type="monotone"
                dataKey={fuel}
                stroke={fuelColors[fuel]}
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: fuelColors[fuel] }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            ))
          ) : (
            <Line
              type="monotone"
              dataKey={selectedFuel}
              stroke={fuelColors[selectedFuel]}
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2, fill: fuelColors[selectedFuel] }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <TrendingUp className="w-8 h-8 text-blue-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">Energy Production Trends</h2>
              <p className="text-slate-400 mt-1">Monitoring energy output across major cities</p>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-[200px]">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white pl-10 p-2 rounded-lg appearance-none hover:border-blue-500 transition-colors"
              >
                {Object.entries(cities).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-2 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors"
            >
              <Info className="text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {showInfo && (
        <div className="bg-blue-900/20 border border-blue-800 text-blue-100 p-4 rounded-lg flex items-center gap-2">
          <Info className="h-4 w-4 text-blue-400" />
          <p>
            Track and analyze energy production patterns across different fuel types. Use the filters above to customize your view.
          </p>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Production"
          value={`${(
            combinedData[combinedData.length - 1]?.Coal +
            combinedData[combinedData.length - 1]?.Solar +
            combinedData[combinedData.length - 1]?.Wind +
            combinedData[combinedData.length - 1]?.Hydro || 0
          ).toLocaleString()} MWh`}
          icon={Building2}
          color="#60A5FA"
        />
        <StatCard 
          title="Top Fuel Source" 
          value="Hydro" 
          icon={TrendingUp} 
          color="#10B981" 
        />
        <StatCard 
          title="Time Period" 
          value="7 Weeks" 
          icon={Calendar} 
          color="#F59E0B" 
        />
        <StatCard
          title="Data Points"
          value={combinedData.length * 4}
          icon={Info}
          color="#8B5CF6"
        />
      </div>

      {/* Main Chart */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {cities[selectedCity]} Energy Production
            </h3>
            <p className="text-slate-400">Weekly energy production trends by fuel type</p>
          </div>
          <button
            onClick={() => console.log('Downloading CSV')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>

        {renderChart()}

        <div className="flex flex-wrap gap-4 mt-6">
          <button
            onClick={() => setSelectedFuel('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedFuel === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            All Fuels
          </button>
          {Object.entries(fuelColors).map(([fuel, color]) => (
            <button
              key={fuel}
              onClick={() => setSelectedFuel(fuel)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                selectedFuel === fuel
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <span>{fuelIcons[fuel]}</span>
              {fuel}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Graphing;