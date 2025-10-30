import { Duration } from 'aws-cdk-lib';
import { CorsHttpMethod, HttpApi, HttpMethod, HttpStage } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpJwtAuthorizer } from 'aws-cdk-lib/aws-apigatewayv2-authorizers';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { Function } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

type ApiGatewayLayerProps = {
  createNoteFunction: Function;
  getNotesFunction: Function;
  getNoteFunction: Function;
  deleteNoteFunction: Function;
  updateNoteFunction: Function;
};

const JWT_ISSUER = 'https://welcome-bonefish-2.clerk.accounts.dev';
const JWT_AUD = 'note-sync-api';

export class ApiGatewayLayer extends Construct {
  public readonly httpApiUrl: string;

  constructor(scope: Construct, id: string, props: ApiGatewayLayerProps) {
    super(scope, id);

    const clerkAuthorizer = new HttpJwtAuthorizer('ClerkJWTAuthorizer', JWT_ISSUER, {
      jwtAudience: [JWT_AUD],
    });

    const httpApi = new HttpApi(this, 'NoteSyncHttpApi', {
      corsPreflight: {
        allowHeaders: ['Authorization', 'Content-Type'],
        allowMethods: [CorsHttpMethod.GET, CorsHttpMethod.PUT, CorsHttpMethod.DELETE, CorsHttpMethod.POST],
        allowOrigins: ['*'],
        maxAge: Duration.days(1),
      },
      defaultAuthorizer: clerkAuthorizer,
    });

    const routes = [
      { path: '/notes', method: HttpMethod.GET, function: props.getNotesFunction, id: 'GetNotes' },
      { path: '/notes', method: HttpMethod.POST, function: props.createNoteFunction, id: 'CreateNote' },
      { path: '/notes/{noteId}', method: HttpMethod.GET, function: props.getNoteFunction, id: 'GetNote' },
      { path: '/notes/{noteId}', method: HttpMethod.DELETE, function: props.deleteNoteFunction, id: 'DeleteNote' },
      { path: '/notes/{noteId}', method: HttpMethod.PUT, function: props.updateNoteFunction, id: 'UpdateNote' },
    ];

    routes.forEach((route) => {
      httpApi.addRoutes({
        path: route.path,
        methods: [route.method],
        integration: new HttpLambdaIntegration(`${route.id}Integration`, route.function),
      });
    });

    const httpStage = new HttpStage(this, 'NoteSyncHttpStage', {
      httpApi,
      stageName: 'prod',
      autoDeploy: true,
    });

    this.httpApiUrl = httpStage.url;
  }
}
