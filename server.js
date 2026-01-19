const express = require("express")
const app = express()
const port = 3000

app.use(express.json())

app.get("/", (req, res) => {
    res.send("Homepage")
})

app.get("/health", (req, res) => {
    res.send({ok: true})
})

app.post("/webhooks/hubspot", (req, res) => {
    console.log("headers:", req.headers["content-type"]);
    console.log(req.body)
    res.sendStatus(200);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})