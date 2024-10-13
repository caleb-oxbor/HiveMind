import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import {toast} from "react-toastify";


const LogIn = ({setAuth}) => {

    const [inputs, setInputs] = useState({
        email: "",
        password: ""
    });

    const { email, password } = inputs;

    const onChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value});
    };

    const onSubmitForm = async(e) => {
        e.preventDefault();
        try {

            const body = {email, password};

            const response = await fetch("http://localhost:5000/auth/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            });

            const parseRes = await response.json();
            console.log(parseRes);

            if (parseRes.token) {
                localStorage.setItem("token", parseRes.token);
                setAuth(true);
                toast.success("Login successful!");
            }

            else{
                setAuth(false);
                toast.error(parseRes);
            }
        } 
        
        catch (err) {
            console.error(err.message);
        }
    };

    return (
        <Fragment>
            <div className="fullscreen-background">  
            <Link to="/" className="font-dotgothic mt-2" style={{ color: 'white' }}>
                Return home
            </Link> 
            <h1 className="font-tiny5 font-bold text-center text-white text-8xl mt-10 mb-1 heading-shadow">Hello Again</h1>
            <h3 className="font-dotgothic text-center text-white text-3xl my-5">Login and return to your colony</h3>
            <form onSubmit={onSubmitForm}>
                <input 
                    type="email" 
                    name = "email" 
                    placeholder="email"
                    className="form-control my-3 font-dotgothic"
                    value={email}
                    onChange={e => onChange(e)}
                />

                <input 
                    type="password" 
                    name = "password" 
                    placeholder="password"
                    className="form-control my-3 font-dotgothic"
                    value={password}
                    onChange={e => onChange(e)}
                />

                <button className="btn custom-button font-dotgothic">Login</button>
            </form>
            <Link to="/register" className="font-dotgothic mt-2">Don't have account? Register here.</Link>
        </div>
        </Fragment>
    );
};

export default LogIn;