import Header from './Header';
import InformationRouter from './InformationRouter';

const Information = () => {
	return(
		<div
			style={{
				width: '100%',
				height: '100%',
				marginLeft: '15px',
				marginRight: '15px',
				paddingBottom: '25px'
			}}
		>
			<Header />
			<InformationRouter />
		</div>
	);
}

export default Information;
