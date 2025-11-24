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
        <div className="mb-8 text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 opacity-10 blur-3xl rounded-full"></div>
          <h2 className="text-5xl font-black mb-3 flex items-center justify-center relative z-10">
            <span className="text-6xl mr-4 animate-bounce" style={{filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.6))'}}>🤖</span>
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
              AI Learning Bot
            </span>
          </h2>
          <p className="text-gray-600 text-lg font-semibold relative z-10">🌟 Ask anything • Get visual answers • Learn smarter 🚀</p>
          <div className="flex justify-center gap-3 mt-4">
            <span className="px-4 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm rounded-full font-bold shadow-lg">Theory</span>
            <span className="px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-full font-bold shadow-lg">Mind Maps</span>
            <span className="px-4 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm rounded-full font-bold shadow-lg">Code</span>
            <span className="px-4 py-1 bg-gradient-to-r from-green-500 to-teal-500 text-white text-sm rounded-full font-bold shadow-lg">Comics</span>
          </div>
        </div>

        {/* Question Input Form */}
        <div className="relative mb-8 group">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
          <div className="relative backdrop-blur-xl bg-white/40 border border-white/50 p-8 rounded-3xl shadow-2xl">
            <form onSubmit={handleBotSubmit} className="flex gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-20"></div>
                <input
                  type="text"
                  value={botQuestion}
                  onChange={(e) => setBotQuestion(e.target.value)}
                  placeholder="✨ Ask me anything... Try: 'What is Quick Sort?' or 'Explain Neural Networks'"
                  className="relative w-full px-6 py-5 rounded-2xl border-2 border-purple-300/50 bg-white/80 backdrop-blur-sm focus:border-purple-500 focus:bg-white focus:shadow-lg focus:shadow-purple-500/20 focus:outline-none text-lg font-medium transition-all"
                  disabled={isGenerating}
                  style={{boxShadow: '0 8px 32px 0 rgba(139, 92, 246, 0.1)'}}
                />
              </div>
              <button
                type="submit"
                disabled={isGenerating || !botQuestion.trim()}
                className="relative overflow-hidden bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white px-10 py-5 rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-3 group"
                style={{boxShadow: '0 10px 40px 0 rgba(139, 92, 246, 0.3)'}}
              >
                <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-colors"></div>
                {isGenerating ? (
                  <>
                    <span className="animate-spin text-2xl relative z-10">⏳</span>
                    <span className="relative z-10">Generating...</span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl relative z-10 group-hover:rotate-12 transition-transform">🚀</span>
                    <span className="relative z-10">Ask Bot</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Loading State */}
        {isGenerating && (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-30 animate-pulse"></div>
            <div className="relative backdrop-blur-xl bg-white/50 border border-white/60 p-16 rounded-3xl shadow-2xl text-center">
              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 border-8 border-purple-300 border-t-cyan-500 border-r-pink-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 w-24 h-24 border-8 border-pink-300 border-b-purple-500 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1s'}}></div>
                  <span className="absolute inset-0 flex items-center justify-center text-4xl animate-pulse">🧠</span>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">AI is analyzing your question...</p>
                  <p className="text-gray-600 font-semibold">⚡ Generating theory • 🧠 Creating mind maps • 💻 Writing code • 🎨 Drawing comics</p>
                </div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Answer Display */}
        {botAnswer && !isGenerating && (
          <div className="space-y-6">
            {/* Question Header */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative backdrop-blur-xl bg-white/60 border border-white/60 p-8 rounded-3xl shadow-xl border-l-8 border-l-purple-500">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 flex items-center gap-2">
                      <span className="text-3xl">💬</span> Your Question
                    </h3>
                    <p className="text-xl text-gray-800 font-semibold">{botAnswer.question}</p>
                  </div>
                  <button
                    onClick={resetBot}
                    className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-2xl font-bold hover:shadow-lg hover:shadow-red-500/50 hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <span className="text-xl">✖</span> Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Page Navigation */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-3xl blur opacity-20"></div>
              <div className="relative flex justify-between items-center backdrop-blur-xl bg-white/50 border border-white/60 p-6 rounded-3xl shadow-xl">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className="flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-xl hover:shadow-cyan-500/50 hover:scale-105 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 group"
                >
                  <span className="text-2xl group-hover:-translate-x-1 transition-transform">←</span>
                  <span>Previous</span>
                </button>
                <div className="text-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                  <p className="text-sm text-white/80 font-bold">Page {currentPage + 1} / {botAnswer.pages.length}</p>
                  <p className="font-black text-white text-lg">{botAnswer.pages[currentPage].title}</p>
                </div>
                <button
                  onClick={nextPage}
                  disabled={currentPage === botAnswer.pages.length - 1}
                  className="flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-xl hover:shadow-pink-500/50 hover:scale-105 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 group"
                >
                  <span>Next</span>
                  <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>

            {/* Current Page Content */}
            <div className="relative min-h-[600px]">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-500 to-orange-500 rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative backdrop-blur-xl bg-white/60 border border-white/70 p-10 rounded-3xl shadow-2xl">
              {(() => {
                const page = botAnswer.pages[currentPage]
                
                if (page.type === 'theory') {
                  return (
                    <div className="space-y-6">
                      <div className="border-b-4 border-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-border pb-4">
                        <h3 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                          <span className="text-5xl">📚</span>
                          {page.title}
                        </h3>
                      </div>
                      
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                        <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl border border-blue-200 shadow-lg">
                          <h4 className="text-2xl font-black text-blue-800 mb-4 flex items-center gap-2">
                            <span className="text-3xl">🎯</span> Definition
                          </h4>
                          <p className="text-gray-800 text-xl leading-relaxed font-medium">{page.content.definition}</p>
                        </div>
                      </div>

                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                        <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-200 shadow-lg">
                          <h4 className="text-2xl font-black text-green-800 mb-5 flex items-center gap-2">
                            <span className="text-3xl">✨</span> Key Points
                          </h4>
                          <ul className="space-y-4">
                            {page.content.keyPoints.map((point, idx) => (
                              <li key={idx} className="flex items-start gap-4 group/item">
                                <span className="text-3xl group-hover/item:scale-125 transition-transform">✅</span>
                                <span className="text-gray-800 text-lg font-semibold">{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {page.content.formula && (
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                          <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl border border-purple-200 shadow-lg">
                            <h4 className="text-2xl font-black text-purple-800 mb-4 flex items-center gap-2">
                              <span className="text-3xl">🧮</span> Formula/Notation
                            </h4>
                            <p className="text-gray-800 text-xl font-mono bg-white/80 p-6 rounded-xl shadow-inner border-2 border-purple-300">{page.content.formula}</p>
                          </div>
                        </div>
                      )}

                      {/* Visual Diagram */}
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                        <div className="relative bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8 rounded-2xl border border-indigo-200 shadow-lg">
                          <h4 className="text-2xl font-black text-indigo-800 mb-6 flex items-center gap-2">
                            <span className="text-3xl">📊</span> Visual Flow
                          </h4>
                          <div className="flex justify-center items-center gap-6 py-10 flex-wrap">
                            {page.visual.nodes.map((node, idx) => (
                              <React.Fragment key={node.id}>
                                <div className={`${node.color} text-white px-8 py-5 rounded-2xl shadow-2xl font-black text-center min-w-[140px] hover:scale-110 transition-transform border-4 border-white/50`}>
                                  {node.label}
                                </div>
                                {idx < page.visual.nodes.length - 1 && (
                                  <span className="text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">→</span>
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }
                
                if (page.type === 'mindmap') {
                  return (
                    <div className="space-y-8">
                      <div className="border-b-4 border-transparent bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-border pb-4">
                        <h3 className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
                          <span className="text-5xl">🧠</span>
                          {page.title}
                        </h3>
                      </div>

                      {/* Central Topic */}
                      <div className="flex justify-center my-12">
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl blur-xl opacity-60 group-hover:opacity-80 animate-pulse"></div>
                          <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white px-12 py-8 rounded-3xl shadow-2xl text-center border-4 border-white/30 hover:scale-110 transition-transform">
                            <h4 className="text-3xl font-black">{page.content.central}</h4>
                          </div>
                        </div>
                      </div>

                      {/* Branches */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {page.content.branches.map((branch, idx) => (
                          <div key={idx} className="relative group">
                            <div className={`absolute inset-0 ${branch.color} rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity`}></div>
                            <div className={`relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border-l-8 ${branch.color} hover:scale-105 transition-transform`}>
                              <h5 className={`text-2xl font-black ${branch.color} text-white px-6 py-3 rounded-xl mb-5 inline-block shadow-lg`}>
                                {branch.title}
                              </h5>
                              <ul className="space-y-3">
                                {branch.items.map((item, itemIdx) => (
                                  <li key={itemIdx} className="flex items-start gap-3 group/item">
                                    <span className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover/item:scale-125 transition-transform">•</span>
                                    <span className="text-gray-800 font-semibold text-lg">{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
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
