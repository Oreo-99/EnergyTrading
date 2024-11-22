// src/constants/navlinks.js

import { CreateEnergyListing, dashboard, logout, payment, profile, withdraw, bar_chart } from '../assets';

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


export const cityData = {

  "pune": {
    "hydro": [
      { "week": -5, "production": 0.38 },
      { "week": -4, "production": 0.42 },
      { "week": -3, "production": 0.39 },
      { "week": -2, "production": 0.44 },
      { "week": -1, "production": 0.41 },
      { "week": 0, "production": 0.4 },
      { "week": 1, "production": 0.41 }
    ],
    "solar": [
      { "week": -5, "production": 1.25 },
      { "week": -4, "production": 1.28 },
      { "week": -3, "production": 1.26 },
      { "week": -2, "production": 1.3 },
      { "week": -1, "production": 1.34 },
      { "week": 0, "production": 1.32 },
      { "week": 1, "production": 1.32 }
    ],
    "wind": [
      { "week": -5, "production": 0.6 },
      { "week": -4, "production": 0.62 },
      { "week": -3, "production": 0.59 },
      { "week": -2, "production": 0.63 },
      { "week": -1, "production": 0.61 },
      { "week": 0, "production": 0.62 },
      { "week": 1, "production": 0.64 }
    ],
    "coal": [
      { "week": -5, "production": 1.3 },
      { "week": -4, "production": 1.34 },
      { "week": -3, "production": 1.28 },
      { "week": -2, "production": 1.35 },
      { "week": -1, "production": 1.31 },
      { "week": 0, "production": 1.33 },
      { "week": 1, "production": 1.37 }
    ]
  },


  "delhi": {
    "hydro": [
      { "week": -5, "production": 0.48 },
      { "week": -4, "production": 0.49 },
      { "week": -3, "production": 0.46 },
      { "week": -2, "production": 0.5 },
      { "week": -1, "production": 0.51 },
      { "week": 0, "production": 0.52 },
      { "week": 1, "production": 0.52 }
    ],
    "solar": [
      { "week": -5, "production": 1.32 },
      { "week": -4, "production": 1.35 },
      { "week": -3, "production": 1.33 },
      { "week": -2, "production": 1.36 },
      { "week": -1, "production": 1.38 },
      { "week": 0, "production": 1.39 },
      { "week": 1, "production": 1.4 }
    ],
    "wind": [
      { "week": -5, "production": 0.65 },
      { "week": -4, "production": 0.66 },
      { "week": -3, "production": 0.63 },
      { "week": -2, "production": 0.67 },
      { "week": -1, "production": 0.66 },
      { "week": 0, "production": 0.67 },
      { "week": 1, "production": 0.68 }
    ],
    "coal": [
      { "week": -5, "production": 1.28 },
      { "week": -4, "production": 1.29 },
      { "week": -3, "production": 1.25 },
      { "week": -2, "production": 1.3 },
      { "week": -1, "production": 1.31 },
      { "week": 0, "production": 1.31 },
      { "week": 1, "production": 1.32 }
    ]
  },


  "mumbai": {
    "hydro": [
      { "week": -5, "production": 0.44 },
      { "week": -4, "production": 0.47 },
      { "week": -3, "production": 0.45 },
      { "week": -2, "production": 0.48 },
      { "week": -1, "production": 0.44 },
      { "week": 0, "production": 0.45 },
      { "week": 1, "production": 0.46 }
    ],
    "solar": [
      { "week": -5, "production": 1.28 },
      { "week": -4, "production": 1.31 },
      { "week": -3, "production": 1.3 },
      { "week": -2, "production": 1.34 },
      { "week": -1, "production": 1.31 },
      { "week": 0, "production": 1.32 },
      { "week": 1, "production": 1.31 }
    ],
    "wind": [
      { "week": -5, "production": 0.65 },
      { "week": -4, "production": 0.66 },
      { "week": -3, "production": 0.64 },
      { "week": -2, "production": 0.67 },
      { "week": -1, "production": 0.65 },
      { "week": 0, "production": 0.66 },
      { "week": 1, "production": 0.68 }
    ],
    "coal": [
      { "week": -5, "production": 1.33 },
      { "week": -4, "production": 1.35 },
      { "week": -3, "production": 1.29 },
      { "week": -2, "production": 1.34 },
      { "week": -1, "production": 1.32 },
      { "week": 0, "production": 1.34 },
      { "week": 1, "production": 1.37 }
    ]
  },


  "new-york": {
    "hydro": [
      { "week": -5, "production": 0.56 },
      { "week": -4, "production": 0.58 },
      { "week": -3, "production": 0.54 },
      { "week": -2, "production": 0.59 },
      { "week": -1, "production": 0.57 },
      { "week": 0, "production": 0.59 },
      { "week": 1, "production": 0.6 }
    ],
    "solar": [
      { "week": -5, "production": 1.26 },
      { "week": -4, "production": 1.29 },
      { "week": -3, "production": 1.27 },
      { "week": -2, "production": 1.3 },
      { "week": -1, "production": 1.29 },
      { "week": 0, "production": 1.29 },
      { "week": 1, "production": 1.3 }
    ],
    "wind": [
      { "week": -5, "production": 0.62 },
      { "week": -4, "production": 0.63 },
      { "week": -3, "production": 0.61 },
      { "week": -2, "production": 0.65 },
      { "week": -1, "production": 0.63 },
      { "week": 0, "production": 0.64 },
      { "week": 1, "production": 0.64 }
    ],
    "coal": [
      { "week": -5, "production": 1.28 },
      { "week": -4, "production": 1.3 },
      { "week": -3, "production": 1.25 },
      { "week": -2, "production": 1.29 },
      { "week": -1, "production": 1.28 },
      { "week": 0, "production": 1.29 },
      { "week": 1, "production": 1.3 }
    ]
  }
}





