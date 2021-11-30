const { User, Book } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('savedBooks');
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
  Mutation: {
    loginUser: async (parent, { email, password }) => {

      const user = await User.findOne({ email: email });

      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },
    addUser: async (parent, { username, email, password }) => {

      const user = await User.create({ username: username, email: email, password: password });

      const token = signToken(user);

      return { token, user };
    },
    saveBook: async (parent, { authors, description, title, bookId, image, link }, context) => {

      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        {
          $addToSet: {
            savedBooks: {
              authors: authors, description: description, title: title, bookId: bookId, image: image, link: link
            }
          }
        },
        { new: true, runValidators: true }
      );

      return updatedUser;
    },
    removeBook: async (parent, { bookId }, context) => {
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: { bookId: bookId } } },
        { new: true }
      );
      return updatedUser;
    },
  },
};

module.exports = resolvers;
