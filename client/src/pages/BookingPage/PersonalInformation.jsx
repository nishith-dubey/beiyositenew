// StepFour.jsx
import React, { useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
const StepFour = ({ updateBookingData, nextStep, prevStep,hostelType }) => {
  const { toast } = useToast();
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    gender: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleContinue = () => {
    const { firstName, lastName, mobileNumber, gender } = personalInfo;
    if (!firstName || !lastName || !mobileNumber || !gender) {
      toast({
        title: "Please fill in all personal information fields.",
      });
      return;
    }
console.log(hostelType)
    if(hostelType==="Boys"&&gender==="female"){
      toast({
        title: "No room available for girls",
      });
      return;
    }
    if(hostelType==="Girls"&&gender==="male"){
      toast({
        title: "No room available for boys",
      });
      return;
    }

    // Update booking data and proceed to next step
    updateBookingData({ firstName,lastName,mobileNumber,gender });
    nextStep();
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Personal Information</h3>
      <input
        type="text"
        name="firstName"
        value={personalInfo.firstName}
        onChange={handleChange}
        placeholder="First Name"
        className="border p-2 w-full mb-4"
      />
      <input
        type="text"
        name="lastName"
        value={personalInfo.lastName}
        onChange={handleChange}
        placeholder="Last Name"
        className="border p-2 w-full mb-4"
      />
      <input
        type="text"
        name="mobileNumber"
        value={personalInfo.mobileNumber}
        onChange={handleChange}
        placeholder="Mobile Number"
        className="border p-2 w-full mb-4"
      />
      <select
        name="gender"
        value={personalInfo.gender}
        onChange={handleChange}
        className="border p-2 w-full"
      >
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <div className="flex justify-between mt-4">
        <button onClick={prevStep} className="bg-gray-300 py-2 px-4 rounded">
          Previous
        </button>
        <button onClick={handleContinue} className="bg-black text-white py-2 px-4 rounded">
          Continue
        </button>
      </div>
      <Toaster className="left-[0%]" />
    </div>
  );
};

export default StepFour;
