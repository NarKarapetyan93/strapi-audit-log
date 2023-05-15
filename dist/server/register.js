"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const glob_1 = __importDefault(require("glob"));
const isStrapiProjectUsingTS = () => {
    const tsConfigPath = path_1.default.resolve(process.cwd(), 'tsconfig.json');
    const tsFiles = glob_1.default.sync('src/**/*.ts');
    return fs_1.default.existsSync(tsConfigPath) && tsFiles.length > 0;
};
const addMissingFiles = () => {
    // Create extensions folder if not exists
    const extensionsConfigPath = path_1.default.resolve(process.cwd(), 'src/extensions');
    if (!fs_1.default.existsSync(extensionsConfigPath)) {
        fs_1.default.mkdirSync(extensionsConfigPath);
    }
    // Create content-manager folder inside extensions folder
    const contentManagerPath = path_1.default.resolve(process.cwd(), 'src/extensions/content-manager');
    if (!fs_1.default.existsSync(contentManagerPath)) {
        fs_1.default.mkdirSync(contentManagerPath);
    }
    // Create strapi server file if not exists
    const strapiServerPath = path_1.default.resolve(contentManagerPath, `strapi-server.${isStrapiProjectUsingTS() ? 'ts' : 'js'}`);
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
  `;
    if (!fs_1.default.existsSync(strapiServerPath)) {
        if (isStrapiProjectUsingTS()) {
            fs_1.default.writeFileSync(strapiServerPath, `export default (plugin) => {${contentManagerContent}}`);
        }
        else {
            fs_1.default.writeFileSync(strapiServerPath, `module.exports = (plugin) => {${contentManagerContent}}`);
        }
    }
};
exports.default = ({ strapi }) => {
    addMissingFiles();
};
//# sourceMappingURL=register.js.map