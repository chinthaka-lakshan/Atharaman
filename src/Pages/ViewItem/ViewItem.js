// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import "./ViewItem.css";





// const ViewItem = () => {
//     const { id } = useParams(); // Get the item ID from the URL
//     const [item, setItem] = useState(null); // State to hold item details
//     const navigate = useNavigate();
//     const [reviews, setReviews] = useState([]);
//     const [myReview, setMyReview] = useState(null);
//     const userId = localStorage.getItem('userId');
    
    

//     useEffect(() => {
//         // Fetch the item details based on ID
//         const fetchItem = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:8080/item/find-by-id/${id}`);
//                 setItem(response.data);
//             } catch (error) {
//                 console.error("Error fetching item:", error);
//                 navigate("/404"); // Redirect to 404 if item not found
//             }
//         };

//         // Fetch reviews for the item
//         const fetchReviews = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:8080/itemReview/getItemReviewsByItemIdAndUserId?itemId=${id}&userId=${userId}`);
//                 setReviews(response.data);
//             } catch (error) {
//                 console.error("Error fetching reviews:", error);
//             }
//         };

//         // Trigger data fetching
//         fetchItem();
//         fetchReviews();
//     }, [id, navigate]);

//     useEffect(() => {
//         const userId = localStorage.getItem('userId'); // Get user ID again if needed
//         const userReview = reviews.find((review) => review.userId === userId);
//         setMyReview(userReview); // Set the user's review if available
//     }, [reviews]);


//     if (!item) return <p>Loading...</p>;


//     const renderStars = (rating) => {
//         const stars = [];
//         for (let i = 0; i < 5; i++) {
//             if (i < rating) {
//                 stars.push(<span key={i} className="star filled">★</span>); // filled star
//             } else {
//                 stars.push(<span key={i} className="star">☆</span>); // empty star
//             }
//         }
//         return stars;
//     };

//     return (
//         <div className="viewItem">
//             <div className="viewItemContainer">
//                 <div className="top">
//                     <img
//                         src={`data:image/jpeg;base64,${item.image}`} // Display Base64 image
//                         alt={item.name}
//                         className="itemImg"
//                     />
//                     <div className="right">
//                         <div className="details">
//                             <div className="itemTitle">
//                                 <span className="itemValue">{item.name}</span>
//                             </div>
//                             <div className="detailItem">
//                                 <span className="itemKey">Place:</span>
//                                 <span className="itemValue">{item.location}</span>
//                             </div>
//                             <div className="detailItem">
//                                 <span className="itemKey">Price:</span>
//                                 <span className="itemValue">${item.price}</span>
//                             </div>
//                             <div className="detailItem">
//                                 <span className="itemKey">Contact:</span>
//                                 <span className="itemValue">{item.contact}</span>
//                             </div>
                            
//                         </div>
//                         <Link to={`/itemViewShop/${item.shopId}`}>
//                             <button className="shopbutton" >View Shop</button>
//                         </Link>
//                     </div>
//                 </div>
//             </div>
//             {/* new add */}
//             <div className="reviews-container">
//                 <h2>All Item Reviews</h2> 
//                 <div>
//                 <Link to="/ItemReviewPage">
//                     <button className="view-more-button">Add Item Review</button>
//                 </Link>

//                 <div className="review-table">
//                  <table>
//                      <thead>
//                          <tr>
//                             <th>Rating</th>
//                             <th>Comment</th>
//                             <th>Photos</th>
//                             <th>View</th>
//                        </tr>
//                       </thead>
//                       <tbody>
//                         {reviews.length > 0 ? (
//                             reviews.map((review, index) => (
//                                 <tr key={index}>
//                                     <td>{renderStars(review.rating)}</td>
//                                     <td>{review.comment}</td>
//                                     <td>
//                                         {review.mainImage && (
//                                                 <img
//                                                     src={`http://localhost:8080/itemReview-image/${review.id}/${review.mainImage}`}
//                                                     alt="Main"
//                                                     className="reviewImage"
//                                                 />
//                                         )}
//                                     </td>
//                                     <td>
//                                         {myReview && myReview.id === review.id && (
//                                                 <button className="my-review">
//                                                     My Review
//                                                 </button>
//                                         )}
//                                     </td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan="4">No reviews submitted yet.</td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//             </div>
            
//         </div>                   
        
//     );
// };

// export default ViewItem;










import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./ViewItem.css";

const ViewItem = () => {
    const { id } = useParams(); // Get the item ID from the URL
    const [item, setItem] = useState(null); // State to hold item details
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [myReview, setMyReview] = useState(null);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        // Fetch the item details based on ID
        const fetchItem = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/item/find-by-id/${id}`);
                setItem(response.data);
            } catch (error) {
                console.error("Error fetching item:", error);
                navigate("/404"); // Redirect to 404 if item not found
            }
        };

        // Fetch reviews for the item
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/itemReview?itemId=${id}`);
                setReviews(response.data);

                // Find the user's review (if exists) from the fetched reviews
                const userReview = response.data.find((review) => review.userId === parseInt(userId));
                setMyReview(userReview);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        // Trigger data fetching
        fetchItem();
        fetchReviews();
    }, [id, navigate, userId]);

    if (!item) return <p>Loading...</p>;

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            if (i < rating) {
                stars.push(<span key={i} className="star filled">★</span>); // filled star
            } else {
                stars.push(<span key={i} className="star">☆</span>); // empty star
            }
        }
        return stars;
    };

    return (
        <div className="viewItem">
            <div className="viewItemContainer">
                <div className="top">
                    <img
                        src={`data:image/jpeg;base64,${item.image}`} // Display Base64 image
                        alt={item.name}
                        className="itemImg"
                    />
                    <div className="right">
                        <div className="details">
                            <div className="itemTitle">
                                <span className="itemValue">{item.name}</span>
                            </div>
                            <div className="detailItem">
                                <span className="itemKey">Place:</span>
                                <span className="itemValue">{item.location}</span>
                            </div>
                            <div className="detailItem">
                                <span className="itemKey">Price:</span>
                                <span className="itemValue">${item.price}</span>
                            </div>
                            <div className="detailItem">
                                <span className="itemKey">Contact:</span>
                                <span className="itemValue">{item.contact}</span>
                            </div>
                        </div>
                        <Link to={`/itemViewShop/${item.shopId}`}>
                            <button className="shopbutton">View Shop</button>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="reviews-container">
                <h2>All Item Reviews</h2>
                <Link to="/ItemReviewPage">
                    <button className="view-more-button">Add Item Review</button>
                </Link>
                <div className="review-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Rating</th>
                                <th>Comment</th>
                                <th>Photos</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.length > 0 ? (
                                reviews.map((review) => (
                                    <tr key={review.id}>
                                        <td>{renderStars(review.rating)}</td>
                                        <td>{review.comment}</td>
                                        <td>
                                            {review.mainImage && (
                                                <img
                                                    src={`http://localhost:8080/itemReview-image/${review.id}/${review.mainImage}`}
                                                    alt="Main"
                                                    className="reviewImage"
                                                />
                                            )}
                                        </td>
                                        <td>
                                            {myReview && myReview.id === review.id ? (
                                                <button className="my-review">My Review</button>
                                            ) : (
                                                <span>-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">No reviews submitted yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ViewItem;
