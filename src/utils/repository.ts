import * as mongoose from 'mongoose';
import { DocumentQuery, Document } from 'mongoose';

export interface IRead<T extends Document, QueryHelpers = {}> {
    retrieve: (callback: (error: any, result: any) => void) => void;
    findById: (id: string, callback: (error: any, result: T) => void) => void;
    findOne(conditions?: any, callback?: (err: any, res: T | null) => void): DocumentQuery<T | null, T> & QueryHelpers;
    find(cond: Object, fields: Object, options: Object, callback?: (err: any, res: T[]) => void): mongoose.Query<T[]>;
  }
  
  export interface IWrite<T extends Document> {
    create: (item: T, callback: (error: any, result: any) => void) => void;
    update: (_id: mongoose.Types.ObjectId, item: T, callback: (error: any, result: any) => void) => void;
    delete: (_id: string, callback: (error: any, result: any) => void) => void;
  }
  
  export class RepositoryBase<T extends Document, QueryHelpers = {}> implements IRead<T>, IWrite<T> {
  
    private _model: mongoose.Model<mongoose.Document>;
  
    constructor(schemaModel: mongoose.Model<mongoose.Document>) {
      this._model = schemaModel;
    }
  
    create(item: T, callback: (error: any, result: T) => void) {
      this._model.create(item, callback);
    }
  
    retrieve(callback: (error: any, result: T) => void) {
      this._model.find({}, callback);
    }
  
    update(_id: mongoose.Types.ObjectId, item: T, callback: (error: any, result: any) => void) {
      this._model.update({ _id: _id }, item, callback);
    }
  
    delete(_id: string, callback: (error: any, result: any) => void) {
      this._model.remove({ _id: this.toObjectId(_id) }, (err) => callback(err, null));
    }
  
    findById(_id: string, callback: (error: any, result: T) => void) {
      this._model.findById(_id, callback);
    }

    findOne(conditions?: any, callback?: (err: any, res: T | null) => void): DocumentQuery<T | null, T> & QueryHelpers {
        return this._model.findOne(conditions, callback);
    }
  
    /* findOne(cond?: Object, callback?: (err: any, res: T) => void): DocumentQuery<T | null, T> & {} {
      return this._model.findOne(cond, callback);
    } */
  
    find(cond?: Object, fields?: Object, options?: Object, callback?: (err: any, res: T[]) => void): mongoose.Query<T[]> {
      return this._model.find(cond, options, callback);
    }
  
    private toObjectId(_id: string): mongoose.Types.ObjectId {
      return mongoose.Types.ObjectId.createFromHexString(_id);
    }
  }
  