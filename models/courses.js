const { model, Schema } = require('mongoose')

const courseSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    subjectArea: {
        type: String,
        required: true
    },
    credits: {
        type: Number,
        required: true
    },
    instructor: {
        type: Object,
        required: false
    }
})

const Course = model('Course', courseSchema)

const createCourse = async (data, instructor) => {
    let success = false
    const { name, description, subjectArea, credits } = data
    if(![name, description, subjectArea, credits].every(prop => prop || prop === 0)) return success
    const course = new Course({ name, description, subjectArea, credits, instructor })
    try {
        const res = await course.save()
        if(res) success = true
    } catch(err) {
        console.error(`ERROR SAVING COURSE: ${err} ${JSON.stringify(data)}`)
    }
    return success
}

const updateCourse = async (data) => {
    let success = false
    try {
        const { 
            id = null, 
            name = null,
            description = null, 
            area = null, 
            credits = null 
        } = data
        console.log('Data in updateCourse: ', data)
        console.log(id, name, description, area, credits)
        if([id, name, description, area, credits].includes(null)) {
            console.log('Missing data in updateCourse')
            return success
        }
        console.log('Course id in updateCourse: ', id)
        const updateReq = await Course.findByIdAndUpdate(
            { _id: id },
            { name, description, area, credits },
            { new: true }
        )
        console.log('Update request: ', updateReq)
        if(updateReq) success = true
    } catch (error) {
        console.error(`Error updating course: ${err}`)
    }
    return success
}

const deleteCourse = async (courseId) => {
    let success = false
    if (!courseId) return success
    try {
        const result = await Course.findByIdAndDelete(courseId)
        if(result) success = true
    } catch (err) {
        console.error(`ERROR DELETING COURSE: ${err}`);
    }
    return success;
}

const getCourses = async (courseId = null, instructorId = null) => {
    let courses = []
    console.log('Course id: ', courseId, ' Instructor id: ', instructorId)
    try {
        if(typeof courseId == 'string') {
            courses.push(await Course.findOne({ _id: courseId }))
        } else {
            const coursesQuery = await Course.find()
            if(instructorId) {
                courses.push(...coursesQuery.filter(course => JSON.stringify(course).includes(instructorId)))
            } else {
                courses.push(...await Course.find())
            }
        }
    } catch(err) {
        console.error(`ERROR GETTING COURSES: ${err}`)
    }
    const res = courses.length ? courses.map(course => {
        const courseObj = course.toObject()
        courseObj.link = `/courses/${courseObj._id}`
        courseObj.registerLink = `/register/${courseObj._id}`
        return courseObj
    }) : []
    return res
}

module.exports = { Course, createCourse, getCourses, updateCourse, deleteCourse }
