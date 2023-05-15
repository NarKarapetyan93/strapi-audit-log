/*
 *
 * HomePage
 *
 */

import React, {useEffect, useState} from 'react';
import {ActionLayout, HeaderLayout, ContentLayout, Main, EmptyStateLayout} from '@strapi/design-system';
import {LoadingIndicatorPage, CheckPermissions, DynamicTable, SearchURLQuery} from '@strapi/helper-plugin';
import apiRequest from "../../api/api";
import Modal from "../../components/Modal";
import permissions from "../../permissions";
import {useQueryParams} from '@strapi/helper-plugin';
import {IParams} from "../../interfaces/IParams";
import {IPagination} from "../../interfaces/IPagination";
import {PaginationFooter} from "../../components/PaginationFooter/index.";
import getDisplayedFilters from "../../utils/getDisplayedFilters";
import Filters from "../../components/Filters";
import {useFetchClient} from '@strapi/helper-plugin';
import {TableRows} from "../../components/TableRows";
import headers from '../../utils/tableHeaders';

const HomePage = () => {
  const {get} = useFetchClient();
  const [isLoading, setIsLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [logId, setLogId] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [displayedFilters, setDisplayedFilters] = useState<any>([]);
  const [pagination, setPagination] = useState<IPagination>({
    page: 0,
    pageSize: 10,
    pageCount: 10,
    total: 0
  });

  const [{query}] = useQueryParams();

  useEffect(() => {
    const params: IParams = {
      pagination: {
        page: 1,
        pageSize: 10,
        pageCount: 10,
        total: 0
      },
      filters: {},
      sort: {},
      _q: ''
    };

    if (query?.page) {
      params.pagination.page = query.page
    }

    if (query?.pageSize) {
      params.pagination.pageSize = query.pageSize
    }

    if (query?.filters) {
      params.filters = query.filters;
    }

    if(query?.sort) {
      const [field, order] = query.sort.split(':');
      params.sort = {
        field,
        order
      }
    }

    if(query?._q) {
      params._q = query._q;
    }

    apiRequest.getLogs(params).then((res) => {
      setLogs(res.data.data);
      setIsLoading(false);
      setPagination(res.data.pagination);
    });

    get(`/admin/users`).then((res: any) => {
      const users = res.data.data;
      apiRequest.getContentTypes().then((res: any) => {
        const contentTypes = res.data;
        const df = getDisplayedFilters({users, contentTypes});
        setDisplayedFilters(df);
      });
    });


  }, [query]);

  if (isLoading) {
    return <LoadingIndicatorPage/>;
  }

  const handleModal = (logId: number | null) => {
    setIsVisible(!isVisible);
    setLogId(logId);
  }

  return (
    <div>
      <CheckPermissions permissions={permissions}>
        <Main aria-busy={isLoading}>
          <HeaderLayout
            title="Audit Logs"
            subtitle="View past history of your actions"
            as="h2"
          />
          {displayedFilters.length > 0 && <ActionLayout startActions={<><SearchURLQuery label='Search'/><Filters displayedFilters={displayedFilters}/></>}/>}
          {logs.length === 0 &&
            <ContentLayout>
              <EmptyStateLayout content="You don't have any logs yet..."/>
            </ContentLayout>}
          {logs.length > 0 && (
            <ContentLayout>
              <DynamicTable
                contentType="Audit logs"
                headers={headers}
                rows={logs || []}
                withBulkActions
                isLoading={isLoading}
              >
                <TableRows
                  headers={headers}
                  rows={logs || []}
                  handleModal={(id: any) => handleModal(id)}
                />
              </DynamicTable>
              <PaginationFooter pagination={pagination}/>
            </ContentLayout>
          )}
        </Main>
        <Modal logId={logId} visible={isVisible} onClose={handleModal}/>
      </CheckPermissions>
    </div>
  );
};

export default HomePage;
