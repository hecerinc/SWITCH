# SWITCH model documentation

- An obvious fact is that the outputs (whatever is in the `outputs` folder after running the model) depend on the `inputs` files (the files in that folder)
- A non-obvious but **crucial** fact is that what files are in the `inputs/` folder will depend on the modules that are going to be run in the model


## Purpose

## Time management


## Conventions

- **Sets**: Names of sets are in **CAPITAL LETTERS** (e.g. `HOURS`)
	- locations of power plants
	- hours of the study
	- time periods
	- tech available for installation
- **Parameters**: provide input data for the optimization. Use `snake_case` (e.g. `capacity_factor`)
- **Decision variables**: indicate choices made by Switch. Use `PascalCase` (e.g. `InstallGen`)


## Modules

A comprehensive list of available modules:


### Core Modules

Defined in `/__init.py__`

- `balancing.load_zones`
- `energy_sources.properties`
- `financials`
- `generators.core.build`
- `generators.core.dispatch`
- `reporting`
- `timescales`

### Full module list

- `balancing`
	- `planning_reserves`
	- `load_zones`
	- `unserved_load`
	- `demand_response`
		- `simple`
	- `operating_reserves`
		- `areas`
		- `spinning_reserves`
- `energy_sources`
	- `properties`
	- `fuel_costs`
		- `markets`
		- `simple`
- `financials`
- `generators`
	- `core`
		- `build`
		- `commit`
			- `discrete`
			- `fuel_use`
			- `operate`
		- `dispatch`
		- `gen_discrete_build`
		- `no_commit`
	- `extensions`
		- `hydro_simple`
		- `hydro_system`
		- `storage`
- `hawaii/*`
- `policies`
	- `carbon_policies`
	- `rps_simple`
- `reporting`
	- `basic_exports`
	- `dump`
	- `example_export`
- `timescales`
- `transmission`
	- `local_td`
	- `transport`
		- `build`
		- `dispatch`

## Inputs & Outputs defined per Module

---

### `balancing.planning_reserves`

This module defines planning reserves margins to support resource adequacy requirements. These requirements are sometimes called capacity reserve margins.

#### Sets
#### Properties
#### Inputs
#### Outputs
#### Files

---

### `balancing.load_zones`

Defines load zone parameters for the SWITCH-Pyomo model.

#### Sets

- `LOAD_ZONES`: set of load zones
- `zone_demand_mw[z,t]`: describes the power demand from the high voltage transmission grid each load zone `z` and timepoint `t`

#### Properties
#### Inputs
#### Outputs

- **`load_balance.txt`**: is a wide table of energy balance components for every zone and timepoint. Each component registered with `Zone_Power_Injections` and `Zone_Power_Withdrawals` will become a column.

#### Files

- **`load_zones.tab`**
	- `LOAD_ZONE`
	- `[zone_ccs_distance_km]`
	- `[zone_dbid]`
- **`loads.tab`**
	- `LOAD_ZONE`
	- `TIMEPOINT`
	- `zone_demand_mw`
- **`[zone_coincident_peak_demand]`**
	- `LOAD_ZONE`
	- `PERIOD`
	- `zone_expected_coincident_peak_demand`

---

### `generators.core.build`

Defines generation projects build-outs. Describes generation & storage projects.

#### Sets

- `GENERATION_PROJECTS`: the set of generation and storage projects that have been built or could potentially be built. A project is a combination of generation technology, load zone and location. A particular build-out of a project should also include the year in which construction was complete and additional capacity came online. Members of this set are abbreviated as `gen` in parameter names and `g` in indexes.
- `GEN_BLD_YEARS`: a 2D set of projects & the year in which expanison occured or can occur (when they came online). 

**Investment decisions are made for each project/invest period combination.**

#### Properties

- `gen_tech`: what kind of tech teh proejct uses
- `gen_load_zone`: where the project is built
- `[gen_capacity_limit_mw]`: defined for capacity-limited projects
- `gen_connect_cost_per_mw[g]`: is the cost of grid upgrades to support a new project, in dollars per peak MW. These costs include new transmission lines to a substation, substation upgrades and any other grid upgrades that are needed to deliver power from the interconnect point to the load center or from the load center to the broader transmission network.
- `gen_predetermined_cap[(g, build_year) in PREDETERMINED_GEN_BLD_YRS]`: is a parameter that describes how much capacity was built in the past for existing projects, or is planned to be built for future projects.

