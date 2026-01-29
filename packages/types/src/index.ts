// User & Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthProvider {
  id: string;
  name: 'google' | 'github' | 'email';
  providerId: string;
  userId: string;
  createdAt: Date;
}

// Organization Types
export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  domain?: string;
  type: OrganizationType;
  plan: SubscriptionPlan;
  status: OrganizationStatus;
  settings: OrganizationSettings;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum OrganizationType {
  BUSINESS = 'business',
  ENTERPRISE = 'enterprise',
  AGENCY = 'agency'
}

export enum OrganizationStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  CANCELLED = 'cancelled'
}

export interface OrganizationSettings {
  timezone: string;
  dateFormat: string;
  currency: string;
  language: string;
  theme: 'light' | 'dark' | 'system';
}

// Role & Permission Types
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  organizationId: string;
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description: string;
}

export interface UserRole {
  id: string;
  userId: string;
  organizationId: string;
  roleId: string;
  invitedBy: string;
  joinedAt: Date;
  status: 'active' | 'invited' | 'suspended';
}

export enum SystemRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MANAGER = 'manager',
  STAFF = 'staff'
}

// Subscription & Billing Types
export interface Subscription {
  id: string;
  organizationId: string;
  planId: string;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  trialEnd?: Date;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum SubscriptionStatus {
  TRIALING = 'trialing',
  ACTIVE = 'active',
  PAST_DUE = 'past_due',
  CANCELED = 'canceled',
  UNPAID = 'unpaid'
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: PlanFeature[];
  apps: string[];
  stripePriceId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlanFeature {
  name: string;
  value: string | number | boolean;
  description?: string;
}

export interface Invoice {
  id: string;
  organizationId: string;
  subscriptionId: string;
  stripeInvoiceId?: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  dueDate: Date;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum InvoiceStatus {
  DRAFT = 'draft',
  OPEN = 'open',
  PAID = 'paid',
  VOID = 'void',
  UNCOLLECTIBLE = 'uncollectible'
}

// App Marketplace Types
export interface App {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  logo: string;
  screenshots: string[];
  version: string;
  category: AppCategory;
  tags: string[];
  features: string[];
  pricing: AppPricing;
  dependencies: string[];
  developer: string;
  website?: string;
  documentation?: string;
  isActive: boolean;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum AppCategory {
  CRM = 'crm',
  ERP = 'erp',
  POS = 'pos',
  HR = 'hr',
  PROJECT_MANAGEMENT = 'project_management',
  ACCOUNTING = 'accounting',
  INVENTORY = 'inventory',
  ECOMMERCE = 'ecommerce',
  COMMUNICATION = 'communication',
  ANALYTICS = 'analytics',
  CUSTOM = 'custom'
}

export interface AppPricing {
  type: 'free' | 'paid' | 'freemium';
  basePrice?: number;
  currency?: string;
  billingInterval?: 'month' | 'year';
  trialDays?: number;
}

export interface OrganizationApp {
  id: string;
  organizationId: string;
  appId: string;
  status: 'active' | 'inactive' | 'suspended';
  settings: Record<string, any>;
  enabledAt?: Date;
  disabledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  organizationId?: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  readAt?: Date;
  createdAt: Date;
}

export enum NotificationType {
  SYSTEM = 'system',
  BILLING = 'billing',
  APP_UPDATE = 'app_update',
  INVITATION = 'invitation',
  SECURITY = 'security'
}

// Analytics Types
export interface AnalyticsEvent {
  id: string;
  organizationId: string;
  userId?: string;
  event: string;
  properties: Record<string, any>;
  timestamp: Date;
}

export interface UsageMetrics {
  organizationId: string;
  period: 'daily' | 'weekly' | 'monthly';
  activeUsers: number;
  apiCalls: number;
  storageUsed: number;
  appUsage: Record<string, number>;
  timestamp: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Common Utility Types
export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface TableColumn<T = any> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => any;
}

export interface FilterOption {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'contains';
  value: any;
}

// Dashboard Types
export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  size: WidgetSize;
  position: { x: number; y: number };
  config: Record<string, any>;
  data?: any;
}

export enum WidgetType {
  CHART = 'chart',
  METRIC = 'metric',
  TABLE = 'table',
  LIST = 'list',
  CUSTOM = 'custom'
}

export enum WidgetSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  FULL = 'full'
}

// Integration Types
export interface Integration {
  id: string;
  name: string;
  type: IntegrationType;
  config: Record<string, any>;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: Date;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum IntegrationType {
  STRIPE = 'stripe',
  GOOGLE_WORKSPACE = 'google_workspace',
  SLACK = 'slack',
  ZAPIER = 'zapier',
  WEBHOOK = 'webhook',
  CUSTOM = 'custom'
}
