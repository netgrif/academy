# Petriflow 101 - Part 4
### Workflow - Object-Centric Process

> ⚙️ **What you’ll build**  
> Extend the **Request Form** into a real **process-based application** using **workflow** elements - *places* and *transitions* - in the **Petriflow language**.

---

<!-- tabs:start -->

#### ** 🧠 Overview **

<details open>
<summary>📘 Goal & Steps</summary>

1. **Reuse** your previous *Request Form* model as a starting point
2. **Add workflow logic** to create a process with multiple steps
3. Define **states (places)** and **tasks (transitions)** for each step
4. Configure **shared forms** for client and employee interactions
5. **Deploy and test** the full process-based application in **eTask**
</details>

<details open>
<summary>🧩 Concept: From Form to Process</summary>

- Transform a **simple web form** into a **multi-user workflow**
- Use **Petriflow PetriNet** elements:
    - *Places* → represent **states** of the process
    - *Transitions* → represent **tasks** performed by users
- Each transition has an associated **form** and **data logic**
</details>

#### ** 🎥 Video **

Watch the “First Workflow in Builder” segment (24:16–43:50).
<div class="container">
  <iframe class="responsive-iframe" src="https://www.youtube.com/embed/sAVgSaBOkUE?start=1580&end=2630" title="First Workflow in Builder" allowfullscreen></iframe>
</div>

#### ** 🧱 Pictures of steps **

<div class="cards">

<div class="card">
<h4>1️⃣ Places & Tasks - Connected via Arcs</h4>
<p>
In <strong>Petriflow</strong>, a process is modeled as a <em>Petri net</em> - a network of <strong>places</strong> and <strong>transitions</strong> connected by <strong>arcs</strong>.
</p>
<ul>
  <li><strong>Places</strong> represent <em>states</em> of the process (e.g., <em>New Request</em>, <em>Registered</em>, <em>Answered</em>).</li>
  <li><strong>Transitions (Tasks)</strong> represent <em>actions</em> or <em>events</em> that change the state (e.g., <em>Register Request</em>, <em>Prepare Answer</em>, <em>Send Reply</em>).</li>
  <li><strong>Arcs</strong> connect places and transitions - defining how tokens (data/state) flow between them.</li>
  <li>Arcs can have different <em>types</em> or <em>values</em>, but the <strong>default</strong> connection passes control flow and data tokens.</li>
</ul>
<img src="tutorials/petriflow101/part4/places&tasks.png" alt="Places and tasks connected via arcs in workflow" />
</div>
<div class="card">
<h4>2️⃣ Workflow Edit View</h4>
<p>
The <strong>Edit View</strong> in Netgrif Builder lets you visually design your process structure.
You can <em>create places and transitions</em>, connect them with arcs, and configure their properties — all without writing code.
Each element (place, transition, or arc) can be clicked to open its detailed configuration, such as data mappings, roles, or transition logic.
This view is where the <strong>Petriflow Petri net</strong> is graphically created and maintained.
</p>
<img src="tutorials/petriflow101/part4/editView.png" alt="Edit view in Builder" />
</div>

<div class="card">
<h4>3️⃣ Workflow Simulation View</h4>
<p>
The <strong>Simulation View</strong> allows you to <em>run and test your process</em> directly in the Builder.
It simulates how tokens move through the Petri net — showing which transitions are available,
how data changes as tasks are completed, and how roles interact with the workflow.
This helps you verify that your process logic works correctly before deploying it to <strong>eTask</strong>.
</p>
<img src="tutorials/petriflow101/part4/simulationView.png" alt="Final process workflow" />
</div>

</div>

#### ** 🧾 Source & Notes **

- Builder model for Part 4:  
  <a target="_blank" href="https://builder.netgrif.cloud/modeler?modelUrl=https://academy.netgrif.com/tutorials/petriflow101/part4/request-workflow.xml">request-workflow.xml</a>

<details>
<summary>📄 Source code (XML file)</summary>

