export default async ({ strapi }) => {
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

  Object.values(strapi.contentTypes).map(async (contentType: any) => {
    if(contentType.uid.includes('api::')) {
      models.push(contentType.uid);
    }
  });

  const createAuditLog = async (event: any, action: string) => {
    const requestState = strapi.requestContext.get()?.state;
    const user = requestState?.user;

    const {model, params, result} = event;
    if(models.includes(model.uid)) {
      if(action === 'delete') {
          await strapi.plugin('audit-log').service('auditService').create({
            date: new Date(),
            user: user?.id,
            collection: model.uid,
            action: action,
            params: {
              where: params.where,
            },
          });
      } else if(action === 'bulk delete') {
        const { data } = params;
        const { isLoggingDisabled } = data || {};
        if(isLoggingDisabled) return;

        await strapi.plugin('audit-log').service('auditService').create({
          date: new Date(),
          user: user?.id,
          collection: model.uid,
          action: action,
          params: {
            where: params.where,
          },
        });
      } else {
        const { data: reqBody } = params;
        const { isLoggingDisabled = false } = reqBody;
        if(isLoggingDisabled) return;
        await strapi.plugin('audit-log').service('auditService').create({
          date: new Date(),
          user: user?.id,
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
  }

  strapi.db.lifecycles.subscribe({
    async afterCreate(event: any, ctx: any) {
      await createAuditLog(event, 'create');
    },
    async afterUpdate(event: any) {
      await createAuditLog(event, 'update');
    },
    async afterDelete(event: any) {
      await createAuditLog(event, 'delete');
    },
    afterCount(event: any) {},
    afterCreateMany(event: any) {},
    async afterDeleteMany(event: any) {
      await createAuditLog(event, 'bulk delete');
    },
    afterFindMany(event: any) {},
    afterFindOne(event: any) {},
    afterUpdateMany(event: any) {},
    beforeCount(event: any) {},
    beforeCreate(event: any) {},
    beforeCreateMany(event: any) {},
    async beforeDelete(event: any) {},
    async beforeDeleteMany(event: any) {},
    beforeFindMany(event: any) {},
    beforeFindOne(event: any) {},
    beforeUpdate(event: any) {},
    beforeUpdateMany(event: any) {}

  })
};
