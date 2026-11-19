import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';

const baseurl = process.env.REACT_APP_BASE_URL;

const Login = () => {
    const navigate = useNavigate();
    const [isSignUp, setIsSignUp] = useState(false);

    function loginHandler(e) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        axios({
            method: 'post',
            url: baseurl + '/login',
            data: formData,
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                console.log(res.data);
                alert('Login Successful');
                navigate('/');
            })
            .catch((err) => {
                console.log(err);
                alert(err?.response?.data?.error || 'Something Went Wrong');
            });
    }

    function signUpHandler(e) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        axios({
            method: 'post',
            url: baseurl + '/register',
            data: formData,
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                console.log(res.data);
                alert(res?.data?.message);
            })
            .catch((err) => {
                console.log(err);
                alert(err?.data?.message || 'Something went wrong');
            });
    }

    return (
        <div className="auth-page">
            <Navbar />
            <main className="auth-main">
                <div className="auth-layout">
                    <section className="auth-story" aria-label="Welcome to RealSpace">
                        <img className="auth-story-image" src="/imgs/bg.jpg" alt="" />
                        <Link className="auth-brand" to="/">RealSpace<span aria-hidden="true">⌂</span></Link>
                        <div className="auth-story-copy">
                            <p className="auth-eyebrow">For your next chapter</p>
                            <h1>Come home to <em>what’s next.</em></h1>
                            <p>Find a rental that feels right, or share a place for someone else to call home.</p>
                        </div>
                        <div className="auth-story-note">
                            <span aria-hidden="true">01</span>
                            <p>Explore at your pace.<br /><strong>Your next step starts here.</strong></p>
                        </div>
                    </section>

                    <section className="auth-card" aria-label="Account access">
                        <div className="auth-tabs" role="group" aria-label="Choose account action">
                            <button
                                id="sign-in-tab"
                                type="button"
                                aria-pressed={!isSignUp}
                                aria-controls="account-panel"
                                className={!isSignUp ? 'is-active' : ''}
                                onClick={() => setIsSignUp(false)}
                            >
                                Sign in
                            </button>
                            <button
                                id="sign-up-tab"
                                type="button"
                                aria-pressed={isSignUp}
                                aria-controls="account-panel"
                                className={isSignUp ? 'is-active' : ''}
                                onClick={() => setIsSignUp(true)}
                            >
                                Create account
                            </button>
                        </div>

                        <div
                            className="auth-form-content"
                            id="account-panel"
                            aria-live="polite"
                        >
                            <p className="auth-eyebrow">{isSignUp ? 'Join RealSpace' : 'Welcome back'}</p>
                            <h2>{isSignUp ? 'Create your account' : 'Sign in to your account'}</h2>
                            <p className="auth-form-description">
                                {isSignUp ? 'A few details and you’re ready to get started.' : 'Pick up where your home search left off.'}
                            </p>

                            {isSignUp ? (
                                <form onSubmit={signUpHandler} className="auth-form auth-sign-up-form" id="sign-up-form">
                                    <div className="auth-field-pair">
                                        <label className="auth-field">
                                            <span>First name</span>
                                            <input type="text" name="firstName" autoComplete="given-name" required />
                                        </label>
                                        <label className="auth-field">
                                            <span>Last name</span>
                                            <input type="text" name="lastName" autoComplete="family-name" required />
                                        </label>
                                    </div>
                                    <label className="auth-field">
                                        <span>Email address</span>
                                        <input type="email" name="email" autoComplete="email" required />
                                    </label>
                                    <label className="auth-field">
                                        <span>Mobile number</span>
                                        <input type="tel" name="mobile" autoComplete="tel" required />
                                    </label>
                                    <label className="auth-field">
                                        <span>Password</span>
                                        <input type="password" name="password" autoComplete="new-password" required />
                                    </label>
                                    <button type="submit" className="auth-submit">Create account <span aria-hidden="true">→</span></button>
                                </form>
                            ) : (
                                <form onSubmit={loginHandler} className="auth-form" id="login-form">
                                    <label className="auth-field">
                                        <span>Email address</span>
                                        <input type="email" name="email" autoComplete="email" required />
                                    </label>
                                    <label className="auth-field">
                                        <span>Password</span>
                                        <input type="password" name="password" autoComplete="current-password" required />
                                    </label>
                                    <button type="submit" className="auth-submit">Sign in <span aria-hidden="true">→</span></button>
                                </form>
                            )}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Login;
