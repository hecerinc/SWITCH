import Header from './Header';
import Body from './InformationRouter';

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
			<Body />
		</div>
	);
}

export default Information;
