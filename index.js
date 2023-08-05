const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();
dotenv.config();

const PORT = process.env.PORT || 6969;
const users = require("./routes/users");

app.use(cookieParser("secretcode"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:3000", "http://192.168.0.104:3000", "https://dnd.svenahac.com"],
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
);

app.use("/users", users);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
