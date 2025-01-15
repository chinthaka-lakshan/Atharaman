import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./ItemView.css";

const ItemView = () => {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/item/find-by-id/${id}`);
                console.log(response.data.shopId);
                setItem(response.data);
            } catch (error) {
                console.error("Error fetching item details:", error);
                alert("Failed to fetch item details");
            }
        };

        fetchItem();
    }, [id, navigate]);

    if (!item) return <p>Loading...</p>;

    return (
        <div className="itemView">
            <div className="itemViewContainer">
                <img
                    src={`data:image/jpeg;base64,${item.image}`}
                    alt={item.name}
                    className="itemImg"
                />
                <div className="details">
                    <div className="itemTitle">
                        <span className="title">{item.name}</span>
                    </div>
                    <div className="detailItem">
                        <span className="itemKey">Description:</span>
                        <span className="itemValue">{item.description}</span>
                    </div>
                    <div className="detailItem">
                        <span className="itemKey">Location:</span>
                        <span className="itemValue">{item.location}</span>
                    </div>
                    <div className="detailItem">
                        <span className="itemKey">Contact No:</span>
                        <span className="itemValue">{item.contact}</span>
                    </div>
                    <div className="detailItem">
                        <span className="itemKey">Price:</span>
                        <span className="itemValue">LKR.{item.price}</span>
                    </div>
                </div>
                <Link to={`/itemShopView/${item.shopId}`}>
                    <button className="shopButton" >Go To Shop</button>
                </Link>
            </div>
        </div>
    );
};

export default ItemView;