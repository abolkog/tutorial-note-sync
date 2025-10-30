import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import path from 'path';

const NODE_RUNTIME = Runtime.NODEJS_22_X;
const functionPath = path.join(__dirname, '..', '..', '..', 'backend', 'dist');
const CODE = Code.fromAsset(functionPath);

type LambdaLayerProps = {
  notesTable: Table;
};

export class LambdaLayer extends Construct {
  public readonly createNoteFunction: Function;
  public readonly getNotesFunction: Function;
  public readonly getNoteFunction: Function;
  public readonly updateNoteFunction: Function;
  public readonly deleteNoteFunction: Function;

  constructor(scope: Construct, id: string, props: LambdaLayerProps) {
    super(scope, id);

    const environment = { NOTES_TABLE_NAME: props.notesTable.tableName };

    this.createNoteFunction = new Function(this, 'CreateNoteFunction', {
      runtime: NODE_RUNTIME,
      code: CODE,
      handler: 'functions/createNote.handler',
      environment,
    });
    props.notesTable.grantWriteData(this.createNoteFunction);

    this.getNotesFunction = new Function(this, 'GetNotesFunction', {
      runtime: NODE_RUNTIME,
      code: CODE,
      handler: 'functions/getNotes.handler',
      environment,
    });
    props.notesTable.grantReadData(this.getNotesFunction);

    this.getNoteFunction = new Function(this, 'GetNoteFunction', {
      runtime: NODE_RUNTIME,
      code: CODE,
      handler: 'functions/getNote.handler',
      environment,
    });
    props.notesTable.grantReadData(this.getNotesFunction);

    this.updateNoteFunction = new Function(this, 'UpdateNoteFunction', {
      runtime: NODE_RUNTIME,
      code: CODE,
      handler: 'functions/updateNote.handler',
      environment,
    });
    props.notesTable.grantReadWriteData(this.updateNoteFunction);

    this.deleteNoteFunction = new Function(this, 'DeleteNoteFunction', {
      runtime: NODE_RUNTIME,
      code: CODE,
      handler: 'functions/deleteNote.handler',
      environment,
    });
    props.notesTable.grantFullAccess(this.updateNoteFunction);
  }
}
