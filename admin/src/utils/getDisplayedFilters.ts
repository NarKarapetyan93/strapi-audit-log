import ComboboxFilter from '../components/ComboboxFilter';
import { getDefaultMessage, actionTypes } from './getActionTypesDefaultMessages';

const simpleOperators = [
  {
    intlLabel: { id: 'components.FilterOptions.FILTER_TYPES.$eq', defaultMessage: 'is' },
    value: '$eq',
  },
  {
    intlLabel: { id: 'components.FilterOptions.FILTER_TYPES.$ne', defaultMessage: 'is not' },
    value: '$ne',
  },
];

const userOperators = [
  ...simpleOperators,
  {
    intlLabel: { id: 'components.FilterOptions.FILTER_TYPES.$null', defaultMessage: 'is null' },
    value: '$null',
  },
  {
    intlLabel: { id: 'components.FilterOptions.FILTER_TYPES.$notNull', defaultMessage: 'is not null' },
    value: '$notNull',
  }
];

const getDisplayedFilters = ({ users, contentTypes }: any) => {
  const actionOptions = Object.keys(actionTypes).map((action) => {
    return {
      label: getDefaultMessage(action),
      customValue: action,
    };
  });

  const filters = [
    {
      name: 'action',
      metadatas: {
        customOperators: simpleOperators,
        label: 'Action',
        options: actionOptions,
        customInput: ComboboxFilter,
      },
      fieldSchema: { type: 'string' },
    },
    {
      name: 'date',
      metadatas: {
        label: 'Date',
      },
      fieldSchema: { type: 'datetime' },
    },
  ];

  let userFilter: any = null;
  if (users) {
    const getDisplayNameFromUser = (user: any) => {
      if (user.username) {
        return user.username;
      }

      if (user.firstname && user.lastname) {
        return `${user.firstname} ${user.lastname}`;
      }

      return user.email;
    };

    const userOptions = users.results.map((user: any) => {
      return {
        label: getDisplayNameFromUser(user),
        customValue: user.id.toString(),
      };
    });

    userFilter = {
      name: 'user',
      metadatas: {
        customOperators: userOperators,
        label: 'User',
        options: userOptions,
        customInput: ComboboxFilter,
      },
      fieldSchema: { type: 'relation', mainField: { name: 'id' } },
    }
  }

  let contentTypeFilter = null;
  if(contentTypes) {
    const contentTypeOptions = contentTypes.map((contentType: any) => {
      return {
        label: contentType.globalId,
        customValue: contentType.uid,
      };
    });
    contentTypeFilter = {
      name: 'collection',
      metadatas: {
        customOperators: simpleOperators,
        label: 'Collection',
        options: contentTypeOptions,
        customInput: ComboboxFilter,
      },
      fieldSchema: { type: 'string' },
    }
  }

  const finalFilters = [...filters];
  if (userFilter) {
    finalFilters.push(userFilter);
  }

  if (contentTypeFilter) {
    finalFilters.push(contentTypeFilter);
  }
  return finalFilters;
};

export default getDisplayedFilters;
