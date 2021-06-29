import handler from "./handler.js";
import express from "express";

const port = 8080;
const app = express();

app.use("/", express.static("web-app/static"));

app.use("/", express.json());
app.post("/", function (req, res) {
    const responseObj = handler(req.body);
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(responseObj));
});

app.listen(port, function () {
    console.log(`Listening on port ${port} – http://localhost:${port}`);
});