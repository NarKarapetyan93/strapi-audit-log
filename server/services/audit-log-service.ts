import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({
  /**
   * Promise to fetch an audit log.
   * @return {Promise}
   */
  findOne(params) {
    return strapi.query('plugin::audit-log.audit-log').findOne({
      where: params,
      populate: ['user'],
    });
  },

  /**
   * Promise to fetch all audit logs.
   * @return {Promise}
   */
  findMany(params) {
    return strapi.query('plugin::audit-log.audit-log').findMany({
      where: params,
      populate: ['user'],
      orderBy: { date: 'desc' },
    });
  },

  /**
   * Promise to add an audit log.
   * @return {Promise}
   */
  async create(values) {
    return await strapi.db.query('plugin::audit-log.audit-log').create({
      data: {
        ...values,
      }
    });
  },
});
