import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Building, Store, Car, Clock, CheckCircle } from 'lucide-react';

const RequestButtons = ({
  onRoleRequest,
  approvedRoles,
  pendingRequests
}) => {
  const roles = [
    { 
      id: 'guide', 
      label: 'Guide', 
      icon: Compass,
      description: 'Lead cinematic expeditions and share local expertise',
      color: 'from-emerald-500 to-teal-600',
      lightColor: 'bg-emerald-50',
      textColor: 'text-emerald-700'
    },
    { 
      id: 'shop_owner', 
      label: 'Shop Owner', 
      icon: Store,
      description: 'Showcase artisanal products and camping gear',
      color: 'from-rose-500 to-orange-600',
      lightColor: 'bg-rose-50',
      textColor: 'text-rose-700'
    },
    { 
      id: 'hotel_owner', 
      label: 'Hotel Owner', 
      icon: Building,
      description: 'Host travelers in exclusive accommodation',
      color: 'from-blue-500 to-indigo-600',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    { 
      id: 'vehicle_owner', 
      label: 'Vehicle Owner', 
      icon: Car,
      description: 'Provide rugged transport for adventure',
      color: 'from-amber-500 to-orange-600',
      lightColor: 'bg-amber-50',
      textColor: 'text-amber-700'
    }
  ];

  const getButtonState = (roleId) => {
    if (approvedRoles.includes(roleId)) return 'approved';
    if (pendingRequests.includes(roleId)) return 'pending';
    return 'available';
  };

  return (
    <div className="bg-white/40 backdrop-blur-xl rounded-[3rem] p-4 md:p-10 border border-white/50 shadow-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {roles.map((role) => {
          const state = getButtonState(role.id);
          const IconComponent = role.icon;

          return (
            <motion.div 
              key={role.id}
              whileHover={{ y: -8 }}
              className="flex flex-col h-full"
            >
              <div className="bg-white/60 backdrop-blur-md rounded-[2.5rem] p-8 flex-1 flex flex-col items-center text-center border border-white group relative overflow-hidden transition-all duration-500 hover:shadow-2xl">
                {/* Background Glow */}
                <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-700`} />
                
                <div className={`p-4 ${role.lightColor} rounded-[1.5rem] mb-6 shadow-sm`}>
                  <IconComponent className={`size-8 ${role.textColor}`} />
                </div>
                
                <h4 className="text-xl font-black text-gray-900 mb-3 tracking-tight">{role.label}</h4>
                <p className="text-gray-500 text-sm font-medium leading-relaxed mb-8 flex-1">
                  {role.description}
                </p>

                {state === 'approved' ? (
                  <div className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-emerald-50 text-emerald-600 rounded-2xl font-bold uppercase tracking-widest text-[10px] border border-emerald-100">
                    <CheckCircle className="size-4" />
                    Verified Partner
                  </div>
                ) : state === 'pending' ? (
                  <div className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-amber-50 text-amber-600 rounded-2xl font-bold uppercase tracking-widest text-[10px] border border-amber-100">
                    <Clock className="size-4 animate-spin-slow" />
                    Pending Review
                  </div>
                ) : (
                  <button
                    onClick={() => onRoleRequest(role.id)}
                    className={`w-full py-4 px-6 bg-gradient-to-r ${role.color} text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2`}
                  >
                    Launch Portfolio <Compass className="size-4" />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default RequestButtons;