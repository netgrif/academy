# Petriflow 103 – Part 1
### Introduction and Reset Arcs

> 💡 **What you’ll learn**  
> Discover how **Reset Arcs** extend the expressive power of PetriFlow models and how they can be used to **reset**, **restart**, or **clean up** process states dynamically.

 

<!-- tabs:start -->

#### **🧠 Overview**

<details open>
<summary>📘 Goal & Context</summary>

In this session, we build upon the knowledge of **arc types** from *Petriflow 102 – Part 4* and introduce the **Reset Arc** in more depth.  
The lesson explains how reset arcs differ from normal and inhibitor arcs, and how they allow **complete clearing of tokens** from selected places when transitions fire.

You’ll also see practical implications for **workflow restarts**, **process cleanup**, and **error handling** in Netgrif Builder.
</details>

 

#### **🧩 Key Concepts**

<details open>
<summary>📘 Reset Arcs Explained</summary>

A **Reset Arc** is a special type of arc that removes **all tokens** from a place when the connected transition fires — regardless of how many tokens are present.

| Property | Description |
|:--|:--|
| **Behavior** | Clears all tokens from connected places |
| **Trigger** | Activated when a transition fires |
| **Effect** | Place token count becomes zero |
| **Usage** | Used to reset, restart, or abort parts of a process |

> 🧠 Think of Reset Arcs as a **global cleanup** mechanism — they reset the state of a place completely.
</details>

<details open>
<summary>⚙️ Reset Arc vs. Standard and Inhibitor Arcs</summary>

| Type | Consumes Tokens? | Prevents Firing? | Removes All Tokens? | Description |
|:--|:--:|:--:|:--:|:--|
| **Standard Arc** | ✅ Yes | ❌ No | ❌ No | Transfers tokens normally |
| **Inhibitor Arc** | ❌ No | ✅ Yes | ❌ No | Blocks firing if tokens exist |
| **Reset Arc** | ✅ (All) | ❌ No | ✅ Yes | Clears all tokens from input place |

Unlike standard arcs, Reset Arcs **don’t depend on token count** — they always activate and remove everything in the connected place.
</details>

<details open>
<summary>🏗️ Example: Process Reset Scenario</summary>

Imagine a workflow for handling document reviews.  
If at any stage an **error** occurs, a “Reset Process” transition can use a **Reset Arc** to clear all tokens from review-related places (e.g., *Draft*, *Under Review*, *Feedback*).

This instantly reverts the system to a clean state — effectively restarting the process.

```text
Before firing Reset Transition:
  Draft = 1 token
  Under Review = 2 tokens
  Feedback = 1 token

After firing Reset Transition:
  Draft = 0
  Under Review = 0
  Feedback = 0
```
> ⚙️ This makes Reset Arcs essential for **error handling**, **restart mechanisms**, and **rollback logic** in PetriFlow models.
</details>

<details>
<summary>📈 Workflow Use Cases</summary>

Reset arcs are most useful in scenarios such as:

- **Process Restart:** When a user wants to restart an entire process flow
- **Abort Operation:** Cancelling all pending steps of a workflow
- **Error Recovery:** Clearing states to return to initial marking
- **State Synchronization:** Ensuring multiple concurrent branches are reset together

> 💬 Reset arcs create a **non-deterministic yet controlled reset** — perfect for restoring process integrity.
</details>

#### **🎥 Video**

Watch the segment **Petriflow 103 — Part 1 (00:00 – 9:05)**:

<div class="container">
  <iframe class="responsive-iframe"
    src="https://www.youtube.com/embed/QXGl7FDqp2Q?si=CwIqR6U-PeT1Fkfz?start=0&end=545"
    title="Petriflow 103 – Part 1: Introduction and Reset Arcs"
    allowfullscreen>
  </iframe>
</div>

#### **🧱 Visual Steps**

<div class="cards">

<div class="card">
<h4>1️⃣ Reset Arc Basics</h4>
<p>Shows a transition connected to multiple places through reset arcs that clear all tokens when fired.</p>
<img src="/tutorials/petriflow103/part1/resetArcBasics.png" alt="Reset arc basics diagram" />
</div>

<div class="card">
<h4>2️⃣ Reset in Workflow Context</h4>
<p>Visual example: error handling transition resets process state to initial marking.</p>
<img src="/tutorials/petriflow103/part1/resetWorkflow.png" alt="Workflow reset example" />
</div>

<div class="card">
<h4>3️⃣ Comparison Diagram</h4>
<p>Illustration comparing standard, inhibitor, and reset arcs in Builder.</p>
<img src="/tutorials/petriflow103/part1/arcComparison.png" alt="Arc comparison visual" />
</div>

</div>

<!-- tabs:end -->

#### **🧾 Summary**

| Concept | Description |
|:--|:--|
| **Reset Arc** | Removes all tokens from a place when a transition fires |
| **Purpose** | Used to restart or clear process sections |
| **Difference** | Unlike inhibitor arcs, it doesn’t prevent firing |
| **Workflow Use** | Useful for resets, aborts, and error recovery |

> 💬 **Takeaway:**  
> Reset Arcs provide a **powerful mechanism** for handling complex process restarts and maintaining workflow consistency.  
> They extend PetriFlow beyond modeling static systems into fully **self-healing, dynamic processes**.

## ✅ You Now Understand

- The purpose and mechanism of **Reset Arcs**
- How they differ from standard and inhibitor arcs
- When to apply them for error handling and process restarts
- Their role in **workflow resilience and recovery**