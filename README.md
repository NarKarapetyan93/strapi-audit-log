# Strapi plugin Audit Log

This plugin allows you to log all the actions performed by the users of your application.
Actions performed by the admin users or authenticated users are logged. For external changes if `ctx.state.user` is empty, it shows "External Change" instead of user name.

> **_<span style="color:red">IMPORTANT NOTE</span>:&nbsp;_**  This plugin is overwriting Strapi's default `content-manager` plugin and automatically creates `strapi-server.js` in `./srs/extensions` folder. So if you already overwrote this file `strapi-server.js` plugin may not work properly.

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

## Upcoming Features
- Filtering
- Sorting

## Changelog
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
