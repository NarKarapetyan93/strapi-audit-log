```javascript
module.exports = (plugin) => {
  const createMethod = plugin.controllers['collection-types'].create;
  const updateMethod = plugin.controllers['collection-types'].update;
  const deleteMethod = plugin.controllers['collection-types'].delete;
  const bulkDeleteMethod = plugin.controllers['collection-types'].bulkDelete;

  const createOrUpdateSingleTypesMethod = plugin.controllers['single-types'].createOrUpdate;
  const deleteSingleTypeMethod = plugin.controllers['single-types'].delete;

  const getUser = (ctx) => {
    return ctx.state?.user;
  }

  plugin.controllers['collection-types'].create = async (ctx) => {
    const user = getUser(ctx);
    ctx.request.body.actionBy = user.id;
    return await createMethod(ctx);
  }

  plugin.controllers['collection-types'].update = async (ctx) => {
    const user = getUser(ctx);
    ctx.request.body.actionBy = user.id;
    return await updateMethod(ctx);
  }

  plugin.controllers['collection-types'].delete = async (ctx) => {
    const user = getUser(ctx);
    await strapi.plugin('audit-log').service('auditService').create({
      date: new Date(),
      user: user,
      collection: ctx.request.params.model,
      collectionAffectedId: ctx.request.params.id,
      action: 'delete',
      params: {
        where: {
          id: ctx.request.params.id
        },
      },
    });

    return deleteMethod(ctx);
  }

  plugin.controllers['collection-types'].bulkDelete = async (ctx) => {
    const user = getUser(ctx);
    await strapi.plugin('audit-log').service('auditService').create({
      date: new Date(),
      user: user,
      collection: ctx.request.params.model,
      collectionAffectedId: JSON.stringify(ctx.request.body.ids),
      action: 'bulk delete',
      params: {
        where: {
          id: {
            $in: ctx.request.body.ids
          }
        },
      },
    });

    return await bulkDeleteMethod(ctx);
  }

  plugin.controllers['single-types'].createOrUpdate = async (ctx) => {
    const user = getUser(ctx);
    ctx.request.body.actionBy = user.id;
    return await createOrUpdateSingleTypesMethod(ctx);
  }

  plugin.controllers['single-types'].delete = async (ctx) => {
    const user = getUser(ctx);
    const [singleType] = await strapi.query(ctx.request.params.model).findMany();
    await strapi.plugin('audit-log').service('auditService').create({
      date: new Date(),
      user: user,
      collection: ctx.request.params.model,
      collectionAffectedId: singleType.id,
      action: 'delete',
      params: {
        where: {
          id: ctx.request.params.id
        },
      },
    });

    return deleteSingleTypeMethod(ctx);
  }

  return plugin;
}
```
