import './HomePage.css';
import AboutUs from '../../Components/AboutUs/AboutUs';
import Guides from '../../Components/Guides/Guides';
import Locations from '../../Components/Locations/Locations';
import Shops from '../../Components/Shops/Shops';
import Title from '../../Components/Title/Title';
import Footer from '../../Components/Footer/Footer';

function HomePage() {
  return (
    <div>
      <div className='homePlatter container'>
        <div className='homePlatter-text'>
          <h1>Camping Is All About Getting Lost In the Nature...</h1>
          <p>Welcome To ATHARAMAN! The One Stop Destination For All Your Camping Needs</p>
          <button className='btn'>Explore More</button>
        </div>
      </div>
      <div className='container'>
        <Title subTitle='Explore' title='Camping Locations' link='/locations' btn='All Locations'/>
        <Locations/>
        <Title subTitle='Meet With' title='Expert Guides' link='/guides' btn='All Guides'/>
        <Guides/>
        <Title subTitle='Browse Through' title='Camping Gears' link='/items' btn='All Items'/>
        <Shops/>
        <AboutUs/>
      </div>
      <Footer/>
    </div>
  );
}

export default HomePage;
