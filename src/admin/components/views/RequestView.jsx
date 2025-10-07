import React from 'react';
import { 
  Mail, Phone, MessageCircle, User, Calendar, MapPin, 
  Languages, FileText, Map, Shield, Clock 
} from 'lucide-react';

const RequestView = ({ request, onActionComplete }) => {
  if (!request) return null;

  // Helper function to format role name
  const formatRoleName = (roleName) => {
    return roleName.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Helper function to format field names for display
  const formatFieldName = (fieldName) => {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get icon for specific fields
  const getFieldIcon = (fieldName) => {
    const iconMap = {
      email: Mail,
      business_mail: Mail,
      phone: Phone,
      contact: Phone,
      number: Phone,
      contact_number: Phone,
      whatsapp: MessageCircle,
      whatsapp_number: MessageCircle,
      languages: Languages,
      locations: MapPin,
      description: FileText,
      short_description: FileText,
      long_description: FileText,
      nic: Shield,
      guide_nic: Shield,
      shop_owner_nic: Shield,
      hotel_owner_nic: Shield,
      vehicle_owner_nic: Shield,
      name: User,
      guide_name: User,
      shop_owner_name: User,
      hotel_owner_name: User,
      vehicle_owner_name: User,
      address: Map,
      guide_address: Map,
      shop_owner_address: Map,
      hotel_owner_address: Map,
      vehicle_owner_address: Map,
      dob: Calendar,
      guide_dob: Calendar,
      shop_owner_dob: Calendar,
      hotel_owner_dob: Calendar,
      vehicle_owner_dob: Calendar,
      gender: User,
      guide_gender: User
    };

    for (const key in iconMap) {
      if (fieldName.toLowerCase().includes(key)) {
        return iconMap[key];
      }
    }
    return FileText;
  };

  // Format field value for display - UPDATED
  const formatFieldValue = (key, value) => {
    // Handle empty arrays for languages and locations
    if ((key === 'languages' || key === 'locations') && Array.isArray(value)) {
      if (value.length === 0) {
        return <span className="text-gray-400 italic">Not provided</span>;
      }
      return (
        <div className="flex flex-wrap gap-1">
          {value.map((item, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
              {item}
            </span>
          ))}
        </div>
      );
    }

    // Handle regular arrays (excluding images)
    if (Array.isArray(value) && !key.includes('image')) {
      if (value.length === 0) {
        return <span className="text-gray-400 italic">Not provided</span>;
      }
      return (
        <div className="flex flex-wrap gap-1">
          {value.map((item, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
              {item}
            </span>
          ))}
        </div>
      );
    }

    // Handle date fields
    if (key.includes('_dob')) {
      try {
        return new Date(value).toLocaleDateString();
      } catch {
        return value || <span className="text-gray-400 italic">Not provided</span>;
      }
    }

    // Handle boolean values
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }

    // Handle empty values
    return value || <span className="text-gray-400 italic">Not provided</span>;
  };

  // Group fields by category for better organization - UPDATED TO EXCLUDE IMAGES
  const groupFields = (extraData) => {
    const groups = {
      personal: [],
      contact: [],
      business: [],
      other: []
    };

    Object.entries(extraData).forEach(([key, value]) => {
      // Skip image fields entirely
      if (key.includes('image')) {
        return;
      }

      if (key.includes('name') || key.includes('nic') || key.includes('dob') || key.includes('gender')) {
        groups.personal.push([key, value]);
      } else if (key.includes('mail') || key.includes('number') || key.includes('contact') || key.includes('whatsapp')) {
        groups.contact.push([key, value]);
      } else if (key.includes('address') || key.includes('location') || key.includes('description') || key.includes('language')) {
        groups.business.push([key, value]);
      } else {
        groups.other.push([key, value]);
      }
    });

    return groups;
  };

  // Check if guide images were provided
  const hasGuideImages = request.extra_data && 
    (
      (Array.isArray(request.extra_data.guide_images) && request.extra_data.guide_images.length > 0) ||
      (Array.isArray(request.extra_data.guide_images_processed) && request.extra_data.guide_images_processed.length > 0)
    );

  const fieldGroups = request.extra_data ? groupFields(request.extra_data) : null;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{request.user?.name}</h3>
            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                request.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                request.status === 'accepted' ? 'bg-green-100 text-green-800 border border-green-200' :
                'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {formatRoleName(request.role?.name)}
              </span>
              <span className="text-gray-500 text-sm flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {new Date(request.created_at).toLocaleDateString()} at {new Date(request.created_at).toLocaleTimeString()}
              </span>
            </div>
          </div>
          <div className="mt-3 sm:mt-0 text-right">
            <p className="text-sm text-gray-500">Request ID</p>
            <p className="text-lg font-mono font-bold text-gray-900">#{request.id}</p>
          </div>
        </div>
      </div>

      {/* Basic Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-500" />
            User Information
          </h4>
          <div className="space-y-4">
            <div className="flex items-start">
              <Mail className="w-4 h-4 mr-3 text-gray-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="text-gray-900 font-medium">{request.user?.email}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Shield className="w-4 h-4 mr-3 text-gray-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">User ID</p>
                <p className="text-gray-900 font-mono">{request.user?.id}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-green-500" />
            Request Timeline
          </h4>
          <div className="space-y-4">
            <div className="flex items-start">
              <Calendar className="w-4 h-4 mr-3 text-gray-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Submitted Date</p>
                <p className="text-gray-900 font-medium">{new Date(request.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Clock className="w-4 h-4 mr-3 text-gray-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Submitted Time</p>
                <p className="text-gray-900 font-medium">{new Date(request.created_at).toLocaleTimeString()}</p>
              </div>
            </div>
            {request.updated_at && request.updated_at !== request.created_at && (
              <div className="flex items-start">
                <Clock className="w-4 h-4 mr-3 text-gray-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="text-gray-900 font-medium">{new Date(request.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Information Notice */}
      {hasGuideImages && request.role?.name === 'guide' && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center">
            <FileText className="w-5 h-5 text-blue-600 mr-3" />
            <div>
              <p className="text-blue-800 font-medium">Guide Images Provided</p>
              <p className="text-blue-700 text-sm mt-1">
                This guide request includes profile images. Images will be properly processed upon approval.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Additional Information - Organized by Categories */}
      {fieldGroups && Object.values(fieldGroups).some(group => group.length > 0) && (
        <div className="space-y-6">
          {/* Personal Information */}
          {fieldGroups.personal.length > 0 && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-purple-500" />
                Personal Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fieldGroups.personal.map(([key, value]) => {
                  const IconComponent = getFieldIcon(key);
                  return (
                    <div key={key} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <IconComponent className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-500">
                          {formatFieldName(key)}
                        </p>
                        <div className="text-gray-900 break-words mt-1">
                          {formatFieldValue(key, value)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Contact Information */}
          {fieldGroups.contact.length > 0 && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Phone className="w-5 h-5 mr-2 text-green-500" />
                Contact Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fieldGroups.contact.map(([key, value]) => {
                  const IconComponent = getFieldIcon(key);
                  return (
                    <div key={key} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <IconComponent className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-500">
                          {formatFieldName(key)}
                        </p>
                        <div className="text-gray-900 break-words mt-1">
                          {formatFieldValue(key, value)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Business Information */}
          {fieldGroups.business.length > 0 && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-500" />
                Business Information
              </h4>
              <div className="grid grid-cols-1 gap-4">
                {fieldGroups.business.map(([key, value]) => {
                  const IconComponent = getFieldIcon(key);
                  return (
                    <div key={key} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <IconComponent className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-500">
                          {formatFieldName(key)}
                        </p>
                        <div className="text-gray-900 break-words mt-1">
                          {formatFieldValue(key, value)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Other Information */}
          {fieldGroups.other.length > 0 && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-gray-500" />
                Additional Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fieldGroups.other.map(([key, value]) => {
                  const IconComponent = getFieldIcon(key);
                  return (
                    <div key={key} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <IconComponent className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-500">
                          {formatFieldName(key)}
                        </p>
                        <div className="text-gray-900 break-words mt-1">
                          {formatFieldValue(key, value)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty state for no extra data */}
      {(!request.extra_data || Object.keys(request.extra_data).length === 0) && (
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <div className="flex items-center">
            <FileText className="w-5 h-5 text-yellow-600 mr-3" />
            <div>
              <p className="text-yellow-800 font-medium">No additional information provided</p>
              <p className="text-yellow-700 text-sm mt-1">
                This request was submitted without any additional form data.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestView;