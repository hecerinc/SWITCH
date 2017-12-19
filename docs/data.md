# Data Architecture


The project currently only accepts 3 files, from which it does all the visualizations it is capable of: 

```
project_info.tab
PowerPlants.csv
BuildTrans.tab
```

These files generate 3 corresponding collections in the MongoDB database:

```
loadZones
powerPlants
transmissionlines
```

## `project_info.tab`

This file directly maps to the `loadZones` collection in the MongoDB database. 

The schema for that collection looks like this:

```
{
	_id: uuid,
	name: "project_info" // name of the file
	data: [
		{
			key: String (these are all numeric values e.g. "48")
			value: [
				id: String (numeric again)
				name: String,
				"Capacity Limit": Int,
				"load_zone": String,
				"o_m": Float
			],
			"total_capacity_limit": String (Floating string values e.g. "1353.58")
		}
	]
}
```

There is a single record with the above structure for the whole of the project_info.tab file in the `examples` folder. 

It is assumed that the `data` key contains all of the individual rows.


## `PowerPlants.csv`

This file directly maps to the `powerPlants` collection in the MongoDB database.

The schema for that collection looks like this:

```
{
	_id: uuid,
	country: {
		type: String,
		name: String,
		balancingAreas: {
			[int]: {
				type: String,
				properties: {
					ID: String,
					name: String,
					shape: {
						Prodesen: [GeoJSON],
						Switch: [GeoJSON]
					},
					color: String (hex value),
					index: String (integer value),
					capacity: {
						total: String (numeric value),
						"break_down": [
							{
								key: String,
								value: String (numeric)
							}
						]
					}
				}
			}	
		},
		loadZones: {
			[int]: {
				type: "loadZone",
				properties: {
					ID: String, 
					name: String,
					capacity: {
						total: "Float",
						"break_down": [
							{
								key: String,
								value: "Float"
							}
						]
					},
					index: "Int"
				}
			}
		}

	},
	chartData: {
		name: "global",
		values: [
			{
				name: String,
				[String]: "Float"
				... (several of these, non-deterministic)
				[String]: "Float"
				
			}
		]	
	}
}
```

## `BuildTrans.tab`

This file directly maps to the `transmissionLines` collection in the MongoDB database.

The schema for that collection looks like this:

```
{
	_id: uuid,
	name: "BuildTrans",
	rows: [
		{
			"TRANS_BUILD_YEARS_1": String,
			"TRANS_BUILD_YEARS_2": String,
			"BuildTrans": "Float"
		}
	]
}
```

# Routes


These are the currently accessible routes in the application:

## Publicy accessible

- `/information`
	- `/evolution`
	- `/generation`
- `/inputs`
	- `/projectinfo`
	- `/capacity`
- `/outputs`

## Authentication

There are additional routes for authentication set up:

- `/signup`
- `/forgotpassword`

But have not been fully tested, and are hidden behinda switch in `components/Router/index.js`

