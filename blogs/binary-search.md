# Maximum Depth of Binary Tree – The Castle Explorer

## 🏰 The Story

Deep in the Kingdom of Nodoria, there stands a magical castle — a **Binary Castle**.

Every room in this castle has at most two doors: one to the left wing, one to the right. The King wants to know: **how many floors does the tallest tower reach?**

He sends his royal explorer, **Recursiva**, with one simple rule:

> *"Walk into any room. Count this floor. Then send your twin into the left wing and your twin into the right wing. When they come back, take the higher count, add 1 for the floor you're standing on, and report back."*

Recursiva never gets lost. She always comes back with the right answer. Because she is — a **recursive DFS**.

The answer to the King's question? That's the **maximum depth** of the binary tree.

---

## 🧠 Intuition

A binary tree's depth is simply the length of the longest root-to-leaf path.

The trick is realising you don't need to measure all paths yourself. You just need to ask your children: *"what's the deepest YOU can go?"* Then you add 1 for yourself.

This is the classic **"trust the recursion"** insight:

```
depth(node) = 1 + max(depth(left), depth(right))
```

Base case? If there's no room (null node), the depth is 0.

That's the entire algorithm. The diagram below shows the castle floors — notice how depth maps directly onto levels:

```html
<!-- Tree structure diagram -->
<svg width="100%" viewBox="0 0 680 420" role="img" xmlns="http://www.w3.org/2000/svg">
  <title>Binary tree as a magical castle with floors</title>
  <desc>A tree structure visualised as floors of a castle tower, showing depth = number of floors</desc>
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
    <style>
      .th { font-family: sans-serif; font-size: 14px; font-weight: 500; fill: #3C3489; }
      .ts { font-family: sans-serif; font-size: 12px; fill: #534AB7; }
      .th-teal { font-family: sans-serif; font-size: 14px; font-weight: 500; fill: #085041; }
      .ts-teal { font-family: sans-serif; font-size: 12px; fill: #0F6E56; }
      .th-coral { font-family: sans-serif; font-size: 14px; font-weight: 500; fill: #712B13; }
      .ts-coral { font-family: sans-serif; font-size: 12px; fill: #993C1D; }
      .th-amber { font-family: sans-serif; font-size: 14px; font-weight: 500; fill: #633806; }
      .ts-amber { font-family: sans-serif; font-size: 12px; fill: #854F0B; }
      .ts-muted { font-family: sans-serif; font-size: 12px; fill: #888780; }
    </style>
  </defs>

  <!-- Floor 1 (root) -->
  <rect x="260" y="40" width="160" height="52" rx="10" fill="#EEEDFE" stroke="#534AB7" stroke-width="0.5"/>
  <text class="th" x="340" y="62" text-anchor="middle" dominant-baseline="central">Floor 1 — Root</text>
  <text class="ts" x="340" y="80" text-anchor="middle" dominant-baseline="central">node: 3</text>

  <!-- Connectors L1 to L2 -->
  <line x1="300" y1="92" x2="220" y2="148" stroke="#888780" stroke-width="1.2" marker-end="url(#arrow)"/>
  <line x1="380" y1="92" x2="460" y2="148" stroke="#888780" stroke-width="1.2" marker-end="url(#arrow)"/>

  <!-- Floor 2 left -->
  <rect x="140" y="148" width="160" height="52" rx="10" fill="#E1F5EE" stroke="#0F6E56" stroke-width="0.5"/>
  <text class="th-teal" x="220" y="170" text-anchor="middle" dominant-baseline="central">Floor 2 — Left</text>
  <text class="ts-teal" x="220" y="188" text-anchor="middle" dominant-baseline="central">node: 9</text>

  <!-- Floor 2 right -->
  <rect x="380" y="148" width="160" height="52" rx="10" fill="#E1F5EE" stroke="#0F6E56" stroke-width="0.5"/>
  <text class="th-teal" x="460" y="170" text-anchor="middle" dominant-baseline="central">Floor 2 — Right</text>
  <text class="ts-teal" x="460" y="188" text-anchor="middle" dominant-baseline="central">node: 20</text>

  <!-- Connectors L2 right to L3 -->
  <line x1="430" y1="200" x2="400" y2="256" stroke="#888780" stroke-width="1.2" marker-end="url(#arrow)"/>
  <line x1="490" y1="200" x2="520" y2="256" stroke="#888780" stroke-width="1.2" marker-end="url(#arrow)"/>

  <!-- Floor 3 left -->
  <rect x="320" y="256" width="120" height="52" rx="10" fill="#FAECE7" stroke="#993C1D" stroke-width="0.5"/>
  <text class="th-coral" x="380" y="278" text-anchor="middle" dominant-baseline="central">Floor 3</text>
  <text class="ts-coral" x="380" y="296" text-anchor="middle" dominant-baseline="central">node: 15</text>

  <!-- Floor 3 right -->
  <rect x="460" y="256" width="120" height="52" rx="10" fill="#FAECE7" stroke="#993C1D" stroke-width="0.5"/>
  <text class="th-coral" x="520" y="278" text-anchor="middle" dominant-baseline="central">Floor 3</text>
  <text class="ts-coral" x="520" y="296" text-anchor="middle" dominant-baseline="central">node: 7</text>

  <!-- Depth labels on the side -->
  <line x1="100" y1="66" x2="100" y2="282" stroke="#B4B2A9" stroke-width="1" stroke-dasharray="4 3"/>
  <line x1="68" y1="66"  x2="90" y2="66"  stroke="#B4B2A9" stroke-width="0.8"/>
  <line x1="68" y1="174" x2="90" y2="174" stroke="#B4B2A9" stroke-width="0.8"/>
  <line x1="68" y1="282" x2="90" y2="282" stroke="#B4B2A9" stroke-width="0.8"/>
  <text class="ts-muted" x="54" y="66"  text-anchor="middle" dominant-baseline="central">depth 1</text>
  <text class="ts-muted" x="54" y="174" text-anchor="middle" dominant-baseline="central">depth 2</text>
  <text class="ts-muted" x="54" y="282" text-anchor="middle" dominant-baseline="central">depth 3</text>

  <!-- Answer badge -->
  <rect x="240" y="350" width="200" height="44" rx="10" fill="#FAEEDA" stroke="#854F0B" stroke-width="0.5"/>
  <text class="th-amber" x="340" y="368" text-anchor="middle" dominant-baseline="central">Max depth = 3</text>
  <text class="ts-amber" x="340" y="386" text-anchor="middle" dominant-baseline="central">the tallest floor reached</text>
</svg>
```

