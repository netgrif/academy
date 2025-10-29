# Petriflow 102 – Part 3
### Sequence Variations & Token Multiplicity

> 💡 **What you’ll learn**  
> Explore how **different execution sequences** can occur in Petri nets, how **token multiplicity** affects concurrency, and what limitations exist in PetriFlow compared to general Petri net theory.

<!-- tabs:start -->

#### **🧠 Overview**

<details open>
<summary>📘 Goal & Context</summary>

In this third section of the lecture, we continue with the **bicycle assembly** example and focus on **execution sequence variations** and **token multiplicity**.  
You’ll see how the same process can unfold in multiple ways depending on token distribution, and how **PetriFlow restricts certain concurrency** to keep workflow semantics deterministic.

This section covers:

- Sequence alternatives in token flow
- Token multiplicity and its meaning
- How PetriFlow limits simultaneous task instances
- Differences between Petri nets and workflow systems
</details>

#### **🧩 Key Concepts**

<details open>
<summary>📘 Sequence Variations</summary>

In a Petri net, multiple transitions may be **enabled simultaneously** if their input places contain tokens.  
This creates **sequence variation** — different orders of firing can lead to the same or different final states.

For example, in the **bicycle assembly** model:

- You can **attach wheels first** or **attach the handlebar first**
- Both paths lead to the same final marking (*a completed bicycle*)

> 🔁 The Petri net captures **true concurrency** — tasks that can happen in parallel without interfering with each other.
</details>

<details open>
<summary>⚙️ Token Multiplicity</summary>

Each token in a Petri net represents a **unit of availability** — a part, data item, or resource.  
Having multiple tokens in a place means the transition can **fire multiple times**, once per token.

| Place | Tokens | Meaning |
|:--|:--:|:--|
| **Wheel** | 2 | Two wheels ready for use |
| **Skeleton** | 1 | One bicycle frame |
| **Handlebar** | 2 | Two handlebars in stock |
| **Bicycle** | 0 | None assembled yet |

When transitions are fired repeatedly, the model behaves **quantitatively** rather than just logically.  
Each firing consumes the required number of tokens from input places and produces them in output places.

> 🧩 **Token multiplicity** = how many times a transition can fire given current resources.
</details>

<details open>
<summary>🏗️ Concurrency and PetriFlow Limitations</summary>

In standard Petri nets, the same transition can be **executed concurrently** multiple times if enough tokens exist.  
However, **PetriFlow restricts this behavior** for workflow clarity:

- You cannot have **multiple parallel instances** of the same task
- You can have **different tasks** executing concurrently

> 🧠 Example: You cannot run *Assemble Skeleton + Wheels* twice at once in PetriFlow,  
> but you can execute *Assemble Skeleton + Wheels* and *Assemble Skeleton + Handlebar* simultaneously.

This limitation reflects real-world **role-based constraints** — typically one user or processor handles a task instance.
</details>

<details>
<summary>📈 Workflow State Definition</summary>

The **state** of a PetriFlow workflow is defined by:

1. The **marking** — how many tokens are in each place
2. The **execution state** — which tasks are currently active or finished

Together, these define the **complete runtime state** of a process.

| State Element | Represents |
|:--|:--|
| **Token distribution** | Availability of resources or process states |
| **Task execution** | Which transitions are assigned or finished |

> 🔍 **PetriFlow = Petri net + Execution semantics + Roles + Data**  
> This transforms a theoretical model into an executable workflow.
</details>

#### **🎥 Video**

Watch the lecture segment from **Petriflow 102 — Part 3 (25:40 – 36:29)**:

<div class="container">
  <iframe class="responsive-iframe"
    src="https://www.youtube.com/embed/ylq-hywU5c0?start=1540&end=2189"
    title="Petriflow 102 – Part 3: Sequence Variations & Token Multiplicity"
    allowfullscreen>
  </iframe>
</div>

#### **🧱 Visual Steps**

<div class="cards">

<div class="card">
<h4>1️⃣ Parallel Assembly Paths</h4>
<p>Two transitions can fire independently: attaching wheels first or handlebar first.</p>
<img src="/tutorials/petriflow102/part3/sequenceVariations.png" alt="Parallel assembly paths" />
</div>

<div class="card">
<h4>2️⃣ Token Multiplicity Visualization</h4>
<p>Multiple tokens in input places enabling repeated execution of transitions.</p>
<img src="/tutorials/petriflow102/part3/tokenMultiplicity.png" alt="Token multiplicity visualization" />
</div>

<div class="card">
<h4>3️⃣ PetriFlow Concurrency Rules</h4>
<p>Illustrates allowed and disallowed concurrency — different tasks may run, but not identical ones.</p>
<img src="/tutorials/petriflow102/part3/concurrencyRules.png" alt="Concurrency constraints in PetriFlow" />
</div>

<div class="card">
<h4>4️⃣ State and Marking Overview</h4>
<p>Combined marking and task execution define workflow state in PetriFlow simulation.</p>
<img src="/tutorials/petriflow102/part3/workflowState.png" alt="Workflow state and marking" />
</div>

</div>

<!-- tabs:end -->

## ✅ Summary

| Concept | Description |
|:--|:--|
| **Sequence Variation** | Multiple enabled transitions allow different execution orders |
| **Token Multiplicity** | Defines how many times transitions can fire |
| **Concurrency** | Multiple tasks can execute in parallel under PetriFlow rules |
| **Restriction in PetriFlow** | Only one instance per task type can be active |
| **Workflow State** | Defined by token marking and task activity |

> 💬 **Takeaway:**  
> Petri nets describe flexible process behavior through tokens and concurrency.  
> PetriFlow builds on this but enforces **controlled execution semantics**, ensuring predictable, user-centric workflows.

You now understand:

- How sequence variation emerges in Petri nets
- How token multiplicity influences firing behavior
- Why PetriFlow restricts duplicate task instances
- How PetriFlow defines the state of workflows using markings and execution data