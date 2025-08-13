import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState({ title: "", description: "" });

  // Fetch review details
  useEffect(() => {
    axios.get(`http://localhost:8080/review/${id}`)
      .then((response) => setReview(response.data))
      .catch((error) => console.error("Error fetching review:", error));
  }, [id]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:8080/review/${id}`, review)
      .then(() => {
        alert("Review updated successfully");
        navigate("/");
      })
      .catch((error) => console.error("Error updating review:", error));
  };

  return (
    <div>
      <h1>Edit Review</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            value={review.title}
            onChange={(e) => setReview({ ...review, title: e.target.value })}
            required
          />
        </label>
        <br />
        <label>
          Description:
          <textarea
            value={review.description}
            onChange={(e) => setReview({ ...review, description: e.target.value })}
            required
          ></textarea>
        </label>
        <br />
        <button type="submit">Update Review</button>
      </form>
    </div>
  );
};

export default EditReview;
