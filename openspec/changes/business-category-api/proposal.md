# Proposal: Business and Category APIs

## Context

The system requires a way to manage businesses and their categories. A business can have multiple categories, and categories can be nested (hierarchical).

## Goals

- Create a `business` resource with `name` and `slug`.
- Create a `category` resource with `name` and `parent_id` (nested).
- Establish a "Business has many Categories" relationship.
- Provide CRUD APIs for both.
- Provide a special API to fetch root categories (where `parent_id` is null).

## Non-Goals

- Authentication/Authorization rules for these APIs (will be handled separately or generally).
