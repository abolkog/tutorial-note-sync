import { Arn, Stack } from 'aws-cdk-lib';
import { WebSocketApi, WebSocketStage } from 'aws-cdk-lib/aws-apigatewayv2';
import { WebSocketLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

type WebSocketLayerProps = {
  connectionFunction: NodejsFunction;
  disConnectionFunction: NodejsFunction;
  registerFunction: NodejsFunction;
  createNoteFunction: NodejsFunction;
  updateNoteFunction: NodejsFunction;
  deleteNoteFunction: NodejsFunction;
};

export class WebSocketLayer extends Construct {
  public readonly webSocketURL: string;
  public readonly callbackURL: string;

  constructor(scope: Construct, id: string, props: WebSocketLayerProps) {
    super(scope, id);

    // WebSocket API
    const webSocketApi = new WebSocketApi(this, 'NoteSyncWSApi', {
      connectRouteOptions: {
        integration: new WebSocketLambdaIntegration('ConnectionIntegration', props.connectionFunction),
      },
      disconnectRouteOptions: {
        integration: new WebSocketLambdaIntegration('DisconnectionIntegration', props.disConnectionFunction),
      },
      routeSelectionExpression: '$request.body.action',
    });

    webSocketApi.addRoute('register', {
      integration: new WebSocketLambdaIntegration('RegisterIntegration', props.registerFunction),
    });

    // Websocket Stage
    const stage = new WebSocketStage(this, 'NoteSyncWsStage', {
      webSocketApi,
      stageName: 'prod',
      autoDeploy: true,
    });

    // Grant lambda permission to send messages via management api
    const managementConnectionARN = Arn.format(
      {
        service: 'execute-api',
        resource: `${webSocketApi.apiId}/${stage.stageName}/POST/@connections/*`,
      },
      Stack.of(this)
    );
    const managementPolicy = new PolicyStatement({
      actions: ['execute-api:ManageConnections'],
      resources: [managementConnectionARN],
    });
    [
      props.registerFunction,
      props.connectionFunction,
      props.disConnectionFunction,
      props.createNoteFunction,
      props.updateNoteFunction,
      props.deleteNoteFunction,
    ].forEach((f) => f.addToRolePolicy(managementPolicy));

    this.webSocketURL = stage.url; // wss://..../prod
    this.callbackURL = stage.callbackUrl;

    props.registerFunction.addEnvironment('WEBSOCKET_CALLBACK_URL', this.callbackURL);
    props.createNoteFunction.addEnvironment('WEBSOCKET_CALLBACK_URL', this.callbackURL);
    props.updateNoteFunction.addEnvironment('WEBSOCKET_CALLBACK_URL', this.callbackURL);
    props.deleteNoteFunction.addEnvironment('WEBSOCKET_CALLBACK_URL', this.callbackURL);
  }
}
