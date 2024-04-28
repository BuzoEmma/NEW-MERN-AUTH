import express from "express";
import dovenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import connetMongoDB from "./config/db.js";
dovenv.config();
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

// app.use(cors());

connetMongoDB();

app.use("/api/users", userRoutes);



 app.get("/", (req, res) => {
   res.send("Hello World Of Buzo Dev");
 });

app.use(errorHandler);
app.use(notFound);

// console.log("MongoDB URI:", process.env.MONGO_URL);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`The server started on PORT ${PORT}`));

// - ** POST /api/users** - Resgister a user
// - ** POST /api/users/auth** - Authenticate a user
// - ** POST /api/users/logout** - Logout user and clear cookies
// - ** GET /api/users/profile** - Get user profile
// - ** PUT /api/users/profile** - Update user profile
