import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';
import ApiError from '../utils/apiError.js';
import type { Request, Response } from 'express';
import {createSubTaskService,deleteSubTaskService,getTaskByIdService,getTasksService,createTaskService,deleteTaskService,updateSubTaskService,updateTaskService} from '../services/task.service.js'

export const getTasks = asyncHandler(async(req:Request,res:Response)=>{})


export const createTask = asyncHandler(async(req:Request,res:Response)=>{})


export const getTaskById = asyncHandler(async(req:Request,res:Response)=>{})


export const updateTask = asyncHandler(async(req:Request,res:Response)=>{})


export const deleteTask = asyncHandler(async(req:Request,res:Response)=>{})


export const createSubTask = asyncHandler(async(req:Request,res:Response)=>{})


export const updateSubTask = asyncHandler(async(req:Request,res:Response)=>{})


export const deleteSubTask = asyncHandler(async(req:Request,res:Response)=>{})

