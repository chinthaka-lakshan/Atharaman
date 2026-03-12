import React, { useState, useEffect } from 'react';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import ReviewView from '../components/views/ReviewView';
import { 
  getReviews, 
  getWebsiteReviews, 
  deleteReview, 
  deleteWebsiteReview 
} from '../../services/api';

const reviewTypes = [
  { id: 'websitereview', label: 'Website', apiType: 'website' },
  { id: 'locationreview', label: 'Location', apiType: 'location' },
  { id: 'guidereview', label: 'Guide', apiType: 'guide' },
  { id: 'shopreview', label: 'Shop', apiType: 'shop' },
  { id: 'hotelreview', label: 'Hotel', apiType: 'hotel' },
  { id: 'vehiclereview', label: 'Vehicle', apiType: 'vehicle' }
];

const ManageReviews = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [activeType, setActiveType] = useState('websitereview');
  const [reviews, setReviews] = useState([]);
  const [websiteReviews, setWebsiteReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const fetchAllReviews = async () => {
    try {
      setLoading(true);
      const reviewsResponse = await getReviews();
      const websiteReviewsResponse = await getWebsiteReviews();
      
      setReviews(reviewsResponse.data);
      setWebsiteReviews(websiteReviewsResponse.data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredReviews = () => {
    if (activeType === 'websitereview') {
      return websiteReviews.map(review => ({
        ...review,
        type: 'websitereview',
        username: review.user?.name || 'Unknown User',
        relatedTo: null,
        images: []
      }));
    }

    const entityType = reviewTypes.find(t => t.id === activeType)?.apiType;
    return reviews
      .filter(review => review.entity_type === entityType)
      .map(review => ({
        ...review,
        type: `${entityType}review`,
        username: review.user?.name || 'Unknown User',
        relatedTo: { 
          id: review.entity_id, 
          name: `ID: ${review.entity_id}` 
        },
        images: review.images || []
      }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const columns = [
    { key: 'username', label: 'Username', sortable: true },
    { 
      key: 'rating', 
      label: 'Rating', 
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <span className="text-yellow-500">★</span>
          <span className="ml-1 font-medium">{value}</span>
        </div>
      )
    },
    ...(activeType !== 'websitereview' ? [{
      key: 'relatedTo',
      label: 'Related To',
      sortable: true,
      render: (value) => value?.name || 'N/A'
    }] : []),
    { 
      key: 'comment', 
      label: 'Comment', 
      sortable: false,
      render: (value) => (
        <div className="max-w-xs truncate" title={value}>
          {value || 'No comment'}
        </div>
      )
    },
    { 
      key: 'created_at', 
      label: 'Date', 
      sortable: true,
      render: (value) => formatDate(value)
    },
  ];

  const handleView = (review) => {
    setSelectedReview({
      ...review,
      date: formatDate(review.created_at),
      time: formatTime(review.created_at)
    });
    setShowModal(true);
  };

  const handleDelete = async (review) => {
    if (window.confirm(`Are you sure you want to delete this review?`)) {
      try {
        if (review.type === 'websitereview') {
          await deleteWebsiteReview(review.id);
          setWebsiteReviews(prev => prev.filter(r => r.id !== review.id));
        } else {
          await deleteReview(review.id);
          setReviews(prev => prev.filter(r => r.id !== review.id));
        }
        alert('Review deleted successfully!');
      } catch (err) {
        console.error('Error deleting review:', err);
        if (err.response?.status === 403) {
          alert('Permission denied. Only administrators can delete reviews.');
        } else {
          alert('Failed to delete review. Please try again.');
        }
      }
    }
  };

  const filteredReviews = getFilteredReviews();

  if (loading) {
    return (
      <div className="mt-16 flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-16 flex items-center justify-center min-h-64">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button
            onClick={fetchAllReviews}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reviews Management</h1>
          <p className="text-gray-600 mt-1">
            Manage all user reviews in the system ({filteredReviews.length} reviews)
          </p>

          {/* Review Type Filter */}
          <div className="flex space-x-2 mt-4 overflow-x-auto pb-2">
            {reviewTypes.map(type => (
              <button
                key={type.id}
                onClick={() => setActiveType(type.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  activeType === type.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type.label} Reviews ({type.id === 'websitereview' 
                  ? websiteReviews.length 
                  : reviews.filter(r => r.entity_type === type.apiType).length
                })
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredReviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">
            No {reviewTypes.find(t => t.id === activeType)?.label.toLowerCase()} reviews found.
          </p>
        </div>
      ) : (
        <DataTable
          data={filteredReviews}
          columns={columns}
          onView={handleView}
          onDelete={handleDelete}
          hideEdit={true}
        />
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Review Details"
        size="large"
      >
        {selectedReview && (
          <ReviewView 
            review={selectedReview}
            onClose={() => setShowModal(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default ManageReviews;