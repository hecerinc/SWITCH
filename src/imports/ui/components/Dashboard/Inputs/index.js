import Header from './header';
import Body from './inputsRouter';

const Inputs = () => {
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

export default Inputs;
