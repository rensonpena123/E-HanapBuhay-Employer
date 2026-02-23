import React from "react";
import StatCard from "../../components/statCard.jsx"; 
import FilterBar from "../../components/filters/filterBar.jsx"; 
import FilterItem from "../../components/filters/filterItem.jsx";
import { Briefcase, XCircle, Clock, BookMarked } from "lucide-react";

const ApplicationManagement = () => {

  const inputClass = "w-full h-full bg-brand-dark border border-gray-400 rounded-lg px-4 text-white placeholder-gray-400 focus:outline-none focus:border-brand-yellow transition-colors text-sm";

  return (
    <section className="flex justify-center p-6">
      {/* Container for the column layout */}
      <div className="w-full max-w-7xl flex flex-col gap-6">
        
        {/* SECTION 1: Header & Stats  */}
        <div className="bg-brand-dark rounded-3xl p-7 shadow-xl">
          <h1 className="text-3xl font-bold text-white mb-8">
            Application Management
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="New Applicants"
              value="248"
              icon={Briefcase}
            />
            <StatCard
              title="Shortlisted"
              value="142"
              icon={XCircle}
            />
            <StatCard
              title="Pending"
              value="38"
              icon={Clock}
            />
            <StatCard
              title="Total Hired"
              value="15"
              icon={BookMarked}
            />
          </div>
        </div>

        {/* SECTION 2: Filter Section  */}
          <FilterBar onClear={() => console.log("Filters cleared")}>
            
            {/* Date Range Filter */}
            <FilterItem label="Range Date">
              <div className="flex items-center gap-3 h-full">
                <input 
                  type="date" 
                  className={`${inputClass} w-40 uppercase`} 
                />
                <span className="text-brand-yellow font-bold text-sm">To</span>
                <input 
                  type="date" 
                  className={`${inputClass} w-40 uppercase`} 
                />
              </div>
            </FilterItem>

            {/* Skills Filter */}
            <FilterItem label="Skills">
              <div className="w-64 h-full">
                <select className={inputClass}>
                  <option value="">Any</option>
                  <option value="react">React</option>
                  <option value="node">Node.js</option>
                  <option value="design">UI Design</option>
                </select>
              </div>
            </FilterItem>

            {/* Experience Filter */}
            <FilterItem label="Experience">
              <div className="w-64 h-full">
                <select className={inputClass}>
                  <option value="">Any</option>
                  <option value="1-2">1-2 Years</option>
                  <option value="3-5">3-5 Years</option>
                  <option value="5+">5+ Years</option>
                </select>
              </div>
            </FilterItem>

          </FilterBar>
        </div>
    </section>
  );
};

export default ApplicationManagement;