import React from 'react';
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
      description: 'Lead camping expeditions and share your expertise',
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700'
    },
    { 
      id: 'shop_owner', 
      label: 'Shop Owner', 
      icon: Store,
      description: 'Sell camping gear and outdoor equipment',
      color: 'from-red-500 to-red-600',
      hoverColor: 'hover:from-red-600 hover:to-red-700'
    },
    { 
      id: 'hotel_owner', 
      label: 'Hotel Owner', 
      icon: Building,
      description: 'List and manage your accommodation properties',
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700'
    },
    { 
      id: 'vehicle_owner', 
      label: 'Vehicle Owner', 
      icon: Car,
      description: 'Rent out vehicles for camping adventures',
      color: 'from-orange-500 to-orange-600',
      hoverColor: 'hover:from-orange-600 hover:to-orange-700'
    }
  ];

  const getButtonState = (roleId) => {
    if (approvedRoles.includes(roleId)) return 'approved';
    if (pendingRequests.includes(roleId)) return 'pending';
    return 'available';
  };

  const getButtonContent = (role) => {
    const state = getButtonState(role.id);
    const IconComponent = role.icon;

    switch (state) {
      case 'approved':
        return (
          <>
            <CheckCircle className="size-5 mr-2" />
            Approved as {role.label}
          </>
        );
      case 'pending':
        return (
          <>
            <Clock className="size-5 mr-2 animate-spin" />
            Request Pending
          </>
        );
      default:
        return (
          <>
            <IconComponent className="size-5 mr-2" />
            Request as {role.label}
          </>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Available Roles</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {roles.map((role) => {
          const state = getButtonState(role.id);
          const IconComponent = role.icon;

          return (
            <div key={role.id} className="group">
              <div className="bg-gray-50 rounded-xl p-4 mb-3 group-hover:bg-gray-100 transition-colors duration-200">
                <div className={`size-12 bg-gradient-to-br ${role.color} rounded-lg flex items-center justify-center mb-3 mx-auto`}>
                  <IconComponent className="size-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800 text-center">{role.label}</h4>
                <p className="text-sm text-gray-600 text-center mt-1">{role.description}</p>
              </div>
              
              <button
                onClick={() => onRoleRequest(role.id)}
                disabled={state !== 'available'}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center text-sm ${
                  state === 'approved'
                    ? 'bg-green-100 text-green-700 cursor-default'
                    : state === 'pending'
                    ? 'bg-yellow-100 text-yellow-700 cursor-default'
                    : `bg-gradient-to-r ${role.color} ${role.hoverColor} text-white hover:shadow-lg transform hover:scale-105`
                }`}
                aria-label={`Request ${role.label} role`}
              >
                {getButtonContent(role)}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RequestButtons;