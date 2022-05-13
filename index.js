const { ApolloServer, gql } = require("apollo-server");

const query = require("./SQL.js");

const typeDefs = gql`
  type UserDetails {
    name: String
    designation: String
    address: String
    profileImage: String
  }

  type Query {
    getUserDetails(id: ID!): [UserDetails]
  }

  type Mutation {
    addProfilePicture(id: ID!, profileImage: String!): [UserDetails]

    addUserDetails(
      name: String!
      designation: String!
      address: String!
      profileImage: String!
    ): [UserDetails]
  }
`;

const resolvers = {
  Query: {
    getUserDetails: async (root, args, context, info) => {
      const results = await query(
        "SELECT * FROM users WHERE id = " + args.id + ";"
      );
      return results;
    },
  },

  Mutation: {
    addProfilePicture: async (root, args, context, info) => {
      const results = await query(
        "UPDATE users SET profileImage = '" +
          args.profileImage +
          "' WHERE id = " +
          args.id +
          ";"
      );
      const results1 = await query(
        "SELECT * FROM users WHERE id = " + args.id + ";"
      );
      return results1;
    },

    addUserDetails: async (root, args, context, info) => {
      const results = await query(
        "INSERT INTO users (name,designation,address,profileImage) VALUES " +
          "('" +
          args.name +
          "', " +
          "'" +
          args.designation +
          "' ," +
          "'" +
          args.address +
          "', " +
          "'" +
          args.profileImage +
          "'" +
          " );"
      );
      const results1 = await query(
        "SELECT * FROM users WHERE id = LAST_INSERT_ID();"
      );
      return results1;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
