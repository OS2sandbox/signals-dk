
using Cdk.Bootstrap.Stacks;

var app = new App();
_ = new GithubDeployCredentialsStack(app, "GithubDeployCredentialsStack");

app.Synth();
