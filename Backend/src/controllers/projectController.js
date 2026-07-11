import projectModel from "../models/projectModel.js";
import { createProject, getAllProjectByUserId, getProjectById } from "../service/projectService.js";
import {validationResult} from 'express-validator'
import userModel from '../models/userModel.js'

export const createProjectController = async (req,res) => {

    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({error: error.array()})
    }

    try{
        const {name} = req.body;
    const loggedInUser = await userModel.findOne({email: req.user.email})

    const userId = loggedInUser._id

    const newProject = await createProject({name , userId})

    res.status(201).json(newProject)
    }
    catch(err){
        console.log(err)
        res.status(500).send(err.message)
    }
}

export const getAllProject = async (req, res) => {
    try {

        const loggedInUser = await userModel.findOne({
            email: req.user.email
        })

        const allUserProjects = await getAllProjectByUserId({
            userId: loggedInUser._id
        })

        return res.status(200).json({
            projects: allUserProjects
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }
}

export const getProjectsById = async(req, res) => {
    const {projectId} = req.params

    try{
        const project = await getProjectById({
            projectId
        })

        return res.status(200).json({
            project
        })
    }catch(err){
        console.log(err)
        res.status(400).json({error: err.message})
    }
}
export const addUserToProject  = async(req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }
    try{
        const {projectId , users} = req.body

        const loggedInUser = await userModel.findOne({email: req.user.email})

        const project = await addUserToProject({
            projectId,
            users,
            userId: loggedInUser._id
        })
        return res.status(200).json({
            project
        })

    }catch(err){
        console.log(err)
        res.status(400).json({error: error.message})
    }
}