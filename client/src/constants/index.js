// src/constants/navlinks.js

import { CreateEnergyListing, dashboard, logout, payment, profile, withdraw } from '../assets';

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
  {
    name: 'Withdraw',
    imgUrl: withdraw,
    link: '/', // Update the link if you plan to implement this feature
    disabled: true, // Keep disabled if not yet implemented
  },
  {
    name: 'Profile',
    imgUrl: profile,
    link: '/profile',
  },
  {
    name: 'Logout',
    imgUrl: logout,
    link: '/', // Update the link if you have a logout route
    disabled: true, // Typically, logout is an action, not a route. Consider handling it differently
  },
];
