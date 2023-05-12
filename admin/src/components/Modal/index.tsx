import React, {useState, useEffect} from 'react';
import {
  ModalLayout,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button,
  Typography,
  Box,
  JSONInput,
  Stack,
  GridLayout,
} from '@strapi/design-system';
import apiRequest from "../../api/api";
import dayjs from "dayjs";

interface ModalProps {
  logId: number | null;
  visible: boolean;
  onClose: (logId: number | null) => void;
}

const Modal = ({ logId, visible, onClose }: ModalProps) => {
  const [log, setLog] = useState({} as any);
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    if(!logId) return;
    apiRequest.getLog(logId).then((res) => {
      setLog(res.data);
      setIsVisible(visible);
    });
  }, [logId, visible]);

  const handleClose = () => {
    setIsVisible(prev => !prev)
    onClose(null);
  }

  return (
    <>
      {isVisible && log && <ModalLayout onClose={handleClose} labelledBy="title">
        <ModalHeader>
          <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
            {dayjs(log.date).format('MMMM DD, YYYY, HH:mm:ss')} Log Details
          </Typography>
        </ModalHeader>
        <ModalBody>
          <GridLayout>
            <Box padding={4} hasRadius background="neutral0">
              <Stack vertical spacing={2} padding={3}>
                <Typography fontWeight="bold" textColor="neutral800">User</Typography>
                <Typography textColor="neutral800">{log?.user ? `${log?.user?.firstname} ${log?.user?.lastname}` : `External Change`}</Typography>
              </Stack>
            </Box>

            <Box padding={4} hasRadius background="neutral0">
              <Stack vertical spacing={2} padding={3}>
                <Typography fontWeight="bold" textColor="neutral800">Action</Typography>
                <Typography textColor="neutral800">{log.action.toUpperCase()}</Typography>
              </Stack>
            </Box>

            <Box padding={4} hasRadius background="neutral0">
              <Stack vertical spacing={2} padding={3}>
                <Typography fontWeight="bold" textColor="neutral800">Collection</Typography>
                <Typography textColor="neutral800">{log.collection}</Typography>
              </Stack>
            </Box>

            <Box padding={4} hasRadius background="neutral0">
              <Stack vertical spacing={2} padding={3}>
                <Typography fontWeight="bold" textColor="neutral800">Date</Typography>
                <Typography textColor="neutral800">{dayjs(log.date).format('MMMM DD, YYYY, HH:mm:ss')}</Typography>
              </Stack>
            </Box>
          </GridLayout>

          <Box padding={4} hasRadius background="neutral0">
            <Stack vertical spacing={2} padding={3}>
              <Typography fontWeight="bold" textColor="neutral800">Params</Typography>
              <JSONInput value={JSON.stringify(log.params, undefined, 4)} />
            </Stack>
          </Box>

          <Box padding={4} hasRadius background="neutral0">
            <Stack vertical spacing={2} padding={3}>
              <Typography fontWeight="bold" textColor="neutral800">Payload</Typography>
              <JSONInput value={JSON.stringify(log.data, undefined, 4)} />
            </Stack>
          </Box>
        </ModalBody>
        <ModalFooter
          startActions={
            <Button onClick={handleClose} variant="tertiary">Close</Button>
          }
        />
      </ModalLayout>}
    </>
  )
}

export default Modal;
