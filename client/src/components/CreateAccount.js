import React, { Fragment, useState } from "react";
import './CreateAccount.css';
import { Link } from 'react-router-dom';
// import supabase from "../supabaseClient";

const CreateAccount = ({setAuth}) => {
    const[inputs, setInputs] = useState({
        email: "",
        password: "",
    })

    const [generatedUser, setGeneratedUser] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const {email, password, passwordconfirm} = inputs;

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

        try {
            const body = {email, password, passwordconfirm};

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
            
            // const { data, error } = await supabase
            //     .from('users')
            //     .insert([{}])

        } catch(err) {
            console.error(err.message);
            setErrorMessage(err.message);
        }
    }

    return (
        <Fragment>
        <div className="fullscreen-background">  
        <Link to="/" className="font-dotgothic mt-2" style={{ color: 'white' }}>
            Return home
        </Link>
            <h1 className="font-tiny5 font-bold text-center text-white text-8xl mt-10 mb-1 heading-shadow">Become One With The Bees...</h1>
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

                <input type="password" name="passwordconfirm" 
                placeholder="confirm password"
                className="form-control my-3 font-dotgothic"
                value={passwordconfirm}
                onChange={e => onChange(e)}/>

                <button className="btn custom-button font-dotgothic">Create Account</button>
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
            <Link to="/login" className="font-dotgothic mt-2">Return to Login</Link>
        </div>
        </Fragment>
    );
};

export default CreateAccount;