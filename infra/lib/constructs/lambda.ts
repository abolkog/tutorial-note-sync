import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { BaseLambda } from './baseLambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

type LambdaLayerProps = {
  notesTable: Table;
  connectionsTable: Table;
};

export class LambdaLayer extends Construct {
  // CRUD LAMBDAs
  public createNoteFunction: NodejsFunction;
  public getAllNotesFunction: NodejsFunction;
  public getNoteFunction: NodejsFunction;
  public updateNoteFunction: NodejsFunction;
  public deleteNoteFunction: NodejsFunction;

  // WS LAMBDAs
  public registerFunction: NodejsFunction;
  public connectionFunction: NodejsFunction;
  public disConnectionFunction: NodejsFunction;

  constructor(scope: Construct, id: string, props: LambdaLayerProps) {
    super(scope, id);

    this.createCRUDLambdas(props);

    this.createWSLambdas(props);
  }

  private createCRUDLambdas(props: LambdaLayerProps) {
    const environment = {
      NOTES_TABLE_NAME: props.notesTable.tableName,
      CONNECTION_TABLE_NAME: props.connectionsTable.tableName,
    };

    this.createNoteFunction = new BaseLambda(this, 'CreateNoteFunction', {
      entry: 'createNote.ts',
      environment,
    });
    props.notesTable.grantWriteData(this.createNoteFunction);
    props.connectionsTable.grantWriteData(this.createNoteFunction);

    this.getAllNotesFunction = new BaseLambda(this, 'GetAllNotesFunction', {
      entry: 'getAllNotes.ts',
      environment,
    });
    props.notesTable.grantReadData(this.getAllNotesFunction);

    this.getNoteFunction = new BaseLambda(this, 'GetNoteFunction', {
      entry: 'getNote.ts',
      environment,
    });
    props.notesTable.grantReadData(this.getNoteFunction);

    this.updateNoteFunction = new BaseLambda(this, 'UpdateNoteFunction', {
      entry: 'updateNote.ts',
      environment,
    });
    props.notesTable.grantReadWriteData(this.updateNoteFunction);
    props.connectionsTable.grantWriteData(this.updateNoteFunction);

    this.deleteNoteFunction = new BaseLambda(this, 'DeleteNoteFunction', {
      entry: 'deleteNote.ts',
      environment,
    });
    props.notesTable.grantReadWriteData(this.deleteNoteFunction);
    props.connectionsTable.grantWriteData(this.deleteNoteFunction);
  }

  private createWSLambdas(props: LambdaLayerProps) {
    const environment = { CONNECTION_TABLE_NAME: props.connectionsTable.tableName };

    this.registerFunction = new BaseLambda(this, 'RegisterFunction', {
      entry: 'ws/register.ts',
      environment,
    });
    props.connectionsTable.grantReadWriteData(this.registerFunction);

    this.connectionFunction = new BaseLambda(this, 'ConnectFunction', {
      entry: 'ws/connect.ts',
      environment,
    });
    props.connectionsTable.grantReadWriteData(this.connectionFunction);

    this.disConnectionFunction = new BaseLambda(this, 'DisconnectFunction', {
      entry: 'ws/disconnect.ts',
      environment,
    });
    props.connectionsTable.grantReadWriteData(this.disConnectionFunction);
  }
}
