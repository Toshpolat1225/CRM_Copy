const { Router } = require("express");
const router = Router();
const rootUser = require("../../middleware/rootUser");
const Admin = require("../../models/Admin");
const fileMiddleware = require("../../middleware/file");
const bcrypt = require("bcryptjs");
router.get("/edit/:id", rootUser, async (req, res) => {
  const admin = await Admin.findOne();
  res.render("admin/admin-edit", {
    title: "Редактировать админа",
    admin,
    adminError: req.flash("adminError"),
  });
});
router.get("/delete", rootUser, async (req, res) => {
  try {
    await Admin.deleteOne();
    req.session.destroy();
    res.redirect("/auth/register");
  } catch (e) {
    console.log(e);
  }
});
router.post(
  "/edit",
  rootUser,
  fileMiddleware.single("avatar"),
  async (req, res) => {
    try {
      const admin = await Admin.findOne();
      const areSame = await bcrypt.compare(
        req.body.oldpassword,
        admin.password
      );
      if (areSame) {
        const { email, name, password } = req.body;
        req.file ? (avatar = req.file.filename) : (avatar = admin.avatar);
        const hash = await bcrypt.hash(password, 12);
        const adminNew = {
          email,
          name,
          password: hash,
          avatar,
          status: admin.status,
        };
        await Admin.findByIdAndUpdate(admin.id, adminNew);
        res.redirect(`/person/${admin._id.toString()}`);
      } else {
        req.flash("adminError", "Old password is not correct");
        res.redirect(`/admin/edit/${admin._id.toString()}`);
      }
    } catch (e) {
      console.log(e);
    }
  }
);

module.exports = router;
