# File Upload API Proposal

## Summary

Add a new `files` module to handle secure file uploads, specifically focusing on product images initially. This API will allow authenticated Admin and Staff users to upload images, which will be stored in Supabase Storage. The API will return the public URL of the uploaded file for use in product and variant creation.

## Problem Statement

Currently, there is no backend mechanism to upload files. Product images are likely handled by manually entering URLs or uploading via other means. We need a centralized, validated, and secure way to upload artifacts like product images.

## Goals

- Strict validation of file types (images) and sizes.
- Centralized storage management (Supabase Storage).
- Role-based access control (Admin/Staff only).
- Reusable pattern for future file upload needs.

## Non-Goals

- Client-side direct uploads (for now, backend proxy is requested to act as authority).
- Image processing/resizing (out of scope for MVP).

## Timeline

- Design & Spec: 1 day
- Implementation: 1 day
