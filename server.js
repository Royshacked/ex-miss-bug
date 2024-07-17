import express from 'express'
import cookieParser from 'cookie-parser'
import path from 'path'


import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'
import { userService } from './services/user.service.js'

const app = express()

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())


app.get('/api/bug', ((req, res) => {
    const filterBy = {
        txt: req.query.txt || '',
        minSeverity: +req.query.minSeverity || 0,
        pageIdx: +req.query.pageIdx || 0,
        selectedLabels: req.query.selectedLabels || [],
        userId: req.query.userId || '',
        isAdmin: req.query.isAdmin || false,
    }

    bugService.query(filterBy)
        .then(bugs => res.send(bugs))
        .catch(err => {
            loggerService.error(`Couldn't get bugs`, err)
            res.status(500).send(`Couldn't get bugs`)
        })
}))

app.get('/api/bug/page', ((req, res) => {
    bugService.getPages()
        .then(pages => res.send(pages + ''))
        .catch(err => {
            loggerService.error(`Couldn't get pageCount`, err)
            res.status(500).send(`Couldn't get pageCount`)
        })
}))


app.get('/api/bug/label', ((req, res) => {
    bugService.getLabels()
        .then(labels => res.send(labels))
        .catch(err => {
            loggerService.error(`Couldn't get labels`, err)
            res.status(500).send(`Couldn't get labels`)
        })
}))

app.get('/api/bug/:id', ((req, res) => {
    const { id } = req.params
    var visitedBugs = req.cookies.visitedBugs || []

    if (visitedBugs.length >= 3 && !visitedBugs.includes(id)) return res.status(401).send('Wait for a bit...')
    if (!visitedBugs.includes(id)) visitedBugs.push(id)

    console.log(`user visited the following bug:${visitedBugs}`)

    res.cookie('visitedBugs', visitedBugs, { maxAge: 7000 })

    bugService.getById(id)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error(`Couldn't get bug (${id})`, err)
            res.status(500).send(`Couldn't get bug (${id})`)
        })
}))

app.delete('/api/bug/:id', ((req, res) => {
    const { id } = req.params

    bugService.remove(id)
        .then(() => res.send('bug removed... '))
        .catch(err => {
            loggerService.error(`Couldn't delete bug (${id})`, err)
            res.status(500).send(`Couldn't delete bug (${id})`)
        })
}))


app.put('/api/bug/:id', ((req, res) => {
    const { _id, title, description, severity, labels, creator } = req.body
    const bugToSave = {
        _id,
        title: title || '',
        description: description || '',
        severity: +severity || 0,
        labels: labels || [],
        creator: {
            _id: creator._id,
            username: creator.username
        }
    }

    bugService.save(bugToSave)
        .then(savedBug => res.send(savedBug))
        .catch(err => {
            loggerService.error(`Couldn't save bug`, err)
            res.status(500).send(`Couldn't save bug`)
        })
}))


app.post('/api/bug', ((req, res) => {
    const { title, description, severity, labels } = req.body
    const { loginToken } = req.cookies

    const loggedinUser = userService.validateToken(loginToken)

    const bugToSave = {
        title: title || '',
        description: description || '',
        severity: +severity || 0,
        labels: labels || [],
        creator: {
            _id: loggedinUser._id,
            fullname: loggedinUser.fullname
        }
    }

    bugService.save(bugToSave)
        .then(savedBug => res.send(savedBug))
        .catch(err => {
            loggerService.error(`Couldn't save bug`, err)
            res.status(500).send(`Couldn't save bug`)
        })
}))

// User
app.get('/api/user', (req, res) => {
    const { loginToken } = req.cookies

    const loggedinUser = userService.validateToken(loginToken)
    if (!loggedinUser || !loggedinUser.isAdmin) return res.status(401).send('Cannot get users')

    userService.query()
        .then(users => res.send(users))
        .catch(err => res.status(500).send('Cannot get users'))
})

app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params

    userService.getById(userId)
        .then(user => res.send(user))
        .catch(err => res.status(500).send('Cannot get user'))
})

app.delete('/api/user/:userId', (req, res) => {
    const { loginToken } = req.cookies

    const loggedinUser = userService.validateToken(loginToken)
    if (!loggedinUser?.isAdmin) return res.status(401).send('Not allowed')

    const { userId } = req.params
    bugService.hasBugs(userId)
        .then(hasBugs => {
            if (!hasBugs) {
                userService.remove(userId)
                    .then(() => res.send('Removed!'))
                    .catch(err => res.status(401).send(err))
            } else {
                res.status(401).send('Cannot delete user with bugs')
            }
        })
})

// Auth

app.post('/api/login', (req, res) => {
    const credentials = {
        username: req.body.username,
        password: req.body.password,
    }
    userService.login(credentials)
        .then(user => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => res.status(401).send(err))
})

app.post('/api/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('Logged out')
})

app.post('/api/signup', (req, res) => {
    const credentials = req.body

    userService.signup(credentials)
        .then(user => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => res.status(403).send('Signup failed'))
})



app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

const PORT = process.env.PORT || 3030

app.listen(PORT, () => {
    console.log(`Server is ready at ${PORT} http://127.0.0.1:${PORT}/`)
})












