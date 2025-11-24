// AI Chat Controller with Advanced Local AI
// Features: Pattern Recognition, Code Analysis, Multi-Language Support, Context Understanding

import { PatternRecognizer, CodeAnalyzer, SmartResponseGenerator } from './advancedAI.js';

// Local AI Knowledge Base - No external APIs needed
const ENGINEERING_KNOWLEDGE = {
  dataStructures: {
    array: {
      definition: "An array is a collection of elements stored at contiguous memory locations. It's the simplest and most widely used data structure.",
      operations: ["Access: O(1)", "Search: O(n)", "Insert: O(n)", "Delete: O(n)"],
      useCase: "Use when you need fast random access by index and know the size in advance.",
      code: `// Array Implementation in Python
arr = [1, 2, 3, 4, 5]

# Access element
print(arr[0])  # O(1)

# Search element
def search(arr, target):
    for i, val in enumerate(arr):
        if val == target:
            return i
    return -1

# Insert at end
arr.append(6)  # O(1) amortized

# Insert at position
arr.insert(2, 99)  # O(n)

# Delete element
arr.pop(2)  # O(n)`
    },
    linkedList: {
      definition: "A linked list is a linear data structure where elements are stored in nodes, and each node points to the next node.",
      operations: ["Access: O(n)", "Search: O(n)", "Insert at head: O(1)", "Delete at head: O(1)"],
      useCase: "Use when you need frequent insertions/deletions at the beginning or don't know the size.",
      code: `# Linked List Implementation
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None
    
    def insert_at_beginning(self, data):
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node
    
    def insert_at_end(self, data):
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            return
        current = self.head
        while current.next:
            current = current.next
        current.next = new_node
    
    def delete_node(self, key):
        current = self.head
        if current and current.data == key:
            self.head = current.next
            return
        prev = None
        while current and current.data != key:
            prev = current
            current = current.next
        if current:
            prev.next = current.next
    
    def display(self):
        current = self.head
        while current:
            print(current.data, end=" -> ")
            current = current.next
        print("None")`
    },
    stack: {
      definition: "A stack is a Last-In-First-Out (LIFO) data structure. The last element added is the first one to be removed.",
      operations: ["Push: O(1)", "Pop: O(1)", "Peek: O(1)", "isEmpty: O(1)"],
      useCase: "Use for function call management, undo mechanisms, expression evaluation, backtracking algorithms.",
      code: `# Stack Implementation
class Stack:
    def __init__(self):
        self.items = []
    
    def push(self, item):
        self.items.append(item)
    
    def pop(self):
        if not self.is_empty():
            return self.items.pop()
        raise IndexError("Pop from empty stack")
    
    def peek(self):
        if not self.is_empty():
            return self.items[-1]
        raise IndexError("Peek from empty stack")
    
    def is_empty(self):
        return len(self.items) == 0
    
    def size(self):
        return len(self.items)

# Example: Balanced Parentheses
def is_balanced(expression):
    stack = Stack()
    pairs = {')': '(', '}': '{', ']': '['}
    
    for char in expression:
        if char in '({[':
            stack.push(char)
        elif char in ')}]':
            if stack.is_empty() or stack.pop() != pairs[char]:
                return False
    return stack.is_empty()`
    },
    queue: {
      definition: "A queue is a First-In-First-Out (FIFO) data structure. The first element added is the first one to be removed.",
      operations: ["Enqueue: O(1)", "Dequeue: O(1)", "Front: O(1)", "isEmpty: O(1)"],
      useCase: "Use for task scheduling, breadth-first search, handling requests in order.",
      code: `# Queue Implementation
from collections import deque

class Queue:
    def __init__(self):
        self.items = deque()
    
    def enqueue(self, item):
        self.items.append(item)
    
    def dequeue(self):
        if not self.is_empty():
            return self.items.popleft()
        raise IndexError("Dequeue from empty queue")
    
    def front(self):
        if not self.is_empty():
            return self.items[0]
        raise IndexError("Front from empty queue")
    
    def is_empty(self):
        return len(self.items) == 0
    
    def size(self):
        return len(self.items)

# Example: BFS Traversal
def bfs(graph, start):
    visited = set()
    queue = Queue()
    queue.enqueue(start)
    visited.add(start)
    result = []
    
    while not queue.is_empty():
        vertex = queue.dequeue()
        result.append(vertex)
        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.enqueue(neighbor)
    return result`
    },
    tree: {
      definition: "A tree is a hierarchical data structure with a root node and child nodes forming a parent-child relationship.",
      operations: ["Search: O(log n) to O(n)", "Insert: O(log n) to O(n)", "Delete: O(log n) to O(n)"],
      useCase: "Use for hierarchical data, file systems, databases, decision making.",
      code: `# Binary Tree Implementation
class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

class BinaryTree:
    def __init__(self):
        self.root = None
    
    def inorder(self, node):
        """Left -> Root -> Right"""
        if node:
            self.inorder(node.left)
            print(node.value, end=" ")
            self.inorder(node.right)
    
    def preorder(self, node):
        """Root -> Left -> Right"""
        if node:
            print(node.value, end=" ")
            self.preorder(node.left)
            self.preorder(node.right)
    
    def postorder(self, node):
        """Left -> Right -> Root"""
        if node:
            self.postorder(node.left)
            self.postorder(node.right)
            print(node.value, end=" ")
    
    def height(self, node):
        if not node:
            return 0
        return 1 + max(self.height(node.left), self.height(node.right))

# Binary Search Tree
class BST:
    def insert(self, root, value):
        if not root:
            return TreeNode(value)
        if value < root.value:
            root.left = self.insert(root.left, value)
        else:
            root.right = self.insert(root.right, value)
        return root
    
    def search(self, root, value):
        if not root or root.value == value:
            return root
        if value < root.value:
            return self.search(root.left, value)
        return self.search(root.right, value)`
    },
    graph: {
      definition: "A graph is a non-linear data structure consisting of vertices (nodes) and edges connecting them.",
      operations: ["Add Vertex: O(1)", "Add Edge: O(1)", "Remove Vertex: O(V+E)", "Remove Edge: O(E)"],
      useCase: "Use for networks, social media connections, maps, recommendation systems.",
      code: `# Graph Implementation
class Graph:
    def __init__(self):
        self.graph = {}
    
    def add_vertex(self, vertex):
        if vertex not in self.graph:
            self.graph[vertex] = []
    
    def add_edge(self, v1, v2):
        if v1 in self.graph and v2 in self.graph:
            self.graph[v1].append(v2)
            self.graph[v2].append(v1)  # For undirected graph
    
    def bfs(self, start):
        visited = set()
        queue = [start]
        visited.add(start)
        result = []
        
        while queue:
            vertex = queue.pop(0)
            result.append(vertex)
            for neighbor in self.graph[vertex]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)
        return result
    
    def dfs(self, start, visited=None):
        if visited is None:
            visited = set()
        visited.add(start)
        result = [start]
        
        for neighbor in self.graph[start]:
            if neighbor not in visited:
                result.extend(self.dfs(neighbor, visited))
        return result

# Dijkstra's Algorithm
import heapq

def dijkstra(graph, start):
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    pq = [(0, start)]
    
    while pq:
        current_dist, current = heapq.heappop(pq)
        if current_dist > distances[current]:
            continue
        for neighbor, weight in graph[current]:
            distance = current_dist + weight
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(pq, (distance, neighbor))
    return distances`
    },
    hashTable: {
      definition: "A hash table (hash map) is a data structure that maps keys to values using a hash function for fast lookups.",
      operations: ["Insert: O(1) average", "Delete: O(1) average", "Search: O(1) average"],
      useCase: "Use for fast lookups, caching, counting frequencies, detecting duplicates.",
      code: `# Hash Table Implementation
class HashTable:
    def __init__(self, size=10):
        self.size = size
        self.table = [[] for _ in range(size)]
    
    def _hash(self, key):
        return hash(key) % self.size
    
    def insert(self, key, value):
        hash_index = self._hash(key)
        for i, (k, v) in enumerate(self.table[hash_index]):
            if k == key:
                self.table[hash_index][i] = (key, value)
                return
        self.table[hash_index].append((key, value))
    
    def get(self, key):
        hash_index = self._hash(key)
        for k, v in self.table[hash_index]:
            if k == key:
                return v
        raise KeyError(key)
    
    def delete(self, key):
        hash_index = self._hash(key)
        for i, (k, v) in enumerate(self.table[hash_index]):
            if k == key:
                del self.table[hash_index][i]
                return
        raise KeyError(key)

# Python Dictionary (Built-in Hash Table)
# Count character frequencies
def char_frequency(s):
    freq = {}
    for char in s:
        freq[char] = freq.get(char, 0) + 1
    return freq

# Two Sum Problem using Hash Table
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return None`
    },
    heap: {
      definition: "A heap is a complete binary tree that satisfies the heap property: parent nodes are either greater (max heap) or smaller (min heap) than children.",
      operations: ["Insert: O(log n)", "Delete Max/Min: O(log n)", "Get Max/Min: O(1)", "Heapify: O(n)"],
      useCase: "Use for priority queues, finding kth largest/smallest elements, heap sort.",
      code: `# Heap Implementation using heapq
import heapq

# Min Heap (default in Python)
min_heap = []
heapq.heappush(min_heap, 5)
heapq.heappush(min_heap, 3)
heapq.heappush(min_heap, 7)
smallest = heapq.heappop(min_heap)  # Returns 3

# Max Heap (negate values)
max_heap = []
heapq.heappush(max_heap, -5)
heapq.heappush(max_heap, -3)
heapq.heappush(max_heap, -7)
largest = -heapq.heappop(max_heap)  # Returns 7

# Priority Queue
class PriorityQueue:
    def __init__(self):
        self.heap = []
    
    def push(self, item, priority):
        heapq.heappush(self.heap, (priority, item))
    
    def pop(self):
        return heapq.heappop(self.heap)[1]
    
    def is_empty(self):
        return len(self.heap) == 0

# Find K Largest Elements
def k_largest(nums, k):
    return heapq.nlargest(k, nums)

# Find K Smallest Elements
def k_smallest(nums, k):
    return heapq.nsmallest(k, nums)

# Heap Sort
def heap_sort(arr):
    heapq.heapify(arr)
    return [heapq.heappop(arr) for _ in range(len(arr))]

# Merge K Sorted Lists
def merge_k_sorted(lists):
    heap = []
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(heap, (lst[0], i, 0))
    
    result = []
    while heap:
        val, list_idx, elem_idx = heapq.heappop(heap)
        result.append(val)
        if elem_idx + 1 < len(lists[list_idx]):
            next_val = lists[list_idx][elem_idx + 1]
            heapq.heappush(heap, (next_val, list_idx, elem_idx + 1))
    return result`
    }
  },
  algorithms: {
    binarySearch: {
      definition: "Binary search is an efficient algorithm for finding an item in a sorted array by repeatedly dividing the search interval in half.",
      complexity: "Time: O(log n), Space: O(1) iterative, O(log n) recursive",
      code: `# Binary Search - Iterative
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1

# Binary Search - Recursive
def binary_search_recursive(arr, target, left, right):
    if left > right:
        return -1
    
    mid = left + (right - left) // 2
    
    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        return binary_search_recursive(arr, target, mid + 1, right)
    else:
        return binary_search_recursive(arr, target, left, mid - 1)

# Find First Occurrence
def find_first(arr, target):
    left, right = 0, len(arr) - 1
    result = -1
    
    while left <= right:
        mid = left + (right - left) // 2
        if arr[mid] == target:
            result = mid
            right = mid - 1
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return result

# Find Last Occurrence
def find_last(arr, target):
    left, right = 0, len(arr) - 1
    result = -1
    
    while left <= right:
        mid = left + (right - left) // 2
        if arr[mid] == target:
            result = mid
            left = mid + 1
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return result`
    },
    sorting: {
      definition: "Sorting algorithms arrange elements in a specific order (ascending/descending).",
      types: {
        bubbleSort: "O(n²) - Simple but inefficient, compares adjacent elements",
        quickSort: "O(n log n) average, O(n²) worst - Divide and conquer",
        mergeSort: "O(n log n) - Stable, divide and conquer",
        heapSort: "O(n log n) - Uses heap data structure",
        insertionSort: "O(n²) - Efficient for small/nearly sorted arrays"
      },
      code: `# Bubble Sort
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr

# Quick Sort
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)

# Merge Sort
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result

# Insertion Sort
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr

# Counting Sort (for integers in range)
def counting_sort(arr, max_val):
    count = [0] * (max_val + 1)
    for num in arr:
        count[num] += 1
    
    result = []
    for i, c in enumerate(count):
        result.extend([i] * c)
    return result`
    },
    dynamicProgramming: {
      definition: "Dynamic Programming solves complex problems by breaking them into simpler subproblems and storing results to avoid redundant calculations.",
      approach: "1. Define subproblems, 2. Write recursive relation, 3. Use memoization or tabulation",
      code: `# Fibonacci - DP
def fibonacci_dp(n):
    if n <= 1:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]

# Longest Common Subsequence
def lcs(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]

# 0/1 Knapsack
def knapsack(weights, values, capacity):
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    
    for i in range(1, n + 1):
        for w in range(1, capacity + 1):
            if weights[i-1] <= w:
                dp[i][w] = max(
                    values[i-1] + dp[i-1][w - weights[i-1]],
                    dp[i-1][w]
                )
            else:
                dp[i][w] = dp[i-1][w]
    return dp[n][capacity]

# Coin Change
def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] = min(dp[i], dp[i - coin] + 1)
    
    return dp[amount] if dp[amount] != float('inf') else -1

# Longest Increasing Subsequence
def lis(arr):
    n = len(arr)
    dp = [1] * n
    
    for i in range(1, n):
        for j in range(i):
            if arr[j] < arr[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    
    return max(dp) if dp else 0`
    }
  },

  // ========== MACHINE LEARNING ==========
  machineLearning: {
    supervisedLearning: {
      definition: "Supervised learning uses labeled training data to learn the mapping from inputs to outputs.",
      algorithms: [
        "Linear Regression - Predicts continuous values",
        "Logistic Regression - Binary classification",
        "Decision Trees - Tree-based classification/regression",
        "Random Forest - Ensemble of decision trees",
        "SVM - Support Vector Machines for classification",
        "Neural Networks - Deep learning models"
      ],
      code: `# Linear Regression from Scratch (Python)
import numpy as np

class LinearRegression:
    def __init__(self, learning_rate=0.01, epochs=1000):
        self.lr = learning_rate
        self.epochs = epochs
        self.weights = None
        self.bias = None
    
    def fit(self, X, y):
        n_samples, n_features = X.shape
        self.weights = np.zeros(n_features)
        self.bias = 0
        
        # Gradient Descent
        for epoch in range(self.epochs):
            y_pred = np.dot(X, self.weights) + self.bias
            
            # Compute gradients
            dw = (1/n_samples) * np.dot(X.T, (y_pred - y))
            db = (1/n_samples) * np.sum(y_pred - y)
            
            # Update parameters
            self.weights -= self.lr * dw
            self.bias -= self.lr * db
    
    def predict(self, X):
        return np.dot(X, self.weights) + self.bias

# Usage
X = np.array([[1], [2], [3], [4], [5]])
y = np.array([2, 4, 6, 8, 10])
model = LinearRegression(learning_rate=0.01, epochs=1000)
model.fit(X, y)
predictions = model.predict([[6], [7]])`
    },
    unsupervisedLearning: {
      definition: "Unsupervised learning finds patterns in unlabeled data without explicit outputs.",
      algorithms: [
        "K-Means Clustering - Partitions data into K clusters",
        "Hierarchical Clustering - Creates tree of clusters",
        "DBSCAN - Density-based clustering",
        "PCA - Principal Component Analysis for dimensionality reduction",
        "Autoencoders - Neural networks for feature learning"
      ],
      code: `# K-Means Clustering (Python)
import numpy as np

class KMeans:
    def __init__(self, k=3, max_iters=100):
        self.k = k
        self.max_iters = max_iters
        self.centroids = None
    
    def fit(self, X):
        # Initialize centroids randomly
        idx = np.random.choice(len(X), self.k, replace=False)
        self.centroids = X[idx]
        
        for _ in range(self.max_iters):
            # Assign points to nearest centroid
            clusters = [[] for _ in range(self.k)]
            for point in X:
                distances = [np.linalg.norm(point - c) for c in self.centroids]
                cluster_idx = np.argmin(distances)
                clusters[cluster_idx].append(point)
            
            # Update centroids
            old_centroids = self.centroids.copy()
            for i, cluster in enumerate(clusters):
                if cluster:
                    self.centroids[i] = np.mean(cluster, axis=0)
            
            # Check convergence
            if np.allclose(old_centroids, self.centroids):
                break
    
    def predict(self, X):
        distances = np.array([[np.linalg.norm(point - c) for c in self.centroids] for point in X])
        return np.argmin(distances, axis=1)`
    },
    neuralNetworks: {
      definition: "Artificial neural networks are computing systems inspired by biological neural networks that learn patterns from data.",
      components: [
        "Neurons - Basic units that process information",
        "Layers - Input, Hidden, Output layers",
        "Activation Functions - ReLU, Sigmoid, Tanh, Softmax",
        "Backpropagation - Algorithm to update weights",
        "Loss Functions - MSE, Cross-Entropy",
        "Optimizers - SGD, Adam, RMSprop"
      ],
      code: `# Simple Neural Network (Python with NumPy)
import numpy as np

def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def sigmoid_derivative(x):
    return x * (1 - x)

class NeuralNetwork:
    def __init__(self, input_size, hidden_size, output_size):
        # Initialize weights
        self.weights_ih = np.random.randn(input_size, hidden_size)
        self.weights_ho = np.random.randn(hidden_size, output_size)
        self.bias_h = np.zeros((1, hidden_size))
        self.bias_o = np.zeros((1, output_size))
    
    def forward(self, X):
        # Forward propagation
        self.hidden = sigmoid(np.dot(X, self.weights_ih) + self.bias_h)
        self.output = sigmoid(np.dot(self.hidden, self.weights_ho) + self.bias_o)
        return self.output
    
    def backward(self, X, y, learning_rate=0.1):
        # Backpropagation
        output_error = y - self.output
        output_delta = output_error * sigmoid_derivative(self.output)
        
        hidden_error = output_delta.dot(self.weights_ho.T)
        hidden_delta = hidden_error * sigmoid_derivative(self.hidden)
        
        # Update weights and biases
        self.weights_ho += self.hidden.T.dot(output_delta) * learning_rate
        self.bias_o += np.sum(output_delta, axis=0, keepdims=True) * learning_rate
        self.weights_ih += X.T.dot(hidden_delta) * learning_rate
        self.bias_h += np.sum(hidden_delta, axis=0, keepdims=True) * learning_rate
    
    def train(self, X, y, epochs=10000):
        for epoch in range(epochs):
            self.forward(X)
            self.backward(X, y)

# XOR Problem
X = np.array([[0,0], [0,1], [1,0], [1,1]])
y = np.array([[0], [1], [1], [0]])
nn = NeuralNetwork(2, 4, 1)
nn.train(X, y, epochs=10000)`
    }
  },

  // ========== SYSTEM DESIGN ==========
  systemDesign: {
    loadBalancing: {
      definition: "Load balancing distributes network traffic across multiple servers to ensure no single server bears too much load.",
      types: [
        "Round Robin - Distributes requests sequentially",
        "Least Connections - Sends to server with fewest connections",
        "IP Hash - Routes based on client IP address",
        "Weighted Round Robin - Assigns weights to servers",
        "Least Response Time - Routes to fastest server"
      ],
      useCase: "Essential for high-traffic applications to ensure availability and performance",
      example: `# Simple Round Robin Load Balancer (Python)
class LoadBalancer:
    def __init__(self, servers):
        self.servers = servers
        self.current = 0
    
    def get_server(self):
        server = self.servers[self.current]
        self.current = (self.current + 1) % len(self.servers)
        return server

# Usage
lb = LoadBalancer(['server1:8080', 'server2:8080', 'server3:8080'])
print(lb.get_server())  # server1:8080
print(lb.get_server())  # server2:8080
print(lb.get_server())  # server3:8080`
    },
    caching: {
      definition: "Caching stores frequently accessed data in fast-access storage to reduce latency and database load.",
      strategies: [
        "Cache-Aside - App checks cache, loads from DB on miss",
        "Write-Through - Writes to cache and DB simultaneously",
        "Write-Behind - Writes to cache, async writes to DB",
        "Refresh-Ahead - Preemptively refreshes cache before expiry"
      ],
      algorithms: [
        "LRU - Least Recently Used",
        "LFU - Least Frequently Used",
        "FIFO - First In First Out",
        "Random Replacement"
      ],
      code: `# LRU Cache Implementation (Python)
from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.cache = OrderedDict()
        self.capacity = capacity
    
    def get(self, key):
        if key not in self.cache:
            return -1
        # Move to end (most recently used)
        self.cache.move_to_end(key)
        return self.cache[key]
    
    def put(self, key, value):
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            # Remove oldest (first) item
            self.cache.popitem(last=False)

# Usage
cache = LRUCache(3)
cache.put(1, 'one')
cache.put(2, 'two')
cache.put(3, 'three')
cache.put(4, 'four')  # Evicts 1
print(cache.get(2))   # 'two'`
    },
    microservices: {
      definition: "Microservices architecture structures an application as a collection of loosely coupled, independently deployable services.",
      principles: [
        "Single Responsibility - Each service has one purpose",
        "Autonomous - Services are independent",
        "Decentralized - No central orchestration",
        "Failure Isolation - Failures don't cascade",
        "Technology Diversity - Each service can use different tech"
      ],
      patterns: [
        "API Gateway - Single entry point for all clients",
        "Service Discovery - Services find each other dynamically",
        "Circuit Breaker - Prevents cascade failures",
        "Event Sourcing - Store state as sequence of events",
        "CQRS - Separate read and write models",
        "Saga - Distributed transactions"
      ],
      communication: `// Service Communication Patterns

// 1. Synchronous REST API
fetch('http://user-service/api/users/123')
  .then(res => res.json())
  .then(user => console.log(user));

// 2. Asynchronous Message Queue
const queue = new MessageQueue('user-events');
queue.publish('user.created', { userId: 123, name: 'John' });

// 3. Event-Driven Architecture
eventBus.subscribe('order.placed', async (event) => {
  await inventoryService.reduceStock(event.productId);
  await notificationService.sendEmail(event.userId);
});`
    },
    databases: {
      definition: "Database design patterns for scalability and performance in distributed systems.",
      patterns: [
        "Database Sharding - Horizontal partitioning across servers",
        "Read Replicas - Separate read and write databases",
        "CQRS - Command Query Responsibility Segregation",
        "Event Sourcing - Store changes as events",
        "Database per Service - Each microservice has own DB"
      ],
      scaling: [
        "Vertical - Add more CPU/RAM to single server",
        "Horizontal - Add more servers (sharding)",
        "Caching - Redis/Memcached in front of DB",
        "Indexing - B-tree, Hash indexes for fast queries",
        "Denormalization - Trade storage for query speed"
      ],
      example: `-- Database Sharding Strategy (SQL)

-- Shard 1: Users with ID 1-1000000
CREATE TABLE users_shard_1 (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    CHECK (id BETWEEN 1 AND 1000000)
);

-- Shard 2: Users with ID 1000001-2000000
CREATE TABLE users_shard_2 (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    CHECK (id BETWEEN 1000001 AND 2000000)
);

-- Application-level routing
function getUserShard(userId) {
    if (userId <= 1000000) return 'shard_1';
    else if (userId <= 2000000) return 'shard_2';
    else return 'shard_3';
}`
    }
  },

  // ========== DESIGN PATTERNS ==========
  designPatterns: {
    singleton: {
      definition: "Ensures a class has only one instance and provides a global access point to it.",
      useCase: "Database connections, logging, configuration managers",
      code: `// Singleton Pattern (JavaScript)
class Singleton {
    constructor() {
        if (Singleton.instance) {
            return Singleton.instance;
        }
        this.data = [];
        Singleton.instance = this;
    }

    static getInstance() {
        if (!Singleton.instance) {
            Singleton.instance = new Singleton();
        }
        return Singleton.instance;
    }

    addData(item) {
        this.data.push(item);
    }

    getData() {
        return this.data;
    }
}

// Usage
const instance1 = Singleton.getInstance();
const instance2 = Singleton.getInstance();
console.log(instance1 === instance2); // true`
    },
    factory: {
      definition: "Provides an interface for creating objects without specifying their exact classes.",
      useCase: "When you need to create different types of objects based on input",
      code: `// Factory Pattern (Python)
class Vehicle:
    def __init__(self, type):
        self.type = type
    
    def description(self):
        return f"This is a {self.type}"

class Car(Vehicle):
    def __init__(self):
        super().__init__("Car")

class Bike(Vehicle):
    def __init__(self):
        super().__init__("Bike")

class Truck(Vehicle):
    def __init__(self):
        super().__init__("Truck")

class VehicleFactory:
    @staticmethod
    def create_vehicle(vehicle_type):
        if vehicle_type == "car":
            return Car()
        elif vehicle_type == "bike":
            return Bike()
        elif vehicle_type == "truck":
            return Truck()
        else:
            raise ValueError("Unknown vehicle type")

# Usage
factory = VehicleFactory()
car = factory.create_vehicle("car")
print(car.description())  # "This is a Car"`
    },
    observer: {
      definition: "Defines a one-to-many dependency between objects so when one object changes state, all dependents are notified.",
      useCase: "Event handling systems, MVC pattern, reactive programming",
      code: `// Observer Pattern (JavaScript)
class Subject {
    constructor() {
        this.observers = [];
    }

    subscribe(observer) {
        this.observers.push(observer);
    }

    unsubscribe(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notify(data) {
        this.observers.forEach(observer => observer.update(data));
    }
}

class Observer {
    constructor(name) {
        this.name = name;
    }

    update(data) {
        console.log(\`\${this.name} received: \${data}\`);
    }
}

// Usage
const subject = new Subject();
const observer1 = new Observer('Observer 1');
const observer2 = new Observer('Observer 2');

subject.subscribe(observer1);
subject.subscribe(observer2);
subject.notify('Hello Observers!');
// Output:
// Observer 1 received: Hello Observers!
// Observer 2 received: Hello Observers!`
    },
    strategy: {
      definition: "Defines a family of algorithms, encapsulates each one, and makes them interchangeable.",
      useCase: "Different sorting algorithms, payment methods, compression algorithms",
      code: `# Strategy Pattern (Python)
from abc import ABC, abstractmethod

class PaymentStrategy(ABC):
    @abstractmethod
    def pay(self, amount):
        pass

class CreditCardPayment(PaymentStrategy):
    def __init__(self, card_number):
        self.card_number = card_number
    
    def pay(self, amount):
        return f"Paid \${amount} using Credit Card {self.card_number}"

class PayPalPayment(PaymentStrategy):
    def __init__(self, email):
        self.email = email
    
    def pay(self, amount):
        return f"Paid \${amount} using PayPal account {self.email}"

class CryptoPayment(PaymentStrategy):
    def __init__(self, wallet_address):
        self.wallet_address = wallet_address
    
    def pay(self, amount):
        return f"Paid \${amount} using Crypto wallet {self.wallet_address}"

class ShoppingCart:
    def __init__(self):
        self.total = 0
        self.payment_strategy = None
    
    def set_payment_strategy(self, strategy):
        self.payment_strategy = strategy
    
    def checkout(self):
        if not self.payment_strategy:
            return "No payment method selected"
        return self.payment_strategy.pay(self.total)

# Usage
cart = ShoppingCart()
cart.total = 150

cart.set_payment_strategy(CreditCardPayment("1234-5678-9012-3456"))
print(cart.checkout())

cart.set_payment_strategy(PayPalPayment("user@example.com"))
print(cart.checkout())`
    }
  },

  // ========== SECURITY ==========
  security: {
    authentication: {
      definition: "Authentication verifies the identity of a user, device, or system.",
      methods: [
        "Password-Based - Traditional username/password",
        "Multi-Factor (MFA) - Multiple verification methods",
        "Token-Based - JWT, OAuth tokens",
        "Biometric - Fingerprint, face recognition",
        "Certificate-Based - X.509 certificates",
        "SSO - Single Sign-On"
      ],
      code: `// JWT Authentication (Node.js)
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Registration
async function register(username, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    // Save to database
    await db.users.create({ username, password: hashedPassword });
    return { success: true };
}

// Login
async function login(username, password) {
    const user = await db.users.findOne({ username });
    if (!user) return { error: 'User not found' };
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return { error: 'Invalid password' };
    
    const token = jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
    
    return { token };
}

// Middleware to protect routes
function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
}

// Protected route
app.get('/api/profile', authenticateToken, (req, res) => {
    res.json({ user: req.user });
});`
    },
    encryption: {
      definition: "Encryption transforms data into a secure format that can only be read with the correct key.",
      types: [
        "Symmetric - Same key for encryption/decryption (AES, DES)",
        "Asymmetric - Public/private key pairs (RSA, ECC)",
        "Hashing - One-way transformation (SHA-256, bcrypt)",
        "End-to-End - Only sender and receiver can decrypt"
      ],
      algorithms: [
        "AES-256 - Advanced Encryption Standard (symmetric)",
        "RSA-2048 - Rivest-Shamir-Adleman (asymmetric)",
        "SHA-256 - Secure Hash Algorithm (hashing)",
        "bcrypt - Password hashing with salt"
      ],
      code: `# Encryption Examples (Python)
from cryptography.fernet import Fernet
import hashlib
import hmac

# Symmetric Encryption (Fernet)
def symmetric_encryption():
    # Generate key
    key = Fernet.generate_key()
    cipher = Fernet(key)
    
    # Encrypt
    plaintext = b"Secret message"
    ciphertext = cipher.encrypt(plaintext)
    
    # Decrypt
    decrypted = cipher.decrypt(ciphertext)
    return decrypted.decode()

# Hashing (SHA-256)
def hash_data(data):
    return hashlib.sha256(data.encode()).hexdigest()

# Password hashing (with salt)
import os
def hash_password(password):
    salt = os.urandom(32)
    key = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000)
    return salt + key

def verify_password(stored_password, provided_password):
    salt = stored_password[:32]
    stored_key = stored_password[32:]
    new_key = hashlib.pbkdf2_hmac('sha256', provided_password.encode(), salt, 100000)
    return stored_key == new_key

# HMAC for message authentication
def create_hmac(message, secret_key):
    return hmac.new(secret_key.encode(), message.encode(), hashlib.sha256).hexdigest()

def verify_hmac(message, secret_key, received_hmac):
    expected_hmac = create_hmac(message, secret_key)
    return hmac.compare_digest(expected_hmac, received_hmac)`
    },
    owaspTop10: {
      definition: "OWASP Top 10 represents the most critical web application security risks.",
      vulnerabilities: [
        "1. Broken Access Control - Unauthorized access to resources",
        "2. Cryptographic Failures - Weak encryption or exposed data",
        "3. Injection - SQL, NoSQL, Command injection attacks",
        "4. Insecure Design - Missing security controls in design",
        "5. Security Misconfiguration - Default configs, unused features",
        "6. Vulnerable Components - Outdated libraries/frameworks",
        "7. Authentication Failures - Weak authentication mechanisms",
        "8. Data Integrity Failures - Insecure deserialization",
        "9. Logging Failures - Inadequate security logging",
        "10. SSRF - Server-Side Request Forgery"
      ],
      prevention: `// SQL Injection Prevention (Node.js)

// ❌ VULNERABLE - Never do this!
app.get('/user/:id', (req, res) => {
    const query = \`SELECT * FROM users WHERE id = \${req.params.id}\`;
    db.query(query); // SQL injection risk!
});

// ✅ SECURE - Use parameterized queries
app.get('/user/:id', (req, res) => {
    const query = 'SELECT * FROM users WHERE id = ?';
    db.query(query, [req.params.id]); // Safe from injection
});

// XSS Prevention
// ❌ VULNERABLE
app.get('/search', (req, res) => {
    res.send(\`<h1>Results for: \${req.query.term}</h1>\`);
});

// ✅ SECURE - Sanitize user input
const escapeHtml = (text) => {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
};

app.get('/search', (req, res) => {
    const safe = escapeHtml(req.query.term);
    res.send(\`<h1>Results for: \${safe}</h1>\`);
});

// CSRF Protection
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

app.get('/form', csrfProtection, (req, res) => {
    res.render('form', { csrfToken: req.csrfToken() });
});

app.post('/submit', csrfProtection, (req, res) => {
    // CSRF token is automatically validated
    res.send('Data processed securely');
});`
    }
  }
};

