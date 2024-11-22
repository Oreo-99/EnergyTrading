// src/constants/navlinks.js

import { CreateEnergyListing, dashboard, logout, payment, profile, withdraw,bar_chart } from '../assets';

export const navlinks = [
  {
    name: 'Dashboard',
    imgUrl: dashboard,
    link: '/', // Assuming '/' is your dashboard/home page
  },
  {
    name: 'Create Energy Listing',
    imgUrl: CreateEnergyListing,
    link: '/create-energy-listing',
  },
  {
    name: 'Payment',
    imgUrl: payment,
    link: '/payment', // Update the link if you plan to implement this feature
    
  },
/*   {
    name: 'Withdraw',
    imgUrl: withdraw,
    link: '/', // Update the link if you plan to implement this feature
    disabled: true, // Keep disabled if not yet implemented
  }, */
  {
    name: 'Profile',
    imgUrl: profile,
    link: '/profile',
  },
  {
    name: 'Graphing',
    imgUrl: bar_chart,
    link: '/graphing',
  },
/*   {
    name: 'Logout',
    imgUrl: logout,
    link: '/', // Update the link if you have a logout route
    disabled: true, // Typically, logout is an action, not a route. Consider handling it differently
  }, */
];

/**
 * Carbon footprint values for different energy sources (kg CO2e/kWh).
 * These values are used to calculate the environmental impact and savings.
 */
export const carbonFootprintPerKWh = {
  Solar: 0.041,
  Wind: 0.011,
  Hydro: 0.024,
  Biomass: 0.23,
  Geothermal: 0.121,
  "Fossil Fuel": 0.82, // Reference value for comparison
};