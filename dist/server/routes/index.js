"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = [
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
        path: '/content-types',
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
//# sourceMappingURL=index.js.map