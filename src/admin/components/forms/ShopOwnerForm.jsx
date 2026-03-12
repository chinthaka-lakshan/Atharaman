import React, { useState, useEffect, useCallback } from 'react';
import { Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { getUsers, checkNicAvailability } from '../../../services/api';

const ShopOwnerForm = ({ owner, onSave, onCancel, isEditing = false, submitting = false }) => {
  const [formData, setFormData] = useState({
    shop_owner_name: owner?.shop_owner_name || '',
    shop_owner_nic: owner?.shop_owner_nic || '',
    shop_owner_dob: owner?.shop_owner_dob || '',
    shop_owner_address: owner?.shop_owner_address || '',
    business_mail: owner?.business_mail || '',
    contact_number: owner?.contact_number || '',
    whatsapp_number: owner?.whatsapp_number || '',
    user_id: owner?.user_id || ''
  });

  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [nicValidation, setNicValidation] = useState({
    loading: false,
    available: null,
    message: ''
  });
  const [nicDebounceTimer, setNicDebounceTimer] = useState(null);

  useEffect(() => {
    if (!isEditing) {
      fetchUsers();
    }
  }, [isEditing]);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getUsers();

      if (Array.isArray(response.data)) {
        setAvailableUsers(response.data);
      } else {
        console.error('Unexpected API response structure:', response.data);
        setError('Unexpected data format from server');
        setAvailableUsers([]);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
      setAvailableUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Real-time NIC validation with debounce
  const validateNic = useCallback(async (nicValue) => {
    if (!nicValue || nicValue.length < 5) {
      setNicValidation({ loading: false, available: null, message: '' });
      return;
    }

    // Skip validation if it's the same NIC in edit mode
    if (isEditing && owner && nicValue === owner.shop_owner_nic) {
      setNicValidation({ loading: false, available: true, message: 'Current NIC' });
      return;
    }

    setNicValidation({ loading: true, available: null, message: 'Checking NIC availability...' });
    
    try {
      const response = await checkNicAvailability({
        nic: nicValue,
        role: 'shop_owner'
      });
      
      setNicValidation({
        loading: false,
        available: response.data.available,
        message: response.data.message
      });
    } catch (error) {
      setNicValidation({
        loading: false,
        available: false,
        message: error.response?.data?.message || 'Error validating NIC'
      });
    }
  }, [isEditing, owner]);

  // Debounced NIC validation
  useEffect(() => {
    const nicValue = formData.shop_owner_nic;
    
    if (nicDebounceTimer) {
      clearTimeout(nicDebounceTimer);
    }

    if (nicValue && nicValue.length >= 5) {
      const timer = setTimeout(() => {
        validateNic(nicValue);
      }, 800);
      
      setNicDebounceTimer(timer);
    } else {
      setNicValidation({ loading: false, available: null, message: '' });
    }

    return () => {
      if (nicDebounceTimer) {
        clearTimeout(nicDebounceTimer);
      }
    };
  }, [formData.shop_owner_nic, validateNic]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // NIC Validation Indicator Component
  const NicValidationIndicator = () => {
    const nicValue = formData.shop_owner_nic;
    
    if (!nicValue || nicValue.length < 5) {
      return (
        <p className="text-xs text-gray-500 mt-1">
          Enter NIC number to check availability
        </p>
      );
    }

    if (nicValidation.loading) {
      return (
        <div className="flex items-center space-x-1 mt-1">
          <Loader className="w-4 h-4 animate-spin text-blue-500" />
          <span className="text-xs text-blue-600">{nicValidation.message}</span>
        </div>
      );
    }

    if (nicValidation.available === false) {
      return (
        <div className="flex items-center space-x-1 mt-1">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span className="text-xs text-red-600">{nicValidation.message}</span>
        </div>
      );
    }

    if (nicValidation.available === true) {
      return (
        <div className="flex items-center space-x-1 mt-1">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-xs text-green-600">{nicValidation.message}</span>
        </div>
      );
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation before submission
    if (nicValidation.available === false) {
      alert('Please fix the NIC validation error before submitting.');
      return;
    }

    if (nicValidation.loading) {
      alert('Please wait for NIC validation to complete.');
      return;
    }

    setLoading(true);

    const formDataObj = new FormData();

    // Append all shop owner fields
    formDataObj.append('shop_owner_name', formData.shop_owner_name);
    formDataObj.append('shop_owner_nic', formData.shop_owner_nic);
    formDataObj.append('shop_owner_dob', formData.shop_owner_dob);
    formDataObj.append('shop_owner_address', formData.shop_owner_address);
    formDataObj.append('business_mail', formData.business_mail);
    formDataObj.append('contact_number', formData.contact_number);
    formDataObj.append('whatsapp_number', formData.whatsapp_number);

    if (!isEditing) {
      formDataObj.append('user_id', formData.user_id);
    }

    try {
      await onSave(formDataObj);
    } catch (error) {
      console.error('Error in form submission:', error);
      alert('Error saving shop owner: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shop Owner Name *
          </label>
          <input
            type="text"
            name="shop_owner_name"
            value={formData.shop_owner_name}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter shop owner name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            NIC *
          </label>
          <input
            type="text"
            name="shop_owner_nic"
            value={formData.shop_owner_nic}
            onChange={handleInputChange}
            required
            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
              nicValidation.available === false
                ? 'border-red-300 focus:ring-red-500'
                : nicValidation.available === true
                ? 'border-green-300 focus:ring-green-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Enter shop owner NIC"
          />
          <NicValidationIndicator />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth *
          </label>
          <input
            type="date"
            name="shop_owner_dob"
            value={formData.shop_owner_dob}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Email *
          </label>
          <input
            type="email"
            name="business_mail"
            value={formData.business_mail}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter email address"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address *
        </label>
        <textarea
          name="shop_owner_address"
          value={formData.shop_owner_address}
          onChange={handleInputChange}
          required
          rows="1"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter shop owner address"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Number *
          </label>
          <input
            type="tel"
            name="contact_number"
            value={formData.contact_number}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter contact number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            WhatsApp Number
          </label>
          <input
            type="tel"
            name="whatsapp_number"
            value={formData.whatsapp_number}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter WhatsApp number (optional)"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          User ID {isEditing ? '(Cannot be changed)' : '*'}
        </label>
        {isEditing ? (
          <div className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100">
            {formData.user_id}
          </div>
        ) : (
          <>
            {loading ? (
              <div className="text-gray-500 text-sm">Loading users...</div>
            ) : error ? (
              <div className="text-red-500 text-sm">{error}</div>
            ) : (
              <select
                name="user_id"
                value={formData.user_id}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select User</option>
                {Array.isArray(availableUsers) && availableUsers.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} (ID: {user.id})
                  </option>
                ))}
              </select>
            )}
          </>
        )}
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || submitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50 min-w-[80px]"
        >
          {submitting ? <Loader className="w-5 h-5 animate-spin" /> : (owner ? 'Update' : 'Create')}
        </button>
      </div>
    </form>
  );
};

export default ShopOwnerForm;