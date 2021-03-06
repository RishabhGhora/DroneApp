import { Table, Thead, Tbody, Tr, Th, Td, chakra } from '@chakra-ui/react'
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
import { useTable, useSortBy, Column } from 'react-table'

export type DataTableProps<Data extends object> = {
	data: Data[]
	columns: Column<Data>[]
}

function DataTable<Data extends object>({
	data,
	columns,
}: DataTableProps<Data>) {
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
	} = useTable({ columns, data }, useSortBy)

	return (
		<Table {...getTableProps()}>
			<Thead>
				{headerGroups.map((headerGroup) => (
					<Tr {...headerGroup.getHeaderGroupProps()}>
						{headerGroup.headers.map((column) => (
							<Th
								//@ts-ignore
								{...column.getHeaderProps(column.getSortByToggleProps())}
							>
								{column.render('Header')}

								<chakra.span pl="4">
									{
										//@ts-ignore
										column.isSorted ? (
											//@ts-ignore
											column.isSortedDesc ? (
												<TriangleDownIcon aria-label="sorted descending" />
											) : (
												<TriangleUpIcon aria-label="sorted ascending" />
											)
										) : null
									}
								</chakra.span>
							</Th>
						))}
					</Tr>
				))}
			</Thead>
			<Tbody {...getTableBodyProps()}>
				{rows.map((row) => {
					prepareRow(row)
					return (
						<Tr {...row.getRowProps()}>
							{row.cells.map((cell) => (
								<Td {...cell.getCellProps()}>{cell.render('Cell')}</Td>
							))}
						</Tr>
					)
				})}
			</Tbody>
		</Table>
	)
}
export default DataTable
