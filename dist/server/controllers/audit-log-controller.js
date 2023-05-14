"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    getContentTypes: async (ctx) => {
        const models = [];
        Object.values(strapi.contentTypes).map(async (contentType) => {
            if (contentType.uid.includes('api::')) {
                models.push(contentType);
            }
        });
        ctx.send(models);
    },
    /**
     * Get auditLog design action.
     *
     * @return {Object}
     */
    getAuditLogs: async (ctx) => {
        const auditLogs = await strapi.plugin('audit-log').service('auditService').findMany(ctx.request.query);
        ctx.send(auditLogs);
    },
    /**
     * Get auditLog design action.
     *
     * @return {Object}
     */
    getAuditLog: async (ctx) => {
        const auditLog = await strapi.plugin('audit-log').service('auditService').findOne({ id: ctx.params.id });
        ctx.send(auditLog);
    },
    /**
     * Delete auditLog design action.
     *
     * @return {Object}
     */
    deleteAuditLog: async (ctx) => {
        await strapi.plugin('audit-log').service('auditService').delete({ id: ctx.params.id });
        ctx.send({ removed: true });
    },
    /**
     * Save auditLog design action.
     *
     * @return {Object}
     */
    saveAuditLog: async (ctx) => {
        try {
            const auditLog = await strapi.plugin('audit-log').service('auditService').create(ctx.request.body);
            ctx.send(auditLog || {});
        }
        catch (error) {
            ctx.badRequest(null, error);
        }
    },
});
//# sourceMappingURL=audit-log-controller.js.map