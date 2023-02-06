import React, {useCallback, useMemo, useState, useEffect} from 'react';
import MaterialReactTable from 'material-react-table';
import {Box, Button, IconButton, Tooltip} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {Delete, Edit, Visibility} from '@mui/icons-material';
import CreateElement from '../components/ui/CreateElement';
import {getCompanies, insertCompany, updateCompany, deleteCompany} from '../api/companies';
import {validateEmail, validateAge, validateRequired, renderElement} from '../utils/validators';
import {useAuthContext} from '../context/AuthContext';

const Companies = () => {
	const [createModalOpen, setCreateModalOpen] = useState(false);
	const [companies, setCompanies] = useState([]);
	const [validationErrors, setValidationErrors] = useState({});
	const navigate = useNavigate();

	const {user} = useAuthContext();

	useEffect(() => {
		const fetchData = async () => {
			const companies = await getCompanies();
			setCompanies(companies);
		};
		fetchData();
	}, []);

	const handleCreateNewRow = async (values) => {
		const company = await insertCompany(values);
		companies.push(company);
		setCompanies([...companies]);
	};

	const handleUpdateRow = async ({exitEditingMode, row, values}) => {
		if (!Object.keys(validationErrors).length) {
			const itemId = companies[row.index].id;

			const updatedItem = {
				...companies[row.index],
				nit: values.nit,
				name: values.name,
				address: values.address,
				phone: values.phone
			};

			await updateCompany(itemId, updatedItem);

			companies[row.index] = updatedItem;

			setCompanies([...companies]);
			exitEditingMode(); // required to exit editing mode and close modal
		}
	};

	const handleDeleteRow = useCallback(
		async (row) => {
			if (!confirm(`Are you sure you want to delete the company ${row.getValue('name')}`)) {
				return;
			}
			const itemId = row.original.id;
			await deleteCompany(itemId);
			const companies = await getCompanies();
			setCompanies(companies);
		},
		[companies]
	);

	const handleCancelRowEdits = () => {
		setValidationErrors({});
	};

	const getCommonEditTextFieldProps = useCallback(
		(cell) =>
			({
				error: !!validationErrors[cell.id],
				helperText: validationErrors[cell.id],
				onBlur: (event) => {
					let isValid = true;

					if (cell.column.id === 'email') {
						isValid = validateEmail(event.target.value);
					} else if (cell.column.id === 'age') {
						isValid = validateAge(+event.target.value);
					} else {
						validateRequired(event.target.value);
					}

					if (!isValid) {
						// set validation error for cell if invalid
						setValidationErrors({
							...validationErrors,
							[cell.id]: `${cell.column.columnDef.header} is required`
						});
					} else {
						// remove validation error for cell if valid
						delete validationErrors[cell.id];
						setValidationErrors({
							...validationErrors
						});
					}
				}
			}[validationErrors])
	);

	const onProductClick = (event) => {
		const companyId = event.row.original.id;
		navigate('/articles', {
			state: {companyId}
		});
	};

	const columns = useMemo(
		() => [
			{
				accessorKey: 'nit',
				header: 'NIT',
				size: 80
			},
			{
				accessorKey: 'name',
				header: 'Name',
				size: 140,
				muiTableBodyCellEditTextFieldProps: ({cell}) => ({
					...getCommonEditTextFieldProps(cell)
				})
			},
			{
				accessorKey: 'address',
				header: 'Address',
				size: 140,
				muiTableBodyCellEditTextFieldProps: ({cell}) => ({
					...getCommonEditTextFieldProps(cell)
				})
			},
			{
				accessorKey: 'phone',
				header: 'Phone',
				size: 80,
				muiTableBodyCellEditTextFieldProps: ({cell}) => ({
					...getCommonEditTextFieldProps(cell),
					type: 'number'
				})
			},
			{
				accessorKey: 'articles',
				header: 'Articles',
				enableEditing: false,
				Cell: (event) => (
					<Tooltip arrow placement="left" title="See the Articles of the company">
						<IconButton onClick={() => onProductClick(event)}>
							<Visibility />
						</IconButton>
					</Tooltip>
				)
			}
		],
		[getCommonEditTextFieldProps]
	);

	return (
		<>
			<div className="row justify-content-center">
				<div className="col-11">
					<MaterialReactTable
						columns={columns}
						data={companies}
						editingMode="modal"
						enableEditing={user?.groups?.includes('admins') ?? false}
						enableFilters={false}
						onEditingRowSave={handleUpdateRow}
						onEditingRowCancel={handleCancelRowEdits}
						positionActionsColumn="last"
						renderRowActions={({row, table}) => (
							<Box sx={{display: 'flex', gap: '2rem'}}>
								<Tooltip arrow placement="left" title="Edit">
									<IconButton onClick={() => table.setEditingRow(row)}>
										<Edit />
									</IconButton>
								</Tooltip>
								<Tooltip arrow placement="right" title="Delete">
									<IconButton onClick={() => handleDeleteRow(row)}>
										<Delete />
									</IconButton>
								</Tooltip>
							</Box>
						)}
					/>
				</div>
			</div>
			<div className="row">
				<div className="col-12 p-3 text-center">
					{renderElement(
						user,
						<Button
							style={{color: 'black', borderColor: 'black'}}
							onClick={() => setCreateModalOpen(true)}
							variant="outlined">
							Create New Company
						</Button>
					)}
				</div>
			</div>
			<CreateElement
				columns={columns}
				open={createModalOpen}
				onClose={() => setCreateModalOpen(false)}
				onSubmit={handleCreateNewRow}
			/>
		</>
	);
};

export default Companies;
