const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

const db = require('./models');

const mentorsRouter = require('./routes/mentors');
app.use("/mentors", mentorsRouter);

const menteesRouter = require('./routes/mentees');
app.use("/mentees", menteesRouter);

const menteeSessionsRouter = require('./routes/mentee_sessions');
app.use("/mentee_sessions", menteeSessionsRouter);

const mentorSessionsRouter = require('./routes/mentor_sessions');
app.use("/mentor_sessions", mentorSessionsRouter);

const adminRouter = require('./routes/admin');
app.use("/admin", adminRouter);

const authRouter = require('./routes/auth');
app.use("/auth", authRouter);

db.sequelize.sync().then(() => {
    app.listen(4002, ()=> {
        console.log("Server Running Mother Fucker(on port 4002)");
    });
});

