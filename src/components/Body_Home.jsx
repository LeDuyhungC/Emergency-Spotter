//npm install @react-google-maps/api , react google api package
import "../css/Body_Home.css";
import Body_Home_Map from './Body_Home_Map';

const Body_Home = () => {
  return (

      <Body_Home_Map address={"1900 Commerce St, Tacoma, WA 98402"}/>
  );
};

export default Body_Home;