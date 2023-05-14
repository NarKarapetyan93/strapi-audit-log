/*
 *
 * HomePage
 *
 */

import React, {useEffect, useState} from 'react';
import {ActionLayout, HeaderLayout, ContentLayout, Main} from '@strapi/design-system';
import {
  EmptyStateLayout,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  Typography,
  VisuallyHidden,
  IconButton
} from '@strapi/design-system';
import {LoadingIndicatorPage, CheckPermissions} from '@strapi/helper-plugin';
import dayjs from "dayjs";
import apiRequest from "../../api/api";
import Modal from "../../components/Modal";
import {Eye} from "@strapi/icons";
import permissions from "../../permissions";
import {useQueryParams} from '@strapi/helper-plugin';
import {IParams} from "../../interfaces/IParams";
import {IPagination} from "../../interfaces/IPagination";
import {PaginationFooter} from "../../components/PaginationFooter/index.";
import getDisplayedFilters from "../../utils/getDisplayedFilters";
import Filters from "../../components/Filters";
import {useFetchClient} from '@strapi/helper-plugin';

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
    console.log(query);
    const params: IParams = {
      pagination: {
        page: 1,
        pageSize: 10,
        pageCount: 10,
        total: 0
      },
      filters: {}
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

    apiRequest.getLogs(params).then((res) => {
      setLogs(res.data.data);
      setIsLoading(false);
      setPagination(res.data.pagination);
    });

    get(`/admin/users`).then((res: any) => {
      const users = res.data.data;
      apiRequest.getContentTypes().then((res: any) => {
        console.log(res.data);
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
          {displayedFilters.length > 0 && <ActionLayout startActions={<Filters displayedFilters={displayedFilters}/>}/>}
          {logs.length === 0 && <EmptyStateLayout content="You don't have any logs yet..."/>}
          {logs.length > 0 && (
            <ContentLayout>
              <Table colCount={5} rowCount={10}>
                <Thead>
                  <Tr>
                    <Th>
                      <Typography variant="sigma">Date</Typography>
                    </Th>
                    <Th>
                      <Typography variant="sigma">User</Typography>
                    </Th>
                    <Th>
                      <Typography variant="sigma">Action</Typography>
                    </Th>
                    <Th>
                      <Typography variant="sigma">Collection</Typography>
                    </Th>
                    <Th>
                      <VisuallyHidden>Actions</VisuallyHidden>
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {
                    logs.map((log: any, index) => {
                      return (
                        <Tr key={index}>
                          <Td>
                            <Typography
                              textColor="neutral800">{dayjs(log.date).format('YYYY-MM-DD HH:mm:ss')}</Typography>
                          </Td>
                          <Td>
                            <Typography
                              textColor="neutral800">{log.user ? `${log?.user?.firstname} ${log?.user?.lastname}` : 'External Change'}</Typography>
                          </Td>
                          <Td>
                            <Typography textColor="neutral800">{log.action.toUpperCase()}</Typography>
                          </Td>
                          <Td>
                            <Typography textColor="neutral800">{log.collection}</Typography>
                          </Td>
                          <Td>
                            <IconButton onClick={() => handleModal(log.id)} label="View" icon={<Eye/>}/>
                          </Td>
                        </Tr>
                      )
                    })
                  }
                </Tbody>
              </Table>
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
