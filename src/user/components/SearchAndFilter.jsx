import React from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';

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
  const allOptionText = isLocationPage ? "All Location Types" : "All Locations";

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Search Input Box */}
        <div className="flex-1 relative group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
            <Search className="size-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all duration-300 font-medium text-gray-700 placeholder:text-gray-400"
          />
        </div>
        
        {/* Filter Select Box */}
        {(showLocationFilter || filterOptions.length > 0) && (
          <div className="relative min-w-[15rem] group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
              <Filter className="size-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
            </div>
            <select
              value={selectedLocation}
              onChange={(e) => onLocationChange(e.target.value)}
              className="w-full pl-14 pr-12 py-4 bg-gray-50/50 border border-gray-100 rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all duration-300 font-bold text-gray-700 appearance-none cursor-pointer"
            >
              <option value={isLocationPage ? "all" : "All Locations"}>
                {allOptionText}
              </option>
              {showLocationFilter ? (
                locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))
              ) : (
                filterOptions
                  .filter(option => option.value !== 'all')
                  .map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))
              )}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none">
              <ChevronDown className="size-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default SearchAndFilter;