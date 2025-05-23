import * as cdk from 'aws-cdk-lib';
import PipelineConstruct from '../lib/infra_pipeline';


const app = new cdk.App();
const account = process.env.CDK_DEFAULT_ACCOUNT!;
const region = process.env.CDK_DEFAULT_REGION;
const env = { account, region }

new PipelineConstruct(app, 'pipeline', {env });