# Interprocess communication

The real world is very complex. It is one of many reasons why process-driven
applications consist of a vast number of processes. It is important to be able to
define a way of process communication. Petriflow allows to model inter-process
communication with process events and actions. All events can be invoked by
some system entity, like system user or another process. Also, a reaction can be
defined to every process event in a form of an action. The important part of interprocess communication is the search of all entities of a process model. Petriflow
provides search capabilities via library QueryDSL that is easy to use and enables
to write both simple and complex queries on every entity of a process model.
With Petriflow capabilities, we can model processes that can communicate with
each other within an application environment.

List of examples

* [Order & invoices](examples/inter_process_communication/order-invoices/order_invoices.md)