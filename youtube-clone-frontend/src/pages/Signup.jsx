import React, { useState } from "react";
import axios from "axios";

const Signup = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            const response = await axios.post("http://localhost:5000/api/auth/signup", {
                username,
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
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold py-10">Signup</h1>
      <form className="flex flex-col gap-4" onClick={handleSubmit}>
        <label htmlFor="username" className="flex flex-col">
          <span className="text-sm font-semibold">Username</span>
          <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} className="border rounded-md px-2 py-1" />
        </label>
        <label htmlFor="email" className="flex flex-col">
          <span className="text-sm font-semibold">Email</span>
          <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border rounded-md px-2 py-1" />
        </label>
        <label htmlFor="password" className="flex flex-col">
          <span className="text-sm font-semibold">Password</span>
          <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border rounded-md px-2 py-1" />
        </label>
      </form>
      <button type="submit" onClick={handleSubmit} className="border px-4 py-1 my-6 rounded-md bg-blue-600">Signup</button>
    </div>
  );
};

export default Signup;
