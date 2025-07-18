import { Message } from '../db/models/Message.js';
import { User } from '../db/models/User.js';
import { Reaction } from '../db/models/Reaction.js';

export const createMessage = async ({
  text,
  homepage,
  fileUrl,
  fileType,
  parentId,
  userId,
  name,
  email,
}) => {
  return await Message.create({
    text,
    homepage,
    fileUrl,
    fileType,
    parentId,
    userId,
    name,
    email,
  });
};


// export const getAllMessages = async () => {
//   return await Message.findAll({
//     where: { parentId: null },
//     include: [
//       {
//         model: Message,
//         as: 'replies',
//         include: [
//           { model: User, as: 'author', attributes: ['name', 'avatarUrl'] },
//           { model: Reaction, as: 'reactions' },
//         ],
//       },
//       { model: User, as: 'author', attributes: ['name', 'avatarUrl'] },
//       { model: Reaction, as: 'reactions' },
//     ],
//     order: [['createdAt', 'DESC']],
//   });
// };

export const getAllMessages = async () => {
  return await Message.findAll({
    include: [
      { model: User, as: 'author', attributes: ['name', 'avatarUrl'] },
      { model: Reaction, as: 'reactions' },
    ],
    order: [['createdAt', 'DESC']],
  });
};