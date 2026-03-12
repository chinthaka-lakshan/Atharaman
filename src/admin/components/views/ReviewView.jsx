import React from 'react';

const ReviewView = ({ review, onClose }) => {
  if (!review) return null;

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500">User</h3>
          <p className="text-lg font-semibold">{review.username}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500">Rating</h3>
          <div className="flex items-center">
            <span className="text-2xl text-yellow-500">★</span>
            <span className="ml-2 text-xl font-bold">{review.rating}</span>
            <span className="ml-1 text-gray-500">/5</span>
          </div>
        </div>

        {review.relatedTo && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Related To</h3>
            <p className="text-lg font-semibold">{review.relatedTo.name}</p>
          </div>
        )}

        <div>
          <h3 className="text-sm font-medium text-gray-500">Date & Time</h3>
          <p className="text-lg font-semibold">{review.date} at {review.time}</p>
        </div>
      </div>

      {review.comment && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Comment</h3>
          <p className="text-gray-800 bg-gray-50 p-4 rounded-lg">{review.comment}</p>
        </div>
      )}

      {review.images && review.images.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Images ({review.images.length})</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {review.images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={`http://localhost:8000/storage/${image}`}
                  alt={`Review image ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ReviewView;