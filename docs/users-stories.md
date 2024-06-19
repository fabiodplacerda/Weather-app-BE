# User stories

## User Story 1: Register Account

As a user\
I want to be able register for an account\
So that I can access to more features in the website

### Test Plan

- Test addUser services:
  - test that makes the right method call
  - test throws an error when it fails
- Test addUser controller:
  - should add a new user
  - returns a 400 if body is null
  - returns a 500 if there was an error
- Integration tests:
  - responds with a 201 when request was successful
  - add the user to the database
  - responds with a 400 if email, name or password missing or not valid values
  - responds with a 500 if there is a error

## User Story 2: Login

As a user\
I want to be able to login into my account\
So that I can manage my account and my favourites

### Test Plan

- Test login services:
  - test that makes the right method call
  - test that returns the user if exists and if password match
  - test that returns null if email not found or password doesn't match
- Test login controller:
  - returns a user if email and password match with the database
  - returns a 404 if email or password don't match wit the database
  - returns a 400 if payload doesn't have password or email
  - responds with a 500 if there is a error
- Integration tests:
  - responds with a 200 when request was successful
  - responds with a user if password and email match with the database
  - responds with a 404 if email or password don't match the database
  - responds with a 400 if email or password are not in the payload
  - responds with a 500 if there is a error

## User Story 3: Change Password

As a user\
I want to be able to change my password\
So that I can update my account security

### Test Plan

- Test updatePassword services:
  - test that makes the right method call
  - test that updates the user if password matches the database
  - test that returns null if password doesn't match the database
  - test that return error if fails
- Test updatePassword controller:
  - should update the user and return it
  - returns a 401 if authentication fails(password doesn't match with the database)
  - returns a 400 if no id or password provided
- Integration tests:
  - responds with a 202 when request was successful
  - responds with a updated user if request was successful
  - updates the user in the database
  - responds with a 401 authentication fails(password doesn't match with the database)
  - responds with a 400 if password is not valid
  - responds with a 500 if there is a error

## User Story 4: Add Favourites

As a user\
I want to be able to a city to my favourites list\
So that I can quickly access weather forecast for cities that I'm interested in

### Test Plan

- Test updateFavouriteCities services:
  - test that makes the right method call
  - returns the updated user if successful
  - return error if cities fails to update
- Test updateFavouriteCities controller:
  - should update the user favourite cities and return the updated user
  - returns a 400 if no id or password newCity not provided in the payload
  - returns a 401 if authentication fails(password doesn't match with the database)
- Integration tests:

  - responds with a 202 when request was successful
  - responds with a updated user if request was successful
  - updates the user if favouriteCities array has no cities
  - updates the user in the database
  - responds with a 400 if new city is not valid
  - responds with a 401 authentication fails(password doesn't match with the database)
  - responds with a 500 if there is a error

- **Test 4.1:** search for a Contact by name and as a result should be able to see the contact and its details.
- **Test 4.2:** searching for an in-existing contact should have returned an Empty ArrayList. -->

## User Story 5: Remove Favourites

As a user\
I want to be able to remove a city from my favourites\
So that I can remove cities I'm no longer interested in keep my list up-to-date

### Test Plan

- Test removeFavouriteCity services:
  - test that makes the right method call
  - returns the updated user if successful
  - return error if city fails to be removed and updated
- Test removeFavouriteCity controller:
  - should update the user favourite cities and return the updated user
  - returns a 400 if no id or password newCity not provided in the payload
  - returns a 401 if authentication fails(password doesn't match with the database)
- Integration tests:
  - responds with a 202 when request was successful
  - responds with a updated user if request was successful
  - updating a user with no favouriteCities should have no effect or throw an error
  - updates the user in the database
  - responds with a 401 authentication fails(password doesn't match with the database)
  - responds with a 404 if id doesn't exist
  - responds with a 500 if there is a error
