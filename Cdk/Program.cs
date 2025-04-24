
var app = new App();
var dns = new DnsStack(app, "Domain-Name");
var vpc = new VpcStack(app, "Network");
var db = new DatabaseStack(app, "Database", new DatabaseStackProps(vpc.Vpc, vpc.ApplicationSecurityGroup));
var lb = new LoadBalancerStack(app, "Load-Balancer", new LoadBalancerStackProps(dns.HostedZone, vpc.Vpc, vpc.LoadBalancerSecurityGroup));
var rb = new RabbitMqStack(app, "Rabbit-Mq", new RabbitMqStackProps(vpc.Vpc, vpc.RabbitMqSecurityGroup));
var email = new EmailStack(app, "Email", new EmailStackProps(dns.HostedZone));
_ = new ApplicationStack(app, "Application",
    new ApplicationStackProps(vpc.Vpc, lb.Listener, [vpc.ApplicationSecurityGroup], db.DatabaseCredentials,
        rb.RabbitCredentials, email.MailCredentials, rb.RabbitMqHostName));
app.Synth();