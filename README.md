# Strapi plugin Audit Log

This plugin allows you to log all the actions performed by the users of your application.
Actions performed by the admin users or authenticated users are logged. For external changes if `ctx.state.user` is empty, it shows "External Change" instead of user name.

> **_<span style="color:red">IMPORTANT NOTE</span>:&nbsp;_**  This plugin is overwriting Strapi's default `content-manager` plugin and automatically creates `strapi-server.js` in `./srs/extensions` folder. So if you already overwrote this file `strapi-server.js` plugin may not work properly. For `production` mode you need to push also newly created `src/extensions/content-manager` folder to your server.

## Installation

```yarn add logismiko-strapi-plugin-audit-log```

or

```npm install logismiko-strapi-plugin-audit-log```

## Usage

In the `config/plugins.js` you need to add the following configuration:

```javascript
module.exports = {
  // ...
  'audit-log': {
    enabled: true
  }
  // ...
}
```

This plugin only visible for users with `Super Admin` role. However, if you want to give access to other users, you can add `read` permissions to the `Editor` and `Author` roles too, by visiting `Setting -> Roles -> YOUR PREFFERED ROLE -> Plugins -> Audit-log` and enable checkbox inf front of `read` permission.

## Changelog
### 1.0.4-1
- Bug fixes,updated dist folder

### 1.0.4
- Added `isLoggingDisabled` option to disable logging for specific requests. You can add manually `isLoggingDisabled: true` in your request body in `create`, `update` and `bulkDelete` actions. So it will skip logging.
E.G: It can be useful for `cronJobs`, if you are doing `bulkDelete`, `update` or `create` actions in your cron job, you can add `isLoggingDisabled: true` in your request body, so it will skip logging for each record and will not periodically fill your database.

### 1.0.3-1
- Bug fixes,updated dist folder

### 1.0.3
- Bug fixes, for production mode

### 1.0.2
- Bug fixes

### 1.0.1-release
- Fixed filtering issue
- Added additional conditions to filters
- Added search functionality
- Added sorting functionality by columns

### 1.0.0-realease
- Added support for Strapi v4
- Added support for filtering
- Fixed pagination issue

### 0.0.5
- Fixed bulk-delete issue

### 0.0.4
- Added permissions for admin users
- Fixed frontend freezing issues

### 0.0.3
- Added support of pagination
- Fixed frontend issues

### 0.0.2
- Added README.md
- Changed plugin name to `logismiko-strapi-plugin-audit-log`

### 0.0.1
- Initial release
