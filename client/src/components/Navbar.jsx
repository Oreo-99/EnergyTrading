import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import { useStateContext } from '../context';
import { CustomButton } from './';
import { logo, menu, search, thirdweb } from '../assets';
import { navlinks } from '../constants';

const Navbar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState('dashboard');
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const { connectWallet, address } = useStateContext();

  return (
    <div className="flex md:flex-row flex-col-reverse justify-between mb-[35px] gap-6">
      {/* Title moved to left */}
      <div className="flex items-center">
        <h1 className="font-epilogue text-[50px] font-bold leading-[40px] ">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5689e8] to-[#e735c3]">
            EnergyChain
          </span>
        </h1>
      </div>

      {/* Search and buttons container */}
      <div className="flex items-center gap-4">
        {/* Search bar */}
        <div className="flex flex-row w-[300px] h-[45px] bg-[#1c1c24] rounded-[100px]">
          <input 
            type="text" 
            placeholder="Search for listings" 
            className="flex w-full font-epilogue font-normal text-[14px] placeholder:text-[#4b5264] text-white bg-transparent outline-none px-4" 
          />
          <div className="w-[45px] h-full rounded-[20px] bg-[#4acd8d] flex justify-center items-center cursor-pointer">
            <img src={search} alt="search" className="w-[15px] h-[15px] object-contain" />
          </div>
        </div>

        {/* Connect/Create button and profile */}
        <div className="sm:flex hidden flex-row items-center gap-4">
          <CustomButton
            btnType="button"
            title={address ? 'Create listing' : 'Connect'}
            styles={`${address ? 'bg-[#1dc071]' : 'bg-[#8c6dfd]'} h-[45px] px-4 text-[14px]`}
            handleClick={() => {
              if (address) navigate('create-energy-listing')
              else connectWallet()
            }}
          />

          <Link to="/profile">
            <div className="w-[45px] h-[45px] rounded-full bg-[#2c2f32] flex justify-center items-center cursor-pointer">
              <img src={thirdweb} alt="user" className="w-[60%] h-[60%] object-contain" />
            </div>
          </Link>
        </div>
      </div>

      {/* Small screen navigation */}
      <div className="sm:hidden flex justify-between items-center relative">
        <div className="w-[40px] h-[40px] rounded-[10px] bg-[#2c2f32] flex justify-center items-center cursor-pointer">
          <img src={logo} alt="user" className="w-[60%] h-[60%] object-contain" />
        </div>

        <img
          src={menu}
          alt="menu"
          className="w-[34px] h-[34px] object-contain cursor-pointer"
          onClick={() => setToggleDrawer((prev) => !prev)}
        />

        <div className={`absolute top-[60px] right-0 left-0 bg-[#1c1c24] z-10 shadow-secondary py-4 ${!toggleDrawer ? '-translate-y-[100vh]' : 'translate-y-0'} transition-all duration-700`}>
          <ul className="mb-4">
            {navlinks.map((link) => (
              <li
                key={link.name}
                className={`flex p-4 ${isActive === link.name && 'bg-[#3a3a43]'}`}
                onClick={() => {
                  setIsActive(link.name);
                  setToggleDrawer(false);
                  navigate(link.link);
                }}
              >
                <img
                  src={link.imgUrl}
                  alt={link.name}
                  className={`w-[24px] h-[24px] object-contain ${isActive === link.name ? 'grayscale-0' : 'grayscale'}`}
                />
                <p className={`ml-[20px] font-epilogue font-semibold text-[14px] ${isActive === link.name ? 'text-[#1dc071]' : 'text-[#808191]'}`}>
                  {link.name}
                </p>
              </li>
            ))}
          </ul>

          <div className="flex mx-4">
            <CustomButton
              btnType="button"
              title={address ? 'Create listing' : 'Connect'}
              styles={`${address ? 'bg-[#1dc071]' : 'bg-[#8c6dfd]'} w-full h-[45px] text-[14px]`}
              handleClick={() => {
                if (address) navigate('create-energy-listing')
                else connectWallet();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar;