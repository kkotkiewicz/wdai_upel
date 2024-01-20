var express = require('express');
var router = express.Router();
const Course = require('../models/Course');
const mongooseConnect = require('../lib/mongoose');


router.get('/', function(req, res, next) {
  mongooseConnect();
  Course.find()
    .then(courses => res.json(courses))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.get('/:id', function(req, res, next) {
  mongooseConnect();
  Course.findById(req.params.id)
    .then(course => res.json(course))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.post('/', function(req, res, next) {
  mongooseConnect();

  const course_name = req.body.course_name;
  const course_description = req.body.course_description;
  const course_photos = req.body.course_photos;
  const course_category = req.body.course_category;
  const course_price = req.body.course_price;

  const newCourse = new Course({
    course_name,
    course_description,
    course_photos,
    course_category,
    course_price,
  });

  newCourse.save()
    .then(() => res.json('Course added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;