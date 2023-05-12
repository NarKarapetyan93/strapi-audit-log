import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({
  /**
   * Get template design action.
   *
   * @return {Object}
   */
  getAuditLogs: async (ctx) => {
    const templates = await strapi.plugin('audit-log').service('auditService').findMany();
    ctx.send(templates);
  },

  /**
   * Get template design action.
   *
   * @return {Object}
   */
  getAuditLog: async (ctx) => {
    const template = await strapi.plugin('audit-log').service('auditService').findOne({ id: ctx.params.id });
    ctx.send(template);
  },

  /**
   * Delete template design action.
   *
   * @return {Object}
   */
  deleteAuditLog: async (ctx) => {
    await strapi.plugin('audit-log').service('auditService').delete({ id: ctx.params.id });
    ctx.send({ removed: true });
  },

  /**
   * Save template design action.
   *
   * @return {Object}
   */
  saveAuditLog: async (ctx) => {
    try {
      const template = await strapi.plugin('audit-log').service('auditService').create(ctx.request.body);
      ctx.send(template || {});
    } catch (error) {
      ctx.badRequest(null, error);
    }
  },
});
