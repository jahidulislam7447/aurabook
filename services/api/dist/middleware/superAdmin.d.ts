import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
export declare const requireSuperAdmin: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
