import React, { useEffect, useSyncExternalStore, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./ViewItemShop.css";

const ViewItemShop = () => {
  const { id } = useParams();
  const [items,setItems]=useState([])
  const [shop, setShop] = useState(null); // State to hold shop data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/Shops/find-by-id/${id}`); // API call to fetch all shops
        setShop(response.data);
        setItems(response.data.itemList)
        console.log(response.data.itemList);
        
      } catch (error) {
        console.error("Error fetching shops:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [id]);

  if (loading) return <p>Loading...</p>;

  // return (
  //   <div className="shop-container">
  //     <h1 className="shop-title">{shop.name}</h1>
  //     <p className="shop-description">
  //     {shop.description}
  //     </p>
  //     <div className="items-grid">
  //       {shop.map((shop) => (
  //         <div key={shop.id} className="item-card">
  //           <img
  //             src={`data:image/jpeg;base64,${shop.image}`} // Assuming image is Base64-encoded
  //             alt={shop.name}
  //             className="item-image"
  //           />
  //           <h2 className="item-name">{shop.name}</h2>
  //           <p className="item-description">{shop.description}</p>
  //           <button className="buy-now-button">View Details</button>
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  // );


  // --------- work
  // return (
  //   <div className="shop-container">
  //     <h1 className="shop-title">{shop.name}</h1>
  //     <p className="shop-description">{shop.description}</p>
  //     <div className="items-grid">
  //       {shop.items && shop.items.length > 0 ? (
  //         shop.items.map((item) => (
  //           <div key={item.id} className="item-card">
  //             <img
  //               src={`data:image/jpeg;base64,${item.image}`} // Display Base64 image
  //               alt={item.name}
  //               className="item-image"
  //             />
  //             <h2 className="item-name">{item.name}</h2>
  //             <p className="item-description">{item.description}</p>
  //             <p className="item-price">${item.price}</p>
  //             <button className="buy-now-button">Buy Now</button>
  //           </div>
  //         ))
  //       ) : (
  //         <p>No items available in this shop.</p>
  //       )}
  //     </div>
  //   </div>
  // );

  //---------items card
  return (
    <div className="shop-container">
      <h1 className="shop-title">{shop?.name}</h1> {/* Optional chaining to avoid errors if shop is null */}
      <p className="shop-description">{shop?.description}</p>
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

export default ViewItemShop;