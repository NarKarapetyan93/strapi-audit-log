"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = async ({ strapi }) => {
    const actions = [
        {
            section: 'plugins',
            displayName: 'Read',
            uid: 'read',
            pluginName: 'audit-log',
        },
    ];
    await strapi.admin.services.permission.actionProvider.registerMany(actions);
    const models = [];
    Object.values(strapi.contentTypes).map(async (contentType) => {
        if (contentType.uid.includes('api::')) {
            models.push(contentType.uid);
        }
    });
    const createAuditLog = async (event, action) => {
        const { model, params, result } = event;
        if (models.includes(model.uid)) {
            if (action === 'delete') {
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
                        action: action,
                        params: {
                            where: params.where,
                        },
                    });
                }
            }
            else if (action === 'bulk delete') {
                const inParams = params.where.hasOwnProperty('$and') ? params.where.$and.find((p) => p.hasOwnProperty('id') && p.id.hasOwnProperty('$in')) : null;
                const record = await strapi.plugin('audit-log').service('auditService').findOne({
                    action: 'bulk delete',
                    collection: model.uid,
                    ...(inParams && { collectionAffectedId: JSON.stringify(inParams.id.$in) }),
                });
                if (!record) {
                    await strapi.plugin('audit-log').service('auditService').create({
                        date: new Date(),
                        user: null,
                        collection: model.uid,
                        action: action,
                        params: {
                            where: params.where,
                        },
                    });
                }
            }
            else {
                const { data: reqBody } = params;
                const { actionBy } = reqBody;
                await strapi.plugin('audit-log').service('auditService').create({
                    date: new Date(),
                    user: actionBy,
                    collection: model.uid,
                    action: action,
                    collectionAffectedId: result.id,
                    params: {
                        where: params.where,
                        populate: params.populate,
                    },
                    data: reqBody,
                });
            }
        }
    };
    strapi.db.lifecycles.subscribe({
        async afterCreate(event) {
            await createAuditLog(event, 'create');
        },
        async afterUpdate(event) {
            await createAuditLog(event, 'update');
        },
        async afterDelete(event) {
            await createAuditLog(event, 'delete');
        },
        afterCount(event) { },
        afterCreateMany(event) { },
        async afterDeleteMany(event) {
            await createAuditLog(event, 'bulk delete');
        },
        afterFindMany(event) { },
        afterFindOne(event) { },
        afterUpdateMany(event) { },
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