import { Strapi } from '@strapi/strapi';

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
    const {model, params, result} = event;
    if(models.includes(model.uid)) {
      if(action === 'delete') {
        const record = await strapi.plugin('audit-log').service('auditService').findOne({
          action: 'delete',
          collection: model.uid,
          collectionAffectedId: params.where.id,
        });

        if(!record) {
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
      } else if(action === 'bulk delete') {
        const inParams = params.where.$and.find((p) => p?.id?.$in);
        const record = await strapi.plugin('audit-log').service('auditService').findOne({
          action: 'bulk delete',
          collection: model.uid,
          collectionAffectedId: JSON.stringify(inParams.id.$in),
        });

        if(!record) {
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
      } else {
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
  }

  strapi.db.lifecycles.subscribe({
    async afterCreate(event: any) {
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
    beforeDelete(event: any) {},
    beforeDeleteMany(event: any) {},
    beforeFindMany(event: any) {},
    beforeFindOne(event: any) {},
    beforeUpdate(event: any) {},
    beforeUpdateMany(event: any) {}

  })
};
