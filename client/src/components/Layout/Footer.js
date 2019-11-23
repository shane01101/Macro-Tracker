import React from 'react';

const Footer = () => {
	return (
		<footer className='bg-dark text-white p-3 text-center'>
			Copyright &copy; {new Date().getFullYear()} Macro Tracker
		</footer>
	);
};

export default Footer;
