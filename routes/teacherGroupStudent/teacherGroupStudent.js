const { Router } = require('express')
const router = Router()
const mongoose = require('mongoose')
const fileMiddleware = require("../../middleware/file")
const Group = require('../../models/Group')
const Teacher = require('../../models/Teacher')
const Student = require('../../models/Student')



    //--------------------------- Add Groups GET -----------------------
router.get('/groups/add', async(req, res) => {
        const teachers = await Teacher.find()
        res.render('TeacherGroupStudent/addGroup', {
            layout: 'admin',
            title: 'Create Group',
            teachers
        })
    })
     

    //-------------------------- Edit Groups GET -----------------------
router.get("/groups/edit/:id", async(req, res) => {
        const teachers = await Teacher.find()
        const group = await Group.findById(req.params.id)
        let teacherName = await Group.findById(req.params.id).populate('teacherId','name')
        teacherName = teacherName.teacherId.name
        res.render('TeacherGroupStudent/editGroup', {
            layout: 'admin',
            title: 'Edit Group',
            group,
            teachers,
            teacherName
        })
    })
    //--------------------------- Add Groups POST -----------------------
router.post('/groups/add', async(req, res) => {
    const {
        title,
        teacherId
    } = await req.body
    const group = new Group({
        title,
        teacherId
    })
    await group.save()
    res.redirect('/study')
})

//--------------------------- Edit Groups POST -----------------------
router.post("/groups/edit/:id", async(req, res) => {

        const admin = req.body

        await Group.findByIdAndUpdate(req.params.id, admin, (err) => {
            if (err) {
                console.log(err)
            } else {
                res.redirect("/study")
            }
        })

    })
    //--------------------------- Delete Groups GET -----------------------
router.get("/groups/delete/:id", async(req, res) => {
    await Group.findByIdAndDelete(req.params.id)
    res.redirect("/study")
})




    //--------------------------- Add Teachers GET -----------------------
router.get('/teachers/add', async(req, res) => {
        res.render('TeacherGroupStudent/addTeacher', {
            layout: 'admin',
            title: 'Create Teacher',

        })
    })
    //--------------------------- Add Teachers POST -----------------------


router.post('/teachers/add', async(req, res) => {
        const {
            name,
            job,
            phone,
            salary
        } = await req.body

        const teacher = new Teacher({
            name,
            job,
            phone,
            salary
        })

        await teacher.save()
        res.redirect('/study')
    })


//-------------------------- Edit Teacher GET -----------------------
router.get("/teachers/edit/:id", async(req, res) => {
    const teacher = await Teacher.findById(req.params.id)
    res.render('TeacherGroupStudent/editTeacher', {
        layout: 'admin',
        title: 'Edit Teacher',
        teacher,
    })
})

//--------------------------- Edit Teachers POST -----------------------
router.post("/teachers/edit/:id", async(req, res) => {
        const admin = req.body
        await Teacher.findByIdAndUpdate(req.params.id, admin, (err) => {
            if (err) {
                console.log(err)
            } else {
                res.redirect("/study")
            }
        })

    })
    //--------------------------- Delete Teachers GET -----------------------
router.get("/teachers/delete/:id", async(req, res) => {
    await Teacher.findByIdAndDelete(req.params.id)
    res.redirect("/study")
})




//---------------------------- Add Students GET ---------------------------
router.get('/students/add', async(req, res) => {
        const groups = await Group.find()
        const teachers = await Teacher.find()
        res.render('TeacherGroupStudent/addStudent', {
            layout: 'admin',
            title: 'Create Student',
            teachers,
            groups,
        })
    })
    //---------------------------- Edit Students GET --------------------------
router.get("/students/edit/:id", async(req, res) => {
        const student = await Student.findById(req.params.id)
        const groups = await Group.find()
        res.render('TeacherGroupStudent/editStudent', {
            layout: 'admin',
            title: 'Edit Student',
            student, 
            groups,
        })
    })
    //---------------------------- Add Students POST --------------------------
    
router.post('/students/add', async(req, res) => {

    const {
        fullname,
        payment,
        comment,
        groupId
    } =  req.body
    delete req.body.fullname
    delete req.body.payment
    delete req.body.fullname
    delete req.body.comment
    delete req.body.groupId
    const muster = req.body
        
        const student = new Student({
            fullname,
            payment,
            comment,
            groupId,
            muster
        })
        await student.save()
        res.redirect('/study')
    })
    //---------------------------- Edit Students POST -------------------------
router.post("/students/edit/:id", async(req, res) => {
    console.log(req.body);
    const {
        fullname, 
        payment,
        comment,
        groupId
    } =  req.body
    delete req.body.fullname
    delete req.body.payment
    delete req.body.fullname
    delete req.body.comment
    delete req.body.groupId
    const muster = req.body
        await Student.findByIdAndUpdate(req.params.id, {fullname,
            payment,
            comment,
            groupId,
            muster})
        res.redirect("/study") 
    })
    //---------------------------- Delete Students GET ------------------------
router.get("/students/delete/:id", async(req, res) => {
    await Student.findByIdAndDelete(req.params.id)
    res.redirect("/study")
})
module.exports = router;