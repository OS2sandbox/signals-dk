using System.Collections.Generic;
using Amazon.CDK.AWS.IAM;
using Amazon.CDK.AWS.Route53;
using Amazon.CDK.AWS.SecretsManager;
using Amazon.CDK.AWS.SES;

namespace Cdk.Stacks;

public class EmailStack : Stack
{
    public Secret MailCredentials { get; }
    public string FromDomain { get; }

    internal EmailStack(Construct scope, string id, EmailStackProps props) : base(scope, id, props)
    {
        _ = new TxtRecord(this, "RootSPFRecord", new TxtRecordProps
        {
            Zone = props.HostedZone,
            RecordName = $"{props.HostedZone.ZoneName}",
            Values = ["v=spf1 include:amazonses.com -all"]
        });
        _ = new TxtRecord(this, "FromSPFRecord", new TxtRecordProps
        {
            Zone = props.HostedZone,
            RecordName = $"mail.{props.HostedZone.ZoneName}",
            Values = ["v=spf1 include:amazonses.com ~all"]
        });
        _ = new MxRecord(this, "RootMXRecord", new MxRecordProps
        {
            Zone = props.HostedZone,
            RecordName = $"{props.HostedZone.ZoneName}",
            Values =
            [
                new MxRecordValue
                {
                    Priority = 10,
                    HostName = "inbound-smtp.eu-west-1.amazonaws.com"
                }
            ]
        });
        _ = new MxRecord(this, "FromMXRecord", new MxRecordProps
        {
            Zone = props.HostedZone,
            RecordName = $"mail.{props.HostedZone.ZoneName}",
            Values =
            [
                new MxRecordValue
                {
                    Priority = 10,
                    HostName = "feedback-smtp.eu-west-1.amazonses.com"
                }
            ]
        });

        _ = new TxtRecord(this, "RootDmarcRecord", new TxtRecordProps
        {
            Zone = props.HostedZone,
            RecordName = $"_dmarc.{props.HostedZone.ZoneName}",
            Values = ["v=DMARC1; p=reject;"]
        });
        _ = new TxtRecord(this, "FromDmarcRecord", new TxtRecordProps
        {
            Zone = props.HostedZone,
            RecordName = $"_dmarc.mail.{props.HostedZone.ZoneName}",
            Values = ["v=DMARC1; p=reject;"]
        });

        var emailIdentity = new EmailIdentity(this, "Email", new EmailIdentityProps
        {
            DkimIdentity = DkimIdentity.EasyDkim(EasyDkimSigningKeyLength.RSA_2048_BIT),
            DkimSigning = true,
            Identity = Identity.Domain($"{props.HostedZone.ZoneName}"),
            MailFromDomain = $"mail.{props.HostedZone.ZoneName}"
        });
        FromDomain = emailIdentity.EmailIdentityName;
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

        var user = new User(this, "SmtpUser", new UserProps
        {
            Groups = [Group.FromGroupName(this, "AWSSESSendingGroupDoNotRename", "AWSSESSendingGroupDoNotRename")]
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