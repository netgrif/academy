# Petriflow 102 – Part 1
### Introduction to Petri Nets and Workflow Semantics

> 💡 **What you’ll learn**  
> Understand the theory behind **PetriFlow** — Petri nets, tokens, transitions, and workflow semantics.

 

<!-- tabs:start -->

#### **🧠 Overview**

<details open>
<summary>📘 Goal & Context</summary>

In this lesson you’ll explore the **core theory that PetriFlow builds upon** — the formal model of Petri nets introduced by **Carl Adam Petri (1962)**.  
After completing your first practical example (the *Request Form* process from Petriflow 101), you’ll now learn how Petri nets describe the logic and state of workflows.

The focus is on:

- Understanding **places (⚪)**, **transitions (⬛)** and **tokens (•)**
- Seeing how tasks in PetriFlow correspond to transitions in Petri nets
- Exploring **interval semantics** (assign → finish → cancel)
- Learning how tokens move through a workflow and control task enabling

You’ll follow the examples directly inside **Netgrif Application Builder** (simulation mode and event mode).
</details>

 

#### **🧩 Key Concepts**

<details open>
<summary>📘 Petri Net Basics</summary>

A **Petri net** is a graphical and mathematical model for systems with states and events.

| Element | Symbol | Meaning |
|:--|:--:|:--|
| **Place** | ⚪ | Represents a state or condition (e.g. *Request submitted*) |
| **Transition** | ⬛ | Represents an action or event (e.g. *Register request*) |
| **Token** | • | Marks the current state — data or resource |
| **Arc** | → | Connects places and transitions, defining flow |

**Firing rule:** When all input places of a transition contain required tokens, the transition is **enabled**.  
When it fires, it **consumes** tokens from input places and **produces** tokens in output places.
</details>

<details open>
<summary>📄 Arcs and Advanced Semantics Preview</summary>

In later parts of the lecture, the speaker introduces different **types of arcs**:

| Type | Symbol | Purpose |
|:--|:--|:--|
| **Standard Arc** | → | Moves tokens (normal flow) |
| **Read Arc** | ⟳ | Checks token presence without consumption |
| **Inhibitor Arc** | ⊘ | Prevents execution if tokens are present |
| **Reset Arc** | ↻ | Removes all tokens from a place when fired |

These extensions allow PetriFlow to model conditions, tests, and resets within workflow logic.
</details>

<details>
<summary>⚙️ From Petri Nets to PetriFlow</summary>

In standard Petri nets, transitions fire instantly — they have no duration.  
PetriFlow extends this model by introducing **task lifecycle semantics**, reflecting real-world execution:

| Stage | Description |
|:--|:--|
| **Assign** | Task is started; token is taken from input place |
| **Finish** | Task is completed; token is placed in output place |
| **Cancel** | Task is interrupted; token is returned to original place |

This **interval semantics** means a task has a lifecycle (start → active → complete) instead of an instantaneous event.

> 🧠 Think of *Assign → Finish → Cancel* as *Start → Work → End* with the option to rollback tokens when canceled.
</details>

 

#### **🎥 Video**

Watch the lecture segment from **Petriflow 102 — Part 1 (00:00 – 13:42)**:

<div class="container">
  <iframe class="responsive-iframe"
    src="https://www.youtube.com/embed/ylq-hywU5c0?start=0&end=822"
    title="Petriflow 102 – Part 1: Introduction to Petri Nets"
    allowfullscreen>
  </iframe>
</div>

 

#### **🧱 Visual Steps**

<div class="cards">

<div class="card">
<h4>1️⃣ Workflow Example – Request Process</h4>
<p>Shows the original Request form workflow built in Petriflow 101 and how its structure is based on places and transitions.</p>
<img src="/tutorials/petriflow102/part1/editView.png" alt="Request workflow structure" />
</div>

<div class="card">
<h4>2️⃣ Petri Net Structure</h4>
<p>Visual representation of places (⚪), transitions (⬛), and arcs connecting them.</p>
<img src="/tutorials/petriflow102/part1/places&tasks.png" alt="Petri net structure diagram" />
</div>

<div class="card">
<h4>3️⃣ Token Flow Simulation</h4>
<p>Token movement demonstrating how enabling and firing work in simulation mode.</p>
<img src="/tutorials/petriflow102/part1/simulationView.png" alt="Token flow simulation" />
</div>

<div class="card">
<h4>4️⃣ Interval Semantics in Action</h4>
<p>Assign → Finish → Cancel states visualized in Builder event mode.</p>
<img src="/tutorials/petriflow102/part1/simulationByTask.png" alt="Task semantics diagram" />
</div>

</div>

<!-- tabs:end -->

## ✅ Summary

| Concept | Description |
|:--|:--|
| **Place (⚪)** | Represents a state or condition |
| **Transition (⬛)** | Represents a task or event |
| **Token (•)** | Marks the state — data or availability |
| **Enabled Transition** | Can fire when all inputs have tokens |
| **Firing / Execution** | Consumes tokens from inputs, produces tokens to outputs |
| **Interval Semantics** | Task lifecycles (Assign, Finish, Cancel) |
| **Concurrency** | PetriFlow disallows parallel instances of the same task but allows parallel tasks of different types |

> 💬 **Takeaway:**  
> PetriFlow extends Petri nets from a mathematical model into an **executable workflow language** — connecting the theory of places, transitions and tokens with practical task execution and role-based behavior.

You now understand:

- The core structure and elements of Petri nets
- How tokens and transitions define workflow state
- How PetriFlow adds duration and responsibility through interval semantics
- The difference between theoretical firing and workflow execution
- A preview of arc types for advanced process control