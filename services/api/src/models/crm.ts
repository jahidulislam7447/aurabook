import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../config/database'

// Customer/Contact Model
interface CustomerAttributes {
  id: string
  organizationId: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  title?: string
  address?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  website?: string
  notes?: string
  tags?: string[]
  source?: string
  status: 'active' | 'inactive' | 'prospect'
  assignedTo?: string
  createdAt: Date
  updatedAt: Date
}

interface CustomerCreationAttributes extends Optional<CustomerAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Customer extends Model<CustomerAttributes, CustomerCreationAttributes> implements CustomerAttributes {
  public id!: string
  public organizationId!: string
  public firstName!: string
  public lastName!: string
  public email!: string
  public phone?: string
  public company?: string
  public title?: string
  public address?: string
  public city?: string
  public state?: string
  public country?: string
  public postalCode?: string
  public website?: string
  public notes?: string
  public tags?: string[]
  public source?: string
  public status!: 'active' | 'inactive' | 'prospect'
  public assignedTo?: string
  public createdAt!: Date
  public updatedAt!: Date
}

Customer.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    organizationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'organizations',
        key: 'id',
      },
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: DataTypes.STRING,
    company: DataTypes.STRING,
    title: DataTypes.STRING,
    address: DataTypes.TEXT,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    postalCode: DataTypes.STRING,
    website: DataTypes.STRING,
    notes: DataTypes.TEXT,
    tags: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    source: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'prospect'),
      defaultValue: 'prospect',
    },
    assignedTo: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Customer',
    tableName: 'customers',
    timestamps: true,
  }
)

// Lead Model
interface LeadAttributes {
  id: string
  organizationId: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  title?: string
  source: string
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  value?: number
  probability?: number
  expectedCloseDate?: Date
  assignedTo?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

interface LeadCreationAttributes extends Optional<LeadAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Lead extends Model<LeadAttributes, LeadCreationAttributes> implements LeadAttributes {
  public id!: string
  public organizationId!: string
  public firstName!: string
  public lastName!: string
  public email!: string
  public phone?: string
  public company?: string
  public title?: string
  public source!: string
  public status!: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  public value?: number
  public probability?: number
  public expectedCloseDate?: Date
  public assignedTo?: string
  public notes?: string
  public createdAt!: Date
  public updatedAt!: Date
}

Lead.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    organizationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'organizations',
        key: 'id',
      },
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    phone: DataTypes.STRING,
    company: DataTypes.STRING,
    title: DataTypes.STRING,
    source: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('new', 'contacted', 'qualified', 'converted', 'lost'),
      defaultValue: 'new',
    },
    value: DataTypes.DECIMAL(10, 2),
    probability: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },
    expectedCloseDate: DataTypes.DATE,
    assignedTo: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    notes: DataTypes.TEXT,
  },
  {
    sequelize,
    modelName: 'Lead',
    tableName: 'leads',
    timestamps: true,
  }
)

// Deal/Opportunity Model
interface DealAttributes {
  id: string
  organizationId: string
  name: string
  customerId?: string
  leadId?: string
  value: number
  currency: string
  stage: string
  probability: number
  expectedCloseDate: Date
  actualCloseDate?: Date
  status: 'open' | 'won' | 'lost'
  assignedTo?: string
  description?: string
  tags?: string[]
  createdAt: Date
  updatedAt: Date
}

interface DealCreationAttributes extends Optional<DealAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Deal extends Model<DealAttributes, DealCreationAttributes> implements DealAttributes {
  public id!: string
  public organizationId!: string
  public name!: string
  public customerId?: string
  public leadId?: string
  public value!: number
  public currency!: string
  public stage!: string
  public probability!: number
  public expectedCloseDate!: Date
  public actualCloseDate?: Date
  public status!: 'open' | 'won' | 'lost'
  public assignedTo?: string
  public description?: string
  public tags?: string[]
  public createdAt!: Date
  public updatedAt!: Date
}

Deal.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    organizationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'organizations',
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerId: {
      type: DataTypes.UUID,
      references: {
        model: 'customers',
        key: 'id',
      },
    },
    leadId: {
      type: DataTypes.UUID,
      references: {
        model: 'leads',
        key: 'id',
      },
    },
    value: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'USD',
    },
    stage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    probability: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },
    expectedCloseDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    actualCloseDate: DataTypes.DATE,
    status: {
      type: DataTypes.ENUM('open', 'won', 'lost'),
      defaultValue: 'open',
    },
    assignedTo: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    description: DataTypes.TEXT,
    tags: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
  },
  {
    sequelize,
    modelName: 'Deal',
    tableName: 'deals',
    timestamps: true,
  }
)

