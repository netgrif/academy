# Petriflow Application Generation Guide

> **Purpose:** This document instructs an LLM to generate complete, valid Petriflow XML applications ready to import into the [Netgrif App Builder](https://builder.netgrif.cloud/modeler).
>
> **Schema reference:** https://petriflow.com/petriflow.schema.xsd
>
> <a href="petriflow_generation.md" download>Download Markdown File</a>

---

## Table of Contents

0. [How to Use This Guide as a Prompt](#0-how-to-use-this-guide-as-a-prompt)
   - Recommended prompting workflow (Steps 1–5)
   - What the LLM should do — clarifying questions before generating
1. [How to Use This Guide](#1-how-to-use-this-guide)
   - Process type taxonomy (Types 1–6: internal, eForm, automation, mixed, hybrid eForm+automation, full hybrid)
   - Net design methodology — 5 questions + token-trace before writing XML
2. [XML Document Structure](#2-xml-document-structure)
   - Metadata field reference (`id`, `version`, `initials`, `defaultRole`, `anonymousRole`, `transitionRole`)
3. [Element Reference](#3-element-reference)
   - 3.1 Roles
   - 3.2 Data Fields — all field tags (`value`, `desc`, `placeholder`, `init`, `component`), types, components, validations
   - 3.3 Field Behaviors (`editable`, `visible`, `required`, `optional`, `hidden`, `forbidden`)
   - 3.4 Transitions & Role Permissions (`perform`, `cancel`, `delegate`, `priority`)
   - 3.5 Form Layout — single/multi-column, one `dataGroup` per transition, `divider` for section breaks
   - 3.6 Places & Arcs — all arc types, variable arc XOR fork recipe, canvas coordinate formula
   - 3.7 Material Icons
4. [Events & Actions (Groovy)](#4-events--actions-groovy)
   - 4.1 Event Types, Scopes & Phases
   - 4.2 Action Structure — import completeness rules (all field + transition references)
   - 4.3 `change` vs `setData` — always use `setData(task, [...])` with `findTask`; includes type string reference table
   - 4.4 ActionDelegate DSL Reference — `make` with `when` closure rules, `optional`, `transitions` keyword warning
   - 4.5 Available Services & Variables
   - 4.6 Common Action Patterns — pre/post phase, auto-trigger, dynamic roles, status updates
5. [Workflow Patterns](#5-workflow-patterns)
   - Patterns 1–12: linear, approval, parallel, XOR, OR, loop, escalation, voting, four-eyes, conditional routing
   - Pattern 13: Variable arcs (conditional XOR fork)
   - Pattern 14: Systematic tasks (code-driven routing)
   - Pattern 15: `taskRef` field (embedded form panel)
   - Pattern 16: Persistent Detail view with `read` arc
   - Pattern 17: Combining all branching patterns (decision guide)
6. [Inter-Process Communication](#6-inter-process-communication)
7. [Rules & Gotchas](#7-rules--gotchas)
8. [Generation Checklist](#8-generation-checklist)
9. [Output & Testing Instructions](#9-output--testing-instructions)

---

## 0. How to Use This Guide as a Prompt

This document is designed to be pasted directly into any LLM chat (ChatGPT, Claude, Gemini, or similar) as a system prompt or first message. Once loaded, the LLM becomes a Petriflow app generator that follows the rules in this guide.

### Recommended prompting workflow

**Step 1 — Load the guide.**
Paste the full contents of this `.md` file into your LLM conversation. You can do this as a system prompt (if your tool supports it) or simply as the first user message. Tell the model:

> *"The following is a Petriflow app generation guide. You are a Petriflow XML generator. Follow all instructions in this guide exactly when I ask you to build an app."*

**Step 2 — Describe your app in plain language.**
After loading the guide, send a second message describing what you want to build. You do not need to be technical — describe it the way you would explain it to a colleague:

> *"I want a vacation request app. Employees submit a request with dates and reason. Their manager approves or rejects it. If approved, HR is notified automatically."*

**Step 3 — Answer the LLM's clarifying questions.**
A well-prompted LLM following this guide will **not** immediately generate XML. Instead it will ask a short set of targeted questions to fill in the details it needs to produce the best possible output. Typical questions cover:

| Topic | Example question |
|-------|-----------------|
| Roles | "Who are the actors? Just employees and managers, or also HR, finance, legal?" |
| Data fields | "What information does the employee fill in — just dates and reason, or also cost estimates, attachments?" |
| Branching | "Can a manager send a request back for revision, or is rejection final?" |
| Visibility | "Should the employee be able to track their request status after submitting?" |
| Access model | "Is this internal only (employees must be logged in), or can anyone submit from a public link?" |
| Notifications | "Should anyone receive an email when the request is submitted, approved, or rejected?" |
| Edge cases | "What happens if the manager is unavailable — can a deputy approve?" |

Answer these questions as completely as you can. Partial answers are fine — the LLM will make reasonable assumptions for anything left unspecified.

**Step 4 — Receive and test the XML.**
After you answer the questions, the LLM will generate a complete, valid Petriflow XML file. Download it and follow the testing instructions in §9.

**Step 5 — Iterate.**
If something needs changing, describe it in plain language:
> *"Add a Finance review step between Manager approval and the final notification."*
> *"The rejection path should let the employee revise and resubmit instead of ending the process."*

The LLM will update the XML accordingly.

---

### What the LLM should do (instructions for the model)

When this guide is loaded and a user describes an app, follow this exact sequence:

```
Step 1 — Read the request carefully. Identify what is already clear and what is ambiguous.
Step 2 — Ask clarifying questions (see list above). Cover roles, data, branching, access, notifications.
         Do NOT generate XML yet. Ask all questions in one message, not one at a time.
Step 3 — Wait for the user's answers.
Step 4 — Design the net mentally: answer §1 Step 2's five design questions, sketch the token flow,
         choose branching patterns, verify no deadlocks (especially XOR reconvergence — see Pattern 5).
Step 5 — Generate the complete XML following §2–§7.
Step 6 — Run through the §8 checklist before outputting.
Step 7 — Output the file and testing instructions (§9).
```

> **Do NOT skip Step 2.** The quality of the generated app depends entirely on having clear answers about roles, branching, and data before writing XML. One round of questions produces a far better result than generating immediately and iterating on broken output.

---

## 1. How to Use This Guide

Users will request things like "Create a vacation request process" or "Build an expense approval workflow."

**How to respond:**
1. Read the request and identify what is clear and what is missing.
2. Ask all clarifying questions in **one message** — see §0 for the standard question list. Do not generate XML yet.
3. After receiving answers, design the net (§1 Step 2), then generate a complete, valid XML file.
4. Provide the file for download with testing instructions (see §9).

**Do NOT:** generate XML before asking clarifying questions, explain every section of this guide, show partial code, or ask follow-up questions one at a time — collect everything in one round.

**Generation workflow:**
```
Step 1 — Understand      Parse: workflow type, roles, data fields, steps
Step 1b — Clarify        Ask all open questions in one message — do not generate yet
Step 1c — Classify       Identify which process type(s) apply — see taxonomy below
Step 2 — Design flow     Answer the five design questions before writing XML
Step 3 — Generate XML    Order: metadata → roles → data → transitions → places → arcs → caseEvents
Step 4 — Validate        Run through the checklist in §8 before outputting
Step 5 — Output          Deliver complete file + testing instructions
```

---

### Process Type Taxonomy

Every Petriflow process falls into one or more of these categories. Identify the type(s) before designing the net — each has a distinct metadata configuration, role setup, and structural pattern.

---

#### Type 1 — Internal process (authenticated users only)

All participants are logged-in users with assigned roles. No public access.

**Use for:** HR requests, expense approvals, IT tickets, internal document reviews.

```xml
<defaultRole>true</defaultRole>    <!-- all logged-in users see tasks assigned to 'default' -->
<anonymousRole>false</anonymousRole>
<transitionRole>false</transitionRole>
```

- Tasks use role IDs from declared `<role>` elements or `default` for general visibility.
- No `anonymous` roleRef anywhere.
- Typical structure: submitter role → approver role → final role, linear or with branching.

---

#### Type 2 — eForm process (anonymous / public submission)

The entry point is accessible without login. Typically the submitter fills a public form and the back-office handles the rest internally.

**Use for:** Contact forms, public requests, citizen submissions, registration forms, feedback.

```xml
<defaultRole>true</defaultRole>
<anonymousRole>true</anonymousRole>   <!-- required for anonymous task access -->
<transitionRole>false</transitionRole>
```

- The public submission task uses `<roleRef><id>anonymous</id>` (and optionally also `default`).
- All back-office tasks use specific role IDs — anonymous users cannot access them.
- The Detail/status view should also allow `anonymous` so the submitter can track their request.
- After submission, the process transitions fully to authenticated roles.

```xml
<!-- Public submission task -->
<transition>
   <id>submit_request</id>
   <roleRef><id>anonymous</id><logic><perform>true</perform></logic></roleRef>
   <roleRef><id>default</id><logic><perform>true</perform></logic></roleRef>
   ...
</transition>

        <!-- Status view — accessible to submitter after submission -->
<transition>
<id>status_view</id>
<roleRef><id>anonymous</id><logic><perform>true</perform></logic></roleRef>
<roleRef><id>default</id><logic><perform>true</perform></logic></roleRef>
...
</transition>

        <!-- Back-office task — authenticated roles only -->
<transition>
<id>registration_triage</id>
<roleRef><id>registration_employee</id><logic><perform>true</perform></logic></roleRef>
...
</transition>
```

---

#### Type 3 — Workflow automation (fully system-driven, no human tasks)

All transitions are assigned to the `system` role and fired programmatically. No human ever opens a task. Used for data processing pipelines, integrations, scheduled jobs, or automatic routing triggered by another process.

**Use for:** Auto-routing after case creation, data enrichment, external API calls, batch processing, notification pipelines.

```xml
<defaultRole>false</defaultRole>
<anonymousRole>false</anonymousRole>
<transitionRole>false</transitionRole>
```

- Declare a `system` role.
- All transitions: `<roleRef><id>system</id>...`  — no dataGroups needed.
- The entire process runs via `caseEvents create post` → `async.run { assignTask; finishTask }` chains.
- No places need tokens other than the start place; systematic tasks consume and produce tokens automatically.

```xml
<role><id>system</id><title>System</title></role>

        <!-- Every transition is a system task -->
<transition>
<id>fetch_customer_data</id>
<x>304</x><y>208</y>
<label>Fetch Customer Data</label>
<priority>1</priority>
<roleRef><id>system</id><logic><perform>true</perform></logic></roleRef>
<!-- no dataGroup -->
<event type="finish">
   <id>on_fetch_finish</id>
   <actions phase="post">
      <action id="1"><![CDATA[
        // call external API, store result, fire next system task
        async.run {
          assignTask("validate_data")
          finishTask("validate_data")
        }
      ]]></action>
   </actions>
</event>
</transition>

        <!-- Bootstrapped from case create -->
<caseEvents>
<event type="create">
   <id>on_create</id>
   <actions phase="post">
      <action id="2"><![CDATA[
        async.run {
          assignTask("fetch_customer_data")
          finishTask("fetch_customer_data")
        }
      ]]></action>
   </actions>
</event>
</caseEvents>
```

---

#### Type 4 — Mixed process (human + system steps in sequence)

The most common real-world pattern. Human tasks and system tasks alternate. System tasks handle routing, data enrichment, notifications; human tasks handle decisions and data entry.

**Use for:** Request handling with automatic routing, multi-department workflows with automated notifications, approval flows with system pre-checks.

```xml
<defaultRole>true</defaultRole>
<anonymousRole>true/false</anonymousRole>   <!-- true if public entry point exists -->
<transitionRole>false</transitionRole>
```

Roles needed: human roles + `system` role.

Key structural rules for mixed processes:
- System tasks never have a `<dataGroup>`.
- System tasks appear between human tasks to move the token and trigger side effects.
- Human tasks have explicit `<roleRef>` with a named role.
- `async.run` is always used when a human task's finish action fires a system task.
- Status/tracking fields updated in `pre` phase of human tasks.
- Email/routing fired in `post` phase.

**Typical pattern — human → system router → human:**
```
[start:1]
  → [t1: Submit, user role]           ← human fills form
      → [p1:0]
          → [t2: Registration, reg role]  ← human decides routing
              → [p2:0]
                  ├─regular──→ [t3: To Legal, system role]  ← no form, fires automatically
                  │                → [p3:0] → [t4: Legal Review, lawyer role]
                  └─regular──→ [t5: To PR, system role]     ← no form, fires automatically
                                   → [p4:0] → [t6: PR Response, pr role]
```

The registration task's finish post action calls `async.run { assignTask("t3") / finishTask("t3") }` or `t5` depending on the decision, making the routing invisible to users while the correct human task becomes available.

---

#### Type 5 — Hybrid eForm + automation

Public submission followed by fully automated back-office processing — no human in the loop after submission. The submitter fills a public form; everything after is handled by system tasks.

**Use for:** Auto-acknowledgement systems, automated classification/routing, integrations where submission triggers an automated pipeline.

```xml
<defaultRole>true</defaultRole>
<anonymousRole>true</anonymousRole>
<transitionRole>false</transitionRole>
```

Structure: public task (anonymous role) → system tasks (system role) chain, with a Detail view task (anonymous + default role, read arc) for the submitter to track progress.

---

#### Type 6 — Full hybrid (anonymous + authenticated users + system)

The most complete process type. An anonymous user submits publicly, authenticated users handle the back-office, system tasks perform automated routing and side effects, and the anonymous submitter retains a persistent status view throughout. All three actor types participate in the same case.

**Use for:** Complex public request handling, multi-department case management with automated routing and notifications, citizen-facing services with internal workflows.

```xml
<defaultRole>true</defaultRole>
<anonymousRole>true</anonymousRole>
<transitionRole>false</transitionRole>
```

Roles needed: `anonymous` (built-in), `default` (built-in), named human roles per department/function, `system`.

**Structural rules specific to Type 6:**

- The public submission task has `anonymous` + `default` roleRefs.
- The Detail/status view task has `anonymous` + `default` roleRefs with a `read` arc — always accessible to the submitter.
- Back-office tasks have named role roleRefs only — anonymous users cannot access them.
- System tasks (`system` role, no dataGroup) are fired from human task finish actions via `async.run`.
- Status fields updated in `pre` phase of human tasks so the anonymous submitter's Detail view is always current.
- Confirmation email sent to submitter (`email.value`) in `post` phase of the submission task.

**Token flow sketch:**
```
[start:1]
  → [t_submit: anonymous+default]    public form
      ├── regular → [p_main:0] → [t_register: reg_employee]   back-office human
      │                              finish post: async fires t_route_to_X (system)
      │                → [p_after_reg:0]
      │                    ├─regular→ [t_to_legal: system] → [p_legal:0] → [t_legal: lawyer]
      │                    └─regular→ [t_to_pr: system]   → [p_pr:0]   → [t_pr: pr_employee]
      │
      └── regular → [p_detail:0] ──read──→ [t_detail: anonymous+default]   always-on view
```

This is the pattern demonstrated in the request-handling example throughout this guide (§5 Patterns 13–17).

---

#### Quick-pick — metadata by process type

| Process type | `defaultRole` | `anonymousRole` | Roles needed |
|---|---|---|---|
| Type 1 — Internal only | `true` | `false` | Named department/function roles |
| Type 2 — eForm (public entry) | `true` | `true` | `anonymous` (built-in) + named back-office roles |
| Type 3 — Full automation | `false` | `false` | `system` only |
| Type 4 — Mixed human + system | `true` | `false` | Named roles + `system` |
| Type 5 — Hybrid eForm + automation | `true` | `true` | `anonymous` (built-in) + `system` |
| Type 6 — Full hybrid (all three) | `true` | `true` | `anonymous` (built-in) + named roles + `system` |

> `anonymous` and `default` are **built-in roles** — do not declare them as `<role>` elements. Just reference them in `<roleRef><id>anonymous</id>` or `<roleRef><id>default</id>`.

---

### Step 2 — How to design the net (answer these before writing XML)

Bad net design is the primary cause of broken apps. Answer these five questions first; they fully determine your places, transitions, arcs, and branching pattern.

**Q1 — What are the human steps in sequence?**
List every task a human performs, in order. Each becomes a transition. Between each pair of consecutive tasks, there is exactly one place.

```
submit → [p1] → register → [p2] → [branch] → legal → [p3] → pr_response → [p4]
                                └──────────────────────────→ pr_response → [p4]
```

**Q2 — Is there any optional step or decision point?**
If yes → you need a **fork**. Choose the right pattern:

| Situation | Pattern | Mechanism |
|---|---|---|
| User picks one of N paths at a task | Variable arcs | `number` fields + `type="regular"` arcs with `<reference>` |
| Decision needs Groovy logic (ranges, lookups) | Systematic tasks | `system` role transitions + `async.run { assignTask; finishTask }` |
| Multiple paths run in parallel and all must finish | AND-split/join | Split transition produces multiple tokens; join place waits for all |
| User selects multiple departments simultaneously | OR-split via multichoice + variable arcs | Boolean per branch set from `multichoice.value` |

Never model a conditional fork with two regular arcs from the same place.

**Q3 — Does the submitter/observer need a persistent view?**
If yes → add a **Detail task** with a `read` arc from a place fed by the submit transition. Set `priority` higher (e.g. `2`) so it appears below the main task in the task list. Fields in the Detail task start `hidden` and are progressively revealed via `make` as the process advances.

**Q4 — Does any task need shared context from a previous form?**
If yes → add a **`taskRef` field** pointing to a system-role Form transition. Embed it as `visible` in every task that needs context. The Form transition sits on a separate place fed at case start (via `caseEvents create post` + `async.run { assignTask; finishTask }`).

**Q5 — How many tokens are in the net at any point?**
Trace the token through your design:
- Start place: 1 token
- After submit: token moves to `p1`
- At a fork: token consumed by the router; **exactly one** of the outgoing paths gets a new token (XOR) or multiple paths get tokens (OR/AND)
- At a join: token arrives from one or more branches and enables the next task
- End place: 1 token, no outgoing arcs

If you trace the path and ever end up with 0 tokens (stuck) or 2+ tokens (race condition), the design is wrong. Fix it before generating XML.

**Design output — sketch before coding:**
```
Roles:    [list all roles]
Fields:   [list all data fields and their types]
Net:
  [start:1] → [t1:submit] → [p1:0] → [t2:register] → [p2:0]
    ├─var:go_legal──→ [t3:to_legal,sys] → [p3:0] → [t4:legal] → [p4:0] ─┐
    └─var:go_pr─────────────────────────────────────────────────────────→ [t5:pr] → [p5:0]
  [p_detail:0] ←regular── t1; p_detail ──read──→ [t8:detail]
Events:
  t1 finish pre:  update status
  t1 finish post: sendEmail confirmation; set go_legal/go_pr
  t4 finish post: sendEmail legal notification
  t5 finish post: sendEmail final response
```

Only after this sketch is complete and token-traced should you start writing XML.

---

## 2. XML Document Structure

Every Petriflow app follows this top-level structure. Element order is **strict** — the document will fail validation if sections are out of order.

```xml
<document xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:noNamespaceSchemaLocation="https://petriflow.com/petriflow.schema.xsd">

   <!-- 1. METADATA -->
   <id>process_id</id>
   <version>1.0.0</version>
   <initials>ABC</initials>
   <title>Process Title</title>
   <icon>icon_name</icon>
   <defaultRole>true</defaultRole>
   <anonymousRole>false</anonymousRole>
   <transitionRole>false</transitionRole>
```

#### Metadata field reference

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique process identifier — lowercase with underscores. Used in `createCase`, `findCase`, inter-process calls. |
| `version` | string | Semver string, e.g. `1.0.0`. Informational only; increment when re-importing a modified process. |
| `initials` | string | 2–4 uppercase letters shown as the process avatar in the task list (e.g. `REQ`, `HR`, `INV`). |
| `title` | string | Human-readable process name shown in the UI. |
| `icon` | string | Material icon name shown alongside the process (see §3.7). |
| `defaultRole` | boolean | When `true`, every authenticated user automatically has the `default` role. Use `default` in `<roleRef>` to make a task visible to all logged-in users. Set to `false` only when all access must be explicitly role-controlled. |
| `anonymousRole` | boolean | When `true`, unauthenticated (anonymous) users get the `anonymous` role. Required for any public-facing submission form. Use `anonymous` in `<roleRef>` to make a task accessible without login. |
| `transitionRole` | boolean | When `true`, the system automatically creates a role for each transition and assigns it to users who perform that transition. Rarely needed — leave `false` unless building a task-ownership model. |

**Common metadata configurations:**

```xml
<!-- Public process — anonymous submission + role-controlled back-office -->
<defaultRole>true</defaultRole>
<anonymousRole>true</anonymousRole>
<transitionRole>false</transitionRole>

        <!-- Internal process — all authenticated users can see everything -->
<defaultRole>true</defaultRole>
<anonymousRole>false</anonymousRole>
<transitionRole>false</transitionRole>

        <!-- Strict role-only process — no implicit access -->
<defaultRole>false</defaultRole>
<anonymousRole>false</anonymousRole>
<transitionRole>false</transitionRole>
```

  <!-- 2. ROLES -->
  <role>
    <id>role_id</id>
    <title>Role Display Name</title>
  </role>

  <!-- 3. DATA FIELDS -->
  <data type="text">
    <id>field_id</id>
    <title>Field Label</title>
    <placeholder>Hint text</placeholder>
  </data>

  <!-- 4. TRANSITIONS (Tasks) -->
  <transition>
    <id>transition_id</id>
    <x>208</x>
    <y>112</y>
    <label>Task Name</label>
    <icon>send</icon>
    <priority>1</priority>
    <roleRef>
      <id>role_id</id>
      <logic><perform>true</perform></logic>
    </roleRef>
    <dataGroup>
      <id>group_id</id>
      <cols>2</cols>
      <layout>grid</layout>
      <title>Form Section</title>
      <dataRef>
        <id>field_id</id>
        <logic>
          <behavior>editable</behavior>
          <behavior>required</behavior>
        </logic>
        <layout>
          <x>0</x>
          <y>0</y>
          <rows>1</rows>
          <cols>1</cols>
          <template>material</template>
          <appearance>outline</appearance>
        </layout>
      </dataRef>
    </dataGroup>
  </transition>

  <!-- 5. PLACES (States) -->
  <place>
    <id>place_id</id>
    <x>112</x>
    <y>112</y>
    <label>State Name</label>
    <tokens>1</tokens>  <!-- 1 for start place only; 0 for all others -->
    <static>false</static>
  </place>

  <!-- 6. ARCS (Connections) -->
  <arc>
    <id>arc_id</id>
    <type>regular</type>
    <sourceId>place_or_transition_id</sourceId>
    <destinationId>transition_or_place_id</destinationId>
    <multiplicity>1</multiplicity>
  </arc>

  <!-- 7. CASE EVENTS — MUST be last -->
  <caseEvents>
    <event type="create">
      <id>on_create</id>
      <actions phase="post">
        <action id="1"><![CDATA[
          status: f.status;
          change status value { "New" }
        ]]></action>
      </actions>
    </event>
  </caseEvents>

</document>
```

---

## 3. Element Reference

### 3.1 Roles

All roles use the `<role>` tag. `<processRole>` does not exist.

```xml
<role>
   <id>manager</id>
   <title>Manager</title>
</role>
```

Use lowercase with underscores for IDs. Be descriptive: `registration_desk_employee`, not `role1`.

---

### 3.2 Data Fields — Types, Components & Validations

#### Field types

| Type | Description | Available components |
|------|-------------|----------------------|
| `text` | Text input | `textarea`, `richtextarea`, `currency` (for number display) |
| `number` | Numeric input | `currency` |
| `date` | Date picker | — |
| `dateTime` | Date and time | — |
| `boolean` | Checkbox | — |
| `enumeration` | Single-choice — flat list | `select` (default dropdown), `list` (vertical radio), `stepper`, `autocomplete`, `dynamic_autocomplete`, `icon` |
| `enumeration_map` | Single-choice — key/value pairs | `select` (default), `list`, `stepper`, `autocomplete`, `dynamic_autocomplete`, `icon` |
| `multichoice` | Multi-choice — flat list | `select` (default chips), `list` (vertical checkboxes) |
| `multichoice_map` | Multi-choice — key/value pairs | `select` (default), `list`, `autocomplete` |
| `file` | Single file upload | `preview` |
| `fileList` | Multiple file upload | — |
| `user` | User selector | — |
| `userList` | Multiple user selector | — |
| `taskRef` | Holds a list of task string IDs — renders each as an embedded form panel inline | — (use `<init>transition_id</init>` for a static single task from the same process, or set `.value` dynamically via action to a `List<String>` of task IDs) |
| `caseRef` | Holds a list of case string IDs — renders a linked case panel; used to track child/related cases across processes | — (set `.value` dynamically; use `allowedNets` to restrict which processes can be linked) |
| `i18n` | Internationalised text label — rendered as static display text; use with `divider` component for visual section breaks in forms | `divider` |

> ⚠️ `textarea`, `list`, `select` etc. are **component names**, not types. Always declare the correct `type="..."` and set the component separately with `<component><name>name</name></component>`.

#### Component reference by field type

**`enumeration` and `enumeration_map` components:**

| Component | Renders as | When to use |
|-----------|-----------|-------------|
| *(none / `select`)* | Dropdown | Default; good for 4+ options in limited space |
| `list` | Vertical radio buttons | 2–5 options; always visible; faster to scan |
| `stepper` | Step-through selector (prev/next buttons) | Ordered sequences, wizards, numbered steps |
| `autocomplete` | Searchable text input filtering options | Many options (10+); user knows what they're looking for |
| `dynamic_autocomplete` | Autocomplete backed by a dynamic data source | Options loaded at runtime from an external service |
| `icon` | Icon-based selection (each option displays a Material icon) | When options map to icons/visual symbols; requires `enumeration_map` with icon name as display value |

**`icon` component XML example** — requires `enumeration_map`; the option display value must be a valid Material icon name:

```xml
<data type="enumeration_map">
   <id>priority_icon</id>
   <title>Priority</title>
   <options>
      <option key="low">arrow_downward</option>
      <option key="medium">remove</option>
      <option key="high">arrow_upward</option>
      <option key="urgent">priority_high</option>
   </options>
   <init>medium</init>
   <component>
      <n>icon</n>
   </component>
</data>
```

The stored value is the key (e.g. `"high"`); the UI renders the Material icon named by the display value (e.g. `arrow_upward`).

**`multichoice` and `multichoice_map` components:**

| Component | Renders as | When to use |
|-----------|-----------|-------------|
| *(none / `select`)* | Chip/tag multi-select dropdown | Default; compact |
| `list` | Vertical checkboxes | 2–6 options; always visible |
| `autocomplete` | Searchable multi-select (`multichoice_map` only) | Many options, user searches by name |

#### Choosing between selection types

- **`enumeration`** — one value from a plain list; stored value equals the option key. Use when keys and display values are identical.
- **`enumeration_map`** — one item from a key/display-value list; stored value is the key. Use when key differs from the label (e.g. key `"iban"`, label `"IBAN Bank Transfer"`). Required for `autocomplete`, `dynamic_autocomplete`, `icon` components.
- **`multichoice`** — multiple values from a plain list; stored as a set of selected keys.
- **`multichoice_map`** — multiple items from a key/display-value list; stored as a set of keys. Use with `autocomplete` component.

#### Field type quick-pick

| Use case | Type | Component |
|----------|------|-----------|
| Short text | `text` | — |
| Long text | `text` | `textarea` |
| Rich text | `text` | `richtextarea` |
| Number / quantity | `number` | — |
| Money | `number` | `currency` |
| Yes/No | `boolean` | — |
| Single choice, dropdown (default) | `enumeration` or `enumeration_map` | — |
| Single choice, always-visible radio list | `enumeration` or `enumeration_map` | `list` |
| Single choice, step-through | `enumeration_map` | `stepper` |
| Single choice, searchable (many options) | `enumeration_map` | `autocomplete` |
| Single choice, dynamic data source | `enumeration_map` | `dynamic_autocomplete` |
| Single choice, icon-based | `enumeration_map` | `icon` |
| Multiple choices, chip dropdown (default) | `multichoice` or `multichoice_map` | — |
| Multiple choices, always-visible checkboxes | `multichoice` or `multichoice_map` | `list` |
| Multiple choices, searchable | `multichoice_map` | `autocomplete` |
| Date only | `date` | — |
| Date and time | `dateTime` | — |
| One user | `user` | — |
| Multiple users | `userList` | — |
| Single file | `file` | `preview` |
| Multiple files | `fileList` | — |
| Embed another task's form | `taskRef` | — (set `<init>transition_id</init>`) |

#### Field examples

All data field tags and their purpose:

| Tag | Required | Description |
|-----|----------|-------------|
| `<id>` | ✅ | Unique identifier, lowercase_underscore |
| `<title>` | ✅ | Label shown above the field in the form |
| `<placeholder>` | — | Greyed hint text shown inside the input when empty |
| `<desc>` | — | Helper text shown below the field — use for instructions or context |
| `<value>` | — | The field's runtime value holder — contains the current value of the field as it exists in a live case. When set in the XML definition, it acts as a pre-filled default. For `text`, `number`, and `boolean` fields this is the primary way to set a default. |
| `<init>` | — | Initial value set when the field is first created. Valid for all field types. For `enumeration`/`enumeration_map` fields, holds the default selected key. For `multichoice` fields, wrap multiple `<init>` entries in `<inits>`. For `number` routing fields used as variable arc references, use `<init>0</init>` to ensure the arc starts blocked. For `taskRef`, holds the embedded transition ID. |
| `<inits>` | multichoice | Wraps multiple `<init>` default keys for multichoice fields |
| `<component>` | — | Visual component override (e.g. `textarea`, `list`, `preview`, `currency`) |
| `<validations>` | — | One or more validation rules |
| `<options>` | enumeration/multichoice only | The selectable options |

```xml
<!-- text with placeholder and default value -->
<data type="text">
   <id>request_status</id>
   <title>Status</title>
   <placeholder>Current status of the request</placeholder>
   <desc>Updated automatically as the request moves through the process.</desc>
   <value>New</value>
</data>

        <!-- number with default value -->
<data type="number">
<id>priority_level</id>
<title>Priority Level</title>
<value>1</value>
</data>

        <!-- boolean with default value true -->
<data type="boolean">
<id>notify_submitter</id>
<title>Notify Submitter</title>
<value>true</value>
</data>

        <!-- Multiline text — component child element is <name> -->
<data type="text">
<id>request_description</id>
<title>Request Description</title>
<placeholder>Describe your request...</placeholder>
<component>
   <name>textarea</name>
</component>
</data>

        <!-- enumeration: key and display value are the same -->
<data type="enumeration">
<id>cancellation_category</id>
<title>Cancellation Category</title>
<options>
   <option key="STR03">STR03</option>
   <option key="STR08_1">STR08_1</option>
</options>
<init>STR03</init>
</data>

        <!-- enumeration_map: key differs from display label -->
<data type="enumeration_map">
<id>refund_method</id>
<title>Refund Method</title>
<options>
   <option key="iban">IBAN Bank Transfer</option>
   <option key="other">Other</option>
</options>
<init>iban</init>
</data>

        <!-- multichoice with defaults — note: <inits> wraps multiple <init> -->
<data type="multichoice">
<id>preferred_days</id>
<title>Preferred Days</title>
<options>
   <option key="mon">Monday</option>
   <option key="tue">Tuesday</option>
   <option key="wed">Wednesday</option>
</options>
<inits>
   <init>mon</init>
   <init>tue</init>
</inits>
</data>

        <!-- enumeration with list component — renders as vertical radio buttons instead of a dropdown -->
<data type="enumeration">
<id>origin</id>
<title>Origin of the request</title>
<options>
   <option key="Online">Online</option>
   <option key="Call">Call</option>
</options>
<component>
   <name>list</name>
</component>
</data>
```

#### Validations

Wrap `<validation>` inside `<validations>`. Both `<expression>` and `<message>` are required. Do not use CDATA in expressions.

**Validation expression types:**

| Expression prefix | Used for | Example |
|---|---|---|
| `regex` | Text pattern matching | `regex ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$` |
| `inrange` | Numeric range check (inclusive) | `inrange 1000,2999` |

```xml
<!-- Text regex validation -->
<data type="text">
   <id>email</id>
   <title>Email</title>
   <validations>
      <validation>
         <expression>regex ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$</expression>
         <message>Please enter a valid email address</message>
      </validation>
   </validations>
</data>

        <!-- Numeric range validation -->
<data type="number">
<id>customer_id</id>
<title>Customer ID</title>
<validations>
   <validation>
      <expression>inrange 1000,2999</expression>
      <message>Customer ID must be between 1000 and 2999</message>
   </validation>
</validations>
</data>
```

---

### 3.3 Field Behaviors

Set inside `<dataRef><logic>` to control how a field appears in a specific transition's form.

| Behavior | Effect |
|----------|--------|
| `editable` | User can edit |
| `visible` | Read-only — field is shown but not editable |
| `required` | Must be filled before task can be finished |
| `optional` | Removes a `required` constraint — makes a previously required field optional again |
| `hidden` | Field is hidden from the user but **retains its value** — useful for tracking fields that should not be visible in this task but whose data must be preserved |
| `forbidden` | Field is completely inaccessible — not shown and its value **cannot be read or written** in this task context |

**`hidden` vs `forbidden`:** use `hidden` when you want to keep the field's data intact but not show it. Use `forbidden` when the field should be entirely inaccessible in that task — e.g. sensitive data that a particular role must never see even in read-only form.

```xml
<dataRef>
   <id>field_id</id>
   <logic>
      <behavior>editable</behavior>
      <behavior>required</behavior>
   </logic>
</dataRef>
```

---

### 3.4 Transitions & Role Permissions

Every transition must have `id`, `x`, `y`, `label`, `priority`, and at least one `<roleRef>`.

**`<priority>`** controls the display order of tasks in the task list when multiple tasks are simultaneously available in a case. Lower number = shown first (e.g. `1` for the main user-facing task). Secondary tasks like a Detail view use a higher number (e.g. `2`) so they appear below the primary task. All tasks with the same priority are ordered alphabetically.

Inside `<roleRef><logic>`, only `<perform>`, `<cancel>`, and `<delegate>` are valid. `<view>` is **not** valid here.

| Logic flag | Effect |
|---|---|
| `<perform>true</perform>` | Role can assign and complete this task |
| `<cancel>true</cancel>` | Role can cancel/unassign the task after it has been assigned |
| `<delegate>true</delegate>` | Role can reassign the task to another user |

Typically only `perform` is needed. Use `cancel` for supervisors who should be able to pull back a task. Use `delegate` for managers who can reassign work without performing it themselves.

```xml
<!-- Standard: role performs the task -->
<roleRef>
   <id>employee</id>
   <logic><perform>true</perform></logic>
</roleRef>

        <!-- Supervisor can cancel tasks assigned to others -->
<roleRef>
<id>supervisor</id>
<logic>
   <perform>true</perform>
   <cancel>true</cancel>
</logic>
</roleRef>

        <!-- Manager can delegate but not perform -->
<roleRef>
<id>manager</id>
<logic>
   <perform>true</perform>
   <delegate>true</delegate>
</logic>
</roleRef>
```

#### Transition events

Place `<event>` **directly inside** `<transition>`. There is no `<transitionEvents>` wrapper.

Valid transition event types: `assign`, `finish`, `cancel`, `delegate`.

```xml
<transition>
   <id>approve_request</id>
   <event type="assign">...</event>
   <event type="finish">...</event>
   <event type="cancel">...</event>
</transition>
```

---

### 3.5 Form Layout

Fields are placed inside `<dataGroup>`. The grid uses `x` (column) and `y` (row) coordinates within the group.

Set `<cols>` on the group to define grid width. Good practice: keep column count between 1 and 8–10 maximum.

Each `<dataRef><layout>` uses:
- `<x>` — starting column (0-based)
- `<y>` — starting row (0-based)
- `<cols>` — how many columns the field spans
- `<rows>` — how many rows the field spans
- `<template>` and `<appearance>` — optional visual hints; `material` + `outline` is the standard

A field's `x + cols` must never exceed the group's `<cols>`.

**Single-column:**
```xml
<dataGroup>
   <id>form_group</id>
   <cols>1</cols>
   <layout>grid</layout>
   <title>Request Details</title>
   <dataRef>
      <id>employee_name</id>
      <logic><behavior>editable</behavior><behavior>required</behavior></logic>
      <layout><x>0</x><y>0</y><rows>1</rows><cols>1</cols><template>material</template><appearance>outline</appearance></layout>
   </dataRef>
   <dataRef>
      <id>description</id>
      <logic><behavior>editable</behavior></logic>
      <layout><x>0</x><y>1</y><rows>1</rows><cols>1</cols><template>material</template><appearance>outline</appearance></layout>
   </dataRef>
</dataGroup>
```

**Four-column layout with mixed widths:**
```xml
<dataGroup>
   <id>form_group</id>
   <cols>4</cols>
   <layout>grid</layout>
   <!-- row 0: first name (col 0-1), last name (col 2-3) -->
   <dataRef>
      <id>first_name</id>
      <logic><behavior>editable</behavior><behavior>required</behavior></logic>
      <layout><x>0</x><y>0</y><rows>1</rows><cols>2</cols><template>material</template><appearance>outline</appearance></layout>
   </dataRef>
   <dataRef>
      <id>last_name</id>
      <logic><behavior>editable</behavior><behavior>required</behavior></logic>
      <layout><x>2</x><y>0</y><rows>1</rows><cols>2</cols><template>material</template><appearance>outline</appearance></layout>
   </dataRef>
   <!-- row 1: date (1 col), priority (1 col), amount (2 cols) -->
   <dataRef>
      <id>request_date</id>
      <logic><behavior>editable</behavior></logic>
      <layout><x>0</x><y>1</y><rows>1</rows><cols>1</cols><template>material</template><appearance>outline</appearance></layout>
   </dataRef>
   <dataRef>
      <id>priority</id>
      <logic><behavior>editable</behavior></logic>
      <layout><x>1</x><y>1</y><rows>1</rows><cols>1</cols><template>material</template><appearance>outline</appearance></layout>
   </dataRef>
   <dataRef>
      <id>amount</id>
      <logic><behavior>editable</behavior></logic>
      <layout><x>2</x><y>1</y><rows>1</rows><cols>2</cols><template>material</template><appearance>outline</appearance></layout>
   </dataRef>
   <!-- row 2: description spans all 4 columns -->
   <dataRef>
      <id>description</id>
      <logic><behavior>editable</behavior></logic>
      <layout><x>0</x><y>2</y><rows>1</rows><cols>4</cols><template>material</template><appearance>outline</appearance></layout>
   </dataRef>
</dataGroup>
```

#### One `dataGroup` per transition — mandatory rule

> ⚠️ **Always use exactly one `<dataGroup>` per transition.** The Netgrif App Builder only renders the **first** `<dataGroup>` — any additional groups are silently ignored. A process that looks correct in XML will have missing form sections in the builder and in eTask.

To create visual separation between logical sections inside that single group, use a **`i18n` field with the `divider` component**. It renders as a labelled horizontal rule, clearly separating sections without requiring a second group.

> ⚠️ There is no `<divider>` XML element in Petriflow. The correct mechanism is a `<data type="i18n">` field referenced in the dataGroup with `<component><n>divider</n></component>`.

**Step 1 — declare the divider as a data field** (in the `<data>` section, alongside other fields):

```xml
<data type="i18n">
   <id>divider_routing</id>
   <title>Routing Decision</title>
   <init>Routing Decision</init>
</data>
```

**Step 2 — reference it in the dataGroup with the `divider` component:**

```xml
<transition>
   <id>registration_triage</id>
   ...
   <dataGroup>
      <id>triage_group</id>
      <cols>2</cols>
      <layout>grid</layout>
      <title>Registration Triage</title>

      <!-- Section 1: read-only context from the submitter -->
      <dataRef>
         <id>name</id>
         <logic><behavior>visible</behavior></logic>
         <layout><x>0</x><y>0</y><rows>1</rows><cols>1</cols><template>material</template><appearance>outline</appearance></layout>
      </dataRef>
      <dataRef>
         <id>request_description</id>
         <logic><behavior>visible</behavior></logic>
         <layout><x>0</x><y>1</y><rows>3</rows><cols>2</cols><template>material</template><appearance>outline</appearance></layout>
      </dataRef>

      <!-- Divider: i18n field rendered as a labelled horizontal rule -->
      <dataRef>
         <id>divider_routing</id>
         <logic><behavior>editable</behavior></logic>
         <layout><x>0</x><y>4</y><rows>1</rows><cols>2</cols><template>material</template><appearance>outline</appearance></layout>
         <component><n>divider</n></component>
      </dataRef>

      <!-- Section 2: editable decision fields (continue incrementing y after divider) -->
      <dataRef>
         <id>legal_required</id>
         <logic><behavior>editable</behavior><behavior>required</behavior></logic>
         <layout><x>0</x><y>5</y><rows>1</rows><cols>2</cols><template>material</template><appearance>outline</appearance></layout>
      </dataRef>
   </dataGroup>
</transition>
```

**Rules for dividers:**
- Declare the `i18n` field in the `<data>` section like any other field — it must have a unique `<id>`.
- Set `<init>` to the label text you want displayed on the divider line.
- In the `<dataRef>`, the `<component><n>divider</n></component>` goes inside the `<dataRef>` itself (not on the `<data>` definition) — this way the same `i18n` field can be used as a plain label in one task and as a divider in another if needed.
- The divider `<dataRef>` occupies a full row — set its `<y>` to the next available row and make `<cols>` span the full group width.
- All `<dataRef>` elements after the divider must have `<y>` values higher than the divider's row.

#### `<component>` placement — `<data>` definition vs `<dataRef>`

`<component>` can appear in two places, and the choice has different effects:

| Location | Effect | Use when |
|---|---|---|
| Inside `<data>` | The component applies globally — this field always renders with this component on every transition where it appears | The component is intrinsic to the field (e.g. a `textarea` for a description field that is always multiline) |
| Inside `<dataRef>` (overrides the `<data>` component for this task only) | The component applies only on this specific transition | The same field should render differently in different tasks (e.g. a plain label in one task, a `divider` in another) |

In practice: set the component on `<data>` for fields that always use a non-default render (e.g. `textarea`, `currency`, `preview`). Use the `<dataRef>` override only when you need task-specific rendering — the primary use case being the `divider` component on `i18n` fields.

**❌ Wrong — never use multiple dataGroups:**

```xml
<!-- This breaks in the builder — only the first group is shown -->
<transition>
   <id>registration_triage</id>
   <dataGroup><id>group_1</id>...</dataGroup>   <!-- shown -->
   <dataGroup><id>group_2</id>...</dataGroup>   <!-- silently ignored -->
</transition>
```

---

### 3.6 Places & Arcs

Every place needs `id`, `x`, `y`, `tokens`, and `static`. `<label>` is technically optional (places are internal states not shown to users) but strongly recommended for readability in the visual modeller.

```xml
<place>
   <id>start</id>
   <x>112</x><y>112</y>
   <label>Start</label>
   <tokens>1</tokens>   <!-- ONLY the start place gets tokens=1 -->
   <static>false</static>
</place>

<place>
<id>pending_review</id>
<x>304</x><y>112</y>
<label>Pending Review</label>
<tokens>0</tokens>
<static>false</static>
</place>
```

Arcs must strictly alternate: **Place → Transition → Place**. Never connect two places or two transitions directly.

#### Arc types

| Type | Description |
|------|-------------|
| `regular` | Standard token-consuming arc — the default for all normal flow |
| `read` | Non-consuming arc — transition can fire without removing the token; used for persistent/status places that must remain always enabled |
| `reset` | Removes all tokens from the source place when the transition fires |
| `inhibitor` | Transition can only fire when the source place has **zero** tokens |
| `variable` (declared as `regular` + `<reference>`) | The arc multiplicity is determined at runtime by a **`number` data field** value — used for conditional routing. **Only `number` fields are valid as `<reference>` targets. `boolean` fields cause an import error.** |

```xml
<!-- Regular arc — the default -->
<arc>
   <id>arc_start_to_submit</id>
   <type>regular</type>
   <sourceId>start</sourceId>
   <destinationId>submit_request</destinationId>
   <multiplicity>1</multiplicity>
</arc>

        <!-- Read arc — non-consuming; place keeps its token -->
<arc>
<id>arc_status_read</id>
<type>read</type>
<sourceId>status_view_place</sourceId>
<destinationId>status_view</destinationId>
<multiplicity>1</multiplicity>
</arc>

```

> ⚠️ **Variable arc syntax clarification:** There is **no `type="variable"`** in Petriflow XML. Variable arcs are declared as `type="regular"` with `<multiplicity>0</multiplicity>` and a `<reference>` pointing to a `number` data field. The word "variable" describes the runtime behaviour, not the XML type value. See the full recipe in the next section and in Pattern 13.

#### Variable arcs — the correct pattern for conditional (XOR) routing

> ⚠️ **Critical — read before modelling any optional branch or fork.**

When a transition must route to **one of several possible next steps** based on a user decision, use **variable arcs** — regular arcs with a `<reference>` to a `number` data field whose runtime value controls the arc's multiplicity (i.e. how many tokens it places).

**How variable arcs work:**
- Arc type is always `regular` — there is no `type="variable"` in Petriflow.
- Each branching arc has `<multiplicity>0</multiplicity>` as its static XML value — this is a placeholder. At runtime the engine reads the referenced number field's value and uses that as the actual multiplicity.
- A field value of `1` → arc fires and places 1 token. A value of `0` → arc does not fire. Any positive integer is valid as a multiplicity — but use `0` and `1` as the standard for XOR routing.
- The arc goes **directly from the transition** to the destination place — not from an intermediate place.
- Reference fields must be `type="number"`. **`boolean` fields are invalid as arc references — using one causes an import error.**

**Step-by-step recipe:**

1. Declare one `number` data field per possible output path. Use `<init>0</init>` to set the initial value to `0` (arc starts blocked). `<init>` sets the field's starting state; the action at runtime writes the live value via `change`:

```xml
<data type="number">
   <id>toLegal</id>
   <title>To Legal</title>
   <init>0</init>
</data>
<data type="number">
<id>toPR</id>
<title>To PR</title>
<init>0</init>
</data>
```

2. In the routing transition's finish **pre** action, set exactly one field to `1` and all others to `0`:

```xml
<event type="finish">
   <id>on_triage_finish</id>
   <actions phase="pre">
      <action id="3"><![CDATA[
      toLegal: f.toLegal,
      toPR: f.toPR,
      legal_required: f.legal_required;
      if (legal_required.value == "yes") {
        change toLegal value { 1 }
        change toPR    value { 0 }
      } else {
        change toLegal value { 0 }
        change toPR    value { 1 }
      }
    ]]></action>
   </actions>
</event>
```

> ⚠️ Set routing fields in `phase="pre"` — the engine evaluates arc multiplicities when the transition fires, which happens after `pre` actions run. If you set them in `post`, the token has already moved with the old values.

3. Add `type="regular"` arcs **from the transition** to each destination place, with `<multiplicity>0</multiplicity>` and a `<reference>` to the corresponding number field:

```xml
<!-- Fires only when toLegal == 1 -->
<arc>
   <id>arc_triage_to_legal_place</id>
   <type>regular</type>
   <sourceId>registration_triage</sourceId>   <!-- ✅ source is the TRANSITION -->
   <destinationId>after_legal</destinationId>  <!-- ✅ destination is a PLACE -->
   <multiplicity>0</multiplicity>
   <reference>toLegal</reference>
</arc>

        <!-- Fires only when toPR == 1 -->
<arc>
<id>arc_triage_to_pr_place</id>
<type>regular</type>
<sourceId>registration_triage</sourceId>   <!-- ✅ source is the TRANSITION -->
<destinationId>after_pr</destinationId>    <!-- ✅ destination is a PLACE -->
<multiplicity>0</multiplicity>
<reference>toPR</reference>
</arc>
```

When the transition fires, the engine substitutes the field value for each arc's multiplicity. Only the arc whose field equals `1` produces a token; arcs whose field equals `0` produce nothing. This is a clean, safe XOR-split with no stuck states.

> **Never model a conditional fork with two regular arcs (without `<reference>`) from the same place.** That puts both downstream transitions in an enabled state at once — either role can grab it, and one path will be permanently stuck.

> ⚠️ **Critical — variable arc source must always be a Transition, never a Place.**
> Variable arcs (arcs with a `<reference>`) go **from the routing transition to the next destination place** — they are outgoing arcs of a Transition. The Petri net rule that arcs must strictly alternate Place → Transition → Place still applies. If you put a variable arc from a Place to another Place (P→P) you will get an import error like:
> `Error: Could not find nodes <place_id>-><place_id> of arc <arc_id>`
> The typical mistake: placing the routing transition's output in an intermediate place first, then trying to attach variable arcs from that intermediate place to the next transitions. The correct structure is:
> - Routing transition → `p_after_routing` (one regular arc, multiplicity 1)
> - `p_after_routing` → next_transition_A (regular arc, multiplicity 1) **AND**
> - `p_after_routing` → next_transition_B (regular arc, multiplicity 1)
>
> **…is wrong for XOR forks.** The variable arcs must instead go directly from the routing transition:
> - Routing transition → `p_destination_A` (variable arc, reference `toA`)
> - Routing transition → `p_destination_B` (variable arc, reference `toB`)
>
> This means after the routing transition you have **no intermediate place** — the variable arcs jump straight to the destination places, and those places then feed the next transitions via plain regular arcs.

> ⚠️ **Side-effect: variable arc fields show their `init` value in the builder modeller.**
> Because variable arc reference fields start with `<init>0</init>`, the builder's visual modeller will display `(0)` on those arcs when you first import the process — this is normal and expected. The value is overwritten at runtime by the routing action's `phase="pre"` code before the token moves. The `0` label in the modeller does **not** mean the arc is broken; it reflects the field's initial value only.

#### Always-on tasks — persistent access via `read` arc

To keep a transition always accessible regardless of where the token currently is (e.g. a status view the submitter can open at any time), feed a dedicated place from the submit transition with a regular arc, then connect that place to the always-on transition with a **`read` arc**. The `read` arc checks for the token without consuming it — the transition remains permanently enabled as long as that place holds a token.

```xml
<!-- Place fed once by the submit transition -->
<place>
   <id>p_detail</id>
   <x>496</x><y>16</y>
   <label>Detail Always Accessible</label>
   <tokens>0</tokens>
   <static>false</static>
</place>

        <!-- Regular arc: submit produces the detail token (outgoing from submit transition) -->
<arc>
<id>arc_submit_to_detail</id>
<type>regular</type>
<sourceId>submit_request</sourceId>
<destinationId>p_detail</destinationId>
<multiplicity>1</multiplicity>
</arc>

        <!-- Read arc: detail view reads the token but never removes it -->
<arc>
<id>arc_detail_read</id>
<type>read</type>
<sourceId>p_detail</sourceId>
<destinationId>detail_view_task</destinationId>
<multiplicity>1</multiplicity>
</arc>
```

> **There is no `<static>true</static>` tag in Petriflow.** All places use `<static>false</static>`. The "always-on" behaviour comes entirely from the `read` arc — not from any place property.

#### Coordinate system

The builder canvas uses pixel coordinates. Elements that are too close overlap; too far apart and the diagram becomes hard to read. Follow this formula consistently.

**Spacing rules:**
- Horizontal step between consecutive elements: **+192px** (place → transition → place each step)
- Vertical lane separation: **+192px** per lane
- Starting point: `x=112, y=208` for the main lane

**Element sequence formula — main lane:**

| Position | Element | x | y |
|---|---|---|---|
| 0 | Start place | 112 | 208 |
| 1 | First transition | 304 | 208 |
| 2 | Place | 496 | 208 |
| 3 | Second transition | 688 | 208 |
| 4 | Place | 880 | 208 |
| 5 | Third transition | 1072 | 208 |
| 6 | End place | 1264 | 208 |

Formula: for the nth element (0-indexed), `x = 112 + (n × 192)`.

**Branch lanes — offset Y by 192px per lane below the main:**

| Lane | Y value | Use for |
|---|---|---|
| Main (happy path) | 208 | Primary flow — submit, registration, PR |
| Branch below | 400 | Optional step — e.g. Legal review |
| Second branch below | 592 | Second optional branch |
| Detail/status lane above | 16 | Always-on Detail/status view task |

**Worked example — request flow with Legal branch:**

```
y=16:   [p_detail:0]────read────[t8: Detail, x=496, y=16]
                    ↑ fed by t1

y=208:  [start:112]─[t1:304]─[p2:496]─[t2:688]─[p3:880]─────────────────[p5:1264]─[t5:1456]─[p6:1648]
                                                      │                        ↑
y=400:                                            [t3:1072]─[p4:1168]─[t4:1264]
                                                  (To Legal)          (Legal task)
```

XML coordinates for this layout:
```xml
<!-- Main lane places -->
<place><id>start</id>    <x>112</x>  <y>208</y> <tokens>1</tokens></place>
<place><id>p2</id>       <x>496</x>  <y>208</y> <tokens>0</tokens></place>
<place><id>p3</id>       <x>880</x>  <y>208</y> <tokens>0</tokens></place>
<place><id>p5</id>       <x>1264</x> <y>208</y> <tokens>0</tokens></place>
<place><id>p6</id>       <x>1648</x> <y>208</y> <tokens>0</tokens></place>

        <!-- Legal branch places (y=400) -->
<place><id>p4</id>       <x>1168</x> <y>400</y> <tokens>0</tokens></place>

        <!-- Detail lane place (y=16) -->
<place><id>p_detail</id> <x>496</x>  <y>16</y>  <tokens>0</tokens></place>

        <!-- Main lane transitions -->
<transition><id>t1</id>  <x>304</x>  <y>208</y> <label>Submit</label>...</transition>
<transition><id>t2</id>  <x>688</x>  <y>208</y> <label>Registration</label>...</transition>
<transition><id>t5</id>  <x>1456</x> <y>208</y> <label>PR Response</label>...</transition>

        <!-- Legal branch transitions (y=400) -->
<transition><id>t3</id>  <x>1072</x> <y>400</y> <label>To Legal</label>...</transition>
<transition><id>t4</id>  <x>1264</x> <y>400</y> <label>Legal Review</label>...</transition>

        <!-- Detail task (y=16) -->
<transition><id>t8</id>  <x>688</x>  <y>16</y>  <label>Detail</label>...</transition>
```

**Rule:** every place and transition in the same logical lane shares the same Y. Branch lanes never overlap with the main lane. The detail/status task goes above the main lane (lower Y value) so it is visually separate and clearly "always on".

> ⚠️ **Critical — no place and transition may ever share the same `(x, y)`.** This includes places and the transitions they directly feed. Always apply the +192px step: if a place is at `x=880`, the transition it feeds is at `x=1072` — never both at `x=880`. Overlapping coordinates cause elements to stack invisibly on the builder canvas, making the model appear broken or incomplete. Before writing any XML coordinates, verify that every `(x, y)` pair in the document is unique.

---

### 3.7 Material Icons

Icons can be set on both the **process** (in metadata, as `<icon>`) and on individual **transitions** (inside `<transition>`, as `<icon>`). Both use the same Material icon name string.

```xml
<!-- On a transition -->
<transition>
   <id>submit_request</id>
   <x>304</x><y>208</y>
   <label>Submit Request</label>
   <icon>send</icon>
   <priority>1</priority>
   ...
</transition>
```

| Icon | Use for |
|------|---------|
| `send` | Submit |
| `assignment_ind` | Review / registration |
| `gavel` | Legal / judgment |
| `check_circle` | Approve |
| `cancel` | Reject |
| `edit` | Edit tasks |
| `description` | Documents |
| `attach_file` | Attachments |
| `mail_outline` | Messaging |
| `person` | User-related |
| `schedule` | Time-related |
| `priority_high` | Urgent |

---

## 4. Events & Actions (Groovy)

### 4.1 Event Types, Scopes & Phases

There are three scopes where events can be defined. Each scope supports different event types.

#### Scope map

| Scope | XML placement | Valid event types |
|-------|--------------|-------------------|
| Case | `<caseEvents>` — last element in document | `create`, `delete` |
| Transition | directly inside `<transition>` — no wrapper | `assign`, `finish`, `cancel`, `delegate` |
| Data field | inside `<data>` | `set`, `get` |

> ⚠️ `<caseEvents>` only accepts `create` and `delete`. There is no `finish` case event. The `finish` event type exists only on transitions.

#### Phase

`pre` and `post` are valid for **all** event types across all scopes.

| Phase | Runs | Use for |
|-------|------|---------|
| `pre` | Before the event executes | Validation, blocking the event (throw exception), modifying input |
| `post` | After the event has executed | Side effects, updating fields, sending emails, external calls |

#### What is available in each scope

| Variable | Case events | Transition events | Data events |
|----------|------------|-------------------|-------------|
| `useCase` | ✅ | ✅ | ✅ |
| `task` | ❌ | ✅ | ❌ |
| `petriNet` | ✅ | ✅ | ✅ |
| `f` (field accessor) | ✅ | ✅ | ✅ |
| `log` | ✅ | ✅ | ✅ |

> ⚠️ `task` is not available in case events or data events. Do not reference it there.

#### Full event structure examples

```xml
<!-- Case event — placed in <caseEvents> -->
<caseEvents>
   <event type="create">
      <id>on_create</id>
      <actions phase="post">
         <action id="1"><![CDATA[
        status: f.status;
        change status value { "New" }
      ]]></action>
      </actions>
   </event>
</caseEvents>

        <!-- Transition event — directly inside <transition>, no wrapper -->
<transition>
<id>approve_request</id>
<event type="finish">
   <id>on_approve_finish</id>
   <actions phase="post">
      <action id="2"><![CDATA[
        approved_by: f.approved_by,
        approved_at: f.approved_at;
        change approved_by value { userService.loggedOrSystem.email }
        change approved_at value { new java.util.Date() }
      ]]></action>
   </actions>
</event>
<event type="assign">
   <id>on_approve_assign</id>
   <actions phase="post">
      <action id="3"><![CDATA[
        assigned_at: f.assigned_at;
        change assigned_at value { new java.util.Date() }
      ]]></action>
   </actions>
</event>
</transition>

        <!-- Data field event — inside <data> -->
<data type="enumeration">
<id>category</id>
<title>Category</title>
<options>...</options>
<event type="set">
   <id>on_category_set</id>
   <actions phase="post">
      <action id="4"><![CDATA[
        category: f.category,
        sub_category: f.sub_category;
        change sub_category value { null }
      ]]></action>
   </actions>
</event>
</data>
```

---

### 4.2 Action Structure & Rules

```xml
<event type="finish">
   <id>event_id</id>
   <actions phase="post">
      <action id="1"><![CDATA[
      status: f.status,
      created_by: f.created_by;
      change status value { "Approved" }
      change created_by value { userService.loggedOrSystem.email }
    ]]></action>
   </actions>
</event>
```

**Rules:**
- Always wrap action code in `<![CDATA[ ... ]]>`
- Import multiple variables with commas, terminated by a single semicolon: `a: f.a, b: f.b, t1: t.transition_id;`
- A single variable import ends with a semicolon: `a: f.a;`
- Action `id` must be **globally unique** across the **entire document** — number sequentially (1, 2, 3 …) in document order, never restart numbering. Never use placeholder values like `id="N"` — every action `id` must be a real unique integer or string before the document is output.
- Use **fully qualified Java class names**: `java.lang.String`, `java.util.Date`, `java.util.Locale`, etc.

**Action code is plain Groovy.** Any valid Groovy/Java is allowed inside CDATA — loops, closures, HTTP calls, JSON parsing, date arithmetic — subject to: (1) the class must be on the backend classpath, (2) Petriflow DSL conventions must be followed, (3) use fully qualified class names.

---

#### Import completeness — the most common source of runtime errors

**Every identifier used in an action body must be declared in the import header.** Missing imports cause silent null-pointer failures or runtime errors that are hard to trace.

**What must be imported:**

| Used in body | Import syntax | Example |
|---|---|---|
| Field you `change` | `fieldId: f.fieldId` | `status: f.status;` |
| Field whose `.value` you read | `fieldId: f.fieldId` | `email: f.email,` then `email.value` |
| Field used in a condition | `fieldId: f.fieldId` | `priority: f.priority,` then `if (priority.value == "high")` |
| Field passed to `sendEmail` | `fieldId: f.fieldId` | `email: f.email,` then `[email.value]` |
| Field interpolated in a string | `fieldId: f.fieldId` | `response: f.final_response,` then `"${response.value}"` |
| Transition used with `make` | `tId: t.transition_id` | `t_review: t.review_task;` |
| Transition used with routing fields | `tId: t.transition_id` | import the transition before passing it to `make` |

**The rule in plain terms:** before writing a single line of action body, mentally scan every `.value`, every `change X`, every `make X ... on Y`, every `[X.value]` in that action — every one of those identifiers needs a corresponding import line.

**Common missed imports — real examples from generated code:**

```groovy
// ❌ Wrong — email used in sendEmail but never imported
request_status: f.request_status,
current_department: f.current_department;
change request_status value { "Submitted" }
sendEmail(
        [email.value],          // ← runtime error: email is not defined
        "Request received",
        "Your request was received."
)

// ✅ Correct — every identifier used in the body is imported
email: f.email,
request_status: f.request_status,
current_department: f.current_department;
change request_status value { "Submitted" }
sendEmail(
        [email.value],
        "Request received",
        "Your request was received."
)
```

```groovy
// ❌ Wrong — final_response.value interpolated in string but not imported
email: f.email,
request_status: f.request_status;
change request_status value { "Completed" }
sendEmail(
        [email.value],
        "Done",
        "Response: ${final_response.value}"   // ← runtime error
)

// ✅ Correct
email: f.email,
final_response: f.final_response,
request_status: f.request_status;
change request_status value { "Completed" }
sendEmail(
        [email.value],
        "Done",
        "Response: ${final_response.value ?: ''}"
)
```

```groovy
// ❌ Wrong — routing flag fields set in conditional but not imported
legal_required: f.legal_required;
if (legal_required.value == "yes") {
   change go_to_legal value { 1 }   // ← go_to_legal not imported
   change go_to_pr    value { 0 }   // ← go_to_pr not imported
}

// ✅ Correct — note: go_to_legal and go_to_pr must be type="number" fields (not boolean)
// Variable arc references require number fields; use 1 (fire) and 0 (block), not true/false
legal_required: f.legal_required,
go_to_legal: f.go_to_legal,
go_to_pr: f.go_to_pr;
if (legal_required.value == "yes") {
   change go_to_legal value { 1 }
   change go_to_pr    value { 0 }
} else {
   change go_to_legal value { 0 }
   change go_to_pr    value { 1 }
}
```

```groovy
// ❌ Wrong — transition used in make but not imported
comment: f.comment;
make comment, required on t_review when { return true }   // ← t_review not defined

// ✅ Correct
t_review: t.review_task,
comment: f.comment;
make comment, required on t_review when { return true }
```

**Pre-generation checklist for every action:**
1. List every field referenced anywhere in the body (read, written, interpolated, passed as argument).
2. List every transition referenced in `make` calls.
3. Every item in those two lists must appear in the import header.
4. Syntax: commas between all imports, one semicolon at the very end of the import block.

---

### 4.3 `change` vs `setData`

Both write field values but serve different purposes.

**Use `change`** for normal synchronous field updates within the current action context — transition events, case events, data events.

**Use `setData`** when:
- writing from inside `async.run`
- writing to a different case than the current one

**Always use the `setData(task, [...])` form** — pass a task object obtained via `findTask`. This is the safest and most explicit overload. Resolve the task first, check it is not null, then write:

```groovy
// change — normal synchronous update
status: f.status;
change status value { "Approved" }

// setData — writing from async context (always find the task first)
async.run {
   def t = findTask { qTask ->
      qTask.transitionId.eq("result_task").and(qTask.caseId.eq(useCase.stringId))
   }
   if (t) setData(t, [result_field: [value: "Done", type: "text"]])
}

// setData — writing to a different case
def otherCase = findCase { qCase -> qCase.stringId.eq(other_id.value) }
if (otherCase) {
   def t = findTask { qTask ->
      qTask.transitionId.eq("review_task").and(qTask.caseId.eq(otherCase.stringId))
   }
   if (t) setData(t, [status: [value: "updated", type: "text"]])
}
```

**`setData` type strings — complete reference**

The `type` string in each `[field_id: [value: ..., type: "..."]]` map entry must exactly match the field's declared type. Wrong type string causes a silent no-op or runtime error.

| Field type | `type` string | Example value |
|---|---|---|
| `text` | `"text"` | `"Approved"` |
| `number` | `"number"` | `1500.0` |
| `boolean` | `"boolean"` | `true` |
| `date` | `"date"` | `new java.util.Date()` |
| `dateTime` | `"dateTime"` | `new java.util.Date()` |
| `enumeration` | `"enumeration"` | `"option_key"` |
| `enumeration_map` | `"enumeration_map"` | `"option_key"` |
| `multichoice` | `"multichoice"` | `["key1", "key2"] as Set` |
| `multichoice_map` | `"multichoice_map"` | `["key1", "key2"] as Set` |
| `user` | `"user"` | `userService.loggedOrSystem.transformToUser()` |
| `file` | `"file"` | *(use `saveFileToField` instead)* |
| `taskRef` | `"taskRef"` | `"transition_id"` or `List<String>` of task string IDs |
| `caseRef` | `"caseRef"` | `["case_string_id_1", "case_string_id_2"]` as `List<String>` |

```groovy
// Example — setData with multiple field types
def reviewTask = findTask { qTask ->
   qTask.transitionId.eq("review_task").and(qTask.caseId.eq(useCase.stringId))
}
if (reviewTask) setData(reviewTask, [
        status:      [value: "In Review",                              type: "text"],
        assigned_at: [value: new java.util.Date(),                     type: "dateTime"],
        is_urgent:   [value: true,                                     type: "boolean"],
        priority:    [value: "high",                                   type: "enumeration"],
        score:       [value: 42.0,                                     type: "number"],
        tags:        [value: ["legal", "finance"] as Set,              type: "multichoice"]
])
```

---

### 4.4 ActionDelegate DSL Reference

All methods are directly available inside event action scripts via the ActionDelegate.

#### Field operations

##### `change` — set a field value

The value **must match the field's declared type**. Passing the wrong type causes a runtime error.

```groovy
// text → String
title: f.title;
change title value { "Approved" }

// number → numeric (Double is the safe type for arithmetic)
amount: f.amount;
change amount value { 1500.50 }

// boolean → Boolean
is_urgent: f.is_urgent;
change is_urgent value { true }

// date / dateTime → java.util.Date
submitted_at: f.submitted_at;
change submitted_at value { new java.util.Date() }

// user → IUser (use transformToUser())
assignee: f.assignee;
change assignee value { userService.loggedOrSystem.transformToUser() }

// enumeration / enumeration_map → String matching an option key exactly
status: f.status;
change status value { "approved" }

// multichoice / multichoice_map → Set<String> of option keys
tags: f.tags;
change tags value { ["urgent", "review"] as Set }

// file → do not use change; use saveFileToField instead
```

##### `make` — change a field's behavior on a transition

**Both `on` and `when` are always required.** Each call targets exactly **one field** and **one transition**. The `when {}` closure must use `return`.

```groovy
make <field>, <behaviour> on <transition> when { <condition> }
```

- `<field>` — imported field variable
- `<behaviour>` — one of: `required`, `editable`, `visible`, `hidden`, `forbidden`, `optional`
- `<transition>` — one imported transition variable, or the keyword `transitions` (all transitions in the process)
- `<condition>` — a Groovy closure that returns a boolean; use imported variables — **never `f.field_id` directly inside the closure**

**`when` closure rules:** the closure must evaluate to a boolean. Both `when { return true }` and the shorthand `when { true }` are valid — in Groovy, a closure without an explicit `return` returns the value of its last expression. Use `return` when the condition involves a multi-line expression or `if`; use the shorthand `{ true }` or `{ false }` for unconditional makes.

```groovy
// Shorthand — always applies, no condition needed
make comment, visible on t_review when { true }

// With return — condition based on another field
make comment, required on t_submit when { return priority.value == "high" }

// Multi-line condition — return is required
make comment, hidden on t_submit when {
   def v = priority.value
   return v != "high" && v != "urgent"
}
```

**`optional` — removing a required constraint:**

```groovy
// Use optional to undo a required behaviour set earlier or in the static dataRef
t_submit: t.submit_request,
phone: f.phone;
make phone, optional on t_submit when { true }
```

```groovy
// Single field, single transition
t_submit: t.submit_request,
comment: f.comment;
make comment, required on t_submit when { return true }

// Condition based on another field
t_submit: t.submit_request,
priority: f.priority,
comment: f.comment;
make comment, required on t_submit when { return priority.value == "high" }

// Multiple transitions — one make call per transition
t_review: t.review,
t_approve: t.approve,
comment: f.comment;
make comment, visible on t_review  when { true }
make comment, visible on t_approve when { true }

// All transitions — use with caution (see warning below)
comment: f.comment;
make comment, hidden on transitions when { true }
```

> ⚠️ **`make ... on transitions` — use sparingly.** The keyword `transitions` applies the behaviour to **every transition in the process** and can silently override per-task behaviors you set elsewhere. Only use it when you genuinely want a global change (e.g. hiding an internal field everywhere). Prefer explicit per-transition `make` calls in all other cases.

##### `generate` — populate a field via a named helper

```groovy
fileField: f.fileField;
generate "someMethodName" into fileField
```

##### `updateMultichoiceWithCurrentNode`

```groovy
uri_field: f.uri_field;
updateMultichoiceWithCurrentNode(uri_field, uriNode)
```

---

#### Case / Workflow operations

```groovy
def oneCase = findCase  { qCase -> qCase.processIdentifier.eq("my_process") }
def cases   = findCases { qCase -> qCase.processIdentifier.eq("my_process") }

def childCase = createCase("child_process_id", "Child case title", "blue")

// Standard form: resolve task object first, then pass it to setData
def t = findTask { qTask -> qTask.transitionId.eq("task_id").and(qTask.caseId.eq(useCase.stringId)) }
if (t) setData(t, [field_id: [value: "new value", type: "text"]])

// Shorthand form: pass transition ID string + target case object directly
// The engine resolves the task itself — useful for cross-process writes where you know the transition ID and have the case object
setData("transition_id", targetCase, ["field_id": ["value": "new value", "type": "text"]])

changeCaseProperty("title").about { "New case title" }
changeCaseProperty("color").about { "green" }
```

**Valid case color values:**

| Value | Display |
|---|---|
| `"red"` | Red |
| `"orange"` | Orange |
| `"yellow"` | Yellow |
| `"green"` | Green |
| `"teal"` | Teal |
| `"cyan"` | Cyan |
| `"blue"` | Blue (default) |
| `"indigo"` | Indigo |
| `"purple"` | Purple |
| `"pink"` | Pink |
| `"brown"` | Brown |
| `"grey"` | Grey |

Use `changeCaseProperty("color")` in a transition finish action to visually signal case state — e.g. green when approved, red when rejected, orange when escalated.

---

#### Task operations

> ⚠️ **`assignTask` and `finishTask` only work when the target transition is enabled — i.e. its input place already holds a token.** Calling them on a transition whose place has no token will throw a runtime exception. Always ensure the net structure guarantees the token is in the right place before these calls execute. When using `async.run`, the token must have arrived before the async block fires — design the arc flow so the token moves first, then the action triggers the system task.

```groovy
assignTask("transition_id")
assignTask(task, userService.loggedOrSystem)
cancelTask("transition_id")
finishTask("transition_id")
finishTask(task, userService.loggedOrSystem)

def oneTask = findTask  { qTask -> qTask.transitionId.eq("approve_request") }
def tasks   = findTasks { qTask -> qTask.caseId.eq(useCase.stringId) }

def taskId = getTaskId("approve_request", useCase)

execute("approve_request").with { [field_id: [value: "Done", type: "text"]] }
```

---

#### Role operations

```groovy
assignRole("role_import_id", "process_identifier")
removeRole("role_import_id", "process_identifier")
assignRole("role_import_id", petriNet)
removeRole("role_import_id", petriNet)
```

---

#### User operations

```groovy
def user1 = findUserByEmail("user@example.com")
def user2 = findUserById("user_mongo_id")
changeUserByEmail("user@example.com").email { "new@example.com" }
changeUser("user_mongo_id").name { "NewName" }
inviteUser("new.user@example.com")
deleteUser("user@example.com")
```

---

#### Validation helpers

```groovy
def v1 = validation("value != null", new I18nString("Value is required"))
def v2 = dynamicValidation("value != null", new I18nString("Value is required"))
```

---

#### File / PDF / Mail helpers

```groovy
// File
saveFileToField(useCase, "transition_id", "file_field_id", "report.pdf")
def stream = getFileFieldStream(useCase, task, fileField, true)

// PDF — prefer generatePdf; generatePDF is an alias
generatePdf("transition_id", "target_file_field_id")
generatePdfWithTemplate("transition_id", "target_file_field_id", "/path/to/template")
generatePdfWithLocale("transition_id", "target_file_field_id", java.util.Locale.ENGLISH)
generatePdfWithZoneId("transition_id", "target_file_field_id", java.time.ZoneId.systemDefault())

// Email
sendEmail(["to@example.com"], "Subject", "Body")
sendEmail(["to@example.com"], "Subject", "Body", ["report.pdf": new java.io.File("report.pdf")])
sendMail(mailDraft)
```

---

#### Search / Export helpers

```groovy
def foundCase  = findCaseElastic("processIdentifier:my_process")
def caseList   = findCasesElastic("processIdentifier:my_process")
def caseCount  = countCasesElastic("processIdentifier:my_process")
exportCasesToFile({ qCase -> qCase.processIdentifier.eq("my_process") }, "cases.csv")
exportTasksToFile({ qTask -> qTask.transitionId.eq("approve_request") }, "tasks.csv")
```

---

#### Menu / Filter / Dashboard / URI helpers *(advanced)*

```groovy
createCaseFilter("Title", "query", ["my_process"])
createFilterInMenu("/my/uri", "identifier", "Title", "query", "Case", "private", ["my_process"])
createMenuItem("/my/uri", "identifier", "Title")
createOrUpdateMenuItem("uri", "identifier", "Title")
findFilter("Filter title")
findMenuItem("menu_identifier")
existsMenuItem("menu_identifier")
moveMenuItem(item, "/new/uri")
duplicateMenuItem(originItem, new I18nString("New title"), "new_identifier")
deleteMenuItem(item)

createDashboardManagement(body)
createDashboardItem(body)
findDashboardManagement("identifier")
updateDashboardManagement(managementCase, body)

getUri("/some/path")
createUri("/some/path", uriContentType)
moveUri("/old/path", "/new/path")
getCorrectedUri("/wrong/path")
splitUriPath("/a/b/c")
findOptionsBasedOnSelectedNode(uriNode)
```

---

#### Utility helpers

```groovy
// Async — use setData inside, not change
async.run {
   def result = someExpensiveComputation()
   def t = findTask { qTask ->
      qTask.transitionId.eq("transition_id").and(qTask.caseId.eq(useCase.stringId))
   }
   if (t) setData(t, [result_field: [value: result, type: "text"]])
}

cache("key", "value")
def value = cache("key")
cacheFree("key")

def currentUser = loggedUser()

def title = i18n("Default title", ["en": "Default title", "sk": "Predvolený názov"])
```

---

### 4.5 Available Services & Variables

#### Autowired services

| Variable | Type |
|----------|------|
| `workflowService` | `IWorkflowService` |
| `taskService` | `TaskService` |
| `dataService` | `IDataService` |
| `userService` | `IUserService` |
| `petriNetService` | `IPetriNetService` |
| `processRoleService` | `IProcessRoleService` |
| `async` | `AsyncRunner` |
| `pdfGenerator` | `IPdfGenerator` |
| `mailService` | `IMailService` |
| `elasticCaseService` | `IElasticCaseService` |
| `elasticTaskService` | `IElasticTaskService` |
| `filterSearchService` | `IUserFilterSearchService` |
| `configurableMenuService` | `IConfigurableMenuService` |
| `uriService` | `IUriService` |
| `exportService` | `IExportService` |
| `historyService` | `IHistoryService` |
| `registrationService` | `IRegistrationService` |
| `nextGroupService` | `INextGroupService` |
| `scheduler` | `org.quartz.Scheduler` |
| `fieldFactory` | `FieldFactory` |

#### Built-in variables

| Variable | Type | Description |
|----------|------|-------------|
| `useCase` | `Case` | Current process instance |
| `task` | `Optional<Task>` | Current task — only in transition events |
| `petriNet` | `PetriNet` | Current process definition |
| `params` | `Map<String, String>` | Runtime parameters passed via the API at case/task invocation time. **Not available in normal eTask/builder usage — do not use for storing API keys or configuration.** |
| `f` | `FieldFactory` | Field accessor — use as `f.field_id` |

---

### 4.6 Common Action Patterns

#### Auto-number cases on creation

```groovy
case_number: f.case_number;
def year   = new java.util.Date().format("yyyy")
def count  = workflowService.findAll(petriNet.stringId).size()
def number = java.lang.String.format("%05d", count + 1)
change case_number value { "REQ-${year}-${number}" }
```

#### Stamp who did what and when

```groovy
approved_by: f.approved_by,
approved_at: f.approved_at;
change approved_by value { userService.loggedOrSystem.email }
change approved_at value { new java.util.Date() }
```

#### Conditional field visibility (multi-condition)

Every shown field needs an explicit rule for the opposite condition — do not rely on default state.

```groovy
t_submit: t.submit_request,
contract_type: f.contract_type,
iban: f.iban,
company_reg: f.company_reg,
vat_number: f.vat_number;

make iban,        required on t_submit when { return contract_type.value == "bank_transfer" }
make iban,        hidden   on t_submit when { return contract_type.value != "bank_transfer" }
make company_reg, required on t_submit when { return contract_type.value == "b2b" }
make vat_number,  required on t_submit when { return contract_type.value == "b2b" }
make company_reg, hidden   on t_submit when { return contract_type.value != "b2b" }
make vat_number,  hidden   on t_submit when { return contract_type.value != "b2b" }
```

#### Calculate totals

```groovy
price: f.price,
quantity: f.quantity,
total: f.total;
def totalValue = (price.value as java.lang.Double) * (quantity.value as java.lang.Double)
change total value { totalValue }
```

#### Calculate date difference (days)

```groovy
start_date: f.start_date,
end_date: f.end_date,
days: f.days;
def daysDiff = ((end_date.value as java.util.Date).time - (start_date.value as java.util.Date).time) / (1000 * 60 * 60 * 24)
change days value { daysDiff }
```

#### Deadline calculation in business days

```groovy
request_date: f.request_date,
deadline: f.deadline,
priority: f.priority;

def daysToAdd = priority.value == "urgent" ? 2 : (priority.value == "high" ? 5 : 10)
def cal = java.util.Calendar.getInstance()
cal.setTime(request_date.value as java.util.Date)
def added = 0
while (added < daysToAdd) {
   cal.add(java.util.Calendar.DAY_OF_MONTH, 1)
   def dow = cal.get(java.util.Calendar.DAY_OF_WEEK)
   if (dow != java.util.Calendar.SATURDAY && dow != java.util.Calendar.SUNDAY) added++
}
change deadline value { cal.getTime() }
```

#### Counter / revision tracking

```groovy
revision_count: f.revision_count;
def current = (revision_count.value as Integer) ?: 0
change revision_count value { (current + 1) as Double }
```

#### Auto-fill fields from logged user profile

Available attributes on `userService.loggedOrSystem`: `name`, `surname`, `email`, `id`.

```groovy
submitted_by: f.submitted_by,
submitted_by_email: f.submitted_by_email;
def user = userService.loggedOrSystem
change submitted_by value { "${user.name} ${user.surname}" }
change submitted_by_email value { user.email }
```

#### Dynamic multichoice options based on another field

Place in a data `event type="set"` on the controlling field.

```groovy
category: f.category,
sub_category: f.sub_category;

def optionMap = [
        "hardware": ["laptop", "monitor", "keyboard", "mouse"],
        "software": ["license", "subscription", "upgrade", "new_install"],
        "service":  ["repair", "consultation", "training"]
]
def choices = optionMap[category.value] ?: []
change sub_category value { choices as Set }
```

#### Modifying choices on `enumeration` / `multichoice` fields at runtime

For `enumeration` and `multichoice` fields (plain list — keys only), actions can read and replace the **set of available choices** via the `choices` property. This is separate from `value` — `choices` controls which options are visible and selectable, while `value` is the currently selected key(s).

```groovy
// Read current choices (returns a Set<String> of keys)
status_filter: f.status_filter;
def current = status_filter.choices   // e.g. ["open", "pending", "closed"]

// Replace choices entirely
change status_filter choices { ["open", "pending"] as Set }

// Add one option dynamically
def updated = new java.util.HashSet(status_filter.choices)
updated.add("escalated")
change status_filter choices { updated }

// Remove an option
def filtered = new java.util.HashSet(status_filter.choices)
filtered.remove("closed")
change status_filter choices { filtered }
```

> **When to use:** dynamically restrict which values are available based on user role, process state, or another field's value. For example, hide the "Escalate" option unless the user has the escalation role, or remove "Approve" from the decision field if the amount exceeds a threshold.

**Common pattern — filter choices based on a field value:**

```groovy
// In a data event type="set" on the controlling field:
department: f.department,
action_type: f.action_type;

def allowedByDept = [
        "finance":  ["approve", "reject", "request_info"] as Set,
        "hr":       ["approve", "reject"] as Set,
        "legal":    ["approve", "reject", "escalate"] as Set
]
def allowed = allowedByDept[department.value] ?: ["approve", "reject"] as Set
change action_type choices { allowed }
```

#### Modifying options on `enumeration_map` / `multichoice_map` fields at runtime

For `enumeration_map` and `multichoice_map` fields (key/display-value pairs), actions access and replace the **options map** via the `options` property. The value is a `Map<String, String>` where keys are stored values and map values are display labels.

```groovy
// Read current options (returns a Map<String, String>)
refund_method: f.refund_method;
def current = refund_method.options   // e.g. ["iban": "IBAN Bank Transfer", "other": "Other"]

// Replace options entirely with a new map
change refund_method options { ["iban": "IBAN Bank Transfer", "crypto": "Cryptocurrency"] }

// Add one option dynamically
def updated = new java.util.LinkedHashMap(refund_method.options)
updated["voucher"] = "Gift Voucher"
change refund_method options { updated }

// Remove an option
def filtered = new java.util.LinkedHashMap(refund_method.options)
filtered.remove("crypto")
change refund_method options { filtered }
```

> **When to use:** populate a dropdown with data retrieved from an external API, a database query, or computed from other case data at runtime — rather than hardcoding options in the XML definition.

**Common pattern — populate options from an external source:**

```groovy
// In a caseEvents create post or a transition finish post action:
country: f.country,
city: f.city;

// Fetch cities for selected country from an external API
def conn = (java.net.HttpURLConnection) new java.net.URL(
        "https://api.example.com/cities?country=${country.value}"
).openConnection()
conn.setRequestMethod("GET")
conn.setConnectTimeout(5000)
conn.setReadTimeout(10000)
def body = conn.getInputStream().getText("UTF-8")
def result = new groovy.json.JsonSlurper().parseText(body)  // expects [{"code":"ba","name":"Bratislava"}, ...]

def cityOptions = result.collectEntries { [(it.code): it.name] }
change city options { cityOptions }
```

> ⚠️ After modifying `choices` or `options`, the field's current `value` is not automatically cleared. If the previously selected value is no longer in the new choices/options set, explicitly reset it: `change field_id value { null }` to avoid storing a value that is no longer valid.

#### Role assignment based on field value

```groovy
department: f.department;
def roleMap = ["finance": "finance_approver", "hr": "hr_approver", "legal": "legal_approver"]
def roleId  = roleMap[department.value]
if (roleId) assignRole(roleId, petriNet)
```

#### Conditional case title update

```groovy
reference_number: f.reference_number,
applicant_name: f.applicant_name;
changeCaseProperty("title").about { "${reference_number.value} — ${applicant_name.value}" }
```

#### Assign task to user based on field value

```groovy
amount: f.amount;
def nextTask = findTask { qTask ->
   qTask.transitionId.eq("approve_request").and(qTask.caseId.eq(useCase.stringId))
}
if (nextTask) {
   def email = (amount.value as java.lang.Double) < 1000 ? "manager@example.com" : "director@example.com"
   assignTask(nextTask, findUserByEmail(email))
}
```

#### Send an email notification

```groovy
email: f.email,
status: f.status;
sendEmail([email.value], "Status Update: ${useCase.title}", "Your request status is now: ${status.value}")
```

#### Generate PDF and send by email

`generatePdf` renders the transition's form into a file field. Read that field to get the path for the attachment.

```groovy
applicant_email: f.applicant_email,
applicant_name: f.applicant_name,
pdf_output: f.pdf_output;

generatePdf("approve_request", "pdf_output")

def pdfFile = new java.io.File(pdf_output.value?.path ?: "")
if (pdfFile.exists()) {
   sendEmail(
           [applicant_email.value],
           "Your request has been approved — ${useCase.title}",
           "Dear ${applicant_name.value},\n\nPlease find your approval document attached.",
           ["approval_${useCase.stringId}.pdf": pdfFile]
   )
} else {
   throw new java.lang.IllegalStateException("PDF not found for case ${useCase.stringId}")
}
```

#### Escalation on SLA breach (two-action pattern)

```groovy
// Action on assign post — record when task was assigned
assigned_at: f.assigned_at;
change assigned_at value { new java.util.Date() }
```

```groovy
// Action on finish pre — check SLA, reassign if breached
assigned_at: f.assigned_at,
priority: f.priority;

def limitHours = priority.value == "urgent" ? 4 : 24
def elapsed = (new java.util.Date().time - (assigned_at.value as java.util.Date).time) / (1000 * 60 * 60)

if (elapsed > limitHours) {
   def escalationUser = findUserByEmail("manager@example.com")
   def currentTask = findTask { qTask ->
      qTask.transitionId.eq("review_request").and(qTask.caseId.eq(useCase.stringId))
   }
   if (currentTask && escalationUser) {
      assignTask(currentTask, escalationUser)
      sendEmail(["manager@example.com"], "Escalation: ${useCase.title}",
              "Task exceeded SLA of ${limitHours}h and was reassigned.")
   }
}
```

#### Data aggregation across cases

```groovy
total_amount: f.total_amount,
approved_count: f.approved_count,
rejected_count: f.rejected_count;

def allCases = findCases { qCase -> qCase.processIdentifier.eq("expense_request") }
def total = 0.0; def approved = 0; def rejected = 0

allCases.each { c ->
   def amt    = c.dataSet["amount"]?.value
   def status = c.dataSet["status"]?.value
   if (amt)                  total    += (amt as java.lang.Double)
   if (status == "approved") approved++
   if (status == "rejected") rejected++
}
change total_amount   value { total }
change approved_count value { approved as java.lang.Double }
change rejected_count value { rejected as java.lang.Double }
```

#### Duplicate check before case creation

Place in `caseEvents` `on_create` **pre** phase. Throwing an exception aborts creation.

```groovy
reference_number: f.reference_number;

if (reference_number.value) {
   def existing = findCases { qCase ->
      qCase.dataSet["reference_number"].value.eq(reference_number.value)
              .and(qCase.stringId.ne(useCase.stringId))
   }
   if (existing) {
      throw new java.lang.IllegalStateException(
              "A case with reference '${reference_number.value}' already exists."
      )
   }
}
```

#### Validate before finishing (pre phase)

```groovy
amount: f.amount;
if ((amount.value as java.lang.Double) <= 0) {
   throw new IllegalArgumentException("Amount must be positive")
}
```

#### Update status field before the token moves (pre phase)

Using `phase="pre"` in a finish event runs the action **before** the token leaves the current place. This is the correct technique for updating a status/tracking field so that any persistent Detail view (connected via `read` arc) reflects the new state at the exact moment the task completes — not after some delay or race condition.

```groovy
// finish pre — status is written BEFORE the token moves
// so the detail view immediately shows "Request registered" when this task finishes
text_6: f.text_6;
change text_6 value { "Request registered." }
```

Contrast with `phase="post"`: post runs after the token has already moved to the next place. For side effects like emails or async routing this is correct, but for status fields that a live detail view reads, `pre` guarantees the field is updated atomically with the transition firing.

**Rule of thumb:**
- `phase="pre"` — status updates, field changes visible to the submitter, validation/blocking logic
- `phase="post"` — emails, async routing (`assignTask`/`finishTask`), external API calls, child case creation

#### External API call with result stored back

```groovy
reference_number: f.reference_number;
async.run {
   def conn = (java.net.HttpURLConnection) new java.net.URL(
           "https://api.example.com/validate?ref=${reference_number.value}"
   ).openConnection()
   conn.setRequestMethod("GET")
   conn.setConnectTimeout(10_000)
   conn.setReadTimeout(30_000)
   conn.setRequestProperty("Accept", "application/json")
   def body = ""
   try {
      body = conn.getInputStream().getText("UTF-8")
   } catch (java.lang.Exception e) {
      body = conn.getErrorStream()?.getText("UTF-8") ?: '{"status":"error","message":"unreachable"}'
   }
   def result = new groovy.json.JsonSlurper().parseText(body)
   def t = findTask { qTask ->
      qTask.transitionId.eq("submit_request").and(qTask.caseId.eq(useCase.stringId))
   }
   if (t) setData(t, [
           validation_status:  [value: result.status,  type: "text"],
           validation_message: [value: result.message, type: "text"]
   ])
}
```

#### Handling API keys and secrets in PoC workflows

When calling external APIs (e.g. OpenAI, OCR services), you need to pass an API key. **`params.api_key` is not available in normal eTask/builder usage** — never use it as a key source. Use one of these approaches instead:

**PoC approach — store the key in a `text` data field (recommended for PoC):**

Declare a `text` data field to hold the key. Mark it clearly with a comment and a placeholder value. The field should be `hidden` on all user-facing transitions so it never appears in any form.

```xml
<!-- Declare alongside other data fields -->
<data type="text">
   <id>openai_api_key</id>
   <title>OpenAI API Key</title>
   <!-- ⚠️ REPLACE the value below with your actual OpenAI API key before importing -->
   <value>sk-YOUR-API-KEY-HERE</value>
</data>
```

Import and use it in the action like any other field:

```groovy
openai_api_key: f.openai_api_key,
email_body: f.email_body,
llm_result: f.llm_result;

async.run {
   def conn = (java.net.HttpURLConnection) new java.net.URL(
           "https://api.openai.com/v1/chat/completions"
   ).openConnection()
   conn.setRequestMethod("POST")
   conn.setRequestProperty("Content-Type", "application/json")
   conn.setRequestProperty("Authorization", "Bearer ${openai_api_key.value}")
   conn.setDoOutput(true)
   conn.setConnectTimeout(15_000)
   conn.setReadTimeout(60_000)

   def payload = groovy.json.JsonOutput.toJson([
           model: "gpt-4o-mini",
           messages: [[role: "user", content: email_body.value ?: ""]]
   ])
   conn.outputStream.write(payload.getBytes("UTF-8"))

   def responseBody = ""
   try {
      responseBody = conn.inputStream.getText("UTF-8")
   } catch (java.lang.Exception e) {
      responseBody = conn.errorStream?.getText("UTF-8") ?: '{"error":"unreachable"}'
   }

   def parsed = new groovy.json.JsonSlurper().parseText(responseBody)
   def answer = parsed?.choices?.getAt(0)?.message?.content ?: "LLM error"

   def t = findTask { qTask ->
      qTask.transitionId.eq("result_task").and(qTask.caseId.eq(useCase.stringId))
   }
   if (t) setData(t, [llm_result: [value: answer, type: "text"]])
}
```

> ⚠️ Make the API key field `hidden` on every transition's `dataRef` so it is never shown to users. It is a configuration value, not a form field.

**Safely parsing the LLM JSON response — stripping markdown code fences:**

LLMs sometimes wrap their JSON response in markdown fences like ` ```json ... ``` `. You must strip these before calling `JsonSlurper`. **Do not use `^` and `$` anchors in `.replaceAll()` without enabling multiline mode** — in Java/Groovy, `.replaceAll("^```json", "")` anchors to the very start of the entire string and will silently fail to match if the fence appears mid-string or after whitespace.

Use this safe stripping pattern instead:

```groovy
def content = parsed?.choices?.getAt(0)?.message?.content ?: "{}"

// Safe fence stripping — use single-quoted strings to avoid Groovy interpolation of $ and \
def normalized = content
        .replaceAll('(?m)^```(?:json)?\\s*', '')   // strip opening fence line (with or without "json")
        .replaceAll('(?m)^```\\s*$', '')           // strip closing fence line
        .trim()

def result = new groovy.json.JsonSlurper().parseText(normalized ?: "{}")
```

> ⚠️ **Always use single-quoted strings `'...'` for regex patterns in Groovy.** Double-quoted strings `"..."` enable Groovy string interpolation — `$` and `\` are consumed by Groovy before the pattern reaches the regex engine, silently corrupting your regex. The `(?m)` flag enables multiline mode so `^` and `$` match the start/end of each line, not just the whole string.

Alternatively, if you control the prompt and use `response_format: [type: "json_object"]` with the OpenAI API, the response will never contain markdown fences — making stripping unnecessary entirely. Always prefer this when the API supports it.

**How to set your API key in the generated XML:**

1. In the `<data>` section of the XML, find the field with `<id>openai_api_key</id>`.
2. Replace `sk-YOUR-API-KEY-HERE` inside `<value>...</value>` with your actual key.
3. Save the file and import it into the builder.

**Production approach (beyond PoC):** Move secrets to server-side environment variables or a secret management service and read them via a custom Groovy service bean. Do not store real secrets in XML files committed to version control.

---

#### Auto-trigger a system task on case creation

When a process needs a `taskRef`-source form task (or any system task) to be available from the moment the case is created, trigger it in the `caseEvents create post` action. This bootstraps the embedded form panel before any human task runs.

The `taskRef` field embeds a specific transition's form — but that transition must have been assigned and be active (i.e. its place must have a token) for the panel to render. For transitions that should always be active, feed a dedicated place from the submit transition with a regular arc and connect it to the always-on transition with a `read` arc (see §3.6). For transitions that need bootstrapping at case creation, fire them from `on_create`:

```xml
<caseEvents>
   <event type="create">
      <id>on_case_create</id>
      <actions phase="post">
         <action id="1"><![CDATA[
        // Fire the Form system task so the taskRef panel is immediately available
        async.run {
          assignTask("form_task")
          finishTask("form_task")
        }
      ]]></action>
      </actions>
   </event>
</caseEvents>
```

> ⚠️ Always use `async.run` for `assignTask`/`finishTask` inside case events — calling them synchronously during case creation causes concurrency conflicts.

The net must have a place with a token that enables `form_task` at case creation time (e.g. place `p_form` with `tokens=1` feeding into `form_task`).

#### Dynamic role assignment based on routing decision

Use `assignRole` in a finish post action to grant a specific process role to the currently logged-in user — for example, when a registration employee routes a request to a department, automatically assign the correct departmental role so that employee can now also access that department's tasks.

```groovy
// Registration finish post — assign role based on routing choice
department: f.department;
def roleMap = [
        "legal":   "lawyer",
        "finance": "finance_employee",
        "pr":      "pr_employee"
]
def roleId = roleMap[department.value]
if (roleId) {
   assignRole(roleId, petriNet)
}
```

`assignRole(roleId, petriNet)` assigns the role to the **currently logged-in user** for **this process**. Use `removeRole` symmetrically when a role should be revoked:

```groovy
removeRole("temp_reviewer", petriNet)
```

> Note: `assignRole` with `petriNet` grants the role process-wide (all cases of this process for that user). For per-case assignment, use a `user` field to store the assigned user and `assignTask(task, findUserByEmail(user_field.value))` to target specific tasks.

---

## 5. Workflow Patterns

**Legend:**
- `[place:tokens]` — place with initial token count (1 = start, 0 = all others)
- `[transition]` — transition (task)
- `→` — arc direction

---

### Pattern 1 — Simple Linear (Sequence)

Each step must complete before the next begins. Token moves forward one step at a time.

```
[start:1] → [submit] → [pending:0] → [review] → [reviewed:0] → [approve] → [done:0]
```

---

### Pattern 2 — Approval with Rejection (Human-assign XOR-split)

> ⚠️ **This pattern is valid ONLY when a human physically clicks "assign" to claim the task.** It relies on the assign action consuming the token — making this a human-driven choice, not a programmatic one. Do NOT generalize this to any fork where the routing should be determined by a field value or Groovy logic — use variable arcs (Pattern 13) or systematic tasks (Pattern 14) for those cases.

After review, exactly one of two paths is taken. In Petriflow's event-driven model this is safe: when a user **assigns** a task, they claim the token from the shared place — the other task becomes unavailable because the token is gone. Only the user who claimed the task can finish it.

```
                                     ┌→ [approve] → [approved:0]
[start:1] → [submit] → [pending:0] → [reviewed:0]
                                     └→ [reject]  → [rejected:0]
```

The `reviewed` place has two outgoing arcs. Whichever task the reviewer assigns first consumes the token — the other task is immediately disabled.

> **When to use variable arcs instead:** if the routing decision must be made programmatically (based on a field value, not a human choice at assign time), use variable arcs (Pattern 13) or systematic tasks (Pattern 14) instead. Variable arcs let you set exactly which path gets the token before the token even moves, eliminating any race between roles.

---

### Pattern 3 — Multi-Level Approval (Extended Sequence)

Sequential approvals by different roles. Each level is a separate transition with a different `roleRef`.

```
[start:1] → [submit] → [p0:0] → [manager_approve] → [p1:0] → [director_approve] → [done:0]
```

---

### Pattern 4 — AND-split / AND-join (Parallel)

All parallel branches must complete before the process continues. The split transition fires tokens into all parallel paths simultaneously. The join place collects all tokens before proceeding.

**Key:** Use a dedicated **split transition** (not a split place) to distribute tokens. The join place waits until it holds the required number of tokens from all parallel paths.

```
                              ┌→ [legal_p:0]   → [review_legal]   → [legal_done:0]   ─┐
[start:1] → [p0:0] → [split] →                                                         [join:0] → [finalize] → [done:0]
                              └→ [finance_p:0] → [review_finance] → [finance_done:0] ─┘
```

Arc setup:
- `split` has two outgoing arcs: to `legal_p` and to `finance_p`
- `legal_done` → `join` with `multiplicity=1`
- `finance_done` → `join` with `multiplicity=1`
- `join` → `finalize` fires when both tokens are present

---

### Pattern 5 — XOR-split / XOR-merge (Exclusive Choice)

Exactly one path is taken. The merge place simply collects whichever path arrived — no synchronization needed.

```
                   ┌→ [high_p:0] → [high_priority] → [high_done:0] ─┐
[start:1] → [p0:0] →                                                  [merge:0] → [finalize] → [done:0]
                   └→ [low_p:0]  → [low_priority]  → [low_done:0]  ─┘
```

The `p0` place has two outgoing arcs. Only one transition fires (the other is never enabled or is skipped via role/action logic). Both paths feed into `merge` — when either arrives, `finalize` can proceed.

> ⚠️ **Critical — XOR paths must reconverge at a shared place, never at a shared transition.**
>
> When two or more XOR branches (mutually exclusive paths) need to reach the same downstream task, both branch endings must arc into a **single shared merge place**. That place then has one arc to the downstream transition. **Never give the downstream transition two incoming arcs from two XOR branches** — a transition with N incoming regular arcs is an AND-join that requires N tokens simultaneously. Since XOR branches are mutually exclusive, only one branch ever receives a token, so the AND-join can never fire: the process is permanently stuck.
>
> **❌ Wrong — XOR branches share a transition (AND-join deadlock):**
> ```
>                    ┌→ [path_a:0] → [task_a] → [a_done:0] ─┐
> [start:1] → [fork] →                                         ├→ [finalize]  ← DEADLOCK
>                    └→ [path_b:0] → [task_b] → [b_done:0] ─┘
> ```
> `finalize` requires tokens from both `a_done` AND `b_done`. Only one ever arrives. The process is stuck forever.
>
> **✅ Correct — XOR branches share a merge place (XOR-merge):**
> ```
>                    ┌→ [path_a:0] → [task_a] → [a_done:0] ─┐
> [start:1] → [fork] →                                         → [merge:0] → [finalize]
>                    └→ [path_b:0] → [task_b] → [b_done:0] ─┘
> ```
> Both `a_done` and `b_done` arc into `merge`. Whichever branch ran produces one token in `merge`, which immediately enables `finalize`. This is always the correct pattern for XOR reconvergence.
>
> **This applies even when one branch is optional (skip path).** If a branch can be skipped entirely (e.g. finance review is conditional), the skip arc must also deliver a token to the shared merge place — not bypass the merge place entirely and jump straight to the final transition.
>
> **Token trace rule:** for every fork in your design, trace every possible execution path and confirm that each path delivers exactly one token to the merge place before the join transition. If any path skips the merge place, the design is wrong.

---

### Pattern 6 — OR-split / OR-join (Inclusive Choice)

One or more paths are activated based on a user's multichoice selection. All activated paths must complete before continuing.

In Petriflow, model OR-splits with **variable arcs** driven by `number` routing fields set from a multichoice field (see §3.6 and Pattern 13). Each selected branch gets a token; unselected branches get none. The join place accumulates exactly the tokens that were produced.

```
                              ┌─(ref: go_a, mult:0)──→ [path_a:0] → [task_a] → [a_done:0] ─┐
[start:1] → [p0:0] → [router] →                                                               [or_join:0] → [finalize] → [done:0]
                              └─(ref: go_b, mult:0)──→ [path_b:0] → [task_b] → [b_done:0] ─┘
```

The `router` finish `pre` action sets `go_a` and/or `go_b` to `1` (fire) or `0` (block). Each arc fires only when its referenced field equals `1`. The `or_join` place naturally accumulates exactly the tokens that were produced — when all activated branches deliver their token, `finalize` is enabled.

```groovy
// router finish PRE — set number routing fields from multichoice (1=fire, 0=block)
departments: f.departments,
go_a: f.go_a,
go_b: f.go_b;
def sel = departments.value as Set
change go_a value { sel.contains("dept_a") ? 1 : 0 }
change go_b value { sel.contains("dept_b") ? 1 : 0 }
```

For the join to work correctly, the `or_join` place must have one incoming arc per branch (each with `multiplicity=1`). The `finalize` transition fires once the number of tokens in `or_join` equals the number of activated branches.

**This is one of Petriflow's most powerful features:** the place-and-token model handles OR-join counting natively. The `finalize` transition has one incoming arc from `or_join` — but that arc's `multiplicity` can be set dynamically to match however many branches were activated, using the same variable arc mechanism.

#### OR-join with variable branch count — full recipe

When the number of active branches varies at runtime (e.g. the user may pick 1, 2, or 3 departments), track the expected count in a `number` field and use it as the multiplicity on the arc from `or_join` to `finalize`:

**Step 1 — Add a `branch_count` number field (init `0`):**

```xml
<data type="number"><id>branch_count</id><title>Active Branches</title><init>0</init></data>
```

**Step 2 — In the router's finish PRE action, count the selected branches and store it:**

```groovy
departments: f.departments,
go_a: f.go_a,
go_b: f.go_b,
go_c: f.go_c,
branch_count: f.branch_count;

def sel = departments.value as Set
change go_a value { sel.contains("dept_a") ? 1 : 0 }
change go_b value { sel.contains("dept_b") ? 1 : 0 }
change go_c value { sel.contains("dept_c") ? 1 : 0 }
change branch_count value { sel.size() as Double }
```

**Step 3 — Use `branch_count` as the variable arc reference on the join arc:**

```xml
<!-- Each branch delivers 1 token to or_join -->
<arc><id>arc_a_done_to_join</id><type>regular</type><sourceId>a_done</sourceId><destinationId>or_join</destinationId><multiplicity>1</multiplicity></arc>
<arc><id>arc_b_done_to_join</id><type>regular</type><sourceId>b_done</sourceId><destinationId>or_join</destinationId><multiplicity>1</multiplicity></arc>
<arc><id>arc_c_done_to_join</id><type>regular</type><sourceId>c_done</sourceId><destinationId>or_join</destinationId><multiplicity>1</multiplicity></arc>

        <!-- finalize fires only when or_join holds branch_count tokens -->
<arc>
<id>arc_join_to_finalize</id>
<type>regular</type>
<sourceId>or_join</sourceId>
<destinationId>finalize</destinationId>
<multiplicity>0</multiplicity>
<reference>branch_count</reference>
</arc>
```

When `branch_count = 2`, the `finalize` transition requires 2 tokens in `or_join` before it can fire — exactly matching the 2 activated branches. When `branch_count = 3`, it waits for all 3. This is purely declarative: no polling, no systematic check task, no extra places — just a variable arc on the join side consuming the exact count that was produced on the split side.

---

### Pattern 7 — Loop / Revision

A rejected submission returns to the submitter. An arc goes backward from the reviewed state to the submit transition (or a place before it).

```
[start:1] → [submit] → [pending:0] → [review] → [reviewed:0] → [approve] → [done:0]
                ↑                                     │
                └──────── [reject_for_revision] ───────┘
```

`reject_for_revision` takes the token from `reviewed` and puts it back before `submit`. Add a `revision_count` number field and increment it on each rejection.

---

### Pattern 8 — Escalation

If a task is not completed within an SLA window, a secondary path activates. Record timestamp on assign; check elapsed time on finish pre and reassign if breached (see action pattern in §4.6).

```
[start:1] → [submit] → [pending:0] → [review] → [under_review:0]
                                                      │
                                              [escalate] → [escalated:0] → [manager_review] → [done:0]
```

---

### Pattern 9 — Discriminator (First-one-wins)

Multiple parallel branches run, but the process continues as soon as the **first one** completes. The finish action of the winning branch cancels all others.

```
                   ┌→ [rev_a_p:0] → [review_a] → [a_done:0] ─┐
[start:1] → [split] →                                           [first_done:0] → [finalize] → [done:0]
                   └→ [rev_b_p:0] → [review_b] → [b_done:0] ─┘
```

```groovy
// On review_a finish post — cancel the other branch
def otherTask = findTask { qTask ->
   qTask.transitionId.eq("review_b").and(qTask.caseId.eq(useCase.stringId))
}
if (otherTask) cancelTask(otherTask)
```

---

### Pattern 10 — Voting / Consensus (N of M)

Multiple reviewers must vote. The process continues when a quorum is reached (e.g. 2 of 3).

Use a shared counter field incremented on each vote. When the counter reaches the quorum, cancel remaining tasks and proceed.

```
                   ┌→ [rev_a_p:0] → [review_a] ─┐
[start:1] → [split] → [rev_b_p:0] → [review_b] ─┤→ [voted:0] → [finalize] → [done:0]
                   └→ [rev_c_p:0] → [review_c] ─┘
```

```groovy
// On each review transition finish post
vote_count: f.vote_count;
def current = (vote_count.value as Integer) ?: 0
change vote_count value { (current + 1) as Double }

if (current + 1 >= 2) {
   findTasks { qTask ->
      qTask.caseId.eq(useCase.stringId)
              .and(qTask.transitionId.in(["review_a", "review_b", "review_c"]))
   }.each { t -> cancelTask(t) }
}
```

---

### Pattern 11 — Four-Eyes Principle

The same action must be confirmed by two **different** users. On the second approval's assign pre event, verify the user is not the same as the first approver.

```
[start:1] → [submit] → [p0:0] → [first_approval] → [p1:0] → [second_approval] → [done:0]
```

```groovy
// On first_approval finish post — record who approved
first_approver: f.first_approver;
change first_approver value { userService.loggedOrSystem.email }
```

```groovy
// On second_approval assign pre — block if same user
first_approver: f.first_approver;
def currentUser = userService.loggedOrSystem.email
if (currentUser == first_approver.value) {
   throw new java.lang.IllegalStateException("The second approver must be a different person.")
}
```

---

### Pattern 12 — Conditional Routing Based on Data

The path taken is determined by a field value set earlier. Use role logic, `make`, or a finish-post action to activate only the relevant next transition.

```
                   ┌→ [high_p:0]   → [high_value_review]   → [done:0]
[start:1] → [submit] → [routing:0]
                   └→ [normal_p:0] → [standard_review]     → [done:0]
```

```groovy
// On submit finish post — assign the relevant next task
amount: f.amount;
def isHighValue = (amount.value as java.lang.Double) > 10000
def transitionId = isHighValue ? "high_value_review" : "standard_review"
def nextTask = findTask { qTask ->
   qTask.transitionId.eq(transitionId).and(qTask.caseId.eq(useCase.stringId))
}
if (nextTask) assignTask(nextTask, findUserByEmail(isHighValue ? "director@example.com" : "manager@example.com"))
```

---

### Pattern 13 — Conditional Fork via Variable Arcs (Optional Branch)

Use this whenever a transition must route to **one of N next steps** depending on a data value. Variable arcs let the engine decide at runtime which path gets a token, based on a `number` field value.

> **Do NOT use two plain regular arcs from the same place without a `<reference>`.** Both downstream transitions become simultaneously enabled; the first to be claimed wins and the other remains permanently stuck.

**Full example — Registration Triage routing to Legal or directly to PR:**

```
Data fields:
  toLegal : number  (init 0)
  toPR    : number  (init 0)

Net structure — arcs leave FROM the transition directly to destination places:
  [registration_triage]
       ├─(ref: toLegal, mult: 0)──→ [after_legal:0] → [legal_task]
       └─(ref: toPR,    mult: 0)──→ [after_pr:0]    → [pr_task]
```

```xml
<!-- Number routing fields — value 1 = fire, value 0 = block -->
<data type="number"><id>toLegal</id><title>To Legal</title><init>0</init></data>
<data type="number"><id>toPR</id><title>To PR</title><init>0</init></data>

        <!-- Triage transition sets exactly one field to 1 in finish PRE phase -->
<transition>
<id>registration_triage</id>
...
<event type="finish">
   <id>on_triage_finish</id>
   <actions phase="pre">
      <action id="5"><![CDATA[
        toLegal: f.toLegal,
        toPR: f.toPR,
        legal_required: f.legal_required;
        if (legal_required.value == "yes") {
          change toLegal value { 1 }
          change toPR    value { 0 }
        } else {
          change toLegal value { 0 }
          change toPR    value { 1 }
        }
      ]]></action>
   </actions>
</event>
</transition>

        <!-- Variable arcs: type="regular", multiplicity=0 (placeholder), reference=number field -->
        <!-- Arc source is the TRANSITION, not a place -->
<arc>
<id>arc_triage_to_legal</id>
<type>regular</type>
<sourceId>registration_triage</sourceId>
<destinationId>after_legal</destinationId>
<multiplicity>0</multiplicity>
<reference>toLegal</reference>
</arc>

<arc>
<id>arc_triage_to_pr</id>
<type>regular</type>
<sourceId>registration_triage</sourceId>
<destinationId>after_pr</destinationId>
<multiplicity>0</multiplicity>
<reference>toPR</reference>
</arc>
```

When `toLegal = 1` → token goes to `after_legal`, enabling `legal_task`.
When `toPR = 1` → token goes to `after_pr`, enabling `pr_task` directly.
The arc whose field is `0` produces no token — that path is never enabled.

**Generalisation — N paths:** add one `number` field (init `0`) per path and one arc per path. In the routing action (always `phase="pre"`), set exactly one to `1` and all others to `0`.

**Combining with multichoice — OR-split:** set multiple number fields to `1` simultaneously. Each corresponding arc fires, enabling several parallel branches. Use an AND-join downstream to wait for all of them.

```groovy
// Example: multichoice "departments" with keys "legal", "finance", "pr"
toLegal: f.toLegal,
toFinance: f.toFinance,
toPR: f.toPR,
departments: f.departments;
def sel = departments.value as Set
change toLegal   value { sel.contains("legal")   ? 1 : 0 }
change toFinance value { sel.contains("finance") ? 1 : 0 }
change toPR      value { sel.contains("pr")      ? 1 : 0 }
```

---

### Pattern 14 — Systematic Tasks (Code-Driven Routing)

A **systematic task** is a transition assigned to the `system` role with no dataGroup. It has no visible form and no human performer. Its entire purpose is to be fired programmatically via `async.run { assignTask(...); finishTask(...) }` from another task's action — moving the token forward without any human interaction.

This is the **second major approach to conditional routing**, complementing variable arcs. Instead of the Petri net engine deciding which arc fires based on field values, an action explicitly fires the correct system task, which then moves the token to the right place.

**When to use systematic tasks vs. variable arcs:**

| | Variable arcs | Systematic tasks |
|---|---|---|
| Decision point | At arc evaluation time (when token arrives at place) | At action execution time (inside another task's finish) |
| Who decides | Net engine, based on boolean field value | Groovy action, any logic possible |
| Complexity | Simple binary or N-way boolean switch | Any Groovy condition: ranges, lookups, external calls |
| Async required | No | Yes — always use `async.run` |
| Visible in task list | No (arc, not a task) | Yes, briefly (system role task) |

**Full pattern — system tasks as routing nodes:**

```xml
<!-- System role definition -->
<role>
   <id>system</id>
   <title>System</title>
</role>

        <!-- Systematic task — no dataGroup, no label needed for users -->
<transition>
<id>route_to_legal</id>
<x>1072</x>
<y>208</y>
<label>To Legal</label>
<roleRef>
   <id>system</id>
   <logic><perform>true</perform></logic>
</roleRef>
<!-- no dataGroup -->
</transition>

<transition>
<id>route_to_pr</id>
<x>1072</x>
<y>400</y>
<label>To PR</label>
<roleRef>
   <id>system</id>
   <logic><perform>true</perform></logic>
</roleRef>
<!-- no dataGroup -->
</transition>
```

The routing decision happens in the preceding human task's finish post action:

```groovy
// t2 (Registration) finish post — fires the correct system task
number_0: f.number_0;
if ((number_0.value as Double) < 2000) {
   async.run {
      assignTask("route_to_legal")
      finishTask("route_to_legal")
   }
} else {
   async.run {
      assignTask("route_to_pr")
      finishTask("route_to_pr")
   }
}
```

> ⚠️ **Always wrap `assignTask`/`finishTask` calls in `async.run`** when calling them from inside another task's event action. Calling them synchronously from within an active task's action causes concurrency conflicts.

**Net structure with systematic tasks:**

```
[p3:0] ──→ [route_to_legal]  ──→ [p4:0] ──→ [legal_task]  ──┐
      └──→ [route_to_pr]     ──→ [p7:0] ──→ [pr_task]     ──┘→ [p5:0] → [finalize]
```

Both `route_to_legal` and `route_to_pr` have regular arcs from `p3`. Because only one gets fired by the action, only one token moves forward. The other system task is never assigned, so it never fires — the token in `p3` stays until the correct system task consumes it.

> **Both branches converge at the same place** (`p5` in the example above). This is a natural XOR-merge: whichever branch completes delivers its token to `p5`, enabling `finalize`. No synchronization needed since only one branch was ever active.

---

### Systematic task chain rule — every system task fires the next one

When multiple systematic tasks run in sequence (a processing pipeline), each one must fire the next from its own `finish post` action. **This pattern is recursive** — do not assume the chain continues automatically.

```
[submit] → [p1] → [t_system_1] → [p2] → [t_system_2] → [p3] → [t_system_3] → [p4] → [human_task]
```

Each system task's finish post action fires the next:

```xml
<!-- t_system_1 finish post fires t_system_2 -->
<event type="finish">
   <id>on_system_1_finish</id>
   <actions phase="post">
      <action id="N"><![CDATA[
      async.run {
        def t = findTask { qTask ->
          qTask.transitionId.eq("t_system_2").and(qTask.caseId.eq(useCase.stringId))
        }
        if (t) {
          assignTask(t, userService.loggedOrSystem)
          finishTask(t, userService.loggedOrSystem)
        }
      }
    ]]></action>
   </actions>
</event>

        <!-- t_system_2 finish post fires t_system_3 — same pattern -->
<event type="finish">
<id>on_system_2_finish</id>
<actions phase="post">
   <action id="N+1"><![CDATA[
      async.run {
        def t = findTask { qTask ->
          qTask.transitionId.eq("t_system_3").and(qTask.caseId.eq(useCase.stringId))
        }
        if (t) {
          assignTask(t, userService.loggedOrSystem)
          finishTask(t, userService.loggedOrSystem)
        }
      }
    ]]></action>
</actions>
</event>
```

> ⚠️ **Never leave a system task in the chain without a finish post action that fires the next one.** If a system task finishes but does not fire the next, the token moves to the next place — but that system task sits there permanently enabled, never firing, and the process is stuck waiting for a human trigger that will never come.

**Generation checklist for systematic task chains:**
- Every system task that has a successor system task must have a `finish post` action with `async.run { findTask → assignTask → finishTask }`.
- The last system task in a chain before a human task does **not** need to fire anything — the human task becomes available naturally when its input place receives the token.
- Bootstrapping the first system task (from case creation or from a human task's finish post) follows the same `async.run` pattern.

---

### Pattern 15 — `taskRef` Field (Embedded Task Panel)

A `taskRef` field holds a **`List<String>` of task string IDs** and renders each referenced task as an embedded form panel inline within the current task's UI. This is the primary UX tool for giving context to every actor in the workflow — e.g. always showing the original submitted form alongside whatever the current actor needs to fill.

**Two modes of use:**

#### Mode A — Static single task from the same process (`<init>`)

The simplest form: `<init>` contains a transition ID from the **same process**. The engine resolves it to the actual task instance at runtime.

```xml
<data type="taskRef">
   <id>taskRef_0</id>
   <title/>          <!-- usually empty — the embedded panel has its own title -->
   <init>t9</init>   <!-- transition ID of the task to embed; must exist in this process -->
</data>
```

- `<init>` holds a transition ID (not a task string ID) — the engine translates it to the live task in the current case instance.
- The referenced task (`t9`) must exist in the same process.
- The embedded task is typically a system-role task with fields set to `editable` — it acts as a shared data entry panel that multiple tasks can display.

> ⚠️ **Critical — only reference tasks that are permanently alive (always-enabled via `read` arc).**
>
> A `taskRef` renders an embedded panel only when the referenced task is currently active (its input place holds a token). If you point a `taskRef` at a task that has already fired and consumed its token — for example, referencing `manual_review` from the `case_detail` status view after `manual_review` has finished — the panel renders as blank or throws an error. The same applies to referencing the current task from within itself.
>
> **Valid `taskRef` targets:**
> - A dedicated system-role **Form task** on its own place, fed once at case creation via `caseEvents create post`, connected to that place via a `read` arc so it is always enabled.
> - Any task connected to its place via a `read` arc (permanently alive).
>
> **Invalid `taskRef` targets:**
> - A human task that is consumed by the flow (regular arc) — it becomes dead once finished.
> - The transition that contains the `taskRef` field — a task cannot embed itself.
> - A downstream task that has not yet fired.
>
> ```
> ❌ case_detail (taskRef → manual_review)   — manual_review is dead after it finishes
> ❌ submit_email (taskRef → submit_email)   — a task cannot reference itself
> ✅ case_detail (taskRef → form_task)       — form_task is on a read arc, permanently alive
> ```

**Usage — embed in any task as `visible`:**

```xml
<dataRef>
   <id>taskRef_0</id>
   <logic><behavior>visible</behavior></logic>
   <layout><x>0</x><y>4</y><rows>1</rows><cols>4</cols>
      <template>material</template><appearance>outline</appearance>
   </layout>
</dataRef>
```

**Typical structure — "Form" system task embedded everywhere:**

```
t9 (Form, system role, editable fields: name, email, request text)
  ↓ embedded via taskRef in:
  t1 (Submit — user fills the form here, taskRef shows t9 editable)
  t2 (Registration — sees submitted data, taskRef visible)
  t4 (Department — sees context, taskRef visible)
  t8 (Detail/Status view — always shows current state, taskRef visible)
```

The pattern creates a single source of truth for form data. The submitter fills it in `t1` (where `taskRef` is `editable`), and every subsequent actor sees the same fields read-only (where `taskRef` is `visible`).

> ⚠️ **`taskRef` targets must be permanently alive.** The checklist rule from §8 applies here: the referenced transition must always be enabled (via a `read` arc). Never point a `taskRef` at a human task that is consumed by normal flow — once that task fires and its token is consumed, the embedded panel goes blank or throws an error.
>
> **Loop workflows (Pattern 7) need special care:** if a process can loop back and re-enable an earlier task (e.g. a revision loop that re-enables the submit task), a `taskRef` pointing at that task will work correctly *during* the first pass but may reference a dead task between loop iterations while the token is elsewhere. Model the `taskRef` source as a dedicated `system`-role form task on a `read` arc instead — it stays alive regardless of where the main flow token is.

#### Mode B — Dynamic list of tasks from any process (action-set value)

For advanced cross-process scenarios, a `taskRef` field's value can be set programmatically to a `List<String>` of task string IDs retrieved via `findTasks`. Each task in the list renders as its own embedded panel — this enables "bulk review" UIs where an approver sees multiple child-process tasks side by side.

```groovy
// In a data event set (or any action) — populate taskRef with tasks from child cases
invoice_approvals: f.invoice_approvals,
children_invoice_cases: f.children_invoice_cases;

change invoice_approvals value {
   findTasks { it.caseId.in(children_invoice_cases.value).and(it.transitionId.eq("t2")) }
           ?.collect { it.stringId }
}
```

- `findTasks` returns task objects; `.collect { it.stringId }` extracts their string IDs into a `List<String>`.
- The `taskRef` field renders one embedded panel per ID in the list.
- The queried tasks can be in **any process** — not just the current one.
- This is typically triggered by a `data event type="set"` on a field that tracks child case IDs (see `caseRef` and the reactive cross-process pattern in §6.8).

---

### Pattern 15b — `caseRef` Field (Linked Case Tracker)

A `caseRef` field holds a **`List<String>` of case string IDs** and renders each as a linked case panel. It is the standard way to track a collection of child or related cases from within a parent process.

```xml
<data type="caseRef">
   <id>children_invoice_cases</id>
   <title>Invoice cases</title>
</data>
```

**`allowedNets` — restrict which processes can be linked:**

Use the `allowedNets` property in an action to limit which process identifiers are valid link targets. This is typically set once in the `caseEvents create post` action when the parent case is created.

```groovy
// caseEvents create post in parent process
children_invoice_cases: f.children_invoice_cases,
processId_invoice: f.processId_invoice;

change processId_invoice value { workspace + "invoice" }
change children_invoice_cases allowedNets { [processId_invoice.value] }
```

> ⚠️ `workspace` is a built-in variable available in **eTask** (Netgrif's hosted app). It returns the workspace prefix string used for process identifiers in that environment. If you are running a standalone NAE instance (not eTask), `workspace` may not be available — use the literal process identifier string instead (e.g. `"invoice"` not `workspace + "invoice"`).

**Reading and updating the list in actions:**

```groovy
// Add a new case ID if not already present
new_child_id: f.new_child_id,
children_invoice_cases: f.children_invoice_cases;

if (new_child_id.value !in children_invoice_cases.value) {
   change children_invoice_cases value { children_invoice_cases.value + new_child_id.value }
}
```

- `.value` on a `caseRef` field returns the current `List<String>` of case IDs (may be `null` initially — guard with `?: []`).
- Use list concatenation (`+`) to append; the result is a new list.
- The `caseRef` field renders each linked case as a navigable panel in the UI.

---

### Pattern 16 — Persistent Status / Detail View with `read` Arc

After a submission, the submitter (or any observer) needs a persistent view of the case state that is always accessible regardless of where the token currently is. This is modelled with:
1. A dedicated place `p_detail` fed by the submit transition (regular arc).
2. A `Detail` transition (role: `default` or `anonymous`) connected to `p_detail` via a **`read` arc**.
3. The `read` arc means the token is never consumed — `t_detail` remains permanently enabled.

```xml
<!-- Place fed once by submission -->
<place>
   <id>p_detail</id>
   <x>624</x><y>304</y>
   <tokens>0</tokens>
   <static>false</static>
</place>

        <!-- Regular arc: submit produces the detail token -->
<arc>
<id>arc_submit_to_detail</id>
<type>regular</type>
<sourceId>t_submit</sourceId>
<destinationId>p_detail</destinationId>
<multiplicity>1</multiplicity>
</arc>

        <!-- Read arc: detail view consumes nothing — always stays enabled -->
<arc>
<id>arc_detail_read</id>
<type>read</type>
<sourceId>p_detail</sourceId>
<destinationId>t_detail</destinationId>
<multiplicity>1</multiplicity>
</arc>
```

The `Detail` task can show: current status field, any completed outputs (initially `hidden`, revealed via `make` when available), the `taskRef` embedded form panel, timestamps, etc.

**Revealing fields in the detail view as the process progresses:**

Use `make` in a later task's finish action to change a field's behavior on `t_detail` from `hidden` to `visible`. This way the detail view is progressively enriched — the answer field only appears once Registration has filled it.

```groovy
// t5 (Registration answer) finish pre — reveal answer in detail view
t_detail: t.t8,
text_5: f.text_5,
text_6: f.text_6;
change text_6 value { "Request finished." }
make text_5, visible on t_detail when { true }
```

> Note: `when { true }` (without `return`) is valid shorthand when no condition is needed — the closure just returns the last expression.

---

### Pattern 17 — Combining Branching Patterns (The Full Toolkit)

Petriflow's branching power comes from combining four tools. Each solves a different problem; together they cover virtually any workflow topology.

#### The four tools at a glance

| Tool | What it does | When to use it |
|---|---|---|
| **Variable arcs** | Arc fires or not based on a `number` field value (`1` = fire, `0` = block) | Decision known at token-arrival time; clean net structure preferred; OR-split when multiple number flags are set to `1` |
| **Systematic tasks** | `system`-role transition fired programmatically via `async.run { assignTask; finishTask }` | Decision requires Groovy logic (range checks, lookups, external calls); many branches; complex conditions |
| **`taskRef` field** | Embeds another task's form panel inside the current task's UI | Persistent context — every actor sees the original submission data; single source of truth for form fields |
| **`read` arc + Detail task** | Non-consuming arc keeps a "status" task permanently enabled | Submitter/observer always has a live view; progressively revealed as process advances |

#### Branching is not limited to two paths

Both variable arcs and systematic tasks scale to N branches with no structural limit:

- **Variable arcs:** one `number` field (init `0`) + one variable arc per branch. Set any combination of flags to `1` — XOR (exactly one `1`), OR (multiple `1`s), or AND-split behavior all come from the same arc type, just different action logic. Never use `boolean` fields for arc references.
- **Systematic tasks:** one system transition per branch; the `if/else if/else` in the routing action can have as many arms as needed.

#### Combining multichoice with variable arcs = OR-split

```groovy
// User picks multiple departments from a multichoice field
// → variable arcs fire for each selected department simultaneously
// Always in finish phase="pre" so field values are set before arc evaluation
departments: f.departments,
to_legal: f.to_legal,
to_finance: f.to_finance,
to_pr: f.to_pr;
def sel = departments.value as Set
change to_legal   value { sel.contains("legal")   ? 1 : 0 }
change to_finance value { sel.contains("finance") ? 1 : 0 }
change to_pr      value { sel.contains("pr")      ? 1 : 0 }
```

All three arcs are evaluated — those whose referenced `number` field equals `1` fire in parallel. Use an AND-join place (Pattern 4) downstream to wait for all activated branches to complete before continuing.

#### Combining systematic tasks with range or lookup logic

```groovy
// Route based on numeric range — not possible with a simple boolean
number_0: f.number_0;
if ((number_0.value as Double) < 2000) {
   async.run { assignTask("to_first"); finishTask("to_first") }
} else {
   async.run { assignTask("to_second"); finishTask("to_second") }
}
```

The net structure: both `to_first` and `to_second` have regular arcs from the same place. Only one is ever fired by the action — the other's source place never loses its token, keeping that task disabled.

#### Full composite pattern — request workflow with all four tools

```
[start:1]
  → [t9: Form, system role]          ← taskRef source (embedded everywhere)
      → [p_submit:0]
          → [t1: Submit, user role]  ← pre: update status; post: token flows
              ├─→ [p2:0] → [t2: Registration, registration role]
              │              post: async routing fires t3 or t6
              │              pre: update status
              └─→ [p9:0] ──read──→ [t8: Detail, default role]
                                    (always on; fields revealed progressively via make)

[t2] → [p3:0]
  ├─regular──→ [t3: To First, system role] → [p4:0] → [t4: First Dept]  → [p5:0]
  └─regular──→ [t6: To Second, system role]→ [p7:0] → [t7: Second Dept] → [p5:0]
                                                                              ↓
                                                                    [t5: Registration Answer]
                                                                    pre: make text_5 visible on t8
```

Key observations from this structure:
- `t9` is a system-role transition that never fires in the normal flow — it exists solely as a `taskRef` target, giving every task a consistent embedded form panel.
- `t8` (Detail) is permanently accessible via the `read` arc from `p9`, which is fed once by `t1`.
- The fork at `p3` uses **systematic tasks** (`t3`/`t6`) with regular arcs — the action in `t2` fires exactly one of them.
- Status updates happen in `pre` phase so the Detail view is always current.
- `make` in `t5` pre-phase reveals the final answer field in `t8` once the process completes.

#### Decision guide — which branching tool to use?

```
Is the decision based on a simple field value (enumeration key, condition)?
  └─ Yes → Variable arcs (cleanest, no system task needed)
       Is only one path taken at a time?
         └─ Yes → XOR: set one number field to 1, all others to 0
         └─ No  → OR: set multiple number fields to 1 (use AND-join downstream)

Is the decision based on a numeric range, external lookup, or complex Groovy logic?
  └─ Yes → Systematic tasks
       How many branches?
         └─ 2–3 → if/else in one async.run block
         └─ 4+  → if/else if chain or map lookup to transition ID

Do you need persistent UX context (submitter always sees their form data)?
  └─ Yes → taskRef field pointing to a system-role Form task

Do you need an always-accessible status/tracking view?
  └─ Yes → Dedicated Detail task + read arc from a place fed by the submit transition
```

> **`boolean` fields are invalid as arc references.** Variable arc `<reference>` must always point to a `type="number"` field. The good-practice values are `1` (fire) and `0` (block), but technically any non-zero integer fires the arc and produces that many tokens. Stick to 0 and 1 for XOR routing — higher values are valid if you intentionally want to place multiple tokens (e.g. an AND-split that seeds a counter).

---

## 6. Inter-Process Communication

Petriflow processes are isolated instances. Communication between them happens through actions — one process creates, queries, or modifies another via `createCase`, `findCase`, `setData`, `assignTask`, and `finishTask`.

---

### 6.1 Spawning a Child Process

```groovy
// On submit finish post in parent process
child_case_id: f.child_case_id;

def child = createCase("child_process_id", "Child: ${useCase.title}", "blue")
change child_case_id value { child.stringId }

// Pre-fill fields in the child — resolve the task first
def childTask = findTask { qTask ->
   qTask.transitionId.eq("child_first_task").and(qTask.caseId.eq(child.stringId))
}
if (childTask) setData(childTask, [
        parent_reference: [value: useCase.stringId,                type: "text"],
        submitted_by:     [value: userService.loggedOrSystem.email, type: "text"]
])
```

---

### 6.2 Passing Data from Parent to Child

Use `setData` with a task object resolved from the child case. The transition ID must exist in the child process.

```groovy
child_case_id: f.child_case_id;

def child = findCase { qCase -> qCase.stringId.eq(child_case_id.value) }
if (child) {
   def childTask = findTask { qTask ->
      qTask.transitionId.eq("review_task").and(qTask.caseId.eq(child.stringId))
   }
   if (childTask) setData(childTask, [
           contract_value: [value: 15000.0,          type: "number"],
           request_type:   [value: "procurement",     type: "text"],
           parent_case_id: [value: useCase.stringId,  type: "text"]
   ])
}
```

---

### 6.3 Reading Data from Another Process

```groovy
source_case_id: f.source_case_id,
customer_name: f.customer_name,
customer_email: f.customer_email;

def source = findCase { qCase -> qCase.stringId.eq(source_case_id.value) }
if (source) {
   change customer_name  value { source.dataSet["customer_name"]?.value  ?: "" }
   change customer_email value { source.dataSet["customer_email"]?.value ?: "" }
}
```

---

### 6.4 Triggering a Task in Another Process

```groovy
child_case_id: f.child_case_id;

def child = findCase { qCase -> qCase.stringId.eq(child_case_id.value) }
if (child) {
   def childTask = findTask { qTask ->
      qTask.transitionId.eq("start_processing").and(qTask.caseId.eq(child.stringId))
   }
   if (childTask) {
      assignTask(childTask, userService.loggedOrSystem)
      finishTask(childTask)
   }
}
```

---

### 6.5 Waiting for a Child Process to Complete

**Option A — Parent polls on demand (manual check transition):**

```groovy
child_case_id: f.child_case_id,
child_status: f.child_status;

def child = findCase { qCase -> qCase.stringId.eq(child_case_id.value) }
if (child) {
   change child_status value { child.dataSet["status"]?.value ?: "unknown" }
}
```

**Option B — Child notifies parent on its finish event:**

In the child process, place this in the **last transition's** `finish post` event — `caseEvents` does not support a `finish` type; only `create` and `delete` are valid there.

```groovy
parent_case_id: f.parent_case_id;

def parent = findCase { qCase -> qCase.stringId.eq(parent_case_id.value) }
if (parent) {
   def resultTask = findTask { qTask ->
      qTask.transitionId.eq("check_child_result").and(qTask.caseId.eq(parent.stringId))
   }
   if (resultTask) setData(resultTask, [
           child_completed: [value: true,       type: "boolean"],
           child_result:    [value: "approved", type: "text"]
   ])

   // Optionally advance the parent by finishing its waiting task
   def waitingTask = findTask { qTask ->
      qTask.transitionId.eq("wait_for_child").and(qTask.caseId.eq(parent.stringId))
   }
   if (waitingTask) {
      assignTask(waitingTask, userService.loggedOrSystem)
      finishTask(waitingTask)
   }
}
```

---

### 6.6 Cascade Updates to All Child Cases

```groovy
// Parent case finish post
status: f.status;

def children = findCases { qCase ->
   qCase.dataSet["parent_case_id"].value.eq(useCase.stringId)
}
children.each { child ->
   def childTask = findTask { qTask ->
      qTask.transitionId.eq("review_task").and(qTask.caseId.eq(child.stringId))
   }
   if (childTask) setData(childTask, [
           parent_status:    [value: status.value,         type: "text"],
           parent_closed:    [value: true,                 type: "boolean"],
           parent_closed_at: [value: new java.util.Date(), type: "dateTime"]
   ])
}
```

---

### 6.7 Aggregation Across All Instances

```groovy
total_amount: f.total_amount,
approved_count: f.approved_count,
pending_count: f.pending_count;

def all = findCases { qCase -> qCase.processIdentifier.eq("expense_request") }
def total = 0.0; def approved = 0; def pending = 0

all.each { c ->
   def amt    = c.dataSet["amount"]?.value
   def status = c.dataSet["status"]?.value
   if (amt)                 total    += (amt as java.lang.Double)
   if (status == "approved") approved++
   if (status == "pending")  pending++
}
change total_amount   value { total }
change approved_count value { approved as java.lang.Double }
change pending_count  value { pending  as java.lang.Double }
```

---

### 6.8 Reactive Cross-Process Pattern (Child Writes → Parent Reacts)

The most powerful inter-process pattern combines `setData` with a `data event type="set"` in the parent process. When a child process writes a value into a parent field via `setData`, the parent's `set` event fires automatically — enabling the parent to react without polling.

**How the three-step chain works:**

```
1. Child finishes a task (e.g. Register Invoice)
       ↓  finish post action calls setData on parent's "new_invoice_id" field
2. Parent's "new_invoice_id" data event set fires automatically
       ↓  updates children_invoice_cases list and refreshes taskRef
3. Parent's taskRef field (invoice_approvals) now shows the new child task embedded
```

**Step 1 — Child writes to parent field (invoice.xml, Register Invoice finish post):**

```groovy
invoice_id: f.invoice_id,
parent_order_id: f.parent_order_id;

// Find the parent case by ID (stored in parent_order_id field of this invoice)
def parent_order_case = findCase({ it._id.eq(parent_order_id.value) })

// Write this invoice's ID into the parent's "new_invoice_id" field via shorthand setData
setData("t1", parent_order_case, ["new_invoice_id": ["value": invoice_id.value, "type": "text"]])
```

> The shorthand `setData("transition_id", caseObject, map)` is used here — the engine resolves the task from the given case automatically.

**Step 2 — Parent reacts to the write (order.xml, data event set on new_invoice_id):**

```groovy
invoice_approvals: f.invoice_approvals,
children_invoice_cases: f.children_invoice_cases,
new_invoice_id: f.new_invoice_id;

// Add to tracked list only if not already present
if (new_invoice_id.value !in (children_invoice_cases.value ?: [])) {
   change children_invoice_cases value { (children_invoice_cases.value ?: []) + new_invoice_id.value }
}

// Refresh the taskRef to show all child invoice approval tasks
change invoice_approvals value {
   findTasks { it.caseId.in(children_invoice_cases.value).and(it.transitionId.eq("t2")) }
           ?.collect { it.stringId }
}
```

**Step 3 — Parent dynamically populates the options dropdown in child (invoice.xml, Register Invoice assign pre):**

When the child process opens its registration task, it can query the parent process in real time to populate a selection field with all available parent cases:

```groovy
parent_order_id: f.parent_order_id;

def orders = findCases { it.processIdentifier.eq("order") }
        .collectEntries { [(it.stringId): "Order: " + it.stringId] }

change parent_order_id options { orders }
```

> This runs in `assign pre` (before the task form opens) so the dropdown is fresh every time the task is opened.

**Key design decisions in this pattern:**

| Decision | Reason |
|---|---|
| Write via `setData` from child to parent (not the reverse) | Child knows its own data and which parent it belongs to; parent doesn't need to poll |
| Use `data event type="set"` in parent, not a transition action | The event fires automatically on every write — works even if multiple children write concurrently |
| Use `caseRef` to track child case IDs | Native type; `.value` gives a `List<String>` that works directly with `findTasks { it.caseId.in(...) }` |
| Populate dropdown in `assign pre` not at case creation | Orders may be created after the invoice process starts; `assign pre` always reflects current state |

---

## 7. Rules & Gotchas

This section is the single source of truth for everything that causes generation failures.

---

### Variable arc `init 0` + place `tokens 0` — task prematurely enabled at process start

When a variable arc has `<reference>fieldId</reference>` and that field has `<init>0</init>`, the arc's effective multiplicity at process start is `0`. A Petri net arc with weight `0` is treated as **not consuming or producing any tokens**, which means the downstream transition sees its incoming place as **not requiring a token to fire** — it becomes enabled immediately, even before any token has arrived there.

**Consequence:** any transition connected to a variable-arc place with `init 0` will appear as an available task the moment the process is created — before any preceding step has been completed. In the builder modeller this shows as `(0)` on the arc label.

**This is not a builder display bug — it is a real runtime problem.** The task is genuinely executable from process start.

**The fix:** ensure that every place feeding a variable-arc transition starts with `<tokens>0</tokens>` **and** that the only way a token reaches it is by the preceding routing transition firing. Because the variable arcs originate from the routing transition (not from the intermediate place), the downstream task only becomes live after the routing transition fires and deposits a token in the target place. This is correct by design — **do not attach variable arcs from the intermediate place**; attach them directly from the routing transition. See §3.6 for the correct recipe.

If a transition should only be reachable after a prior step, verify:
1. The transition has no variable-arc source with `init > 0` pointing to a place that already holds tokens.
2. The place feeding the transition starts with `<tokens>0</tokens>`.
3. The only arc feeding that place is a variable arc **from the routing transition** (not from another place).

---

### Rejection branches must route to a place, not end silently — and the place needs no active task

When a manager (or any actor) can **reject** a request and that rejection should terminate the process, the routing action sets the rejection flag (`to_rejection = 1`) and the variable arc deposits a token in a `p_rejected` terminal place. This is correct. However, two common mistakes occur:

1. **No variable arc for rejection is declared at all.** If the decision field has a "reject" option but there is no `to_rejection` field, no variable arc referencing it, and no destination place for rejection, the token simply disappears — the process silently stalls. Every decision outcome that is modelled in a `manager_decision` enumeration **must have** a corresponding routing number field, a variable arc, and a destination place.

2. **The rejection place has no human task and no `read` arc task — which is correct for a terminal end state.** A terminal place (e.g. `p_rejected`, `p_approved`) does not need a transition. It simply holds the token as a record that the process ended in that state. Do not add a dummy "Rejected" transition unless there is a real user action needed there (e.g. an employee acknowledgement task). If only a status update is needed, do it in the routing action's `phase="pre"` before the token moves.

**Checklist:** for every `enumeration` or `enumeration_map` decision field with N options, verify there are exactly N routing `number` fields, N variable arcs from the routing transition, and N destination places.

---

### Arithmetic operators in Groovy CDATA must be plain text — never HTML entities or Markdown

When an LLM generates XML and the action code contains arithmetic, the `*` character can be silently transformed into HTML italic markup (`<em>...</em>`) or other Markdown/HTML representations before the XML is written. Inside a `<![CDATA[ ... ]]>` block the engine expects raw Groovy source — any HTML tags cause a compile error in eTask.

**Symptom:** eTask reports a compilation or parse error on an action that looks correct in the guide. When you inspect the raw XML the multiplication line reads:

```
(1000 <em> 60 </em> 60 * 24)
```

instead of:

```
(1000 * 60 * 60 * 24)
```

**Rule:** always write arithmetic operators as plain ASCII characters inside CDATA. Never use HTML entities (`&times;`, `&amp;`, `&#42;`) or let any Markdown renderer transform them. The characters `*`, `/`, `%`, `+`, `-`, `<`, `>` must appear literally. The only escaping allowed in CDATA is the `]]>` sequence terminator — everything else is raw text.

**Pre-generation check:** scan every `<![CDATA[ ... ]]>` block for `<em>`, `&times;`, `&#`, or any HTML/XML tag characters that are not part of a string literal or comment. Replace with the plain operator.

---

### Empty `<component>` blocks cause builder and eTask bugs

A `<dataRef>` that references a field with no meaningful component must either:
- have the correct `<component><name>...</name></component>` set on the `<data>` definition (e.g. `textarea` for multi-line text), **or**
- omit the `<component>` block entirely.

An empty `<component/>` or `<component></component>` on a data field definition causes silent failures in the builder and renders the field non-functional in eTask. Never emit an empty component element.

---

### Never use plain regular arcs without `<reference>` for a conditional (XOR) fork

```xml
<!-- ❌ Wrong — both transitions become enabled simultaneously; one will block forever -->
<arc><sourceId>after_triage</sourceId><destinationId>legal_task</destinationId><multiplicity>1</multiplicity></arc>
<arc><sourceId>after_triage</sourceId><destinationId>pr_task</destinationId><multiplicity>1</multiplicity></arc>

        <!-- ✅ Correct — regular arcs with <reference> to a number field; only the arc whose
             field == 1 fires at runtime. multiplicity=0 is a static placeholder. -->
<arc>
<id>arc_to_legal</id>
<type>regular</type>
<sourceId>registration_triage</sourceId>   <!-- source is the TRANSITION, not a place -->
<destinationId>after_legal</destinationId>
<multiplicity>0</multiplicity>
<reference>toLegal</reference>   <!-- number field set to 1 (fire) or 0 (block) in pre action -->
</arc>
<arc>
<id>arc_to_pr</id>
<type>regular</type>
<sourceId>registration_triage</sourceId>
<destinationId>after_pr</destinationId>
<multiplicity>0</multiplicity>
<reference>toPR</reference>
</arc>
```

See §3.6 (Variable arcs) and Pattern 13 for the full recipe.
---

### `<caseEvents>` only supports `create` and `delete`

```xml
<!-- ❌ Wrong — 'finish' is not a valid case event type -->
<caseEvents>
   <event type="finish">...</event>
</caseEvents>

        <!-- ✅ Correct — only create and delete -->
<caseEvents>
<event type="create">...</event>
</caseEvents>
```

The `finish` event type exists **only on transitions** (`<event type="finish">` inside `<transition>`), not on cases.

---

### Arc flow must strictly alternate

```xml
<!-- ❌ Wrong: transition directly to transition -->
<arc><sourceId>submit</sourceId><destinationId>approve</destinationId></arc>

        <!-- ✅ Correct: place in between -->
<arc><sourceId>submit</sourceId><destinationId>pending</destinationId></arc>
<arc><sourceId>pending</sourceId><destinationId>approve</destinationId></arc>
```

---

### Exactly one start place

```xml
<!-- ❌ Wrong -->
<place><id>start1</id><tokens>1</tokens></place>
<place><id>start2</id><tokens>1</tokens></place>

        <!-- ✅ Correct -->
<place><id>start</id><tokens>1</tokens></place>
<place><id>pending</id><tokens>0</tokens></place>
```

---

### Every element must be connected

Every place and transition must have at least one incoming and one outgoing arc — except the start place (outgoing only) and end place (incoming only).

---

### All IDs must be unique across the entire document

Includes roles, data fields, transitions, places, arcs, dataGroups, events, and actions. Use lowercase with underscores.

```xml
<!-- ❌ Wrong: typo in reference -->
<data><id>employee_name</id></data>
<dataRef><id>employe_name</id></dataRef>

        <!-- ✅ Correct -->
<data><id>employee_name</id></data>
<dataRef><id>employee_name</id></dataRef>
```

---

### Action IDs are globally unique (not per-block)

```xml
<!-- ❌ Wrong: id="1" reused in two places -->
<action id="1">...</action>
<action id="1">...</action>

        <!-- ✅ Correct: sequential across the whole document -->
<action id="1">...</action>
<action id="2">...</action>
<action id="3">...</action>
```

---

### Element order is strict

1. Metadata (`id`, `version`, `initials`, `title`, …)
2. `<role>`
3. `<data>`
4. `<transition>`
5. `<place>`
6. `<arc>`
7. `<caseEvents>` ← **must be last**

---

### `<roleRef><logic>` only uses perform / cancel / delegate

```xml
<!-- ❌ Wrong -->
<roleRef><id>role_id</id><logic><view>true</view><perform>true</perform></logic></roleRef>

        <!-- ✅ Correct -->
<roleRef><id>role_id</id><logic><perform>true</perform></logic></roleRef>
```

---

### Transitions must have a roleRef

```xml
<!-- ❌ Wrong -->
<transition><id>submit</id><label>Submit</label></transition>

        <!-- ✅ Correct -->
<transition>
<id>submit</id>
<label>Submit</label>
<roleRef><id>employee</id><logic><perform>true</perform></logic></roleRef>
</transition>
```

---

### Transition events are direct children of `<transition>`

```xml
<!-- ❌ Wrong -->
<transition>
   <transitionEvents>
      <event type="finish">...</event>
   </transitionEvents>
</transition>

        <!-- ✅ Correct -->
<transition>
<id>approve</id>
<event type="finish">...</event>
</transition>
```

---

### `<role>` not `<processRole>`

`<processRole>` does not exist. Always use `<role>`.

---

### Validations format

```xml
<!-- ❌ Wrong: CDATA-based -->
<validation><expression><![CDATA[ return value ==~ /regex/ ]]></expression></validation>

        <!-- ✅ Correct: plain regex prefix -->
<validations>
<validation>
   <expression>regex ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$</expression>
   <message>Please enter a valid email address</message>
</validation>
</validations>
```

---

### Special XML characters must be escaped — in ALL text content

| Character | Escaped form |
|-----------|---------|
| `&` | `&amp;` |
| `<` | `&lt;` |
| `>` | `&gt;` |

This applies to **every XML text node without exception**: `<title>`, `<label>`, `<placeholder>`, `<desc>`, `<value>`, `<message>`, option display text inside `<option key="...">`, and any other element whose content is human-readable text.

> ⚠️ **The `&` character is the most common offender.** Field titles like "Confidence & Reasoning", "Terms & Conditions", "Name & Address", or option labels like "SK & CZ" will cause an XML parse error at import time if the `&` is not escaped. Every single `&` in any text content must become `&amp;`.

```xml
<!-- ❌ Wrong — & in field title causes XML parse error at import -->
<data type="text">
   <id>confidence_reasoning</id>
   <title>Confidence & Reasoning</title>
</data>

        <!-- ❌ Wrong — & in option label -->
<option key="sk_cz">SK & CZ</option>

        <!-- ❌ Wrong — & in transition label -->
<transition>
<id>review_routing</id>
<label>Review & Routing</label>
...
</transition>

        <!-- ✅ Correct — & escaped everywhere -->
<data type="text">
<id>confidence_reasoning</id>
<title>Confidence &amp; Reasoning</title>
</data>

<option key="sk_cz">SK &amp; CZ</option>

<transition>
<id>review_routing</id>
<label>Review &amp; Routing</label>
...
</transition>
```

**Pre-generation scan rule:** before outputting XML, search every `<title>`, `<label>`, `<placeholder>`, `<desc>`, `<value>`, `<message>`, and `<option>` text for the characters `&`, `<`, `>`. Escape every occurrence. Do not rely on "it probably doesn't have special characters" — scan explicitly.

---

### Groovy: use comma between imports, semicolon only at the end

```groovy
// ❌ Wrong — semicolon after every variable
status: f.status;
approved_by: f.approved_by;
t_submit: t.submit_request;

// ✅ Correct — comma between variables, one semicolon at the end
status: f.status,
approved_by: f.approved_by,
t_submit: t.submit_request;

// ✅ Single variable — semicolon at the end
status: f.status;
change status value { "Approved" }
```

---

### Groovy: `replaceAll()` anchors `^` and `$` do not work as expected without flags

Java/Groovy's `String.replaceAll()` runs in single-line mode by default. The `^` anchor matches only the very start of the entire string and `$` only the very end. This means patterns like `replaceAll("^```json", "")` silently do nothing when the fence is not literally the first character of the string (e.g. there is leading whitespace, or the model wrapped the response).

**This is the most common cause of `JsonParseException` when parsing LLM responses.**

```groovy
// ❌ Wrong — ^ and $ anchors silently fail if content has leading whitespace or newlines
// Also wrong: double-quoted strings let Groovy interpolate $ before the regex engine sees it
def cleaned = content.replaceAll("^```json", "").replaceAll("^```", "").replaceAll("```$", "").trim()
// Result: JsonSlurper blows up because the fences were never removed

// ✅ Correct — single-quoted strings + (?m) multiline flag
def cleaned = content
        .replaceAll('(?m)^```(?:json)?\\s*', '')
        .replaceAll('(?m)^```\\s*$', '')
        .trim()
```

**Two rules to remember:**
- Use **single-quoted strings** `'...'` for all regex patterns in Groovy. Double-quoted strings interpolate `$` and `\` before passing the string to the regex engine, silently breaking your pattern.
- Use `(?m)` (multiline) not `(?s)` (dotall) when you want `^` and `$` to match line boundaries. `(?s)` only affects how `.` handles newlines — it does nothing to anchor behaviour.

> **Best practice:** if calling OpenAI or a compatible API, pass `response_format: [type: "json_object"]` in the request payload — this forces the model to return raw JSON with no fences, eliminating the stripping step entirely.

---

### Groovy: never use `f.field_id` directly inside the action body

`f.field_id` is only valid in the **import header** (the line that binds a local variable name to the field). Inside the action body — conditions, `change`, `make`, string interpolation — always use the **local variable** declared in the import.

Using `f.field_id` directly in the body bypasses the import binding and causes a runtime null-pointer error.

```groovy
// ❌ Wrong — f.has_attachment referenced directly in the body without import
if (f.has_attachment.value == true) {
   // runtime error: f.has_attachment is not a bound variable here
}

// ❌ Wrong — f.processing_status used directly in a change call
change f.processing_status value { "Processing" }

// ✅ Correct — import first, then use the local variable name
has_attachment: f.has_attachment,
processing_status: f.processing_status;
if (has_attachment.value == true) {
   change processing_status value { "Attachment received" }
} else {
   change processing_status value { "No attachment - OCR skipped" }
}
```

**Rule:** `f.` belongs only on the **left side of the colon** in import lines. Anywhere else in the action body → use the bare local variable name.

---

### Groovy: always import every field and transition before use

Every identifier accessed in an action body — whether read, written, interpolated into a string, passed as an argument, or used in a condition — must be declared in the import header. Missing a single import causes a silent null-pointer or runtime error.

**Fields:** import with `fieldId: f.fieldId`
**Transitions:** import with `tVar: t.transition_id` (required when using `make ... on tVar`)

```groovy
// ❌ Wrong — go_to_legal and go_to_pr changed but not imported
legal_required: f.legal_required,
request_status: f.request_status;
if (legal_required.value == "yes") {
   change go_to_legal value { 1 }          // ← not imported → runtime error
}

// ✅ Correct — every identifier used in the body is in the import list
// Note: go_to_legal and go_to_pr must be type="number" fields (not boolean) — used as variable arc references
email: f.email,
legal_required: f.legal_required,
go_to_legal: f.go_to_legal,
go_to_pr: f.go_to_pr,
request_status: f.request_status;
if (legal_required.value == "yes") {
   change go_to_legal value { 1 }
   change go_to_pr    value { 0 }
} else {
   change go_to_legal value { 0 }
   change go_to_pr    value { 1 }
}
sendEmail([email.value], "Subject", "Body")
```

**Pre-generation checklist for every action (also in §4.2):**
1. Find every field: `change X`, `X.value`, `[X.value]`, `"${X.value}"` → must import `X: f.X`
2. Find every transition: `make Y ... on tVar` → must import `tVar: t.transition_id`
3. All imports separated by commas, one semicolon at the very end of the import block.

---

### Groovy: `make` targets one transition per call

```groovy
// ❌ Wrong — list not supported
make comment, visible on [t_review, t_approve] when { return true }

// ✅ Correct — one call per transition
t_review: t.review,
t_approve: t.approve,
comment: f.comment;
make comment, visible on t_review  when { true }
make comment, visible on t_approve when { true }
```

**`make ... on transitions` — use with caution**

The keyword `transitions` applies the behavior to **every transition in the process**. This is rarely what you want and can silently override carefully set per-task behaviors:

```groovy
// ❌ Dangerous — hides the field on ALL tasks including ones where it should be visible
comment: f.comment;
make comment, hidden on transitions when { true }

// ✅ Safer — explicitly target only the transitions where hidden is correct
t_submit: t.submit_request,
t_status: t.status_view,
comment: f.comment;
make comment, hidden on t_submit  when { true }
make comment, hidden on t_status  when { true }
```

Only use `on transitions` when you genuinely want a global behavior change — e.g. hiding an internal field on all public-facing tasks when a certain flag is set. Always verify it does not override a `visible` or `editable` behavior set on specific transitions.

---

### Groovy: use `setData()` inside `async.run`, not `change`

Inside `async.run`, `change` does not work. Use `setData` with a task object resolved via `findTask`.

```groovy
// ❌ Wrong
async.run { result: f.result; change result value { "Done" } }

// ✅ Correct
async.run {
   def t = findTask { qTask ->
      qTask.transitionId.eq("transition_id").and(qTask.caseId.eq(useCase.stringId))
   }
   if (t) setData(t, [result: [value: "Done", type: "text"]])
}
```

---

### Groovy: cast numbers before comparison or arithmetic

```groovy
// ❌ Wrong
if (amount.value > "1000") { }

// ✅ Correct
if ((amount.value as Double) > 1000) { }
```

---

### Groovy: null-check before reading field values

```groovy
// ❌ Wrong
def value = useCase.getDataField("field_id").value

// ✅ Correct
if (useCase.dataSet.containsKey("field_id")) {
   def value = useCase.getDataField("field_id").value
}
```

---

### Groovy: `task` is not available in case events

```groovy
// ❌ Wrong — task is null/unavailable in caseEvents
<caseEvents> → action → task.stringId

// ✅ Correct — use useCase
        <caseEvents> → action → useCase.stringId
```

---

## 8. Generation Checklist

**Request analysis**
- [ ] Identified workflow type (approval, request, ticket, …)
- [ ] **Process type classified** (Type 1–6 from §1 taxonomy): internal / eForm / automation / mixed / hybrid eForm+automation / full hybrid
- [ ] Listed all roles (who does what) — include `system` role if any automation steps exist
- [ ] Listed all data fields (what info is collected)
- [ ] Mapped out steps and branching
- [ ] Decided: public/anonymous access? → `<anonymousRole>true</anonymousRole>` + `anonymous` roleRefs
- [ ] Decided: all logged-in users see everything? → `<defaultRole>true</defaultRole>`
- [ ] `anonymous` and `default` are built-in — do NOT declare them as `<role>` elements

**Structure**
- [ ] Element order: metadata → roles → data → transitions → places → arcs → caseEvents
- [ ] `<caseEvents>` is the last element in the document
- [ ] Namespace declaration present on `<document>` tag

**Metadata**
- [ ] `<id>` is unique, lowercase_underscore
- [ ] `<initials>` is 2–4 uppercase letters
- [ ] `<defaultRole>`, `<anonymousRole>`, `<transitionRole>` set correctly for access model
- [ ] `<anonymousRole>true</anonymousRole>` present if any task uses `roleRef id="anonymous"`

**Places & arcs**
- [ ] Exactly one place has `<tokens>1</tokens>` — all others `<tokens>0</tokens>`
- [ ] Arc pattern strictly alternates: Place → Transition → Place — no P→P or T→T
- [ ] No orphan places or transitions (every element has at least one arc except start/end)
- [ ] End place has incoming arc only — no outgoing arc required
- [ ] Always-on tasks (e.g. Detail/status view): submit transition feeds a dedicated place via regular arc; that place connects to the always-on task via `type="read"` arc — there is no `<static>true</static>` tag in Petriflow, all places use `<static>false</static>`

**Routing & branching**
- [ ] Conditional (XOR) forks use **variable arcs** OR **systematic tasks** — never two plain regular arcs (without `<reference>`) from the same place
- [ ] Variable arc forks: one `number` field (init `0`) per path; routing action (`phase="pre"`) sets exactly one to `1`, all others to `0`; arcs use `type="regular"`, `<multiplicity>0</multiplicity>`, `<reference>field_id</reference>`, source is the **transition** (not a place). **`boolean` fields are invalid as arc references — always use `number`.**
- [ ] **Variable arc source is always a Transition, never a Place.** A Place→Place arc with a `<reference>` violates the P→T→P rule and causes the builder import error: `Error: Could not find nodes <place_id>-><place_id> of arc <arc_id>`. Variable arcs jump from the routing transition **directly** to the destination places — there is no intermediate place between the routing transition and those destination places. The `(0)` label the modeller shows on variable arcs at import time is normal — it reflects `<init>0</init>` and is overwritten at runtime by the `phase="pre"` action.
- [ ] **Every decision field option has a routing field, a variable arc, and a destination place.** For each `enumeration`/`enumeration_map` field used for routing, count the options: there must be exactly that many `number` routing fields (`init 0`), that many variable arcs from the routing transition, and that many destination places. A missing rejection path causes a silent stall.
- [ ] Systematic tasks: `system` role, no `<dataGroup>`, fired via `async.run { assignTask(...); finishTask(...) }`
- [ ] `async.run` used for every `assignTask`/`finishTask` called from inside another task's event action
- [ ] **Systematic task chains:** every system task that has a successor system task has a `finish post` action firing the next one via `async.run { findTask → assignTask → finishTask }` — no system task in a chain is left without this action
- [ ] Persistent detail view: submit feeds a place via regular arc; detail task uses `read` arc from that place
- [ ] `taskRef` field: `<init>` holds the exact transition ID of the embedded task; that transition exists in the same process
- [ ] **`taskRef` target is permanently alive** — referenced transition must be on a `read` arc (always enabled). Never point a `taskRef` at a human task that is consumed by normal flow (it becomes dead after finishing), and never reference the containing transition itself.

**Transitions**
- [ ] Every transition has `<id>`, `<x>`, `<y>`, `<label>`, `<priority>`, and at least one `<roleRef>`
- [ ] `<priority>` set intentionally — `1` = shown first (main task); Detail/status tasks use a higher number (e.g. `2`) to appear below the primary task
- [ ] `<roleRef><logic>` uses only `<perform>`, `<cancel>`, `<delegate>` — never `<view>`
- [ ] Events are direct children of `<transition>` — no `<transitionEvents>` wrapper
- [ ] **Exactly one `<dataGroup>` per transition** — the builder silently ignores all groups after the first; use `<divider>` elements inside the single group to create visual section breaks, each with a unique `<id>` and a `<y>` row that continues the grid sequence

**Roles & fields**
- [ ] All roles declared with `<role>` — never `<processRole>`
- [ ] `system` role declared if any systematic tasks exist
- [ ] `anonymous` and `default` roles referenced only in `<roleRef>` — they are not declared as `<role>` elements (they are built-in)
- [ ] All selection fields (`enumeration`, `multichoice`, etc.) include `<options>`
- [ ] Single-selection default: `<init>key</init>`; multi-selection defaults: `<inits><init>key</init>…</inits>`
- [ ] Validations: `<expression>regex …</expression>` or `<expression>inrange x,y</expression>` — no CDATA — always paired with `<message>`
- [ ] No `<data>` element has an empty `<component/>` — either set `<name>textarea</name>` / `<name>list</name>` / `<name>preview</name>` or omit entirely

**IDs & references**
- [ ] All IDs (roles, data, transitions, places, arcs, dataGroups, events, actions) are unique across the entire document
- [ ] All IDs use lowercase_underscore
- [ ] Every `<dataRef>` ID matches a declared `<data>` ID
- [ ] Every `<roleRef>` ID matches a declared `<role>` ID — or is `anonymous`/`default` (built-in)
- [ ] Every arc `sourceId`/`destinationId` matches a real place or transition ID

**Actions**
- [ ] All action `id` values are globally unique and sequential across the whole document (never restart at 1, never use placeholder values like `"N"`)
- [ ] All action code wrapped in `<![CDATA[ … ]]>`
- [ ] **No HTML tags or entities inside CDATA blocks** — arithmetic operators (`*`, `/`, `%`, `<`, `>`) must be plain ASCII characters. LLM output can silently transform `*` into `<em>...</em>` or `&times;`. Scan every CDATA block for `<em>`, `&times;`, `&#`, or any tag-like content that is not part of a string literal; replace with the bare operator character.
- [ ] **Every field used anywhere in the body** (`change X`, `X.value`, `[X.value]`, `"${X.value}"`, conditions) → imported as `X: f.X`
- [ ] **`f.field_id` never appears inside the action body** — only in the import header. Inside the body, always use the bare local variable name (`field_id.value`, not `f.field_id.value`)
- [ ] **Every transition used in `make` calls** → imported as `tVar: t.transition_id`
- [ ] Import list: commas between all items, exactly one semicolon at the very end
- [ ] `setData(task, [...])` used inside `async.run` and for cross-case writes — always resolve the task via `findTask` first; never use `change` inside async
- [ ] `task` variable not referenced in `caseEvents` actions (only available in transition events)
- [ ] Each `make` call targets exactly one field and one transition
- [ ] `make` `when` closure: use `{ true }` / `{ false }` for unconditional; use `{ return <expr> }` for conditional
- [ ] Status/tracking field updates in `phase="pre"` — email/routing/async in `phase="post"`
- [ ] `assignTask`/`finishTask` inside `async.run` when called from any event action — when called with a string transition ID, they resolve against the **current case** (`useCase`); for cross-case task firing, resolve the task object via `findTask` with the target case's `stringId` and pass the task object directly
- [ ] If any external API key is needed: declared as a `type="text"` data field with `<value>YOUR-KEY-HERE</value>`, marked with a comment, and set to `hidden` on all user-facing transitions

**caseEvents**
- [ ] Only `type="create"` or `type="delete"` — never `type="finish"`
- [ ] `<caseEvents>` is the absolute last element in the document

**XML correctness**
- [ ] **Special characters escaped in ALL text content** — scan every `<title>`, `<label>`, `<placeholder>`, `<desc>`, `<value>`, `<message>`, and `<option>` for `&`, `<`, `>` and escape every occurrence: `&` → `&amp;`, `<` → `&lt;`, `>` → `&gt;`. The `&` in names like "Confidence & Reasoning" or "SK & CZ" is the most common cause of XML parse errors at import.
- [ ] Coordinates follow the lane formula from §3.6: main lane Y=208, branches Y=400/592, detail/status lane Y=16; X increments of 192px starting from x=112
- [ ] **No two elements share the same `(x, y)`** — this includes places and the transitions they directly feed; a place at X and its outgoing transition must be at X+192, never both at X
- [ ] Every logical branch occupies its **own Y lane** — rejected paths, optional branches, and the detail view must each be on a distinct Y value; never place a branch transition at the same Y as the main lane unless it is actually on the main flow path

**Pre-generation design check (§1 Step 2)**
- [ ] Five design questions answered before writing XML
- [ ] Token trace completed — no stuck states, no race conditions
- [ ] Branching pattern chosen (variable arcs vs systematic tasks) before placing arcs
- [ ] **XOR reconvergence check:** every fork has been traced to confirm all mutually exclusive branches deliver their token to a **shared merge place**, not directly to a shared downstream transition — a transition with two incoming regular arcs from XOR branches is an AND-join and will never fire (see Pattern 5 warning)

---

## 9. Output & Testing Instructions

- **Filename:** `{process_id}.xml`
- Complete, valid XML — no stubs, no "add fields here" comments
- Properly indented

**After generating, tell the user:**

> Your Petriflow app is ready! To test it:
>
> 1. Download the XML file
> 2. Go to https://builder.netgrif.cloud/modeler
> 3. Drag and drop the XML file onto the canvas
> 4. Verify the workflow looks correct visually
> 5. Upload to https://etask.netgrif.cloud/ to test full functionality
>
> If you need any modifications, just let me know!

**Common builder error messages:**

| Error | Cause | Fix |
|-------|-------|-----|
| "Invalid namespace" | Wrong `xmlns` declaration | Use exact namespace from §2 |
| "Duplicate ID" | Two elements share the same ID | Make all IDs unique |
| "Invalid arc" | Arc connects wrong element types | Follow Place→Transition→Place |
| "No start place" | No place with `tokens=1` | Add exactly one `<tokens>1</tokens>` |
| "Field not found" | `<dataRef>` references non-existent field | Check field ID spelling |
| "Role not found" | `<roleRef>` references non-existent role | Check role ID spelling |
| "Error: Not a number. Cannot change the value of arc weight" | A `<reference>` in a variable arc points to a `boolean` field instead of a `number` field | Change the referenced field's `type` from `boolean` to `number`; use values `1` and `0` in actions instead of `true` and `false` |
| `Error happened during the importing arcs [arc_id]: Error: Could not find nodes <place_id>-><place_id> of arc <arc_id>` | A variable arc (arc with `<reference>`) has a **Place as its source** instead of a Transition — violating the P→T→P rule. Common mistake: attaching variable arcs from the intermediate place that follows the routing transition, rather than from the routing transition itself. | Move the variable arcs so their `<sourceId>` is the **routing transition** ID, not a place ID. The destination (`<destinationId>`) should be the target place, not the next transition. |
| Variable arc shows `(0)` weight label in the modeller after import | Not an error — expected behaviour. Variable arc reference fields are declared with `<init>0</init>` so they start blocked. The builder modeller displays the current field value as the arc label. The value is overwritten at runtime by the `phase="pre"` routing action before tokens move. | No action needed. Verify the routing action correctly sets the field to `1` for the intended path and `0` for all others. |
| eTask compilation/parse error on an action with arithmetic | Arithmetic operators (`*`) were transformed into HTML italic tags (`<em>...</em>`) or entities (`&times;`) by the LLM or a Markdown renderer before the XML was written. The engine sees HTML tags inside CDATA and fails to compile the Groovy. | Open the raw XML and search every `<![CDATA[` block for `<em>`, `&times;`, `&#42;`, or any HTML-like content. Replace with the plain operator character (e.g. `*`). |