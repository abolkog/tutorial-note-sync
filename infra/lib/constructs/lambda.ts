import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import path from 'path';

const NODE_RUNTIME = Runtime.NODEJS_22_X;
const functionPath = path.join(__dirname, '..', '..', '..', 'backend', 'dist');
const CODE = Code.fromAsset(functionPath);

export class LambdaLayer extends Construct {
  public readonly createNoteFunction: Function;
  public readonly getNotesFunction: Function;
  public readonly getNoteFunction: Function;
  public readonly updateNoteFunction: Function;
  public readonly deleteNoteFunction: Function;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.createNoteFunction = new Function(this, 'CreateNoteFunction', {
      runtime: NODE_RUNTIME,
      code: CODE,
      handler: 'functions/createNote.handler',
    });

    this.getNotesFunction = new Function(this, 'GetNotesFunction', {
      runtime: NODE_RUNTIME,
      code: CODE,
      handler: 'functions/getNotes.handler',
    });

    this.getNoteFunction = new Function(this, 'GetNoteFunction', {
      runtime: NODE_RUNTIME,
      code: CODE,
      handler: 'functions/getNote.handler',
    });

    this.updateNoteFunction = new Function(this, 'UpdateNoteFunction', {
      runtime: NODE_RUNTIME,
      code: CODE,
      handler: 'functions/updateNote.handler',
    });

    this.deleteNoteFunction = new Function(this, 'DeleteNoteFunction', {
      runtime: NODE_RUNTIME,
      code: CODE,
      handler: 'functions/deleteNote.handler',
    });
  }
}
