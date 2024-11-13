# Trip Registration Application

## Overview

The Trip Request application is designed to streamline the registration and approval of trip requests within an organization. This guide provides an overview of the development process, focusing on the creation of workflows, forms, data fields, roles, transitions, and metadata using the Netgrif Application Builder and Engine (NAB & NAE).

[Click here to launch the process in Builder](https://builder.netgrif.cloud/modeler?modelUrl=https://academy.netgrif.com/examples/trip_request/trip_registration.xml)

This application is runnable in [Demo](https://etask.netgrif.cloud/) or in your own instance of Netgrif
Application Engine. To find out how to install NAE CE both locally or on the server
follow [this tutorial](tutorials/nae-ce-starter/nae-ce-starter.md).

## Creation of the Trip request application

<div class="container">
    <iframe class="responsive-iframe" src="https://www.youtube.com/embed/-jfz5YefpHc?si=bT9G39iZy6uJwegV" title="YouTube video player"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen></iframe>
</div>

##### Process Definition

Start by defining the process ID and title to establish the application's identity and version control.
Lifecycle States: Outline the overall workflow by defining the lifecycle states of the trip request (e.g., new, pending approval, approved, declined). This ensures a clear and logical progression from submission to final decision.
Transitions: Link transitions between states to define the flow of actions within the application. For instance, configure transitions for submitting the request, approval, decline, and requesting changes.
Designing Forms and Data Fields

##### Form Creation

Design the form that users will interact with. This involves specifying which fields will be included in the form and how they will be presented.

##### Data Fields

Define the necessary data fields:

* People Field: Create a multichoice data type for selecting the people involved in the trip.
* Cars Field: Define an enumeration data type for selecting cars from a predefined list.
* From and To Fields: Set up DateTime fields to specify the start and end dates of the trip.
* Locations Field: Use an enumeration with a list component to allow users to select multiple locations.
* Decision Field: Implement an enumeration for approval decisions, including options such as Approve, Decline, and Remake.
* Reason Field: Provide a text field where users can enter reasons for their decisions.
* File Field: Add a file data type to enable the upload of relevant documents.

##### Role Definition

Define roles such as Requester and Approver, assigning specific permissions to ensure that only authorized users can perform certain actions within the application.

##### Permissions Assignment

Specify which roles have access to certain data fields and transitions, ensuring secure and appropriate access control.

##### Actions

Configure the actions associated with each transition. This includes setting up conditions and actions based on the decision field (e.g., approving, declining, or requesting changes to the trip request).