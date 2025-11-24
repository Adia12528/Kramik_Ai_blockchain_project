import React from 'react'

const AIBotTab = ({
  isVisible,
  botQuestion,
  setBotQuestion,
  handleBotSubmit,
  isGenerating,
  botAnswer,
  resetBot,
  currentPage,
  prevPage,
  nextPage,
  botHistory,
  setBotAnswer,
  setCurrentPage,
  clearHistory
}) => {
  return (
    <div className={`${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '600ms' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-3 flex items-center justify-center">
            <span className="text-5xl mr-4">🤖</span>
            AI Learning Bot
          </h2>
          <p className="text-gray-600 text-lg">Ask any question and get comprehensive explanations with visuals, theory, mind maps, and comics!</p>
        </div>

        {/* Question Input Form */}
        <div className="glass-effect p-6 rounded-2xl shadow-xl mb-8">
          <form onSubmit={handleBotSubmit} className="flex gap-4">
            <input
              type="text"
              value={botQuestion}
              onChange={(e) => setBotQuestion(e.target.value)}
              placeholder="Ask me anything... e.g., 'What is Machine Learning?', 'Explain Binary Search Trees'"
              className="flex-1 px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none text-lg"
              disabled={isGenerating}
            />
            <button
              type="submit"
              disabled={isGenerating || !botQuestion.trim()}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Ask Bot</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Loading State */}
        {isGenerating && (
          <div className="glass-effect p-12 rounded-2xl shadow-xl text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xl font-semibold text-gray-700">AI is analyzing your question...</p>
              <p className="text-gray-500">Generating comprehensive answer with visuals and explanations</p>
            </div>
          </div>
        )}

        {/* Answer Display */}
        {botAnswer && !isGenerating && (
          <div className="space-y-6">
            {/* Question Header */}
            <div className="glass-effect p-6 rounded-2xl shadow-xl border-l-4 border-indigo-600">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">💬 Your Question:</h3>
                  <p className="text-lg text-gray-700">{botAnswer.question}</p>
                </div>
                <button
                  onClick={resetBot}
                  className="bg-gray-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-gray-600 transition-all"
                >
                  ✖ Clear
                </button>
              </div>
            </div>

            {/* Page Navigation */}
            <div className="flex justify-between items-center glass-effect p-4 rounded-xl">
              <button
                onClick={prevPage}
                disabled={currentPage === 0}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>←</span>
                <span>Previous</span>
              </button>
              <div className="text-center">
                <p className="text-sm text-gray-600">Page {currentPage + 1} of {botAnswer.pages.length}</p>
                <p className="font-bold text-gray-800">{botAnswer.pages[currentPage].title}</p>
              </div>
              <button
                onClick={nextPage}
                disabled={currentPage === botAnswer.pages.length - 1}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <span>→</span>
              </button>
            </div>

            {/* Current Page Content */}
            <div className="glass-effect p-8 rounded-2xl shadow-xl min-h-[600px]">
              {(() => {
                const page = botAnswer.pages[currentPage]
                
                if (page.type === 'theory') {
                  return (
                    <div className="space-y-6">
                      <div className="border-b-2 border-indigo-200 pb-4">
                        <h3 className="text-3xl font-bold text-indigo-700 flex items-center gap-3">
                          <span>📚</span>
                          {page.title}
                        </h3>
                      </div>
                      
                      <div className="bg-blue-50 p-6 rounded-xl">
                        <h4 className="text-xl font-bold text-blue-800 mb-3">🎯 Definition</h4>
                        <p className="text-gray-700 text-lg leading-relaxed">{page.content.definition}</p>
                      </div>

                      <div className="bg-green-50 p-6 rounded-xl">
                        <h4 className="text-xl font-bold text-green-800 mb-4">✨ Key Points</h4>
                        <ul className="space-y-3">
                          {page.content.keyPoints.map((point, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <span className="text-2xl">✅</span>
                              <span className="text-gray-700 text-lg">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {page.content.formula && (
                        <div className="bg-purple-50 p-6 rounded-xl">
                          <h4 className="text-xl font-bold text-purple-800 mb-3">🧮 Formula/Notation</h4>
                          <p className="text-gray-700 text-lg font-mono bg-white p-4 rounded-lg">{page.content.formula}</p>
                        </div>
                      )}

                      {/* Visual Diagram */}
                      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl">
                        <h4 className="text-xl font-bold text-indigo-800 mb-4">📊 Visual Flow</h4>
                        <div className="flex justify-center items-center gap-4 py-8">
                          {page.visual.nodes.map((node, idx) => (
                            <React.Fragment key={node.id}>
                              <div className={`${node.color} text-white px-6 py-4 rounded-xl shadow-lg font-bold text-center min-w-[120px]`}>
                                {node.label}
                              </div>
                              {idx < page.visual.nodes.length - 1 && (
                                <span className="text-3xl text-gray-400">→</span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                }
                
                if (page.type === 'mindmap') {
                  return (
                    <div className="space-y-6">
                      <div className="border-b-2 border-purple-200 pb-4">
                        <h3 className="text-3xl font-bold text-purple-700 flex items-center gap-3">
                          <span>🧠</span>
                          {page.title}
                        </h3>
                      </div>

                      {/* Central Topic */}
                      <div className="flex justify-center my-8">
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white px-8 py-6 rounded-2xl shadow-2xl text-center">
                          <h4 className="text-2xl font-bold">{page.content.central}</h4>
                        </div>
                      </div>

                      {/* Branches */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {page.content.branches.map((branch, idx) => (
                          <div key={idx} className={`bg-white p-6 rounded-xl shadow-lg border-l-4 ${branch.color}`}>
                            <h5 className={`text-xl font-bold ${branch.color} text-white px-4 py-2 rounded-lg mb-4 inline-block`}>
                              {branch.title}
                            </h5>
                            <ul className="space-y-2">
                              {branch.items.map((item, itemIdx) => (
                                <li key={itemIdx} className="flex items-start gap-2">
                                  <span className="text-xl">•</span>
                                  <span className="text-gray-700">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                }
                
                if (page.type === 'explanation') {
                  return (
                    <div className="space-y-6">
                      <div className="border-b-2 border-green-200 pb-4">
                        <h3 className="text-3xl font-bold text-green-700 flex items-center gap-3">
                          <span>💡</span>
                          {page.title}
                        </h3>
                      </div>

                      {page.content.map((section, idx) => (
                        <div key={idx} className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl">
                          <h4 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <span className="text-2xl">📌</span>
                            {section.section}
                          </h4>
                          <p className="text-gray-700 text-lg leading-relaxed">{section.text}</p>
                        </div>
                      ))}

                      {/* Examples */}
                      <div className="mt-8">
                        <h4 className="text-2xl font-bold text-orange-700 mb-4">📝 Examples</h4>
                        <div className="space-y-4">
                          {page.examples.map((example, idx) => (
                            <div key={idx} className="bg-orange-50 p-6 rounded-xl">
                              <h5 className="font-bold text-orange-800 mb-2">{example.title}</h5>
                              <p className="text-gray-700 mb-3">{example.description}</p>
                              {example.code && (
                                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                                  <code>{example.code}</code>
                                </pre>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                }
                
                if (page.type === 'code') {
                  return (
                    <div className="space-y-6">
                      <div className="border-b-2 border-indigo-200 pb-4">
                        <h3 className="text-3xl font-bold text-indigo-700 flex items-center gap-3">
                          <span>💻</span>
                          {page.title}
                        </h3>
                      </div>

                      {/* Language Badge */}
                      <div className="flex justify-between items-center">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-lg">
                          🔤 Language: {page.content.language.toUpperCase()}
                        </div>
                        <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-3 rounded-xl font-bold text-sm">
                          ⚡ Complexity: {page.content.complexity.time} time, {page.content.complexity.space} space
                        </div>
                      </div>

                      {/* Flowchart */}
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
                        <h4 className="text-2xl font-bold text-purple-800 mb-6 flex items-center gap-2">
                          <span>📊</span>
                          {page.content.flowchart.title}
                        </h4>
                        <div className="bg-white p-6 rounded-xl shadow-inner">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {page.content.flowchart.steps.map((step, idx) => (
                              <div key={step.id} className="flex flex-col items-center">
                                <div className={`${step.color} text-white px-6 py-4 rounded-xl shadow-lg text-center min-w-[180px] ${
                                  step.type === 'decision' ? 'transform rotate-45' : ''
                                }`}>
                                  <div className={step.type === 'decision' ? 'transform -rotate-45' : ''}>
                                    <p className="font-bold text-sm">{step.label}</p>
                                  </div>
                                </div>
                                {idx < page.content.flowchart.steps.length - 1 && (
                                  <div className="text-3xl text-gray-400 my-2">↓</div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Code Block */}
                      <div className="bg-gray-900 p-6 rounded-xl shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-xl font-bold text-green-400 flex items-center gap-2">
                            <span>⌨️</span>
                            Implementation Code
                          </h4>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(page.content.code)
                              alert('Code copied to clipboard!')
                            }}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
                          >
                            <span>📋</span>
                            <span>Copy Code</span>
                          </button>
                        </div>
                        <pre className="overflow-x-auto">
                          <code className="text-green-400 text-sm font-mono leading-relaxed">
                            {page.content.code}
                          </code>
                        </pre>
                      </div>

                      {/* Step by Step Guide */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
                        <h4 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
                          <span>📝</span>
                          Step-by-Step Approach
                        </h4>
                        <div className="space-y-4">
                          {page.content.stepByStep.map((item, idx) => (
                            <div key={idx} className="bg-white p-5 rounded-xl shadow-md border-l-4 border-blue-500">
                              <div className="flex items-start gap-4">
                                <div className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                                  {item.step}
                                </div>
                                <div>
                                  <h5 className="font-bold text-gray-800 text-lg mb-1">{item.title}</h5>
                                  <p className="text-gray-600">{item.description}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Complexity Explanation */}
                      <div className="bg-yellow-50 p-6 rounded-xl border-l-4 border-yellow-500">
                        <h4 className="text-xl font-bold text-yellow-800 mb-3 flex items-center gap-2">
                          <span>⚙️</span>
                          Algorithm Complexity
                        </h4>
                        <p className="text-gray-700 text-lg">{page.content.complexity.explanation}</p>
                      </div>
                    </div>
                  )
                }
                
                if (page.type === 'comic') {
                  return (
                    <div className="space-y-6">
                      <div className="border-b-2 border-yellow-200 pb-4">
                        <h3 className="text-3xl font-bold text-yellow-700 flex items-center gap-3">
                          <span>🎨</span>
                          {page.title}
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {page.content.panels.map((panel, idx) => (
                          <div key={idx} className={`${panel.background} p-6 rounded-xl shadow-lg border-4 border-gray-800`}>
                            <div className="text-center mb-4">
                              <p className="text-xs font-bold text-gray-600 uppercase">Panel {panel.scene}</p>
                              <p className="text-sm italic text-gray-700">{panel.narration}</p>
                            </div>
                            <div className="flex flex-col items-center gap-4">
                              <div className="text-6xl">{panel.character}</div>
                              <div className="bg-white p-4 rounded-xl shadow-inner relative">
                                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-white"></div>
                                <p className="text-gray-800 font-medium text-center">{panel.dialogue}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                }
                
                if (page.type === 'summary') {
                  return (
                    <div className="space-y-6">
                      <div className="border-b-2 border-indigo-200 pb-4">
                        <h3 className="text-3xl font-bold text-indigo-700 flex items-center gap-3">
                          <span>✅</span>
                          {page.title}
                        </h3>
                      </div>

                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
                        <h4 className="text-2xl font-bold text-blue-800 mb-4">🎯 Key Takeaways</h4>
                        <ul className="space-y-3">
                          {page.content.keyTakeaways.map((takeaway, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <span className="text-2xl">👉</span>
                              <span className="text-gray-700 text-lg">{takeaway}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-xl">
                        <h4 className="text-2xl font-bold text-green-800 mb-4">🚀 Next Steps</h4>
                        <ol className="space-y-3">
                          {page.content.nextSteps.map((step, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <span className="text-xl font-bold text-green-600">{idx + 1}.</span>
                              <span className="text-gray-700 text-lg">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
                        <h4 className="text-2xl font-bold text-purple-800 mb-4">🔗 Learning Resources</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {page.resources.map((resource, idx) => (
                            <a
                              key={idx}
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-all flex items-center gap-3 group"
                            >
                              <span className="text-3xl">{resource.icon}</span>
                              <span className="font-semibold text-gray-700 group-hover:text-indigo-600">{resource.name}</span>
                              <span className="ml-auto text-gray-400 group-hover:text-indigo-600">→</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                }
              })()}
            </div>
          </div>
        )}

        {/* History Section */}
        {botHistory.length > 0 && !botAnswer && (
          <div className="glass-effect p-6 rounded-2xl shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span>📜</span>
                Recent Questions ({botHistory.length})
              </h3>
              <button
                onClick={clearHistory}
                className="bg-red-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-red-600 transition-all flex items-center gap-2"
              >
                <span>🗑️</span>
                <span>Clear History</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {botHistory.slice(0, 6).map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setBotAnswer(item)
                    setCurrentPage(0)
                  }}
                  className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-all text-left group"
                >
                  <p className="font-semibold text-gray-800 group-hover:text-indigo-600 line-clamp-2">{item.question}</p>
                  <p className="text-xs text-gray-500 mt-2">{new Date(item.timestamp).toLocaleString()}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AIBotTab
