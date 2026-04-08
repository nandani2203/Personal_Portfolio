# Word Ladder – BFS on an Implicit Graph

## 🧠 Intuition

Model each word as a node in a graph. Two words are connected by an edge if they differ by exactly one letter. The shortest transformation sequence is then the shortest path from `beginWord` to `endWord` — a classic **BFS shortest-path** problem.

The graph is **implicit**: we never build it explicitly. Instead, for each word we generate all possible one-letter mutations and check if they exist in the word list.

## 🚀 Approach

1. Add `beginWord` to the queue. Add `endWord`'s word list to a set for O(1) lookup.
2. BFS level by level (each level = one transformation step).
3. For the current word, generate all words differing by one letter (26 × length possibilities).
4. If the mutation is in the word set and not yet visited, enqueue it.
5. If we reach `endWord`, return the current level count.
6. If the queue empties without finding `endWord`, return 0.

## 💻 Code

```python
from collections import deque

def ladderLength(beginWord: str, endWord: str, wordList: list[str]) -> int:
    word_set = set(wordList)
    if endWord not in word_set:
        return 0

    queue = deque([(beginWord, 1)])   # (current_word, steps)
    visited = {beginWord}

    while queue:
        word, steps = queue.popleft()
        for i in range(len(word)):
            for c in 'abcdefghijklmnopqrstuvwxyz':
                candidate = word[:i] + c + word[i+1:]
                if candidate == endWord:
                    return steps + 1
                if candidate in word_set and candidate not in visited:
                    visited.add(candidate)
                    queue.append((candidate, steps + 1))
    return 0
```

### Bidirectional BFS (optimised)

```python
from collections import deque

def ladderLength(beginWord, endWord, wordList):
    word_set = set(wordList)
    if endWord not in word_set:
        return 0

    front, back = {beginWord}, {endWord}
    visited = {beginWord, endWord}
    steps = 1

    while front:
        steps += 1
        nxt = set()
        for word in front:
            for i in range(len(word)):
                for c in 'abcdefghijklmnopqrstuvwxyz':
                    cand = word[:i] + c + word[i+1:]
                    if cand in back:
                        return steps
                    if cand in word_set and cand not in visited:
                        visited.add(cand)
                        nxt.add(cand)
        front = nxt
        if len(front) > len(back):   # always expand smaller frontier
            front, back = back, front
    return 0
```

## 📊 Time & Space Complexity

| | Standard BFS | Bidirectional BFS |
|---|---|---|
| **Time** | O(M² × N) | O(M² × N / 2) |
| **Space** | O(M × N) | O(M × N) |

Where M = word length, N = number of words in the list.

Bidirectional BFS is significantly faster in practice because it cuts the search frontier in half.

## ⚠ Edge Cases

- **`endWord` not in word list** — return 0 immediately.
- **`beginWord == endWord`** — problem guarantees they differ, but handle defensively.
- **No path exists** — BFS queue empties, return 0.
- **Single-letter words** — algorithm works unchanged.

## ✅ Key Takeaways

- When the problem says "minimum steps / transformations / moves", think **BFS**.
- **Generate neighbours** by mutation rather than pre-building the graph — far more efficient.
- **Bidirectional BFS** is a powerful optimisation whenever source and target are both known.
- Always use a **visited set** (not removing from word_set directly) to avoid revisiting nodes.