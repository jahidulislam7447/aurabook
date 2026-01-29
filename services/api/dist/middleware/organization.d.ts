import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
export interface OrganizationRequest extends AuthenticatedRequest {
    organization?: {
        id: string;
        name: string;
        slug: string;
        type: string;
        plan: string;
        status: string;
        ownerId: string;
    };
    userRole?: {
        id: string;
        role: {
            name: string;
            permissions: Array<{
                resource: string;
                action: string;
            }>;
        };
    };
}
export declare const organizationMiddleware: (req: OrganizationRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const requirePermission: (resource: string, action: string) => (req: OrganizationRequest, res: Response, next: NextFunction) => void;
export declare const requireRole: (roleName: string) => (req: OrganizationRequest, res: Response, next: NextFunction) => void;
export declare const requireOwnership: (req: OrganizationRequest, res: Response, next: NextFunction) => void;
