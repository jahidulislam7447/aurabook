import { Request, Response } from 'express'
import { Op } from 'sequelize'
import sequelize from '../config/database'
import { 
  Customer, 
  Lead, 
  Deal, 
  Activity, 
  PipelineStage
} from '../models/crm'
import { User } from '../models/user'
import { Organization } from '../models/organization'
import { AuthenticatedRequest } from '../middleware/auth'

// Customer Controllers
export const getCustomers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { page = 1, limit = 20, search, status, assignedTo } = req.query
    const organizationId = req.user!.organizationId

    const whereClause: any = { organizationId }
    
    if (search) {
      whereClause[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { company: { [Op.iLike]: `%${search}%` } }
      ]
    }
    
    if (status) whereClause.status = status
    if (assignedTo) whereClause.assignedTo = assignedTo

    const customers = await Customer.findAndCountAll({
      where: whereClause,
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'assignedUser',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    })

    res.json({
      customers: customers.rows,
      total: customers.count,
      page: Number(page),
      totalPages: Math.ceil(customers.count / Number(limit))
    })
  } catch (error) {
    console.error('Error fetching customers:', error)
    res.status(500).json({ error: 'Failed to fetch customers' })
  }
}

export const getCustomer = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params
    const organizationId = req.user!.organizationId

    const customer = await Customer.findOne({
      where: { id, organizationId },
      include: [
        {
          model: Deal,
          as: 'deals',
          include: [
            {
              model: Activity,
              as: 'activities'
            }
          ]
        },
        {
          model: Activity,
          as: 'activities',
          include: [
            {
              model: User,
              as: 'assignedUser',
              attributes: ['id', 'firstName', 'lastName', 'email']
            }
          ],
          order: [['createdAt', 'DESC']]
        },
        {
          model: User,
          as: 'assignedUser',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    })

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' })
    }

    res.json(customer)
  } catch (error) {
    console.error('Error fetching customer:', error)
    res.status(500).json({ error: 'Failed to fetch customer' })
  }
}

export const createCustomer = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const customerData = {
      ...req.body,
      organizationId: req.user!.organizationId
    }

    const customer = await Customer.create(customerData)
    
    // Log activity
    await Activity.create({
      organizationId: req.user!.organizationId,
      type: 'note',
      subject: 'New customer created',
      description: `Customer ${customer.firstName} ${customer.lastName} was added to the system`,
      customerId: customer.id,
      assignedTo: req.user!.id,
      status: 'completed'
    })

    res.status(201).json(customer)
  } catch (error) {
    console.error('Error creating customer:', error)
    res.status(500).json({ error: 'Failed to create customer' })
  }
}

export const updateCustomer = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params
    const organizationId = req.user!.organizationId

    const customer = await Customer.findOne({ where: { id, organizationId } })
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' })
    }

    await customer.update(req.body)
    
    // Log activity
    await Activity.create({
      organizationId,
      type: 'note',
      subject: 'Customer updated',
      description: `Customer ${customer.firstName} ${customer.lastName} information was updated`,
      customerId: customer.id,
      assignedTo: req.user!.id,
      status: 'completed'
    })

    res.json(customer)
  } catch (error) {
    console.error('Error updating customer:', error)
    res.status(500).json({ error: 'Failed to update customer' })
  }
}

export const deleteCustomer = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params
    const organizationId = req.user!.organizationId

    const customer = await Customer.findOne({ where: { id, organizationId } })
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' })
    }

    await customer.destroy()
    res.json({ message: 'Customer deleted successfully' })
  } catch (error) {
    console.error('Error deleting customer:', error)
    res.status(500).json({ error: 'Failed to delete customer' })
  }
}

// Lead Controllers
export const getLeads = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { page = 1, limit = 20, search, status, assignedTo } = req.query
    const organizationId = req.user!.organizationId

    const whereClause: any = { organizationId }
    
    if (search) {
      whereClause[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { company: { [Op.iLike]: `%${search}%` } }
      ]
    }
    
    if (status) whereClause.status = status
    if (assignedTo) whereClause.assignedTo = assignedTo

    const leads = await Lead.findAndCountAll({
      where: whereClause,
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'assignedUser',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    })

    res.json({
      leads: leads.rows,
      total: leads.count,
      page: Number(page),
      totalPages: Math.ceil(leads.count / Number(limit))
    })
  } catch (error) {
    console.error('Error fetching leads:', error)
    res.status(500).json({ error: 'Failed to fetch leads' })
  }
}

export const createLead = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const leadData = {
      ...req.body,
      organizationId: req.user!.organizationId
    }

    const lead = await Lead.create(leadData)
    
    // Log activity
    await Activity.create({
      organizationId: req.user!.organizationId,
      type: 'note',
      subject: 'New lead created',
      description: `Lead ${lead.firstName} ${lead.lastName} was added to the system`,
      leadId: lead.id,
      assignedTo: req.user!.id,
      status: 'completed'
    })

    res.status(201).json(lead)
  } catch (error) {
    console.error('Error creating lead:', error)
    res.status(500).json({ error: 'Failed to create lead' })
  }
}

// Deal Controllers
export const getDeals = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { page = 1, limit = 20, stage, status, assignedTo } = req.query
    const organizationId = req.user!.organizationId

    const whereClause: any = { organizationId }
    
    if (stage) whereClause.stage = stage
    if (status) whereClause.status = status
    if (assignedTo) whereClause.assignedTo = assignedTo

    const deals = await Deal.findAndCountAll({
      where: whereClause,
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'firstName', 'lastName', 'company', 'email']
        },
        {
          model: Lead,
          as: 'lead',
          attributes: ['id', 'firstName', 'lastName', 'company', 'email']
        },
        {
          model: User,
          as: 'assignedUser',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    })

    res.json({
      deals: deals.rows,
      total: deals.count,
      page: Number(page),
      totalPages: Math.ceil(deals.count / Number(limit))
    })
  } catch (error) {
    console.error('Error fetching deals:', error)
    res.status(500).json({ error: 'Failed to fetch deals' })
  }
}

