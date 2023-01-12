import express, { Application, Request, Response } from "express";
import session from "express-session";
import path from "path";
import http from "http";
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import morgan from "morgan";
import cors from "cors"



const app: Application = express();
const server = http.createServer(app);
const socketServer = new Server(server);
socketServer.on(
    "connection",
    (
        socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
    ) => {
        console.log(socket.id);
    }
);

//setting

app.set("port", process.env.PORT || process.argv[2]);
const PORT = app.get("port");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));

app.use(
    session({
        secret: "123456789",
        resave: true,
        saveUninitialized: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(morgan("dev"))
app.use(cors({origin:"http//localhost:3000"}))
interface User {
    userName: string;
    views: number;
}

declare module "express-session" {
    interface SessionData {
        user: string;
        views: number;
    }
}

//routes
app.get("/", (req: Request, res: Response) => {
    const userData = {
        user: req.session.user || "",
        views: req.session.views || 0,
    };
    console.log(userData);
    console.log("get home");
    if (!userData.user || !userData.user.length) {
        return res.redirect("/login");
    }
    req.session.views ? (req.session.views += 1) : (req.session.views = 1);
    res.render("index", { views: req.session.views, userName: userData.user });
});

app.post("/logOut", (req: Request, res: Response) => {
    req.session.user = "";
    req.session.views = 0;
    console.log("paso por logout")
    res.redirect("/login");
});



app.get("/login", (req: Request, res: Response) => {
    const userData = {
        user: req.session.user || null,
        views: req.session.views || 0,
    };
    console.log(userData);
    console.log("login get");
    if (userData.user?.length && userData.user) {
        return res.redirect("/");
    }
    res.render("login");
});

app.post("/login", (req: Request, res: Response) => {
    const userData: User = req.body;
    console.log(userData);
    console.log("login post");
    req.session.user = userData.userName;
    req.session.views = 0;
    res.redirect("/");
});

//Server
server.listen(PORT, () =>
    console.log(`Server Running on PORT http://127.0.0.1:${PORT}`)
);
