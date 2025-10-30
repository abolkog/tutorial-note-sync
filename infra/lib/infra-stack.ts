import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { FrontEndLayer } from './constructs/frontend';
import { LambdaLayer } from './constructs/lambda';
import { ApiGatewayLayer } from './constructs/apigateway';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // FrontEnd Layer: S3 and CloudFront
    const frontendLayer = new FrontEndLayer(this, 'FrontEndLayer');

    // Lambdas Construct
    const lambdaLayer = new LambdaLayer(this, 'LambdaLayer');

    // HTTP API Gateway Layer
    const apiLayer = new ApiGatewayLayer(this, 'ApiGatewayLayer', {
      createNoteFunction: lambdaLayer.createNoteFunction,
      getNotesFunction: lambdaLayer.getNotesFunction,
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
  }
}
