# Petriflow 102 – Part 2
### Interpretation of Places and Model Semantics

> 💡 **What you’ll learn**  
> Learn how **places in Petri nets** can represent not only abstract states but also **physical or logical entities**, and how changing their interpretation affects workflow meaning.

<!-- tabs:start -->

#### **🧠 Overview**

<details open>
<summary>📘 Goal & Context</summary>

In this second part of the lecture, we expand the concept of **places** introduced in Part 1.  
While previously places represented abstract workflow states (*Request submitted*, *Registered*, etc.), they can also represent **physical objects or resources**.

To illustrate this, the speaker uses the **bicycle assembly example** — a metaphor for understanding how tokens and places interact when representing *real-world entities*.  
This section also introduces the concept of **interpretation**, explaining that Petri nets themselves are neutral mathematical structures — it’s the **modeler who assigns meaning**.
</details>

#### **🧩 Key Concepts**

<details open>
<summary>📘 Interpretation of Places</summary>

Originally, **Carl Adam Petri** used Petri nets to model *chemical reactions*. Each **place** corresponded to a **molecule**, and **transitions** described **reactions** that produced or consumed them.

In the workflow analogy, the same principle applies — but now **places** can represent objects like *wheels*, *skeletons*, or *handlebars*.

| Place | Represents | Token Meaning |
|:--|:--|:--|
| **Wheel** | Type of part | Each token = one wheel |
| **Skeleton** | Base of bicycle | Each token = one frame |
| **Handlebar** | Component | Each token = one handlebar |
| **Bicycle** | Finished product | Token = completed bicycle |

> 🧩 The **multiplicity of tokens** now has *physical meaning* (e.g., two tokens = two wheels).  
> This makes the model closer to **object-oriented logic**, where tokens correspond to *instances* of objects rather than abstract states.
</details>

<details open>
<summary>⚙️ Assembling the Bicycle</summary>

The Petri net demonstrates multiple ways to **assemble** a bicycle using these elements:

- **Add wheels → Add skeleton → Add handlebar**
- Or **Combine skeleton + handlebar first → then add wheels**

These alternative execution paths show **concurrency** and **flexibility** within Petri nets — the same end result (*a bicycle*) can be achieved through different sequences of transitions.

> The Petri net becomes an *information system* describing how assembly steps are ordered and related.
</details>

<details open>
<summary>🏗️ From Instance to System Model</summary>

Initially, the model describes **one bicycle** — a single instance.  
However, by changing the interpretation, we can model an entire **garage or workshop** assembling many bicycles simultaneously.

| Interpretation | Meaning |
|:--|:--|
| **Instance level** | A single bicycle being assembled |
| **System level** | A workshop managing wheels, skeletons, handlebars, and bicycles |

This shows that **Petri nets have no inherent semantics** — the **interpretation defines** what the system models.  
For example:
- A token may represent one *wheel* or one *request*
- A place may represent *availability of a part* or *a workflow state*

> 🔁 The *same structure* can model completely different realities depending on interpretation.
</details>

<details>
<summary>📈 Marking and State Meaning</summary>

The **marking** (number of tokens in each place) represents the **state of the system**.  
In the garage example, the marking can show:
- 2 wheels available
- 0 skeletons left
- 2 handlebars in stock
- 3 skeletons with wheels
- 1 skeleton with handlebar
- 0 bicycles ready to sell

By executing transitions (e.g., *Add handlebar to skeleton with wheels*), the system evolves to a new state — two ready bicycles appear in the output place.

> 🧠 The **marking + active tasks** together define the *workflow state* in PetriFlow.
</details>

#### **🎥 Video**

Watch the lecture segment from **Petriflow 102 — Part 2 (13:42 – 25:40)**:

<div class="container">
  <iframe class="responsive-iframe"
    src="https://www.youtube.com/embed/ylq-hywU5c0?start=822&end=1540"
    title="Petriflow 102 – Part 2: Interpretation of Places"
    allowfullscreen>
  </iframe>
</div>

#### **🧱 Visual Steps**

<div class="cards">

<div class="card">
<h4>1️⃣ Bicycle Assembly Example</h4>
<p>Places represent parts (wheel, skeleton, handlebar), transitions represent assembly steps.</p>
<img src="/tutorials/petriflow102/part2/bicycleModel.png" alt="Bicycle assembly Petri net" />
</div>

<div class="card">
<h4>2️⃣ Alternative Sequences</h4>
<p>Multiple paths to achieve the same result — illustrating concurrency and flexibility. Model scales to system level, representing stock and production states of multiple bicycles.</p>
<img src="/tutorials/petriflow102/part2/assemblyVariants.png" alt="Alternative assembly sequences" />
</div>

<!-- tabs:end -->

## ✅ Summary

| Concept | Description |
|:--|:--|
| **Interpretation** | Meaning assigned by the modeler — defines what tokens and places represent |
| **Instance vs System** | Model can represent one object (bicycle) or an entire system (garage) |
| **Multiplicity of Tokens** | Represents real quantities (e.g., two wheels) |
| **Marking** | Number of tokens = current state of the system |
| **Neutral Semantics** | Petri nets themselves have no built-in meaning |

> 💬 **Takeaway:**  
> Petri nets are a **neutral mathematical framework**. By interpreting their elements, you transform them into **domain-specific workflow models**.  
> PetriFlow builds on this flexibility — connecting theory, object semantics, and process execution.

You now understand:

- How Petri nets can model physical or abstract entities
- The role of interpretation in giving meaning to places and tokens
- How markings define workflow or system state
- How PetriFlow leverages these semantics to describe real processes
