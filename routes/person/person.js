const { Router } = require("express");
const router = Router();
const Workers = require("../../models/workers");
const Admin = require("../../models/Admin");
const Salary = require("../../models/Salary");
router.get("/:id", async (req, res) => {
  const admin = await Admin.findOne();
  const ifAdmin = admin._id.toString() === req.params.id.toString();
  const user = res.locals.user;
  let salary = await Salary.find();
  salary = salary.filter((c) => c.userId.toString() === user._id.toString());
  salary = salary[0];
  const worker = await Workers.findById(req.params.id);
  res.render("person/person", {
    title: "Персональный кабинет",
    ifAdmin,
    salary,
    worker,
    admin,
  });
});
module.exports = router;
