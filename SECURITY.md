# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of Modern E-Commerce Dashboard seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Please Do Not

- **Do not** open a public GitHub issue for security vulnerabilities
- **Do not** disclose the vulnerability publicly until it has been addressed

### What to Expect

- **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 48 hours
- **Communication**: We will keep you informed about the progress of fixing the vulnerability
- **Timeline**: We aim to patch critical vulnerabilities within 7 days
- **Credit**: We will credit you in the security advisory (unless you prefer to remain anonymous)

## Security Best Practices

### For Users

1. **Keep Updated**: Always use the latest version
2. **Secure Secrets**: Never commit `.env` files or secrets to version control
3. **Strong Passwords**: Use strong, unique passwords for all accounts
4. **HTTPS Only**: Always use HTTPS in production
5. **Regular Backups**: Maintain regular database backups
6. **Monitor Logs**: Regularly review application logs for suspicious activity

### For Developers

1. **Input Validation**: Always validate and sanitize user input
2. **Parameterized Queries**: Use Prisma ORM to prevent SQL injection
3. **Authentication**: Implement proper authentication and authorization
4. **Secrets Management**: Use environment variables for sensitive data
5. **Dependencies**: Keep dependencies up to date
6. **Code Review**: Review all code changes for security issues
7. **Testing**: Write security tests for critical functionality

## Known Security Considerations

### Authentication
- JWT tokens are stored in HTTP-only cookies
- Access tokens expire after 15 minutes
- Refresh tokens expire after 7 days
- Tokens are rotated on refresh

### Password Security
- Passwords are hashed using bcrypt with 12 rounds
- Minimum password requirements enforced
- Password change requires current password verification

### Rate Limiting
- API endpoints are rate-limited (100 requests per 15 minutes)
- Authentication endpoints have stricter limits (5 requests per 15 minutes)

### CORS
- CORS is configured to allow only specified origins
- Credentials are required for cross-origin requests

### SQL Injection
- All database queries use Prisma ORM
- Parameterized queries prevent SQL injection

### XSS Protection
- React automatically escapes output
- Helmet.js provides additional XSS protection
- Content Security Policy headers are set

## Security Updates

Security updates will be released as patch versions (e.g., 1.0.1, 1.0.2) and announced via:

- GitHub Security Advisories
- Release notes
- Email notifications (for critical vulnerabilities)

## Vulnerability Disclosure Policy

We follow a **coordinated disclosure** policy:

1. **Report received**: Vulnerability is reported privately
2. **Validation**: We validate and assess the vulnerability (1-3 days)
3. **Fix development**: We develop and test a fix (3-7 days)
4. **Release**: We release a patched version
5. **Public disclosure**: We publish a security advisory 7 days after the patch release

## Security Hall of Fame

We recognize security researchers who responsibly disclose vulnerabilities:

<!-- List will be updated as vulnerabilities are reported and fixed -->

*No vulnerabilities reported yet.*

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [React Security Best Practices](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)

---

**Last Updated**: May 23, 2026
