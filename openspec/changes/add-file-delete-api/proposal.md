# File Delete API Proposal

## Summary

Add a `DELETE` endpoint to the `files` module to allow authenticated Admins to remove files from Supabase Storage. This is necessary to clean up unused images or replace incorrect uploads.

## Problem Statement

Currently, files can be uploaded but not deleted via the API. This can lead to orphaned files and increased storage costs. We need a way to safely remove files.

## Goals

- Allow Admins to delete files by path or filename.
- Validate that the file exists (implicitly via Supabase response).
- Restrict deletion to Admins only (Staff cannot delete to prevent accidental data loss, or we can discuss this). _Decision: Admins only._

## Non-Goals

- Deleting files/images that are currently "in use" by a product (referential integrity check is too complex for this MVP phase, we assume the client knows what they are deleting).

## Timeline

- Design & Spec: 1 day
- Implementation: 1 day
