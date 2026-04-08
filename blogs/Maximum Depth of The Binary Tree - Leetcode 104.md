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

Step through the diagram below to watch exactly how the recursion unwinds on our example tree — pay attention to what each node *returns* as the call stack comes back up:

```html
<!-- Interactive DFS step-through -->
<div style="font-family: sans-serif;">
<style>
  .dfs-btn { background: #f1efe8; border: 1px solid #d3d1c7; color: #2c2c2a; border-radius: 8px; padding: 7px 18px; font-size: 13px; cursor: pointer; }
  .dfs-btn:hover { background: #d3d1c7; }
  .dfs-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .dfs-log { font-size: 13px; font-family: monospace; color: #5f5e5a; background: #f1efe8; border-radius: 8px; padding: 10px 14px; min-height: 40px; line-height: 1.7; margin-top: 8px; }
</style>

<svg id="dfs-svg" width="100%" viewBox="0 0 680 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arr2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>
  <line x1="340" y1="70" x2="200" y2="150" stroke="#d3d1c7" stroke-width="1.5"/>
  <line x1="340" y1="70" x2="480" y2="150" stroke="#d3d1c7" stroke-width="1.5"/>
  <line x1="480" y1="180" x2="420" y2="255" stroke="#d3d1c7" stroke-width="1.5"/>
  <line x1="480" y1="180" x2="540" y2="255" stroke="#d3d1c7" stroke-width="1.5"/>

  <g id="dn0">
    <circle cx="340" cy="50" r="30" fill="#f1efe8" stroke="#d3d1c7" stroke-width="1.5" style="transition:fill .35s,stroke .35s"/>
    <text x="340" y="50" text-anchor="middle" dominant-baseline="central" style="font-size:15px;font-weight:500;fill:#2c2c2a;pointer-events:none">3</text>
  </g>
  <g id="dn1">
    <circle cx="200" cy="165" r="30" fill="#f1efe8" stroke="#d3d1c7" stroke-width="1.5" style="transition:fill .35s,stroke .35s"/>
    <text x="200" y="165" text-anchor="middle" dominant-baseline="central" style="font-size:15px;font-weight:500;fill:#2c2c2a;pointer-events:none">9</text>
  </g>
  <g id="dn2">
    <circle cx="480" cy="165" r="30" fill="#f1efe8" stroke="#d3d1c7" stroke-width="1.5" style="transition:fill .35s,stroke .35s"/>
    <text x="480" y="165" text-anchor="middle" dominant-baseline="central" style="font-size:15px;font-weight:500;fill:#2c2c2a;pointer-events:none">20</text>
  </g>
  <g id="dn3">
    <circle cx="420" cy="260" r="24" fill="#f1efe8" stroke="#d3d1c7" stroke-width="1.5" style="transition:fill .35s,stroke .35s"/>
    <text x="420" y="260" text-anchor="middle" dominant-baseline="central" style="font-size:13px;font-weight:500;fill:#2c2c2a;pointer-events:none">15</text>
  </g>
  <g id="dn4">
    <circle cx="540" cy="260" r="24" fill="#f1efe8" stroke="#d3d1c7" stroke-width="1.5" style="transition:fill .35s,stroke .35s"/>
    <text x="540" y="260" text-anchor="middle" dominant-baseline="central" style="font-size:13px;font-weight:500;fill:#2c2c2a;pointer-events:none">7</text>
  </g>

  <text id="dr0" x="340" y="14" text-anchor="middle" style="font-size:11px;fill:#BA7517;font-weight:500;opacity:0;transition:opacity .4s">returns 3</text>
  <text id="dr1" x="160" y="165" text-anchor="middle" style="font-size:11px;fill:#BA7517;font-weight:500;opacity:0;transition:opacity .4s">returns 1</text>
  <text id="dr2" x="520" y="128" text-anchor="middle" style="font-size:11px;fill:#BA7517;font-weight:500;opacity:0;transition:opacity .4s">returns 2</text>
  <text id="dr3" x="385" y="262" text-anchor="middle" style="font-size:11px;fill:#BA7517;font-weight:500;opacity:0;transition:opacity .4s">returns 1</text>
  <text id="dr4" x="575" y="262" text-anchor="middle" style="font-size:11px;fill:#BA7517;font-weight:500;opacity:0;transition:opacity .4s">returns 1</text>
</svg>

<div style="display:flex;gap:10px;align-items:center;margin:8px 0 6px">
  <button class="dfs-btn" id="dfs-prev" onclick="dfsStep(-1)" disabled>← Prev</button>
  <button class="dfs-btn" id="dfs-next" onclick="dfsStep(1)">Next →</button>
  <button class="dfs-btn" onclick="dfsReset()">Reset</button>
  <span style="font-size:12px;color:#888780" id="dfs-counter">Step 0 / 9</span>
</div>
<div class="dfs-log" id="dfs-log">Press Next to start the DFS walk.</div>

<script>
(function() {
  var PURPLE = '#EEEDFE', PURPLE_S = '#7F77DD';
  var TEAL   = '#E1F5EE', TEAL_S   = '#1D9E75';
  var AMBER  = '#FAEEDA', AMBER_S  = '#BA7517';
  var GRAY   = '#f1efe8', GRAY_S   = '#d3d1c7';

  var steps = [
    { active:'dn0', returns:[], msg:'📍 We enter node 3 (the root). No idea how deep it goes yet — so we ask left first.' },
    { active:'dn1', returns:[], msg:'📍 We enter node 9. It has no children — nowhere to go. This is a leaf.' },
    { active:'dn1', returns:['dr1'], msg:'↩️ Node 9 has no children. Both sides return 0. So: 1 + max(0, 0) = 1. Sends 1 back up.' },
    { active:'dn2', returns:['dr1'], msg:'📍 Left side done. Back at node 3 — now we go right. Enter node 20.' },
    { active:'dn3', returns:['dr1'], msg:'📍 Node 20 goes left first. Enter node 15. Another leaf — no children.' },
    { active:'dn3', returns:['dr1','dr3'], msg:'↩️ Node 15 returns 1 + max(0, 0) = 1. Sends 1 back up to node 20.' },
    { active:'dn4', returns:['dr1','dr3'], msg:'📍 Node 20 now goes right. Enter node 7. Also a leaf.' },
    { active:'dn4', returns:['dr1','dr3','dr4'], msg:'↩️ Node 7 returns 1. Back at node 20: 1 + max(1, 1) = 2. Sends 2 up.' },
    { active:'dn2', returns:['dr1','dr2','dr3','dr4'], msg:'↩️ Node 20 returns 2. Back at root node 3. Left gave 1, right gave 2. So: 1 + max(1, 2) = 3.' },
    { active:'dn0', returns:['dr0','dr1','dr2','dr3','dr4'], msg:'✅ Root returns 3. That\'s our answer — maximum depth is 3!' },
  ];
  var cur = -1;

  function paint(id, fill, stroke) {
    var el = document.querySelector('#'+id+' circle');
    if (el) { el.style.fill = fill; el.style.stroke = stroke; el.style.strokeWidth = fill === GRAY ? '1.5' : '2.5'; }
  }

  window.dfsReset = function() {
    cur = -1;
    ['dn0','dn1','dn2','dn3','dn4'].forEach(function(id){ paint(id, GRAY, GRAY_S); });
    ['dr0','dr1','dr2','dr3','dr4'].forEach(function(r){ document.getElementById(r).style.opacity='0'; });
    document.getElementById('dfs-log').textContent = 'Press Next to start the DFS walk.';
    document.getElementById('dfs-counter').textContent = 'Step 0 / 9';
    document.getElementById('dfs-prev').disabled = true;
    document.getElementById('dfs-next').disabled = false;
  };

  window.dfsStep = function(dir) {
    cur = Math.max(-1, Math.min(steps.length-1, cur+dir));
    if (cur < 0) { dfsReset(); return; }
    var s = steps[cur];
    ['dn0','dn1','dn2','dn3','dn4'].forEach(function(id){ paint(id, GRAY, GRAY_S); });
    var isAmber = s.active==='dn0' && cur===9;
    var isLeaf  = ['dn1','dn3','dn4'].indexOf(s.active) > -1;
    paint(s.active, isAmber ? AMBER : (isLeaf ? TEAL : PURPLE), isAmber ? AMBER_S : (isLeaf ? TEAL_S : PURPLE_S));
    ['dr0','dr1','dr2','dr3','dr4'].forEach(function(r){
      document.getElementById(r).style.opacity = s.returns.indexOf(r) > -1 ? '1' : '0';
    });
    document.getElementById('dfs-log').textContent = s.msg;
    document.getElementById('dfs-counter').textContent = 'Step '+(cur+1)+' / '+steps.length;
    document.getElementById('dfs-prev').disabled = cur <= 0;
    document.getElementById('dfs-next').disabled = cur >= steps.length-1;
  };
})();
</script>
</div>
```

Notice the *returns* labels bubbling up as you step through — that's the call stack unwinding. The answer doesn't exist until we've hit every leaf and climbed back up. That's post-order DFS in action.

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