# Petriflow 101 - Part 7
### Actions: Visual Low-Code Programming

> ⚙️ **What you’ll learn**  
> Use **Actions** to define event-based logic for your workflow.  
> Modify data dynamically, trigger system behaviours, and create branching (forks) — all in Petriflow’s **low-code visual editor**.

---

<!-- tabs:start -->

#### ** 🧠 Overview **

<details open>
<summary>📘 Goal & Steps</summary>

1. Understand what **Actions** are and where they run
2. Write simple actions that **change data values**
3. Create visibility logic and behaviour changes
4. Define an action that **forks** the workflow into different paths
</details>

<details open>
<summary>💡 Concept: Events & Actions</summary>

Every task and data field in Petriflow can have **event hooks**:
- Task events → *assign, finish, cancel*
- Data events → *set, get* (with pre/post timing)

Actions are **small scripts** attached to those events.  
They execute automatically when the event happens.
</details>

---

#### ** 🎥 Video **

Watch the “Actions and Low-Code Programming” segment (57:41–1:12:47).
<div class="container">
  <iframe class="responsive-iframe" src="https://www.youtube.com/embed/sAVgSaBOkUE?start=3461&end=4367" title="Actions and Low-Code Programming" allowfullscreen></iframe>
</div>

---

#### ** 🧱 Pictures of steps **

<div class="cards">

<div class="card">
<h4>1️⃣ Create and Attach Actions</h4>
<p>
Right-click any <strong>task</strong> → <strong>Edit Actions</strong>.  
Here you can define code that reacts to task events like:
</p>
<ul>
  <li><strong>onAssign</strong> — when the task is assigned</li>
  <li><strong>onFinish</strong> — when the user completes it</li>
  <li><strong>onCancel</strong> — when the task is stopped</li>
</ul>
<p>
Example: when finishing the “Submit Request” task, update the request’s <em>state</em> to “Submitted”.
</p>
<img src="tutorials/petriflow101/part7/editActions.png" alt="Editing actions in Builder" />
</div>

<div class="card">
<h4>2️⃣ Change Values and Behaviour</h4>
<p>
In the <strong>pre</strong> or <strong>post</strong> event phases, add a function to change data.  
Example: setting the <em>status</em> text dynamically or making fields visible.
</p>

```js
// Finish task - pre phase
setData('status', 'Your request was submitted');
```

<p>
You can also alter the visibility or requirements of other form fields:
</p>

```js
// Make 'Answer' field visible when PR completes their task
setVisible('answer', true);
```
<img src="tutorials/petriflow101/part7/changeValues.png" alt="Changing values in actions" />
</div>

<div class="card">
<h4>3️⃣ Workflow Forks (Alternative Paths)</h4>
<p>
Use an action to <strong>fork</strong> the process after a decision (e.g., “Go to legal” vs “Skip legal”).  
Depending on a condition, call internal workflow functions to continue along the right path:
</p>

```js
// Finish post phase of Register task
if (getData('decision_go_to_legal') === true) {
    assignAndFinish('go_to_legal');
} else {
    assignAndFinish('skip_legal');
}
```

<p>
This is a practical way to create automated branching using <code>assignAndFinish()</code> inside actions.
</p>
<img src="tutorials/petriflow101/part7/forkActions.png" alt="Forking workflow paths with actions" />
</div>

</div>

---

#### ** 💻 Actions Source Code **

<details open>
<summary>🔍 Code snippets used in the tutorial</summary>

##### 🟢 Submit Request – set state
```js
// post-finish
setData('status', 'Your request was submitted');
```

##### 🟡 Answer Task – make answer visible
```js
// pre-finish
setRequired('answer', true);
setVisible('answer', true);
setData('status', 'Below is your answer');
```

##### 🔵 Register Task – fork workflow path
```js
// post-finish
if (getData('decision_go_to_legal') === true) {
    assignAndFinish('go_to_legal');
} else {
    assignAndFinish('skip_legal');
}
```
</details>

---

#### ** 🧾 Source & Model **

- Builder model for Part 7:  
  <a target="_blank" href="https://builder.netgrif.cloud/modeler?modelUrl=https://academy.netgrif.com/tutorials/petriflow101/part7/request-actions.xml">request-actions.xml</a>

> 💡 **Tip:** Actions combine the flexibility of coding with the safety of visual modelling.  
> They let you add logic only where necessary — keeping processes maintainable yet powerful.

<!-- tabs:end -->

---

## ✅ Summary

You learned how to add low-code logic through **Actions**:
- attach scripts to task or data events
- change data or form visibility dynamically
- create branching with condition-based workflow forks

Your Petriflow model is now fully interactive and ready for advanced automation.
