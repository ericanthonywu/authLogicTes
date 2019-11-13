import React from 'react'
import Axios from "axios";
import {apiUrl} from "../GlobalVariable";
import {Encrypt} from "../SecurityHelper";

class Login extends React.Component {
    state = {verifyToken: false}
    Register = e => {
        e.preventDefault()
        Axios.post(`${apiUrl}register`, {
            data: Encrypt(this.state)
        })
            .then(() => {
                alert('check your email for verification')
                this.setState({
                    verifyToken: true
                })
            })
            .catch(err => alert(err.response.status))
    }
    verifyToken = e => {
        e.preventDefault()
        Axios.post(`${apiUrl}verifyToken`,{
            data: Encrypt(this.state)
        })
            .then(() => {
            alert('email verified!')
        })
            .catch(err => alert(err.response.status))
    }
    Login = e => {
        e.preventDefault()
        Axios.post(`${apiUrl}login`, {
            data: Encrypt(this.state)
        })
            .then(res => alert(res.data.token))
            .catch(err => alert(err.response.status))
    }

    ChangeText = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    render() {
        return (
            <div>
                <h1>Register Form</h1>
                <form onSubmit={this.Register}>
                    <input type="text" name={"username"} onChange={this.ChangeText} placeholder={"username"}/><br/>
                    <input type="text" name={"nickname"} onChange={this.ChangeText} placeholder={"nickname"}/><br/>
                    <input type="email" name={"email"} onChange={this.ChangeText} placeholder={"email"}/><br/>
                    <input type="text" name={"no_hp"} onChange={this.ChangeText} placeholder={"no_hp"}/><br/>
                    <input type="password" name={"password"} onChange={this.ChangeText} placeholder={"password"}/><br/>
                    <input type="submit" value={"Register"}/>
                </form>

                <h1>Verify Token Form</h1>

                <form onSubmit={this.verifyToken}>
                    <input type="text" name={"token"} onChange={this.ChangeText} placeholder={"token"}/>
                    <input type="text" name={"email"} onChange={this.ChangeText} placeholder={"email"}/>
                    <input type="submit" value={"Verify Token"}/>
                </form>

                <h1>Login Form</h1>
                <form onSubmit={this.Login}>
                    <input type="text" name={"usernameoremail"} onChange={this.ChangeText}
                           placeholder={"Username Or Email"}/><br/>
                    <input type="password" name={"password"} onChange={this.ChangeText} placeholder={"password"}/><br/>
                    <input type="submit" value={"Login"}/>
                </form>
            </div>
        );
    }

}

export default Login
