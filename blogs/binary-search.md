# Binary Search – From Template to Mastery

## 🧠 Intuition

Binary search is deceptively simple to describe ("halve the search space each step") but notoriously tricky to implement correctly. Off-by-one errors in the boundary conditions cause bugs even for experienced developers.

The solution is to **commit to one template and understand it deeply**, rather than re-deriving the bounds from scratch each time.

The core insight: every binary search is really a question of **"find the leftmost position where condition X is true."** Once you frame it this way, a single template covers nearly every variant.

## 🚀 Approach

### Universal Template

```python
def binary_search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2  # avoids integer overflow
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1
```

### Left Bound (first occurrence)

```python
def left_bound(nums, target):
    lo, hi = 0, len(nums)   # hi is exclusive
    while lo < hi:           # strict less-than
        mid = (lo + hi) // 2
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid          # shrink right, never mid+1
    return lo  # lo == hi at termination
```

### Right Bound (last occurrence)

```python
def right_bound(nums, target):
    lo, hi = 0, len(nums)
    while lo < hi:
        mid = (lo + hi) // 2
        if nums[mid] <= target:
            lo = mid + 1      # move past equal elements
        else:
            hi = mid
    return lo - 1  # step back one
```

### Rotated Sorted Array

```python
def search_rotated(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        # Left half is sorted
        if nums[lo] <= nums[mid]:
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:  # Right half is sorted
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1
```

## 💻 Code

```python
# Generalised binary search — "find first index where predicate is True"
def find_first_true(predicate, lo, hi):
    result = -1
    while lo <= hi:
        mid = (lo + hi) // 2
        if predicate(mid):
            result = mid
            hi = mid - 1   # look left for earlier true
        else:
            lo = mid + 1
    return result

# Example: first index where nums[i] >= target
target = 7
idx = find_first_true(lambda i: nums[i] >= target, 0, len(nums) - 1)
```

## 📊 Time & Space Complexity

| | Complexity |
|---|---|
| **Time** | O(log n) — search space halves each iteration |
| **Space** | O(1) — iterative, no recursion stack |

## ⚠ Edge Cases

- **Empty array** — check `len(nums) == 0` before calling.
- **Single element** — loop runs once, works correctly.
- **All elements equal** — left/right bound templates handle gracefully.
- **Target not present** — confirm `nums[lo] == target` after loop if needed.
- **Integer overflow** — use `mid = lo + (hi - lo) // 2`, not `(lo + hi) // 2` (critical in Java/C++).

## ✅ Key Takeaways

- There is no single "correct" binary search — pick **one template per variant** and internalise it.
- The `lo + (hi - lo) // 2` formula prevents overflow in statically-typed languages.
- Binary search applies far beyond sorted arrays: **answer binary search** (search on the answer space) solves problems like "minimum capacity to ship packages" or "koko eating bananas".
- When `lo < hi` vs `lo <= hi` determines whether `hi` is inclusive or exclusive.