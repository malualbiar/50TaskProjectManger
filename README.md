50TaskProjectManager

A simple multi-tenant project management application designed to help organizations manage projects, teams, and tasks efficiently.

Overview

50TaskProjectManager enables organizations (tenants) to collaborate through structured roles, ensuring clear responsibilities and streamlined workflows.

<!-- Insert system architecture diagram here --> <!-- Example: ![Architecture Diagram](./images/architecture.png) -->
User Roles & Activities
Organization Admin

Highest role within a tenant.

Responsibilities:

Create and manage the organization workspace
Invite users to the organization
Assign roles to members
Manage organization settings
View all projects within the tenant
Remove users
Project Manager

Manages projects within the organization.

Responsibilities:

Create projects
Assign team members
Create tasks
Monitor project progress
Manage deadlines
Generate reports
Team Member

Executes tasks within assigned projects.

Responsibilities:

View assigned tasks
Update task status
Upload files
Comment on tasks
Track work progress
Stakeholder / Client

Limited visibility role.

Responsibilities:

View project progress
View reports
Provide feedback
Comment on deliverables
<!-- Insert role-based access diagram here --> <!-- Example: ![RBAC Diagram](./images/rbac.png) -->
Onboarding Flow

Typical workflow when a new organization signs up:

Organization registers
Chooses a payment plan
System creates a tenant record
First user becomes the tenant owner (Admin)
Owner invites team members
Members join the tenant workspace
Projects and tasks are created
<!-- Insert onboarding flow diagram here --> <!-- Example: ![Onboarding Flow](./images/onboarding.png) -->