#### Input Files

- **`generation_projects_info.tab`**:
	- `GENERATION_PROJECT`
	- `gen_tech`
	- `gen_energy_source`
	- `gen_load_zone`
	- `gen_max_age`
	- `gen_is_variable`
	- `gen_is_baseload`
	- `gen_full_load_heat_rate`
	- `gen_variable_om`
	- `gen_connect_cost_per_mw `
	- `[gen_dbid]`
	- `[gen_scheduled_outage_rate]`
	- `[gen_forced_outage_rate]`
	- `[gen_capacity_limit_mw]`
	- `[gen_unit_size]`
	- `[gen_ccs_energy_load]`
	- `[gen_ccs_capture_efficiency]`
	- `[gen_min_build_capacity]`
	- `[gen_is_cogen]`
	- `[gen_is_distributed]`
- **`gen_build_costs.tab`**: cost parameters for both existing & new project buildouts
	- `GENERATION_PROJECT`
	- `build_year`
	- `gen_overnight_cost`
	- `gen_fixed_om`
- **`[gen_build_predetermined.tab]`**: Lists existing builds of projects, and is optional for simulations where there is no existing capacity
    - `GENERATION_PROJECT`
    - `build_year`
    - `gen_predetermined_cap`
- **`[gen_multiple_fuels.dat]`**



#### Decision Variables

- `BuildGen[g,build_year]`: is a decision variable that describes how much capacity of a project to install in a given period

#### Output Files

- **`gen_cap.txt`**: 
	- `GENERATION_PROJECT`
	- `PERIOD`
	- `GenCapacity`
	- `GenCapitalCosts`
	- `GenFixedOMCosts`


---

### `generators.core.dispatch`

Describes dispatch decisions & constraints of generation and storage projects.

**DEPENDS**: `operations.no_commit` **OR** `operations.unitcommit`

to constrain project dispatch to either commited or installed capacity.

#### Sets 

- `GEN_TPS`: a set of projects and timepoints in which they can be dispatched

#### Properties

- `gen_forced_outage_rate` && `gen_scheduled_outage_rate`: These parameters can be specified for individual projects via an input file, or generically for all projects of a given generation technology via `g_scheduled_outage_rate` and `g_forced_outage_rate`. **You will get an error if any project is missing values for either of these parameters.**
- `[gen_variable_om]`: is the variable Operations and Maintenance costs (O&M) per MWh of dispatched capacity for a given project 
- `[gen_full_load_heat_rate[g]]`: is the full load heat rate in units of MMBTU/MWh that describes the thermal efficiency of a project when running at full load. This optional parameter overrides the generic heat rate of a generation technology.

#### Decision Variables

-  `DispatchGen[(g, t) in GEN_TPS]` is the set of generation dispatch decisions: how much average power in MW to produce in each timepoint.
- `GenFuelUseRate[(g, t, f) in GEN_TP_FUELS]`: is a variable that describes fuel consumption rate in MMBTU/h. This should be constrained to the fuel consumed by a project in each timepoint and can be calculated as Dispatch [MW] * effective_heat_rate [MMBTU/MWh] -> [MMBTU/h]. The choice of how to constrain it depends on the treatment of unit commitment. Currently the project.no_commit module implements a simple treatment that ignores unit commitment and assumes a full load heat rate, while the project.unitcommit module implements unit commitment decisions with startup fuel requirements and a marginal heat rate.

#### Input Files

**Note:** `variable_capacity_factors` can be skipped if no variable renewable projects are considered in the optimization.

- **`[variable_capacity_factors.tab]`**
	- `GENERATION_PROJECT`
	- `timepoint`
	- `gen_max_capacity_factor`

#### Output files

- **`dispatch.txt`**:

---

### `generators.core.no_commit`

Defines simple limitations on project dispatch without considering unit commitment. This module is mutually exclusive with the `operations.unitcommit` module which constrains dispatch to unit commitment decisions.

Adds components to constrain dispatch decisions subject to available capacity, renewable resource availability, and baseload restrictions.


---

### `energy_sources.properties`

