const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    getSingleUser: async (parent, { user = null, params }) => {

      return User.findOne({
        $or: [{ _id: user ? user._id : params.id }, { username: params.username }],
      });
    }
  },
  Mutation: {
    login: async (parent, { body }) => {

      const user = await User.findOne({ $or: [{ username: body.username }, { email: body.email }] });

      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      const correctPw = await user.isCorrectPassword(body.password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },
    createUser: async (parent, { body }) => {

      const user = await User.create({ body });

      const token = signToken(user);

      return { token, user };
    },
    saveBook: async (parent, { user, body}) => {

      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $addToSet: { savedBooks: body } },
        { new: true, runValidators: true }
      );

      return updatedUser;
    },
    deleteBook: async (parent, { user, params }) => {
      const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $pull: { savedBooks: { bookId: params.bookId } } },
      { new: true }
    );
      return updatedUser;
    },
  },
};

module.exports = resolvers;
