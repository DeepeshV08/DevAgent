import {Router} from 'express'
import { body } from 'express-validator';2
import { addUserToProject, createProjectController, getAllProject, getProjectsById } from '../controllers/projectController.js';
import { authUser } from '../middlewares/authMiddleware.js';

const projectRouter = Router();

projectRouter.post('/create',
     body('name').isString().withMessage("Name is required"),
     authUser,
     createProjectController
)

projectRouter.get('/all', authUser, getAllProject)

projectRouter.get('/get-project/:projectId', 
    authUser,
    getProjectsById
)

projectRouter.put('/add-user',
    authUser,
    body('projectId').isString().withMessage('Project ID is required'),
    body('users').isArray({ min: 1 }).withMessage('Users must be an array of strings').bail()
        .custom((users) => users.every(user => typeof user === 'string')).withMessage('Each user must be a string'),
    addUserToProject
)

export default projectRouter