import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { studentAPI } from '../../services/api'

const ProfileCard = ({ student, onUpdate }) => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: student?.name || '',
    age: student?.age || '',
    course: student?.course || '',
    college: student?.college || '',
    skills: student?.skills ? student.skills.join(', ') : ''
  })
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const skillsArray = formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
      
      await studentAPI.updateProfile({
        ...formData,
        skills: skillsArray,
        age: parseInt(formData.age)
      })
      
      setIsEditing(false)
      onUpdate?.()
    } catch (error) {
      console.error('Failed to update profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('profileImage', file)

    try {
      await studentAPI.uploadProfileImage(formData)
      onUpdate?.()
    } catch (error) {
      console.error('Failed to upload image:', error)
    }
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl border-t-8 border-indigo-600">
      <div className="flex flex-col items-center mb-6">
        {/* Profile Image */}
        <div className="relative mb-4">
          <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-indigo-200">
            {student?.profileImage ? (
              <img 
                src={student.profileImage} 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-4xl text-indigo-600">
                {student?.name?.charAt(0) || 'S'}
              </span>
            )}
          </div>
          <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition duration-200">
            <input 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handleImageUpload}
            />
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </label>
        </div>

        <h3 className="text-2xl font-bold text-gray-800 text-center">
          Personal Details
        </h3>
        {user?.walletAddress && (
          <p className="text-sm text-gray-500 mt-1">
            {user.walletAddress.slice(0, 8)}...{user.walletAddress.slice(-6)}
          </p>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                min="16"
                max="60"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course
            </label>
            <input
              type="text"
              name="course"
              value={formData.course}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              College
            </label>
            <input
              type="text"
              name="college"
              value={formData.college}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills (comma separated)
            </label>
            <textarea
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., JavaScript, React, Node.js, Python"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="space-y-4 text-gray-700">
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-indigo-600">Name:</span>
              <span>{student?.name || 'Not set'}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-indigo-600">Age:</span>
              <span>{student?.age || 'Not set'}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-indigo-600">Course:</span>
              <span className="text-right">{student?.course || 'Not set'}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-indigo-600">College:</span>
              <span className="text-right">{student?.college || 'Not set'}</span>
            </div>
            <div>
              <span className="font-semibold text-indigo-600 block mb-2">Skills:</span>
              <div className="flex flex-wrap gap-2">
                {student?.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {skill}
                  </span>
                ))}
                {(!student?.skills || student.skills.length === 0) && (
                  <span className="text-gray-500 text-sm">No skills added</span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="w-full mt-6 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition duration-200"
          >
            Update Profile
          </button>
        </>
      )}
    </div>
  )
}

export default ProfileCard