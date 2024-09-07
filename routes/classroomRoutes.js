const express = require('express');
const Classroom = require('../models/classroomModel');
const responseFunction = require('../utils/responseFunction');
const authTokenHandler = require('../middlewares/checkAuthToken');
const router = express.Router();

router.post('/create', authTokenHandler, async (req, res) => {
    const { name, description } = req.body;
    if (!name) {
        return responseFunction(res, 400, 'Classroom name is required', null, false);
    }

    try {
        const newClassroom = new Classroom({
            name,
            description,
            owner: req.userId, // Set the owner to the current user
        });

        await newClassroom.save();
        return responseFunction(res, 201, 'Classroom created successfully', newClassroom, true);

    }
    catch (err) {
        return responseFunction(res, 500, 'Internal server error', err, false);
    }

})

router.get('/classroomscreatedbyme', authTokenHandler, async (req, res) => {
    try {
        const classrooms = await Classroom.find({ owner: req.userId });

        return responseFunction(res, 200, 'Classrooms fetched successfully', classrooms, true);
    } catch (err) {
        return responseFunction(res, 500, 'Internal server error', err, false);
    }
})
module.exports = router;
