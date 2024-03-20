// import React from 'react';
import { useRef, useState } from "react";
import { checkValidData } from "../utils/validate.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../utils/firebase.js";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice.js';

const Login = () => {
  const [isSignInForm, setIsSignInForm] = useState(true);
  const[errorMessage, setErrorMessage] = useState("");
  const[isSignupSuccess, setIsSignupSuccess] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const name = useRef(null);
  const email = useRef(null);
  const password = useRef(null);
  const toggleSignInform = () => {
    setIsSignInForm(!isSignInForm);
  }
  
  const handleButtonClick = () => {
    const message = checkValidData(email.current.value, password.current.value);
    setErrorMessage(message);
    if (message) return;

    if (!isSignInForm) {
      // Sign Up Logic
      createUserWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      )
        .then((userCredential) => {
          const user = userCredential.user;
          updateProfile(user, {
            displayName: name.current.value,
          })
            .then(() => {
              console.log("Updated auth:", auth);
              const { uid, email, displayName } = auth.currentUser;
              dispatch(
                addUser([uid, email, displayName])
              );
            })
            .catch((error) => {
              setErrorMessage(error.message);
            });
        }).then(() => {
            setIsSignupSuccess(true);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErrorMessage(errorCode + "-" + errorMessage);
        });
        
    } else {
      signInWithEmailAndPassword(auth, email.current.value, password.current.value)
      .then((userCredential) => {
        const user = userCredential.user;
        navigate("/chat");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setErrorMessage(errorCode + " " + errorMessage);
      });
    }
  }

  return (
    <div>
      <div className='absolute'>
        <img className="fixed top-0 left-0 h-10 w-15 m-4"
          src="https://cdn.cookielaw.org/logos/ddb906c9-f57b-40fc-85a1-c8bcbc371b0d/1ce30484-b023-4ff1-a118-3a9dc53fce45/f83dd0bf-3d5c-47ca-b065-8f247adfeacd/rsz_slack_rgb.png"
          alt="logo">
        </img>
      </div>
      <form 
      onSubmit={(e) => e.preventDefault()} 
      className='absolute my-24 p-12 w-3/12 mx-auto right-0 left-0 text-black bg-opacity-80 border border-gray-300'
      >
        <h1 className='text-black py-4 font-bold text-3xl'>
          {isSignInForm? "Sign In": "Sign Up"}
        </h1>
        {!isSignInForm && (
          <input ref={name} type="text" placeholder='Full Name' className='p-4 my-4 w-full rounded-lg border border-gray-300'/>
        )}
        <input 
          ref={email} 
          type="text" 
          placeholder='Email or phone number' 
          className='p-4 my-4 w-full rounded-lg border border-gray-300'
        /> 
        <input 
          ref={password} 
          type='password' 
          placeholder='Password' 
          className='p-4 my-4 w-full rounded-lg border border-gray-300'
        />
        {!isSignInForm && isSignupSuccess && (
          <p className='text-green-800'>
            Signup successful. Login to continue
          </p>
        )}
        <p className='text-red-800'>
          {errorMessage}
        </p>
        <button 
          className="p-4 my-6 bg- w-full rounded-lg bg-violet-400" 
          onClick={handleButtonClick}
        >
        {isSignInForm? "Sign In": "Sign Up"}
        </button> 
        <p 
          className='hover:underline m-1 cursor-pointer inline' 
          onClick={toggleSignInform}
        >
          {isSignInForm? "New user? Sign up now": "Already registered. Sign In"}
        </p>
      </form>
    </div>
  );
};

export default Login;