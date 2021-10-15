const { Router } = require("express");
const router = Router();
const Income = require("../../models/Income");
const Expense = require("../../models/Expense");
const Teachers = require("../../models/Teacher");
const Groups = require("../../models/Group");
const Students = require("../../models/Student");
const moment = require("moment");

const dayFilter = (arr) => {
  return arr.filter((c) => {
    const day = moment(new Date()).format("YYYYMMDD");
    if (+day === c.date) {
      return c;
    }
  });
};

const dateFormat = (arr) => {
  arr.map((c) => (c.time = moment(c.time / 1000).format("llll")));
  return arr;
};

router.get("/study/content", async (req, res) => {
  const groups = await Groups.find();
  const students = await Students.find();
  const teachers = await Teachers.find();

  res.status(200).json({ groups, teachers, students });
});

router.get("/daily", async (req, res) => {
  const incms = await Income.find();
  const expns = await Expense.find();
  const teachers = await Teachers.find();
  const groups = await Groups.find();
  const students = await Students.find();
  const expenses = dayFilter(expns);
  const incomes = dayFilter(incms);
  res.render("payment/daily", {
    title: "Ежедневный платеж",
    incomes: dateFormat(incomes),
    expenses: dateFormat(expenses),
    teachers,
    groups,
    students,
  });
});

router.post("/daily/add", async (req, res) => {
  const { description, payment } = req.body;
  const date = moment(new Date()).format("YYYYMMDD");
  const obj = {
    description,
    payment,
    date: +date,
    time: new Date() * 1000,
  };
  const income = new Income(obj);
  await income.save();
  res.redirect("/payment/daily");
});

router.post("/daily/edit", async (req, res) => {
  const { name, description } = req.body;
  await Income.findByIdAndUpdate(req.body.id, { name, description });
  res.redirect("/payment/daily");
});

router.post("/daily/expense/edit", async (req, res) => {
  const { name, description, teacher, student, group, payment } = req.body;
  await Expense.findByIdAndUpdate(req.body.id, {
    name,
    description,
    teacher,
    student,
    group,
    payment,
  });
  res.redirect("/payment/daily");
});

router.get("/daily/edit/:id", async (req, res) => {
  const income = await Income.findById(req.params.id);
  const incms = await Income.find();
  const expns = await Expense.find();
  const teachers = await Teachers.find();
  const groups = await Groups.find();
  const students = await Students.find();
  const expenses = dayFilter(expns);
  const incomes = dayFilter(incms);
  res.render("payment/daily", {
    incomes: dateFormat(incomes),
    income,
    // income:
    //   income.date === +moment(new Date()).format("YYYYMMDD") ? income : null,
    expenses: dateFormat(expenses),
    teachers,
    groups,
    students,
    title: "Ежедневный расход",
  });
});

router.get("/daily/delete/:id", async (req, res) => {
  await Income.findByIdAndDelete(req.params.id);
  res.redirect("/payment/daily");
});

router.post("/daily/expense/add", async (req, res) => {
  const { name, description, teacher, student, group, payment } = req.body;
  const studentId = await Students.findById(student);
  const editedStudent = {
    payment,
    fullname: studentId.fullname,
    comment: studentId.comment,
    groupId: studentId.groupId,
    muster: studentId.muster,
  };
  await Students.findByIdAndUpdate(student, editedStudent);
  const date = moment(new Date()).format("YYYYMMDD");
  const obj = {
    name,
    description,
    teacher,
    student: studentId.fullname,
    group,
    payment,
    date: +date,
    time: new Date() * 1000,
  };
  const expense = new Expense(obj);
  await expense.save();
  res.redirect("/payment/daily");
});

router.get("/daily/expense/delete/:id", async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.redirect("/payment/daily");
});

router.get("/daily/expense/edit/:id", async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  const incms = await Income.find();
  const expns = await Expense.find();
  const teachers = await Teachers.find();
  const groups = await Groups.find();
  const students = await Students.find();
  const expenses = dayFilter(expns);
  const incomes = dayFilter(incms);
  res.render("payment/daily", {
    title: "Ежедневный доход",
    incomes: dateFormat(incomes),
    expenses: dateFormat(expenses),
    expense,
    // expense:
    //   expense.date === +moment(new Date()).format("YYYYMMDD") ? expense : null,
    teachers,
    groups,
    students,
    title: "Ежедневный расход",
  });
});

module.exports = router;
