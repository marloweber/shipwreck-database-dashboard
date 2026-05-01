'use client'

import { createShipwreck } from "@/lib/db";
import { createShipwreckFields } from "@/lib/fields";
import { useState } from 'react';
import { X } from "lucide-react";

export default function DataManager({ onClose }: { onClose: () => void }) {

const [submitError, setSubmitError] = useState(false);
const [submitSuccess, setSubmitSuccess] = useState(false);

function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  const form = e.currentTarget;
  const formData = new FormData(form);

  const hasValue = Array.from(formData.values()).some((value) => value.toString().trim() !== '');

  if (!hasValue) {
    setSubmitError(true);
    return;
  }
  setSubmitError(false);
  createShipwreck(formData);
  setSubmitSuccess(true);
  form.reset();
}

return (
  <div className="bg-white rounded-xl max-w-md w-full p-6 relative overflow-y-auto max-h-[75vh]">
    <div className="p-4">
    <button
      className="absolute top-4 right-6"
      onClick={onClose}
    >
      <X className="h-5 w-5 text-[#253f4b]" />
    </button>
    <h2 className="text-xl text-[#253f4b] mb-4">Add a shipwreck</h2>
        <form 
          onSubmit={handleSubmit}
          onChange={() => {
            setSubmitError(false)
            setSubmitSuccess(false)
          }} 
          className="flex flex-col space-y-4">
          {createShipwreckFields.map((field) => (
            <div key={field.name} className="flex flex-col">
              <label className="text-[#253f4b] mb-1">{field.placeholder}</label>
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                className="border border-[#253f4b] rounded px-4 py-2 text-[#253f4b] bg-transparent"
              />
            </div>
          ))}   
          <div className="flex flex-col items-center justify-center mt-4">
            {submitSuccess &&
                <div className="mb-4 text-green-600 text-md">
                Success!
              </div>
              }
            {submitError &&
                <div className="mb-4 text-red text-md">
                Fill out at least one field to submit
              </div>
              }
          <button type="submit" className='bg-blue-500 text-white rounded px-6 py-2'>
            Submit
          </button>
        </div> 
        </form>
      </div> 
    </div>
  );
}