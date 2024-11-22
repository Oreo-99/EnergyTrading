import React from 'react';
import {
  tagType, thirdweb,
  biomass_energy,
  fossil_fuel,
  geothermal,
  solar_energy,
  water_energy,
  windmill
} from '../assets';

const fuelTypeIcons = {
  'Biomass': biomass_energy,
  'Fossil Fuel': fossil_fuel,
  'Geothermal': geothermal,
  'Solar': solar_energy,
  'Hydro': water_energy,
  'Wind': windmill
};

const FundCard = ({ fuelType, name, owner, title, description, amountSold, energyAmount, amountCollected, image, handleClick }) => {
  return (
    <div
      className="sm:w-[288px] w-full rounded-[15px] bg-[#1c1c24] cursor-pointer"
      onClick={handleClick}
    >
      {/* Image */}
      <img
        src={image}
        alt="fund"
        className="w-full h-[158px] object-cover rounded-[15px] sm:h-[200px] md:h-[250px]"
      />

      <div className="flex flex-col p-4">
        {/* Name and Fuel Type Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-[18px]">
          <h3 className="font-epilogue font-semibold text-[16px] text-white leading-[26px] truncate sm:w-2/3">
            {name}
          </h3>
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <p className="font-epilogue font-medium text-[12px] text-[#808191]">{fuelType}</p>
            <img
              src={fuelTypeIcons[fuelType]}
              alt="fuel type icon"
              className="w-[17px] h-[17px] object-contain"
              style={{
                filter:
                  'brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg) brightness(118%) contrast(100%)',
              }}
            />
          </div>
        </div>

        {/* Description */}
        <div className="block">
          <p className="mt-[5px] font-epilogue font-normal text-[#808191] leading-[18px] truncate sm:text-[14px] md:text-[16px]">
            {description}
          </p>
        </div>

        {/* Energy Details */}
        <div className="flex flex-col sm:flex-row justify-between flex-wrap mt-[15px] gap-2">
          <div className="flex flex-col">
            <h4 className="font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px] sm:text-[16px] md:text-[18px]">
              {amountCollected}
            </h4>
            <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[140px] truncate">
              Energy Available {energyAmount - amountSold}
            </p>
          </div>
        </div>

        {/* Owner Info */}
        <div className="flex items-center mt-[20px] gap-[12px]">
          <div className="w-[30px] h-[30px] rounded-full flex justify-center items-center bg-[#13131a] sm:w-[40px] sm:h-[40px]">
            <img
              src={thirdweb}
              alt="user"
              className="w-1/2 h-1/2 object-contain"
            />
          </div>
          <p className="flex-1 font-epilogue font-normal text-[10px] text-[#808191] truncate sm:text-[14px] md:text-[16px]">
            by <span className="text-[#b2b3bd]">{owner}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FundCard;
