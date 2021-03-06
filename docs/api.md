# Documentation
Below you can find information about goals of this project and description of available endpoints

To view this documentation in web format do the following:
1. ensure node (>8.6 and <= 10) and npm are installed
2. run npm install
3. run npm start
4. open http://localhost:8010/docs in browser

## Purpose
The purpose of this project is to provide a service for managing information about passenger transportation by car from one place to another

## API Endpoints

### GET /health
This endpoint checks availability of the service

#### Response
```
headers:
  content-type: text/html
    
body: "Healthy"
```

### POST /rides
This endpoint saves information about new ride

#### Request
```
headers:
  content-type: application/json

body: {
  start_lat: Number             – start lattitude
  start_long: Number            – start longitude
  end_lat: Number               – end lattitude
  end_long: Number              – end longitude
  rider_name: String            – rider name
  driver_name: String           – driver name
  driver_vehicle: String        – driver vehicle name
}
```

#### Response
```
headers:
  content-type: application/json

body: {
  rideID: Number                – id
  startLat: Number              – start lattitude
  startLong: Number             – start longitude
  endLat: Number                – end lattitude
  endLong: Number               – end longitude
  riderName: String             – rider name
  driverName: String            – driver name
  driverVehicle: String         – driver vehicle name
  created: String               – creation timestamp ("YYYY-MM-DD HH:MM:SS" format)
}
```

### GET /rides
This endpoint returns information about all rides  
Data can be retrieved in chunks for pagination

#### Request
```
query:
  page: Number                  – pagination page
  limit: Number                 – number of rides per page
```

#### Response
```
headers:
  content-type: application/json

body: {
  count: Number                 – total number of rides
  rows: [                       – matched rides
    {
      rideID: Number            – id
      startLat: Number          – start lattitude
      startLong: Number         – start longitude
      endLat: Number            – end lattitude
      endLong: Number           – end longitude
      riderName: String         – rider name
      driverName: String        – driver name
      driverVehicle: String     – driver vehicle name
      created: String           – creation timestamp ("YYYY-MM-DD HH:MM:SS" format)
    }
    ...
  ]
}
```

### GET /rides/:id
This endpoint returns information about a particular ride

#### Request
```
params:
  id: String                    – ride id
```

#### Response
```
headers:
  content-type: application/json

body: {
  rideID: Number                – id
  startLat: Number              – start lattitude
  startLong: Number             – start longitude
  endLat: Number                – end lattitude
  endLong: Number               – end longitude
  riderName: String             – rider name
  driverName: String            – driver name
  driverVehicle: String         – driver vehicle name
  created: String               – creation timestamp ("YYYY-MM-DD HH:MM:SS" format)
}
```
