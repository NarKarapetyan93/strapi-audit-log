export default [
  {
    method: 'GET',
    path: '/',
    handler: 'auditController.getAuditLogs',
    config: {
      policies: [],
    },
  },
  { // Path defined with a regular expression
    method: 'GET',
    path: '/content-types', // Only match when the URL parameter is composed of lowercase letters
    handler: 'auditController.getContentTypes',
  },
  {
    method: 'GET',
    path: '/:id',
    handler: 'auditController.getAuditLog',
    config: {
      policies: [],
    },
  },
  {
    method: 'DELETE',
    path: '/:id',
    handler: 'auditController.deleteAuditLog',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/',
    handler: 'auditController.saveAuditLog',
    config: {
      policies: [],
    },
  },
];
