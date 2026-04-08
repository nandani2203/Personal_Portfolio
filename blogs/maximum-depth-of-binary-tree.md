# Maximum Depth of Binary Tree

## 🤔 What Are We Solving?

Okay so you're given a binary tree. That's it. That's the whole input.

Your job? Find how *deep* it goes — meaning, what's the longest path from the root node all the way down to a leaf.

LeetCode calls it "maximum depth." You can also think of it as: **how many levels does this tree have?**

```
    3          ← level 1
   / \
  9  20        ← level 2
    /  \
   15   7      ← level 3
```

Answer for this tree? **3.** Because the deepest you can go is root → 20 → 15 (or 7).

That's the whole problem. Now let's talk about *how* to think about it.

---

## 🧠 Intuition

Here's the honest question: do you *really* need to trace every root-to-leaf path and measure them all?

Nope.

Think about it this way. You're standing at the root node. You don't know how deep the tree goes — but guess what, your left child knows how deep the left side goes. And your right child knows the right side. You just need to **ask them**, take whoever gives the bigger number, and add 1 for yourself.

That's the whole insight:

```
maxDepth(node) = 1 + max(maxDepth(left), maxDepth(right))
```

And if you land on a `null`? Easy — return 0. There's no node here, so there's no depth.

This is the classic *"trust the recursion"* moment. You don't need to know how the subtree solves it — you just need to know that it *will*, and combine the results.

---

## 🚀 Approach

Here's exactly what the algorithm does, step by step:

1. **Hit a null?** Return `0`. Base case, done, goodbye.
2. **Recurse left** — ask the left subtree for its max depth.
3. **Recurse right** — ask the right subtree for its max depth.
4. **Return** `1 + max(left, right)` — 1 for the current node, plus the deeper of the two sides.

**The one line to remember:**
> *"I'm 1, plus whoever's deeper below me."*


---

## 💻 Code

Three lines. That's genuinely all it takes. Same logic:

### Python

```python
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        if not root:
            return 0
        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))
```

### C++

```cpp
// struct TreeNode {
//     int val;
//     TreeNode *left;
//     TreeNode *right;
//     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
// };

class Solution {
public:
    int maxDepth(TreeNode* root) {
        if (!root) return 0;
        return 1 + max(maxDepth(root->left), maxDepth(root->right));
    }
};
```

### Java

```java
// public class TreeNode {
//     int val;
//     TreeNode left;
//     TreeNode right;
//     TreeNode(int val) { this.val = val; }
// }

class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) return 0;
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }
}
```

All three are the exact same idea. Pick your language, internalize the shape of the code — `null check → recurse both sides → return 1 + max`.

---

## 📊 Time & Space Complexity

| | Complexity |
|---|---|
| **Time** | O(n) — we visit every node exactly once, no shortcuts |
| **Space** | O(h) — the call stack goes as deep as the tree height h; that's O(log n) for a balanced tree, O(n) worst case for a skewed one |

The space complexity is the sneaky one here. A perfectly balanced tree? Stack depth is just log n — totally fine. A tree that's basically a linked list (every node only has a right child)? Stack depth hits n, which can cause issues on massive inputs.

---

## ⚠️ Edge Cases

Worth thinking about before you hit submit:

- **Empty tree** — `root` is `null`/`None`. Returns 0. The base case handles it, but make sure you're not calling `.left` on null before checking.
- **Single node** — no children, both recursive calls return 0, result is `1 + max(0, 0) = 1`. Correct.
- **Skewed tree** — imagine 10,000 nodes all chained left. Your call stack hits depth 10,000. Most online judges are fine, but worth knowing.
- **Perfect binary tree** — all leaves at the same level, recursion terminates everywhere at once. Clean and elegant.

---

## ✅ Key Takeaways

A few things worth burning into memory before moving on:

- `1 + max(left, right)` is the heartbeat of basically every tree depth/height problem. You'll see it again and again.
- This is **post-order DFS** — you process children *before* the parent. The answer bubbles up, it doesn't flow down.
- If an interviewer asks for the iterative version, think **BFS**: use a queue, process level by level, count the levels. Same O(n) time, O(w) space where w is the max width of the tree.
- Once this clicks, these problems unlock almost automatically: **Diameter of Binary Tree**, **Balanced Binary Tree**, **Maximum Width of Binary Tree**, **Path Sum**. Same skeleton, different twist.