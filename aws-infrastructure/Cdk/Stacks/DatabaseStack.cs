using Amazon.CDK.AWS.EC2;
using Amazon.CDK.AWS.RDS;
using Amazon.CDK.AWS.SecretsManager;

namespace Cdk.Stacks;

internal class DatabaseStackProps(IVpc vpc, SecurityGroup applicationSecurityGroup) : StackProps
{
    public IVpc Vpc { get; } = vpc;
    public SecurityGroup ApplicationSecurityGroup { get; } = applicationSecurityGroup;
}

public class DatabaseStack : Stack
{
    public ISecret DatabaseCredentials { get; }

    internal DatabaseStack(Construct scope, string id, DatabaseStackProps props) : base(scope, id, props)
    {
        var securityGroup = new SecurityGroup(this, "dbSecGrp", new SecurityGroupProps
        {
            AllowAllOutbound = true,
            Vpc = props.Vpc
        });
        securityGroup.AddIngressRule(props.ApplicationSecurityGroup, Port.Tcp(5432), "allow inbound traffic from anywhere to the db on port 5432");
        var database = new DatabaseCluster(this, "database", new DatabaseClusterProps
        {
            DefaultDatabaseName = "signalen",
            Engine = DatabaseClusterEngine.AuroraPostgres(new AuroraPostgresClusterEngineProps
            {
                Version = AuroraPostgresEngineVersion.VER_16_4
            }),
            Writer = ClusterInstance.ServerlessV2("writer", new ServerlessV2ClusterInstanceProps
            {
                EnablePerformanceInsights = true
            }),
            ServerlessV2MinCapacity = 0.5,
            ServerlessV2MaxCapacity = 2,
            StorageEncrypted = true,
            EnablePerformanceInsights = true,
            Vpc = props.Vpc,
            VpcSubnets = new SubnetSelection
            {
                SubnetType = SubnetType.PRIVATE_ISOLATED
            },
            SecurityGroups = [securityGroup],
            EnableDataApi = true,
            RemovalPolicy = RemovalPolicy.SNAPSHOT
        });

        DatabaseCredentials = database.Secret ?? throw new InvalidOperationException("Db secrets is null");
    }

}