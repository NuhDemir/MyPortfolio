# About Management Advanced Prompt

You are a senior full-stack architect specializing in maintainable content systems.

## Goal
Transform the existing About section into a fully manageable, production-ready content domain with:
- detailed database model
- robust backend API layer
- admin management panel for About content
- dynamic frontend About rendering from API

## Context
- Frontend stack: React + Vite
- Backend stack: Node.js + Express + Mongoose
- Existing architecture follows modular DDD-style boundaries (module, domain, application, infrastructure, interfaces)
- Admin area already contains dashboard, blog, project, and comment management

## Requirements
1. Backend About Domain
- Create a dedicated `about` module in backend using the existing module structure.
- Implement a detailed Mongoose model for About content including:
  - header metadata
  - GitHub profile metadata
  - stats cards (with source config)
  - service cards
  - nested modal sections/items
  - SEO metadata
  - status/activation and version metadata
- Use singleton content strategy (`slug: main`) and provide default seeded content when empty.
- Add validation schemas for admin update payload.
- Expose endpoints:
  - `GET /api/about` (public)
  - `GET /api/about/admin/content` (admin protected)
  - `PUT /api/about/admin/content` (admin protected)

2. Frontend About Consumption
- Refactor About page to consume backend content dynamically.
- Keep fallback defaults if API is unavailable.
- Render stats and services from API-driven data model.
- Preserve existing UI look-and-feel and animations.
- Render modal content dynamically from model sections/items.

3. Admin Panel Integration
- Add About API service in admin module.
- Add About management hook for fetching/updating content.
- Add About management page with editable fields and JSON editors for nested structures.
- Integrate page into admin routing and navigation.

4. Quality
- Keep changes modular and readable.
- Preserve existing coding style and naming conventions.
- Avoid breaking existing modules.
- Ensure no lint or runtime errors in changed files.

## Deliverables
- New backend about module with model, repository, service, use-cases, controller, routes, validators.
- Updated backend route registration.
- Updated frontend About page and support files.
- New admin About management page + route + nav entry + services/hooks.
- Summary of changed files and API contracts.