// Engineering-focused system prompts
const SYSTEM_PROMPTS = {
  general: `You are an expert engineering AI assistant built locally with comprehensive knowledge.`,
  code: `You provide production-ready code with proper error handling and best practices.`,
  debug: `You analyze code issues and provide fixes with detailed explanations.`,
  architecture: `You help design scalable systems with modern architecture patterns.`
};

// Local AI Response Generator with Advanced Intelligence
// Exported so we can unit-test the AI engine directly without HTTP/auth
export class LocalAI {
  constructor() {
    this.conversationHistory = new Map();
    this.knowledge = ENGINEERING_KNOWLEDGE;
    this.patternRecognizer = new PatternRecognizer();
    this.codeAnalyzer = new CodeAnalyzer();
    this.smartGenerator = new SmartResponseGenerator();
  }

  // Get conversation history
  getHistory(sessionId) {
    if (!this.conversationHistory.has(sessionId)) {
      this.conversationHistory.set(sessionId, []);
    }
    return this.conversationHistory.get(sessionId);
  }

  // Add message to history
  addToHistory(sessionId, role, content) {
    const history = this.getHistory(sessionId);
    history.push({ role, content, timestamp: new Date() });
    
    if (history.length > 20) {
      history.shift();
    }
  }

  // Categorize question
  categorizeQuestion(question) {
    const lowerQ = question.toLowerCase();
    
    if (lowerQ.includes('code') || lowerQ.includes('implement') || lowerQ.includes('write') || lowerQ.includes('program')) {
      return 'code';
    }
    if (lowerQ.includes('debug') || lowerQ.includes('error') || lowerQ.includes('fix') || lowerQ.includes('bug')) {
      return 'debug';
    }
    if (lowerQ.includes('design') || lowerQ.includes('architecture') || lowerQ.includes('system') || lowerQ.includes('scale')) {
      return 'architecture';
    }
    return 'general';
  }

