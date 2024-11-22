import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../context';
import { money } from '../assets';
import { CustomButton, FormField, Loader } from '../components';
import { checkIfImage } from '../utils';
import { ethers } from 'ethers';

const CreateEnergyListing = () => {
  const navigate = useNavigate();
  const { createEnergyListing } = useStateContext(); // Ensure this function is defined in context
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    costPerUnit: '',
    energyAmount: '',
    fuelType: '',
    description: '',
    image: ''
  });

  const handleFormFieldChange = (fieldName, e) => {
    const value = e.target.value;

    // Prevent negative values for number inputs
    if (['costPerUnit', 'energyAmount'].includes(fieldName)) {
      if (value < 0) return;
    }

    setForm({ ...form, [fieldName]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate numerical fields are non-negative
    const { costPerUnit, energyAmount } = form;
    if (Number(costPerUnit) < 0 || Number(energyAmount) < 0) {
      alert('Please ensure all numerical values are non-negative.');
      return;
    }

    // Validate image URL
    checkIfImage(form.image, async (exists) => {
      if (exists) {
        setIsLoading(true);
        try {
          //convert 
          await createEnergyListing({
            name: form.name,
            costPerUnit: ethers.utils.parseUnits(form.costPerUnit, 18),// Keep as is (in ether)
            energyAmount: ethers.utils.parseUnits(form.energyAmount, 18), // Keep as is (in kWh)
            fuelType: form.fuelType,
            description: form.description,
            image: form.image
          });

          setIsLoading(false);
          navigate('/');
        } catch (error) {
          console.error('Error creating energy listing:', error);
          alert('Failed to create energy listing. Please try again.');
          setIsLoading(false);
        }
      } else {
        alert('Please provide a valid image URL for the company logo.');
        setForm({ ...form, image: '' });
      }
    });
  };

  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      {isLoading && <Loader />}
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">
          Create Energy Listing
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
        {/* Company Name and Cost per Unit */}
        <div className="flex flex-wrap gap-[40px]">
          <FormField 
            labelName="Company Name *"
            placeholder="Energy Corp"
            inputType="text"
            value={form.name}
            handleChange={(e) => handleFormFieldChange('name', e)}
          />
          <FormField 
            labelName="Cost per Energy Unit (ETH) *"
            placeholder="0.001"
            inputType="number"
            step="0.000001"
            min="0"
            value={form.costPerUnit}
            handleChange={(e) => handleFormFieldChange('costPerUnit', e)}
          />
        </div>

        {/* Energy Amount */}
        <div className="flex flex-wrap gap-[40px]">
          <FormField 
            labelName="Energy Amount (kWh) *"
            placeholder="1000"
            inputType="number"
            step="1"
            min="0"
            value={form.energyAmount}
            handleChange={(e) => handleFormFieldChange('energyAmount', e)}
          />
        </div>

        {/* Fuel Type Dropdown */}
        <div className="flex flex-col">
          <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#ffffff] mb-[10px]">Fuel Type *</span>
          <select
            required
            value={form.fuelType}
            onChange={(e) => handleFormFieldChange('fuelType', e)}
            className="py-[15px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
          >
            <option value="" disabled>Select fuel type</option>
            <option value="Solar">Solar</option>
            <option value="Wind">Wind</option>
            <option value="Hydro">Hydro</option>
            <option value="Biomass">Biomass</option>
            <option value="Geothermal">Geothermal</option>
            <option value="Fossil Fuel">Fossil Fuel</option> {/* Added Fossil Fuel */}
          </select>
        </div>

        {/* Description */}
        <FormField 
          labelName="Description *"
          placeholder="Describe your energy offering"
          isTextArea
          value={form.description}
          handleChange={(e) => handleFormFieldChange('description', e)}
        />

        {/* Company Logo Image */}
        <FormField 
          labelName="Company Logo URL *"
          placeholder="Provide a valid image URL"
          inputType="url"
          value={form.image}
          handleChange={(e) => handleFormFieldChange('image', e)}
        />

        {/* Informational Section */}
        <div className="w-full flex justify-start items-center p-4 bg-[#8c6dfd] h-[120px] rounded-[10px]">
          <img src={money} alt="money" className="w-[40px] h-[40px] object-contain"/>
          <h4 className="font-epilogue font-bold text-[25px] text-white ml-[20px]">
            You will receive 100% of the raised amount
          </h4>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center items-center mt-[40px]">
          <CustomButton 
            btnType="submit"
            title="Submit Energy Listing"
            styles="bg-[#1dc071]"
          />
        </div>
      </form>
    </div>
  );
};

export default CreateEnergyListing;
