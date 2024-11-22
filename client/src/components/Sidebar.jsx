import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { logo, sun, logout } from '../assets'; // Added the logout icon
import { navlinks } from '../constants';
import { useStateContext } from '../context'; // Assuming you have a context for disconnecting

const Icon = ({ styles, name, imgUrl, isActive, disabled, handleClick, isHoverShadow }) => (
  <div
    className={`w-[48px] h-[48px] rounded-[10px] 
      ${isActive && isActive === name && 'bg-[#2c2f32]'} 
      flex justify-center items-center ${!disabled && 'cursor-pointer'} 
      ${styles} hover:bg-[#2c2f32] transition-colors duration-200 
      ${isHoverShadow && 'hover:shadow-secondary'}`} // Add hover shadow effect conditionally
    onClick={handleClick}
  >
    <img 
      src={imgUrl} 
      alt={name} 
      className={`w-1/2 h-1/2 ${isActive !== name ? 'grayscale' : ''}`} // Remove grayscale when active
    />
  </div>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState('dashboard');
  const { disconnectWallet } = useStateContext(); // Added for logout functionality

  const handleLogout = () => {
    disconnectWallet(); // Call the disconnect function
    navigate('/'); // Navigate to the home page or login page after logout
  };

  return (
    <div className="flex justify-between items-center flex-col sticky top-5 h-[93vh] z-50"> {/* Added z-50 */}
      {/* Logo */}
      <Link to="/">
        <Icon styles="w-[52px] h-[52px] bg-[#2c2f32]" imgUrl={logo} />
      </Link>

      {/* Sidebar Links */}
      <div className="flex-1 flex flex-col justify-between items-center bg-[#1c1c24] rounded-[20px] w-[76px] py-4 mt-12">
        <div className="flex flex-col justify-center items-center gap-3">
          {navlinks.map((link, index) => (
            <Icon
              key={link.name}
              {...link}
              isActive={isActive}
              isHoverShadow={index < 4} // Enable hover shadow for the first 4 icons
              handleClick={() => {
                if (!link.disabled) {
                  setIsActive(link.name);
                  navigate(link.link);
                }
              }}
            />
          ))}
        </div>

        {/* Logout and Theme Icons */}
        <div className="flex flex-col items-center gap-4">
          <Icon
            styles="bg-[#1c1c24] hover:bg-[#2c2f32] transition-colors duration-200"
            imgUrl={logout}
            name="Logout"
            handleClick={handleLogout}
          />
          <Icon
            styles="bg-[#1c1c24] hover:bg-[#2c2f32] transition-colors duration-200"
            imgUrl={sun}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
