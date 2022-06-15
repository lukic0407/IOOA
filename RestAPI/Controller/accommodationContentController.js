const accommodationContentModel = require('../models/accommodationContentModel');
const accommodationContentCategoriesModel = require('../models/acommodationContentCategoriesModel')

const addAccommodationContent = async (req, res) => {
    var icon = '';
    if (req?.files?.icon) {
        icon = req?.files?.icon[0]?.path;
    }
    console.log("here");
    const {
        name,
        category_id,
        new_category
    } = req.body

    if (category_id) {
            const findAccommodationContent = await accommodationContentCategoriesModel.findById( category_id);
            console.log(findAccommodationContent.name);
            if (!name) {
                return res.status(400).json("message: Bad user data")
            }

            const accommodationContent = new accommodationContentModel({
                name: name,
            })

            try {
                const newAccommodationContent = await accommodationContent.save();
                //status 201 - objekt kreiran
                const newContent = [...findAccommodationContent.content,newAccommodationContent._id];
                findAccommodationContent.content = newContent;
                findAccommodationContent.save();
                res.status(201).json(newAccommodationContent);
            } catch (err) {
                //status 400 - User dao krive podatke
                res.status(500).json({ message: err.message })
            }

    } else {
        if (!icon || !new_category) {
            return res.status(400).json("message: Bad user data")
        }
        const content = [];
        const accommodationContentCategory = new accommodationContentCategoriesModel({
            category: new_category,
            category_icon: icon
        })
        try {
            const newAccommodationContentCategory = await accommodationContentCategory.save();
            //status 201 - objekt kreiran
            res.status(201).json(newAccommodationContentCategory);
        } catch (err) {
            //status 400 - User dao krive podatke
            res.status(500).json({ message: err.message })
        }

    }
}



const getAccommodationContent = async (req,res)=>{
    try{
        const newaccommodationContentCategories = await accommodationContentCategoriesModel.find().populate("content", "name");
        res.json(newaccommodationContentCategories);
    }catch(err){
        res.status(500).json({message: err.message});
    }
}

const deleteAccommodationContent = async (req,res)=>{
    const content_id = req.params.id;
    console.log(req.params)
    try{ 
        const accommodationContent = await accommodationContentModel.findById(content_id);
        if(accommodationContent==null){
            return res.status(404).json({message: 'Cannon find accommodation Content'})
        }
        await accommodationContent .remove()
        res.status(200).json("Sucessfully deleted accommodation Content");
    }catch(err){
        console.log(err);
        return res.status(500).json({message: err.message})
    }
}

const deleteAccommodationCategory = async (req,res)=>{
    const category_id = req.params.id;
    console.log(req.params)
    try{ 
        const accommodationContentCategory = await accommodationContentCategoriesModel.findById(category_id);
        if(accommodationContentCategory==null){
            return res.status(404).json({message: 'Cannon find accommodation Content'})
        }
        await accommodationContentCategory.remove()
        res.status(200).json("Sucessfully deleted accommodation content category");
    }catch(err){
        console.log(err);
        return res.status(500).json({message: err.message})
    }
}

module.exports = {
    getAccommodationContent,
    addAccommodationContent,
    deleteAccommodationContent,
    deleteAccommodationCategory
}