```xml
<document xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="https://petriflow.com/petriflow.schema.xsd">
  <id>request</id>
  <version>1.0.0</version>
  <initials>RQT</initials>
  <title>Request</title>
  <icon>device_hub</icon>
  <defaultRole>true</defaultRole>
  <anonymousRole>true</anonymousRole>
  <transitionRole>false</transitionRole>
  <data type="text">
    <id>answer</id>
    <title>Answer</title>
  </data>
  <data type="file">
    <id>attachment</id>
    <title>Attachment</title>
  </data>
  <data type="boolean">
    <id>decision_legal</id>
    <title>Go to legal?</title>
    <init>false</init>
  </data>
  <data type="text">
    <id>email</id>
    <title>Email</title>
    <validations>
      <validation>
        <expression>regex ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$</expression>
        <message>Please type a valid email</message>
      </validation>
    </validations>
  </data>
  <data type="text">
    <id>name</id>
    <title>Name</title>
  </data>
  <data type="text">
    <id>phone</id>
    <title>Phone number</title>
  </data>
  <data type="taskRef">
    <id>reference_to_request_form</id>
    <title/>
    <init>t1</init>
  </data>
  <data type="text">
    <id>request_text</id>
    <title>Request</title>
  </data>
  <data type="text">
    <id>state</id>
    <title>State</title>
  </data>
  <data type="text">
    <id>statement_of_legal</id>
    <title>Statement of legal department</title>
    <component>
      <name>textarea</name>
    </component>
  </data>
  <data type="text">
    <id>surname</id>
    <title>Surname</title>
  </data>
  <transition>
    <id>t1</id>
    <x>336</x>
    <y>112</y>
    <label>Request form</label>
    <assignPolicy>auto</assignPolicy>
    <dataGroup>
      <id>t1_0</id>
      <cols>4</cols>
      <layout>grid</layout>
      <dataRef>
        <id>name</id>
        <logic>
          <behavior>editable</behavior>
        </logic>
        <layout>
          <x>0</x>
          <y>0</y>
          <rows>1</rows>
          <cols>2</cols>
          <template>material</template>
          <appearance>outline</appearance>
        </layout>
      </dataRef>
      <dataRef>
        <id>surname</id>
        <logic>
          <behavior>editable</behavior>
        </logic>
        <layout>
          <x>2</x>
          <y>0</y>
          <rows>1</rows>
          <cols>2</cols>
          <template>material</template>
          <appearance>outline</appearance>
        </layout>
      </dataRef>
      <dataRef>
        <id>email</id>
        <logic>
          <behavior>editable</behavior>
          <behavior>required</behavior>
        </logic>
        <layout>
          <x>0</x>
          <y>1</y>
          <rows>1</rows>
          <cols>2</cols>
          <template>material</template>
          <appearance>outline</appearance>
        </layout>
      </dataRef>
      <dataRef>
        <id>phone</id>
        <logic>
          <behavior>editable</behavior>
        </logic>
        <layout>
          <x>2</x>
          <y>1</y>
          <rows>1</rows>
          <cols>2</cols>
          <template>material</template>
          <appearance>outline</appearance>
        </layout>
      </dataRef>
      <dataRef>
        <id>request_text</id>
        <logic>
          <behavior>editable</behavior>
          <behavior>required</behavior>
        </logic>
        <layout>
          <x>0</x>
          <y>2</y>
          <rows>2</rows>
          <cols>4</cols>
          <template>material</template>
          <appearance>outline</appearance>
        </layout>
        <component>
          <name>textarea</name>
        </component>
      </dataRef>
      <dataRef>
        <id>attachment</id>
        <logic>
          <behavior>editable</behavior>
        </logic>
        <layout>
          <x>0</x>
          <y>4</y>
          <rows>1</rows>
          <cols>4</cols>
          <template>material</template>
          <appearance>outline</appearance>
        </layout>
        <component>
          <name>preview</name>
        </component>
      </dataRef>
    </dataGroup>
  </transition>
  <transition>
    <id>t2</id>
    <x>176</x>
    <y>272</y>
    <label>Submit request</label>
    <assignPolicy>auto</assignPolicy>
    <dataGroup>
      <id>t2_0</id>
      <cols>4</cols>
      <layout>grid</layout>
      <dataRef>
        <id>reference_to_request_form</id>
        <logic>
          <behavior>editable</behavior>
        </logic>
        <layout>
          <x>0</x>
          <y>0</y>
          <rows>1</rows>
          <cols>4</cols>
          <template>material</template>
          <appearance>outline</appearance>
        </layout>
      </dataRef>
    </dataGroup>
  </transition>
  <transition>
    <id>t3</id>
    <x>432</x>
    <y>272</y>
    <label>Register</label>
    <dataGroup>
      <id>t3_0</id>
      <cols>4</cols>
      <layout>grid</layout>
      <dataRef>
        <id>decision_legal</id>
        <logic>
          <behavior>editable</behavior>
        </logic>
        <layout>
          <x>1</x>
          <y>0</y>
          <rows>1</rows>
          <cols>2</cols>
          <template>material</template>
          <appearance>outline</appearance>
        </layout>
      </dataRef>
      <dataRef>
        <id>reference_to_request_form</id>
        <logic>
          <behavior>visible</behavior>
        </logic>
        <layout>
          <x>0</x>
          <y>1</y>
          <rows>1</rows>
          <cols>4</cols>
          <template>material</template>
          <appearance>outline</appearance>
        </layout>
      </dataRef>
    </dataGroup>
  </transition>
  <transition>
    <id>t4</id>
    <x>656</x>
    <y>176</y>
    <label>go_to_legal</label>
  </transition>
  <transition>
    <id>t5</id>
    <x>912</x>
    <y>176</y>
    <label>Statement of legal</label>
    <dataGroup>
      <id>t5_0</id>
      <cols>4</cols>
      <layout>grid</layout>
      <dataRef>
        <id>statement_of_legal</id>
        <logic>
          <behavior>editable</behavior>
          <behavior>required</behavior>
        </logic>
        <layout>
          <x>0</x>
          <y>0</y>
          <rows>2</rows>
          <cols>4</cols>
          <template>material</template>
          <appearance>outline</appearance>
        </layout>
        <component>
          <name>textarea</name>
        </component>
      </dataRef>
      <dataRef>
        <id>reference_to_request_form</id>
        <logic>
          <behavior>visible</behavior>
        </logic>
        <layout>
          <x>0</x>
          <y>2</y>
          <rows>1</rows>
          <cols>4</cols>
          <template>material</template>
          <appearance>outline</appearance>
        </layout>
      </dataRef>
    </dataGroup>
  </transition>
  <transition>
    <id>t6</id>
    <x>1136</x>
    <y>272</y>
    <label>Answer</label>
    <dataGroup>
      <id>t6_0</id>
      <cols>4</cols>
      <layout>grid</layout>
      <dataRef>
        <id>answer</id>
        <logic>
          <behavior>editable</behavior>
          <behavior>required</behavior>
        </logic>
        <layout>
          <x>0</x>
          <y>0</y>
          <rows>2</rows>
          <cols>4</cols>
          <template>material</template>
          <appearance>outline</appearance>
        </layout>
        <component>
          <name>textarea</name>
        </component>
      </dataRef>
      <dataRef>
        <id>statement_of_legal</id>
        <logic>
          <behavior>hidden</behavior>
        </logic>
        <layout>
          <x>0</x>
          <y>2</y>
          <rows>2</rows>
          <cols>4</cols>
          <template>material</template>
          <appearance>outline</appearance>
        </layout>
      </dataRef>
      <dataRef>
        <id>reference_to_request_form</id>
        <logic>
          <behavior>visible</behavior>
        </logic>
        <layout>
          <x>0</x>
          <y>4</y>
          <rows>1</rows>
          <cols>4</cols>
          <template>material</template>
          <appearance>outline</appearance>
        </layout>
      </dataRef>
    </dataGroup>
  </transition>
  <transition>
    <id>t7</id>
    <x>784</x>
    <y>272</y>
    <label>skip_legal</label>
  </transition>
  <transition>
    <id>t8</id>
    <x>432</x>
    <y>400</y>
    <label>Status</label>
    <dataGroup>
      <id>t8_0</id>
      <cols>4</cols>
      <layout>grid</layout>
      <dataRef>
        <id>state</id>
        <logic>
          <behavior>visible</behavior>
        </logic>
        <layout>
          <x>0</x>
          <y>0</y>
          <rows>1</rows>
          <cols>4</cols>
          <template>material</template>
          <appearance>outline</appearance>
        </layout>
      </dataRef>
      <dataRef>
        <id>answer</id>
        <logic>
          <behavior>hidden</behavior>
        </logic>
        <layout>
          <x>0</x>
          <y>1</y>
          <rows>2</rows>
          <cols>4</cols>
          <template>material</template>
          <appearance>outline</appearance>
        </layout>
      </dataRef>
      <dataRef>
        <id>reference_to_request_form</id>
        <logic>
          <behavior>visible</behavior>
        </logic>
        <layout>
          <x>0</x>
          <y>3</y>
          <rows>1</rows>
          <cols>4</cols>
          <template>material</template>
          <appearance>outline</appearance>
        </layout>
      </dataRef>
    </dataGroup>
  </transition>
  <place>
    <id>p1</id>
    <x>48</x>
    <y>272</y>
    <label>Start</label>
    <tokens>1</tokens>
    <static>false</static>
  </place>
  <place>
    <id>p2</id>
    <x>304</x>
    <y>272</y>
    <label>Submitted</label>
    <tokens>0</tokens>
    <static>false</static>
  </place>
  <place>
    <id>p3</id>
    <x>560</x>
    <y>272</y>
    <label>Registered</label>
    <tokens>0</tokens>
    <static>false</static>
  </place>
  <place>
    <id>p4</id>
    <x>784</x>
    <y>176</y>
    <label>Waiting for legal</label>
    <tokens>0</tokens>
    <static>false</static>
  </place>
  <place>
    <id>p5</id>
    <x>1008</x>
    <y>272</y>
    <label>Waiting for answer</label>
    <tokens>0</tokens>
    <static>false</static>
  </place>
  <place>
    <id>p6</id>
    <x>1264</x>
    <y>272</y>
    <tokens>0</tokens>
    <static>false</static>
  </place>
  <place>
    <id>p7</id>
    <x>304</x>
    <y>400</y>
    <label>Submitted</label>
    <tokens>0</tokens>
    <static>false</static>
  </place>
  <arc>
    <id>a1</id>
    <type>regular</type>
    <sourceId>p1</sourceId>
    <destinationId>t2</destinationId>
    <multiplicity>1</multiplicity>
  </arc>
  <arc>
    <id>a10</id>
    <type>regular</type>
    <sourceId>t6</sourceId>
    <destinationId>p6</destinationId>
    <multiplicity>1</multiplicity>
  </arc>
  <arc>
    <id>a11</id>
    <type>regular</type>
    <sourceId>p3</sourceId>
    <destinationId>t7</destinationId>
    <multiplicity>1</multiplicity>
  </arc>
  <arc>
    <id>a12</id>
    <type>regular</type>
    <sourceId>t7</sourceId>
    <destinationId>p5</destinationId>
    <multiplicity>1</multiplicity>
  </arc>
  <arc>
    <id>a13</id>
    <type>regular</type>
    <sourceId>t2</sourceId>
    <destinationId>p7</destinationId>
    <multiplicity>1</multiplicity>
  </arc>
  <arc>
    <id>a14</id>
    <type>read</type>
    <sourceId>p7</sourceId>
    <destinationId>t8</destinationId>
    <multiplicity>1</multiplicity>
  </arc>
  <arc>
    <id>a2</id>
    <type>regular</type>
    <sourceId>t2</sourceId>
    <destinationId>p2</destinationId>
    <multiplicity>1</multiplicity>
  </arc>
  <arc>
    <id>a3</id>
    <type>regular</type>
    <sourceId>p2</sourceId>
    <destinationId>t3</destinationId>
    <multiplicity>1</multiplicity>
  </arc>
  <arc>
    <id>a4</id>
    <type>regular</type>
    <sourceId>t3</sourceId>
    <destinationId>p3</destinationId>
    <multiplicity>1</multiplicity>
  </arc>
  <arc>
    <id>a5</id>
    <type>regular</type>
    <sourceId>p3</sourceId>
    <destinationId>t4</destinationId>
    <multiplicity>1</multiplicity>
  </arc>
  <arc>
    <id>a6</id>
    <type>regular</type>
    <sourceId>t4</sourceId>
    <destinationId>p4</destinationId>
    <multiplicity>1</multiplicity>
  </arc>
  <arc>
    <id>a7</id>
    <type>regular</type>
    <sourceId>p4</sourceId>
    <destinationId>t5</destinationId>
    <multiplicity>1</multiplicity>
  </arc>
  <arc>
    <id>a8</id>
    <type>regular</type>
    <sourceId>t5</sourceId>
    <destinationId>p5</destinationId>
    <multiplicity>1</multiplicity>
  </arc>
  <arc>
    <id>a9</id>
    <type>regular</type>
    <sourceId>p5</sourceId>
    <destinationId>t6</destinationId>
    <multiplicity>1</multiplicity>
  </arc>
</document>
```
</details>

> 💡 **Tip:** PetriNet elements make processes visual, logical, and testable - ideal for low-code automation in Netgrif Builder.

<!-- tabs:end -->

---

## ✅ Summary

You’ve created your **first workflow process** - evolving the Request Form into a **multi-step application** with real process logic and user roles.  
This sets the foundation for **object-centric applications** built with **Petriflow** and deployed through **eTask**.