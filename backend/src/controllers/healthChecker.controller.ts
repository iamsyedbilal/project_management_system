import type { Request, Response } from 'express';
import ApiResponse from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const healthCheck = asyncHandler(async (req: Request, res: Response) => {
  return res.status(200).json(new ApiResponse(200, 'Health check successful'));
});
