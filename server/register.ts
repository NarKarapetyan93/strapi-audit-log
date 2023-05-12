import { Strapi } from '@strapi/strapi';
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
  if(!fs.existsSync(extensionsConfigPath)) {
    fs.mkdirSync(extensionsConfigPath);
  }

  // Create content-manager folder inside extensions folder
  const contentManagerPath = path.resolve(process.cwd(), 'src/extensions/content-manager');
  if(!fs.existsSync(contentManagerPath)) {
    fs.mkdirSync(contentManagerPath);
  }

  // Create strapi server file if not exists
  const strapiServerPath = path.resolve(contentManagerPath, `strapi-server.${isStrapiProjectUsingTS() ? 'ts' : 'js'}`);
  if(!fs.existsSync(strapiServerPath)) {
    if(isStrapiProjectUsingTS()) {
      fs.writeFileSync(strapiServerPath, `export default(e=>{let t=e.controllers["collection-types"].create,l=e.controllers["collection-types"].update,r=e.controllers["collection-types"].delete,o=e=>e.state?.user;return e.controllers["collection-types"].create=async e=>{let l=o(e);return e.request.body.actionBy=l.id,await t(e)},e.controllers["collection-types"].update=async e=>{let t=o(e);return e.request.body.actionBy=t.id,await l(e)},e.controllers["collection-types"].delete=async e=>{let t=o(e);return await strapi.plugin("audit-log").service("auditService").create({date:new Date,user:t,collection:e.request.params.model,collectionAffectedId:e.request.params.id,action:"delete",params:{where:{id:e.request.params.id}}}),r(e)},e});`);
    } else {
      fs.writeFileSync(strapiServerPath, `module.exports=e=>{let t=e.controllers["collection-types"].create,l=e.controllers["collection-types"].update,r=e.controllers["collection-types"].delete,o=e=>e.state?.user;return e.controllers["collection-types"].create=async e=>{let l=o(e);return e.request.body.actionBy=l.id,await t(e)},e.controllers["collection-types"].update=async e=>{let t=o(e);return e.request.body.actionBy=t.id,await l(e)},e.controllers["collection-types"].delete=async e=>{let t=o(e);return await strapi.plugin("audit-log").service("auditService").create({date:new Date,user:t,collection:e.request.params.model,collectionAffectedId:e.request.params.id,action:"delete",params:{where:{id:e.request.params.id}}}),r(e)},e};`);
    }
  }
}

export default ({ strapi }: { strapi: Strapi }) => {
  addMissingFiles();
};