Defines model components to describe both fuels and non-fuel energy sources for the SWITCH-Pyomo model.

#### Sets

- `ENERGY_SOURCES`: is the set of primary energy sources used to generate electricity. Some of these are fuels like coal, uranium or biomass, and  some are renewable sources like wind, solar and water.
	- `NON_FUEL_ENERGY_SOURCES`: is a subset of `ENERGY_SOURCES` that lists primary energy sources that are not fuels. Things like sun, wind, water, or geothermal belong here.
	- `FUELS` is a subset of `ENERGY_SOURCES` that lists primary energy sources that store potential energy that can be released to do useful work. Many fuels are fossil-based, but the set of fuels also includes biomass, biogas and uranium.


#### Properties

- `f_co2_intensity[f]`: describes the carbon intensity of direct emissions incurred when a fuel is combusted in units of metric tonnes of Carbon Dioxide per Million British Thermal Units (tCO2/MMBTU).
- `[f_upstream_co2_intensity[f]]`:  is the carbon emissions attributable to a fuel before it is consumed in units of tCO2/MMBTU. Defaults to 0.

#### Input Files

- **`non_fuel_energy_sources.tab`**
	- `energy_source`
- **`fuels.tab`**
	- `fuel`
	- `co2_intensity`
	- `upstream_co2_intensity`


#### Output Files

`NA`


---

### `energy_sources.fuel_costs.markets`

Defines model components to describe fuel markets for the SWITCH-Pyomo model.

#### Sets

- `REGIONAL_FUEL_MARKETS`: set of all regional fuel markets.
- `ZONE_FUELS`:  is the set of fuels available in load zones. It is specified as set of 2-member tuples of (load_zone, fuel).
- `ZONE_RFMS`: is the set of all load-zone regional fuel market combinations. It is the input data from which `zone_rfm[z,f]` is derived.


#### Properties

- `rfm_fuel`: defines the fuel sold in a regional fuel market 
- `zone_rfm[z, f]` is the regional fuel market that supplies a a given load zone.
- `zone_fuel_cost_adder[z, f, p]` is an optional parameter that describes a localized flat cost adder for fuels. This could reflect local markup from a longer supply chain or more costly distribution infrastructure. The units are $ / MMBTU and the default value is `0`.


#### Files

- **`regional_fuel_markets.tab`**:
	- `regional_fuel_market`
	- `fuel`
- **`fuel_supply_curves.tab`**:
	- `regional_fuel_market`
	- `period`
	- `tier`
	- `unit_cost`
	- `max_avail_at_cost`
- **`zone_to_regional_fuel_market.tab`**:
	- `load_zone`
	- `regional_fuel_market`

- **`[zone_fuel_cost_diff.tab]`**: if this file is not included, `zone_fuel_cost_adder` will default to `0` for all load zones and periods.
	- `load_zone`
	- `fuel`
	- `period`
	- `fuel_cost_adder`
- **`[fuel_cost.tab]`**: This file allows simple specification of one cost per load zone per period.
	- `load_zone`
	- `fuel`
	- `period`
	- `fuel_cost`

---

### `reporting`

#### Output Files

- `total_cost.txt`


---

### `financials`

Defines financial parameters for the SWITCH-Pyomo model.

Describe financial conversion factors such as interest rates, discount rates, as well as constructing more useful coefficients from those terms.

**DEPENDS**: `timescales`

#### Sets



#### Properties

- `base_financial_year`: is used for net present value calculations
- `interest_rate`: is real interest rate paid on a loan from a bank
 - `[discount_rate]`: is the annual real discount rate used to convert future dollars into net present value for purposes of comparison.

 > In general, if you are converting value of money forward in time (from a present to a future value), use an interest rate. If you are converting value of money back in time, use a discount rate.

#### Input Files

- **`financials.dat`**: defines the set of scalars in Properties

#### Output Files

`NA`


---

### `policy.rps_simple`

This module defines a simple Renewable Portfolio Standard (RPS) policy scheme for the Switch-Pyomo model. In this scheme, each fuel is categorized as RPS-elegible or not. All non-fuel energy sources are assumed to be RPS-elegible. Dispatched electricity that is generated by RPS-elegible sources in each period is summed up and must meet an energy goal, set as a required percentage of all energy that is generated in that period.

