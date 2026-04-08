# Two Sum – Optimal Hashmap Approach

## 🧠 Intuition

The naive solution checks every pair — that's O(n²). The key insight is: **instead of searching for the complement after storing everything, check for the complement while we iterate.**

For each number `num`, we need `target - num`. If we keep a record of numbers we've already seen and their indices, we can answer "have I seen the complement?" in O(1).

This is the classic **trade space for time** pattern: a hashmap gives us O(1) lookup at the cost of O(n) extra memory.

## 🚀 Approach

1. Initialise an empty hashmap `seen = {}` mapping `value → index`.
2. Iterate through the array with index `i` and value `num`.
3. Compute `complement = target - num`.
4. If `complement` is already in `seen`, return `[seen[complement], i]`.
5. Otherwise, store `seen[num] = i` and continue.
6. A valid answer is guaranteed, so we never fall through.

The crucial order is: **check first, then insert**. This avoids using the same element twice.

## 💻 Code

```python
def twoSum(nums: list[int], target: int) -> list[int]:
    seen = {}  # value -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []  # guaranteed to find an answer per problem constraints
```

```java
public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (seen.containsKey(complement)) {
            return new int[]{seen.get(complement), i};
        }
        seen.put(nums[i], i);
    }
    return new int[]{};
}
```

## 📊 Time & Space Complexity

| | Complexity |
|---|---|
| **Time** | O(n) — single pass through the array |
| **Space** | O(n) — hashmap stores at most n entries |

Compare to brute force: O(n²) time, O(1) space. The hashmap solution is strictly better for large inputs.

## ⚠ Edge Cases

- **Duplicate values** like `nums = [3, 3], target = 6` — works correctly because we check before inserting, so the second `3` sees the first `3` already in the map.
- **Negative numbers** — complement arithmetic handles them naturally.
- **Exactly 2 elements** — simplest case, always caught in the first iteration of the second element.
- **Large inputs** — O(n) performance holds regardless of size.

## ✅ Key Takeaways

- The **hashmap complement** pattern generalises to Three Sum, Four Sum, and many other problems.
- Always clarify: can we use the **same element twice**? This problem says no — storing index prevents it.
- **Check before insert** is the subtle but critical implementation detail.
- This pattern appears in ~30% of array/hashing problems on LeetCode — internalise it deeply.