import React, {useState} from 'react';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            const response = await axios.post("http://localhost:5000/api/auth/login", {
                email,
                password,
            });
            console.log(response.data.message);
            if(response.status === 201){
                alert("Signup successful");
            }
        } catch(error){
            console.log("Signup failed", error);
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
        <button type="submit" className="border px-4 py-1 my-6 rounded-md bg-blue-600">Login</button>
      </form>
    </div>
  )
}

export default Login