  // Extract keywords from question
  extractKeywords(question) {
    const lowerQ = question.toLowerCase();
    const keywords = [];
    
    // Data structures
    const dataStructures = ['array', 'linked list', 'stack', 'queue', 'tree', 'graph', 'hash', 'heap'];
    dataStructures.forEach(ds => {
      if (lowerQ.includes(ds)) keywords.push({ type: 'dataStructure', value: ds.replace(' ', '') });
    });
    
    // Algorithms
    if (lowerQ.includes('binary search') || lowerQ.includes('search')) keywords.push({ type: 'algorithm', value: 'binarySearch' });
    if (lowerQ.includes('sort')) keywords.push({ type: 'algorithm', value: 'sorting' });
    if (lowerQ.includes('dynamic programming') || lowerQ.includes('dp')) keywords.push({ type: 'algorithm', value: 'dynamicProgramming' });
    
    // Machine Learning
    if (lowerQ.includes('machine learning') || lowerQ.includes('ml')) keywords.push({ type: 'ml', value: 'supervisedLearning' });
    if (lowerQ.includes('neural network') || lowerQ.includes('deep learning')) keywords.push({ type: 'ml', value: 'neuralNetworks' });
    if (lowerQ.includes('clustering') || lowerQ.includes('kmeans')) keywords.push({ type: 'ml', value: 'unsupervisedLearning' });
    
    // System Design
    if (lowerQ.includes('load balancing') || lowerQ.includes('load balancer')) keywords.push({ type: 'systemDesign', value: 'loadBalancing' });
    if (lowerQ.includes('cache') || lowerQ.includes('caching')) keywords.push({ type: 'systemDesign', value: 'caching' });
    if (lowerQ.includes('microservice')) keywords.push({ type: 'systemDesign', value: 'microservices' });
    if (lowerQ.includes('database') && (lowerQ.includes('design') || lowerQ.includes('scaling'))) keywords.push({ type: 'systemDesign', value: 'databases' });
    
    // Design Patterns
    if (lowerQ.includes('singleton')) keywords.push({ type: 'designPatterns', value: 'singleton' });
    if (lowerQ.includes('factory')) keywords.push({ type: 'designPatterns', value: 'factory' });
    if (lowerQ.includes('observer')) keywords.push({ type: 'designPatterns', value: 'observer' });
    if (lowerQ.includes('strategy')) keywords.push({ type: 'designPatterns', value: 'strategy' });
    
    // Security
    if (lowerQ.includes('authentication') || lowerQ.includes('auth')) keywords.push({ type: 'security', value: 'authentication' });
    if (lowerQ.includes('encryption') || lowerQ.includes('encrypt')) keywords.push({ type: 'security', value: 'encryption' });
    if (lowerQ.includes('owasp') || lowerQ.includes('security vulnerab')) keywords.push({ type: 'security', value: 'owaspTop10' });
    
    return keywords;
  }