---

## 🚀 Approach

**Steps to solve:**

1. **Base case** — if the current node is `null`, return `0`.
2. **Recurse left** — call `maxDepth(node.left)` to get the depth of the left subtree.
3. **Recurse right** — call `maxDepth(node.right)` to get the depth of the right subtree.
4. **Combine** — return `1 + max(left_depth, right_depth)`.

That's it. Four lines of logic. The recursive call stack does all the heavy lifting — it naturally explores every path and bubbles the maximum back up.

**Mnemonic — The Castle Rule:**
> *"Count my floor, ask my wings, take the taller one."*

The interactive step-through below walks you through Recursiva's exact journey on the example tree `[3, 9, 20, null, null, 15, 7]`:

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
    { active:'dn0', returns:[], msg:'🏰 Enter node 3 (root). Call maxDepth(3). Go left first...' },
    { active:'dn1', returns:[], msg:'🚶 Enter node 9 (left child of 3). No children — leaf node!' },
    { active:'dn1', returns:['dr1'], msg:'↩️ Node 9 returns 1 + max(0,0) = 1 back to node 3.' },
    { active:'dn2', returns:['dr1'], msg:'🚶 Back at node 3. Go right — enter node 20.' },
    { active:'dn3', returns:['dr1'], msg:'🚶 Enter node 15 (left child of 20). Leaf node!' },
    { active:'dn3', returns:['dr1','dr3'], msg:'↩️ Node 15 returns 1. Back to node 20.' },
    { active:'dn4', returns:['dr1','dr3'], msg:'🚶 Enter node 7 (right child of 20). Leaf node!' },
    { active:'dn4', returns:['dr1','dr3','dr4'], msg:'↩️ Node 7 returns 1. Node 20: return 1 + max(1,1) = 2.' },
    { active:'dn2', returns:['dr1','dr2','dr3','dr4'], msg:'↩️ Node 20 returns 2. Back to root node 3.\nNode 3: return 1 + max(1,2) = 3. 🎉' },
    { active:'dn0', returns:['dr0','dr1','dr2','dr3','dr4'], msg:'✅ Root returns 3. Maximum depth = 3!' },
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
    var isAmber  = s.active==='dn0' && cur===9;
    var isLeaf   = ['dn1','dn3','dn4'].indexOf(s.active) > -1;
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

---

## 💻 Code

### Python

```python
# Definition for a binary tree node.
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
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 * };
 */
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
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) return 0;
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }
}
```

---

## 📊 Time & Space Complexity

| | Complexity |
|---|---|
| **Time** | O(n) — every node is visited exactly once |
| **Space** | O(h) — call stack depth equals tree height h; O(log n) balanced, O(n) worst case (skewed) |

---

## ⚠️ Edge Cases

- **Empty tree** (`root == null/None`) — returns 0 immediately; handled as the base case.
- **Single node** — no children, both recursive calls return 0, result is 1.
- **Skewed tree** (all left or all right, like a linked list) — depth equals n. Watch for stack overflow on very large inputs.
- **Perfect binary tree** — depth = log₂(n+1). All leaves terminate simultaneously.

---

## ✅ Key Takeaways

- This is pure **post-order DFS** — you collect answers from children before processing the parent (bubbling *up*, not down).
- The recurrence `1 + max(left, right)` is the heartbeat of almost every tree depth/height problem. Memorise it.
- An **iterative BFS** alternative exists: count levels as you drain each queue layer. Same O(n) time, O(w) space where w = max tree width.
- This exact pattern unlocks: **Diameter of Binary Tree**, **Balanced Binary Tree**, **Maximum Width of Binary Tree**, and **Path Sum** variants. Nail this one, and those fall too.