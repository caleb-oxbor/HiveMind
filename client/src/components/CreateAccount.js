import React, { Fragment, useState } from "react";

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
        setInputs({...inputs, [e.target.name]
            : e.target.value});
    };

    const onSubmitForm = async e => {
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
            <h1 className="text-center my-5">Create Account</h1>
            <form onSubmit={onSubmitForm}>
                <input type="email" name="email" 
                placeholder="email" 
                className="form-control my-3"
                value={email}
                onChange={e => onChange(e)}/>

                <input type="password" name="password" 
                placeholder="password"
                className="form-control my-3"
                value={password}
                onChange={e => onChange(e)}/>

                <button className="btn btn-success btn-block">create account</button>
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
        </Fragment>
    );
};

export default CreateAccount;