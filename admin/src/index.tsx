import {prefixPluginTranslations} from '@strapi/helper-plugin';

import pluginId from './pluginId';
import Initializer from './components/Initializer';
import PluginIcon from './components/PluginIcon';
import pluginPermissions from "./permissions";
import getTrad from "./utils/getTrad";

const name = "Audit Log";

export default {
  register(app: any) {
    // app.createSettingSection(
    //   {
    //     id: pluginId,
    //     intlLabel: {
    //       id: `${pluginId}.plugin.name`,
    //       defaultMessage: name,
    //     },
    //   },
    //   [
    //     {
    //       id: getTrad('settings.config'),
    //       intlLabel: {
    //         id: getTrad('settings.config'),
    //         defaultMessage: 'Configuration',
    //       },
    //       to: `/settings/${pluginId}/config`,
    //       async Component() {
    //         const component = await import(/* webpackChunkName: "[request]" */ './pages/ConfigPage');
    //
    //         return component;
    //       },
    //       permissions: pluginPermissions.main,
    //     }
    //   ]
    // );

    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: name,
      },
      Component: async () => {
        const component = await import(/* webpackChunkName: "[request]" */ './pages/App');

        return component;
      },
      permissions: pluginPermissions.main,
    });

    const plugin = {
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name,
    };

    app.registerPlugin(plugin);
  },

  bootstrap(app: any) {
  },

  async registerTrads(app: any) {
    const {locales} = app;

    const importedTrads = await Promise.all(
      (locales as any[]).map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({default: data}) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
