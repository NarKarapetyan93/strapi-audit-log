"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => {
    const models = [];
    Object.values(strapi.contentTypes).map(async (contentType) => {
        if (contentType.uid.includes('api::')) {
            models.push(contentType.uid);
        }
    });
    strapi.db.lifecycles.subscribe({
        async afterCreate(event) {
            const { model, params, result } = event;
            if (models.includes(model.uid)) {
                const { data: reqBody } = params;
                const { actionBy } = reqBody;
                await strapi.plugin('audit-log').service('auditService').create({
                    date: new Date(),
                    user: actionBy,
                    collection: model.uid,
                    action: 'create',
                    collectionAffectedId: result.id,
                    params: {
                        where: params.where,
                        populate: params.populate,
                    },
                    data: reqBody,
                });
            }
        },
        async afterUpdate(event) {
            const { model, params } = event;
            if (models.includes(model.uid)) {
                const { data: reqBody } = params;
                const { actionBy } = reqBody;
                await strapi.plugin('audit-log').service('auditService').create({
                    date: new Date(),
                    user: actionBy,
                    collection: model.uid,
                    collectionAffectedId: params.where.id,
                    action: 'update',
                    params: {
                        where: params.where,
                        populate: params.populate,
                    },
                    data: reqBody,
                });
            }
        },
        async afterDelete(event) {
            const { model, params } = event;
            if (models.includes(model.uid)) {
                const record = await strapi.plugin('audit-log').service('auditService').findOne({
                    action: 'delete',
                    collection: model.uid,
                    collectionAffectedId: params.where.id,
                });
                if (!record) {
                    await strapi.plugin('audit-log').service('auditService').create({
                        date: new Date(),
                        user: null,
                        collection: model.uid,
                        action: 'delete',
                        params: {
                            where: params.where,
                        },
                    });
                }
            }
        },
        afterCount(event) { },
        afterCreateMany(event) { },
        afterDeleteMany(event) {
            // TODO:: Implement bulk delete to track changes
        },
        afterFindMany(event) { },
        afterFindOne(event) { },
        afterUpdateMany(event) {
            // TODO:: Implement bulk update to track changes
        },
        beforeCount(event) { },
        beforeCreate(event) { },
        beforeCreateMany(event) { },
        beforeDelete(event) { },
        beforeDeleteMany(event) { },
        beforeFindMany(event) { },
        beforeFindOne(event) { },
        beforeUpdate(event) { },
        beforeUpdateMany(event) { }
    });
};
//# sourceMappingURL=bootstrap.js.map