# Longest Palindromic Substring – Expand Around Centre

## 🧠 Intuition

Every palindrome expands from a centre. If we pick each character (and each gap between characters) as a potential centre and expand outward as long as characters match, we find all palindromes in O(n²) time and O(1) space — better in practice than the O(n²) DP table approach which also costs O(n²) space.

The key insight: **a palindrome is symmetric around its centre**, so checking outward from every possible centre covers all cases.

## 🚀 Approach

1. For each index `i`, treat it as the centre of an **odd-length** palindrome (single char centre).
2. For each gap between `i` and `i+1`, treat it as the centre of an **even-length** palindrome.
3. Expand left and right while `s[left] == s[right]`.
4. Track the longest palindrome found.

## 💻 Code

```python
def longestPalindrome(s: str) -> str:
    def expand(left: int, right: int) -> str:
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        return s[left + 1 : right]   # slice when mismatch occurs

    best = ""
    for i in range(len(s)):
        odd  = expand(i, i)          # odd-length centre
        even = expand(i, i + 1)      # even-length centre
        if len(odd)  > len(best): best = odd
        if len(even) > len(best): best = even
    return best
```

```java
public String longestPalindrome(String s) {
    int start = 0, maxLen = 1;
    for (int i = 0; i < s.length(); i++) {
        int odd  = expand(s, i, i);
        int even = expand(s, i, i + 1);
        int best = Math.max(odd, even);
        if (best > maxLen) {
            maxLen = best;
            start = i - (best - 1) / 2;
        }
    }
    return s.substring(start, start + maxLen);
}
private int expand(String s, int l, int r) {
    while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) { l--; r++; }
    return r - l - 1;
}
```

## 📊 Time & Space Complexity

| | Complexity |
|---|---|
| **Time** | O(n²) — n centres × O(n) expansion each |
| **Space** | O(1) — only indices stored (O(n) if you count the output) |

Compare to DP: O(n²) time and O(n²) space. Expand-around-centre wins on space.

## ⚠ Edge Cases

- **Single character** — always a palindrome; return `s`.
- **All same characters** — e.g. `"aaaa"` — entire string is the answer.
- **No palindrome longer than 1** — e.g. `"abcd"` — any single char is a valid answer.
- **Even vs odd length** — must check both centres at every position.

## ✅ Key Takeaways

- The expand-around-centre technique is reusable for **"count palindromic substrings"** too — just count instead of tracking max.
- Manacher's Algorithm solves this in O(n) time, but expand-around-centre is far simpler and acceptable in interviews.
- Always handle both **even and odd** centres — a common source of bugs.