import { Router } from 'express'
import { authenticateToken } from '../middleware/auth'
import {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getLeads,
  createLead,
  getDeals,
  createDeal,
  updateDealStage,
  getActivities,
  createActivity,
  getPipelineStages,
  createPipelineStage,
  getCRMAnalytics
} from '../controllers/crmController'

const router = Router()

// Apply authentication middleware to all routes
router.use(authenticateToken)

// Customer routes
router.get('/customers', getCustomers)
router.get('/customers/:id', getCustomer)
router.post('/customers', createCustomer)
router.put('/customers/:id', updateCustomer)
router.delete('/customers/:id', deleteCustomer)

// Lead routes
router.get('/leads', getLeads)
router.post('/leads', createLead)

// Deal routes
router.get('/deals', getDeals)
router.post('/deals', createDeal)
router.put('/deals/:id/stage', updateDealStage)

// Activity routes
router.get('/activities', getActivities)
router.post('/activities', createActivity)

// Pipeline routes
router.get('/pipeline/stages', getPipelineStages)
router.post('/pipeline/stages', createPipelineStage)

// Analytics route
router.get('/analytics', getCRMAnalytics)

export default router
