const { useState } = React

import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { userService } from "../services/user.service.js"

export function LoginSignup({ onSetUser }) {
    const [isSignedUp, setIsSignedUp] = useState(false)
    const [credentials, setCredentials] = useState(userService.getEmptyCredentials())

    function handleChange({ target }) {
        const { name, value } = target

        setCredentials(prevCred => ({ ...prevCred, [name]: value }))
    }

    function handleSubmit(ev) {
        ev.preventDefault()

        isSignedUp ? login(credentials) : signup(credentials)
    }

    function login(credentials) {
        userService.login(credentials)
            .then((user) => {
                showSuccessMsg('Logged in successfully')
                onSetUser(user)
            })
            .catch((err) => {
                showErrorMsg('Could\'nt log in')
                console.log(err)
            })
    }

    function signup(credentials) {
        userService.signup(credentials)
            .then((user) => {
                showSuccessMsg('Signed up successfully')
                onSetUser(user)
            })
            .catch((err) => {
                showErrorMsg('Could\'nt sign up')
                console.log(err)
            })
    }


    return <section className="login-signup">
        <button onClick={() => setIsSignedUp(!isSignedUp)}>{!isSignedUp ? 'Already a member? SignIn' : 'Not a member? SignUp'}</button>

        <form onSubmit={handleSubmit}>
            <label htmlFor="username">
                <input id="username" type="text" placeholder="Username?" name="username" onChange={handleChange} value={credentials.username} required />
            </label>

            <label htmlFor="password">
                <input id="password" type="password" placeholder="Password?" name="password" onChange={handleChange} value={credentials.password} required />
            </label>

            {!isSignedUp && <label htmlFor="fullname">
                <input id="fullname" type="text" placeholder="Fullname?" name="fullname" onChange={handleChange} value={credentials.fullname} required />
            </label>}

            <button>{!isSignedUp ? 'SignUp' : 'SignIn'}</button>
        </form>
    </section>
}