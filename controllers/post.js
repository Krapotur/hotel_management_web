const Post = require('../models/Post')
const errorHandler = require('../utils/errorHandler')


module.exports.getAll = async function (req, res) {
    try {
        Post.find().then(
            posts => {
                res.status(200).json(posts)
            }
        )
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getById = async function (req, res) {
    try {
        const post = await Post.findById({_id: req.params.id})
        await res.status(200).json(post)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.create = async function (req, res) {
    try {
        if (await Post.findOne({title: req.body.title})) {
            res.status(409).json({
                message: `"${req.body.title}" уже существует`
            })
        } else {
            const post = new Post({
                title: req.body.title
            })

            await post.save()
            res.status(201).json({
                message: `Должность "${req.body.title}" успешно создана`
            })
        }
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.delete = async function (req, res) {
    console.log(req.params.id)
    try {
        const post = await Post.findById({_id: req.params.id})
        await Post.deleteOne({_id: post._id})
        res.status(200).json({message: `Должность "${post.title}" удалена`})
    } catch (e) {
        errorHandler(res, e)
    }
}


module.exports.update = async function (req, res) {

    const updated = {
        title: req.body.title
    }

    try {
        const post = await Post.findByIdAndUpdate(
            {_id: req.params.id},
            {$set: updated},
            {new: true}
        )
        res.status(200).json({
            message: 'Изменения внесены'
        })
    } catch (e) {
        errorHandler(res, e)
    }
}

