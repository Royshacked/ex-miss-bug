import express from 'express'

var bugs = [
    {
        _id: "abc123",
        title: "Cannot save a new car",
        description: "problem when clicking Save",
        severity: 3,
        createdAt: 1542107359454,
    }
]

const app = express()
app.get('/', ((req, res) => res.send('hello there')))
app.listen(3030, () => console.log('Server is ready'))

app.get('/api/bug', ((req, res) => {
    res.send(bugs)
}))


