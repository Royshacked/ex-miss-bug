import { BugList } from "../cmps/BugList.jsx"
import { bugService } from "../services/bug.service.js"
import { userService } from "../services/user.service.js"

const { useState, useEffect } = React
const { useNavigate } = ReactRouterDOM


export function UserDetails() {
    const [user, setUser] = useState(userService.getLoggedInUser)
    const [userBugs, setUserBugs] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        if (!user) return

        getUserBugs()
    }, [])

    function getUserBugs() {
        bugService.query({ userId: user._id })
            .then(userBugs => setUserBugs(userBugs))
    }

    function onRemoveBug() {
        console.log('remove')
    }

    function onEditBug() {
        console.log('edit')
    }

    console.log(userBugs)
    return <section className="user-details">
        <h2>User</h2>
        <button onClick={() => navigate('/bug')}>X</button>

        <BugList bugs={userBugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
    </section>
}