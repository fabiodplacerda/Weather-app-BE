const testUsers = {
  users: [
    {
      _id: "66637a57557ca62365e759fe",
      email: "user1@example.com",
      name: "User One",
      password: "Password1!",
      favouriteCities: [
        {
          city: "New York",
          country: "USA",
          latitude: 40.7128,
          longitude: -74.006,
        },
        {
          city: "Paris",
          country: "France",
          latitude: 48.8566,
          longitude: 2.3522,
        },
      ],
    },
    {
      _id: "66637a57557ca62365e759ff",
      email: "user2@example.com",
      name: "User Two",
      password: "Password2!",
      favouriteCities: [
        {
          city: "London",
          country: "UK",
          latitude: 51.5074,
          longitude: -0.1278,
        },
        {
          city: "Tokyo",
          country: "Japan",
          latitude: 35.6895,
          longitude: 139.6917,
        },
      ],
    },
    {
      _id: "66637a57557ca62365e75a00",
      email: "user3@example.com",
      name: "User Three",
      password: "Password3!",
      favouriteCities: [
        {
          city: "Sydney",
          country: "Australia",
          latitude: -33.8688,
          longitude: 151.2093,
        },
        {
          city: "Berlin",
          country: "Germany",
          latitude: 52.52,
          longitude: 13.405,
        },
      ],
    },
    {
      _id: "66637a57557ca62365e75a01",
      email: "user4@example.com",
      name: "User Four",
      password: "Password4!",
      favouriteCities: [],
    },
  ],
  newUser: {
    email: "user4@example.com",
    name: "User 4",
    password: "newPassword1!",
    favouriteCities: [
      {
        city: "Berlin",
        country: "Germany",
        latitude: 52.52,
        longitude: 13.405,
      },
      {
        city: "Tokyo",
        country: "Japan",
        latitude: 35.6895,
        longitude: 139.6917,
      },
    ],
  },
};

export default testUsers;
