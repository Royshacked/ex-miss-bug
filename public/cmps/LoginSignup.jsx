const { useState } = React

export function LoginSignup() {
    const [isSignedUp, setIsSignedUp] = useState(false)
    return <section className="login-signup">
        <button onClick={() => setIsSignedUp(!isSignedUp)}>{!isSignedUp ? 'Already a member? SignIn' : 'Not a member? SignUp'}</button>

        <form >
            <label htmlFor="username">
                <input id="username" type="text" placeholder="Username?" />
            </label>

            <label htmlFor="password">
                <input id="password" type="text" placeholder="Password?" />
            </label>

            {!isSignedUp && <label htmlFor="fullname">
                <input id="fullname" type="text" placeholder="Fullname?" />
            </label>}

            <button>{!isSignedUp ? 'SignUp' : 'SignIn'}</button>
        </form>
    </section>
}