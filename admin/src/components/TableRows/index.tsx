import {Flex, IconButton, Tbody, Td, Tr, Typography} from "@strapi/design-system";
import dayjs from "dayjs";
import {Eye} from "@strapi/icons";
import React from "react";
import {onRowClick, stopPropagation} from "@strapi/helper-plugin";

export const TableRows = ({headers, rows, handleModal}: any) => {
  const getCellValue = ({ type, value }: any) => {
    if (type === 'date') {
      return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
    }

    if (type === 'action') {
      return value.toUpperCase();
    }

    return value || '-';
  };
  return (
    <Tbody>
      {
        rows.map((row: any, index: number) => {
          return (
            <Tr key={index} {...onRowClick({
              fn: () => handleModal(row.id),
            })}>
              {headers.map(({ key, name, cellFormatter }: any) => {
                return (
                  <Td key={key}>
                    <Typography textColor="neutral800">
                      {getCellValue({
                        type: key,
                        value: cellFormatter ? cellFormatter(row[name]) : row[name],
                      })}
                    </Typography>
                  </Td>
                );
              })}
              <Td {...stopPropagation}>
                <Flex justifyContent="end">
                  <IconButton
                    onClick={() => handleModal(row.id)}
                    noBorder
                    icon={<Eye />}
                  />
                </Flex>
              </Td>
            </Tr>
          )
        })
      }
    </Tbody>
  )
}
