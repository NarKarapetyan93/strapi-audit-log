# Strapi plugin Audit Log

This plugin allows you to log all the actions performed by the users of your application.
Actions performed by the admin user are or authenticated users are logged. For public users, it shows "External Change" instead of user name.

## Installation

```yarn add logismiko-strapi-plugin-audit-log``` or ```npm install logismiko-strapi-plugin-audit-log```

## Usage

In the `config/plugins.js` you need to add the following configuration:

```javascript
module.exports = {
  'audit-log': {
    enabled: true
  }
}
```
