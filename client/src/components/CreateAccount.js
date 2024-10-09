import React, { Fragment, useState } from "react";

const CreateAccount = ({setAuth}) => {
    const[inputs, setInputs] = useState({
        email: "",
        password: "",
    })

    const [generatedUser, setGerneratedUser] = useState("");

    const {email, password} = inputs;

    const onChange = (e) => {
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
            console.log("Response received:", response);

            const parseRes = await response.json();

            console.log(parseRes);
            localStorage.setItem("token", parseRes.token);
            setAuth(true);
            setGerneratedUser(parseRes.username);

        } catch(err) {
            console.err(err.message);
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
                <button className="btn btn-success btn-block form-control my-3">generate userame</button> 
            </form>
            {generatedUser && (
                <div className="alert alert-success mt-3">
                    Your account has been created! Your username is: <strong>{generatedUser}</strong>
                </div>
            )}
        </Fragment>
    );
};

export default CreateAccount;