'use client'

import { useState } from 'react'
import { Users, Calendar, DollarSign, Search, Plus, Filter, Download, UserCheck, Building, Eye, Edit, Trash2, AlertCircle, CheckCircle, XCircle } from 'lucide-react'

interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  department: string
  position: string
  salary: number
  startDate: string
  status: 'active' | 'inactive' | 'on_leave'
}

const mockEmployees: Employee[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@auratechit.com',
    department: 'Engineering',
    position: 'Senior Developer',
    salary: 85000,
    startDate: '2022-03-15',
    status: 'active'
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@auratechit.com',
    department: 'Marketing',
    position: 'Marketing Manager',
    salary: 75000,
    startDate: '2021-07-20',
    status: 'active'
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@auratechit.com',
    department: 'Design',
    position: 'UX Designer',
    salary: 70000,
    startDate: '2023-01-10',
    status: 'active'
  }
]

const departments = ['All', 'Engineering', 'Marketing', 'Design', 'Sales', 'HR', 'Finance']

export default function HRPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('All')

  const filteredEmployees = mockEmployees.filter(employee => {
    const matchesSearch = employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === 'All' || employee.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      case 'on_leave': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const hrStats = {
    totalEmployees: mockEmployees.length,
    activeEmployees: mockEmployees.filter(e => e.status === 'active').length,
    departments: [...new Set(mockEmployees.map(e => e.department))].length,
    avgSalary: Math.round(mockEmployees.reduce((sum, e) => sum + e.salary, 0) / mockEmployees.length)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AuraHR</h1>
            <p className="text-gray-600">Human Resources Management</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
              />
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex space-x-8">
          {['dashboard', 'employees', 'attendance', 'leave', 'payroll', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Employees</p>
                    <p className="text-2xl font-bold text-gray-900">{hrStats.totalEmployees}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <UserCheck className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Employees</p>
                    <p className="text-2xl font-bold text-gray-900">{hrStats.activeEmployees}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Building className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Departments</p>
                    <p className="text-2xl font-bold text-gray-900">{hrStats.departments}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg Salary</p>
                    <p className="text-2xl font-bold text-gray-900">${hrStats.avgSalary.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Pending Leave Requests</h3>
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">3</p>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Review Requests →
                </button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">This Month Payroll</h3>
                  <DollarSign className="h-5 w-5 text-green-500" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">$234,500</p>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View Payroll →
                </button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Today's Attendance</h3>
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">42</p>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View Attendance →
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'employees' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  <button className="flex items-center text-gray-600 hover:text-gray-900">
                    <Filter className="h-4 w-4 mr-2" />
                    More Filters
                  </button>
                </div>
                <button className="flex items-center text-gray-600 hover:text-gray-900">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salary</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEmployees.map((employee) => (
                      <tr key={employee.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                              <span className="text-sm font-medium text-gray-600">
                                {employee.firstName[0]}{employee.lastName[0]}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {employee.firstName} {employee.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{employee.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.position}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${employee.salary.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.startDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                            {employee.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900 mr-3">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Attendance Management</h2>
            <p className="text-gray-600">Attendance tracking and management features will be implemented here.</p>
          </div>
        )}

        {activeTab === 'leave' && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Leave Management</h2>
            <p className="text-gray-600">Leave request and approval system will be implemented here.</p>
          </div>
        )}

        {activeTab === 'payroll' && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payroll Management</h2>
            <p className="text-gray-600">Payroll processing and salary management will be implemented here.</p>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">HR Analytics</h2>
            <p className="text-gray-600">HR analytics and reporting features will be implemented here.</p>
          </div>
        )}
      </div>
    </div>
  )
}
