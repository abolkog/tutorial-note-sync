import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { BaseLambda } from './baseLambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

type LambdaLayerProps = {
  notesTable: Table;
};

export class LambdaLayer extends Construct {
  public readonly createNoteFunction: NodejsFunction;
  public readonly getAllNotesFunction: NodejsFunction;
  public readonly getNoteFunction: NodejsFunction;
  public readonly updateNoteFunction: NodejsFunction;
  public readonly deleteNoteFunction: NodejsFunction;

  constructor(scope: Construct, id: string, props: LambdaLayerProps) {
    super(scope, id);

    const environment = { NOTES_TABLE_NAME: props.notesTable.tableName };

    this.createNoteFunction = new BaseLambda(this, 'CreateNoteFunction', {
      entry: 'createNote.ts',
      environment,
    });
    props.notesTable.grantWriteData(this.createNoteFunction);

    this.getAllNotesFunction = new BaseLambda(this, 'GetAllNotesFunction', {
      entry: 'getAllNotes.ts',
      environment,
    });
    props.notesTable.grantReadData(this.getAllNotesFunction);

    this.getNoteFunction = new BaseLambda(this, 'GetNoteFunction', {
      entry: 'getNote.ts',
      environment,
    });
    props.notesTable.grantReadData(this.getAllNotesFunction);

    this.updateNoteFunction = new BaseLambda(this, 'UpdateNoteFunction', {
      entry: 'updateNote.ts',
      environment,
    });
    props.notesTable.grantReadWriteData(this.updateNoteFunction);

    this.deleteNoteFunction = new BaseLambda(this, 'DeleteNoteFunction', {
      entry: 'deleteNote.ts',
      environment,
    });
    props.notesTable.grantFullAccess(this.updateNoteFunction);
  }
}
