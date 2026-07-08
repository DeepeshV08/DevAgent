import { config } from "dotenv";
config()

import app from "./src/app.js";
import connectToDb from "./src/config/db.js";

const port = process.env.PORT || 8000

connectToDb()

app.listen(port , () => {
    console.log(`server is running at port ${port}`)
})