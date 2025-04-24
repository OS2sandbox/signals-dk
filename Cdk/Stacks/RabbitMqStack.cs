using System.Linq;
using Amazon.CDK.AWS.EC2;
using Amazon.CDK.AWS.AmazonMQ;
using Amazon.CDK.AWS.SecretsManager;

namespace Cdk.Stacks;

public sealed class RabbitMqStack : Stack
{
    public CfnBroker RabbitMq { get; }
    public Secret RabbitCredentials { get; }
    public string RabbitMqHostName { get; }

    public RabbitMqStack(Construct scope, string id, RabbitMqStackProps props) : base(scope, id, props)
    {
        RabbitCredentials = new Secret(this, "RabbitCredentials", new SecretProps
        {
            GenerateSecretString = new SecretStringGenerator
            {
                PasswordLength = 20,
                SecretStringTemplate = "{\"username\": \"signalen\"}",
                GenerateStringKey = "password",
                ExcludePunctuation = true,
                ExcludeCharacters = "[, :=]"
            },
            Description = "Contains RabbitMQ credentials",
            RemovalPolicy = RemovalPolicy.DESTROY
        });

        RabbitMq = new CfnBroker(this, "RabbitMQ", new CfnBrokerProps
        {
            BrokerName = "SignalenRabbitMQ",
            EngineType = "RABBITMQ",
            DeploymentMode = "SINGLE_INSTANCE",
            HostInstanceType = "mq.t3.micro",
            PubliclyAccessible = false,
            Users = new object[]{
                new CfnBroker.UserProperty
                {
                    Username =  RabbitCredentials.SecretValueFromJson("username").UnsafeUnwrap(),
                    Password = RabbitCredentials.SecretValueFromJson("password").UnsafeUnwrap()
                }
            },
            EngineVersion = "3.13",
            SecurityGroups = [props.SecurityGroup.SecurityGroupId],
            SubnetIds = props.Vpc.SelectSubnets(new SubnetSelection { SubnetType = SubnetType.PRIVATE_ISOLATED }).SubnetIds.Take(1).ToArray()
        });
        RabbitMq.ApplyRemovalPolicy(RemovalPolicy.DESTROY);
        RabbitMqHostName = $"{RabbitMq.Ref}.mq.{Aws.REGION}.amazonaws.com";
       
        ExportValue(RabbitMq.Ref);
        ExportValue(RabbitCredentials.SecretArn);
    }

}

public class RabbitMqStackProps(IVpc vpc, ISecurityGroup securityGroup) : StackProps
{
    public IVpc Vpc { get; } = vpc;
    public ISecurityGroup SecurityGroup { get; } = securityGroup;
}