**Note:** This module assumes that the `generators.core.no_commit` module is being used. An error will be raised if this module is loaded along the `generators.core.commit` package.

**Note:** It is not necessary to specify targets for all periods.

#### Sets

- `RPS_ENERGY_SOURCES`:  is a set enumerating all energy sources that contribute to RPS accounting. It is built by union of all fuels that are RPS elegible and the `NON_FUEL_ENERGY_SOURCES` set.
- `RPS_PERIODS`:  is a subset of PERIODS for which RPS goals are defined.

#### Properties

- `f_rps_eligible[f in FUELS]`: is a binary parameter that flags each fuel as elegible for RPS accounting or not.
- `rps_target[p in RPS_PERIODS]`:  is the fraction of total generated energy in a period that has to be provided by RPS-elegible sources.

#### Files

- **`rps_targets.tab`**: 
	- `PERIOD`
	- `rps_target`

Additionally, you can add an optional parameter `[f_rps_elegible]` `{0,1}` column to **`fuels.tab`** to define whether a fuel is RPS elegible or not.

#### Output

TODO: Add description for the outputs

- **`rps_energy.txt`**:
	- `PERIOD`
	- `RPSFuelEnergyGWh`
	- `RPSNonFuelEnergyGWh`
	- `TotalGenerationInPeriodGWh`
	- `RPSGenFraction`
	- `TotalSalesInPeriodGWh`
	- `RPSSalesFraction`

---

### `transmission.local_td`

Defines model components to describe local transmission & distribution build-outs for the SWITCH-Pyomo model. Define local transmission and distribution portions of an electric grid.

#### Sets

- `LOCAL_TD_BLD_YRS`: is the set of load zones with local transmission and distribution and years in which construction has or could occur. This set includes past and potential future builds
- `EXISTING_LOCAL_TD_BLD_YRS`:  is a subset of `LOCAL_TD_BLD_YRS` that lists builds that happened before the first investment period. For most datasets the build year is unknown, so it is always set to `Legacy`.

#### Properties

- `existing_local_td[z in LOAD_ZONES]`: is the amount of local transmission and distribution capacity in MW that has already been built.
- `distribution_loss_rate`: is the ratio of average losses for local T&D. This optional value defaults to `0.053`
- `local_td_annual_cost_per_mw[z in LOAD_ZONES]`: describes the total annual costs for each MW of local transmission & distribution.

#### Decision Variables

- `WithdrawFromCentralGrid[z, t]` is a decision variable that describes the power exchanges between the central grid and the distributed network, from the perspective of the central grid.
- `BuildLocalTD[(z, bld_yr) in LOCAL_TD_BLD_YRS]` is a decision variable describing how much local transmission and distribution to build in a load zone. For existing builds, this variable is locked to existing capacity.

#### Files

- **`load_zones.tab`**: these are additional columns to the ones previously defined by the `load_zones` module
	- `load_zone`
	- `existing_local_td`
	- `local_td_annual_cost_per_mw`

---

### `transmission.transport.build`

Defines transmission build-outs.

#### Sets

- `TRANSMISSION_LINES`:  is the complete set of transmission pathways connecting load zones. Each member of this set is a one dimensional identifier such as `A-B`. This set has no regard for directionality of transmisison lines and will generate an error if you specify two lines that move in opposite directions such as (A to B) and (B to A). Another derived set - `TRANS_LINES_DIRECTIONAL` - stores directional information.
- `BLD_YRS_FOR_TX`: is the set of transmission lines and years in which they have been or could be built. This set includes past and potential future builds. All future builds must come online in the first year of an investment period. This set is composed of two elements with members: `(tx, build_year)`. For existing transmission where the build years are not known, `build_year` is set to `Legacy`.
- `DIRECTIONAL_TX`: is a derived set of directional paths that electricity can flow along transmission lines. Each element of this set is a two-dimensional entry that describes the origin and destination of the flow: `(load_zone_from, load_zone_to)`. Every transmission line will generate two entries in this set. **TODO?viz**

#### Properties

