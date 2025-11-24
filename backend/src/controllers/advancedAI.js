// Advanced AI Features - Pattern Recognition, Code Analysis, Multi-Language Support

// Advanced Pattern Matching System
export class PatternRecognizer {
  constructor() {
    this.patterns = {
      // Code-related patterns
      // Added 'show' & 'display' so queries like "Show me quicksort in Python" are classified as code intent
      codeRequest: /(?:write|create|implement|build|generate|code|make|show|display)\s+(?:me\s+)?(?:a|an|the)?\s*(.+)/i,
      debugRequest: /(?:debug|fix|error|issue|problem|bug|wrong)\s+(.+)/i,
      explainRequest: /(?:explain|describe|what is|how does|tell me about)\s+(.+)/i,
      optimizeRequest: /(?:optimize|improve|enhance|better|faster)\s+(.+)/i,
      compareRequest: /(?:compare|difference between|vs|versus)\s+(.+?)\s+(?:and|vs|versus)\s+(.+)/i,
      
      // Algorithm patterns
      sortingAlgo: /(?:bubble|quick|merge|heap|insertion|selection|radix|counting)\s*sort/i,
      searchingAlgo: /(?:linear|binary|interpolation|jump|exponential)\s*search/i,
      graphAlgo: /(?:bfs|dfs|dijkstra|bellman|floyd|kruskal|prim|topological)/i,
      dpPattern: /(?:dynamic programming|dp|memoization|tabulation|knapsack|lcs|lis)/i,
      
      // Data structure patterns
      dataStructure: /(?:array|list|stack|queue|tree|graph|heap|hash|trie|segment tree|fenwick|disjoint set)/i,
      
      // Language patterns
      pythonCode: /\bpython\b/i,
      javascriptCode: /\b(?:javascript|js|node(?:\.js)?|react|vue|angular)\b/i,
      javaCode: /\bjava\b(?!\s*script)/i,
      cppCode: /\b(?:c\+\+|cpp)\b/i,
      cCode: /\bc\b(?!\+)/i,
      goCode: /\bgo(?:lang)?\b/i,
      rustCode: /\brust\b/i,
      
      // Topic patterns
      webDev: /(?:web|http|api|rest|graphql|express|flask|django|spring)/i,
      database: /(?:sql|database|mysql|postgres|mongodb|redis|nosql)/i,
      machineLearning: /(?:ml|machine learning|ai|neural|deep learning|tensorflow|pytorch)/i,
      systemDesign: /(?:system design|architecture|scalability|microservices|distributed)/i
    };
  }

  analyze(question) {
    const analysis = {
      intent: null,
      topics: [],
      language: null,
      complexity: 'medium',
      keywords: []
    };

    const lowerQ = question.toLowerCase();

    // Detect intent
    if (this.patterns.codeRequest.test(lowerQ)) analysis.intent = 'code';
    else if (this.patterns.debugRequest.test(lowerQ)) analysis.intent = 'debug';
    else if (this.patterns.explainRequest.test(lowerQ)) analysis.intent = 'explain';
    else if (this.patterns.optimizeRequest.test(lowerQ)) analysis.intent = 'optimize';
    else if (this.patterns.compareRequest.test(lowerQ)) analysis.intent = 'compare';
    else analysis.intent = 'general';

    // Detect topics
    if (this.patterns.sortingAlgo.test(lowerQ)) analysis.topics.push('sorting');
    if (this.patterns.searchingAlgo.test(lowerQ)) analysis.topics.push('searching');
    if (this.patterns.graphAlgo.test(lowerQ)) analysis.topics.push('graph');
    if (this.patterns.dpPattern.test(lowerQ)) analysis.topics.push('dynamic-programming');
    if (this.patterns.dataStructure.test(lowerQ)) analysis.topics.push('data-structure');
    if (this.patterns.webDev.test(lowerQ)) analysis.topics.push('web-development');
    if (this.patterns.database.test(lowerQ)) analysis.topics.push('database');
    if (this.patterns.machineLearning.test(lowerQ)) analysis.topics.push('machine-learning');
    if (this.patterns.systemDesign.test(lowerQ)) analysis.topics.push('system-design');

    // Detect language preference
    if (this.patterns.pythonCode.test(lowerQ)) analysis.language = 'python';
    else if (this.patterns.javascriptCode.test(lowerQ)) analysis.language = 'javascript';
    else if (this.patterns.javaCode.test(lowerQ)) analysis.language = 'java';
    else if (this.patterns.cppCode.test(lowerQ)) analysis.language = 'cpp';
    else if (this.patterns.cCode.test(lowerQ)) analysis.language = 'c';
    else if (this.patterns.goCode.test(lowerQ)) analysis.language = 'go';
    else if (this.patterns.rustCode.test(lowerQ)) analysis.language = 'rust';

    // Extract keywords
    analysis.keywords = this.extractKeywords(lowerQ);

    return analysis;
  }

