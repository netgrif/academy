# Order & invoices - Interprocess communication

## Overview

An order and invoices example, presented at mde-network.com/ event.

The description of an order and invoices example in MDENet video from 22:24 to 33:06.

<iframe width="700" height="800" src="https://www.youtube.com/embed/M6KFZ07vNNI?start=1344" title="YouTube video player"
frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
allowfullscreen></iframe>

The Order and invoices application is example of simple yet complex interprocess communication in Netgrif platform. This guide provides an overview of the development processes, focusing on the creation of workflows, forms, data fields, roles, transitions, and metadata using the Netgrif Application Builder and Engine (NAB & NAE).

[Click here to launch Order process in Builder](https://builder.netgrif.com/modeler?modelUrl=https://academy.netgrif.com/examples/inter_process_communication/order-invoices/order.xml)

[Click here to launch Invoice process in Builder](https://builder.netgrif.com/modeler?modelUrl=https://academy.netgrif.com/examples/inter_process_communication/order-invoices/invoice.xml)

This application is runnable in [Demo](https://etask.netgrif.cloud/) or in your own instance of Netgrif
Application Engine. To find out how to install NAE CE both locally or on the server
follow [this tutorial](tutorials/nae-ce-starter.md).

## Creation of the Trip request application

<iframe width="700" height="800" src="https://www.youtube.com/embed/YEU8G7qd_KM" title="YouTube video player"
frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
allowfullscreen></iframe>

The main focus in this application example is on interprocess communication. Three simple functions are used for that.

**The first** is on assign pre event in Register invoice task, where all orders are collected into one enumeration.

From invoice.xml:
```groovy
parent_order_id: f.parent_order_id;

def orders = findCases { it.processIdentifier.eq(workspace + "order")}.collectEntries {
    [(it.stringId): "Order: " + it.stringId]
}
change parent_order_id options {
    orders
}
```

**The second** is on the finish post event in the Register invoice task, where new_invoice_id is set. Not only is value changed but also set event is called.

From invoice.xml:
```groovy
invoice_id: f.invoice_id,
parent_order_id: f.parent_order_id;

def parent_order_case = findCase({it._id.eq(parent_order_id.value)});

setData("t1", parent_order_case, ["new_invoice_id": ["value": invoice_id.value, "type": "text"]]);
```

**The third** is on the set post event in new_invoice_id data. Here if the new_invoice_id value is not part of children_invoice_cases a t2 task id is set to invoice_approvals task reference.
From order.xml:
```groovy
invoice_approvals: f.invoice_approvals,
children_invoice_cases: f.children_invoice_cases,
new_invoice_id: f.new_invoice_id;

if (new_invoice_id.value !in children_invoice_cases.value) {
    change children_invoice_cases value { children_invoice_cases.value +  new_invoice_id.value}}

change invoice_approvals value {
    findTasks{(it.caseId.in(children_invoice_cases.value)).and(it.transitionId.eq("t2"))}?.collect{it.stringId}
}
```