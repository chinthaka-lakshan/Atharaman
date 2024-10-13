import "./AdminNavbar.css";
import SachinthaRashen_1 from '../../Assets/SachinthaRashen_1.jpg';

const AdminNavbar = () => {
  return (
    <div className="adminNavbar">
      <div className="adminNavbarContainer">
        <div className="items">
          <div className="item">
            <img src={SachinthaRashen_1} alt="" className="profileImg"/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;