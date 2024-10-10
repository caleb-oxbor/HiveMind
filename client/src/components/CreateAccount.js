import React, { Fragment, useState } from "react";
import './CreateAccount.css';
import { Link } from 'react-router-dom';

const CreateAccount = ({setAuth}) => {
    const[inputs, setInputs] = useState({
        email: "",
        password: "",
    })

    const [generatedUser, setGeneratedUser] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const {email, password} = inputs;

    const onChange = (e) => {
        setErrorMessage('');
        setGeneratedUser('');
        setInputs({...inputs, [e.target.name]
            : e.target.value});
    };

    const onSubmitForm = async e => {
        setErrorMessage('');
        setGeneratedUser('');
        e.preventDefault()

        try{
            const body = {email, password};

            const response = await fetch("http://localhost:5000/auth/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body:  JSON.stringify(body)
            });


            const parseRes = await response.json();

            if (parseRes.token) {
                localStorage.setItem("token", parseRes.token);
                setAuth(true);
                setGeneratedUser(parseRes.username); // Display the generated username
            } else {
                setAuth(false);
                setErrorMessage(parseRes);
            }       

        } catch(err) {
            console.error(err.message);
            setErrorMessage(err.message);
        }
    }

    return (
        <Fragment>
        <div className="fullscreen-background">  
            <Link to="/login">
                <button className="btn btn-dark btn-large btn-block font-dotgothic mb-10">Return to Login</button>
            </Link>
            <h1 className="font-tiny5 font-bold text-center text-white text-7xl m1-10 mb-1">BECOME ONE WITH THE BEES...</h1>
            <h3 className="font-dotgothic text-center text-white text-3xl my-5">Create your account to get started</h3>
            <form onSubmit={onSubmitForm}>
                <input type="email" name="email" 
                placeholder="email" 
                className="form-control my-3 font-dotgothic"
                value={email}
                onChange={e => onChange(e)}/>

                <input type="password" name="password" 
                placeholder="password"
                className="form-control my-3 font-dotgothic"
                value={password}
                onChange={e => onChange(e)}/>

                <button className="btn btn-success btn-block font-dotgothic">Create Account</button>
            </form>
            {generatedUser && (
                <div className="alert alert-success mt-3">
                    Your account has been created! Your username is: <strong>{generatedUser}</strong>
                </div>
            )}
            {errorMessage && (
                <div className="alert alert-danger mt-3">
                    Error: <strong>{errorMessage}</strong>
                </div>
            )}
        </div>
        </Fragment>
    );
};

export default CreateAccount;