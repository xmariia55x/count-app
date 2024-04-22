# count-app
A node project that exposes a REST API with 3 endpoints:

/health GET endpoint to check if the API is up and running.

/count GET endpoint to retrieve the count key from a Redis DB.

/track POST endpoint to store data received from the request body to a local file and update a count key in a DB.

Assumptions made:

Count parameter is an integer, not a float data type.

The count key is incremented by the count number specified in the parameter. This means that if the current value of the count key in Redis is 4 and the parameter's value is 5, the value that will be saved in the DB is 9. 

We are supposing that the local file mentioned in the test is a JSON file.

When it comes to storing the JSON data into the local file, we have to take into account that if a key already exists, it will replace its value. Let's say our local JSON file already contains a 'count' key, its value will be replaced by the one received as a parameter.

Future work:

There is room for improvement in terms of typing data.

Reduce complexity of the createServer function.
