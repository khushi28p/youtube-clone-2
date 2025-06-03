import React, {useState} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginFailure, loginStart, loginSuccess } from '../redux/userSlice';
import { auth, provider } from '../firebase';
import { signInWithPopup } from "firebase/auth"

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        dispatch(loginStart());
        try{
            const response = await axios.post("http://localhost:5000/api/auth/login", {
                email,
                password,
            });
            
            dispatch(loginSuccess(response.data))
            
              setTimeout(() => {
                navigate("/");
              }, 1000);
            
        } catch(error){
            dispatch(loginFailure());
        }
    }

    const signInWithGoogle = () => {
      dispatch(loginStart());
      signInWithPopup(auth, provider)
      .then((result) => {
        axios.post("http://localhost:5000/api/auth/google", {
          channelName: result.user.displayName,
          email: result.user.email,
          profilePicture: result.user.photoURL,
        })
        .then((res) => {
          dispatch(loginSuccess(res.data));
          setTimeout(() => {
                        navigate("/"); 
                    }, 1000);
        })
        .catch((error) =>{
          console.error("Backend Google Auth error:", error);
                    dispatch(loginFailure());
        })
      })
      .catch((error) => {
        console.error("Firebase Google sign-in error:", error);
                dispatch(loginFailure());
      })
    }

  return (
    <div className='flex flex-col items-center justify-center'>
      <h1 className="text-4xl font-bold py-10">Login</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <label htmlFor="email" className="flex flex-col">
          <span className="text-sm font-semibold">Email</span>
          <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border rounded-md px-2 py-1" />
        </label>
        <label htmlFor="password" className="flex flex-col">
          <span className="text-sm font-semibold">Password</span>
          <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border rounded-md px-2 py-1" />
        </label>
        <button type="submit" className='border px-4 py-1 my-6 rounded-md bg-blue-600'>Login</button>
        <p className='flex justify-center'>or</p>
        <button onClick={signInWithGoogle} className='border px-2 py-1 rounded-full mb-4'>Sign in with Google</button>
      </form>
      <p>Don't have an account?<Link to="/signup" className='px-2'>Create account</Link></p>
    </div>
  )
}

export default Login
