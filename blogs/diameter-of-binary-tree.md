# Diameter of Binary Tree

## What Are We Solving?

You're given a binary tree. Same deal as Leetcode 140 - Maximum Depth of Binary Tree.

This time your job is to find the **diameter** — which sounds fancy but just means: what's the longest path between any two nodes in the tree?

And here's the key thing — that path **doesn't have to pass through the root**. It can go through any node.

```
        1          
       / \
      2   3        
     / \
    4   5          
```

The longest path here is `4 → 2 → 5`, which has a length of **2** (we count edges, not nodes).

But wait — what if the tree looked like this?

```
        1          
       / \
      2   3        
     / \
    4   5
   /     \
  6       7
```

Now the longest path is `6 → 4 → 2 → 5 → 7` — length **4**. And notice it goes *through* node 2, not the root.

That's the twist that makes this problem interesting. The diameter lives wherever the two deepest subtrees meet.

---

## Intuition

Okay so here's the "aha" moment.

At any given node, the longest path *passing through that node* is:

```
depth(left subtree) + depth(right subtree)
```

Because the path goes: deepest point on the left → current node → deepest point on the right.

So the diameter of the whole tree is just the **maximum of this value across every single node**.

Now here's the beautiful part — you already know how to compute depth. You did it in the last problem. So this problem is really just *Maximum Depth with a small twist*: while you're recursing to compute depths, you also track the best diameter you've seen so far.

One DFS pass. That's it.

---

## Approach

Here's the exact game plan:

1. **Run DFS** on the tree, computing depth at every node (just like before).
2. **At each node**, calculate `left_depth + right_depth` — that's the diameter *through this node*.
3. **Keep a running max** — update your answer whenever you find a bigger diameter.
4. **Return depth as usual** — `1 + max(left_depth, right_depth)` — so the parent can use it.

The trick is that your DFS function does *two jobs at once*: it returns depth upward, but also silently updates the answer on the way.

**The one line to remember:**
> *"Diameter through me = how deep I can go left + how deep I can go right."*

## Code

Same elegant recursion as max depth, with one extra variable tracking the best answer:

### Python

```python
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def diameterOfBinaryTree(self, root: Optional[TreeNode]) -> int:
        self.diameter = 0

        def dfs(node):
            if not node:
                return 0
            left  = dfs(node.left)
            right = dfs(node.right)
            self.diameter = max(self.diameter, left + right)
            return 1 + max(left, right)

        dfs(root)
        return self.diameter
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
    int diameter = 0;

    int dfs(TreeNode* node) {
        if (!node) return 0;
        int left  = dfs(node->left);
        int right = dfs(node->right);
        diameter = max(diameter, left + right);
        return 1 + max(left, right);
    }

public:
    int diameterOfBinaryTree(TreeNode* root) {
        dfs(root);
        return diameter;
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
    int diameter = 0;

    public int diameterOfBinaryTree(TreeNode root) {
        dfs(root);
        return diameter;
    }

    private int dfs(TreeNode node) {
        if (node == null) return 0;
        int left  = dfs(node.left);
        int right = dfs(node.right);
        diameter  = Math.max(diameter, left + right);
        return 1 + Math.max(left, right);
    }
}
```

The pattern is identical to max depth — `null check → recurse both sides → return 1 + max`. The only addition is that one `max(diameter, left + right)` line that quietly tracks the best answer.

---

## Time & Space Complexity

| | Complexity |
|---|---|
| **Time** | O(n) — every node visited exactly once |
| **Space** | O(h) — call stack depth equals tree height; O(log n) balanced, O(n) worst case |

Exact same complexity as max depth. You get the diameter for free — it costs nothing extra.

---

## Edge Cases

A few things worth double-checking before you submit:

- **Empty tree** — `root` is `null`. The DFS immediately returns 0 and diameter stays 0. Return 0. ✓
- **Single node** — no children, `left + right = 0 + 0 = 0`. Diameter is 0. That's correct — there are no edges. ✓
- **Straight line tree** — all nodes go in one direction. Diameter is `n - 1` (number of edges). The path just goes straight down one side.
- **Diameter not through root** — this is the classic gotcha. The whole reason we track `self.diameter` separately is because the winning path might be buried deep in a subtree, never touching the root.

---

## Key Takeaways

- This problem is max depth with a scoreboard. The DFS logic is identical — you're just also recording `left + right` at every node.
- The answer lives in a separate variable (`self.diameter`), not the return value of DFS. The return value is always *depth* — used by the parent. The diameter is a side effect of the traversal.
- This is **post-order DFS** again — children before parent, answers bubble up.
- Once this pattern is solid, **Binary Tree Maximum Path Sum** (hard) is just a small step further — same structure, but you're summing node values instead of counting edges.