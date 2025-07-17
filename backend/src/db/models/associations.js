import { User } from './user.js';
import { Session } from './Session.js';
import { Message } from './Message.js';
import { Reaction } from './Reaction.js';


function initAssociations({ User, Session, Message, Reaction }) {
  // Session <-> User
  Session.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
  User.hasMany(Session, { foreignKey: 'userId' });

  // Message <-> User (author)
  Message.belongsTo(User, { foreignKey: 'userId', as: 'author' });
  User.hasMany(Message, { foreignKey: 'userId' });

  // Message replies
  Message.hasMany(Message, { foreignKey: 'parentId', as: 'replies' });
  Message.belongsTo(Message, { foreignKey: 'parentId', as: 'parent' });

  // Reaction <-> User/Message
  Reaction.belongsTo(User, { foreignKey: 'userId' });
  Reaction.belongsTo(Message, { foreignKey: 'messageId' });

  User.hasMany(Reaction, { foreignKey: 'userId' });
  Message.hasMany(Reaction, { foreignKey: 'messageId', as: 'reactions' });
}



initAssociations({ User, Session, Message, Reaction });