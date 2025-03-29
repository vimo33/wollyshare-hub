
import React from 'react';
import { LocationSelectProps } from './types';
import { Controller } from 'react-hook-form';

const LocationSelect: React.FC<LocationSelectProps> = ({ value, onChange, className, control, defaultValue, name }) => {
  const locations = [
    { id: 'london', name: 'London' },
    { id: 'paris', name: 'Paris' },
    { id: 'new_york', name: 'New York' },
    { id: 'tokyo', name: 'Tokyo' },
    { id: 'sydney', name: 'Sydney' },
    { id: 'toronto', name: 'Toronto' },
    { id: 'berlin', name: 'Berlin' },
    { id: 'rome', name: 'Rome' },
    { id: 'madrid', name: 'Madrid' },
    { id: 'amsterdam', name: 'Amsterdam' },
  ];

  // If control is provided, use react-hook-form Controller
  if (control) {
    return (
      <Controller
        control={control}
        name={name || "location"}
        defaultValue={defaultValue || ""}
        render={({ field }) => (
          <select 
            className={className || "w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none"}
            {...field}
          >
            <option value="">Select a location</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        )}
      />
    );
  }

  // Otherwise use standard controlled component
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <select 
      className={className || "w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none"}
      value={value || ""}
      onChange={handleChange}
    >
      <option value="">Select a location</option>
      {locations.map((location) => (
        <option key={location.id} value={location.id}>
          {location.name}
        </option>
      ))}
    </select>
  );
};

export default LocationSelect;
