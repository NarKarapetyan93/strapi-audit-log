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
    if (!fs_1.default.existsSync(strapiServerPath)) {
        if (isStrapiProjectUsingTS()) {
            fs_1.default.writeFileSync(strapiServerPath, `export default(e=>{let t=e.controllers["collection-types"].create,l=e.controllers["collection-types"].update,r=e.controllers["collection-types"].delete,o=e=>e.state?.user;return e.controllers["collection-types"].create=async e=>{let l=o(e);return e.request.body.actionBy=l.id,await t(e)},e.controllers["collection-types"].update=async e=>{let t=o(e);return e.request.body.actionBy=t.id,await l(e)},e.controllers["collection-types"].delete=async e=>{let t=o(e);return await strapi.plugin("audit-log").service("auditService").create({date:new Date,user:t,collection:e.request.params.model,collectionAffectedId:e.request.params.id,action:"delete",params:{where:{id:e.request.params.id}}}),r(e)},e});`);
        }
        else {
            fs_1.default.writeFileSync(strapiServerPath, `module.exports=e=>{let t=e.controllers["collection-types"].create,l=e.controllers["collection-types"].update,r=e.controllers["collection-types"].delete,o=e=>e.state?.user;return e.controllers["collection-types"].create=async e=>{let l=o(e);return e.request.body.actionBy=l.id,await t(e)},e.controllers["collection-types"].update=async e=>{let t=o(e);return e.request.body.actionBy=t.id,await l(e)},e.controllers["collection-types"].delete=async e=>{let t=o(e);return await strapi.plugin("audit-log").service("auditService").create({date:new Date,user:t,collection:e.request.params.model,collectionAffectedId:e.request.params.id,action:"delete",params:{where:{id:e.request.params.id}}}),r(e)},e};`);
        }
    }
};
exports.default = ({ strapi }) => {
    addMissingFiles();
};
//# sourceMappingURL=register.js.map