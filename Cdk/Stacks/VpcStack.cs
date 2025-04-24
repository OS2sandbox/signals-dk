using Amazon.CDK.AWS.EC2;

namespace Cdk.Stacks;

public class VpcStack : Stack
{
    public Vpc Vpc { get; }

    public SecurityGroup ApplicationSecurityGroup { get; }

    public SecurityGroup LoadBalancerSecurityGroup { get; }

    public SecurityGroup RabbitMqSecurityGroup { get; }

    internal VpcStack(Construct scope, string id, IStackProps? props = null) : base(scope, id, props)
    {
        Vpc = new Vpc(this, "vpc", new VpcProps
        {
            IpProtocol = IpProtocol.DUAL_STACK,
            SubnetConfiguration = Vpc.DEFAULT_SUBNETS_NO_NAT
        });
        ApplicationSecurityGroup = CreateApplicationSecurityGroup();
        LoadBalancerSecurityGroup = CreateLoadBalancerSecurityGroup(this, Vpc, ApplicationSecurityGroup);
        RabbitMqSecurityGroup = CreateRabbitMqSecurityGroup(this, Vpc, ApplicationSecurityGroup);

    }
    private SecurityGroup CreateApplicationSecurityGroup() =>
        new(this, "appSecGrp", new SecurityGroupProps
        {
            AllowAllIpv6Outbound = true,
            AllowAllOutbound = true,
            Vpc = Vpc
        });

    private static SecurityGroup CreateLoadBalancerSecurityGroup(Construct scope, IVpc vpc, ISecurityGroup applicationSecurityGroup)
    {
        var loadBalancerSecurityGroup = new SecurityGroup(scope, "lbSecGrp", new SecurityGroupProps
        {
            AllowAllOutbound = false,
            AllowAllIpv6Outbound = false,
            Vpc = vpc
        });
        applicationSecurityGroup.AddIngressRule(loadBalancerSecurityGroup, Port.HTTP);
        loadBalancerSecurityGroup.AddEgressRule(applicationSecurityGroup, Port.HTTP, "allow outbound traffic to anywhere from the lb on port 80");
        loadBalancerSecurityGroup.AddEgressRule(applicationSecurityGroup, Port.HTTP, "allow outbound traffic to anywhere from the lb on port 80");
        loadBalancerSecurityGroup.AddIngressRule(Peer.AnyIpv4(), Port.HTTPS, "allow inbound traffic from anywhere to the lb on port 443 TCP");
        loadBalancerSecurityGroup.AddIngressRule(Peer.AnyIpv6(), Port.HTTPS, "allow inbound traffic from anywhere to the lb on port 443 TCP");
        loadBalancerSecurityGroup.AddIngressRule(Peer.AnyIpv4(), Port.Udp(443), "allow inbound traffic from anywhere to the lb on port 443 UDP");
        loadBalancerSecurityGroup.AddIngressRule(Peer.AnyIpv6(), Port.Udp(443), "allow inbound traffic from anywhere to the lb on port 443 UDP");
        return loadBalancerSecurityGroup;
    }
    private static SecurityGroup CreateRabbitMqSecurityGroup(Construct scope, IVpc vpc, ISecurityGroup applicationSecurityGroup)
    {
        var securityGroup = new SecurityGroup(scope, "mqSecGrp", new SecurityGroupProps
        {
            AllowAllOutbound = false,
            AllowAllIpv6Outbound = false,
            Vpc = vpc
        });
        securityGroup.AddIngressRule(applicationSecurityGroup, Port.Tcp(5671));
        securityGroup.AddIngressRule(applicationSecurityGroup, Port.Tcp(443));
        return securityGroup;
    }

}