# SWITCH GUI Docs


- `recharts` is being used for the charts


## PowerPlants.csv

The following load zones exist as a shape both in Prodesen and Switch, but no data exists for them in the `loadZones` collection under `powerPlants`

```
{6, 41, 45, 47, 49, 19, 20, 52, 26}
```

### Capacity Map

Local State:

```
{
	legend:
	layers:
	map:
	balancingArea: {
		name: "name",
		values: [arrayData],
		color: color
	}
}
```