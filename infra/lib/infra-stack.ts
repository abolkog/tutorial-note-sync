import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { FrontEndLayer } from './constructs/frontend';
import { LambdaLayer } from './constructs/lambda';
import { ApiGatewayLayer } from './constructs/apigateway';
import { DataLayer } from './constructs/datalayer';
import { WebSocketLayer } from './constructs/websocket';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // FrontEnd Layer: S3 and CloudFront
    const frontendLayer = new FrontEndLayer(this, 'FrontEndLayer');

    // DataLayer
    const dataLayer = new DataLayer(this, 'DataLayer');

    // Lambdas Construct
    const lambdaLayer = new LambdaLayer(this, 'LambdaLayer', {
      notesTable: dataLayer.notesTable,
      connectionsTable: dataLayer.connectionTable,
    });

    // WebSocket Api Layer
    const wsLayer = new WebSocketLayer(this, 'websocketApiLayer', {
      connectionFunction: lambdaLayer.connectionFunction,
      registerFunction: lambdaLayer.registerFunction,
      disConnectionFunction: lambdaLayer.disConnectionFunction,
    });

    // HTTP API Gateway Layer
    const apiLayer = new ApiGatewayLayer(this, 'ApiGatewayLayer', {
      createNoteFunction: lambdaLayer.createNoteFunction,
      getNotesFunction: lambdaLayer.getAllNotesFunction,
      getNoteFunction: lambdaLayer.getNoteFunction,
      updateNoteFunction: lambdaLayer.updateNoteFunction,
      deleteNoteFunction: lambdaLayer.deleteNoteFunction,
    });

    // Outputs
    new cdk.CfnOutput(this, 'CloudfrontURL', {
      value: frontendLayer.cloudfrontUrl,
    });

    new cdk.CfnOutput(this, 'ApiURL', {
      value: apiLayer.httpApiUrl,
    });

    new cdk.CfnOutput(this, 'wsURL', {
      value: wsLayer.webSocketURL,
    });

    new cdk.CfnOutput(this, 'wsCallBackURL', {
      value: wsLayer.callbackURL,
    });
  }
}