- `[trans_dbid[tx in TRANSMISSION_LINES]]`:  is an external database identifier for each transmission line
- `trans_length_km[tx in TRANSMISSION_LINES]`: is the length of each transmission line in kilometers.
- `trans_efficiency[tx in TRANSMISSION_LINES]`: is the proportion of energy sent down a line that is delivered. If 2 percent of energy sent down a line is lost, this value would be set to `0.98`.
- `[trans_new_build_allowed[tx in TRANSMISSION_LINES]]`: is a binary value indicating whether new transmission build-outs are allowed along a transmission line. This optional parameter defaults to `True`.
-  `existing_trans_cap[tx in TRANSMISSION_LINES]`: is a parameter that describes how many MW of capacity has been installed before the start of the study
- `[trans_derating_factor[tx in TRANSMISSION_LINES]]`: is an overall derating factor for each transmission line that can reflect forced outage rates, stability or contingency limitations. This parameter is optional and defaults to `1`. This parameter should be in the range of `0` to `1`, being `0` a value that disables the line completely.
- `[trans_terrain_multiplier[tx in TRANSMISSION_LINES]]`: is a cost adjuster applied to each transmission line that reflects the additional costs that may be incurred for traversing that specific terrain. Crossing mountains or cities will be more expensive than crossing plains. This parameter is optional and defaults to `1`. This parameter should be in the range of `0.5` to `3`.
- `[trans_capital_cost_per_mw_km]`: describes the generic costs of building new transmission in units of $BASE_YEAR per MW transfer capacity per km. This is optional and defaults to `1000`.
- `[trans_lifetime_yrs]`: is the number of years in which a capital construction loan for a new transmission line is repaid. This optional parameter defaults to `20 years` based on 2009 WREZ transmission model transmission data. At the end of this time, we assume transmission lines will be rebuilt at the same cost.
- `[trans_fixed_o_m_fraction]`: describes the fixed Operations and Maintenance costs as a fraction of capital costs. This optional parameter defaults to `0.03` based on 2009 WREZ transmission model transmission data costs for existing transmission maintenance

#### Files

- **`transmission_lines.tab`**:
	- `TRANSMISSION_LINE`
	- `trans_lz1`
	- `trans_lz2`
	- `trans_length_km`
	- `trans_efficiency`
	- `existing_trans_cap`

- **`[trans_optional_params.tab]`**:
	- `TRANSMISSION_LINE`
	- `trans_dbid`
	- `trans_derating_factor`
	- `trans_terrain_multiplier`
	- `trans_new_build_allowed`

- **`[trans_params.dat]`**: (single values) The `distribution_loss_rate` parameter should only be inputted if the `local_td` module is loaded in the simulation.
	- `trans_capital_cost_per_mw_km`
	- `trans_lifetime_yrs`
	- `trans_fixed_o_m_fraction`
	- `distribution_loss_rate`




---

### `transmission.transport.dispatch`

Defines model components to describe transmission dispatch. This module only contains Decision variables. TODO: Output

#### Sets
#### Properties
#### Files

---

### `timescales`

Defines timescales for investment and dispatch for the SWITCH-Pyomo model.

#### Sets

- `PERIODS`:  is the set of multi-year periods describing the timescale of investment decisions.
	- `period_start[p]`: The first complete year of an investment period.
	- `period_end[p]`: The last complete year of an investment period.
- `TIMESERIES`: denote blocks of consecutive timepoints within a period. An individual time series could represent a single day, a week, a month or an entire year. This replaces the `DATE` construct in the old SWITCH code and is meant to be more versatile.
	- `ts_period[ts]`: The period a timeseries falls in.
	- `ts_num_tps[ts]`: The number of timepoints in a timeseries.
	- `ts_duration_of_tp[ts]`: The duration in hours of each timepoint within a timeseries.
	- `ts_scale_to_period[ts]`: The number of times this representative timeseries is expected to occur in a period. Used as a scaling factor to adjust the weight from `ts_duration_hrs` up to a period.
- `TIMEPOINTS`: describe unique timepoints within a time series and typically index exogenous variables such as electricity demand and variable renewable energy output. The duration of a timepoint is typically on the order of one or more hours, so costs associated with timepoints are specified in hourly units, and the weights of timepoints are specified in units of hours. TIMEPOINTS replaces the HOURS construct in some of the old versions of SWITCH.
- `TPS_IN_PERIOD[period]`: The set of timepoints in a period.


