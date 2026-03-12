import React from 'react';
import { Mail, Phone, User, MapPin, Calendar, IdCardIcon } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa6';

const ShopOwnerView = ({ owner }) => {
  if (!owner) return <div>No shop owner data available</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-6">
        <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
          <User className="w-16 h-16 text-gray-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{owner.shop_owner_name}</h3>
          <div className="flex items-center text-sm text-gray-500 mb-1">
            <User className="w-4 h-4 mr-1" />
            <span>User ID: {owner.user_id}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <IdCardIcon className="w-4 h-4 mr-1" />
            <span>NIC: {owner.shop_owner_nic}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h4>
          <div className="space-y-3">
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-3 text-gray-400" />
              <span className="text-gray-700">{owner.business_mail}</span>
            </div>
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-3 text-gray-400" />
              <span className="text-gray-700">{owner.contact_number}</span>
            </div>
            {owner.whatsapp_number && (
              <div className="flex items-center">
                <FaWhatsapp className="w-4 h-4 mr-3 text-gray-400" />
                <span className="text-gray-700">{owner.whatsapp_number}</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Personal Details</h4>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500 flex items-start">
                <Calendar className="w-4 h-4 mr-1 mt-1 flex-shrink-0" />
                Date of Birth:
              </span>
              <p className="text-gray-900">{new Date(owner.shop_owner_dob).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500 flex items-start">
                <MapPin className="w-4 h-4 mr-1 mt-1 flex-shrink-0" />
                Address:
              </span>
              <p className="text-gray-900 mt-1">{owner.shop_owner_address}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopOwnerView;