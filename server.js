import express from 'express'

const app = express()
app.get('/', ((req, res) => res.send('hello there')))
app.listen(3030, () => console.log('Server is ready'))
