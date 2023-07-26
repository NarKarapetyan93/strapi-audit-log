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
        var _a;
        const requestState = (_a = strapi.requestContext.get()) === null || _a === void 0 ? void 0 : _a.state;
        const user = requestState === null || requestState === void 0 ? void 0 : requestState.user;
        const { model, params, result } = event;
        if (models.includes(model.uid)) {
            if (action === 'delete') {
                await strapi.plugin('audit-log').service('auditService').create({
                    date: new Date(),
                    user: user === null || user === void 0 ? void 0 : user.id,
                    collection: model.uid,
                    action: action,
                    params: {
                        where: params.where,
                    },
                });
            }
            else if (action === 'bulk delete') {
                const { data } = params;
                const { isLoggingDisabled } = data || {};
                if (isLoggingDisabled)
                    return;
                await strapi.plugin('audit-log').service('auditService').create({
                    date: new Date(),
                    user: user === null || user === void 0 ? void 0 : user.id,
                    collection: model.uid,
                    action: action,
                    params: {
                        where: params.where,
                    },
                });
            }
            else {
                const { data: reqBody } = params;
                const { isLoggingDisabled = false } = reqBody;
                if (isLoggingDisabled)
                    return;
                await strapi.plugin('audit-log').service('auditService').create({
                    date: new Date(),
                    user: user === null || user === void 0 ? void 0 : user.id,
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
        async afterCreate(event, ctx) {
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
        async beforeDelete(event) { },
        async beforeDeleteMany(event) { },
        beforeFindMany(event) { },
        beforeFindOne(event) { },
        beforeUpdate(event) { },
        beforeUpdateMany(event) { }
    });
};
//# sourceMappingURL=bootstrap.js.map