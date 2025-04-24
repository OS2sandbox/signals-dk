using System.Collections.Generic;
using Amazon.CDK.AWS.IAM;
using Amazon.CDK.AWS.Route53;
using Amazon.CDK.AWS.SecretsManager;
using Amazon.CDK.AWS.SES;

namespace Cdk.Stacks;

public class EmailStack : Stack
{
    public Secret MailCredentials { get; }

    internal EmailStack(Construct scope, string id, EmailStackProps props) : base(scope, id, props)
    {
        _ = new CaaRecord(this, "Caa", new CaaRecordProps
        {
            Zone = props.HostedZone,
            RecordName = $"mail.{props.HostedZone.ZoneName}",
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
        _ = new TxtRecord(this, "SPFRecord", new TxtRecordProps
        {
            Zone = props.HostedZone,
            RecordName = $"mail.{props.HostedZone.ZoneName}",
            Values = ["v=spf1 include:amazonses.com -all"]
        });
        _ = new TxtRecord(this, "DmarcRecord", new TxtRecordProps
        {
            Zone = props.HostedZone,
            RecordName = $"_dmarc.mail.{props.HostedZone.ZoneName}",
            Values = ["v=DMARC1; p=reject;"]
        });
        _ = new MxRecord(this, "MXRecord", new MxRecordProps
        {
            Zone = props.HostedZone,
            RecordName = $"mail.{props.HostedZone.ZoneName}",
            Values =
            [
                new MxRecordValue
                {
                    Priority = 10,
                    HostName = "inbound-smtp.eu-west-1.amazonaws.com"
                }
            ]
        });

        var emailIdentity = new EmailIdentity(this, "Email", new EmailIdentityProps
        {
            DkimIdentity = DkimIdentity.EasyDkim(EasyDkimSigningKeyLength.RSA_2048_BIT),
            DkimSigning = true,
            Identity = Identity.Domain($"mail.{props.HostedZone.ZoneName}")
        });
        for (var i = 0; i < emailIdentity.DkimRecords.Length; i++)
        {
            var dkimRecord = emailIdentity.DkimRecords[i];
            _ = new CnameRecord(this, $"DkimRecords{i}", new CnameRecordProps
            {
                Zone = props.HostedZone,
                RecordName = $"{dkimRecord.Name}.",
                DomainName = dkimRecord.Value
            });
        }

        var smtpGroup = new Group(this, "SmtpGroup", new GroupProps
        {
            ManagedPolicies =
            [
                new ManagedPolicy(this, "SendRawEmail", new ManagedPolicyProps
                {
                    Statements =
                    [
                        new PolicyStatement(new PolicyStatementProps
                        {
                            Actions = ["ses:SendRawEmail"],
                            Effect = Effect.ALLOW,
                            Resources = ["*"]
                        })
                    ]
                })
            ]
        });
        var user = new User(this, "SmtpUser", new UserProps
        {
            Groups = [smtpGroup]
        });
        var accessKey = new AccessKey(this, "SmtpUserAccessKey", new AccessKeyProps
        {
            Status = AccessKeyStatus.ACTIVE,
            User = user,
        });
        MailCredentials = new Secret(this, "SmtpSecret", new SecretProps
        {
            SecretObjectValue = new Dictionary<string, SecretValue>
            {
                { "username", SecretValue.UnsafePlainText(accessKey.AccessKeyId) },
                { "password", accessKey.SecretAccessKey }
            },
            Description = "Contain credentials for the SMTP user",
            RemovalPolicy = RemovalPolicy.DESTROY
        });
    }
}

internal sealed class EmailStackProps(IHostedZone hostedZone) : StackProps
{
    public IHostedZone HostedZone => hostedZone;
}