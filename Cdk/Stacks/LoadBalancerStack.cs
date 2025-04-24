using Amazon.CDK.AWS.CertificateManager;
using Amazon.CDK.AWS.EC2;
using Amazon.CDK.AWS.ElasticLoadBalancingV2;
using Amazon.CDK.AWS.Route53;
using Amazon.CDK.AWS.Route53.Targets;

namespace Cdk.Stacks;

public class LoadBalancerStack : Stack
{
    public ApplicationLoadBalancer LoadBalancer { get; }
    public ApplicationListener Listener { get; }

    internal LoadBalancerStack(Construct scope, string id, LoadBalancerStackProps props) : base(scope, id, props)
    {
        LoadBalancer = new ApplicationLoadBalancer(this, "ApplicationLoadBalancer", new ApplicationLoadBalancerProps
        {
            Vpc = props.Vpc,
            Http2Enabled = true,
            DesyncMitigationMode = DesyncMitigationMode.STRICTEST,
            IpAddressType = IpAddressType.DUAL_STACK,
            InternetFacing = true,
            SecurityGroup = props.SecurityGroup
        });
        var certificate = new Certificate(this, "Certificate", new DnsValidatedCertificateProps
        {
            DomainName = props.HostedZone.ZoneName,
            HostedZone = props.HostedZone,
            Validation = CertificateValidation.FromDns(props.HostedZone),
            KeyAlgorithm = KeyAlgorithm.RSA_2048,
            SubjectAlternativeNames = [
                $"api.{props.HostedZone.ZoneName}"
            ]
        });
        Listener = LoadBalancer.AddListener("frontend", new BaseApplicationListenerProps
        {
            Protocol = ApplicationProtocol.HTTPS,
            SslPolicy = SslPolicy.FIPS_TLS13_12,
            Certificates = [ListenerCertificate.FromCertificateManager(certificate)],
            DefaultAction = ListenerAction.FixedResponse(404, new FixedResponseOptions
            {
                ContentType = "text/plain",
                MessageBody = "Not found"
            })
        });
        _ = new ARecord(this, "RootA", new ARecordProps
        {
            Target = RecordTarget.FromAlias(new LoadBalancerTarget(LoadBalancer)),
            Zone = props.HostedZone,
            RecordName = props.HostedZone.ZoneName
        });
        _ = new AaaaRecord(this, "RootAaaa", new AaaaRecordProps
        {
            Target = RecordTarget.FromAlias(new LoadBalancerTarget(LoadBalancer)),
            Zone = props.HostedZone,
            RecordName = props.HostedZone.ZoneName
        });
        _ = new ARecord(this, "ApiA", new ARecordProps
        {
            Target = RecordTarget.FromAlias(new LoadBalancerTarget(LoadBalancer)),
            Zone = props.HostedZone,
            RecordName = $"api.{props.HostedZone.ZoneName}"
        });
        _ = new AaaaRecord(this, "ApiAaaa", new AaaaRecordProps
        {
            Target = RecordTarget.FromAlias(new LoadBalancerTarget(LoadBalancer)),
            Zone = props.HostedZone,
            RecordName = $"api.{props.HostedZone.ZoneName}"
        });
    }

}

internal class LoadBalancerStackProps(IHostedZone hostedZone, IVpc vpc, ISecurityGroup securityGroup) : StackProps
{
    public IHostedZone HostedZone { get; } = hostedZone;
    public IVpc Vpc { get; } = vpc;
    public ISecurityGroup SecurityGroup { get; } = securityGroup;
}