  extractKeywords(text) {
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'how', 'what', 'when', 'where', 'why', 'which']);
    
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word));
    
    // Count frequencies
    const freq = {};
    words.forEach(word => freq[word] = (freq[word] || 0) + 1);
    
    // Return top keywords
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);
  }
}

// Code Analyzer - Detects code in questions and provides analysis
export class CodeAnalyzer {
  analyzeCode(code) {
    const analysis = {
      language: this.detectLanguage(code),
      complexity: this.estimateComplexity(code),
      issues: this.findIssues(code),
      suggestions: []
    };

    if (analysis.issues.length > 0) {
      analysis.suggestions = this.generateSuggestions(analysis.issues);
    }

    return analysis;
  }

  detectLanguage(code) {
    if (/def\s+\w+\(|import\s+\w+|print\(/.test(code)) return 'python';
    if (/function\s+\w+\(|const\s+\w+\s*=|let\s+\w+\s*=|=>/.test(code)) return 'javascript';
    if (/public\s+class|private\s+\w+|System\.out/.test(code)) return 'java';
    if (/#include|int\s+main\(|std::/.test(code)) return 'cpp';
    if (/func\s+\w+\(|package\s+main|fmt\.Print/.test(code)) return 'go';
    return 'unknown';
  }

  estimateComplexity(code) {
    let complexity = 'O(1)';
    const lines = code.split('\n');
    
    let nestedLoops = 0;
    let inLoop = 0;
    
    for (const line of lines) {
      if (/\b(?:for|while)\b/.test(line)) {
        inLoop++;
        nestedLoops = Math.max(nestedLoops, inLoop);
      }
      if (/}/.test(line)) {
        inLoop = Math.max(0, inLoop - 1);
      }
    }

    if (nestedLoops === 0) complexity = 'O(1) or O(n)';
    else if (nestedLoops === 1) complexity = 'O(n)';
    else if (nestedLoops === 2) complexity = 'O(n²)';
    else if (nestedLoops >= 3) complexity = 'O(n³) or higher';

    if (/\bsort\b/.test(code)) complexity += ' (with O(n log n) from sorting)';
    if (/\brecursive|recursion/.test(code)) complexity += ' (with recursion overhead)';

    return complexity;
  }

  findIssues(code) {
    const issues = [];

    // Common issues
    if (/var\s+/.test(code)) issues.push('Using "var" - consider "let" or "const"');
    if (/==(?!=)/.test(code)) issues.push('Using == instead of === (loose equality)');
    if (/catch\s*\(\s*\)\s*{/.test(code)) issues.push('Empty catch block - handle errors properly');
    if (/console\.log/.test(code) && code.split('console.log').length > 3) {
      issues.push('Multiple console.log statements - consider using a logger');
    }

    return issues;
  }

  generateSuggestions(issues) {
    return issues.map(issue => {
      if (issue.includes('var')) return 'Use "const" for constants and "let" for variables';
      if (issue.includes('==')) return 'Use === for strict equality checks';
      if (issue.includes('catch')) return 'Add error handling logic in catch blocks';
      if (issue.includes('console.log')) return 'Use a proper logging library for production';
      return 'Follow best practices for cleaner code';
    });
  }
}

// Smart Response Generator with Context Understanding
export class SmartResponseGenerator {
  constructor() {
    this.patternRecognizer = new PatternRecognizer();
    this.codeAnalyzer = new CodeAnalyzer();
    this.conversationContext = new Map();
  }

  generateAdvancedResponse(question, sessionId, history = []) {
    const analysis = this.patternRecognizer.analyze(question);
    
    // Update context
    this.updateContext(sessionId, analysis);
    
    let response = '';

    // Generate response based on intent
    switch (analysis.intent) {
      case 'code':
        response = this.generateCodeResponse(question, analysis);
        break;
      case 'debug':
        response = this.generateDebugResponse(question, analysis);
        break;
      case 'explain':
        response = this.generateExplanationResponse(question, analysis);
        break;
      case 'optimize':
        response = this.generateOptimizationResponse(question, analysis);
        break;
      case 'compare':
        response = this.generateComparisonResponse(question, analysis);
        break;
      default:
        response = this.generateGeneralResponse(question, analysis);
    }

    // Add follow-up suggestions
    response += this.generateFollowUp(analysis);

    return response;
  }

  updateContext(sessionId, analysis) {
    if (!this.conversationContext.has(sessionId)) {
      this.conversationContext.set(sessionId, {
        topics: [],
        language: null,
        complexity: []
      });
    }

    const context = this.conversationContext.get(sessionId);
    context.topics = [...new Set([...context.topics, ...analysis.topics])];
    if (analysis.language) context.language = analysis.language;
    context.complexity.push(analysis.complexity);
  }

  generateCodeResponse(question, analysis) {
    const lang = analysis.language || 'python';
    const topics = analysis.topics;

    let response = `# Code Implementation\n\n`;
    response += `**Language:** ${lang.toUpperCase()}\n`;
    response += `**Topics:** ${topics.join(', ') || 'General'}\n\n`;
    
    response += this.getCodeTemplate(question, lang, topics);
    response += `\n\n**Best Practices:**\n`;
    response += `- Add error handling for edge cases\n`;
    response += `- Write unit tests to verify correctness\n`;
    response += `- Document with clear comments\n`;
    response += `- Consider time and space complexity\n`;

    return response;
  }

  getCodeTemplate(question, lang, topics) {
    // Multi-language code generation
    const templates = {
      python: {
        function: `\`\`\`python\ndef solution(input_data):\n    """\n    ${question}\n    \n    Args:\n        input_data: Input parameters\n    \n    Returns:\n        Result of the operation\n    \n    Time Complexity: O(?)\n    Space Complexity: O(?)\n    """\n    # Implementation here\n    result = None\n    \n    # Process data\n    for item in input_data:\n        # Logic here\n        pass\n    \n    return result\n\n# Example usage\nif __name__ == "__main__":\n    test_data = [1, 2, 3, 4, 5]\n    output = solution(test_data)\n    print(f"Result: {output}")\n\`\`\``,
        class: `\`\`\`python\nclass Solution:\n    def __init__(self):\n        self.data = []\n    \n    def process(self, input_data):\n        """\n        ${question}\n        \n        Args:\n            input_data: Input to process\n        \n        Returns:\n            Processed result\n        """\n        result = []\n        for item in input_data:\n            # Process each item\n            processed = self._helper(item)\n            result.append(processed)\n        return result\n    \n    def _helper(self, item):\n        # Helper method\n        return item * 2\n\n# Usage\nsolution = Solution()\noutput = solution.process([1, 2, 3])\nprint(output)\n\`\`\``
      },
      javascript: {
        function: `\`\`\`javascript\n/**\n * ${question}\n * \n * @param {Array} inputData - Input parameters\n * @returns {*} Result of the operation\n * \n * Time Complexity: O(?)\n * Space Complexity: O(?)\n */\nfunction solution(inputData) {\n    let result = null;\n    \n    // Process data\n    for (const item of inputData) {\n        // Logic here\n    }\n    \n    return result;\n}\n\n// Example usage\nconst testData = [1, 2, 3, 4, 5];\nconst output = solution(testData);\nconsole.log('Result:', output);\n\`\`\``,
        class: `\`\`\`javascript\nclass Solution {\n    constructor() {\n        this.data = [];\n    }\n    \n    /**\n     * ${question}\n     * @param {Array} inputData - Input to process\n     * @returns {Array} Processed result\n     */\n    process(inputData) {\n        const result = [];\n        for (const item of inputData) {\n            const processed = this._helper(item);\n            result.push(processed);\n        }\n        return result;\n    }\n    \n    _helper(item) {\n        return item * 2;\n    }\n}\n\n// Usage\nconst solution = new Solution();\nconst output = solution.process([1, 2, 3]);\nconsole.log(output);\n\`\`\``
      },
      java: {
        class: `\`\`\`java\nimport java.util.*;\n\n/**\n * ${question}\n */\npublic class Solution {\n    \n    /**\n     * Process the input data\n     * \n     * @param inputData The input array\n     * @return Processed result\n     * \n     * Time Complexity: O(?)\n     * Space Complexity: O(?)\n     */\n    public List<Integer> process(List<Integer> inputData) {\n        List<Integer> result = new ArrayList<>();\n        \n        for (Integer item : inputData) {\n            // Process each item\n            int processed = helper(item);\n            result.add(processed);\n        }\n        \n        return result;\n    }\n    \n    private int helper(int item) {\n        return item * 2;\n    }\n    \n    public static void main(String[] args) {\n        Solution solution = new Solution();\n        List<Integer> testData = Arrays.asList(1, 2, 3, 4, 5);\n        List<Integer> output = solution.process(testData);\n        System.out.println("Result: " + output);\n    }\n}\n\`\`\``
      }
    };

    const langTemplates = templates[lang] || templates.python;
    return langTemplates.function || langTemplates.class;
  }

  generateDebugResponse(question, analysis) {
    let response = `# Debugging Guide\n\n`;
    response += `**Issue Type:** ${analysis.topics.join(', ') || 'General'}\n\n`;
    
    response += `## Common Causes:\n`;
    response += `1. **Null/Undefined Values** - Check if variables are properly initialized\n`;
    response += `2. **Off-by-One Errors** - Verify loop boundaries and array indices\n`;
    response += `3. **Type Mismatches** - Ensure correct data types are being used\n`;
    response += `4. **Async Issues** - Check if async operations are properly awaited\n`;
    response += `5. **Scope Problems** - Verify variable accessibility\n\n`;
    
    response += `## Debugging Steps:\n`;
    response += `\`\`\`${analysis.language || 'javascript'}\n`;
    response += `// 1. Add console.log or debugger statements\n`;
    response += `console.log('Variable value:', yourVariable);\n\n`;
    response += `// 2. Check for null/undefined\n`;
    response += `if (!yourVariable) {\n    console.error('Variable is null or undefined');\n}\n\n`;
    response += `// 3. Use try-catch for error handling\n`;
    response += `try {\n    // Your code here\n} catch (error) {\n    console.error('Error:', error.message);\n    console.error('Stack trace:', error.stack);\n}\n`;
    response += `\`\`\`\n\n`;
    
    response += `## Prevention:\n`;
    response += `- Use strict mode (\`"use strict"\` in JavaScript)\n`;
    response += `- Enable linting (ESLint, Pylint, etc.)\n`;
    response += `- Write unit tests\n`;
    response += `- Use TypeScript for type safety\n`;
    
    return response;
  }

  generateExplanationResponse(question, analysis) {
    let response = `# Explanation\n\n`;
    
    if (analysis.topics.includes('sorting')) {
      response += this.explainSorting(analysis);
    } else if (analysis.topics.includes('searching')) {
      response += this.explainSearching(analysis);
    } else if (analysis.topics.includes('data-structure')) {
      response += this.explainDataStructure(question, analysis);
    } else {
      response += `**Topic:** ${question}\n\n`;
      response += `This is a comprehensive explanation of the requested topic.\n\n`;
      response += `**Key Concepts:**\n`;
      response += `- Fundamental principles and theory\n`;
      response += `- Practical applications and use cases\n`;
      response += `- Performance characteristics\n`;
      response += `- Best practices and common pitfalls\n\n`;
      response += `**Example Implementation:**\n`;
      response += this.getCodeTemplate(question, analysis.language || 'python', analysis.topics);
    }
    
    return response;
  }

  explainSorting(analysis) {
    return `**Sorting Algorithms Overview**\n\n` +
      `**Comparison-Based Sorts:**\n` +
      `- **Bubble Sort**: O(n²) - Simple but inefficient, swaps adjacent elements\n` +
      `- **Selection Sort**: O(n²) - Finds minimum and places it at beginning\n` +
      `- **Insertion Sort**: O(n²) - Builds sorted array one element at a time\n` +
      `- **Merge Sort**: O(n log n) - Divide and conquer, stable, requires O(n) space\n` +
      `- **Quick Sort**: O(n log n) avg, O(n²) worst - Fast in practice, in-place\n` +
      `- **Heap Sort**: O(n log n) - Uses heap data structure, in-place\n\n` +
      `**Non-Comparison Sorts:**\n` +
      `- **Counting Sort**: O(n+k) - For integers in range [0, k]\n` +
      `- **Radix Sort**: O(d×n) - Sorts by digit positions\n` +
      `- **Bucket Sort**: O(n+k) - Distributes elements into buckets\n\n` +
      `**When to Use:**\n` +
      `- Small datasets (< 50): Insertion Sort\n` +
      `- General purpose: Quick Sort or Merge Sort\n` +
      `- Stability required: Merge Sort\n` +
      `- Limited memory: Heap Sort or Quick Sort\n` +
      `- Nearly sorted: Insertion Sort\n` +
      `- Integers in range: Counting/Radix Sort\n`;
  }

  explainSearching(analysis) {
    return `**Searching Algorithms Overview**\n\n` +
      `**Linear Search:**\n` +
      `- Time: O(n)\n` +
      `- Works on unsorted data\n` +
      `- Simple but slow for large datasets\n\n` +
      `**Binary Search:**\n` +
      `- Time: O(log n)\n` +
      `- Requires sorted data\n` +
      `- Very efficient for large datasets\n\n` +
      `**Advanced Searching:**\n` +
      `- **Interpolation Search**: O(log log n) for uniformly distributed data\n` +
      `- **Jump Search**: O(√n) for sorted arrays\n` +
      `- **Exponential Search**: O(log n) for unbounded/infinite arrays\n` +
      `- **Ternary Search**: O(log₃ n) for unimodal functions\n\n` +
      `**Hash-Based Search:**\n` +
      `- Time: O(1) average\n` +
      `- Uses hash tables/dictionaries\n` +
      `- Best for frequent lookups\n`;
  }

  explainDataStructure(question, analysis) {
    const lowerQ = question.toLowerCase();
    if (lowerQ.includes('tree')) return this.explainTrees();
    if (lowerQ.includes('graph')) return this.explainGraphs();
    if (lowerQ.includes('hash')) return this.explainHashTables();
    return `Data structure explanation for: ${question}`;
  }

  explainTrees() {
    return `**Tree Data Structures**\n\n` +
      `**Binary Tree:**\n` +
      `- Each node has at most 2 children\n` +
      `- Height: O(log n) balanced, O(n) skewed\n\n` +
      `**Binary Search Tree (BST):**\n` +
      `- Left < Root < Right property\n` +
      `- Operations: O(log n) balanced, O(n) skewed\n\n` +
      `**Balanced Trees:**\n` +
      `- **AVL Tree**: Strictly balanced, height difference ≤ 1\n` +
      `- **Red-Black Tree**: Less strict, faster insertions\n` +
      `- **B-Tree**: Multiple keys per node, used in databases\n\n` +
      `**Special Trees:**\n` +
      `- **Heap**: Complete binary tree, min/max property\n` +
      `- **Trie**: Prefix tree for strings\n` +
      `- **Segment Tree**: For range queries\n` +
      `- **Fenwick Tree**: For cumulative frequency\n`;
  }

  explainGraphs() {
    return `**Graph Data Structures**\n\n` +
      `**Representations:**\n` +
      `- **Adjacency Matrix**: O(V²) space, O(1) edge lookup\n` +
      `- **Adjacency List**: O(V+E) space, efficient for sparse graphs\n\n` +
      `**Types:**\n` +
      `- Directed vs Undirected\n` +
      `- Weighted vs Unweighted\n` +
      `- Cyclic vs Acyclic (DAG)\n` +
      `- Connected vs Disconnected\n\n` +
      `**Algorithms:**\n` +
      `- **Traversal**: BFS O(V+E), DFS O(V+E)\n` +
      `- **Shortest Path**: Dijkstra O(E log V), Bellman-Ford O(VE)\n` +
      `- **MST**: Kruskal O(E log E), Prim O(E log V)\n` +
      `- **Topological Sort**: O(V+E) for DAGs\n` +
      `- **Strongly Connected**: Kosaraju O(V+E)\n`;
  }

  explainHashTables() {
    return `**Hash Tables**\n\n` +
      `**Concept:**\n` +
      `- Maps keys to values using hash function\n` +
      `- Average O(1) insert, delete, search\n` +
      `- Worst case O(n) with poor hash function\n\n` +
      `**Collision Resolution:**\n` +
      `- **Chaining**: Store collisions in linked lists\n` +
      `- **Open Addressing**: \n` +
      `  - Linear Probing: Check next slot\n` +
      `  - Quadratic Probing: Check i² slots away\n` +
      `  - Double Hashing: Use second hash function\n\n` +
      `**Load Factor:**\n` +
      `- α = n/m (elements/buckets)\n` +
      `- Resize when α > 0.75\n` +
      `- Rehashing: O(n) but amortized O(1)\n\n` +
      `**Applications:**\n` +
      `- Caching (LRU cache)\n` +
      `- Database indexing\n` +
      `- Symbol tables in compilers\n` +
      `- Deduplication\n`;
  }

  generateOptimizationResponse(question, analysis) {
    let response = `# Optimization Guide\n\n`;
    
    response += `**Performance Optimization Strategies:**\n\n`;
    response += `## 1. Time Complexity\n`;
    response += `- Replace O(n²) with O(n log n) or O(n) algorithms\n`;
    response += `- Use hash tables for O(1) lookups instead of O(n) searches\n`;
    response += `- Implement caching/memoization for repeated calculations\n\n`;
    
    response += `## 2. Space Complexity\n`;
    response += `- Use in-place algorithms when possible\n`;
    response += `- Reuse data structures instead of creating new ones\n`;
    response += `- Use generators/iterators for large datasets\n\n`;
    
    response += `## 3. Code-Level Optimizations\n`;
    response += `\`\`\`${analysis.language || 'python'}\n`;
    response += `# Before: O(n²)\n`;
    response += `for i in range(len(arr)):\n    for j in range(len(arr)):\n        if arr[i] + arr[j] == target:\n            return [i, j]\n\n`;
    response += `# After: O(n) with hash table\n`;
    response += `seen = {}\n`;
    response += `for i, num in enumerate(arr):\n    complement = target - num\n    if complement in seen:\n        return [seen[complement], i]\n    seen[num] = i\n`;
    response += `\`\`\`\n\n`;
    
    response += `## 4. Database Optimizations\n`;
    response += `- Add indexes on frequently queried columns\n`;
    response += `- Use connection pooling\n`;
    response += `- Implement query caching\n`;
    response += `- Avoid N+1 query problems\n`;
    response += `- Use pagination for large result sets\n\n`;
    
    response += `## 5. General Best Practices\n`;
    response += `- Profile before optimizing (measure, don't guess)\n`;
    response += `- Optimize the bottleneck first (80/20 rule)\n`;
    response += `- Balance readability with performance\n`;
    response += `- Consider memory vs CPU tradeoffs\n`;
    
    return response;
  }

  generateComparisonResponse(question, analysis) {
    const match = question.match(/(?:compare|difference between|vs|versus)\s+(.+?)\s+(?:and|vs|versus)\s+(.+)/i);
    
    let response = `# Comparison\n\n`;
    
    if (match) {
      const item1 = match[1].trim();
      const item2 = match[2].trim();
      
      response += `## ${item1} vs ${item2}\n\n`;
      response += `| Aspect | ${item1} | ${item2} |\n`;
      response += `|--------|----------|----------|\n`;
      response += `| Use Case | Specific scenarios | Alternative scenarios |\n`;
      response += `| Performance | Complexity analysis | Complexity analysis |\n`;
      response += `| Memory | Space requirements | Space requirements |\n`;
      response += `| Pros | Advantages | Advantages |\n`;
      response += `| Cons | Disadvantages | Disadvantages |\n\n`;
      
      response += `**When to use ${item1}:**\n`;
      response += `- Scenario A\n- Scenario B\n\n`;
      
      response += `**When to use ${item2}:**\n`;
      response += `- Scenario C\n- Scenario D\n`;
    }
    
    return response;
  }

  generateGeneralResponse(question, analysis) {
    let response = `# ${question}\n\n`;
    response += `**Topics Detected:** ${analysis.topics.join(', ') || 'General'}\n\n`;
    
    if (analysis.keywords.length > 0) {
      response += `**Key Concepts:** ${analysis.keywords.join(', ')}\n\n`;
    }
    
    response += `This topic relates to ${analysis.topics.join(' and ') || 'programming'}. `;
    response += `For more specific help, try asking about:\n`;
    response += `- Implementation details\n`;
    response += `- Code examples\n`;
    response += `- Performance analysis\n`;
    response += `- Common use cases\n`;
    response += `- Best practices\n`;
    
    return response;
  }

  generateFollowUp(analysis) {
    let followUp = `\n\n---\n\n**💡 Follow-up Questions:**\n`;
    
    if (analysis.topics.includes('sorting')) {
      followUp += `- "Compare time complexities of different sorting algorithms"\n`;
      followUp += `- "When should I use merge sort vs quick sort?"\n`;
    }
    
    if (analysis.topics.includes('data-structure')) {
      followUp += `- "What are the performance characteristics?"\n`;
      followUp += `- "Show me advanced operations"\n`;
    }
    
    if (analysis.intent === 'code') {
      followUp += `- "How can I optimize this code?"\n`;
      followUp += `- "What are the edge cases to consider?"\n`;
    }
    
    followUp += `- "Explain with a real-world example"\n`;
    followUp += `- "Show me in ${analysis.language || 'another language'}"\n`;
    
    return followUp;
  }
}