// Activity Model (Calls, Emails, Meetings, Notes)
interface ActivityAttributes {
  id: string
  organizationId: string
  type: 'call' | 'email' | 'meeting' | 'note' | 'task'
  subject: string
  description?: string
  customerId?: string
  leadId?: string
  dealId?: string
  assignedTo?: string
  status?: 'completed' | 'scheduled' | 'pending'
  priority?: 'low' | 'medium' | 'high'
  dueDate?: Date
  completedAt?: Date
  duration?: number // in minutes
  location?: string
  attendees?: string[]
  createdAt: Date
  updatedAt: Date
}

interface ActivityCreationAttributes extends Optional<ActivityAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Activity extends Model<ActivityAttributes, ActivityCreationAttributes> implements ActivityAttributes {
  public id!: string
  public organizationId!: string
  public type!: 'call' | 'email' | 'meeting' | 'note' | 'task'
  public subject!: string
  public description?: string
  public customerId?: string
  public leadId?: string
  public dealId?: string
  public assignedTo?: string
  public status?: 'completed' | 'scheduled' | 'pending'
  public priority?: 'low' | 'medium' | 'high'
  public dueDate?: Date
  public completedAt?: Date
  public duration?: number
  public location?: string
  public attendees?: string[]
  public createdAt!: Date
  public updatedAt!: Date
}

Activity.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    organizationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'organizations',
        key: 'id',
      },
    },
    type: {
      type: DataTypes.ENUM('call', 'email', 'meeting', 'note', 'task'),
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.TEXT,
    customerId: {
      type: DataTypes.UUID,
      references: {
        model: 'customers',
        key: 'id',
      },
    },
    leadId: {
      type: DataTypes.UUID,
      references: {
        model: 'leads',
        key: 'id',
      },
    },
    dealId: {
      type: DataTypes.UUID,
      references: {
        model: 'deals',
        key: 'id',
      },
    },
    assignedTo: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('completed', 'scheduled', 'pending'),
      defaultValue: 'pending',
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      defaultValue: 'medium',
    },
    dueDate: DataTypes.DATE,
    completedAt: DataTypes.DATE,
    duration: DataTypes.INTEGER,
    location: DataTypes.STRING,
    attendees: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
  },
  {
    sequelize,
    modelName: 'Activity',
    tableName: 'activities',
    timestamps: true,
  }
)

// Pipeline Stage Model
interface PipelineStageAttributes {
  id: string
  organizationId: string
  name: string
  description?: string
  order: number
  probability: number
  color: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface PipelineStageCreationAttributes extends Optional<PipelineStageAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class PipelineStage extends Model<PipelineStageAttributes, PipelineStageCreationAttributes> implements PipelineStageAttributes {
  public id!: string
  public organizationId!: string
  public name!: string
  public description?: string
  public order!: number
  public probability!: number
  public color!: string
  public isActive!: boolean
  public createdAt!: Date
  public updatedAt!: Date
}

PipelineStage.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    organizationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'organizations',
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.TEXT,
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    probability: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },
    color: {
      type: DataTypes.STRING,
      defaultValue: '#3B82F6',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'PipelineStage',
    tableName: 'pipeline_stages',
    timestamps: true,
  }
)

// Define associations
Customer.hasMany(Deal, { foreignKey: 'customerId', as: 'deals' })
Customer.hasMany(Activity, { foreignKey: 'customerId', as: 'activities' })
Deal.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' })
Deal.hasMany(Activity, { foreignKey: 'dealId', as: 'activities' })
Activity.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' })
Activity.belongsTo(Deal, { foreignKey: 'dealId', as: 'deal' })
Activity.belongsTo(Lead, { foreignKey: 'leadId', as: 'lead' })
Lead.hasMany(Activity, { foreignKey: 'leadId', as: 'activities' })
Lead.hasOne(Deal, { foreignKey: 'leadId', as: 'deal' })

export default {
  Customer,
  Lead,
  Deal,
  Activity,
  PipelineStage,
}
