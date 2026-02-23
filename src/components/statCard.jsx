import React from "react";

export default function StatCard({
  title,
  value,
  icon: Icon,
  className = "",
}) {
  return (
    
    <div
    className={`
        backdrop-blur-md
        text-white
        rounded-2xl
        px-6
        py-5
        flex
        items-center
        justify-between
        border border-white/20
        transition-all duration-300
        hover:border-white/40
        bg-white/[0.07]
        shadow-[0_4px_24px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]
        hover:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15)]
        ${className}
    `}
    >
      {/* Left Content */}
      <div>
        <p className="text-sm text-white/70">{title}</p>
        <h2 className="text-3xl font-bold mt-1">{value}</h2>
      </div>

      {/* Icon */}
      <div className="bg-white/10 p-3 rounded-xl">
        {Icon && <Icon size={28} className="text-white" />}
      </div>
    </div>
  );
}