export const createDeal = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const dealData = {
      ...req.body,
      organizationId: req.user!.organizationId
    }

    const deal = await Deal.create(dealData)
    
    // Log activity
    await Activity.create({
      organizationId: req.user!.organizationId,
      type: 'note',
      subject: 'New deal created',
      description: `Deal "${deal.name}" was created with value $${deal.value}`,
      dealId: deal.id,
      assignedTo: req.user!.id,
      status: 'completed'
    })

    res.status(201).json(deal)
  } catch (error) {
    console.error('Error creating deal:', error)
    res.status(500).json({ error: 'Failed to create deal' })
  }
}

export const updateDealStage = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params
    const { stage, probability } = req.body
    const organizationId = req.user!.organizationId

    const deal = await Deal.findOne({ where: { id, organizationId } })
    if (!deal) {
      return res.status(404).json({ error: 'Deal not found' })
    }

    await deal.update({ stage, probability })
    
    // Log activity
    await Activity.create({
      organizationId,
      type: 'note',
      subject: 'Deal stage updated',
      description: `Deal "${deal.name}" moved to stage: ${stage}`,
      dealId: deal.id,
      assignedTo: req.user!.id,
      status: 'completed'
    })

    res.json(deal)
  } catch (error) {
    console.error('Error updating deal stage:', error)
    res.status(500).json({ error: 'Failed to update deal stage' })
  }
}

// Activity Controllers
export const getActivities = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { page = 1, limit = 20, type, customerId, leadId, dealId } = req.query
    const organizationId = req.user!.organizationId

    const whereClause: any = { organizationId }
    
    if (type) whereClause.type = type
    if (customerId) whereClause.customerId = customerId
    if (leadId) whereClause.leadId = leadId
    if (dealId) whereClause.dealId = dealId

    const activities = await Activity.findAndCountAll({
      where: whereClause,
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'firstName', 'lastName', 'company']
        },
        {
          model: Deal,
          as: 'deal',
          attributes: ['id', 'name']
        },
        {
          model: Lead,
          as: 'lead',
          attributes: ['id', 'firstName', 'lastName', 'company']
        },
        {
          model: User,
          as: 'assignedUser',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    })

    res.json({
      activities: activities.rows,
      total: activities.count,
      page: Number(page),
      totalPages: Math.ceil(activities.count / Number(limit))
    })
  } catch (error) {
    console.error('Error fetching activities:', error)
    res.status(500).json({ error: 'Failed to fetch activities' })
  }
}

export const createActivity = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const activityData = {
      ...req.body,
      organizationId: req.user!.organizationId,
      assignedTo: req.user!.id
    }

    const activity = await Activity.create(activityData)
    
    // If it's a completed activity, set the completedAt timestamp
    if (activity.status === 'completed') {
      await activity.update({ completedAt: new Date() })
    }

    res.status(201).json(activity)
  } catch (error) {
    console.error('Error creating activity:', error)
    res.status(500).json({ error: 'Failed to create activity' })
  }
}

// Pipeline Controllers
export const getPipelineStages = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const organizationId = req.user!.organizationId

    const stages = await PipelineStage.findAll({
      where: { organizationId, isActive: true },
      order: [['order', 'ASC']]
    })

    res.json(stages)
  } catch (error) {
    console.error('Error fetching pipeline stages:', error)
    res.status(500).json({ error: 'Failed to fetch pipeline stages' })
  }
}

export const createPipelineStage = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const stageData = {
      ...req.body,
      organizationId: req.user!.organizationId
    }

    const stage = await PipelineStage.create(stageData)
    res.status(201).json(stage)
  } catch (error) {
    console.error('Error creating pipeline stage:', error)
    res.status(500).json({ error: 'Failed to create pipeline stage' })
  }
}

// Dashboard Analytics
export const getCRMAnalytics = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const organizationId = req.user!.organizationId

    // Get counts
    const customerCount = await Customer.count({ where: { organizationId } })
    const leadCount = await Lead.count({ where: { organizationId } })
    const dealCount = await Deal.count({ where: { organizationId, status: 'open' } })
    const wonDealsCount = await Deal.count({ where: { organizationId, status: 'won' } })

    // Get total deal value
    const totalPipelineValue = await Deal.sum('value', {
      where: { organizationId, status: 'open' }
    })

    const wonDealsValue = await Deal.sum('value', {
      where: { organizationId, status: 'won' }
    })

    // Get deals by stage
    const dealsByStage = await Deal.findAll({
      attributes: [
        'stage',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('value')), 'totalValue']
      ],
      where: { organizationId, status: 'open' },
      group: ['stage'],
      raw: true
    })

    // Get recent activities
    const recentActivities = await Activity.findAll({
      where: { organizationId },
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'firstName', 'lastName', 'company']
        },
        {
          model: Deal,
          as: 'deal',
          attributes: ['id', 'name']
        }
      ]
    })

    res.json({
      metrics: {
        customerCount,
        leadCount,
        dealCount,
        wonDealsCount,
        totalPipelineValue: totalPipelineValue || 0,
        wonDealsValue: wonDealsValue || 0
      },
      dealsByStage,
      recentActivities
    })
  } catch (error) {
    console.error('Error fetching CRM analytics:', error)
    res.status(500).json({ error: 'Failed to fetch CRM analytics' })
  }
}
