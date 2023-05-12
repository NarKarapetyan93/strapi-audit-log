export default [
  {
    method: 'GET',
    path: '/',
    handler: 'auditController.getAuditLogs',
    config: {
      policies: [],
    },
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
