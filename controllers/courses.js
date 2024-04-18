const { getCourses, createCourse, updateCourse, deleteCourse } = require('../models/courses')

const coursesController = {
    get: async (req, res) => {
        let data = []
        const courseId = req.params?.courseId,
              { user = {} } = req?.session,
              cart = req?.session?.cart || [],
              isInstructor = user?.role === 'instructor',
              isStudent = user?.role !== 'instructor'

        let enrolledInCourse = false, 
            courseInCart = false
        if(courseId && user?.courses) {
            enrolledInCourse = user.courses.findIndex(course => course._id === courseId) > -1
        }
        if(courseId && cart) {
            courseInCart = cart.findIndex(course => course._id === courseId) > -1
        }
        try {
            data = typeof courseId == 'string' ? await getCourses(courseId) : await getCourses()
        } catch(err) {
            console.error(`ERROR GETTING COURSES IN CONTROLLER: ${err}`)
        }
        if(req.query?.updating) return res.render('updateCourse', { course: data[0] })
        if(courseId) {
            return res.render('singleCourse', { 
                course: data[0], 
                user,
                isInstructor, 
                isStudent, 
                enrolledInCourse, 
                courseInCart,
                isCourseCreator: data[0].instructor?.email == user?.email
            })
        } else {
            return res.render('courses', { 
                courses: data, 
                user, 
                isInstructor, 
                isStudent 
            })
        }
    },
    post: async (req, res) => {
        let success = false
        try {
            let user = req.session?.user
            const course = await createCourse(req.body, user)
            console.log('Course: ', course)
            success = true
        } catch(err) {
            console.error(`ERROR CREATING COURSE IN CONTROLLER: ${err}`)
        }
        res.render('courses')
    },
    put: async (req, res) => {
        let success = false
        try {
            success = await updateCourse(req.body)
        } catch(err) {
            console.error(`ERROR UPDATING COURSE IN CONTROLLER: ${err}`)
        }
        return success ? res.status(200).send('Course updated') : res.status(500).send('Error updating course')
    },
    del: async (req, res) => {
        console.log('Hit delete')
        let success = false
        try {
            const course = req.query.courseId
            const user = req.session.user
            console.log('Course in controller: ', course)
            console.log('User: ', user)
            const deleteReq = await deleteCourse(course, user)
            console.log('Delete request: ', deleteReq)
            success = deleteReq ? true : false
        } catch(err) {
            console.error(`ERROR DELETING COURSE IN CONTROLLER: ${err}`)
        }
        return success
    }
}

module.exports = coursesController