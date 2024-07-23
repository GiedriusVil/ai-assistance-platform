/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import React, { useEffect, useState } from 'react';
import { DataTable, DataTableRow, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Tile } from 'carbon-components-react';
import { getEventStreams } from '../services/SurgeonService';

const HEADERS = [
  { key: 'id', header: 'Id' },
  { key: 'name', header: 'Name' },
  { key: 'status', header: 'Status' },
];

const EventStreamsView = () => {
  const [mongoClients, setMongoClients] = useState<DataTableRow[]>([]);

  useEffect(() => {
    const getData = async () => {
      const CLIENTS = await getEventStreams();
      const ROWS: DataTableRow[] = Object.entries(CLIENTS).map(
        ([id, client]: [string, any]) => {
          const RET_VAL = {
            id: id ?? 'N/A',
            name: client?.name ?? 'N/A',
            status: client?.status?.status ?? 'Unknown'
          };
          return RET_VAL;
        }
      )

      setMongoClients(ROWS);
    };

    getData();
  }, []);


  return (
    <>
      <Tile className='margin-bottom-1'>
        <h2>
          Event Streams Status
        </h2>
      </Tile>
      {/* @ts-ignore */}
      <DataTable rows={mongoClients} headers={HEADERS}>
        {({
          rows,
          headers,
        }: any) => (
          <Table>
            <TableHead>
              <TableRow>
                {headers.map((header: any, i: any) => (
                  <TableHeader
                    id={header.header}
                    key={i}>
                    {header.header}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row: any) => (
                <TableRow>
                  {row.cells.map((cell: any) => (
                    <TableCell key={cell.id}>{cell.value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DataTable>
    </>
  );
}

export default EventStreamsView;
