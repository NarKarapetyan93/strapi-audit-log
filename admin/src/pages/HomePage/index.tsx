/*
 *
 * HomePage
 *
 */

import React, { useEffect, useState } from 'react';
import { BaseHeaderLayout } from '@strapi/design-system';
import { Table, Thead, Tbody, Tr, Td, Th, Box, Typography, VisuallyHidden, IconButton } from '@strapi/design-system';
import { LoadingIndicatorPage, CheckPermissions } from '@strapi/helper-plugin';
import dayjs from "dayjs";
import apiRequest from "../../api/api";
import Modal from "../../components/Modal";
import {Eye} from "@strapi/icons";
import permissions from "../../permissions";

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [logId, setLogId] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    apiRequest.getLogs().then((res) => {
      setLogs(res.data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <LoadingIndicatorPage />;
  }

  const handleModal = (logId: number | null) => {
    setIsVisible(!isVisible);
    setLogId(logId);
  }

  return (
    <div>
      <CheckPermissions permissions={permissions}>
        <Modal logId={logId} visible={isVisible} onClose={handleModal} />
        <Box>
          <BaseHeaderLayout
            title="Audit Logs"
            subtitle="View past history of your actions"
            as="h2"
          />
        </Box>
        <Box padding={8} background="neutral100">
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
                        <Typography textColor="neutral800">{dayjs(log.date).format('YYYY-MM-DD HH:mm:ss')}</Typography>
                      </Td>
                      <Td>
                        <Typography textColor="neutral800">{log.user ? `${log?.user?.firstname} ${log?.user?.lastname}` : 'External Change'}</Typography>
                      </Td>
                      <Td>
                        <Typography textColor="neutral800">{log.action.toUpperCase()}</Typography>
                      </Td>
                      <Td>
                        <Typography textColor="neutral800">{log.collection}</Typography>
                      </Td>
                      <Td>
                        <IconButton onClick={() => handleModal(log.id)} label="View" icon={<Eye />} />
                      </Td>
                    </Tr>
                  )
                })
              }
            </Tbody>
          </Table>
        </Box>
      </CheckPermissions>
    </div>
  );
};

export default HomePage;
