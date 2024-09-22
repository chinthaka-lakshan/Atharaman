
import './App.css';
import AboutUs from './Components/AboutUs/AboutUs';
import Guides from './Components/Guides/Guides';
import Hero from './Components/Hero/Hero';
import Navbar from './Components/Navbar/Navbar';
import Places from './Components/Places/Places';
import Shops from './Components/Shops/Shops';
import Title from './Components/Title/Title';

function App() {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <div className='container'>
        <Title subTitle='Explore' title='Camping Locations'/>
        <Places/>
        <Title subTitle='Meet With' title='Expert Guides'/>
        <Guides/>
        <Title subTitle='Browse Through' title='Camping Gear Shops'/>
        <Shops/>
        <AboutUs/>
        
      </div>
      

    </div>
  );
}

export default App;
