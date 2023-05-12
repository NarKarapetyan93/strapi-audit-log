import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => {
  const models = [];
  Object.values(strapi.contentTypes).map(async (contentType: any) => {
    if(contentType.uid.includes('api::')) {
      models.push(contentType.uid);
    }
  });

  strapi.db.lifecycles.subscribe({
    async afterCreate(event: any) {
      const {model, params, result} = event;
      if(models.includes(model.uid)) {
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
    async afterUpdate(event: any) {
      const {model, params} = event;
      if(models.includes(model.uid)) {
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
    async afterDelete(event: any) {
      const {model, params} = event;
      if(models.includes(model.uid)) {
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
            action: 'delete',
            params: {
              where: params.where,
            },
          });
        }
      }
    },
    afterCount(event: any) {},
    afterCreateMany(event: any) {},
    afterDeleteMany(event: any) {
      // TODO:: Implement bulk delete to track changes
    },
    afterFindMany(event: any) {},
    afterFindOne(event: any) {},
    afterUpdateMany(event: any) {
      // TODO:: Implement bulk update to track changes
    },
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
