import express from "express";
import cors from "cors";

import routes from "./routes";

const app = express();

const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(routes);

app.listen(PORT, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
