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
  async findMany(params) {
    const {
      pagination = {}
    } = params

    const queryParams = {
      orderBy: {
        date: 'desc'
      },
      populate: ['user'],
    }

    if (pagination.pageSize) {
      queryParams['limit'] = parseInt(pagination.pageSize)
    }

    if (pagination.page) {
      queryParams['offset'] = (parseInt(pagination.page) - 1) * parseInt(pagination.pageSize)
    }

    const count = await strapi.query('plugin::audit-log.audit-log').count();

    const data = await strapi.query('plugin::audit-log.audit-log').findMany(queryParams);

    return {
      data,
      pagination: {
        pageSize: parseInt(pagination.pageSize),
        page: parseInt(pagination.page),
        pageCount: Math.ceil(count / parseInt(pagination.pageSize)),
        total: count
      }
    };
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
