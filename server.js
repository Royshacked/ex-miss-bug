import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

const port = 3030
const app = express()

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

app.listen(port, () => loggerService.info(`Server listening on port http://127.0.0.1:${port}/`))

app.get('/api/bug', ((req, res) => {
    const filterBy = {
        txt: req.query.txt || '',
        minSeverity: +req.query.minSeverity || 0,
        pageIdx: +req.query.pageIdx || 0,
    }

    bugService.query(filterBy)
        .then(bugs => res.send(bugs))
        .catch(err => {
            loggerService.error(`Couldn't get bugs`, err)
            res.status(500).send(`Couldn't get bugs`)
        })
}))

app.get('/api/bug/page', ((req, res) => {
    bugService.pageCount()
        .then(pages => res.send(pages + ''))
        .catch(err => {
            loggerService.error(`Couldn't get pageCount`, err)
            res.status(500).send(`Couldn't get pageCount`)
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
    const { _id, title, description, severity } = req.body
    const bugToSave = {
        _id,
        title: title || '',
        description: description || '',
        severity: +severity || 0,
    }

    bugService.save(bugToSave)
        .then(savedBug => res.send(savedBug))
        .catch(err => {
            loggerService.error(`Couldn't save bug`, err)
            res.status(500).send(`Couldn't save bug`)
        })
}))


app.post('/api/bug', ((req, res) => {
    const { title, description, severity } = req.body
    const bugToSave = {
        title: title || '',
        description: description || '',
        severity: +severity || 0,
    }

    bugService.save(bugToSave)
        .then(savedBug => res.send(savedBug))
        .catch(err => {
            loggerService.error(`Couldn't save bug`, err)
            res.status(500).send(`Couldn't save bug`)
        })
}))

// app.get('/**', (req, res) => {
//     res.sendFile(path.resolve('public/index.html'))
// })












