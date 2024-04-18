const { updateUserCourses } = require('../models/user')
const { getCourses } = require('../models/courses')

const controller = {
    get: async (req, res) => {
        const user = req.session?.user
        const cart = req.session?.cart || []
        if(!user) {
            return res.redirect('/login')
        } else {
            res.render('cart', { cart })
        }
    },
    post: async (req, res) => {
        let success = false
        console.log('req.body: ', req.body)
        if(!req.session?.user) {
            return res.redirect('/login')
        }
        const {
            itemToUpdate = null,
            cartAction = 'remove'
        } = req.body
        let cart = req.session?.cart || []
        switch(cartAction) {
            case 'add':
                if(!JSON.stringify(cart).includes(itemToUpdate)) {
                    console.log('Hit add')
                    const courseArr = await getCourses(itemToUpdate)
                    courseArr.length ? cart.push(courseArr[0]) : null
                }
                break
            case 'remove':
                cart = cart.filter(({ _id }) => _id != itemToUpdate._id)
                success = true
                console.log('Hit remove: ', cart)
                break
            case 'clear':
                console.log('Hit clear')
                success = true
                cart = []
                break
            case 'enrollSingle':
                console.log('Hit enrollSingle: ', cart)
                await updateUserCourses(itemToUpdate, req.session.user, true)
                cart = cart.filter(({ _id }) => _id != itemToUpdate)
                success = true
                break
            case 'enrollAll':
                console.log('Hit enrollAll: ', cart)
                cart.forEach(async course => await updateUserCourses(course._id, req.session.user, true))
                success = true
                cart = []
            default:
                break
        }
        req.session.cart = cart
        res.status(success ? 200 : 500).json({ success })
        //res.redirect('/cart')
    }
}

module.exports = controller