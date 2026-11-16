import React from "react";
import "./Login.css";
import { NavLink } from "react-router-dom";
import "./property.scss";

const baseurl = process.env.REACT_APP_BASE_URL;
const Property = ({ data }) => {
  return (
    <article className="property-card">
      <div className="mb-home__owner-prop__card card-shadow">
        <NavLink className="property-card-link" to={`/details?id=${data._id}`}>
          <div className="mb-home__owner-prop__card--graphic">
            <img
              className="swiper-lazy swiper-lazy-loaded"
              src={data?.photos?.[0] ? `${baseurl}/${data.photos[0]}` : "/imgs/cardImgs/card8.jpg"}
              alt={data.title}
              title={data.title}
            />
          </div>
          <div className="mb-home__owner-prop__card--content">
            <div className="mb-home__owner-prop__card--type">
              {data.title}
            </div>
            <div className="mb-home__owner-prop__card--price">
              <span className="rupees">₹</span>
              {data.price}
              <span className="mb-home__owner-prop__card--size">
                {data.Size} sqft
              </span>
            </div>
            <div className="mb-home__owner-prop__card--loc">
              {data?.location?.city}
            </div>
            <div className="mb-home__owner-prop__card--status">
              Ready to Move
            </div>
            <span className="property-card-details">View details <span aria-hidden="true">&rarr;</span></span>
          </div>
        </NavLink>
      </div>
    </article>
  );
};

export default Property;
