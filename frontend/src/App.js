import logo from './logo.svg';
import './App.css';
import { GoogleLogin } from '@react-oauth/google';
import actions from './api/index';
import React, { Component, Fragment, useState, useEffect } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import TheContext from './TheContext';
import Home from './components/home/Home';
import NotFound from './components/404/NotFound.js';
import SignUp from './components/auth/SignUp';
import LogIn from './components/auth/LogIn';
import Profile from './components/profile/Profile';
import {
  NotificationContainer,
  NotificationManager,
} from 'react-notifications';

const App = () => {
  let [user, setUser] = useState(null);

  useEffect(() => {
    async function getUser() {
      let user = await actions.getUser();
      console.log('user is', user);
      setUser(user?.data);
    }
    getUser();
  }, []);

  const logOut = async () => {
    let res = await actions.logOut();
    setUser(null);
  };

  // const history = useHistory();

  return (
    <TheContext.Provider value={{ user, setUser }}>
      {user?.email}
      <nav>
        <NavLink to='/'>Home</NavLink>

        {user ? (
          <Fragment>
            <NavLink onClick={logOut} to='/'>
              Log Out
            </NavLink>
            <NavLink to='/profile'>Profile</NavLink>
          </Fragment>
        ) : (
          <Fragment>
            <NavLink to='/sign-up'>Sign Up</NavLink>
            <NavLink to='/log-in'>Log In</NavLink>
          </Fragment>
        )}
      </nav>
      <Routes>
        <Route exact path='/' render={(props) => <Home {...props} />} />
        <Route
          exact
          path='/sign-up'
          render={(props) => <SignUp {...props} setUser={setUser} />}
        />
        <Route
          exact
          path='/log-in'
          render={(props) => <LogIn {...props} setUser={setUser} />}
        />
        <Route
          exact
          path='/profile'
          render={(props) => <Profile {...props} />}
        />

        <Route component={NotFound} />
      </Routes>
      {/* {!user && <GoogleAuth setUser={setUser} />}
      {!user && <GoogleAuthLogin setUser={setUser} />} */}
      {!user && (
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            console.log(credentialResponse);
            actions
              .signUp(credentialResponse)
              .then((user) => {
                console.log(user, ' -=-=--');
                {
                  setUser({ ...user?.data });
                }
              })
              .catch((response) => console.error(response));
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />
      )}

      <NotificationContainer />
    </TheContext.Provider>
  );
};

export default App;

{
  /* <GoogleLogin
          onSuccess={(credentialResponse) => {
            console.log(credentialResponse);
            actions
              .signUp(credentialResponse)
              .then((user) => {
                console.log(user, ' -=-=--');
                {
                   props.setUser({ ...user?.data });
                }
              })
              .catch((response) => console.error(response));
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        /> */
}
