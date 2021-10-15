const { Router } = require("express");
const router = Router();
const Income = require("../../models/Income");
const Expense = require("../../models/Expense");
const moment = require("moment");

const compareNumbers = (a, b) => {
    return +b.time - +a.time;
};

const totalMonthPayment = (arr) => {
    let total = 0;
    arr.map((c) => {
        if (Math.floor(c.date / 100) === +moment(new Date()).format("YYYYMM")) {
            total = total + c.payment;
        }
    });
    return total;
};
const totalPayment = (arr) => {
    let total = 0;
    arr.map((c) => {
        total = total + c.payment;
    });
    return total;
};

router.get("/monthly", async(req, res) => {
    const income = await Income.find();
    const expense = await Expense.find();

    const arch = [...income, ...expense];
    arch.sort(compareNumbers);
    const archive = arch.filter((c) => {
        const month = moment(new Date()).format("YYYYMM");
        if (+month === Math.floor(c.date / 100)) {
            return c;
        }
    });

    archive.map((c) => {
        c.time = moment(c.time / 1000).format("llll");
    });

    res.render("payment/monthly", {
        title: "Ежемесячный платеж",
        archive,
        totalIncome: totalMonthPayment(income),
        totalExpense: totalMonthPayment(expense),
    });
});

router.get("/all/statistic", async(req, res) => {
    const income = await Income.find();
    const expense = await Expense.find();
    const archiveIncome = [...income];
    const archiveExpense = [...expense];
    archiveIncome.sort(compareNumbers);
    archiveIncome.map((c) => {
        c.time = moment(c.time / 1000).format("llll");
    });
    archiveExpense.sort(compareNumbers);
    archiveExpense.map((c) => {
        c.time = moment(c.time / 1000).format("llll");
    });
    res.render("payment/statistic", {
        title: "Общие платежи",
        archiveIncome,
        archiveExpense,
        totalIncome: totalPayment(income),
        totalExpense: totalPayment(expense),
    });
});

router.get("/chart/statistic", async(req, res) => {
    const income = await Income.find();
    const expense = await Expense.find();

    const incmPayment = income.map((c) => {
        return c.payment;
    });

    const expnsPayment = expense.map((c) => {
        return c.payment;
    });

    const incmDate = income.map((c) => {
        return c.date;
    });

    const expnsDate = expense.map((c) => {
        return c.date;
    });
    console.log(incmPayment);
    const obj = { expnsPayment, expnsDate, incmPayment, incmDate }
    res.status(200).json(obj)
});

module.exports = router;