# PyRossGeo API



![image](../figs/banner.jpg)

**Note:** PyRossGeo is
still in active development, and future versions might change substantially.
See the [changelog](https://github.com/lukastk/PyRossGeo/blob/master/docs/changelogs.md)
for all changes between updates.

To go to the main PyRossGeo documentation page click [here](https://github.com/lukastk/PyRossGeo/blob/master/docs/Documentation.md)

## pyrossgeo.Simulation


### class pyrossgeo.Simulation.Simulation()
Simulates the geographic compartmental model.


#### age_groups()
The number of age-groups.


* **Type**

    int



#### model_dim()
The number of model classes.


* **Type**

    int



#### max_node_index()
The highest index of all nodes (not including cnodes). “Index” here is not to be confused
with (age, model_class, home, location).


* **Type**

    int



#### node_mappings()
Contains mappings between nodes (age, model_class, home, location)
to its index in the state vector X_state.


* **Type**

    dict



#### cnode_mappings()
Contains mappings between cnodes (age, model_class, home, from, to)
to its index in the state vector X_state.


* **Type**

    dict



#### storage()
Persistent storage used for events.


* **Type**

    dict



#### has_been_initialized()
If True, then Simulation.initialize has been called.


* **Type**

    bool



#### compute()
Computes the right-hand side of the dynamical system.

Sets the array dX_state to the derivative of the dynamical system
at the state X_state.


* **Parameters**

    
    * **X_state** (*np.ndarray*) – The state of the system.


    * **dX_state** (*np.ndarray*) – The array to input the derivative into.


    * **t** (*float*) – Time


    * **dt** (*float*) – The time-step used



#### get_contact_matrix()
Returns the contact matrix with the given key.


#### get_contact_matrix_keys()
Returns a list of the contact matrix keys.


#### initialize()
Initializes the simulation using the given configuration files.

Each argument will be accepted as either as raw data or a path
to a file containing the data. See the documentation for the
format each configuration file should take.


* **Parameters**

    
    * **model_dat** (*str** or **dict*) – Specifies the epidemic model


    * **commuter_networks_dat** (*str** or **np.ndarray*) – Specifies the commuter network


    * **node_parameters_dat** (*str** or **pandas.DataFrame*) – Specifies the parameters of the model at each node


    * **cnode_parameters_dat** (*str** or **pandas.DataFrame*) – Specifies the parameters of the model at each commuter node


    * **contact_matrices_dat** (*str** or **dict*) – Specifies the contact matrices


    * **node_cmatrices_dat** (*str** or **pandas.DataFrame*) – Specifies what contact matrix to use at each node


    * **cnode_cmatrices_dat** (*str** or **pandas.DataFrame*) – Specifies what contact matrix to use at each commuter node


    * **node_populations_dat** (*str** or **np.ndarray*) – Specifies the population at each node


    * **cnode_populations_dat** (*str** or **np.ndarray*) – Specifies the population at each commuter node (default None)



#### is_commuting_stopped()
Returns True if the commuter network has been disabled.


#### set_contact_matrix()
Change the contact matrix of the given key.


* **Parameters**

    
    * **cmat_key** – the key of the contact matrix


    * **cmat** – the array to set the contact matrix to.



#### simulate()
Simulates the system.

Simulates the system between times t_start and t_end, with the
initial condition X_state. dts an array of time-steps, where
dts[i] is the time-step used during step i of the simualtion.

If save_path is specified, then the result of the simulation
will be outputted directly to the hard-drive as a zarr array
at the given path.


* **Parameters**

    
    * **X_state** (*np.ndarray*) – Initial condition of the system.


    * **t_start** (*float*) – Start time


    * **t_end** (*float*) – End time


    * **dts** (*float**, or **list** or **array of floats*) – Time steps


    * **steps_per_save** (*int*) – Number of simulation steps per saving the state (default -1)


    * **save_path** (*str*) – The path of the folder to save the output to (default “”)


    * **only_save_nodes** (*bool*) – If True, commuter nodes will not be saved (default False)


    * **event_times** (*list** or **array of floats*) – The times at which the event_function should be called (default [])


    * **event_function** (*function*) – The function that will be called at each event time (default None)



* **Returns**

    A tuple ((node_mappings, cnode_mappings), ts, X_states).
    X_states is an np.ndarray of shape (ts.size, N) where N is the total
    degrees of freedom of the system. If only_save_nodes = True
    then N is just the degrees of freedom of the nodes, and excludes
    the commuting nodes. ts is the times corresponding to X_states.
    node_mappings is a dictionary with keys of form (a,o,i,j),
    corresponding to age-bracket, class, home and location respectively.
    node_mappings[a,o,i,j] is the column of X_states for the
    corresponding state value. Similarly, cnode_mappings is
    a dictionary with keys of the form (a,o,i,j,k), corresponding
    to age-bracket, class, home, origin, destination respectively.



* **Return type**

    tuple



#### stop_commuting()
Disables the commuter network if s is True, and enables it if False.

## pyrossgeo.utils


### pyrossgeo.utils.extract_cnode_data(sim_data)
Returns the results of the simulation for each commuter node.


* **Parameters**

    **sim_data** (*Tuple*) – Simulation data.



* **Returns**

    A dictionary of keys of the form (i, j, k), corresponding to
    home node, origin node and destination node respectively.
    cnode_data[i,j,k] is an np.ndarray of shape
    (ts.size, # of age groups, # of classes).



* **Return type**

    dict



### pyrossgeo.utils.extract_community_data(sim_data)
Returns the results of the simulation for each community.


* **Parameters**

    **sim_data** (*Tuple*) – Simulation data.



* **Returns**

    An array of shape (ts.size, # of age groups, # of classes,
    # of locations). It contains the results of the simulation summed
    over each community. So community_data[:,0,1,32] contains the
    history of all people of age-bracket 0, class 1 and who live at location 32.



* **Return type**

    np.ndarray



### pyrossgeo.utils.extract_location_data(sim_data)
Returns the results of the simulation for a given location.


* **Parameters**

    **sim_data** (*Tuple*) – Simulation data.



* **Returns**

    An array of shape (ts.size, # of age groups, # of classes,
    # of locations). It contains the results of the simulation at each
    location. So community_data[5,0,1,32] contains the state of
    people of age-bracket 0, class 1 who are at location 32, at step 5
    of the simulation.



* **Return type**

    np.ndarray



### pyrossgeo.utils.extract_network_data(sim_data)
Returns the results of the simulation for the whole network.


* **Parameters**

    **sim_data** (*Tuple*) – Simulation data.



* **Returns**

    An array of shape (ts.size, # of age groups, # of classes).
    It contains the result of the simulation of the network as a whole
    for each age group and class.



* **Return type**

    np.ndarray



### pyrossgeo.utils.extract_node_data(sim_data)
Returns the results of the simulation for each node.


* **Parameters**

    **sim_data** (*Tuple*) – Simulation data.



* **Returns**

    A dictionary of keys of the form (i, j), corresponding to
    home node, and location node respectively.
    node_data[i,j,k] is an np.ndarray of shape
    (ts.size, # of age groups, # of classes).



* **Return type**

    dict



### pyrossgeo.utils.extract_simulation_data(sim_data)
Returns a tuple containing various formatted data for a given simulation result.

It returns node_data, cnode_data, location_data, community_data, network_data.


### pyrossgeo.utils.extract_ts(sim_data)
Returns the results of the simulation times given simulation data.


* **Parameters**

    **sim_data** (*Tuple*) – Simulation data.



* **Returns**

    A 1D array containing each time-step.



* **Return type**

    np.ndarray



### pyrossgeo.utils.get_dt_schedule(times, end_time)
Generates a time-step schedule.

Example:

The following generates a time-step schedule where we use a time-step
of one minute between 7-10 and 17-19 o’clock, and 2 hours for all
other times.

> ts, dts = pyrossgeo.utils.get_dt_schedule([

>     (0,  2\*60),
>     (7\*60,  1),
>     (10\*60, 2\*60),
>     (17\*60, 1),
>     (19\*60, 2\*60)
>     ], end_time=24\*60)


* **Parameters**

    
    * **times** (*lost*) – list of tuples


    * **end_time** (*float*) – The final time of the schedule.



* **Returns**

    A tuple (ts, dts). dts are the time-steps and ts
    the times.



* **Return type**

    tuple



### pyrossgeo.utils.load_sim_data(load_path, use_zarr=False)
Loads


* **Parameters**

    
    * **load_path** (*str*) – Path of the simulation data folder.


    * **use_zarr** (*bool**, **optional*) – If True, the simulation data will be given as a zarr array,
    rather than as a numpy array. The former is useful if the
    data is very large.



* **Returns**

    A tuple (node_mappings, cnode_mappings, ts, X_states), containing
    all simulation data. X_states is either an np.ndarray or a zarr.core.Array.
    If use_zarr=True, the latter will be given.



* **Return type**

    tuple


## Indices and tables


* Index


* Module Index


* Search Page
