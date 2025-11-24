import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import ProfileCard from './ProfileCard'
import SubjectsGrid from './SubjectsGrid'
import SkillCoach from '../gemini/SkillCoach'
import SubjectAnalyzer from '../gemini/SubjectAnalyzer'
import { studentAPI } from '../../services/api'

const StudentDashboard = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [subjects, setSubjects] = useState([])
  const [studentProfile, setStudentProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [subjectsResponse, profileResponse] = await Promise.all([
        studentAPI.getSubjects(),
        studentAPI.getProfile()
      ])
      setSubjects(subjectsResponse.data)
      setStudentProfile(profileResponse.data)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || 'Student'}!
          </h1>
          <p className="text-gray-600 mt-2">
            {studentProfile?.course} • {studentProfile?.college}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-gray-200">
            {[
              { id: 'overview', name: 'Overview', icon: '📊' },
              { id: 'subjects', name: 'Subjects', icon: '📚' },
              { id: 'skills', name: 'Skills', icon: '⚡' },
              { id: 'analytics', name: 'Analytics', icon: '📈' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <ProfileCard 
                  student={studentProfile} 
                  onUpdate={loadDashboardData}
                />
              </div>
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <span className="mr-2">📈</span>
                    Academic Progress
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Subjects Completed</span>
                      <span className="font-bold text-indigo-600">8/12</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-green-600 h-3 rounded-full transition-all duration-500" 
                        style={{ width: '66%' }}
                      ></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="font-bold text-blue-600">3.8</div>
                        <div className="text-blue-500">Current GPA</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="font-bold text-green-600">85%</div>
                        <div className="text-green-500">Attendance</div>
                      </div>
                    </div>
                  </div>
                </div>

                <SkillCoach student={studentProfile} />
              </div>
            </div>
          )}

          {activeTab === 'subjects' && (
            <div className="space-y-8">
              <SubjectAnalyzer />
              <SubjectsGrid subjects={subjects} />
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <span className="mr-2">⚡</span>
                Skill Development
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-4">Technical Skills</h4>
                  <div className="space-y-3">
                    {studentProfile?.skills?.technical?.map((skill, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span>{skill.name}</span>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`text-lg ${
                                star <= skill.level ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Soft Skills</h4>
                  <div className="space-y-3">
                    {studentProfile?.skills?.soft?.map((skill, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span>{skill.name}</span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-6">Learning Analytics</h3>
              <div className="text-center py-12 text-gray-500">
                Analytics dashboard coming soon...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard