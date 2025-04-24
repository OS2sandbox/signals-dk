using Amazon.CDK.AWS.IAM;

namespace Cdk.Bootstrap.Stacks;

public class GithubDeployCredentialsStack : Stack
{
    internal GithubDeployCredentialsStack(Construct scope, string id, IStackProps? props = null) : base(scope, id, props)
    {
        var gitHubIdentityProvider = new OpenIdConnectProvider(this, "GithubOpenIdConnectProvider", new OpenIdConnectProviderProps
        {
            Url = "https://token.actions.githubusercontent.com",
            ClientIds = ["sts.amazonaws.com"],
        });

        var deployRole = new Role(this, "GithubCiRole", new RoleProps
        {
            RoleName = "github-ci",
            AssumedBy = new WebIdentityPrincipal(gitHubIdentityProvider.OpenIdConnectProviderArn,
                new Dictionary<string, object>
                {
                    {
                        "StringLike", new Dictionary<string, string[]>
                        {
                            {
                                "token.actions.githubusercontent.com:sub",
                                [
                                    $"repo:{System.Environment.GetEnvironmentVariable("GITHUB_REPOSITORY")}:ref:*",
                                    $"repo:{System.Environment.GetEnvironmentVariable("GITHUB_REPOSITORY")}:environment:dev"
                                ]
                            },
                            { "token.actions.githubusercontent.com:aud", ["sts.amazonaws.com"] }
                        }
                    }
                })
        });
        deployRole.AddManagedPolicy(ManagedPolicy.FromAwsManagedPolicyName("AdministratorAccess"));
    }
}
