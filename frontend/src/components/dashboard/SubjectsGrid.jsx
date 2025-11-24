import React, { useState } from 'react'
import { ExternalLink, BookOpen, Code, Calculator, Cpu, Database, Settings, Brain } from 'lucide-react'

const SubjectsGrid = ({ subjects }) => {
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const getSubjectIcon = (category) => {
    const icons = {
      'Computer Science': Code,
      'Mathematics': Calculator,
      'Engineering': Cpu,
      'Database': Database,
      'Software': Settings,
      'AI': Brain
    }
    return icons[category] || BookOpen
  }

  const getSubjectColor = (color) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      red: 'from-red-500 to-red-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      yellow: 'from-yellow-500 to-yellow-600',
      teal: 'from-teal-500 to-teal-600',
      orange: 'from-orange-500 to-orange-600',
      pink: 'from-pink-500 to-pink-600'
    }
    return colors[color] || 'from-gray-500 to-gray-600'
  }

  const filteredSubjects = subjects.filter(subject => {
    const matchesFilter = filter === 'all' || subject.category === filter
    const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subject.code.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const categories = ['all', ...new Set(subjects.map(s => s.category))]

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition duration-200 ${
                filter === category
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category === 'all' ? 'All Subjects' : category}
            </button>
          ))}
        </div>
        
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <BookOpen className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Subjects Grid */}
      {filteredSubjects.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No subjects found</h3>
          <p className="mt-2 text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSubjects.map((subject) => {
            const IconComponent = getSubjectIcon(subject.category)
            return (
              <a
                key={subject.id}
                href={subject.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-600 hover:shadow-2xl transform hover:translate-x-1 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getSubjectColor(subject.color)}`}>
                      {subject.code}
                    </div>
                    <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 transition duration-200" />
                  </div>
                  
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${getSubjectColor(subject.color)}`}>
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition duration-200">
                      {subject.name}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {subject.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      Semester {subject.semester}
                    </span>
                    <span>Click to visit</span>
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      )}

      {/* Statistics */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-indigo-600">{subjects.length}</div>
            <div className="text-sm text-gray-600">Total Subjects</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {subjects.filter(s => s.semester <= 4).length}
            </div>
            <div className="text-sm text-gray-600">Core Subjects</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {new Set(subjects.map(s => s.category)).size}
            </div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {subjects.filter(s => s.semester > 4).length}
            </div>
            <div className="text-sm text-gray-600">Advanced</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubjectsGrid