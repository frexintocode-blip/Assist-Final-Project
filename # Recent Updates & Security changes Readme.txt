### Recent Updates & Security Enhancements

*Secure HttpOnly Cookie Authentication:** Migrated session tokens and user role management away from vulnerable client-side `localStorage` to secure, encrypted `httpOnly` cookies. This prevents malicious client-side scripts (XSS) from reading sensitive authentication data, significantly reducing security surface risks.

*UI/UX Design Mockups: Integrated visual design mockups and layout previews for key application pages to document the minimalist user interface architecture.

*Robust File Download Endpoints: Added dedicated backend handling for file downloads to ensure smooth retrieval of uploaded documents without causing database bloat or formatting corruption.

*Admin Account Seeding & API Hardening: Implemented an automated database seeding script (`seedAdmin.js`) to programmatically establish the single authorized system administrator.

*Hardened public user registration controllers to explicitly intercept and block any external attempt to register or pass `role: 'admin'` via Postman, cURL, or other API testing tools, throwing a secure `403 Forbidden` response.