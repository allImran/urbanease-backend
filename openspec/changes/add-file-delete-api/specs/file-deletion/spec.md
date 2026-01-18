# File Deletion Spec

## ADDED Requirements

### Requirement: Admin can delete files

The system SHALL allow authenticated users with the `admin` role to delete files/images from storage.

#### Scenario: Admin deletes an existing file

- **Given** I am an authenticated Admin
- **When** I send a `DELETE /api/files/:path` request provided the full relative path (e.g., `uploads/image.jpg`)
- **Then** I receive a 204 No Content status
- **And** the file is removed from Supabase Storage

#### Scenario: Admin deletes a non-existent file

- **Given** I am an authenticated Admin
- **When** I send a `DELETE /api/files/non-existent.jpg` request
- **Then** I receive a 204 No Content status (idempotent) assumption or 404 depending on implementation. _Decision: 200/204 is safer for storage APIS, but 404 if helpful. Let's stick to 200/204 to match typical bucket behavior or 200 if "operation completed". Supabase usually returns error if not found? Let's assume successful execution even if file missing, or check._
- **Refinement**: Supabase Storage `remove` usually succeeds. Let's say we return 200 OK with message or 204.

#### Scenario: Staff cannot delete files

- **Given** I am an authenticated Staff member
- **When** I send a `DELETE /api/files/image.jpg` request
- **Then** I receive a 403 Forbidden status

#### Scenario: Unauthenticated user cannot delete files

- **Given** I am not authenticated
- **When** I send a `DELETE /api/files/image.jpg` request
- **Then** I receive a 401 Unauthorized status
