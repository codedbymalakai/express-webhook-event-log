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

    const result = statement.run(receivedAt, source, headers, payload, status);

    res.status(200).json({ok: true, id: result.lastInsertRowid})
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

app.get("/events", (req, res) => {
  const rows = db
    .prepare(
      `
      SELECT id, receivedAt, source, status, error
      FROM events
      ORDER BY id DESC
      LIMIT 50
      `
    )
    .all();

  res.json({ count: rows.length, results: rows });
});

app.get("/events/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });

  const row = db
    .prepare(
      `
      SELECT id, receivedAt, source, headers, payload, status, error
      FROM events
      WHERE id = ?
      `
    )
    .get(id);

  if (!row) return res.status(404).json({ error: "Not found" });

  const safeParse = (s) => {
    try { return JSON.parse(s); } catch { return s; }
  };

  res.json({
    ...row,
    headers: safeParse(row.headers),
    payload: safeParse(row.payload),
  });
});
