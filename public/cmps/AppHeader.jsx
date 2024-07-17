const { Link, NavLink } = ReactRouterDOM
const { useState } = React

import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { userService } from '../services/user.service.js'
import { LoginSignup } from './LoginSignup.jsx'
import { UserMsg } from './UserMsg.jsx'

export function AppHeader() {
  const [user, setUser] = useState(userService.getLoggedInUser())

  function logOut() {
    userService.logout()
      .then(() => {
        setUser(null)
        showSuccessMsg('Logged out successfully')
      })
      .catch((err) => {
        showErrorMsg('Could\'nt log out')
        console.log(err)
      })
  }

  function onSetUser(user) {
    setUser({ ...user })
  }

  return (
    <header>
      <UserMsg />
      <nav>
        <NavLink to="/">Home</NavLink> |<NavLink to="/bug">Bugs</NavLink> |
        <NavLink to="/about">About</NavLink>
      </nav>
      <h1>Bugs are Forever</h1>
      {/* {user ? <section><Link to={{ pathname: '/bug/user', state: user }}> Hello {user.fullname} </Link> <button onClick={logOut}>LogOut</button></section> : <LoginSignup onSetUser={onSetUser} />} */}
      {user ? <section><Link to="/bug/user"> Hello {user.fullname} </Link> <button onClick={logOut}>LogOut</button></section> : <LoginSignup onSetUser={onSetUser} />}
    </header>
  )
}

