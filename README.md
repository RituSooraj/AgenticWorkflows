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

Project 4: 
Trip Planner - Multi Agent System
Build a Multi-Agent Orchestration
Workflow for an Intelligent Trip Planner

Background
Modern trip planning involves coordinating multiple interconnected domains — flights, hotels,
activities, transportation, weather, and user preferences. Traditional applications rely on rigid
workflows or manual user navigation across multiple platforms, resulting in fragmented
experiences, inconsistent itineraries, and limited personalization.
Lets design and build a multi-agent system in N8N (low code/no-code solution platform)
where specialized agents collaborate under a coordinated workflow. Each agent handles a
specific domain (e.g., flights, hotels, activities), while an orchestrator ensures consistency,
optimization, and alignment with user goals.

Objective
To design a reliable, and extensible multi-agent orchestration workflow that:
● Accepts high-level user trip goals
● Decomposes the request into domain-specific subtasks
● Executes agents in parallel where possible
● Validates and reconciles cross-domain constraints
● Produces a coherent, optimized, and personalized itinerary

The solution should demonstrate clear orchestration logic, agent specialization, and structured
data flow between components.

Core Learner Tasks
Participants are expected to:
1. Define Agent Roles and Responsibilities
● Orchestrator / Planner Agent
● Flight Agent
● Hotel Agent
● Activity Agent
● Validator / Critic Agent
● Optional: Transport or Weather Agent

Clarify input/output contracts for each agent.

2. Design the Orchestration Flow
● Determine sequential vs parallel execution
● Define shared state structure (itinerary schema)
● Handle retries and fallback logic
● Establish termination conditions

3. Implement Cross-Agent Validation
● Detect scheduling conflicts (flight vs hotel check-in)
● Ensure activity timing feasibility
● Verify budget constraints

● Maintain consistency across all itinerary components

4. Define Observability & Debugging Strategy
● Logging structure per agent
● Execution traceability
● Failure isolation
● Versioning and rollback approach

5. Optimize for Performance & Scalability
● Parallel processing of domain agents
● Efficient API usage
● Caching strategies
● Modular extensibility for new features (car rentals, insurance, visa checks)

Business Impact
A well-designed multi-agent orchestration system for trip planning delivers:
➢ Improved User Experience
➢ Faster itinerary generation through parallel agent execution
➢ Operational Efficiency
➢ Strategic Differentiation

Project 5 :
Hospital Booking Agent - Multi Agent Orchestration 
Problem Statement
Design and develop an intelligent healthcare platform that simplifies the discovery and booking of medical services by analyzing hospital data, patient reviews, and key healthcare metrics. The system should extract, evaluate, and compare critical parameters to help users make informed healthcare decisions.

The proposed solution must include a robust comparison engine for hospitals and diagnostic centers, an automated appointment scheduling system, and comprehensive information on medical tests and procedures creating a more transparent and efficient healthcare experience.
Challenges in Healthcare Information Systems
Limited Personalisation – Most healthcare information systems provide one-size-fits-all responses that lack user-specific relevance.
Lack of Context Awareness – Many AI assistants struggle to maintain conversation history and context over multiple interactions.
Fragmented Information Sources – Medical knowledge is scattered across multiple databases, making it difficult to consolidate accurate information efficiently. making it difficult to consolidate accurate information efficiently.
Who Can Benefit from this healthcare AI system?
User
Use Case
Healthcare Providers
Automate FAQs, appointment handling, and patient guidance.
Insurance Teams
Build workflows for insurance bookings and medical claim triage.
Patients
Access instant medical support and personalised health insights.


Scenario
Patients interact with the Healthcare AI system through chat to:
Find available doctors and book appointments.
Compare hospitals based on specialization, services, and emergency availability.
Retrieve recommended diagnostic tests and preparation guidelines.
Automatically route their queries to the appropriate intelligent agent.
All tasks are to be handled by a modular AI agent system in n8n, without writing code.
Dataset Overview
To build an effective and reliable AI-driven healthcare assistant, Healthcare AI system will use structured datasets stored in google sheets
Hospital General Information Dataset
Contains hospital names, locations, specialties, capacity, and contact details.
Used for hospital comparisons and providing relevant hospital recommendations.
Source: Public healthcare directories and government datasets.
Hospital Information with Lab Tests Dataset
Includes details about available lab tests, diagnostic packages, and pricing.
Used for diagnostic services recommendations and health test comparisons.
Source: Aggregated medical lab datasets and public health data.
Hospitals Emergency Data Dataset
Contains hospital emergency department details, ambulance availability, and response times.
Used for emergency assistance and directing users to the nearest available emergency services.
Source: Public emergency response data and hospital records.
Doctor Availability Dataset 
Contains doctor schedules, specializations, consultation availability, and hospital affiliations.
Used for doctor appointment recommendations and scheduling.
Source: Medical institutions and clinic appointment systems.
These datasets enable Healthcare AI system to deliver accurate, data-driven healthcare recommendations.
Example Queries
"Find available doctors for a dermatology consultation this week."
"What hospitals specialize in cardiology near me?"
"Where is the nearest 24/7 emergency hospital?"
"What tests should I take for persistent headaches?"
"Which hospital has good medical imaging?" 
"Show slots for Dr. Lee." 
"Any ambulance available at 94404?" 
"What would be the preparation instructions for cancer screening?" 

Agents Overviews
Hour
Focus Agent
Description
1️⃣
Coordinator Agent
Routing user queries to specialized healthcare agents intelligently.
2️⃣
Doctor Booking Agent
Find doctor availability and provide appointment options.
3️⃣
Hospital Comparison + Emergency Routing Agent
Compare hospitals and find the nearest emergency services.
4️⃣
Diagnostics Services Agent
Recommend lab tests and provide preparation instructions. Email preparation guide to user.

● Synthesize & Report: Correlate internal performance with external market conditions to
produce a structured summary for leadership.
Report over Email: Send the final monthly report over email to the required
stakeholder.
