# Petriflow 101 - Part 6
### Creating Task Forms in the Workflow

> 🧩 **What you’ll build**  
> Define and connect **task forms** for all workflow transitions,  
> reuse the existing **Request Form**, and introduce **reference fields** to link forms together.

---

<!-- tabs:start -->

#### ** 🧠 Overview **

<details open>
<summary>📘 Goal & Steps</summary>

1. **Create forms** for all workflow tasks
2. **Reuse** the existing *Request Form* where possible
3. Learn how to use a **reference data attribute** to attach one form to another
4. Understand **subforms** and how tasks can contain other task forms
</details>

<details open>
<summary>🧩 Concept: Task Forms & Reuse</summary>

- Each **transition (task)** in Petriflow may have its **own form**.
- You can either:
    - Create a **new form** using drag-and-drop, or
    - **Reuse** an existing one (like the Request Form) through a **reference**.
- A **reference to task form** allows you to include one task’s form inside another —  
  a concept similar to *subforms* or *subtasks* in object-centric processes.
</details>

---

#### ** 🎥 Video **

Watch the “Workflow Task Form Creation” segment (48:05–57:41).
<div class="container">
  <iframe class="responsive-iframe" src="https://www.youtube.com/embed/sAVgSaBOkUE?start=2885&end=3461" title="Workflow Task Form Creation" allowfullscreen></iframe>
</div>

---

#### ** 🧱 Pictures of steps **

<div class="cards">

<div class="card">
<h4>1️⃣ Create Task Forms</h4>
<p>
Right-click on each transition (task) → <strong>Create new form</strong>.  
You can either:
</p>
<ul>
  <li>Drag and drop existing data fields to form layout, or</li>
  <li>Create a new <strong>data attribute</strong> that references another form.</li>
</ul>
<p>
For example, when designing the <em>Register</em> or <em>Answer</em> tasks,  
you can include fields from the Request Form without duplicating them.
</p>
<img src="tutorials/petriflow101/part6/createForms.png" alt="Creating forms for workflow tasks" />
</div>

<div class="card">
<h4>2️⃣ Use Reference to Request Form</h4>
<p>
Add a new <strong>data attribute</strong> of type <code>taskRef</code> and name it <em>reference_to_request_form</em>.  
This connects your task to the main <em>Request Form</em> and allows it to be displayed inside task forms.
</p>

```xml
<data type="taskRef">
  <id>reference_to_request_form</id>
  <title>Reference to Request Form</title>
  <init>t1</init>
</data>
```

<p>
This technique enables the reuse of the same form across different workflow steps,  
reducing redundancy and keeping your process consistent.
</p>
<img src="tutorials/petriflow101/part6/referenceField.png" alt="Reference to request form attribute" />
</div>

<div class="card">
<h4>3️⃣ Subforms — Tasks within Tasks</h4>
<p>
A referenced form behaves like a <strong>subform</strong>, and the related task acts as a <strong>subtask</strong>.  
This is useful when a workflow needs to show data from a previous step (like the original request)  
while performing a new action (like registration or writing an answer).
</p>
<p>
Each task’s form can now contain both its own editable fields and  
embedded forms of other tasks — a key feature of <em>object-centric workflows</em>.
</p>
<img src="tutorials/petriflow101/part6/subform.png" alt="Subform (task reference) structure" />
</div>

</div>

---

#### ** 🧾 Source & Notes **

- Builder model for Part 6:  
  <a target="_blank" href="https://builder.netgrif.cloud/modeler?modelUrl=https://academy.netgrif.com/tutorials/petriflow101/part6/request-forms.xml">request-forms.xml</a>

> 💡 **Tip:** Using <code>taskRef</code> fields keeps your process modular —  
> you can update one form and have the change reflected in all tasks that reference it.

<!-- tabs:end -->

---

## ✅ Summary

You’ve created task-specific forms for your workflow and learned how to reuse and embed forms through **reference attributes**.  
This makes your Petriflow applications more consistent, maintainable, and ready for object-centric automation.
