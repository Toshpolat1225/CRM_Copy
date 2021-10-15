const express = require("express");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const exhbs = require("express-handlebars");
const app = express();
const path = require("path");
const isAdmin = require("./middleware/isAdmin");
const Admin = require("./models/Admin");
const Worker = require("./models/workers");
const workerRouter = require("./routes/worker/workers");
const projectsRouter = require("./routes/projects/projects");
const AuthRouter = require("./routes/auth/auth");
const indexRouter = require("./routes/index");
const lessonRouter = require("./routes/library/lessons");
const libraryRouter = require("./routes/library/library");
const traineesRouter = require("./routes/trainees/trainees-projects");
const lidsRouter = require("./routes/lids/lids");
const salaryRouter = require("./routes/salary/salary");
const priceRouter = require("./routes/price/price");
const personRouter = require("./routes/person/person");
const teacherGroupStudentRouter = require("./routes/teacherGroupStudent/teacherGroupStudent");
const adminRouter = require("./routes/admin/admin");
const error404 = require("./middleware/404");
const dotenv = require("dotenv");
const Project = require("./models/Project");
const TraineesProject = require("./models/traineesProject");
const dailyRouter = require("./routes/payment/daily");
const monthlyRouter = require("./routes/payment/monthly");
const studyRouter = require("./routes/study/study");

dotenv.config();
// 'mongodb+srv://ChangeLeader:Salom2021@cluster0.eqa5r.mongodb.net/change-world'

const store = new MongoDbStore({
  uri: process.env.MONGODB_URI,
  collection: "session",
});
const hbs = exhbs.create({
  defaultLayout: "admin",
  extname: "hbs",
  partialsDir: path.join(__dirname, "views/partials"),
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
  

    helpers: {
        iftr: function(a, b, options) {
            if (a || b) {
                return options.fn(this);
            }
            return options.inverse(this);
        },
        ifeq: function(a,b, options){

          for(key in a){
              if(key.toString().trim() === b.toString().trim()){
                  return options.fn(this);
              }
              else{
                  continue
              }
          }

          
          return options.inverse(this);
      },
        sel: function(a, b) {
            if (a.toString() === b.toString()) {
                return "selected";
            }
        }
        
    
    },
});


app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  session({
    secret: "secret value",
    resave: false,
    saveUninitialized: false,
    store,
  })
);
app.use(async (req, res, next) => {
  req.admin = req.session.admin;
  if (req.admin) {
    res.locals.isadmin = req.session.isAdmin;
    res.locals.user = await Admin.findById(req.session.admin._id);
    res.locals.user = {
      fullname: res.locals.user.name,
      avatar: res.locals.user.avatar,
      _id: res.locals.user._id,
    };
  }
  req.worker = req.session.worker;
  if (req.worker) {
    req.worker = req.session.worker;
    res.locals.isworker = req.session.isWorker;
    res.locals.user = await Worker.findById(req.worker._id.toString());
  }
  req.student = req.session.student;
  if (req.student) {
    res.locals.isstudent = req.session.isStudent;
    req.student = req.session.student;
    res.locals.user = await Worker.findById(req.student._id.toString());
  }
  req.manager = req.session.manager;
  if (req.manager) {
    res.locals.ismanager = req.session.isManager;
    req.manager = req.session.manager;
    res.locals.user = await Worker.findById(req.manager._id.toString());
  }
  res.locals.isadmin = req.session.isAdmin;

  next();
});

app.use(flash());
app.use("/all/projects/content", async (req, res) => {
  const projects = await Project.find();
  const traineesProject = await TraineesProject.find();
  await Promise.all(
    projects.map((c) => c.populate("works.worker").execPopulate())
  );
  await Promise.all(
    traineesProject.map((c) => c.populate("works.worker").execPopulate())
  );
  res.status(200).json({ traineesProject, projects });
});
app.use("/auth", AuthRouter);
app.use("/", isAdmin, indexRouter);
app.use("/admin", isAdmin, adminRouter);
app.use("/workers", isAdmin, workerRouter);
app.use("/lesson", isAdmin, lessonRouter);
app.use("/projects", isAdmin, projectsRouter);
app.use("/library", isAdmin, libraryRouter);
app.use("/trainees", isAdmin, traineesRouter);
app.use("/lids", isAdmin, lidsRouter);
app.use("/salary", isAdmin, salaryRouter);
app.use("/price", isAdmin, priceRouter);
app.use("/person", isAdmin, personRouter);
app.use("/payment", dailyRouter);
app.use("/payment", monthlyRouter);
app.use("/study", studyRouter);
app.use("/teacherGroupStudent", isAdmin, teacherGroupStudentRouter);
app.use(error404);

const PORT = process.env.PORT || 3000;

async function start() {
  await mongoose.connect(process.env.MONGODB_URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
  });
}

start();
