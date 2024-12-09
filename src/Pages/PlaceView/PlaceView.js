import React from 'react';
import './PlaceView.css';
import Navbar from '../../Components/Navbar/Navbar';
import Narangala from '../../Assets/Narangala_1.jpg';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Header />
      <MainImageGallery />
      <MapWeatherSection />
      <SiteInfo />
      <HostInfo />
      <Activities />
      <NaturalFeatures />
      
    </div>
  );
}

function Header() {
  return (
    <header className="header">
      <p>United States &gt; North Carolina</p>
      <h1>Starlight Hills</h1>
      <p className="location-info">98% · 965 reviews · Bostic, Rutherford, North Carolina</p>
      <div className="button-group">
        <button className="btn-select">Select a site</button>
        <button className="btn-share">Share</button>
        <button className="btn-save">Save</button>
      </div>
    </header>
  );
}

function MainImageGallery() {
  return (
    <section className="gallery">
      <img src={Narangala} alt="Main view" className="main-image" />
      <div className="side-images">
        <img src={Narangala} alt="Gallery 1" />
        <img src={Narangala} alt="Gallery 2" />
        <img src={Narangala} alt="Gallery 3" />
        <img src={Narangala} alt="Gallery 4" />
      </div>
    </section>
  );
}

function MapWeatherSection() {
  return (
    <section className="map-weather-section">
      <div className="map">
        <h3>Location Map</h3>
        <iframe
          title="map"
          src="https://www.google.com/maps/embed?pb=..."
          loading="lazy">
        </iframe>
      </div>
      <div className="weather">
        <h3>Weather Forecast</h3>
        <iframe
          title="weather"
          src="https://forecast7.com/en/n35d05n80d21/charlotte/?unit=us"
          loading="lazy">
        </iframe>
      </div>
    </section>
  );
}

function SiteInfo() {
  return (
    <section className="site-info">
      <h2>40 acres hosted by William G.</h2>
      <p>6 lodging sites · 9 RV/tent sites</p>
      <div className="highlights">
        <p>✔ Best in North Carolina: 1st place</p>
        <p>✔ Amazing views</p>
        <p>✔ Family-friendly</p>
        <p>✔ Best all-around: Finalist</p>
      </div>
      <p className="description">
        Our place is now available for booking! We are a constantly evolving location. Our goal is to provide a genuine secluded camping experience immersed in nature in a mountainous forest with privacy and well spaced out, secluded camp sites. We also have minimal light pollution, so our skies are beautiful for stargazing.
      </p>
    </section>
  );
}

function HostInfo() {
  return (
    <section className="host-info">
      <img src="host_image_url" alt="Host" className="host-image" />
      <p>Hosted by William G.</p>
    </section>
  );
}

function Activities() {
  return (
    <section className="activities">
      <h3>Activities</h3>
      <ul>
        <li>Biking</li>
        <li>Boating</li>
        <li>Hiking</li>
        <li>Off-roading (OHV)</li>
      </ul>
    </section>
  );
}

function NaturalFeatures() {
  return (
    <section className="natural-features">
      <h3>Natural Features</h3>
      <ul>
        <li>Forest</li>
        <li>River, stream, or creek</li>
        <li>Mountainous</li>
      </ul>
    </section>
  );
}

/*function TopGuides() {
  return (
    <section className="top-guides">
      <h3>Top Guides</h3>
      <div className="guide-tiles">
        {Array.from({ length: 6 }).map((_, index) => (
          <a href="#" key={index} className="guide-tile">
            <img src={guide_image_url_${index + 1}} alt={Guide ${index + 1}} />
            <p>Guide {index + 1}</p>
          </a>
        ))}
      </div>
    </section>
  );
}

function TopShops() {
  return (
    <section className="top-shops">
      <h3>Top Shops</h3>
      <div className="shop-tiles">
        {Array.from({ length: 6 }).map((_, index) => (
          <a href="#" key={index} className="shop-tile">
            <img src={store.png ${index + 1}} alt={Shop ${index + 1}} />
            <p>Shop {index + 1}</p>
          </a>
        ))}
      </div>
    </section>
  );
}*/

export default App;