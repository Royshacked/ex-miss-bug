import { BugList } from "../cmps/BugList.jsx"
import { bugService } from "../services/bug.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
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

    function onRemoveBug(bugId) {
        bugService.remove(bugId)
            .then(() => {
                setUserBugs(prevBugs => prevBugs.filter(bug => bug._id !== bugId))
                showSuccessMsg('Bug removed successfully')
            })
            .catch((err) => {
                console.log(err)
                showErrorMsg('Could\'nt remove bug')
            })
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const bugToSave = { ...bug, severity }

        bugService.save(bugToSave)
            .then(savedBug => {
                setUserBugs(prevBugs => prevBugs.map(bug => bug._id === savedBug._id ? savedBug : bug))
                showSuccessMsg('Bug updated successfully')
            })
            .catch((err) => {
                console.log(err)
                showErrorMsg('Could\'nt update bug')
            })
    }

    console.log(userBugs)
    return <section className="user-details">
        <h2>User</h2>
        <button onClick={() => navigate('/bug')}>X</button>

        {userBugs.length > 0 && <BugList bugs={userBugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} user={user} />}
    </section>
}