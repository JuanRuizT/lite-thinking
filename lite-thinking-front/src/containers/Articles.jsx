import React, {useCallback, useMemo, useState, useEffect} from 'react';
import MaterialReactTable from 'material-react-table';
import {Box, Button, IconButton, Tooltip} from '@mui/material';
import {useLocation, useNavigate} from 'react-router-dom';
import {Delete, Edit} from '@mui/icons-material';
import CreateElement from '../components/ui/CreateElement';
import {getArticlesByCompanyId, insertArticle, updateArticle, deleteArticle} from '../api/articles';
import {getCompany} from '../api/companies';
import {validateEmail, validateAge, validateRequired, renderElement} from '../utils/validators';
import {useAuthContext} from '../context/AuthContext';

const Articles = () => {
	const [createModalOpen, setCreateModalOpen] = useState(false);
	const [articles, setArticles] = useState([]);
	const [company, setCompany] = useState({});

	const [validationErrors, setValidationErrors] = useState({});
	const navigate = useNavigate();

	const location = useLocation();
	const companyId = location.state?.companyId ?? '';

	const {user} = useAuthContext();

	useEffect(() => {
		const fetchData = async () => {
			const companies = await getArticlesByCompanyId(companyId);
			setArticles(companies);

			const company = await getCompany(companyId);
			setCompany(company);
		};
		fetchData();
	}, []);

	const handleCreateNewRow = async (values) => {
		const newArticle = {...values, companyId};
		const article = await insertArticle(newArticle);
		articles.push(article);
		setArticles([...articles]);
	};

	const handleUpdateRow = async ({exitEditingMode, row, values}) => {
		if (!Object.keys(validationErrors).length) {
			const itemId = articles[row.index].id;

			const updatedItem = {
				...articles[row.index],
				code: values.code,
				name: values.name,
				amount: values.amount
			};

			await updateArticle(itemId, updatedItem);

			articles[row.index] = updatedItem;

			setArticles([...articles]);
			exitEditingMode(); // required to exit editing mode and close modal
		}
	};

	const handleDeleteRow = useCallback(
		async (row) => {
			if (!confirm(`Are you sure you want to delete the article ${row.getValue('name')}`)) {
				return;
			}
			const itemId = row.original.id;
			await deleteArticle(itemId);
			const companies = await getArticlesByCompanyId(companyId);
			setArticles(companies);
		},
		[articles]
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

	const columns = useMemo(
		() => [
			{
				accessorKey: 'code',
				header: 'Code',
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
				accessorKey: 'amount',
				header: 'Amount',
				size: 140,
				muiTableBodyCellEditTextFieldProps: ({cell}) => ({
					...getCommonEditTextFieldProps(cell)
				})
			}
		],
		[getCommonEditTextFieldProps]
	);

	return (
		<>
			<div className="row">
				<h5 className="col-12 p-3 text-center">INVENTORY {company?.name?.toUpperCase() ?? ''}</h5>
			</div>
			<div className="row justify-content-center">
				<div className="col-8">
					<MaterialReactTable
						columns={columns}
						data={articles}
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
							Create New Article
						</Button>
					)}
					<Button
						style={{color: 'black', marginLeft: '10px', borderColor: 'black'}}
						variant="outlined"
						onClick={() => navigate('/companies')}>
						Back
					</Button>
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

export default Articles;
