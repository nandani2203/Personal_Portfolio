# Maximum Depth of Binary Tree

## 🧠 Intuition

The depth of a tree is simply the longest path from the root down to any leaf. Think about it recursively: the depth of any node is **1 (for itself) + the maximum depth of its two subtrees**.

This is one of the most elegant recursive patterns in tree problems. Once you see it, you'll recognise it immediately in dozens of harder problems — diameter of tree, balanced tree check, path sum, and more.

## 🚀 Approach

**Recursive DFS (top-down):**
1. Base case: if the node is `null`, return `0`.
2. Recursively compute depth of left subtree.
3. Recursively compute depth of right subtree.
4. Return `1 + max(left_depth, right_depth)`.

The call stack naturally mirrors the tree structure — when the recursion unwinds, each node reports its subtree's depth upward.

**Iterative BFS (level-order):**
1. Use a queue. Enqueue the root.
2. For each level, process all nodes in the queue and enqueue their children.
3. Count the number of levels — that is the depth.

## 💻 Code

```python
# Recursive DFS — clean and idiomatic
class Solution:
    def maxDepth(self, root) -> int:
        if not root:
            return 0
        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))
```

```python
# Iterative BFS — useful when recursion depth is a concern
from collections import deque

class Solution:
    def maxDepth(self, root) -> int:
        if not root:
            return 0
        queue = deque([root])
        depth = 0
        while queue:
            depth += 1
            for _ in range(len(queue)):   # process one full level
                node = queue.popleft()
                if node.left:  queue.append(node.left)
                if node.right: queue.append(node.right)
        return depth
```

```java
// Recursive Java
class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) return 0;
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }
}
```

```cpp
// Recursive C++
class Solution {
public:
    int maxDepth(TreeNode* root) {
        if (!root) return 0;
        return 1 + max(maxDepth(root->left), maxDepth(root->right));
    }
};
```

## 📊 Time & Space Complexity

| | Recursive DFS | Iterative BFS |
|---|---|---|
| **Time** | O(n) — visits every node once | O(n) — visits every node once |
| **Space** | O(h) — call stack (h = height) | O(w) — queue (w = max width) |

For a **balanced** tree: h = O(log n), w = O(n/2) ≈ O(n) — DFS wins on space.
For a **skewed** tree (like a linked list): h = O(n) — both are equally bad; BFS is safer.

## ⚠ Edge Cases

- **Empty tree (`root == null`)** — return `0`. Always handle this first.
- **Single node** — no children, returns `1`.
- **Skewed tree** — a tree where every node has only one child; depth equals n.
- **Very deep trees** — iterative BFS avoids stack overflow that recursive DFS can cause on extremely deep inputs.

## ✅ Key Takeaways

- `return 1 + max(left, right)` is the **canonical tree recursion template** — memorise it.
- This exact pattern generalises to: diameter, height-balanced check, path sum, lowest common ancestor.
- When the problem asks "depth / height / level", think **BFS for levels, DFS for height**.
- The recursive solution is 3 lines. If your tree solution is much longer, you may be overcomplicating it.