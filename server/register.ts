import {Strapi} from '@strapi/strapi';
import fs from 'fs';
import path from 'path';
import glob from 'glob';

const isStrapiProjectUsingTS = () => {
  const tsConfigPath = path.resolve(process.cwd(), 'tsconfig.json');
  const tsFiles = glob.sync('src/**/*.ts');
  return fs.existsSync(tsConfigPath) && tsFiles.length > 0;
}

const addMissingFiles = () => {
  // Create extensions folder if not exists
  const extensionsConfigPath = path.resolve(process.cwd(), 'src/extensions');
  if (!fs.existsSync(extensionsConfigPath)) {
    fs.mkdirSync(extensionsConfigPath);
  }

  // Create content-manager folder inside extensions folder
  const contentManagerPath = path.resolve(process.cwd(), 'src/extensions/content-manager');
  if (!fs.existsSync(contentManagerPath)) {
    fs.mkdirSync(contentManagerPath);
  }

  // Create strapi server file if not exists
  const strapiServerPath = path.resolve(contentManagerPath, `strapi-server.${isStrapiProjectUsingTS() ? 'ts' : 'js'}`);
  const contentManagerContent = `
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
    console.log('CT: Create');
    console.log(user);
    ctx.request.body.actionBy = user.id;
    return await createMethod(ctx);
  }

  plugin.controllers['collection-types'].update = async (ctx) => {
    const user = getUser(ctx);
    console.log('CT: Update');
    console.log(user);
    ctx.request.body.actionBy = user.id;
    return await updateMethod(ctx);
  }

  plugin.controllers['collection-types'].delete = async (ctx) => {
    const user = getUser(ctx);
    console.log('CT: Delete');
    console.log(user);
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
    console.log('CT: Bulk Delete');
    console.log(user);
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
    console.log('ST: Create/Update');
    console.log(user);
    ctx.request.body.actionBy = user.id;
    return await createOrUpdateSingleTypesMethod(ctx);
  }

  plugin.controllers['single-types'].delete = async (ctx) => {
    const user = getUser(ctx);
    console.log('ST: Delete');
    console.log(user);
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
  `
  if (!fs.existsSync(strapiServerPath)) {
    if (isStrapiProjectUsingTS()) {
      fs.writeFileSync(strapiServerPath, `export default (plugin) => {${contentManagerContent}}`);
    } else {
      fs.writeFileSync(strapiServerPath, `module.exports = (plugin) => {${contentManagerContent}}`);
    }
  }
}

export default ({strapi}: { strapi: Strapi }) => {
  addMissingFiles();
};
