import express from 'express'

import { bugService } from './services/bug.service.js'

const app = express()

app.get('/', ((req, res) => res.send('hello there')))
app.listen(3030, () => console.log('Server is ready'))

app.get('/api/bug', ((req, res) => {
    bugService.query()
        .then(bugs => res.send(bugs))
}))

app.get('api/bug/save', ((req, res) => {
    const { _id, title, description, severity, createdAt } = req.query
    const bugToSave = { _id, title, description, severity: +severity, createdAt: +createdAt }

    bugService.save(bugToSave)
        .then(savedBug => res.send(savedBug))
}))


