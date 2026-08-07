# Scale With Ease

Build a modern SaaS landing page for a Platform as a Service called "AutoScaleX".

Tech stack:
- Next.js (App Router)
- Tailwind CSS

Design requirements:
- Dark theme, professional DevOps look
- Clean typography, subtle gradients
- Responsive for desktop and mobile

Sections to include:
1. Hero section with headline:
   "Deploy. Scale. Relax."
   Subtext:
   "AutoScaleX automatically deploys, scales, and monitors your backend services using Kubernetes."

   Primary CTA: "Get Started"
   Secondary CTA: "View Dashboard"

2. Features section (icons + text):
   - GitHub-based deployments
   - Zero-downtime releases
   - Automatic scaling
   - Canary deployments
   - Instant rollback
   - Built-in monitoring

3. How it works section:
   Step 1: Connect GitHub repository
   Step 2: Push code
   Step 3: AutoScaleX builds & deploys
   Step 4: Monitor and scale automatically

4. Tech stack section (logos or cards):
   Next.js, Node.js, Go, Kubernetes, Docker, AWS, Prometheus, Grafana

5. Footer:
   - AutoScaleX © 2026
   - Links: Docs, GitHub, Contact

Output:
- Clean, production-ready UI
- Well-structured components
- No placeholder text


Build a developer dashboard UI for a Platform as a Service named "AutoScaleX".

Tech stack:
- Next.js
- Tailwind CSS

Dashboard layout:
- Left sidebar navigation
- Top header with user profile
- Main content area with cards and tables

Sidebar items:
- Overview
- Applications
- Deployments
- Monitoring
- Settings

Overview page widgets:
- Total applications deployed
- Active deployments
- Current running pods
- CPU usage %
- Memory usage %

Applications page:
- Table showing:
  App Name
  GitHub Repo
  Environment (prod/staging)
  Status (Running / Failed / Deploying)
  Last Deployed Time

Deployments page:
- Deployment history list
- Version tag
- Deployment type (Canary / Full)
- Status (Success / Failed)
- Rollback button (UI only)

Monitoring page:
- Line charts for:
  CPU usage over time
  Memory usage over time
  Request count
- Use mock data

Settings page:
- GitHub repository connection form
- Environment variables form
- Save settings button

Design:
- Professional DevOps SaaS look
- Dark theme
- Clean spacing and readable tables

Output:
- Fully styled dashboard UI
- No backend logic required



Create a mock backend API structure for the AutoScaleX dashboard.

Use Node.js with Express.

Endpoints:
- GET /api/overview
- GET /api/apps
- GET /api/deployments
- GET /api/metrics
- POST /api/connect-repo

Requirements:
- Use static mock JSON data
- Simulate real DevOps platform responses
- Clean folder structure
- Ready to be replaced by real services later

Output:
- Express server code
- Sample JSON responses
- Clear separation of routes



Improve the AutoScaleX UI with subtle SaaS animations.

Add:
- Hover effects on cards
- Smooth page transitions
- Loading skeletons
- Status badges with colors

Use:
- Tailwind CSS
- Framer Motion (if needed)

Constraints:
- Keep animations minimal and professional
- Do not affect performance

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/64b68a18-2ce6-42f2-82b8-794766e8e559).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
