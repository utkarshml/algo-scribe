import type { InterviewQuestion, QuestionUpdate } from "@/types/custom"

// Mock database - In a real app, this would be replaced with actual database calls
class MockDatabase {
  private questions: InterviewQuestion[] = [
    {
      id: "1",
      question_name: "Two Sum",
      description:
        "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
      difficulty: "Easy",
      topics: ["Array", "Hash Table", "Two Pointers"],
      user_code: `function twoSum(nums, target) {
    // Your code here
    // Hint: Consider using a hash map for O(n) solution
    
    return [];
}`,
      solution_code: `function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}

// Time Complexity: O(n)
// Space Complexity: O(n)`,
      interview_tips: [
        "Start by explaining the brute force approach (O(n²)) before optimizing",
        "Mention the trade-off between time and space complexity",
        "Ask clarifying questions about edge cases (empty array, no solution)",
        "Walk through your solution with a concrete example",
        "Discuss how you would handle duplicate values if requirements changed",
      ],
      note: `## Key Points to Remember

- This is a **classic** interview question
- Multiple approaches exist: brute force, hash map, two pointers (for sorted array)
- Always discuss time/space complexity trade-offs

### Follow-up Questions
- What if the array was sorted?
- What if we needed to find all pairs?
- How would you handle duplicate numbers?`,
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z",
    },
    {
      id: "2",
      question_name: "Valid Parentheses",
      description:
        "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets, and open brackets must be closed in the correct order.",
      difficulty: "Easy",
      topics: ["String", "Stack", "Parsing"],
      user_code: `function isValid(s) {
    // Your code here
    // Hint: Think about using a stack data structure
    
    return false;
}`,
      solution_code: `function isValid(s) {
    const stack = [];
    const mapping = {
        ')': '(',
        '}': '{',
        ']': '['
    };
    
    for (let char of s) {
        if (char in mapping) {
            const topElement = stack.length === 0 ? '#' : stack.pop();
            if (mapping[char] !== topElement) {
                return false;
            }
        } else {
            stack.push(char);
        }
    }
    
    return stack.length === 0;
}

// Time Complexity: O(n)
// Space Complexity: O(n)`,
      interview_tips: [
        "Explain why a stack is the ideal data structure for this problem",
        "Consider edge cases: empty string, single character, unmatched brackets",
        "Discuss the importance of checking if stack is empty at the end",
        "Mention how this concept applies to parsing and compiler design",
        "Be prepared to extend the solution to handle other bracket types",
      ],
      note: `## Stack Applications

This problem demonstrates the **LIFO (Last In, First Out)** principle perfectly.

### Real-world Applications
- Code editors for syntax highlighting
- Compilers for parsing expressions
- Browser back button functionality

*Remember*: Stack problems often involve matching pairs or nested structures.`,
      created_at: "2024-01-16T09:30:00Z",
      updated_at: "2024-01-16T09:30:00Z",
    },
    {
      id: "3",
      question_name: "Binary Tree Inorder Traversal",
      description:
        "Given the root of a binary tree, return the inorder traversal of its nodes' values. Inorder traversal visits nodes in the order: left subtree, root, right subtree.",
      difficulty: "Medium",
      topics: ["Binary Tree", "Recursion", "Stack", "DFS"],
      user_code: `function inorderTraversal(root) {
    // Your code here
    // Consider both recursive and iterative approaches
    
    return [];
}

// Definition for a binary tree node
class TreeNode {
    constructor(val, left, right) {
        this.val = (val === undefined ? 0 : val);
        this.left = (left === undefined ? null : left);
        this.right = (right === undefined ? null : right);
    }
}`,
      solution_code: `// Recursive Solution
function inorderTraversal(root) {
    const result = [];
    
    function inorder(node) {
        if (node === null) return;
        
        inorder(node.left);   // Left
        result.push(node.val); // Root
        inorder(node.right);  // Right
    }
    
    inorder(root);
    return result;
}

// Iterative Solution
function inorderTraversalIterative(root) {
    const result = [];
    const stack = [];
    let current = root;
    
    while (current !== null || stack.length > 0) {
        // Go to the leftmost node
        while (current !== null) {
            stack.push(current);
            current = current.left;
        }
        
        // Current is null, pop from stack
        current = stack.pop();
        result.push(current.val);
        
        // Visit right subtree
        current = current.right;
    }
    
    return result;
}

// Time Complexity: O(n)
// Space Complexity: O(h) where h is height of tree`,
      interview_tips: [
        "Always mention both recursive and iterative approaches",
        "Explain the order: Left → Root → Right",
        "Discuss space complexity differences between approaches",
        "Be prepared to implement other traversals (preorder, postorder)",
        "Consider Morris traversal for O(1) space complexity",
        "Draw the tree and trace through your algorithm step by step",
      ],
      note: `## Tree Traversal Patterns

### Three Main Types:
1. **Inorder**: Left → Root → Right (gives sorted order for BST)
2. **Preorder**: Root → Left → Right (good for copying tree)
3. **Postorder**: Left → Right → Root (good for deleting tree)

### Memory Tip
**In**order = **In** the middle (root processed in middle)

> 💡 For BST, inorder traversal gives nodes in sorted order!`,
      created_at: "2024-01-17T14:15:00Z",
      updated_at: "2024-01-17T14:15:00Z",
    },
  ]

  async getAllQuestions(): Promise<InterviewQuestion[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100))
    return [...this.questions]
  }

  async updateQuestion(update: QuestionUpdate): Promise<InterviewQuestion | null> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200))

    const questionIndex = this.questions.findIndex((q) => q.id === update.id)
    if (questionIndex === -1) return null

    this.questions[questionIndex] = {
      ...this.questions[questionIndex],
      [update.field]: update.value,
      updated_at: new Date().toISOString(),
    }

    return this.questions[questionIndex]
  }

  async addQuestion(question: Omit<InterviewQuestion, "id" | "created_at" | "updated_at">): Promise<InterviewQuestion> {
    await new Promise((resolve) => setTimeout(resolve, 200))

    const newQuestion: InterviewQuestion = {
      ...question,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    this.questions.push(newQuestion)
    return newQuestion
  }

  async deleteQuestion(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 200))

    const initialLength = this.questions.length
    this.questions = this.questions.filter((q) => q.id !== id)
    return this.questions.length < initialLength
  }

  // Add a method to get available topics for suggestions
  async getAvailableTopics(): Promise<string[]> {
    await new Promise((resolve) => setTimeout(resolve, 100))

    const allTopics = this.questions.flatMap((q) => q.topics)
    const uniqueTopics = [...new Set(allTopics)].sort()

    return uniqueTopics
  }
}

export const database = new MockDatabase()
