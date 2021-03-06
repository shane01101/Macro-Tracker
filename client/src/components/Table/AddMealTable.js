import React from 'react';

const addMealTable = props => {
	const tableData = props.data.map((row, index) => {
		return (
			<tr key={index}>
				<td>
					<input type='checkbox' name={row} onChange={props.checkedOnChange} />
				</td>
				<td>{row}</td>
				<td>Qty: </td>
				<td>
					<button
						type='button'
						className='btn btn-danger'
						onClick={() => props.onClick(row)}
					>
						Delete
					</button>
				</td>
			</tr>
		);
	});

	return (
		<table className='table table-striped'>
			<thead className='thead' />
			<tbody>{tableData}</tbody>
		</table>
	);
};

export default addMealTable;