  // Generate intelligent response with advanced AI
  generateResponse(question, category) {
    const keywords = this.extractKeywords(question);
    let response = '';
    
    // Try advanced pattern recognition first
    try {
      const analysis = this.patternRecognizer.analyze(question);
      
      // If question contains code, analyze it
      const codeBlockMatch = question.match(/```[\s\S]*?```/);
      if (codeBlockMatch) {
        const codeAnalysis = this.codeAnalyzer.analyzeCode(codeBlockMatch[0]);
        response += `## Code Analysis\n\n`;
        response += `**Detected Language:** ${codeAnalysis.language}\n`;
        response += `**Estimated Complexity:** ${codeAnalysis.complexity}\n\n`;
        if (codeAnalysis.issues.length > 0) {
          response += `**Issues Found:**\n${codeAnalysis.issues.map(i => `- ${i}`).join('\n')}\n\n`;
          response += `**Suggestions:**\n${codeAnalysis.suggestions.map(s => `- ${s}`).join('\n')}\n\n`;
        }
      }
      
      // Use smart response generator for advanced intents
      if (analysis.intent && ['code', 'debug', 'optimize', 'compare'].includes(analysis.intent)) {
        const sessionId = 'default'; // Use session ID from context
        const history = this.getHistory(sessionId);
        const smartResponse = this.smartGenerator.generateAdvancedResponse(question, sessionId, history);
        response += smartResponse;
        return response || this.fallbackResponse(question, keywords);
      }
    } catch (error) {
      console.error('Advanced AI error:', error);
      // Fall back to knowledge base lookup
    }
    
    // Check knowledge base for specific topics
    for (const keyword of keywords) {
      // Data Structures
      if (keyword.type === 'dataStructure' && this.knowledge.dataStructures[keyword.value]) {
        const dsInfo = this.knowledge.dataStructures[keyword.value];
        response += `# ${keyword.value.charAt(0).toUpperCase() + keyword.value.slice(1)}\n\n`;
        response += `**Definition:**\n${dsInfo.definition}\n\n`;
        response += `**Operations:**\n${dsInfo.operations.map(op => `- ${op}`).join('\n')}\n\n`;
        response += `**Use Case:**\n${dsInfo.useCase}\n\n`;
        response += `**Implementation:**\n\`\`\`python\n${dsInfo.code}\n\`\`\`\n\n`;
        return response;
      }
      
      // Algorithms
      if (keyword.type === 'algorithm' && this.knowledge.algorithms[keyword.value]) {
        const algoInfo = this.knowledge.algorithms[keyword.value];
        response += `# ${keyword.value.charAt(0).toUpperCase() + keyword.value.slice(1)}\n\n`;
        response += `**Definition:**\n${algoInfo.definition}\n\n`;
        
        if (algoInfo.complexity) {
          response += `**Complexity:**\n${algoInfo.complexity}\n\n`;
        }
        
        if (algoInfo.types) {
          response += `**Types:**\n`;
          for (const [type, desc] of Object.entries(algoInfo.types)) {
            response += `- **${type}**: ${desc}\n`;
          }
          response += '\n';
        }
        
        response += `**Implementation:**\n\`\`\`python\n${algoInfo.code}\n\`\`\`\n\n`;
        return response;
      }
      
      // Machine Learning
      if (keyword.type === 'ml' && this.knowledge.machineLearning[keyword.value]) {
        const mlInfo = this.knowledge.machineLearning[keyword.value];
        response += `# Machine Learning: ${keyword.value.replace(/([A-Z])/g, ' $1').trim()}\n\n`;
        response += `**Definition:**\n${mlInfo.definition}\n\n`;
        
        if (mlInfo.algorithms) {
          response += `**Algorithms:**\n${mlInfo.algorithms.map(a => `- ${a}`).join('\n')}\n\n`;
        }
        
        if (mlInfo.components) {
          response += `**Components:**\n${mlInfo.components.map(c => `- ${c}`).join('\n')}\n\n`;
        }
        
        response += `**Implementation:**\n${mlInfo.code}\n\n`;
        return response;
      }
      
      // System Design
      if (keyword.type === 'systemDesign' && this.knowledge.systemDesign[keyword.value]) {
        const sdInfo = this.knowledge.systemDesign[keyword.value];
        response += `# System Design: ${keyword.value.replace(/([A-Z])/g, ' $1').trim()}\n\n`;
        response += `**Definition:**\n${sdInfo.definition}\n\n`;
        
        if (sdInfo.types) response += `**Types:**\n${sdInfo.types.map(t => `- ${t}`).join('\n')}\n\n`;
        if (sdInfo.strategies) response += `**Strategies:**\n${sdInfo.strategies.map(s => `- ${s}`).join('\n')}\n\n`;
        if (sdInfo.algorithms) response += `**Algorithms:**\n${sdInfo.algorithms.map(a => `- ${a}`).join('\n')}\n\n`;
        if (sdInfo.principles) response += `**Principles:**\n${sdInfo.principles.map(p => `- ${p}`).join('\n')}\n\n`;
        if (sdInfo.patterns) response += `**Patterns:**\n${sdInfo.patterns.map(p => `- ${p}`).join('\n')}\n\n`;
        if (sdInfo.scaling) response += `**Scaling:**\n${sdInfo.scaling.map(s => `- ${s}`).join('\n')}\n\n`;
        
        if (sdInfo.useCase) response += `**Use Case:**\n${sdInfo.useCase}\n\n`;
        if (sdInfo.code) response += `**Example:**\n${sdInfo.code}\n\n`;
        if (sdInfo.example) response += `**Example:**\n${sdInfo.example}\n\n`;
        if (sdInfo.communication) response += `**Communication:**\n${sdInfo.communication}\n\n`;
        
        return response;
      }
      
      // Design Patterns
      if (keyword.type === 'designPatterns' && this.knowledge.designPatterns[keyword.value]) {
        const dpInfo = this.knowledge.designPatterns[keyword.value];
        response += `# Design Pattern: ${keyword.value.charAt(0).toUpperCase() + keyword.value.slice(1)}\n\n`;
        response += `**Definition:**\n${dpInfo.definition}\n\n`;
        response += `**Use Case:**\n${dpInfo.useCase}\n\n`;
        response += `**Implementation:**\n${dpInfo.code}\n\n`;
        return response;
      }
      
      // Security
      if (keyword.type === 'security' && this.knowledge.security[keyword.value]) {
        const secInfo = this.knowledge.security[keyword.value];
        response += `# Security: ${keyword.value.replace(/([A-Z])/g, ' $1').trim()}\n\n`;
        response += `**Definition:**\n${secInfo.definition}\n\n`;
        
        if (secInfo.methods) response += `**Methods:**\n${secInfo.methods.map(m => `- ${m}`).join('\n')}\n\n`;
        if (secInfo.types) response += `**Types:**\n${secInfo.types.map(t => `- ${t}`).join('\n')}\n\n`;
        if (secInfo.algorithms) response += `**Algorithms:**\n${secInfo.algorithms.map(a => `- ${a}`).join('\n')}\n\n`;
        if (secInfo.vulnerabilities) response += `**OWASP Top 10:**\n${secInfo.vulnerabilities.map(v => `${v}`).join('\n')}\n\n`;
        
        if (secInfo.code) response += `**Implementation:**\n${secInfo.code}\n\n`;
        if (secInfo.prevention) response += `**Prevention Examples:**\n${secInfo.prevention}\n\n`;
        
        return response;
      }
    }
    
    // Fallback to general response
    return this.fallbackResponse(question, keywords);
  }

