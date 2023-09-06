const { isAdmin } = require("../middleware/auth");
const LeaveForm = require("./../models/leaveForm");
const router = require("express").Router();

//apply for leave
router.post("/", async (req, res) => {
  try {
    const startDate = new Date(req.body["Start date of leave"]);
    const endDate = new Date(req.body["End date of leave"]);
    const startDateYear = new Date(process.env.START_DATE);
    const endDateYear = new Date(process.env.END_DATE);

    if (
      startDate < startDateYear ||
      startDate > endDateYear ||
      endDate < startDateYear ||
      endDate > endDateYear
    ) {
      return res.status(400).send("You can only apply for leave in this year");
    }
    //num of days between dates
    const numOfDays = (endDate - startDate) / 86400000 + 1;

    //number of the day in the week
    const startDateWeekDate = startDate.getUTCDay();
    //number of not working days
    const numOfNotWorkingDays =
      Math.floor((startDateWeekDate + numOfDays) / 7) * 2;

    //num of working days
    const countOfWorkingDays = numOfDays - numOfNotWorkingDays;

    if (countOfWorkingDays > 20) {
      return res.status(400).send("Limit is 20 vac days per year");
    }

    //get prevously used vac days
    const result = await LeaveForm.aggregate([
      {
        $match: { state: "Approved" },
      },
      {
        $group: {
          _id: null,
          totalVacDays: { $sum: "$Count of working days between set dates" },
        },
      },
    ]);
    if (result[0]) {
      const totalVacDays = result[0].totalVacDays;
      if (totalVacDays + countOfWorkingDays > 20) {
        return res.status(403).send("Limit of vacation days reached");
      }
    }

    const newLeaveForm = new LeaveForm({
      "User identifier": req.user.email,
      "Count of working days between set dates": countOfWorkingDays,
      ...req.body,
    });

    await newLeaveForm.save();

    res.send("Successfully sent!");
  } catch (error) {
    res.status(400).send("Provide correct information!");
  }
});

//delete apply form if it is in pending state

router.delete("/:id", async (req, res) => {
  try {
    const leaveId = req.params.id;
    const applyForm = await LeaveForm.findById(leaveId);

    if (!applyForm) return res.status(404).send("Form not found");

    if (applyForm.state !== "Pending")
      return res.status(403).send("Unable to perform action");

    await LeaveForm.deleteOne({ _id: applyForm._id });
    res.status(200).send("Successfully deleted");
  } catch (error) {
    res.status(400).send("Unable to delete!");
  }
});
//update apply form if it is in pending state

router.patch("/:id", async (req, res) => {
  const leaveId = req.params.id;
  try {
    //update total vacation days

    const startDate = new Date(req.body["Start date of leave"]);
    const endDate = new Date(req.body["End date of leave"]);
    const startDateYear = new Date(process.env.START_DATE);
    const endDateYear = new Date(process.env.END_DATE);
    let dataForUpdate = req.body;

    const applyForm = await LeaveForm.findById(leaveId);
    if (!applyForm) return res.status(404).send("Form not found");

    if (applyForm.state !== "Pending")
      return res.status(403).send("Unable to perform update action");

    if (
      new Date(applyForm["Start date of leave"]) !== startDate ||
      new Date(applyForm["End date of leave"]) !== endDate
    ) {
      if (
        startDate < startDateYear ||
        startDate > endDateYear ||
        endDate < startDateYear ||
        endDate > endDateYear
      ) {
        return res
          .status(400)
          .send("You can only apply for leave in this year");
      }
      //num of days between dates
      const numOfDays = (endDate - startDate) / 86400000 + 1;

      //number of the day in the week
      const startDateWeekDate = startDate.getUTCDay();
      //number of not working days
      const numOfNotWorkingDays =
        Math.floor((startDateWeekDate + numOfDays) / 7) * 2;

      //num of working days
      const countOfWorkingDays = numOfDays - numOfNotWorkingDays;

      if (countOfWorkingDays > 20) {
        return res.status(400).send("Limit is 20 vac days per year");
      }

      //get prevously used vac days
      const result = await LeaveForm.aggregate([
        {
          $match: { state: "Approved" },
        },
        {
          $group: {
            _id: null,
            totalVacDays: { $sum: "$Count of working days between set dates" },
          },
        },
      ]);
      if (result[0]) {
        const totalVacDays = result[0].totalVacDays;
        if (totalVacDays + countOfWorkingDays > 20) {
          return res.status(403).send("Limit of vacation days reached");
        }
      }
      dataForUpdate = {
        ...req.body,
        "Count of working days between set dates": countOfWorkingDays,
      };
    }
    //******************** */

    await LeaveForm.findByIdAndUpdate(leaveId, dataForUpdate, {
      new: true,
      runValidators: true,
    });
    res.status(200).send(dataForUpdate);
  } catch (error) {
    res.status(400).send("Unable to update!");
  }
});

//get all leave forms for logged in user

router.get("/", async (req, res) => {
  try {
    const forms = await LeaveForm.find({ "User identifier": req.user.email });

    res.send(forms);
  } catch (error) {
    res.status(500).send("Unable to return all leaves for logged in user!");
  }
});

//fetch info about all request and manipulate them
//filter,sort dec
//only admnin can perform

router.get("/listAll", isAdmin, async (req, res) => {
  const match = {};
  if (req.query.state) {
    match.state = req.query.state;
  }
  try {
    const forms = await LeaveForm.find(
      match,
      {},
      {
        sort: {
          "Date of creation": -1,
        },
      }
    );

    res.send(forms);
  } catch (error) {
    res.status(400).send("Unable to return all leaves!");
  }
});

//change form state
//admin

router.patch("/changeState/:id", isAdmin, async (req, res) => {
  try {
    const form = await LeaveForm.findByIdAndUpdate(
      req.params.id,
      {
        state: req.body.state,
      },
      { new: true, runValidators: true }
    );
    res.send(form);
  } catch (error) {
    res.status(400).send("Unable to change state!");
  }
});

//get specific leave form
router.get("/:id", async (req, res) => {
  try {
    const leaveId = req.params.id;
    const leaveForm = await LeaveForm.findById(leaveId);
    if (!leaveForm) return res.status(404).send();
    res.send(leaveForm);
  } catch (error) {
    res.status(400).send("Unable to get specific leave!");
  }
});

//report

router.post("/report", isAdmin, async (req, res) => {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  if (!startDate || !endDate)
    return res.status(400).send("Provide time interval");
  try {
    const result = await LeaveForm.aggregate([
      {
        $match: {
          state: "Approved",
          "Date of creation": {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: "$User identifier",
          totalVacDaysUsed: {
            $sum: "$Count of working days between set dates",
          },
          numOfApprovedLeaves: { $sum: 1 },
        },
      },
    ]);
    res.send(result);
  } catch (error) {
    res.status(500).send("Unable to generate report!");
  }
});
module.exports = router;
