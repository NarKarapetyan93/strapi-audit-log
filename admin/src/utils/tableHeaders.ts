const tableHeaders = [
  {
    name: 'date',
    key: 'date',
    metadatas: {
      label: 'Date',
      sortable: true,
    },
  },
  {
    key: 'user',
    name: 'user',
    metadatas: {
      label: 'User',
      sortable: false,
    },
    cellFormatter: (user: any) => (user ? `${user?.firstname} ${user?.lastname}`  : ''),
  },
  {
    name: 'action',
    key: 'action',
    metadatas: {
      label: 'Action',
      sortable: true,
    },
  },
  {
    name: 'collection',
    key: 'collection',
    metadatas: {
      label: 'Collection',
      sortable: true,
    },
  },
];

export default tableHeaders;
