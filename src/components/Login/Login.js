import { useContext, useState } from 'react';
import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router-dom';
import { createNewUserWithEmailAndPassword, handleFbSignIn, handleGoogleSignIn, handleSignOut, initializeLoginFramework, signInProfileWithEmailAndPassword } from "./LoginManager";

function Login() {
    const [newUser, setNewUser] = useState(false)
    const [user, setUser] = useState({
        isSignedIn: false,
        name: '',
        email: '',
        password: '',
        photo: '',
        error: '',
        success: false
    })

    initializeLoginFramework();

    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    const history = useHistory();
    const location = useLocation();
    let { from } = location.state || { from: { pathname: "/" } };

    const handleSubmit = (event) => {
        if (newUser && user.email && user.password) {
            createNewUserWithEmailAndPassword(user.name, user.email, user.password)
                .then(res => {
                    handleResponse(res, false);
                })
        }

        if (!newUser && user.email && user.password) {
            signInProfileWithEmailAndPassword(user.email, user.password)
                .then(res => {
                    handleResponse(res, true);
                })
        }
        event.preventDefault();
    }
   
    const handleResponse = (res, redirect) => {
        setUser(res);
        setLoggedInUser(res);
        if(redirect){
            history.replace(from);
        }
    }

    const googleSignIn = () => {
        handleGoogleSignIn()
            .then(res => {
                handleResponse(res, true);
            })
    }

    const fbSignIn = () => {
        handleFbSignIn()
            .then(res => {
                handleResponse(res, true);
            })
    }

    const signOut = () => {
        handleSignOut()
            .then(res => {
                handleResponse(res, false);
            })
    }

    const handleFieldBlur = (event) => {
        let isFieldValid = true;
        if (event.target.name === 'email') {
            isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);
        }
        if (event.target.name === 'password') {
            isFieldValid = (event.target.value.length > 6) && (/\d{1}/.test(event.target.value));
        }
        if (isFieldValid) {
            const newUserInfo = { ...user };
            newUserInfo[event.target.name] = event.target.value;
            setUser(newUserInfo);
        }
    }

    return (
        <div style={{ textAlign: 'center' }}>
            {
                user.isSignedIn
                    ? <button onClick={signOut}>Sign out</button>
                    : <button onClick={googleSignIn}>Sign in</button>
            }
            <br />
            <button onClick={fbSignIn}>Sign in using Facebook</button>
            {
                user.isSignedIn &&
                <div>
                    <p>Welcome, {user.name}</p>
                    <p>Your email: {user.email}</p>
                    <img src={user.photo} alt="" />
                </div>
            }

            <h1>Our Own Authentication System</h1>
            <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id="" />
            <label htmlFor="newUser"> New User Sign UP</label>
            <form onSubmit={handleSubmit}>
                {
                    newUser && <input type="text" name="name" onBlur={handleFieldBlur} placeholder="Your name" required />
                }
                <br />
                <input type="text" name="email" onBlur={handleFieldBlur} placeholder="Your email address" required /><br />
                <input type="password" name="password" onBlur={handleFieldBlur} placeholder="Your password" required /><br />
                <input type="submit" value="Submit" />
            </form>
            <p>{user.error}</p>
            {
                user.success && <p>User {newUser ? 'created' : 'Logged in'} successfully</p>
            }
        </div>
    );
}

export default Login;
