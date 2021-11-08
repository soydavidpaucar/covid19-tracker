import { FormControl, MenuItem, Select } from '@mui/material';
import './App.css';
import { useEffect, useState } from 'react';

const App = () => {
	/* Set initial variable values */
	const [countries, setCountries] = useState([]);
	
	/* Call api */
	useEffect(() => {
		const getCountriesData = async () => {
			await fetch(`https://disease.sh/v3/covid-19/countries`)
				.then((response) => response.json())
				.then((data) => {
					const countries = data.map((country) => {
						return {
							name: country.country,
							value: country.countryInfo.iso2
						};
					});
					
					setCountries(countries);
				});
		};
		
		getCountriesData();
		
	}, []);
	return (
		<div className="app">
			<div className="app__header">
				<h1>COVID-19 Tracker</h1>
				<FormControl className="app__dropdown">
					<Select variant="outlined" value="abc">
						{countries.map((country) => {
							return (
								<MenuItem value={country.value}>{country.name}</MenuItem>
							);
						})}
					</Select>
				</FormControl>
			</div>
		
		
		</div>
	);
};

export default App;
