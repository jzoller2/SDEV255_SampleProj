const { getUser } = require('../models/user')

const dashboardController = {
    get: async (req, res) => {
        const user = req.session?.user
        if(!user) {
            return res.redirect('/login')
        } else {
            console.log('User.courses: ', JSON.stringify(user.courses))
            const newUser = await getUser(null, user.email)
            console.log(newUser.courses)
            req.session.user.courses = newUser.courses
            res.render('dashboard', { user, isInstructor: user.role === 'instructor' })
        }
    }
}

module.exports = dashboardController