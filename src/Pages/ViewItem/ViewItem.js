import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./ViewItem.css";





const ViewItem = () => {
    const { id } = useParams(); // Get the item ID from the URL
    const [item, setItem] = useState(null); // State to hold item details
   // const [shopId, setShopId] = useState();
    //const [setShopDetails] = useState([]);
    const navigate = useNavigate();

    
    const [reviews, setReviews] = useState([]);
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

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/item/find-by-id/${id}`);
                console.log(response.data.shopId);
                
                setItem(response.data);
               // setShopId(response.data.shopId);
            } catch (error) {
                console.error("Error fetching item:", error);
                navigate("/404"); // Redirect to 404 if item not found
            }
        };

        fetchItem();
    }, [id, navigate]);

    // const fetchShop =async()=>{
    //     try{
    //         const response =await axios.get(`http://localhost:8081/Shops/find-by-id/${shopId}`)
    //         setShopDetails(response.data);
    //     } catch (error){
    //         console.log(error);
    //     }
    // }
    if (!item) return <p>Loading...</p>;


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
                            <button className="shopbutton" >View Shop</button>
                        </Link>
                    </div>
                </div>
            </div>
            {/* new add */}
            <div className="reviews-container">
                <h2>Item Reviews</h2> 
                <div>
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
                            <th>View</th>
                       </tr>
                      </thead>
                      <tbody>
                        {reviews.length > 0 ? (
                            reviews.map((review, index) => (
                                <tr key={index}>
                                    <td>{review.rating}</td>
                                    <td>{review.comment}</td>
                                    <td>
                                        {review.mainImage && (
                                            <img
                                                src={`http://localhost/8080`}
                                                alt="Main"
                                                className="reviewImage"
                                            />
                                        )}
                                        {[review.extraImage1,review.extraImage2,review.extraImage3,review.extraImage4]
                                        .filter((img)=> img)
                                        .map((img, idx) => (
                                            <img
                                                key={idx}
                                                src={``}
                                                alt={`Extra ${idx+1}`}
                                                className="reviewImage"
                                            />
                                        ))}
                                           
                                    </td>
                                    <td>
                                        <button
                                            className="my-review"
                                        >
                                            My Review
                                        </button>
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
            
        </div>                   
        
    );
};

export default ViewItem;





