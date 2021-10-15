const { Router } = require("express");
const router = Router();
router.get("/", (req, res) => {
  res.render("user/index", {
    title: "CRM система",
  });
});
router.get("/notfound", (req, res) => {
  res.render("notfound/404", {
    title: "Страница не найдена!",
  });
});
module.exports = router;
