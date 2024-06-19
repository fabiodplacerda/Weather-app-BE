# Travel Info Backend Application

The backend application for the Travel Info frontend is designed to manage user registrations, store favorite cities, and facilitate quick access to weather forecasts through the frontend application. By entering their email and password, users can create an account.

MongoDB is a secure database that holds this data. Once users are registered they can log in and manage their list of favorite cities. The backend stores these cities in MongoDB, associating them with the respective user accounts. Each user’s data, including their email, password, and list of favorite cities, is stored as a document in MongoDB.

This allows for easy retrieval and updating of user information and their preferred cities. In summary, the backend application, integrated with the Travel Info frontend, leverages MongoDB for efficient and flexible data storage. It manages user registrations, login and favorite cities, while the frontend interacts directly with weather forecast services to provide users with real-time weather information for their favorite cities. This architecture ensures a smooth and secure user experience, combining the strengths of both frontend and backend components.

## Running locally:

To run the backend application locally, follow these steps

**Seed Command:** Populate the development database with test users.

```bash
npm run seed
```

**Test Command:** Populate the test database with users and run tests.

```bash
npm run test
```

**Start Server:** Connect the backend with the DF Travel App frontend.

```bash
npm run start
```

## The Software will:

- **Allow users to register for an account:** Users can create a personalized account by providing a unique email address, name, and password. This registration process ensures that each user has their own secure space within the application.

- **Allow users to login to their account:** Registered users can log in using their credentials (email and password).

- **Allow users to change their password:** Users have the ability to update their account password at any time. This feature enhances account security by allowing users to periodically change their passwords or update them if compromised.

- **Allow users to add a favourite city for quick access to the weather forecast:** Users can add cities of their choice to a favorites list. This feature allows for quick access to weather forecasts for these cities without the need to search repeatedly.

- **Allow users to remove a city from their favorites cities:** Users can manage their favorite cities by removing any city from their list at their discretion. This functionality ensures that the favorites list remains current and relevant to the user's preferences.

## How will the software benefit the end user?

- **User Registration:** Allows users to create a personalized account for their own unique experiences.
- **Secure Login:** Offers users a secure way to access their accounts and personal information.
- **Password Management:** Allows users to change their passwords, which increases account security.
- **Favorite Cities:** Users can save their favorite cities for easy access to weather forecasts.
- **Manage Favorites:** Users can delete cities from their favorites list, ensuring that it remains relevant and up to date.

## How will the software benefit you?

- **Improved Customer Satisfaction:** Providing personalized features such as preferred cities and rapid access to weather forecasts can improve the user experience, resulting in increased customer satisfaction.
- **Increased User Engagement:** By allowing users to modify their accounts and favorite locales, the software encourages frequent usage of the service.
