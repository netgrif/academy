# Petriflow 102 — Part 1
### Introduction to Petri Nets and Workflow Semantics

> 💡 **What you’ll learn**  
> Understand the theory behind PetriFlow — Petri nets, tokens, transitions, and workflow semantics.

---

<!-- tabs:start -->

#### ** 🧠 Theory **

<details open>
<summary>📘 Overview</summary>

PetriFlow builds on **Petri nets**, introduced by **Carl Adam Petri (1962)**, which describe systems with:
- **Places (⚪)** – states or conditions
- **Transitions (⬛)** – events or tasks
- **Tokens (•)** – data or resources that move through the model

In a Petri net:
- Tokens enable transitions.
- Transitions “fire” when inputs are satisfied.
- Firing consumes tokens from input places and produces new ones in output places.
</details>

<details open>
<summary>🧩 Interval Semantics in PetriFlow</summary>

Unlike standard Petri nets, PetriFlow tasks have **duration** and **responsibility**.  
Each transition (task) passes through stages:

| Stage | Description |
|--------|-------------|
| **Assign** | Token is taken from input places |
| **Finish** | Token is produced in output places |
| **Cancel** | Token is returned to original places |

> ⚙️ **Assign → Finish → Cancel** mirrors real-world workflow execution — not just mathematical firing.
</details>

> 🔍 **Key Insight:**  
> PetriFlow turns abstract tokens into *live process states* that can be simulated, visualized, and executed by users.

---

#### ** 🎥 Video **

Watch **Petriflow 102 — Part 1 (00:00 – 13:42)**

<div class="container">
  <iframe class="responsive-iframe"
    src="https://www.youtube.com/embed/ylq-hywU5c0?start=0&end=822"
    title="Petriflow 102 – Part 1: Introduction to Petri Nets"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen>
  </iframe>
</div>

> 🎬 Replace the link above with your own timestamp if needed.

---

#### ** 🧱 Visual **

<div class="cards">

<div class="card">
<h4>1️⃣ Petri Net Structure</h4>
<p>Basic Builder layout showing **places (⚪)**, **transitions (⬛)**, and connecting arcs.</p>
<img src="petrinet_structure.png" alt="Petri net structure"/>
</div>

<div class="card">
<h4>2️⃣ Token Flow Simulation</h4>
<p>Tokens moving through enabled transitions to demonstrate workflow logic.</p>
<img src="token_flow.png" alt="Token flow simulation"/>
</div>

<div class="card">
<h4>3️⃣ Interval Semantics</h4>
<p>Visual representation of <b>Assign → Finish → Cancel</b> in PetriFlow.</p>
<img src="task_semantics.png" alt="Task semantics"/>
</div>

</div>

> 🖼️ Replace the image files with your screenshots for Builder and simulation.

---

#### **🧾 Summary **

| Concept | Description |
|----------|-------------|
| **Place (⚪)** | Passive condition / state |
| **Transition (⬛)** | Active event / task |
| **Token (•)** | Represents data or availability |
| **Firing** | Consumes input tokens → produces outputs |
| **Interval semantics** | Task lifecycle (Assign, Finish, Cancel) |
| **Enabled / Disabled** | Visual indicators (Green = enabled, Red = blocked) |

> 💬 **Takeaway:**  
> PetriFlow = Petri nets + time, roles and data — making theoretical models executable workflows.

<!-- tabs:end -->

---

## ✅ Summary

You now understand:
- The **core structure** of Petri nets
- How **tokens and transitions** describe process flow
- The **extended semantics** that make PetriFlow a true workflow engine
- The visual link between theory and Builder simulation

> 🚀 Next: **Part 2 — Simulation & Semantics** dives deeper into how enabling conditions and concurrency behave in practice.