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
		<div className='flex justify-around gap-4 items-center'>
			<Button onClick={() => page > 1 && setPage(page - 1)} disabled={page === 1}>
				Previous
			</Button>
			{getVisiblePages().map((pageNum, i) => (
				<Button
					key={i}
					type={pageNum === page ? 'primary' : 'default'}
					size='small'
					onClick={() => pageNum !== '...' && setPage(pageNum)}
					disabled={pageNum === '...'}>
					{pageNum}
				</Button>
			))}
			<Button onClick={() => page < totalPages && setPage(page + 1)} disabled={page === totalPages}>
				Next
			</Button>
		</div>
	);
};

export default Pagination;
