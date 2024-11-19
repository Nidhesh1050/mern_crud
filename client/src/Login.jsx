import React, { useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

function Login (){

    const [email, setEmail] = useState()
    const [name, setName] = useState()
    const navigate = useNavigate();

    const Submit = (e) =>{
        e.preventDefault();
        axios.post("http://localhost:3001/login", {email,  name})
        .then(result => {
            console.log(result)
            navigate('/user')
        })
        .catch(err => console.log(err))
    }

    return(
        <div className="d-flex vh-100 bg-primary justify-content-center align-item-center">
            <div className="w-50 bg-white rounded p-3">
               <form onSubmit={Submit}>
                <h2>Login User</h2>
                <div className="mb-2">
                    <label htmlFor="">Name</label>
                    <input type="text" placeholder="Enter Name" className="form-control"
                    onChange={(e) => setName(e.target.value)}/>
                </div>
                <div className="mb-2">
                    <label htmlFor="">Email</label>
                    <input type="text" placeholder="Enter Emal" className="form-control"
                    onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <button className="btn btn-success">Submit</button>
               </form>
            </div>
        </div>
    )
}

export default Login;