import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../../Components/Navbar/Navbar";
import "./ViewItem.css";

const ViewItem = () => {
    const { id } = useParams(); // Get the item ID from the URL
    const [item, setItem] = useState(null); // State to hold item details
   // const [shopId, setShopId] = useState();
    //const [setShopDetails] = useState([]);
    const navigate = useNavigate();

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
            <Navbar />
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
                            
                            <div className="detailItem">
                                <span className="itemKey">Rating:</span>
                                <span className="itemValue">{item.rating || "N/A"} stars</span>
                            </div>
                        </div>
                        <Link to={`/ViewItemShop/${item.shopId}`}>
                            <button className="shopbutton" >View Shop</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewItem;
