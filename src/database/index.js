const { MongoClient } = require('mongodb');
const config = require('config');

const {
  addUpdatedAtToModel, addCreatedAtToModel, softDeleteRetrieveCondition, convertToObjectID,
} = require('./helper');
const logger = require('../utils/logger');

let mongodbConnect = null;

const createConnection = async () => {
  try {
    mongodbConnect = await MongoClient.connect(process.env.dbServer,
      { poolSize: config.get('poolSize') || 80, useNewUrlParser: true, useUnifiedTopology: true });
    return 1;
  } catch (e) {
    logger.error({ filename: __filename, methodName: createConnection.name, message: e.message });
    return 0;
  }
};

const closeConnection = async () => mongodbConnect && mongodbConnect.close();

const insertOne = async (databaseName, collectionName, doc) => {
  const docToSave = addCreatedAtToModel(doc);
  const response = await mongodbConnect.db(databaseName).collection(collectionName).insertOne(docToSave);
  return response.ops.length > 0 && response.ops[0];
};

const insertMany = async (databaseName, collectionName, docs) => {
  const docsToSave = docs.map(doc => addCreatedAtToModel(doc));
  const response = await mongodbConnect.db(databaseName).collection(collectionName).insertMany(docsToSave);
  return response.ops.length > 0 && response.ops;
};

const updateOne = async (databaseName, collectionName, query = {}, doc, options = {}, noNeedSet) => {
  const docToUpdate = noNeedSet ? doc : { $set: addUpdatedAtToModel(doc) };
  const docUpdated = await mongodbConnect.db(databaseName).collection(collectionName)
    .findOneAndUpdate(
      {
        ...(query && convertToObjectID(query)),
        ...softDeleteRetrieveCondition,
      },
      docToUpdate,
      {
        ...options,
        returnOriginal: false,
      },
    );
  return docUpdated.value;
};

const updateMany = async (databaseName, collectionName, query = {}, doc, options = {}) => {
  const docToUpdate = { $set: addUpdatedAtToModel(doc) };
  const updated = await mongodbConnect.db(databaseName).collection(collectionName)
    .updateMany(
      {
        ...query,
        ...softDeleteRetrieveCondition,
      },
      docToUpdate,
      {
        ...options,
        returnOriginal: false,
      },
    );
  return updated.result;
};

const findOne = (databaseName, collectionName, query = {}, deleted) => {
  return mongodbConnect.db(databaseName).collection(collectionName)
    .findOne({ ...!deleted && softDeleteRetrieveCondition, ...(query && convertToObjectID(query)) });
};

const find = async (databaseName, collectionName, query = {}, sort = {}, limit = 0, offset = 0, deleted) => {
  return mongodbConnect.db(databaseName).collection(collectionName)
    .find({
      ...!deleted && softDeleteRetrieveCondition,
      ...(query && convertToObjectID(query)),
    })
    .sort(sort)
    .limit(Number(limit))
    .skip(Number(offset))
    .toArray();
};

const count = async (databaseName, collectionName, query, withDeletedDocument) => {
  return mongodbConnect.db(databaseName).collection(collectionName)
    .countDocuments({
      ...query,
      ...(!withDeletedDocument && softDeleteRetrieveCondition),
    });
};

const softDeleteOne = async (databaseName, collectionName, query = {}) => {
  return updateOne(databaseName, collectionName, query, { deletedAt: Date.now() });
};

const softDeleteMany = async (databaseName, collectionName, query = {}) => updateMany(databaseName,
  collectionName, query, { deletedAt: Date.now() }, { multi: true });

const deleteOne = async (databaseName, collectionName, query) => {
  const deleted = await mongodbConnect.db(databaseName).collection(collectionName).remove(...(query && convertToObjectID(query)));
  return deleted.result.ok === 1 && deleted.result.n >= 1;
};

const deleteMany = async (databaseName, collectionName, query, options) => {
  const resultDelete = await mongodbConnect.db(databaseName).collection(collectionName).deleteMany(query, options);
  return resultDelete.result;
};

const monitorError = () => {
  try {
    mongodbConnect.on('error', async (error) => {
      logger.error({ filename: __filename, methodName: 'monitorError', message: `mongodbConnect error ${{ ...error }}` });
    });
    mongodbConnect.on('close', async (close) => {
      logger.error({ filename: __filename, methodName: 'monitorError', message: `mongodbConnect close ${{ ...close }}` });
    });
  } catch (error) {
    logger.error({ filename: __filename, methodName: 'monitorError', message: error.message });
  }
};

exports.createConnection = createConnection;
exports.closeConnection = closeConnection;

exports.insertOne = insertOne;
exports.insertMany = insertMany;

exports.updateOne = updateOne;
exports.updateMany = updateMany;

exports.findOne = findOne;
exports.find = find;
exports.count = count;

exports.softDeleteOne = softDeleteOne;
exports.softDeleteMany = softDeleteMany;
exports.deleteOne = deleteOne;
exports.deleteMany = deleteMany;

exports.monitorError = monitorError;
