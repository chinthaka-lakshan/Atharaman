import React, { useEffect, useSyncExternalStore, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./ItemShopView.css";
import ShoppingCartSharpIcon from '@mui/icons-material/ShoppingCartSharp';

const ItemShopView = () => {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/Shops/find-by-id/${id}`);
        setShop(response.data);
        setItems(response.data.itemList)
        console.log(response.data.itemList);
        
      } catch (error) {
        console.error("Error fetching shop:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [id]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="itemShopView">
      <div className="itemShopPlatter container">
        <div className="itemShopPlatter-text">
          <h1>{shop?.name}</h1>
          <p>{shop?.description}</p>
          <p>{shop?.location}</p>
          <p>{shop?.contact}</p>
        </div>
        <div className="shopImage">
          <ShoppingCartSharpIcon className="icon"/>
        </div>
      </div>

        <div className="items-grid">
          {items && items.length > 0 ? (
            items.map((item) => (
              <div key={item.id} className="item-card">
                <img
                  src={`data:image/jpeg;base64,${item.image}`} // Display Base64 image
                  alt={item.name}
                  className="item-image"
                />
                <h2 className="item-name">{item.name}</h2>
                <p className="item-description">{item.description}</p>
                <p className="item-price">${item.price}</p>
                <Link to={`/itemView/${item.id}`}>
                <button className="buy-now-button">Item Details</button>
                </Link>
              </div>
            ))
          ) : (
            <p>No items available in this shop.</p>
          )}
        </div>

    </div>
  );
};

export default ItemShopView;