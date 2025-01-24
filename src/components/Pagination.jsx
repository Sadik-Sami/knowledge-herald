import React, { useState } from 'react';
import { Button } from 'antd';

const Pagination = ({ totalItems, itemsPerPage }) => {
	const [page, setPage] = useState(1);

	const totalPages = Math.ceil(totalItems / itemsPerPage);

	const getVisiblePages = () => {
		if (totalPages <= 5) {
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		}

		if (page <= 3) {
			return [1, 2, 3, '...', totalPages];
		}

		if (page >= totalPages - 2) {
			return [1, '...', totalPages - 2, totalPages - 1, totalPages];
		}

		return [1, '...', page - 1, page, page + 1, '...', totalPages];
	};

	return (
		<div className='flex justify-around gap-11 items-center'>
			<p>Page: {page}</p>
			{getVisiblePages().map((pageNum, i) => (
				<Button
					key={i}
					variant={pageNum === page ? 'default' : 'outline'}
					size='icon'
					onClick={() => pageNum !== '...' && setPage(pageNum)}
					disabled={pageNum === '...'}>
					{pageNum.toString()}
				</Button>
			))}
			<p>Total Pages: {totalPages}</p>
		</div>
	);
};

export default Pagination;
