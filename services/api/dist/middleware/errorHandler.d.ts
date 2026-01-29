import { Request, Response, NextFunction } from 'express';
export interface AppError extends Error {
    statusCode?: number;
    code?: string;
    details?: any;
}
export declare const errorHandler: (err: AppError, req: Request, res: Response, next: NextFunction) => void;
export declare const createError: (message: string, statusCode?: number, code?: string, details?: any) => AppError;
export declare const asyncHandler: (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => (req: Request, res: Response, next: NextFunction) => void;
