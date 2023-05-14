"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
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
        const { pagination = {}, sort = {}, filters = {}, } = params;
        const queryParams = {
            populate: ['user'],
        };
        if (sort && sort.hasOwnProperty('field') && sort.hasOwnProperty('order')) {
            queryParams['orderBy'] = {
                [sort.field]: sort.order
            };
        }
        else {
            queryParams['orderBy'] = {
                date: 'desc'
            };
        }
        if (filters && Object.keys(filters).length > 0) {
            queryParams['where'] = filters;
        }
        if (pagination.pageSize) {
            queryParams['limit'] = parseInt(pagination.pageSize);
        }
        if (pagination.page) {
            queryParams['offset'] = (parseInt(pagination.page) - 1) * parseInt(pagination.pageSize);
        }
        const count = await strapi.query('plugin::audit-log.audit-log').count({
            ...(queryParams.hasOwnProperty('where') && { where: queryParams['where'] })
        });
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
//# sourceMappingURL=audit-log-service.js.map