  fallbackResponse(question, keywords) {
    // General response if not in knowledge base
    return this.generateGeneralResponse(question, keywords);
  }

  generateGeneralResponse(question, keywords) {
    const lowerQ = question.toLowerCase();
    
    // Programming languages
    if (lowerQ.includes('python')) {
      return `# Python Programming\n\nPython is a high-level, interpreted programming language known for readability and versatility.\n\n**Key Features:**\n- Simple and elegant syntax\n- Extensive standard library\n- Dynamic typing\n- Object-oriented and functional programming support\n- Great for web development, data science, automation, AI/ML\n\n**Example:**\n\`\`\`python\n# Hello World\nprint("Hello, World!")\n\n# Variables and Data Types\nname = "Alice"\nage = 30\nscores = [95, 87, 92]\n\n# Functions\ndef greet(name):\n    return f"Hello, {name}!"\n\n# Classes\nclass Student:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n    \n    def study(self, subject):\n        return f"{self.name} is studying {subject}"\n\`\`\``;
    }
    
    if (lowerQ.includes('javascript') || lowerQ.includes('js')) {
      return `# JavaScript Programming\n\nJavaScript is a versatile programming language primarily used for web development.\n\n**Key Features:**\n- Runs in browsers and Node.js\n- Event-driven and asynchronous\n- Prototype-based OOP\n- Modern features (ES6+): arrow functions, async/await, destructuring\n\n**Example:**\n\`\`\`javascript\n// Variables\nconst name = "Alice";\nlet age = 30;\nconst scores = [95, 87, 92];\n\n// Functions\nfunction greet(name) {\n    return \`Hello, \${name}!\`;\n}\n\n// Arrow Functions\nconst add = (a, b) => a + b;\n\n// Async/Await\nasync function fetchData() {\n    try {\n        const response = await fetch('api/data');\n        const data = await response.json();\n        return data;\n    } catch (error) {\n        console.error('Error:', error);\n    }\n}\n\n// Classes\nclass Student {\n    constructor(name, age) {\n        this.name = name;\n        this.age = age;\n    }\n    \n    study(subject) {\n        return \`\${this.name} is studying \${subject}\`;\n    }\n}\n\`\`\``;
    }
    
    if (lowerQ.includes('react')) {
      return `# React - Modern UI Library\n\nReact is a JavaScript library for building user interfaces with component-based architecture.\n\n**Key Concepts:**\n- Components (functional & class-based)\n- JSX syntax\n- Props and State\n- Hooks (useState, useEffect, etc.)\n- Virtual DOM\n\n**Example:**\n\`\`\`javascript\nimport React, { useState, useEffect } from 'react';\n\n// Functional Component with Hooks\nfunction Counter() {\n    const [count, setCount] = useState(0);\n    const [name, setName] = useState('');\n    \n    useEffect(() => {\n        document.title = \`Count: \${count}\`;\n    }, [count]);\n    \n    return (\n        <div>\n            <h1>Counter: {count}</h1>\n            <button onClick={() => setCount(count + 1)}>\n                Increment\n            </button>\n            <input \n                value={name} \n                onChange={(e) => setName(e.target.value)}\n                placeholder="Enter name"\n            />\n            <p>Hello, {name}!</p>\n        </div>\n    );\n}\n\n// Component with Props\nfunction UserCard({ name, email, age }) {\n    return (\n        <div className="card">\n            <h2>{name}</h2>\n            <p>Email: {email}</p>\n            <p>Age: {age}</p>\n        </div>\n    );\n}\n\nexport default Counter;\n\`\`\``;
    }
    
    if (lowerQ.includes('api') || lowerQ.includes('rest')) {
      return `# REST API Development\n\nREST (Representational State Transfer) is an architectural style for building web services.\n\n**HTTP Methods:**\n- GET: Retrieve data\n- POST: Create new resource\n- PUT: Update entire resource\n- PATCH: Partial update\n- DELETE: Remove resource\n\n**Express.js Example:**\n\`\`\`javascript\nconst express = require('express');\nconst app = express();\n\napp.use(express.json());\n\n// In-memory database\nlet users = [\n    { id: 1, name: 'Alice', email: 'alice@example.com' },\n    { id: 2, name: 'Bob', email: 'bob@example.com' }\n];\n\n// GET all users\napp.get('/api/users', (req, res) => {\n    res.json(users);\n});\n\n// GET single user\napp.get('/api/users/:id', (req, res) => {\n    const user = users.find(u => u.id === parseInt(req.params.id));\n    if (!user) return res.status(404).json({ error: 'User not found' });\n    res.json(user);\n});\n\n// POST new user\napp.post('/api/users', (req, res) => {\n    const { name, email } = req.body;\n    if (!name || !email) {\n        return res.status(400).json({ error: 'Name and email required' });\n    }\n    const newUser = {\n        id: users.length + 1,\n        name,\n        email\n    };\n    users.push(newUser);\n    res.status(201).json(newUser);\n});\n\n// PUT update user\napp.put('/api/users/:id', (req, res) => {\n    const user = users.find(u => u.id === parseInt(req.params.id));\n    if (!user) return res.status(404).json({ error: 'User not found' });\n    \n    user.name = req.body.name;\n    user.email = req.body.email;\n    res.json(user);\n});\n\n// DELETE user\napp.delete('/api/users/:id', (req, res) => {\n    const index = users.findIndex(u => u.id === parseInt(req.params.id));\n    if (index === -1) return res.status(404).json({ error: 'User not found' });\n    \n    users.splice(index, 1);\n    res.status(204).send();\n});\n\napp.listen(3000, () => console.log('Server running on port 3000'));\n\`\`\``;
    }
    
    if (lowerQ.includes('database') || lowerQ.includes('sql')) {
      return `# Database & SQL\n\nSQL (Structured Query Language) is used to manage relational databases.\n\n**Basic Operations:**\n\n**CREATE TABLE:**\n\`\`\`sql\nCREATE TABLE users (\n    id INT PRIMARY KEY AUTO_INCREMENT,\n    name VARCHAR(100) NOT NULL,\n    email VARCHAR(100) UNIQUE NOT NULL,\n    age INT,\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\`\`\`\n\n**INSERT:**\n\`\`\`sql\nINSERT INTO users (name, email, age) \nVALUES ('Alice', 'alice@example.com', 30);\n\`\`\`\n\n**SELECT:**\n\`\`\`sql\n-- All users\nSELECT * FROM users;\n\n-- Specific columns\nSELECT name, email FROM users;\n\n-- With WHERE clause\nSELECT * FROM users WHERE age > 25;\n\n-- With ORDER BY\nSELECT * FROM users ORDER BY created_at DESC;\n\n-- With LIMIT\nSELECT * FROM users LIMIT 10;\n\`\`\`\n\n**UPDATE:**\n\`\`\`sql\nUPDATE users \nSET age = 31 \nWHERE email = 'alice@example.com';\n\`\`\`\n\n**DELETE:**\n\`\`\`sql\nDELETE FROM users WHERE id = 1;\n\`\`\`\n\n**JOINS:**\n\`\`\`sql\n-- INNER JOIN\nSELECT users.name, orders.product\nFROM users\nINNER JOIN orders ON users.id = orders.user_id;\n\n-- LEFT JOIN\nSELECT users.name, orders.product\nFROM users\nLEFT JOIN orders ON users.id = orders.user_id;\n\`\`\``;
    }
    
    // Default response
    return `# Response to: "${question}"\n\nI'm a locally-built AI assistant specializing in engineering topics. I have comprehensive knowledge of:\n\n**Data Structures:**\n- Arrays, Linked Lists, Stacks, Queues\n- Trees, Graphs, Hash Tables, Heaps\n\n**Algorithms:**\n- Searching (Binary Search)\n- Sorting (Quick, Merge, Bubble, Insertion, Heap)\n- Dynamic Programming\n- Graph Algorithms (BFS, DFS, Dijkstra)\n\n**Programming:**\n- Python, JavaScript, Java, C++\n- Web Development (React, Node.js, REST APIs)\n- Databases (SQL)\n\n**How to use me:**\n1. Ask about specific data structures: "Explain stack"\n2. Request algorithm explanations: "How does binary search work?"\n3. Get code examples: "Show me quicksort in Python"\n4. Learn about web development: "Create a REST API"\n\nTry asking a more specific question for detailed code examples and explanations!`;
  }
}

