import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class DataLayer extends Construct {
  public readonly notesTable: Table;
  public readonly connectionTable: Table;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.notesTable = new Table(this, 'NotesTable', {
      tableName: 'note_sync_db',
      partitionKey: { name: 'userId', type: AttributeType.STRING },
      sortKey: { name: 'noteId', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
    });

    this.connectionTable = new Table(this, 'ConnectionsTable', {
      tableName: 'note_sync_connection',
      partitionKey: { name: 'connectionId', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
    });
    this.connectionTable.addGlobalSecondaryIndex({
      indexName: 'byUser',
      partitionKey: { name: 'userId', type: AttributeType.STRING },
    });
  }
}
