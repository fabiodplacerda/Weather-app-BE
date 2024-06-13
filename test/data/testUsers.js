const testUsers = {
  users: [
    {
      _id: "66637a57557ca62365e759fe",
      email: "user1@example.com",
      name: "User One",
      password: "Password1!",
      favouriteCities: [
        { city: "New York", country: "USA" },
        { city: "Paris", country: "France" },
      ],
    },
    {
      _id: "66637a57557ca62365e759ff",
      email: "user2@example.com",
      name: "User Two",
      password: "Password2!",
      favouriteCities: [
        { city: "London", country: "UK" },
        { city: "Tokyo", country: "Japan" },
      ],
    },
    {
      _id: "66637a57557ca62365e75a00",
      email: "user3@example.com",
      name: "User Three",
      password: "Password3!",
      favouriteCities: [
        { city: "Sydney", country: "Australia" },
        { city: "Berlin", country: "Germany" },
      ],
    },
  ],
  newUser: {
    email: "user4@example.com",
    name: "User 4",
    password: "newPassword1!",
    favouriteCities: [
      { city: "Berlin", country: "Germany" },
      { city: "Tokyo", country: "Japan" },
    ],
  },
};

export default testUsers;
