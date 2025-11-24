import { geminiAPI } from './api'

class GeminiService {
  async getStudyAdvice(studentProfile, userQuery) {
    try {
      const response = await geminiAPI.getStudyAdvice({
        studentProfile,
        userQuery
      })
      return response.data
    } catch (error) {
      throw new Error('Failed to get study advice: ' + error.message)
    }
  }

  async analyzeSubject(subjectName, studentContext) {
    try {
      const response = await geminiAPI.analyzeSubject({
        subjectName,
        studentContext
      })
      return response.data
    } catch (error) {
      throw new Error('Failed to analyze subject: ' + error.message)
    }
  }

  async generateProjectIdeas(subject, studentSkills, complexity = 'intermediate') {
    try {
      const response = await geminiAPI.generateProjectIdeas({
        subject,
        studentSkills,
        complexity
      })
      return response.data
    } catch (error) {
      throw new Error('Failed to generate project ideas: ' + error.message)
    }
  }

  async getSkillGapAnalysis(currentSkills, targetRole) {
    try {
      const response = await geminiAPI.getStudyAdvice({
        studentProfile: { skills: currentSkills },
        userQuery: `What skills am I missing to become a ${targetRole}?`
      })
      return response.data
    } catch (error) {
      throw new Error('Failed to analyze skill gaps: ' + error.message)
    }
  }
}

export default new GeminiService()