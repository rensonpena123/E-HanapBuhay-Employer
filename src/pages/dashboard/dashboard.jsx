import React from 'react';


const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100 font-roboto">
    

      {/* The Right Side Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
      

        {/* The Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          
          <h1 className="text-3xl font-bold text-brand-dark mb-4">
            Dashboard Overview
          </h1>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <p className="text-gray-600">
              Welcome to the e-HanapBuhay admin panel! Your main content goes here.
            </p>
          </div>
          
        </main>
      </div>
      
    </div>
  );
};

export default Dashboard;