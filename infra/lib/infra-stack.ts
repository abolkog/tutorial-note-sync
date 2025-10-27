import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { FrontEndLayer } from './constructs/frontend';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // FrontEnd Layer: S3 and CloudFront
    const frontendLayer = new FrontEndLayer(this, 'FrontEndLayer');

    new cdk.CfnOutput(this, 'CloudfrontURL', {
      value: frontendLayer.cloudfrontUrl,
    });
  }
}
