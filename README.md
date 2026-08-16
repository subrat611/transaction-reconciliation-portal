# Transaction Reconciliation & Ops Portal (Internal Tool)

**The Problem:**

Due to unpredictable edge cases with the external Omnify banking gateway, card load transactions were getting stuck in a `PENDING` state. The cron job retries would exhaust, and the Product Manager/Owner would manually compile an Excel sheet of failed transactions every other day. A backend developer then had to manually run SQL update scripts across two microservices (Card DB and Wallet DB) to mark them as `FAILED`.

**Solution:**

Built a full-stack Operations Portal that allowed the Product Manager to safely upload the Excel sheet (or select from a UI) and automatically execute the database updates in a secure, audited background job.

## Tech Stack

- Framework: Next.js (React + TypeScript)
- Styling: TailwindCSS + Shadcn/UI (for fast, beautiful internal dashboards)
- Database ORM: Drizzle (to talk to our mock MySQL DB)
- Background Jobs: Trigger.dev (integrated directly into Next.js)
- Validation: Zod (for validating the uploaded CSV data)

## Deployment Strategy

**The Context:**

The companies (like TruKKer/Moxey), teams are often allocated annual cloud budgets (Azure Monetary Commitment credits or Oracle Universal Credits).

Internal tools are usually deployed on low-cost Virtual Machines (VMs) rather than expensive managed services like Vercel or Azure App Service, to save these credits for customer-facing production apps.

**The Deployment Architecture:**

Here I will simulate (Same as I implemented) deploying this entire stack onto a single low-cost Virtual Machine.

- A standard low-cost Linux VM (AWS).
- Docker to run the Next.js production build and the MySQL container on that exact same VM.
