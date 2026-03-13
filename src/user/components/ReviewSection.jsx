import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageSquare, PenLine, ChevronDown, ChevronUp, Image as ImageIcon, X, Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  getReviewsByEntity, 
  createReview, 
  updateReview, 
  deleteReview 
} from '../../services/api';
import { STORAGE_BASE_URL } from '../../config/runtimeConfig';

const ReviewSection = ({ entityType, entityId }) => {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [editingReview, setEditingReview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [entityType, entityId]);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const response = await getReviewsByEntity(entityType, entityId);
      setReviews(response.data || []);
      
      // If editing a review, set existing images
      if (editingReview) {
        const currentReview = response.data.find(review => review.id === editingReview.id);
        if (currentReview) {
          setExistingImages(currentReview.images || []);
        }
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please log in to submit a review.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Client-side validation for images
      for (let i = 0; i < newImages.length; i++) {
        const img = newImages[i];
        
        // Check file size (2MB limit)
        if (img.size > 2 * 1024 * 1024) {
          alert(`Image "${img.name}" is too large. Maximum size is 2MB.`);
          setIsSubmitting(false);
          return;
        }
        
        // Check file type
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
        if (!validTypes.includes(img.type)) {
          alert(`Image "${img.name}" has an invalid format. Please use JPEG, PNG, GIF, or WEBP.`);
          setIsSubmitting(false);
          return;
        }
      }

      const formData = new FormData();
      formData.append('entity_type', entityType);
      formData.append('entity_id', entityId);
      formData.append('rating', newReview.rating);
      formData.append('comment', newReview.comment);
      
      // Append new images using the same pattern as LocationForm
      newImages.forEach((img) => {
        formData.append('reviewImage[]', img);
      });

      const response = await createReview(formData);
      setReviews(prev => [response.data.review, ...prev]);
      setNewReview({ rating: 5, comment: '' });
      setNewImages([]);
      setIsFormVisible(false); // Hide form after submission
    } catch (error) {
      console.error('Error submitting review:', error);
      if (error.response?.status === 400) {
        alert('You have already reviewed this entity.');
      } else {
        alert('Failed to submit review. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setNewReview({ 
      rating: review.rating, 
      comment: review.comment 
    });
    setExistingImages(review.images || []);
    setImagesToRemove([]);
    setNewImages([]);
    setIsFormVisible(true); // Show form when editing
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();
    if (!editingReview) return;

    setIsSubmitting(true);
    
    try {
      // Client-side validation for new images
      for (let i = 0; i < newImages.length; i++) {
        const img = newImages[i];
        
        if (img.size > 2 * 1024 * 1024) {
          alert(`Image "${img.name}" is too large. Maximum size is 2MB.`);
          setIsSubmitting(false);
          return;
        }
        
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
        if (!validTypes.includes(img.type)) {
          alert(`Image "${img.name}" has an invalid format. Please use JPEG, PNG, GIF, or WEBP.`);
          setIsSubmitting(false);
          return;
        }
      }

      const formData = new FormData();
      formData.append('rating', newReview.rating);
      formData.append('comment', newReview.comment);
      formData.append('_method', 'PUT');
    
      // Append new images
      newImages.forEach((img) => {
        formData.append('reviewImage[]', img);
      });

      // Append images to remove
      if (imagesToRemove.length > 0) {
        imagesToRemove.forEach(imageId => {
          formData.append('removedImages[]', imageId);
        });
      }

      const response = await updateReview(editingReview.id, formData);
      
      setReviews(prev => prev.map(review => 
        review.id === editingReview.id 
          ? response.data.review 
          : review
      ));
      setEditingReview(null);
      setNewReview({ rating: 5, comment: '' });
      setNewImages([]);
      setExistingImages([]);
      setImagesToRemove([]);
    } catch (error) {
      console.error('Error updating review:', error);
      alert('Failed to update review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      await deleteReview(reviewId);
      setReviews(prev => prev.filter(review => review.id !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review. Please try again.');
    }
  };

  const handleImageChange = (e) => {
    if (!['location', 'hotel'].includes(entityType)) {
      alert('Images are only supported for locations and hotels');
      return;
    }

    const files = Array.from(e.target.files);

    const currentImageCount = existingImages.length - imagesToRemove.length;
    const totalAfterAdd = currentImageCount + newImages.length + files.length;
    
    if (totalAfterAdd > 5) {
      alert(`Maximum 5 images allowed. You currently have ${currentImageCount + newImages.length} images.`);
      return;
    }
    
    setNewImages(prev => [...prev, ...files]);
    e.target.value = ''; // Reset file input
  };

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageId) => {
    const image = existingImages.find(img => img.id === imageId);
    if (image) {
      setImagesToRemove(prev => [...prev, imageId]);
      setExistingImages(prev => prev.filter(img => img.id !== imageId));
    }
  };

  const restoreExistingImage = (imageId) => {
    setImagesToRemove(prev => prev.filter(id => id !== imageId));
    if (editingReview) {
      const originalImage = editingReview.images.find(img => img.id === imageId);
      if (originalImage) {
        setExistingImages(prev => [...prev, originalImage]);
      }
    }
  };

  const cancelEdit = () => {
    setEditingReview(null);
    setNewReview({ rating: 5, comment: '' });
    setNewImages([]);
    setExistingImages([]);
    setImagesToRemove([]);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span 
        key={i} 
        className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  // Calculate remaining image slots for editing
  const currentImageCount = existingImages.length - imagesToRemove.length;
  const totalImages = currentImageCount + newImages.length;
  const remainingSlots = Math.max(0, 5 - totalImages);

  const removedImages = editingReview ?
    (editingReview.images || []).filter(img => imagesToRemove.includes(img.id)) : [];

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  if (isLoading) {
    return <div className="mt-12 pt-8 border-t border-gray-200">Loading reviews...</div>;
  }

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">Guest Feedback</h3>
          {reviews.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex items-center px-3 py-1 bg-yellow-400/10 text-yellow-600 rounded-full font-bold text-sm">
                <Star className="w-4 h-4 mr-1 fill-current" />
                {averageRating}
              </div>
              <span className="text-gray-500 font-medium">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
            </div>
          )}
        </div>

        {isAuthenticated && (
          <button
            onClick={() => setIsFormVisible(!isFormVisible)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${
              isFormVisible 
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                : 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/25'
            }`}
          >
            {isFormVisible ? (
              <>
                <X className="w-5 h-5" />
                Cancel Review
              </>
            ) : (
              <>
                <PenLine className="w-5 h-5" />
                Write a Review
              </>
            )}
          </button>
        )}
      </div>

      <AnimatePresence>
        {isAuthenticated && isFormVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            className="overflow-hidden mb-12"
          >
            <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[2rem] shadow-2xl border border-white/50 relative overflow-hidden">
              {/* Decorative background for the form */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2 opacity-50" />
              
              <h4 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-xl text-orange-600">
                  {editingReview ? <PenLine className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
                </div>
                {editingReview ? 'Update Your Experience' : 'Share Your Experience'}
              </h4>

              <form onSubmit={editingReview ? handleUpdateReview : handleSubmitReview} className="space-y-8">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                    className={`text-2xl bg-transparent border-none cursor-pointer p-0 transition-colors ${
                      star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'
                    } hover:text-yellow-400`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment
              </label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Share your experience..."
                required
              />
            </div>

            {/* Image Upload Section - Only for locations and hotels */}
            {['location', 'hotel'].includes(entityType) && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Images {remainingSlots >= 0 && `(${remainingSlots} remaining)`}
                </label>
                
                {/* Removed Images Section (only in edit mode) */}
                {editingReview && removedImages.length > 0 && (
                  <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800 mb-2 font-medium">
                      {removedImages.length} image{removedImages.length !== 1 ? 's' : ''} marked for removal
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {removedImages.map((img) => (
                        <div key={img.id} className="relative h-32 border-2 border-dashed border-yellow-300 rounded-lg flex items-center justify-center opacity-60">
                          <img 
                            src={`${STORAGE_BASE_URL}/${img.image_path}`}
                            alt={img.alt_text || 'Review image'}
                            className="h-full w-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => restoreExistingImage(img.id)}
                            className="absolute top-1 right-1 bg-green-500 text-white rounded-full p-1 shadow-md hover:bg-green-600"
                            title="Restore image"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v0a8 8 0 01-8 8H3" />
                            </svg>
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 bg-yellow-500 text-white text-xs py-1 text-center">
                            Will be removed
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Existing Images (only in edit mode) */}
                {editingReview && existingImages.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Existing Images (click × to remove):</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {existingImages.map((img) => (
                        <div key={img.id} className="relative h-32 border border-gray-300 rounded-lg flex items-center justify-center group">
                          <img 
                            src={`${STORAGE_BASE_URL}/${img.image_path}`}
                            alt={img.alt_text || 'Review image'}
                            className="h-full w-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(img.id)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* New Image Uploads */}
                {(newImages.length > 0 || remainingSlots > 0) && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">New Images:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {newImages.map((img, index) => (
                        <div key={`new-${index}`} className="relative h-32 border-2 border-dashed border-green-300 rounded-lg flex items-center justify-center bg-green-50">
                          <img 
                            src={URL.createObjectURL(img)} 
                            alt={`New ${index}`}
                            className="h-full w-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeNewImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                          >
                            ×
                          </button>
                          <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                            New #{index + 1}
                          </div>
                          <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                            {Math.round(img.size / 1024)}KB
                          </div>
                        </div>
                      ))}
                      
                      {remainingSlots > 0 && (
                        <div className="h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                          <label htmlFor="fileInput" className="flex flex-col items-center cursor-pointer p-4 text-center w-full h-full justify-center">
                            <span className="text-2xl text-gray-400 mb-2">+</span>
                            <span className="text-sm text-gray-600">Add Images</span>
                            <span className="text-xs text-gray-500 mt-1">
                              {remainingSlots} slot{remainingSlots !== 1 ? 's' : ''} remaining
                            </span>
                          </label>
                          <input
                            type="file"
                            id="fileInput"
                            onChange={handleImageChange}
                            accept="image/*"
                            multiple
                            className="hidden"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="text-sm text-gray-500 space-y-1">
                  <p>• Maximum 5 images per review</p>
                  <p>• Currently using: {totalImages}/5 slots</p>
                  <p>• Supported formats: JPEG, JPG, PNG, GIF, WEBP</p>
                  <p>• Maximum file size: 2MB per image</p>
                  {remainingSlots <= 0 && (
                    <p className="text-orange-600 font-medium">Maximum 5 images reached.</p>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-orange-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20"
              >
                {isSubmitting ? 'Submitting...' : (editingReview ? 'Update Review' : 'Submit Review')}
              </button>
              {editingReview && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-gray-100 text-gray-600 px-8 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    )}
  </AnimatePresence>

      {!isAuthenticated && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-8">
          <p className="text-blue-800">Please log in to write a review.</p>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <img
                    src={review.user?.avatar || "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100"}
                    alt={review.user?.name || 'User'}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="font-semibold text-gray-900">{review.user?.name || 'Anonymous'}</h5>
                      <div className="flex">{renderStars(review.rating)}</div>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-2">{review.comment}</p>
                    
                    {review.images && review.images.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {review.images.map((image, index) => (
                          <img
                            key={index}
                            src={`${STORAGE_BASE_URL}/${image.image_path}`}
                            alt={image.alt_text || `Review image ${index + 1}`}
                            className="w-20 h-20 object-cover rounded"
                          />
                        ))}
                      </div>
                    )}
                    
                    <p className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                
                {user && (user.id === review.user_id || user.role === 'Admin') && (
                  <div className="flex gap-2">
                    {user.id === review.user_id && (
                      <button
                        onClick={() => handleEditReview(review)}
                        className="text-blue-600 text-sm underline hover:text-blue-800"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="text-red-600 text-sm underline hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;