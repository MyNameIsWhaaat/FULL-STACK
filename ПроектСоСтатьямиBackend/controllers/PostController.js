import PostModule from "../modules/Post.js"

export const getOne = async (req, res) => {
    try{
        const postId = req.params.id;

        const doc = await PostModule.findOneAndUpdate({
            _id: postId,
        },
        {
            $inc:{viewsCount:1},
        },
        {
            returnDocument: 'after',
        },

        );

        if(!doc){
            return res.status(404).json({
                message: 'Статья не найдена'
            });
        }

        res.json(doc);
        
        
    }catch(err){
        console.log(err);
        res.status(500).json({
            message: 'Не удалось прочитать статью'
        })
    }

}

export const remove = async (req, res) => {
    try{
        const postId = req.params.id;
        
        const doc = await PostModule.findOneAndDelete({
            _id: postId,
        });

        if(!doc){
            return res.status(404).json({
                message: 'Статья не найдена'
            });
        }

        res.json({
            success: true
        })
        
    }catch(err){
        console.log(err);
        res.status(500).json({
            message: 'не удалось удалить статью'
        })
    }

}

export const getAll = async (req, res) => {
    try{
        const posts = await PostModule.find().populate('user').exec();

        res.json(posts);
    }catch(err){
        console.log(err);
        res.status(500).json({
            message: 'не удалось прочитать статьи'
        })
    }

}

export const create = async (req, res) => {
    try{
        const doc = new PostModule(
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                user: req.userId,
            }
        );

        const post = await doc.save();

        res.json(post);

    }catch(err){
        console.log(err);
        res.status(500).json({
            message: 'не удалось создать статью'
        })
    }
}

export const update = async (req, res) =>{
    try{
        const postId = req.params.id;

        await PostModule.updateOne({
            _id: postId,
        },
        {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        },
        );

        res.json({
            success: true
        })

    }catch(err){
        console.log(err);
        res.status(500).json({
            message: 'не удалось обновить статью'
        })
    }
}

export const getLastTags = async(req, res)=>{
    try{
        const posts = await PostModule.find().limit(5).exec();

        const tags = posts.map(obj => obj.tags).flat().slice(0,5);

        res.json(tags);
    }catch(err){
        console.log(err);
        res.status(500).json({
            message: 'не удалось прочитать статьи'
        })
    }
}