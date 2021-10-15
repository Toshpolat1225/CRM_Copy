const { Router } = require("express");
const router = Router();
const Teacher = require("../../models/Teacher");
const mongoose = require("mongoose");
const Group = require("../../models/Group");
const monthlyGroups = require("../../models/monthlyGroups");
const Student = require("../../models/Student");
const moment = require("moment");

router.get("/", async (req, res) => {
  // if(new Date(Date.now()).getDay() === 1)
  const teachers = await Teacher.find();

  res.render("study/study", {
    title: "Уроки",
    teachers,
  });
});

router.get("/archieve/push", async (req, res) => {
  const groupsFetch = await Group.find();
  let students;
  const newGroups = groupsFetch.filter(
    (g) =>
      new Date(Date.now()).getDate() - new Date(g.timeLesson).getDate() === 30
  );
  const Groups = await Promise.all(
    newGroups.map(async (group, index) => {
      students = await Group.aggregate([
        {
          $lookup: {
            from: "students",
            localField: "_id",
            foreignField: "groupId",
            as: "students",
          },
        },
        {
          $match: {
            _id: mongoose.Types.ObjectId(group._id),
          },
        },
        {
          $group: {
            _id: {
              _id: "$_id",
            },
            students: {
              $push: "$students",
            },
          },
        },
        {
          $project: {
            _id: "$_id._id",
            fullname: "$_id.fullname",
            payment: "$_id.payment",
            muster: "$_id.muster",
            comment: "$_id.comment",
            students: "$students",
          },
        },
        {
          $unwind: {
            path: "$students",
          },
        },
      ]);
      const newGroup = { ...group._doc, students: students[0].students };

      return newGroup;
    })
  );
      if(students){
        const stuuudent = await Promise.all(
          students[0].students.map(async (student) => {
            student.payment = 0;
            student.muster = {};
            await Student.findByIdAndUpdate(student._id, student);
            return;
          }) 
        );
      

      }
 
  const Archive = await monthlyGroups.findOne();
  if (!Archive) {
    const Archive = new monthlyGroups({
      archive: Groups,
    });
    await Archive.save();
  } else {
    const archive = [...Groups, ...Archive.archive];
    await monthlyGroups.findByIdAndUpdate(Archive._id, archive);
  }

  res.redirect("/study");
});

router.get("/teachers/:id", async (req, res) => {
  const { name } = await Teacher.findById(req.params.id)


  
  let groups = await Teacher.aggregate([
      {
      $lookup: {
        from: "groups",
        localField: "_id",
        foreignField: "teacherId",
        as: "groups",
      },
    },
    {
      $match: {
        _id: mongoose.Types.ObjectId(req.params.id),
      },
    },
    {
      $group: {
        _id: {
          _id: "$_id",
        },
        groups: {
          $push: "$groups",
        },
      },
    },
    {
      $project: {
        _id: "$_id._id",
        name: "$_id.name",
        timeLesson: "$_id.timeLesson",
        groups: "$groups",
      },
    },
    {
      $unwind: {
        path: "$groups",
      },
    },
  ]);
  
  /*  groups = */ groups[0].groups.map(group=>{
    const date = moment(group.timeLesson).format('DD-MM')
    const [day, month] = date.toString().split('-')
    const [dayNow, monthNow] = moment(new Date()).format('DD-MM').toString().split('-')
    if(+month < +monthNow){
        if(day < dayNow){
          const actualMonth = monthNow - month + 1
          group.actualMonth = actualMonth
        }
        
    }
    const actualMonth = monthNow - month + 1
    group.actualMonth = actualMonth

   })

  if (groups.length) {
    groups = groups[0].groups;
  } else {
    groups = "";
  }
  res.render("study/groups", {
    title: name,
    layout: "admin",
    groups,
  });
});

router.get("/groups/:id", async (req, res) => {
  const { title } = await Group.findById(req.params.id);
  let students = await Group.aggregate([
    {
      $lookup: {
        from: "students",
        localField: "_id",
        foreignField: "groupId",
        as: "students",
      },
    },
    {
      $match: {
        _id: mongoose.Types.ObjectId(req.params.id),
      },
    },
    {
      $group: {
        _id: {
          _id: "$_id",
        },
        students: {
          $push: "$students",
        },
      },
    },
    {
      $project: {
        _id: "$_id._id",
        fullname: "$_id.fullname",
        payment: "$_id.payment",
        muster: "$_id.muster",
        comment: "$_id.comment",
        students: "$students",
      },
    },
    {
      $unwind: {
        path: "$students",
      },
    },
  ]);
  if (students.length) {
    students = students[0].students;
  } else {
    students = "";
  }
  students.forEach((student) => {
    const muster = [];
    for (key in student.muster) {
      student.muster[key] = `${key}-день: +`;
      muster.push(student.muster[key]);
    }
    student.muster = muster.join(" | ");
  });
  res.render("study/students", {
    title: title,
    layout: "admin",
    students,
    // admin
  });
});

module.exports = router;
