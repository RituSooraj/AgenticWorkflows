# AgenticWorkflows

This repo contains all the agentic workflows created in n8n.

Project 1: BankCo Premium Routing Agent 

Project 2 : Customer Routing Agent and ECommerce Operations Agent
E-commerce teams monitor checkout activity🛒to catch issues that can impact revenue
(especially payment failures). At scale, hundreds of checkout events may arrive every hour,
and it’s not practical to manually triage each one.
We want an agent that can consistently review new events, decide whether the situation
warrants attention, and publish a clean “command” for downstream execution.

Goal
Build an E-commerce Operations Agent in n8n that reads new checkout events from Google
Sheets, evaluates their severity using baseline metrics, and outputs exactly one command per
run (ALERT or LOG). The agent does not execute fixes; it only publishes intent via a webhook
and updates state.

Data Architecture
You are required to set up a Google Spreadsheet with the following four distinct sheets to
simulate the database.
1. Cart Events Sheet (The Input)
The agent needs all the raw data for every user’s checkout, including when it happened,
what stage it failed at, how much the cart was worth, and what device was used, for it to
have the facts it needs to make an initial decision.
● Columns: timestamp, checkout_step (Shipping/Payment/Address), cart_value,
device (Mobile/Desktop).

2. Baseline Metrics Sheet (The Context)
The agent needs to know the normal rate of failure for each checkout step for it to decide
if a new issue is a truly critical problem or just part of the everyday baseline noise.
● Columns: checkout_step, baseline_rate.
● Usage: The agent uses this to judge if a current failure is unusual.

3. State Sheet (The Memory)
The agent needs a way to record the last event it successfully processed for it to remember
where it left off, ensuring it only processes new events and doesn't create duplicate alerts
in its next run.
● Columns: key, value.
● Required Key: last_processed_timestamp.

4. Agent Sheet (The Output)
The agent needs a sheet where it can formally write its final decision, the command to
either ALERT or LOG, for the system to know exactly what action to take.
● Columns: command_id, action, severity, reason, checkout_step, cart_value,
device, baseline_rate, timestamp

Functional Requirements
1. State Management (Critical)
a. The agent must read the last_processed_timestamp from the state sheet at
the start of every run.
b. It must filter the cart_events to only process rows where the timestamp is
newer than the stored state.
c. At the end of the run, it must update the state sheet with the timestamp of the
latest processed event.

2. Decision Logic
The agent must evaluate every new event based on these business rules:
a. Severity High: If the issue occurs during the PAYMENT step (critical revenue
impact).
b. Severity High: If the cart_value is significantly high.
c. Severity High: If the failure rate exceeds the baseline_rate.
d. Severity High: If multiple mobile failures occur (potential app bug).
e. Action:
i. ALERT: If severity is HIGH.
ii. LOG: If severity is LOW (e.g., low value, isolated incident).

3. Execution & Hand-off
a. The agent must write exactly one row to the agent_commands sheet per
decision.

b. Mandatory: The agent must trigger a Webhook (POST request) to broadcast its
decision to downstream systems.
c. The Webhook JSON body must contain all 9 fields from the command row
(action, severity, reason, etc.).
Functional Requirements
1. Zero Duplicates: The agent never processes the same checkout event row twice (State
Management works).
2. Smart Triage: The agent correctly identifies high-value Payment failures as
HIGH/ALERT
3. Connectivity: The Webhook fires successfully with a valid JSON payload for every
decision made.


Project 3:
Build a RAG Knowledge Agent 
Problem Statement :
Background
At NovaCart, the Product Finance team is responsible for delivering a high-stakes monthly
analysis that dictates strategic direction. Each month, the team must synthesize internal
product performance metrics with complex external market data, including industry outlooks
and shifting consumer behavior.
Currently, this process requires manual data aggregation and cross-referencing between
internal databases and external intelligence reports, which can be time-consuming and prone to
oversight.

Goal
The primary objective is to generate a comprehensive Monthly Financial Standing Report by
the 1st of every month. This report must provide leadership with a clear, data-driven snapshot of
NovaCart’s performance relative to the broader market, enabling them to make faster and more
informed strategic decisions.

Solution
Build an AI Finance Reporting Agent capable of autonomous data synthesis and insight
generation. The agent will:
● Query internal data: Access and analyze real-time product sales numbers stored in a
Vector Database.
● Analyze external trends: Scan and interpret industry outlooks and consumer behavior
reports from designated Knowledge Sources.
● Synthesize & Report: Correlate internal performance with external market conditions to
produce a structured summary for leadership.
Report over Email: Send the final monthly report over email to the required
stakeholder.
