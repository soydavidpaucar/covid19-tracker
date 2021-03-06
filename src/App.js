import { Card, CardContent, FormControl, MenuItem, Select } from '@mui/material';
import './App.css';
import { useEffect, useState } from 'react';
import InfoBox from './InfoBox.js';
import Map from './Map.js';
import Table from './Table.js';

const App = () => {
	/* Set initial variable values */
	const [countries, setCountries] = useState([]);
	const [country, setCountry] = useState(('worldwide'));
	const [countryInfo, setCountryInfo] = useState({});
	const [tableData, setTableData] = useState([]);
	
	useEffect(() => {
		fetch(`https://disease.sh/v3/covid-19/all`).then(response => response.json()).then(data => {
			setCountryInfo(data);
		});
	}, []);
	
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
					
					setTableData(data);
					setCountries(countries);
				});
		};
		
		getCountriesData();
		
	}, []);
	
	/* Get all country info */
	const onCountryChange = async (event) => {
		const countryCode = event.target.value;
		
		setCountry(countryCode);
		
		const url = countryCode === 'worldwide' ? `https://disease.sh/v3/covid-19/all` : `https://disease.sh/v3/covid-19/countries/${countryCode}?strict=true`;
		
		await fetch(url).then(response => response.json()).then(data => {
			setCountry(countryCode);
			/* All data from country */
			setCountryInfo(data);
		});
	};
	return (
		<div className="app">
			<div className="app__left">
				<div className="app__header">
					<h1>COVID-19 Tracker</h1>
					<FormControl className="app__dropdown">
						<Select variant="outlined" value={country} onChange={onCountryChange}>
							<MenuItem value="worldwide">Worldwide</MenuItem>
							{countries.map((country) => {
								return (
									<MenuItem key={country.name} value={country.value}>{country.name}</MenuItem>
								);
							})}
						</Select>
					</FormControl>
				</div>
				
				<div className="app__stats">
					<InfoBox title="Cases" cases={countryInfo.todayCases} total={countryInfo.cases} />
					<InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered} />
					<InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
				</div>
				
				<Map />
			</div>
			
			<Card className="app__right">
				<CardContent>
					<h3>Live Cases by Country</h3>
					<Table countries={tableData}/>
					<h3>Worldwide New Cases</h3>
				</CardContent>
			</Card>
		
		</div>
	);
};

export default App;
