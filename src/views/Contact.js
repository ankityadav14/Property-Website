import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import './contact.css';

const Contact = () => {
  const [submittedName, setSubmittedName] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setSubmittedName(formData.get('name').trim());
    event.currentTarget.reset();
  };

  return (
    <div className="contact-page">
      <Navbar />
      <main className="contact-layout">
        <section className="contact-intro">
          <p className="contact-eyebrow">We’re here to help</p>
          <h1>Let’s talk about your next move.</h1>
          <p className="contact-lede">
            Have a question about finding a rental or listing your property? Send us a note.
          </p>
          <div className="contact-topics" aria-label="Topics we can help with">
            <div className="contact-topic">
              <span>01</span>
              <p><strong>Finding a home</strong><br />Questions about a rental or a listing.</p>
            </div>
            <div className="contact-topic">
              <span>02</span>
              <p><strong>Sharing a property</strong><br />Help with adding your place to Real Space.</p>
            </div>
          </div>
          <figure className="contact-photo">
            <img src="/imgs/cardImgs/card8.jpg" alt="A home listed on Real Space" />
            <figcaption>Tell us what you’re looking for.</figcaption>
          </figure>
        </section>

        <section className="contact-form-panel" aria-labelledby="contact-form-heading">
          <div className="contact-form-heading">
            <p className="contact-eyebrow">Get in touch</p>
            <h2 id="contact-form-heading">Send us a message</h2>
            <p>Share a few details and we’ll take it from there.</p>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-field-row">
              <div className="contact-field">
                <label htmlFor="contact-name">Your name</label>
                <input id="contact-name" name="name" type="text" autoComplete="name" required />
              </div>
              <div className="contact-field">
                <label htmlFor="contact-email">Email address</label>
                <input id="contact-email" name="email" type="email" autoComplete="email" required />
              </div>
            </div>

            <label htmlFor="contact-topic">What can we help with?</label>
            <select id="contact-topic" name="topic" defaultValue="">
              <option value="" disabled>Select a topic</option>
              <option value="renting">Finding a rental</option>
              <option value="listing">Listing a property</option>
              <option value="other">Something else</option>
            </select>

            <label htmlFor="contact-message">Message</label>
            <textarea id="contact-message" name="message" rows="5" required />

            <button type="submit">Send message <span aria-hidden="true">&rarr;</span></button>
          </form>
          {submittedName && (
            <p className="contact-feedback" role="status">
              Thanks, {submittedName}. This form is a frontend demo and is not connected to a message service yet.
            </p>
          )}
        </section>
      </main>
    </div>
  );
};

export default Contact;