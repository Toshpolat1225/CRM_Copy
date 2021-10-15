const { Router } = require("express");
const router = Router();
const fileMiddleware = require("../../middleware/file");
const Worker = require("../../models/workers");
const fileDelete = require("../../middleware/fileDelete");
const bcrypt = require("bcryptjs");
const rootUser = require("../../middleware/rootUser");

router.get("/add", rootUser, (req, res) => {
  if (!req.session.isAdmin) {
    res.redirect("/notfound");
  } else {
    res.render("workers/workers-add", {
      title: "Добавить сотрудника",
    });
  }
});
router.post(
  "/add",
  fileMiddleware.single("avatar"),
  rootUser,
  async (req, res) => {
    const {
      confirm,
      password,
      email,
      fullname,
      job,
      about,
      address,
      phone,
      education,
      skills,
      notes,
      telegram,
      status,
    } = req.body;
    console.log( 'status',status);
    const hash = await bcrypt.hash(password, 10);
    const worker = await Worker.findOne({ email });
    if (worker) {
      req.flash("registerError", "Этот эл. почта уже занята!");
      res.redirect("/auth/register");
    } else {
      req.file ? (avatar = req.file.filename) : (avatar = "default.png");
      const worker = new Worker({
        password: hash,
        email,
        fullname,
        job,
        about,
        address,
        phone,
        education,
        skills,
        notes,
        telegram,
        status,
        avatar,
      });
      await worker.save();

      res.redirect("/workers");
    }
  }
);
router.get("/", async (req, res) => {
  const workers = await Worker.find();
  res.render("workers/workers", {
    title: "Сотрудники",
    h1: "All staff",
    workers,
  });
});
router.get("/edit/:id", async (req, res) => {
  const worker = await Worker.findById(req.params.id);
  let isStudent;
  let isWorker;
  let isManager;
  worker.status == "Student"
    ? (isStudent = true)
    : worker.status == "Worker"
    ? (isWorker = true)
    : worker.status == "Project manager"
    ? (isManager = true)
    : (isDefault = "");
    if(worker.status == null || worker.status == undefined){
      isStudent = true
    }
    console.log('status',worker.status, 'student',isStudent,'Worker',isWorker,'Project manager',isManager);
  res.render("workers/workers-edit", {
    title: "Редактировать сотрудника",
    worker,
    isStudent,
    isWorker,
    isManager,
    h1: `${worker.fullname}`,
  });
});
router.get("/:id", async (req, res) => {
  const worker = await Worker.findById(req.params.id);
  res.render("workers/view-worker", {
    title: `${worker.fullname}`,
    h1: `${worker.fullname}`,
    worker,
  });
});
router.get("/remove/:id", rootUser, async (req, res) => {
  await Worker.findByIdAndDelete(req.params.id);
  res.redirect("/workers");
});
router.post(
  "/edit",
  fileMiddleware.single("avatar"),
  async (req, res) => {
    const worker = await Worker.findById(req.body.id);
    const {
      fullname,
      job,
      about,
      address,
      phone,
      education,
      skills,
      notes,
      telegram,
      status,
      email,
      password,
      confirm
    } = req.body;
    if(password.toString() === confirm.toString()){

      
      if (req.file) {
        if (req.file.filename.toString() !== worker.avatar.toString()) {
          fileDelete(worker.avatar);
        }
      }
      req.file ? (avatar = req.file.filename) : (avatar = worker.avatar);
      const hash = await bcrypt.hash(req.body.password, 12);
      const newworker = {
        fullname,
        job,
        about,
        address,
        phone,
        education,
        skills,
        notes,
        telegram,
        status,
        avatar,
        email,
        password:hash
      };
      await Worker.findByIdAndUpdate(req.body.id, newworker);
      res.redirect("/workers");
    }
    }
    );
module.exports = router;
