# File Upload Design

## Overview

We need a secure way to upload files (images) to Supabase Storage. Since the backend handles business logic and validation, we will proxy file uploads through the Node.js backend to enforce strict validation before interacting with Supabase Storage.

## Architecture

### Component Diagram

User -> [Express API] -> (Multer Validation) -> [Supabase Storage]

### Data Flow

1. **Client** sends `POST /api/files/upload` with `multipart/form-data` (field: `file`).
2. **Express Middleware (Multer)** receives the stream.
   - Validates MIME type (`image/jpeg`, `image/png`, `image/webp`).
   - Validates File Size (Max 5MB).
   - Stores file in memory (RAM) temporarily (using `multer.memoryStorage()`).
3. **Handler** receives `req.file`.
4. **Service/Repo** calls Supabase Admin Client.
   - Generates a unique path: `uploads/{timestamp}-{random}-{filename}`.
   - Uploads the buffer to the `product-images` bucket.
   - Retrieves the public URL.
5. **Response** returns the URL to the client.

## Security

- **Authentication**: JWT (Supabase Auth) via `auth.middleware`.
- **Authorization**: Admin and Staff only via `role.middleware`.
- **Validation**: Strict whitelist of MIME types and strict size limit.
- **Storage**: Supabase Storage bucket `product-images` should have policies (though Admin client bypasses RLS, we ensure the bucket exists).

## Alternative Considered

- **Direct Client Upload**:
  - _Pros_: Offloads bandwidth from backend.
  - _Cons_: Harder to enforce strict business logic validation (e.g., if we want to check image dimensions or specific file content beyond MIME). Requires managing Storage RLS policies for partial uploads or signed URLs.
  - _Decision_: Backend proxy is preferred for "Authority" pattern and simplicity of validation logic in one place.

## Dependencies

- `multer`: For handling multipart/form-data.
- `@types/multer`: For TypeScript support.
