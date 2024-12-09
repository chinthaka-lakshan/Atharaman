import React from 'react';
import './LocationView.css';
import Navbar from '../../Components/Navbar/Navbar';
import Narangala from '../../Assets/Narangala_1.jpg';

const LocationView = () => {

    return (
        <div>
            <Navbar/>
            <div className='locationPlatter container'>
                <div className='locationPlatter-text'>
                    <h1>Narangala</h1>
                    <p>Narangala Mountain is a 1,521-meter peak in the Uva Province with scenic views and diverse wildlife. Learn about its history, trails, and how to visit this remote and rugged place.</p>
                </div>
                <div className="photoGrid">
                    <img src={Narangala} alt="Main view" className="main-image"/>
                    <div className="side-images">
                        <img src={Narangala} alt="Gallery 1"/>
                        <img src={Narangala} alt="Gallery 2"/>
                        <img src={Narangala} alt="Gallery 3"/>
                        <img src={Narangala} alt="Gallery 4"/>
                    </div>
                </div>
            </div>
            <div className="locationDescription">
                <p>Narangala mountain is another popular mountain among climbers. It is situated 19.7 km away from the Badulla district in the Uva Province. Narangala Mountain is very popular among the climbers and it rises to over 1500 m (1527 m). There are two entrances to Narangala mountain, Keenakale side and Tangamale Devalaya side. The Keenakale side is generally very popular with climbers. The Narangala mountain with golden grass is known as the second highest peak in the Uva Province. It is second only to Namunukula mountain. Narangala mountain is also known as the "Golden Mountain" among Tamils. Because of its sharp rectangular peaks. From a distance it looks like a very attractive sight. As you climb Narangala Mountain, you can see the greenery scenes of these areas and the beauty of the surrounding hills. Narangala mountain is another popular mountain among climbers. It is situated 19.7 km away from the Badulla district in the Uva Province. Narangala Mountain is very popular among the climbers and it rises to over 1500 m (1527 m). There are two entrances to Narangala mountain, Keenakale side and Tangamale Devalaya side. The Keenakale side is generally very popular with climbers. The Narangala mountain with golden grass is known as the second highest peak in the Uva Province. It is second only to Namunukula mountain. Narangala mountain is also known as the "Golden Mountain" among Tamils. Because of its sharp rectangular peaks. From a distance it looks like a very attractive sight. As you climb Narangala Mountain, you can see the greenery scenes of these areas and the beauty of the surrounding hills. Narangala mountain is another popular mountain among climbers. It is situated 19.7 km away from the Badulla district in the Uva Province. Narangala Mountain is very popular among the climbers and it rises to over 1500 m (1527 m). There are two entrances to Narangala mountain, Keenakale side and Tangamale Devalaya side. The Keenakale side is generally very popular with climbers. The Narangala mountain with golden grass is known as the second highest peak in the Uva Province. It is second only to Namunukula mountain. Narangala mountain is also known as the "Golden Mountain" among Tamils. Because of its sharp rectangular peaks. From a distance it looks like a very attractive sight. As you climb Narangala Mountain, you can see the greenery scenes of these areas and the beauty of the surrounding hills.</p>
            </div>
        </div>
    )
}

export default LocationView