const localAI = new LocalAI();

// Main chat endpoint - Using Local AI (No external APIs)
export const chat = async (req, res) => {
  try {
    const { question, sessionId } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const category = localAI.categorizeQuestion(question);
    const answer = localAI.generateResponse(question, category);

    // Add to history
    localAI.addToHistory(sessionId, 'user', question);
    localAI.addToHistory(sessionId, 'assistant', answer);

    res.json({
      success: true,
      answer,
      category,
      provider: 'local',
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: 'Failed to process chat request',
      message: error.message
    });
  }
};

// Get conversation history
export const getHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const history = localAI.getHistory(sessionId);

    res.json({
      success: true,
      history,
      count: history.length
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Failed to get history' });
  }
};

// Clear conversation history
export const clearHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    localAI.conversationHistory.delete(sessionId);

    res.json({
      success: true,
      message: 'History cleared'
    });
  } catch (error) {
    console.error('Clear history error:', error);
    res.status(500).json({ error: 'Failed to clear history' });
  }
};

// Get available models and providers
export const getProviders = async (req, res) => {
  try {
    const providers = {
      local: {
        available: true,
        models: ['Built-in Knowledge Base'],
        speed: 'Instant',
        free: true,
        description: 'Advanced Local AI with comprehensive engineering knowledge and intelligent code analysis',
        features: [
          '📊 Data Structures (Arrays, Linked Lists, Trees, Graphs, Heaps, Tries)',
          '🔍 Algorithms (Sorting, Searching, DP, Graph Algorithms)',
          '💻 Programming (Python, JavaScript, Java, C++, Go, Rust)',
          '🌐 Web Development (React, Node.js, REST APIs)',
          '🗄️ Databases (SQL, NoSQL, Database Design)',
          '🤖 Machine Learning (Supervised, Unsupervised, Neural Networks)',
          '🏗️ System Design (Load Balancing, Caching, Microservices)',
          '🎨 Design Patterns (Singleton, Factory, Observer, Strategy)',
          '🔒 Security (Authentication, Encryption, OWASP Top 10)',
          '🧠 Pattern Recognition & Code Analysis',
          '🌍 Multi-Language Code Generation',
          '⚡ Context-Aware Responses',
          '🔒 100% Private - No internet required',
          '🚀 Instant responses'
        ]
      }
    };

    res.json({
      success: true,
      providers
    });
  } catch (error) {
    console.error('Get providers error:', error);
    res.status(500).json({ error: 'Failed to get providers' });
  }
};
