import React, { useState } from 'react'
import { Search, BookOpen, Target, Lightbulb, ChevronDown, ChevronUp, Star, Clock, Users } from 'lucide-react'

const SubjectAnalyzer = () => {
  const [selectedSubject, setSelectedSubject] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [expandedSections, setExpandedSections] = useState({
    goals: true,
    concepts: true,
    projects: true,
    resources: true
  })

  const engineeringSubjects = [
    'Data Structures and Algorithms',
    'Computer Organization and Architecture',
    'Automata Theory and Computability',
    'Operating Systems',
    'Database Management Systems',
    'Software Engineering',
    'Computer Networks',
    'Artificial Intelligence',
    'Machine Learning',
    'Web Technologies',
    'Mobile Application Development',
    'Cloud Computing',
    'Cyber Security',
    'Internet of Things',
    'Blockchain Technology',
    'Big Data Analytics',
    'Computer Graphics',
    'Human Computer Interaction'
  ]

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const analyzeSubject = async () => {
    if (!selectedSubject) {
      setError('Please select a subject to analyze')
      return
    }

    setLoading(true)
    setError('')
    setAnalysis(null)

    try {
      // Simulate API call to Gemini
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const mockAnalysis = generateMockAnalysis(selectedSubject)
      setAnalysis(mockAnalysis)
    } catch (err) {
      setError('Failed to analyze subject. Please try again.')
      console.error('Subject analysis error:', err)
    } finally {
      setLoading(false)
    }
  }

  const generateMockAnalysis = (subject) => {
    const analysisTemplates = {
      'Data Structures and Algorithms': {
        difficulty: 4,
        timeCommitment: '12-16 weeks',
        importance: 5,
        subjectGoals: 'Master fundamental data structures (arrays, linked lists, trees, graphs) and algorithm design techniques (sorting, searching, dynamic programming) to solve complex computational problems efficiently.',
        keyConcepts: [
          'Time and Space Complexity Analysis (Big O Notation)',
          'Arrays, Linked Lists, Stacks, and Queues',
          'Trees (Binary, BST, AVL, B-Trees)',
          'Graph Algorithms (BFS, DFS, Shortest Path)',
          'Sorting and Searching Algorithms',
          'Dynamic Programming and Greedy Methods',
          'Hash Tables and Collision Resolution'
        ],
        projectIdeas: [
          'Implement a social network graph with friend recommendations',
          'Build a file compression tool using Huffman coding',
          'Create a navigation system with shortest path algorithms',
          'Develop a cache simulation with LRU/LFU eviction policies'
        ],
        learningResources: [
          'Book: "Introduction to Algorithms" by Cormen et al.',
          'Course: MIT OpenCourseWare - Introduction to Algorithms',
          'Platform: LeetCode for practice problems',
          'Visualization: VisuAlgo for algorithm animations'
        ],
        careerApplications: ['Software Engineer', 'Data Scientist', 'Quantitative Analyst', 'Backend Developer']
      },
      'Database Management Systems': {
        difficulty: 3,
        timeCommitment: '10-14 weeks',
        importance: 4,
        subjectGoals: 'Understand database design principles, SQL programming, normalization, transaction management, and learn to build efficient, scalable database systems for real-world applications.',
        keyConcepts: [
          'Relational Database Design and Normalization',
          'SQL Programming (DDL, DML, DCL, TCL)',
          'ACID Properties and Transaction Management',
          'Indexing and Query Optimization',
          'NoSQL Databases (MongoDB, Cassandra)',
          'Database Security and Authorization',
          'Data Warehousing and Mining'
        ],
        projectIdeas: [
          'Design and implement a library management system',
          'Build an e-commerce database with complex queries',
          'Create a real-time analytics dashboard',
          'Develop a multi-tenant SaaS application database'
        ],
        learningResources: [
          'Book: "Database System Concepts" by Silberschatz',
          'Course: Stanford DB5 - SQL and Database Design',
          'Tool: PostgreSQL documentation and exercises',
          'Practice: HackerRank SQL challenges'
        ],
        careerApplications: ['Database Administrator', 'Backend Developer', 'Data Engineer', 'Business Intelligence Analyst']
      },
      'default': {
        difficulty: 3,
        timeCommitment: '8-12 weeks',
        importance: 4,
        subjectGoals: `Master the fundamental concepts and practical applications of ${subject} to solve real-world engineering problems and build a strong foundation for advanced topics.`,
        keyConcepts: [
          'Core principles and fundamental theories',
          'Practical implementation techniques',
          'Industry-standard tools and frameworks',
          'Problem-solving methodologies',
          'Best practices and design patterns'
        ],
        projectIdeas: [
          'Build a complete end-to-end application',
          'Create a proof-of-concept prototype',
          'Develop a tool to solve specific problems',
          'Implement industry-standard solutions'
        ],
        learningResources: [
          'Official documentation and tutorials',
          'Online courses and video lectures',
          'Community forums and discussion groups',
          'Practice platforms and coding challenges'
        ],
        careerApplications: ['Software Developer', 'Systems Engineer', 'Technical Specialist', 'Research Engineer']
      }
    }

    return analysisTemplates[subject] || analysisTemplates.default
  }

  const getDifficultyStars = (difficulty) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < difficulty ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const getImportanceBars = (importance) => {
    return Array.from({ length: 5 }, (_, i) => (
      <div
        key={i}
        className={`h-2 w-6 rounded ${
          i < importance ? 'bg-green-500' : 'bg-gray-200'
        }`}
      />
    ))
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
          <Search className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Subject Master Toolkit</h3>
          <p className="text-gray-600 text-sm">
            Get structured analysis of engineering subjects
          </p>
        </div>
      </div>

      {/* Subject Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Engineering Subject
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">Choose a subject...</option>
            {engineeringSubjects.map((subject, index) => (
              <option key={index} value={subject}>
                {subject}
              </option>
            ))}
          </select>
          
          <button
            onClick={analyzeSubject}
            disabled={!selectedSubject || loading}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                <span>Analyze Subject</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-700">Difficulty</span>
                <Target className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex items-center space-x-1">
                {getDifficultyStars(analysis.difficulty)}
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-700">Time Commitment</span>
                <Clock className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-lg font-semibold text-green-800">
                {analysis.timeCommitment}
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-700">Career Importance</span>
                <Users className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex items-center space-x-1">
                {getImportanceBars(analysis.importance)}
              </div>
            </div>
          </div>

          {/* Subject Goals */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection('goals')}
              className="w-full p-4 flex items-center justify-between text-left bg-gray-50 hover:bg-gray-100 rounded-t-lg"
            >
              <div className="flex items-center space-x-3">
                <Target className="h-5 w-5 text-cyan-600" />
                <h4 className="font-semibold text-gray-900">Learning Goals & Objectives</h4>
              </div>
              {expandedSections.goals ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            
            {expandedSections.goals && (
              <div className="p-4 bg-white">
                <p className="text-gray-700 leading-relaxed">{analysis.subjectGoals}</p>
              </div>
            )}
          </div>

          {/* Key Concepts */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection('concepts')}
              className="w-full p-4 flex items-center justify-between text-left bg-gray-50 hover:bg-gray-100 rounded-t-lg"
            >
              <div className="flex items-center space-x-3">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-gray-900">Key Concepts to Master</h4>
              </div>
              {expandedSections.concepts ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            
            {expandedSections.concepts && (
              <div className="p-4 bg-white">
                <ul className="space-y-2">
                  {analysis.keyConcepts.map((concept, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <span className="text-gray-700">{concept}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Project Ideas */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection('projects')}
              className="w-full p-4 flex items-center justify-between text-left bg-gray-50 hover:bg-gray-100 rounded-t-lg"
            >
              <div className="flex items-center space-x-3">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                <h4 className="font-semibold text-gray-900">Practical Project Ideas</h4>
              </div>
              {expandedSections.projects ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            
            {expandedSections.projects && (
              <div className="p-4 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysis.projectIdeas.map((idea, index) => (
                    <div
                      key={index}
                      className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                    >
                      <div className="flex items-start space-x-2">
                        <span className="text-yellow-600 font-semibold">{index + 1}.</span>
                        <p className="text-gray-700 text-sm">{idea}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Learning Resources */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection('resources')}
              className="w-full p-4 flex items-center justify-between text-left bg-gray-50 hover:bg-gray-100 rounded-t-lg"
            >
              <div className="flex items-center space-x-3">
                <BookOpen className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-gray-900">Recommended Resources</h4>
              </div>
              {expandedSections.resources ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            
            {expandedSections.resources && (
              <div className="p-4 bg-white">
                <div className="space-y-3">
                  {analysis.learningResources.map((resource, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700 text-sm">{resource}</span>
                    </div>
                  ))}
                </div>
                
                {/* Career Applications */}
                <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <h5 className="font-semibold text-purple-800 mb-2">Career Applications</h5>
                  <div className="flex flex-wrap gap-2">
                    {analysis.careerApplications.map((career, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
                      >
                        {career}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!analysis && !loading && (
        <div className="text-center py-12 text-gray-500">
          <Search className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h4 className="text-lg font-medium mb-2">Select a Subject to Analyze</h4>
          <p className="text-sm">
            Get detailed learning paths, project ideas, and resource recommendations for any engineering subject.
          </p>
        </div>
      )}
    </div>
  )
}

export default SubjectAnalyzer