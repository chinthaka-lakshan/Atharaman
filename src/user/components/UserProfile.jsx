import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Mail, Phone, Shield, Calendar } from 'lucide-react';
import RequestButtons from './RequestButtons';
import GuideProfile from './profiles/GuideProfile';
import HotelOwnerProfile from './profiles/HotelOwnerProfile';
import ShopOwnerProfile from './profiles/ShopOwnerProfile';
import VehicleOwnerProfile from './profiles/VehicleOwnerProfile';
import RoleRequestForm from './RoleRequestForm';
import { getProfile, requestRole, getRoleRequests } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const UserProfile = () => {
  const [profile, setProfile] = useState({
    userData: {
      id: null,
      name: "",
      email: "",
      joinDate: "",
      avatar: ""
    },
    approvedRoles: [],
    pendingRequests: []
  });

  const [expandedSections, setExpandedSections] = useState({
    guide: false,
    shopOwner: false,
    hotelOwner: false,
    vehicleOwner: false
  });
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const profileResponse = await getProfile();
      const userData = profileResponse.data;
      const requestsResponse = await getRoleRequests();
      const roleRequests = requestsResponse.data;

      const approvedRoles = userData.roles ? userData.roles.map(role => role.name) : [];
      const pendingRequests = roleRequests
        .filter(request => request.status === 'pending')
        .map(request => request.role.name);
      
      setProfile({
        userData: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          joinDate: new Date(userData.created_at).getFullYear().toString(),
          avatar: userData.avatar || "/default-user.png"
        },
        approvedRoles,
        pendingRequests
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleRequestClick = (roleId) => {
    setSelectedRole(roleId);
    setShowRequestForm(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      
      const roleMap = {
        'guide': 1,
        'shop_owner': 2,
        'hotel_owner': 3,
        'vehicle_owner': 4
      };

      const backendRoleId = roleMap[selectedRole];
      if (!backendRoleId) throw new Error(`Unknown role: ${selectedRole}`);

      const requestData = {
        role_id: backendRoleId,
        extra_data: prepareExtraData(selectedRole, formData)
      };

      await requestRole(requestData);
      setShowRequestForm(false);
      setSelectedRole(null);
      fetchUserData();
    } catch (error) {
      console.error('Error submitting role request:', error);
      alert(`Failed to request role: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const processGuideImages = (images) => {
    return images.map(image => image);
  };

  const prepareExtraData = (role, formData) => {
    switch (role) {
      case 'guide':
        return {
          guide_name: formData.guide_name,
          guide_nic: formData.guide_nic,
          guide_dob: formData.guide_dob,
          guide_gender: formData.guide_gender,
          guide_address: formData.guide_address,
          business_mail: formData.business_mail,
          contact_number: formData.contact_number,
          whatsapp_number: formData.whatsapp_number,
          short_description: formData.short_description,
          long_description: formData.long_description,
          languages: formData.languages,
          locations: formData.locations,
          guide_images: processGuideImages(formData.guide_images || [])
        };
      case 'hotel_owner':
      case 'shop_owner':
      case 'vehicle_owner':
        const prefix = role.replace('_owner', '');
        return {
          [`${role}_name`]: formData[`${role}_name`],
          [`${role}_nic`]: formData[`${role}_nic`],
          [`${role}_dob`]: formData[`${role}_dob`],
          [`${role}_address`]: formData[`${role}_address`],
          business_mail: formData.business_mail,
          contact_number: formData.contact_number,
          whatsapp_number: formData.whatsapp_number,
          ...(role === 'vehicle_owner' && { locations: formData.locations })
        };
      default:
        return formData;
    }
  };

  const handleFormCancel = () => {
    setShowRequestForm(false);
    setSelectedRole(null);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (loading) {
     return (
       <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
         <div className="relative w-20 h-20">
           <div className="absolute inset-0 border-4 border-emerald-100 rounded-full"></div>
           <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
         </div>
         <p className="text-emerald-600 font-bold animate-pulse uppercase tracking-widest text-sm">Synchronizing Profile...</p>
       </div>
     );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden pb-32">
      {/* Decorative Background Elements */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-emerald-50/50 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl -z-10 translate-y-1/2 -translate-x-1/2" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-50/20 rounded-full blur-3xl -z-10" />

      {/* Global Pattern Overlay */}
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{ 
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")',
          backgroundRepeat: 'repeat'
        }}
      ></div>

      {/* Cinematic Header Background (Full Width) */}
      <div className="relative h-[40vh] min-h-[300px] w-screen left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-48">
        {/* Main Profile Info Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-2xl p-8 md:p-12 rounded-[3.5rem] shadow-2xl border border-white/50 mb-16"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
            {/* Avatar with luxury ring */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-500 to-blue-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative w-48 h-48 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-gray-100">
                <img
                  src={profile.userData.avatar}
                  alt={profile.userData.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </div>

            {/* User Info Content */}
            <div className="flex-1 text-center md:text-left space-y-6">
              <div>
                <motion.span 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="px-4 py-1.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-4 inline-block shadow-sm"
                >
                  Authentic Explorer
                </motion.span>
                <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight mb-2">
                  {profile.userData.name}
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-6 text-gray-500 font-medium">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-emerald-500" />
                    <span>{profile.userData.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <span>Explorer since {profile.userData.joinDate}</span>
                  </div>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                 <div className="px-6 py-4 bg-gray-50/50 backdrop-blur-lg border border-gray-100 rounded-3xl text-center min-w-[120px]">
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Roles</p>
                    <p className="text-2xl font-black text-emerald-600">{profile.approvedRoles.length}</p>
                 </div>
                 <div className="px-6 py-4 bg-gray-50/50 backdrop-blur-lg border border-gray-100 rounded-3xl text-center min-w-[120px]">
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Actions</p>
                    <p className="text-2xl font-black text-blue-600">{profile.pendingRequests.length} Pending</p>
                 </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Sections */}
        <div className="space-y-24">
          {/* Become a Partner Section */}
          <section>
            <div className="flex items-center gap-4 mb-10">
              <div className="p-4 bg-emerald-100 rounded-2xl text-emerald-600">
                <Shield className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-4xl font-black text-gray-900 tracking-tight">Expand Your Horizons</h2>
                <p className="text-gray-500 font-medium">Join our verified community of service providers</p>
              </div>
            </div>
            
            <RequestButtons
              onRoleRequest={handleRoleRequestClick}
              approvedRoles={profile.approvedRoles}
              pendingRequests={profile.pendingRequests}
            />
          </section>

          {/* Managed Portfolios Section */}
          {(profile.approvedRoles.length > 0) && (
            <section className="space-y-12">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-blue-100 rounded-2xl text-blue-600">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-gray-900 tracking-tight">Active Portfolios</h2>
                  <p className="text-gray-500 font-medium">Manage your verified business entities</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8">
                {profile.approvedRoles.includes('guide') && (
                  <GuideProfile
                    isExpanded={expandedSections.guide}
                    onToggleExpand={() => toggleSection('guide')}
                    userId={profile.userData.id}
                  />
                )}

                {profile.approvedRoles.includes('shop_owner') && (
                  <ShopOwnerProfile
                    isExpanded={expandedSections.shopOwner}
                    onToggleExpand={() => toggleSection('shopOwner')}
                    userId={profile.userData.id}
                  />
                )}

                {profile.approvedRoles.includes('hotel_owner') && (
                  <HotelOwnerProfile
                    isExpanded={expandedSections.hotelOwner}
                    onToggleExpand={() => toggleSection('hotelOwner')}
                    userId={profile.userData.id}
                  />
                )}

                {profile.approvedRoles.includes('vehicle_owner') && (
                  <VehicleOwnerProfile
                    isExpanded={expandedSections.vehicleOwner}
                    onToggleExpand={() => toggleSection('vehicleOwner')}
                    userId={profile.userData.id}
                  />
                )}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Role Request Form Modal */}
      {showRequestForm && (
        <RoleRequestForm
          role={selectedRole}
          userData={profile.userData}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default UserProfile;