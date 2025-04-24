using Amazon.CDK.AWS.Route53;

namespace Cdk.Stacks;

public class DnsStack : Stack
{
    public HostedZone HostedZone { get; }

    internal DnsStack(Construct scope, string id, IStackProps? props = null) : base(scope, id, props)
    {
        HostedZone = new HostedZone(this, "dns", new HostedZoneProps
        {
            ZoneName = scope.Node.TryGetContext("zoneName") as string ?? throw new ArgumentException("zoneName is required")
        });
        _ = new CaaRecord(this, "Caa", new CaaRecordProps
        {
            Zone = HostedZone,
            RecordName = $"{HostedZone.ZoneName}",
            Values =
            [
                new CaaRecordValue
                {
                    Flag = 0,
                    Tag = CaaTag.ISSUE,
                    Value = "amazon.com"
                }
            ]

        });
    }
}