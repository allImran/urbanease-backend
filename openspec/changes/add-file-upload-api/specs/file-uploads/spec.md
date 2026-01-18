# File Uploads Spec

## ADDED Requirements

### Requirement: Admin and Staff can upload image files

The system SHALL allow authenticated users with `admin` or `staff` roles to upload image files for use in the system.

#### Scenario: Admin uploads a valid image

- **Given** I am an authenticated Admin
- **When** I send a `POST /api/files/upload` request with a valid `image/jpeg` file under 5MB
- **Then** I receive a 201 Created status
- **And** the response contains the public URL of the uploaded image

#### Scenario: Staff uploads a valid image

- **Given** I am an authenticated Staff member
- **When** I send a `POST /api/files/upload` request with a valid `image/png` file under 5MB
- **Then** I receive a 201 Created status
- **And** the response contains the public URL of the uploaded image

#### Scenario: Unauthenticated user cannot upload

- **Given** I am not authenticated
- **When** I send a `POST /api/files/upload` request
- **Then** I receive a 401 Unauthorized status

#### Scenario: Customer cannot upload

- **Given** I am an authenticated Customer (not admin/staff)
- **When** I send a `POST /api/files/upload` request
- **Then** I receive a 403 Forbidden status

### Requirement: Strict File Validation

The system SHALL validate uploaded files to ensure they are images and within size limits.

#### Scenario: Uploading non-image file

- **Given** I am an authenticated Admin
- **When** I upload a `.pdf` file
- **Then** I receive a 400 Bad Request status
- **And** the error message indicates invalid file type

#### Scenario: Uploading file too large

- **Given** I am an authenticated Admin
- **When** I upload a file larger than 5MB
- **Then** I receive a 400 Bad Request status
- **And** the error message indicates file size limit exceeded