#### Properties

#### Files

- **`periods.tab`**:
	- `INVESTMENT_PERIOD`
	- `period_start`
	- `period_end`

- **`timeseries.tab`**:
	- `TIMESERIES`
	- `period`
	- `ts_duration_of_tp`
	- `ts_num_tps`
	- `ts_scale_to_period`

- **`timepoints.tab`**:
	- `timepoint_id`
	- `timestamp`
	- `timeseries`


---

## Projects (new generation)

### Properties

- `cap_factor`: Capacity factor (power production as a fraction of plant size) expected from each **INTERMITTENT** generation project during each hour
- `capital_cost_annual_payment`: The repayment required for the capital investment in each possible generation project, per kW of capacity, expressed as an annual cost during the life of the project
- `capital_cost_per_hour`: The capital repayment required for each possible generation project, per MW of capacity, expressed as an hourly cost during the life of the project
- `capital_cost_by_vintage`: The cost of building each available power plant technology, during each future year (per kW of nameplate capacity) (Indexed over `TECHNOLOGIES X VINTAGE_YEARS`)
- `capital_cost_proj`: The projected cost of building each possible generation project, per kW capacity.
- `carbon_content`: Greenhouse gas emissions per unit of fuel (tonnes CO <sub>2</sub> e per MMBtu)
- `connect_cost_per_kw`: The cost of grid upgrades required to integrate each potential generator project into the power system. This is set to zero if generic costs are given. (Indexed over `PROJECTS`)
- `connect_cost_per_kw_generic`: The cost of grid upgrades required to integrate a new power plant using technology `t` into the power system. This is set to zero if project-specific costs are given (Indexed over `TECHNOLOGIES`)
- `connect_length_km`: The distance from each potential generation project to the main electric grid. (Indexed over `PROJECTS`)
- `finance_rate`: Finance rate used to amortize capital costs over the life of generation projects.
- `fixed_cost_per_hour`: The fixed operation and maintenance costs of power projects built during each investment period, expressed as an hourly cost per MW of capacity, during all hours of the plant's life. (Indexed over `PROJECT_VINTAGES`)
- `fixed_o_m`: The fixed operation & maintenance cost for new power plants using technology `t` (2012$  per kW of capacity per year) (Indexed over `TECHNOLOGIES`)
- `fuel`: Type of fuel used by each type of power plant (Indexed over `TECHNOLOGIES`)
- `fuel_cost_hourly`: Forecast cost of each type of fuel during each hour of the study, in base - year dollars per MMBtu. (Indexed over `FUELS × HOURS`)
- `heat_rate`: Heat rate (1/efficiency) for new power plants based on each technology, in units of MMBtu per kWh. (Indexed over `TECHNOLOGIES`)
- `intermittent`: Set to `1` if a project provides an intermittent supply of power, `0` if the project is dispatchable. (Indexed over `PROJECTS`)
- `resource_limited`: Set to 1 if a technology can only be scaled to a finite size at each site; otherwise 0. (Indexed over `TECHNOLOGIES`)
- `max_capacity`: Maximum size of each new generation project (in MW). (Can be developed incrementally over time.) (Indexed over `PROJ_RESOURCE_LIMITED`)
- `max_age_years`: Number of years that a new generation project of this tech can operate before being retired. (Indexed over `TECHNOLOGIES`)
- `transmission_cost_per_mw_km`:  (single value) The cost to install additional transfer capability, per MW of capacity, per km spanned. 
- `variable_cost_per_mwh`: The variable cost per MWh of electricity produced by technology t during hour h. This includes fuel and variable O&M. (Indexed over `TECHNOLOGIES × HOURS`)
- `variable_o_m`: Variable operation and maintenance costs of power projects (e.g., wear and tear costs), per MWh of electricity generated (Indexed over `TECHNOLOGIES`)


## Existing (non-hydro) plants

### Outputs

The key decisions for existing plants are

- whether to operate them at all during each investment period (`OperateEPDuringYear`)
	- __`OperateEPDuringYear`__: Fraction of existing power plant capacity to keep online (instead of mothballing) during each investment period; can be fractional in the range of 0 - 1 but usually takes a value of 0 or 1. Can be raised or lowered each investment period.
