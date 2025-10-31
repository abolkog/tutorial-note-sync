import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import path from 'path';

export class BaseLambda extends NodejsFunction {
  constructor(scope: Construct, id: string, props: NodejsFunctionProps) {
    const entry = path.join(__dirname, '..', '..', '..', 'backend', 'src', 'functions', props.entry!);

    super(scope, id, {
      ...props,
      entry,
      handler: 'handler',
      runtime: Runtime.NODEJS_22_X,
      bundling: {
        minify: false,
        sourceMap: true,
        ...props.bundling,
      },
      environment: {
        NODE_OPTIONS: '--enable-source-maps',
        ...props.environment,
      },
    });
  }
}
