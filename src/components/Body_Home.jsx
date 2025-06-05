//npm install @react-google-maps/api , react google api package
import React, { useState } from "react";
import "../css/Body_Home.css";
import Body_Home_Map from './Body_Home_Map';

const Body_Home = () => {
  const slides = ["Slide 1", "Slide 2", "Slide 3", "Slide 4", "Slide 5"];
  const [currentIndex, setCurrentIndex] = useState(0);

  const slidesToShow = 1;
  const visibleSlides = slides.slice(currentIndex, currentIndex + slidesToShow);

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1 < slides.length ? prev + 1 : prev));
  };

  return (
    <div className="outer-container">
      <h2>Current Emergencies</h2>
      <div className="carousel-container">
        <div className="carousel-inner">
          <div className="location-box">Location: Seattle, WA</div>
          <div className="carousel">
            <button
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className="nav-button"
            >
              Prev
            </button>
            <div className="slide-container">
              {visibleSlides.map((slide, idx) => (
                <div key={idx} className="slide">
                  <div className="slide-number">{currentIndex + 1}</div>
                  {slide}
                </div>
              ))}
            </div>
            <button
              onClick={goToNext}
              disabled={currentIndex >= slides.length - slidesToShow}
              className="nav-button"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <Body_Home_Map address={"1900 Commerce St, Tacoma, WA 98402"}/>
    </div>
  );
};

export default Body_Home;