- how much power to produce from them during each individual hour (`DispatchEP`)
	- __`DispatchEP`__: Number of MW of power to generate from each existing power plant during each hour

Existing generators contribute to Switch's load-serving and reserve margin constraints via `ExistingGenOutput`<sub>zh</sub> and `ExistingGenMaxOutput`<sub>zh<sub> :

- `ExistingGenOutput`: `sum(DispatchEP)` for all hours where a plant can be dispatched for all existing plants `EP_DISPATCH_HOURS`
- `ExistingGenMaxOutput`: `sum(OperatingEPDuringYear)`


### Sets


### Properties

- `carbon_content`:  Greenhouse gas emissions per unit of fuel (tonnes CO 2 e per MMBtu) `FUELS`
- `ep_baseload`:  Set to `1` if a generation project must run at a constant output level, `0` if it can be varied. `EXISTING_PLANTS`
- `ep_capital_cost_annual_payment`:  The capital repayment required for each existing power plant, per kW of capacity, expressed as an annual cost during the life of the project.  `EXISTING_PLANTS`
- `ep_capital_cost_per_hour`:  The carrying cost for existing plants, converted into an hourly cost during all hours until the plant retires.  `EXISTING_PLANTS`
- `ep_end_year`:  First year when the power plant will not be available due to retirement. Plants are assumed to be available until the end of the study period in which they reach their  retirement age `EXISTING_PLANTS`
- `ep_finance_rate`:  (single value) Finance rate used to amortize the capital costs of existing power plants
- `ep_fixed_cost_per_hour`:  Fixed O&M costs of existing plants if they are not mothballed; converted into an hourly cost. `EXISTING_PLANTS`
- `ep_fuel`:  Type of fuel used by each power plant  `EXISTING_PLANTS`
- `ep_heat_rate`:  Heat rate (1/efficiency) for each power plant (Btu of fuel input per kWh of electricity output)  `EXISTING_PLANTS`
- `ep_max_age_years`:  Number of years that a power plant can operate before being retired  `EXISTING_PLANTS`
- `ep_overnight_cost`:  Approximate cost of building existing plants; used to calculate the repayments required for the sunk cost of existing plants.  `EXISTING_PLANTS`
- `ep_size_mw`:  Maximum possible output from each existing plan  `EXISTING_PLANTS`
- `ep_variable_cost_per_mwh`: The variable cost per MWh produced by each plant. Includes fuel and variable O&M. `EP_DISPATCH_HOURS`
- `ep_variable_o_m`:  Variable operation and maintenance costs of power plants (e.g., wear and tear costs), per MWh of electricity generated. `EXISTING_PLANTS`
- `ep_vintage`:  Year when power plant was built  `EXISTING_PLANTS`
- `fuel_cost_hourly`: Forecast cost of each type of fuel during each hour of the study, in base - year dollars per MMBtu. `FUELS × HOURS`


## Transmission & Distribution

Transmission corridors are defined between each load zone defined for the study.

The model will choose:

- how much transfer capability to add along each corridor during each investment period
- how much power to send along each corridor each hour

.

- **`NewTransCapitalCostPerHour`**: cost of new transmission
- **`ExistingTransCapitalCostPerHour`**: cost of existing transmission

which include **only** the capital repayment needed for new or existing transmission lines.



### Inter-zonal Transmission 

- **`DispatchTransFrom(z1,z2)`**: how much power goes from load zone z1 into the z1–z2 transmission corridor
- `(transmission_efficiency z1,z2)(DispatchTransFrom(z1,z2))` shows how much power reaches load zone z2 from this corridor

#### Sets

| Name | Indexing variables | Description |
| ---- | ------------------ | ----------- |
| `TRANS_LINES` | (z1,z2) | Transmission corridors that already exist or could be built; these connect load zone z1 to load zone z2 (note: there are no duplicate members; if (a,b) is in this set, then (b,a) is not) |
| `TRANS_VINTAGE_HOURS` | (z1, z2, v, h) | Valid combinations of transmission corridor, vintage and operational hour (h) (for which dispatch decisions must be made) |

#### Decision Variables for inter-zonal transmission

