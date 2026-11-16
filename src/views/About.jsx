import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './about.css';

const About = () => (
  <div className="about-page">
    <Navbar />
    <main>
      <section className="about-intro">
        <div className="about-copy">
          <p className="about-eyebrow">A better way to find your place</p>
          <h1>Space to make your own.</h1>
          <p className="about-lede">
            Real Space brings renters and property owners together with clear listings,
            useful details, and a simpler way to explore what is available.
          </p>
          <Link className="about-action" to="/properties">Explore properties <span aria-hidden="true">&rarr;</span></Link>
        </div>
        <img
          className="about-image"
          src="/imgs/cardImgs/card8.jpg"
          alt="A welcoming home surrounded by greenery"
        />
      </section>

      <section className="about-values" aria-labelledby="about-values-heading">
        <div className="about-section-heading">
          <p className="about-eyebrow">What matters here</p>
          <h2 id="about-values-heading">A more considered rental search.</h2>
        </div>
        <div className="about-value-list">
          <article>
            <span className="about-value-number">01</span>
            <h3>Clarity first</h3>
            <p>Browse practical listing details and photos to understand a place before you reach out.</p>
          </article>
          <article>
            <span className="about-value-number">02</span>
            <h3>Room to explore</h3>
            <p>Use property types, location, and home features to find options that fit your plans.</p>
          </article>
          <article>
            <span className="about-value-number">03</span>
            <h3>Built for both sides</h3>
            <p>Renters can discover a home, while owners can share their property with new audiences.</p>
          </article>
        </div>
      </section>
    </main>
  </div>
);

export default About;