// lib/pipeline.ts
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as blueprints from '@aws-quickstart/eks-blueprints';
import * as eks from 'aws-cdk-lib/aws-eks';

export default class PipelineConstruct extends Construct {
  constructor(scope: Construct, id: string, props?: cdk.StackProps){
    super(scope, id)
    
    const account = props?.env?.account!;
    const region = props?.env?.region!;

    this.prevalidateSecrets(region);

    const blueprint = blueprints.EksBlueprint.builder()
    .version(eks.KubernetesVersion.V1_31)
    .account(account)
    .region(region);

    blueprints.CodePipelineStack.builder()
      .name("single-cluster-pipeline")
      .owner("mikemcd3912")
      .codeBuildPolicies(blueprints.DEFAULT_BUILD_POLICIES)
      .stage({id: "mgmt", stackBuilder: blueprint.clone()})
      .repository({
        repoUrl: 'single-eks-cluster-cdk-pipeline',
        credentialsSecretName: 'github-token',
        targetRevision: 'main'
    })
      .build(scope, id+'-stack', props);
  }


  async prevalidateSecrets(region: string) {
    try {
        await blueprints.utils.validateSecret('github-token', region);
    }
    catch(error) {
        throw new Error(`github-token secret must be setup in AWS Secrets Manager for the GitHub pipeline.`);
    }
}
}