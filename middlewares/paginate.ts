import { Response, NextFunction } from 'express';
import { STATUS_CODES } from '../config/constants';
import { AuthenticatedRequest, PaginatedResponse } from '../types';

export const paginate = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    const page = Math.max(1, Number(req.query?.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query?.limit) || 10));
    const offset = (page - 1) * limit;

    req.pagination = {
      page,
      limit,
      offset
    };

    next();
  } catch (error) {
    console.error('Error in paginate middleware:', error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'An error occurred while processing pagination parameters',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
};

export const paginatedResponse = <T>(
  rows: T[],
  count: number,
  pageNo?: number,
  limitPerPage?: number
): PaginatedResponse<T> => {
  try {
    const page = pageNo || 1;
    const limit = limitPerPage || 10;
    const total = Number(count) || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: rows || [],
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    };
  } catch (error) {
    console.error('Error in paginatedResponse helper:', error);
    return {
      success: true,
      data: rows || [],
      pagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false
      }
    };
  }
};

