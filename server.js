import express from 'express'

import { bugService } from './services/bug.service.js'

const app = express()

app.use(express.static('public'))


app.get('/', ((req, res) => res.send('hello there')))
app.listen(3030, () => console.log('Server is ready'))

app.get('/api/bug', ((req, res) => {
    bugService.query()
        .then(bugs => res.send(bugs))
}))

app.get('/api/bug/save', ((req, res) => {
    const { _id, title, description, severity } = req.query
    const bugToSave = { _id, title, description, severity: +severity, createdAt: +createdAt || Date.now() }

    bugService.save(bugToSave)
        .then(savedBug => res.send(savedBug))
}))

app.get('/api/bug/:id', ((req, res) => {
    const { id } = req.params

    bugService.getById(id)
        .then(bug => res.send(bug))
}))

app.get('/api/bug/:id/remove', ((req, res) => {
    const { id } = req.params

    bugService.remove(id)
        .then(() => res.send('bug removed... '))
}))










