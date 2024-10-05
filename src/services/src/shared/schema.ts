import { Sequelize, DataTypes, Model } from "sequelize";

const dbRoot = '/Users/spankyed/Develop/Projects/CurateGPT/services/database/sqlite';

export const sequelize = new Sequelize({
  // other options
  dialect: 'sqlite',
  storage: `${dbRoot}/curate.db`,
  logging: false,  // This disables logging
  // pool: {
  //   max: 10, // Maximum number of connections in pool
  //   min: 0, // Minimum number of connections in pool
  //   acquire: 30000, // The maximum time, in milliseconds, that pool will try to get connection before throwing error
  //   idle: 10000, // The maximum time, in milliseconds, that a connection can be idle before being released
  // },
});

export class PapersTable extends Model {
  declare id: string;
  declare date: string;
  declare title: string;
  declare abstract: string;
  declare authors: string;
  declare status: number;
  declare relevancy: number;
  declare isStarred: boolean;
  declare keywords: string;
}

export class DatesTable extends Model {
  declare value: string;
  declare status: string;
  declare count: number;
}

export class ReferencePapersTable extends Model {
  declare id: string;
  // declare chroma_id: string;
}

export class ThreadsTable extends Model {
  declare id: string;
  declare description: string;
  declare duplicateNumber: string;
  declare paperId: string;
  declare messageId: string;
  declare viewMode: number;
}

export class MessagesTable extends Model {
  declare id: string;
  declare parentId: string;
  declare threadId: string;
  declare hidden: boolean;
  declare text: string;
  declare role: string;
  declare timestamp: string;
  declare status: number;
}

export class PdfDocumentTable extends Model {
  declare id: string;
  declare paperId: string;
  declare viewMode: string; // 'whole' or 'summary' 1 | 0
  declare content: string;
}

PdfDocumentTable.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true
  },
  paperId: DataTypes.STRING,
  viewMode: DataTypes.STRING, // 'whole' or 'summary' 1 | 0
  content: DataTypes.STRING,
}, {
  sequelize,
  modelName: 'PdfDocumentTable',
  tableName: 'PdfDocuments',
  timestamps: true,
});

MessagesTable.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true
  },
  parentId: DataTypes.INTEGER,
  hidden: DataTypes.BOOLEAN,
  threadId: DataTypes.STRING,
  text: DataTypes.STRING,
  role: DataTypes.STRING,
  status: DataTypes.INTEGER,
  // timestamp: DataTypes.STRING,
}, {
  sequelize,
  modelName: 'MessagesTable',
  tableName: 'Messages',
  paranoid: true, // This enables soft deletes
  timestamps: true, // Ensure timestamps are true for paranoid to work
  // deletedAt: 'deletedAt',
});

ThreadsTable.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true
  },
  description: DataTypes.STRING,
  duplicateNumber: DataTypes.INTEGER,
  paperId: DataTypes.STRING,
  messageId: DataTypes.STRING,
  viewMode: DataTypes.INTEGER,
}, {
  sequelize,
  modelName: 'ThreadsTable',
  tableName: 'Threads',
  timestamps: true,
});

ReferencePapersTable.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    unique: true
  },
  // chroma_id: DataTypes.STRING,
}, {
  sequelize,
  modelName: 'ReferencePapersTable',
  tableName: 'ReferencePapers',
  paranoid: true, // This enables soft deletes
  timestamps: true, // Ensure timestamps are true for paranoid to work
  deletedAt: 'deletedAt',
});

DatesTable.init({
  value: {
    type: DataTypes.STRING,
    primaryKey: true,
    unique: true
  },
  status: {
    type: DataTypes.STRING,
  },
  count: DataTypes.INTEGER,
}, { sequelize, modelName: 'DatesTable', tableName: 'Dates' });

PapersTable.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    unique: true
  },
  date: DataTypes.STRING,
  title: DataTypes.STRING,
  abstract: DataTypes.STRING,
  authors: DataTypes.STRING, // semi-colon separated list
  // metadata
  status: DataTypes.INTEGER,
  relevancy: DataTypes.INTEGER,
  isStarred: DataTypes.BOOLEAN,
  keywords: DataTypes.STRING, // semi-colon separated list
}, {
  sequelize,
  modelName: 'PapersTable',
  tableName: 'Papers',
  indexes: [{ unique: false, fields: ['date']}]
});

PapersTable.belongsTo(DatesTable, { foreignKey: 'date', targetKey: 'value' });
DatesTable.hasMany(PapersTable, { foreignKey: 'date', sourceKey: 'value' });

// export const PaperVideosTable = sequelize.define('PaperVideosTable', {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   paperId: DataTypes.STRING,
//   title: DataTypes.STRING,
//   description: DataTypes.STRING,
//   thumbnailPrompt: DataTypes.STRING,
//   scriptPrompt: DataTypes.STRING,
//   videoUrl: DataTypes.STRING,
//   thumbnailUrl: DataTypes.STRING
// });

// export const ConfigTable = sequelize.define('ConfigTable', {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   lastRun: DataTypes.STRING,
// });

// Assuming a one-to-one relationship between Papers and PaperVideos
// PapersTable.hasOne(PaperVideosTable, {
//   foreignKey: 'paperId'
// });
// PaperVideosTable.belongsTo(PapersTable, {
//   foreignKey: 'paperId'
// });
