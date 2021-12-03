const express = require('express');
const app = express();
const cors = require('cors');
const {validateToken} = require("./middlewares/authmiddleware")

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use(validateToken);

const db = require('./models');

// const mentorsRouter = require('./routes/mentors');
// app.use("/mentors", mentorsRouter);

// const menteesRouter = require('./routes/mentees');
// app.use("/mentees", menteesRouter);

// const menteeSessionsRouter = require('./routes/mentee_sessions');
// app.use("/mentee_sessions", menteeSessionsRouter);

// const mentorSessionsRouter = require('./routes/mentor_sessions');
// app.use("/mentor_sessions", mentorSessionsRouter);

const api = require('./routes/api');
app.use("/api", api);

const authRouter = require('./routes/auth');
app.use("/auth", authRouter.router);

db.sequelize.sync().then(() => {
    app.listen(4002, ()=> {
        console.log("Server Running Mother Fucker(on port 4002)");
    });
});

