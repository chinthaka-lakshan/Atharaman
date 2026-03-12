import React from 'react';
import { Search, Filter } from 'lucide-react';

const SearchAndFilter = ({
  searchTerm,
  onSearchChange,
  selectedLocation,
  onLocationChange,
  filterOptions = [],
  placeholder = "Search...",
  showLocationFilter = false,
  locations = [],
  isLocationPage = false
}) => {
  // Determine the "All" option text based on page type
  const allOptionText = isLocationPage ? "All Location Types" : "All Locations";

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="size-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
            aria-label="Search input"
          />
        </div>
        
        {/* Conditional Filter - Location or Type */}
        {showLocationFilter ? (
          /* Location Filter */
          <div className="relative min-w-[12rem]">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Filter className="size-5 text-gray-400" />
            </div>
            <select
              value={selectedLocation}
              onChange={(e) => onLocationChange(e.target.value)}
              className="w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none bg-white transition-all duration-200"
              aria-label="Location filter"
            >
              <option value={isLocationPage ? "all" : "All Locations"}>
                {allOptionText}
              </option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        ) : (
          /* Type Filter */
          filterOptions.length > 0 && (
            <div className="relative min-w-[12rem]">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Filter className="size-5 text-gray-400" />
              </div>
              <select
                value={selectedLocation}
                onChange={(e) => onLocationChange(e.target.value)}
                className="w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none bg-white transition-all duration-200"
                aria-label="Type filter"
              >
                <option value="all">{allOptionText}</option>
                {filterOptions
                  .filter(option => option.value !== 'all') // Exclude the "all" option since we already added it
                  .map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SearchAndFilter;