| Name | Indexing set | Description |
| ---- | ------------ | ----------- |
| `InstallTrans` | `TRANS_LINES × VINTAGE_YEARS` | Number of MW of new capacity to install along each transmission corridor at the start of each investment period |
| `DispatchTransFrom` |  `TRANS_LINES × HOURS` | Number of MW of power to send from zone z1 to zone z2 during each hour |
| `DispatchTransTo` | `TRANS_LINES × HOURS` | Number of MW of power to send from zone z2 to zone z1 during each hour |
| `DispatchTransTo_Reserve` | `TRANS_LINES × HOURS` | Number of MW of power to send to zone z1 from zone z2 during each hour (in the reserve - margin scenario)  | 
| `DispatchTransFrom_Reserve` | `TRANS_LINES × HOURS` | Number of MW of power to send from zone z1 to zone z2 during each hour (in the reserve - margin scenario) | 


#### Parameters

| Name | Indexed over | Description |
| ---- | ------------ | ----------- |
| `existing_transmission_from` |  `TRANS_LINES` |  Limit for power flows from zone z1 to zone z2 along existing transmission lines |
| `existing_transmission_to` |  `TRANS_LINES` |  Limit for power flows to zone z1 from zone z2 along existing transmission lines. |
| `transmission_cost_per_existing_mw_per_hour` |  `TRANS_LINES × VINTAGE_YEARS` |  Identical to transmission_cost_per_mw_per_hour but applied only to existing transmission lines. |
| `transmission_cost_per_existing_mw_km` |  (single value) | Sunk capital cost for existing transmission lines. |
| `transmission_cost_per_mw_per_hour` |  `TRANS_LINES × VINTAGE_YEARS` | The cost per MW to install additional transfer capability between zones z1 and z2 in year v. This is amortized as an hourly payment over the life of the upgrade. |
| `transmission_cost_per_mw_km` |  (single value) | Cost to build a transmission line, per mw of capacity, per km of distance. |
| `transmission_cost_per_mw_per_year` |  `TRANS_LINES × VINTAGE_YEARS`|  The annual repayment required for capital investment in new transmission capacity, per MW of capacity, expressed as an annual cost during the life of upgrade |
| `transmission_efficiency` |  `TRANS_LINES` | Efficiency of delivering electricity along each transmission corridor. |
| `transmission_end_year` |  `VINTAGE_YEARS` | First year when transmission capacity built in year v will be unavailable due to retirement. (Transmission capacity is assumed to be available until the end of the study period in which it is retired.) |
| `transmission_finance_rate` |  (single value) | Finance rate used to amortize capital costs over the life of transmission projects. |
| `transmission_forced_outage_rate` |  (single value) | Forced outage rate for transmission lines. |
| `transmission_length_km` |  `TRANS_LINES` | Length of each transmission corridor. |
| `transmission_max_age_years` |  (single value) | Retirement age for transmission lines. |


---

### Intra-zonal Transmission


#### Sets

| Name | Indexing variables | Description |
| ---- | ------------------ | ----------- |
| `LOCAL_TD_HOURS` | _(z,v,h)_ | Hours (`h`) when it is possible to operate intra-zonal transmission and distribution capacity built during investment period (vintage) `v` in load zone `z` |

#### Decision Variables for intra-zonal transmission


| Name | Indexing set | Description |
| ---- | ------------ | ----------- |
| `InstallLocalTD` | 	`LOAD_ZONES x VINTAGE_YEARS` | Number of MW of new intra-zonal transmission and distribution capacity to install in each load zone at the start of each investment period |

#### Parameters

| Name | Indexed over | Description |
| ---- | ------------ | ----------- |
| `local_td_cost_per_mw_per_hour` | `VINTAGE_YEARS` | The cost of building or upgrading intra-zonal transmission and distribution capacity to serve peak zonal loads |
| `local_td_max_age_years` | (single value) |  Retirement age for new intrazonal transmission and distribution capacity |
| `local_td_annual_payment_per_mw` | (single value) | Annual carrying cost for intrazonal transmission and distribution capacity (e.g., annual payment on capital cost)  |
| `local_td_end_year` | `VINTAGE_YEARS` | First year when intrazonal transmission and distribution capacity built in year `v` will be unavailable due to retirement |

## HydroElectric

Hydroelectric plants are a special case for the model. See page 36 of the Supplemental Information. (SI.7)


