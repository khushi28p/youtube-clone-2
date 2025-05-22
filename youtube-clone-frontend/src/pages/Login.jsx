import React, {useState} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            const response = await axios.post("http://localhost:5000/api/auth/login", {
                email,
                password,
            });

            setMessage(response.data.message);
            setError("");

            if(response.status === 200 && response.data.token){
                localStorage.setItem("token", response.data.token);
                alert("Successfully logged in!!");
                setEmail("");
                setPassword("");
                setLoading(false);
                setTimeout(() => {
                  navigate("/");
                }, 1000);
            }
        } catch(error){
            console.log("Login failed", error);
            if(error.response?.data?.errors){
              setError(error.response.dara.errors.map(err => err.msg).join(", "));
            } else{
              setError(error.response?.data?.message);
            }
            setLoading(false);
        }
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
        <button type="submit" className={`border px-4 py-1 my-6 rounded-md bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={loading}>{loading ? "Logging up..." : "Login"}</button>
      </form>
      {message && <p className="bg-green-200 text-green-900 px-8 py-2 rounded-lg mt-4 text-center">{message}</p>}
      {error && <p className="bg-red-200 text-red-900 px-8 py-2 rounded-lg mt-4 text-center">{error}</p>}
      <p>Don't have an account?<Link to="/signup" className='px-2'>Create account</Link></p>
    </div>
  )
}

export default Login
