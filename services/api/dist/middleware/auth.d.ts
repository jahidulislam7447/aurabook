import { Request, Response, NextFunction } from 'express';
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        emailVerified: boolean;
        twoFactorEnabled: boolean;
    };
}
export declare const authMiddleware: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const optionalAuthMiddleware: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const requireEmailVerification: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export declare const requireTwoFactorAuth: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
