import { initDb } from "./db.js"
import express from "express"
const app = express()
const port = 3000

initDb();

app.use(express.json())

app.get("/", (req, res) => {
    res.send("Homepage")
})

app.get("/health", (req, res) => {
    res.json({ok: true})
})

app.post("/webhooks/hubspot", (req, res) => {
    const receivedAt = new Date().toISOString()
    const source = 'hubspot'
    const headers = JSON.stringify(req.headers ?? {})
    const payload = JSON.stringify(req.body ?? {})
    const status = "received"

    const statement = (`INSERT INTO events (receivedAt, source, headers, payload, status)
        VALUES (?, ?, ?, ?, ?)
        `)

    const result = statement.substring(receivedAt, source, headers, payload, status);

    res.status(200).json({ok: true, id: result.lastInsertRowid})
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})