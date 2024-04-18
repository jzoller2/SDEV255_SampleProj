const router = require('express').Router()

router.get('/', (req, res) => res.render('index'))
router.get('/add-course', (req, res) => res.render('addCourse'))
router.use('/courses', require('./courses'))
router.use('/login', require('./login'))
router.use('/logout', require('./logout'))
router.use('/register', require('./register'))
router.use('/dashboard', require('./dashboard'))
router.use('/user-courses', require('./userCourses'))
router.use('/cart', require('./cart'))
router.use((req, res) => res.status(404).render('404'))


module.exports = router