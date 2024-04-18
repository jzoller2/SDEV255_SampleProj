const mongoose = require('mongoose'),
      bcrypt = require('bcrypt'),
      { getCourses } = require('./courses')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: false
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    lastName: {
        type: String,
        required: false
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['instructor', 'student'],
        required: true
    },
    courses: {
        type: Array,
        required: false
    }
})

const User = mongoose.model('User', userSchema)

const getUser = async (username, email) => {
    let user = null
    if(!username && !email) return user
    try {
        user = await User.findOne(username ? { username } : { email })
        if(user?.courses?.length) {
            const courses = []
            for(const courseId of user.courses) {
                const course = await getCourses(courseId)
                if(course.length) courses.push(course[0])
                courses.push(course[0])
            }
            console.log('Courses: ', courses)
            user.courses = courses
        }
        if(user.role === 'instructor') {
            user.courses = await getCourses(null, user._id)
        }
    } catch(err) {
        console.error(`ERROR GETTING USER: ${err}`)
    }
    console.log('User in model: ', user)
    return user
}

const createUser = async (userData) => {
    let success = false, 
        errMessage = 'User already exists, please try again.'
    const {
        username = null,
        password = null,
        role = null,
        firstName = null,
        lastName = null,
        email = null
    } = userData
    if (!username || !password || !role || !email || await getUser(username) !== null) {
        return {
            success,
            errMessage: 'Please provide a username, password, and role to register.'
        }
    }
    const hashedPassword = bcrypt.hashSync(password, 10)
    try {
        const newUser = new User({
            email,
            username,
            password: hashedPassword,
            role,
            firstName,
            lastName,
            courses: []
        })
        console.log('New user: ', newUser)
        const save = await newUser.save()
        if(save) {
            success = true
            errMessage = null
        }
        console.log('Save: ', save)
    } catch(err) {
        console.error(`ERROR CREATING USER: ${err}`)
    }
    console.log('Success: ', success, 'Error message: ', errMessage)
    return { success, errMessage }
}

const updateUserCourses = async (courseId, user, isAdding) => {
    let updateObj = null
    if(!courseId || !user) return success
    try {
        const action = isAdding ? { $addToSet: { courses: courseId } } : { $pull: { courses: courseId } }
        const { _id } = user
        const dbReq = await User.findOneAndUpdate({ _id: _id }, action, { new: true })
        if(dbReq) {
            console.log('Updated user req: ', dbReq)
            const newUserRecord = await getUser(null, user.email)
            console.log('New user record: ', newUserRecord)
            updateObj = newUserRecord
        }
    } catch(err) {
        console.error(`ERROR ADDING COURSE TO USER: ${err}`)
    }
    return updateObj
}

const deleteAllUsers = async () => {
    try {
        // For testing
        await User.deleteMany()
    } catch(err) {
        console.error(`ERROR DELETING USERS: ${err}`)
    }
}

module.exports = { getUser, createUser, updateUserCourses, deleteAllUsers }