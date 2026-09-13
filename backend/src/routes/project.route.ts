/*
GET / - List user projects (secured)
POST / - Create project (secured, Admin only)
GET /:projectId - Get project details (secured)
PUT /:projectId - Update project (secured, Admin only)
DELETE /:projectId - Delete project (secured, Admin only)
GET /:projectId/members - List project members (secured)
POST /:projectId/members - Add project member (secured, Admin only)
PUT /:projectId/members/:userId - Update member role (secured, Admin only)
DELETE /:projectId/members/:userId - Remove member (secured, Admin only)
*/
import express from 'express';
import {
  addProjectMember,
  createProject,
  deleteProject,
  getProjectDetails,
  listProjectMembers,
  listUserProjects,
  removeMember,
  updateMemberRole,
  updateProject,
} from '../controllers/project.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';
import { UserRole } from '../utils/constants.js';

const router = express.Router();

router.route('/').get(verifyJWT, listUserProjects);

router.route('/').post(verifyJWT, authorizeRoles(UserRole.ADMIN), createProject);

router.route('/:projectId').get(verifyJWT, getProjectDetails);

router.route('/:projectId').put(verifyJWT, authorizeRoles(UserRole.ADMIN), updateProject);

router.route('/:projectId').delete(verifyJWT, authorizeRoles(UserRole.ADMIN), deleteProject);

router.route('/:projectId/members').get(verifyJWT, listProjectMembers);

router
  .route('/:projectId/members')
  .post(verifyJWT, authorizeRoles(UserRole.ADMIN), addProjectMember);

router
  .route('/:projectId/members/:userId')
  .put(verifyJWT, authorizeRoles(UserRole.ADMIN), updateMemberRole);

router
  .route('/:projectId/members/:userId')
  .delete(verifyJWT, authorizeRoles(UserRole.ADMIN), removeMember);

export default router;
