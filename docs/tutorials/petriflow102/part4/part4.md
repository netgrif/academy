# Petriflow 102 – Part 4
### Types of Arcs: Read, Inhibitor & Reset Arcs

> 💡 **What you’ll learn**  
> Understand how **different types of arcs** extend the expressive power of Petri nets — particularly **read arcs**, **inhibitor arcs**, and **reset arcs** — and how they influence token flow and transition enabling in PetriFlow.

<!-- tabs:start -->

#### **🧠 Overview**

<details open>
<summary>📘 Goal & Context</summary>

This final part of the *Petriflow 102* lecture introduces **special arc types** beyond standard input/output connections.  
These arcs are crucial for defining **conditions**, **constraints**, and **reset mechanisms** within process models.

The section covers:

- Standard arcs and their role in token movement
- **Read arcs** — testing presence of tokens
- **Inhibitor arcs** — preventing firing under certain conditions
- **Reset arcs** — removing all tokens from connected places

Each arc type provides a different way to control workflow logic.
</details>

#### **🔗 Standard Arcs Recap**

<details open>
<summary>⚙️ Basic Arcs</summary>

Standard arcs in a Petri net **consume tokens** from input places and **produce tokens** in output places when a transition fires.

| Arc Type | Direction | Behavior |
|:--|:--|:--|
| Input arc | Place → Transition | Removes tokens when firing |
| Output arc | Transition → Place | Adds tokens when firing |

These arcs define the **basic causal flow** of activities.
</details>

#### **📘 Read Arcs**

<details open>
<summary>🔍 Definition & Example</summary>

A **read arc** connects a place to a transition but **does not consume tokens**.  
It merely **tests** whether the place contains a required number of tokens before allowing the transition to fire.

| Property | Description |
|:--|:--|
| **Purpose** | Checks if a token exists without changing marking |
| **Symbol** | Small circle or special arc indicator |
| **Condition** | Tokens ≥ multiplicity |

Example scenario:

- A transition “Start Engine” has a read arc from place “Battery Charged.”
- It can fire **only if the battery is charged**, but firing doesn’t consume the charge token.

> 🎓 **In PetriFlow simulation**, read arcs act like **catalysts** — conditions that must hold true but don’t alter the state【46:6†petriflow102transcript.txt†L2-L44】.
</details>

#### **🚫 Inhibitor Arcs**

<details open>
<summary>⛔ Definition & Logic</summary>

An **inhibitor arc** prevents a transition from firing **if too many tokens** are present in a place.  
It introduces **negative conditions** — “this task can only occur if something is *not* true.”

| Property | Description |
|:--|:--|
| **Purpose** | Disables transitions when tokens ≥ multiplicity |
| **Condition** | Tokens < multiplicity |
| **Common Use** | Prevents overproduction or mutual exclusion |

> 🧠 Example:
> - *Task “Cool Reactor” may fire only if temperature < 10 tokens (representing degrees or units).*
> - This models a **less-than** condition, while read arcs model **greater-than-or-equal**.

A **special case** occurs when multiplicity = 1: this checks for **emptiness** of a place【46:7†petriflow102transcript.txt†L20-L73】【46:10†petriflow102transcript.txt†L1-L21】.

> 🧩 Originally, inhibitor arcs were introduced in classical Petri net theory to **test whether a place is empty**, and later generalized to handle thresholds.
</details>

#### **♻️ Reset Arcs**

<details open>
<summary>🧹 Purpose & Behavior</summary>

A **reset arc** clears all tokens from a place when its connected transition fires — regardless of how many there are.

| Property | Description |
|:--|:--|
| **Purpose** | Removes *all* tokens from connected place |
| **When Used** | To restart or abort processes |
| **Condition** | Independent of current marking |
| **Effect** | Sets place token count to zero |

Example:

- In a multi-step workflow, a *“Reset Process”* task can be triggered to **clear all progress** and return to start.
- This simulates an emergency stop or full rollback of the process state.

> ⚙️ Reset arcs do not determine **whether** a transition can fire — only **what happens** when it does.  
> They remove all tokens in their connected places, representing **variable multiplicity** that depends on the current marking【46:12†petriflow102transcript.txt†L1-L19】【46:14†petriflow102transcript.txt†L1-L69】.
</details>

#### **🧩 Comparative Summary**

| Arc Type | Condition | Effect on Tokens | Typical Use |
|:--|:--|:--|:--|
| **Standard Arc** | Requires tokens | Consumes/produces tokens | Normal workflow flow |
| **Read Arc** | Tokens ≥ N | No token change | Check condition (catalyst) |
| **Inhibitor Arc** | Tokens < N | No token change | Prevent over-enabling |
| **Reset Arc** | Always enabled | Removes all tokens | Reset or cleanup logic |

#### **🎥 Video Segment**

Watch **Petriflow 102 — Part 4 (36:29 – End)**:

<div class="container">
  <iframe class="responsive-iframe"
    src="https://www.youtube.com/embed/ylq-hywU5c0?start=2189"
    title="Petriflow 102 – Part 4: Types of Arcs (Read, Inhibitor, Reset)"
    allowfullscreen>
  </iframe>
</div>

#### **🧱 Visual Overview**

<div class="cards">

<div class="card">
<h4>1️⃣ Read Arc Example</h4>
<p>Transition checks presence of a token but doesn’t consume it.</p>
<img src="/tutorials/petriflow102/part4/readArc.png" alt="Read arc example" />
</div>

<div class="card">
<h4>2️⃣ Inhibitor Arc Example</h4>
<p>Transition only fires when connected place is empty or below threshold.</p>
<img src="/tutorials/petriflow102/part4/inhibitorArc.png" alt="Inhibitor arc example" />
</div>

<div class="card">
<h4>3️⃣ Reset Arc Example</h4>
<p>Transition clears all tokens from connected place upon firing.</p>
<img src="/tutorials/petriflow102/part4/resetArc.png" alt="Reset arc example" />
</div>

</div>

<!-- tabs:end -->

## ✅ Summary

| Concept | Description |
|:--|:--|
| **Read Arcs** | Test conditions without changing token marking |
| **Inhibitor Arcs** | Disable transitions when too many tokens exist |
| **Reset Arcs** | Remove all tokens, resetting a place |
| **Use in PetriFlow** | Enables conditional and restart behaviors within workflows |

> 💬 **Takeaway:**  
> Advanced arc types make Petri nets and PetriFlow more expressive and realistic.  
> They support **conditional control**, **resource constraints**, and **state resets**, helping model complex workflow logic beyond linear task flows.

You now understand:

- How read arcs differ from standard arcs
- How inhibitor arcs express negative conditions
- How reset arcs manage process restarts
- Why these mechanisms are crucial in real-world process automation  

