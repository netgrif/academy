# Petriflow 101 - Part 8
### Final Deployment, Testing & Conclusion

> 🚀 **What you’ll complete**  
> Finalize your **Request Workflow** by updating metadata, exporting source code, configuring task assignment policies, deploying to **eTask**, and running the final end-to-end test.

---

<!-- tabs:start -->

#### ** 🧠 Overview **

<details open>
<summary>📘 Final Steps</summary>

1. Update **metadata** (title, initials, roles) and **export** the final XML
2. Review and download the **source code** from Builder
3. Set task assignment policy (e.g. *auto*) for smoother execution
4. Perform the **third deployment** in eTask
5. Test the full process flow from submission to completion
</details>

<details open>
<summary>🧩 Concept: From Model to Working Application</summary>

- Petriflow applications are defined in Builder and deployed to **eTask**,  
  where they become **live process-based apps**.
- Updating metadata or assigning roles reflects how process models evolve.
- The **auto-assignment policy** automatically assigns transitions (tasks) to eligible users.
- Deployment cycles (upload, test, adjust) mirror real-world agile delivery.
</details>

---

#### ** 🎥 Video **

Watch the “Final Deployment & Testing” segment (1:12:47–end).
<div class="container">
  <iframe class="responsive-iframe" src="https://www.youtube.com/embed/sAVgSaBOkUE?start=4367" title="Final Deployment and Testing" allowfullscreen></iframe>
</div>

---

#### ** 🧱 Pictures of steps **

<div class="cards">

<div class="card">
<h4>1️⃣ Update Metadata & Export XML</h4>
<p>
Before deploying, open the <strong>Process Metadata</strong> in Builder and update key attributes:
</p>
<ul>
  <li>Change title to <em>Request</em> (instead of Simple Request)</li>
  <li>Keep <strong>default</strong> and <strong>anonymous roles</strong> enabled</li>
  <li>Adjust <strong>initials</strong> for clarity (e.g., <code>RQT</code>)</li>
</ul>
<p>
Then export your process as an <code>.xml</code> file — the Petriflow source code representation of your workflow.
</p>
<img src="tutorials/petriflow101/part8/exportXml.png" alt="Exporting final process XML from Builder" />
</div>

<div class="card">
<h4>2️⃣ Review Source Code</h4>
<p>
The exported XML contains the entire process structure — places, transitions, forms, and actions — written in <strong>Petriflow language</strong>.
</p>
<p>
You can open it in any text editor to inspect data definitions, roles, and task logic, or re-import it into Builder for versioned collaboration.
</p>
<img src="tutorials/petriflow101/part8/sourceCode.png" alt="Petriflow source code view" />
</div>

<div class="card">
<h4>3️⃣ Configure Task Assignment</h4>
<p>
For tasks such as <em>Submit Request</em>, set the <strong>Assign Policy</strong> to <em>auto</em>.  
This automatically assigns the task to a user or role, simplifying workflow execution.
</p>
<p>
Manual assignment is useful for controlled steps (e.g., department handoff), while <em>auto</em> is ideal for self-initiated tasks.
</p>
<img src="tutorials/petriflow101/part8/autoAssign.png" alt="Setting assign policy to auto" />
</div>

<div class="card">
<h4>4️⃣ Third Deployment in eTask</h4>
<p>
Log in to <a target="_blank" href="https://etask.netgrif.cloud/">eTask</a> and upload the new version of your process.  
You’ll see it listed with a new ID or version under <strong>Process Models</strong>.
</p>
<p>
Open the <strong>Public URL</strong>, submit a request, and observe the workflow execution — from initial submission to automatic routing through Legal and PR departments.
</p>
<img src="tutorials/petriflow101/part8/thirdDeployment.png" alt="Third deployment in eTask" />
</div>

<div class="card">
<h4>5️⃣ Final Testing & Walkthrough</h4>
<p>
Perform a complete test run:
</p>
<ul>
  <li>Submit a new request via the public form</li>
  <li>Verify transitions trigger automatically where defined</li>
  <li>Check the workflow proceeds correctly through Legal → PR</li>
  <li>Confirm the user sees the final <em>Answer</em> and <em>Status</em></li>
</ul>
<p>
Congratulations — your process is now a working <strong>multi-role web application</strong> powered by Petriflow and eTask!
</p>
<img src="tutorials/petriflow101/part8/finalTesting.png" alt="Final testing of workflow in eTask" />
</div>

</div>

---

#### ** 💻 Actions Summary **

<details open>
<summary>🔍 Review of Action Logic</summary>

- **Submit Request (post-finish):**
```js
setData('status', 'Your request was submitted');
```
- **Answer Task (pre-finish):**
```js
setRequired('answer', true);
setVisible('answer', true);
setData('status', 'Below is your answer');
```
- **Register Task (post-finish):**
```js
if (getData('decision_go_to_legal') === true) {
    assignAndFinish('go_to_legal');
} else {
    assignAndFinish('skip_legal');
}
```
These scripts automate data updates and route the workflow dynamically.
</details>

---

#### ** 🧾 Source & Notes **

- Final Builder model for Part 8:  
  <a target="_blank" href="https://builder.netgrif.cloud/modeler?modelUrl=https://academy.netgrif.com/tutorials/petriflow101/part8/request-final.xml">request-final.xml</a>

> 💡 **Tip:** Each deployment step mirrors real-world low-code iteration — update, export, test, and refine.

<!-- tabs:end -->

---

## ✅ Summary

You’ve completed your **first full Petriflow application**:
- Defined forms, workflow logic, roles, and actions
- Automated decisions and assignments
- Deployed and tested the process in eTask

🎉 Congratulations — you’ve mastered the complete Builder → Petriflow → eTask cycle!