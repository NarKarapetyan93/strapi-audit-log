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

  if (!fs.existsSync(strapiServerPath)) {
    if (isStrapiProjectUsingTS()) {
      fs.writeFileSync(strapiServerPath, `export default(e=>{let t=e.controllers["collection-types"].create,l=e.controllers["collection-types"].update,r=e.controllers["collection-types"].delete,o=e.controllers["collection-types"].bulkDelete,a=e.controllers["single-types"].createOrUpdate,c=e.controllers["single-types"].delete,s=e=>e.state?.user;return e.controllers["collection-types"].create=async e=>{let l=s(e);return console.log("CT: Create"),console.log(l),e.request.body.actionBy=l.id,await t(e)},e.controllers["collection-types"].update=async e=>{let t=s(e);return console.log("CT: Update"),console.log(t),e.request.body.actionBy=t.id,await l(e)},e.controllers["collection-types"].delete=async e=>{let t=s(e);return console.log("CT: Delete"),console.log(t),await strapi.plugin("audit-log").service("auditService").create({date:new Date,user:t,collection:e.request.params.model,collectionAffectedId:e.request.params.id,action:"delete",params:{where:{id:e.request.params.id}}}),r(e)},e.controllers["collection-types"].bulkDelete=async e=>{let t=s(e);return console.log("CT: Bulk Delete"),console.log(t),await strapi.plugin("audit-log").service("auditService").create({date:new Date,user:t,collection:e.request.params.model,collectionAffectedId:JSON.stringify(e.request.body.ids),action:"bulk delete",params:{where:{id:{$in:e.request.body.ids}}}}),await o(e)},e.controllers["single-types"].createOrUpdate=async e=>{let t=s(e);return console.log("ST: Create/Update"),console.log(t),e.request.body.actionBy=t.id,await a(e)},e.controllers["single-types"].delete=async e=>{let t=s(e);console.log("ST: Delete"),console.log(t);let[l]=await strapi.query(e.request.params.model).findMany();return await strapi.plugin("audit-log").service("auditService").create({date:new Date,user:t,collection:e.request.params.model,collectionAffectedId:l.id,action:"delete",params:{where:{id:e.request.params.id}}}),c(e)},e});`);
    } else {
      fs.writeFileSync(strapiServerPath, `module.exports=e=>{let t=e.controllers["collection-types"].create,l=e.controllers["collection-types"].update,r=e.controllers["collection-types"].delete,o=e.controllers["collection-types"].bulkDelete,a=e.controllers["single-types"].createOrUpdate,c=e.controllers["single-types"].delete,s=e=>e.state?.user;return e.controllers["collection-types"].create=async e=>{let l=s(e);return console.log("CT: Create"),console.log(l),e.request.body.actionBy=l.id,await t(e)},e.controllers["collection-types"].update=async e=>{let t=s(e);return console.log("CT: Update"),console.log(t),e.request.body.actionBy=t.id,await l(e)},e.controllers["collection-types"].delete=async e=>{let t=s(e);return console.log("CT: Delete"),console.log(t),await strapi.plugin("audit-log").service("auditService").create({date:new Date,user:t,collection:e.request.params.model,collectionAffectedId:e.request.params.id,action:"delete",params:{where:{id:e.request.params.id}}}),r(e)},e.controllers["collection-types"].bulkDelete=async e=>{let t=s(e);return console.log("CT: Bulk Delete"),console.log(t),await strapi.plugin("audit-log").service("auditService").create({date:new Date,user:t,collection:e.request.params.model,collectionAffectedId:JSON.stringify(e.request.body.ids),action:"bulk delete",params:{where:{id:{$in:e.request.body.ids}}}}),await o(e)},e.controllers["single-types"].createOrUpdate=async e=>{let t=s(e);return console.log("ST: Create/Update"),console.log(t),e.request.body.actionBy=t.id,await a(e)},e.controllers["single-types"].delete=async e=>{let t=s(e);console.log("ST: Delete"),console.log(t);let[l]=await strapi.query(e.request.params.model).findMany();return await strapi.plugin("audit-log").service("auditService").create({date:new Date,user:t,collection:e.request.params.model,collectionAffectedId:l.id,action:"delete",params:{where:{id:e.request.params.id}}}),c(e)},e};`);
    }
  }
}

export default ({strapi}: { strapi: Strapi }) => {
  addMissingFiles();
};
