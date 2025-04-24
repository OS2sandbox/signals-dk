using Amazon.CDK.AWS.EC2;
using Amazon.CDK.AWS.ECS;
using Amazon.CDK.AWS.ElasticLoadBalancingV2;
using Amazon.CDK.AWS.Logs;
using Amazon.CDK.AWS.SecretsManager;
using System.Collections.Generic;
using HealthCheck = Amazon.CDK.AWS.ElasticLoadBalancingV2.HealthCheck;
using NetworkMode = Amazon.CDK.AWS.ECS.NetworkMode;
using Secret = Amazon.CDK.AWS.ECS.Secret;

namespace Cdk.Stacks;

public class ApplicationStack : Stack
{
    public ApplicationStack(Construct scope, string id, ApplicationStackProps props) : base(scope, id, props)
    {
        var domainName = scope.Node.TryGetContext("zoneName") as string ?? throw new ArgumentException("zoneName is required");
        var cluster = new Cluster(this, "Cluster", new ClusterProps
        {
            Vpc = props.Vpc
        });

        var taskDefinition = new TaskDefinition(this, "Signalen", new TaskDefinitionProps
        {
            Compatibility = Compatibility.FARGATE,
            NetworkMode = NetworkMode.AWS_VPC,
            MemoryMiB = "2048", 
            Cpu = "1024",
            RuntimePlatform = new RuntimePlatform
            {
                CpuArchitecture = CpuArchitecture.X86_64,
                OperatingSystemFamily = OperatingSystemFamily.LINUX
            }
        });

        var service = new FargateService(this, "Service",
            new FargateServiceProps
            {
                Cluster = cluster,
                TaskDefinition = taskDefinition,
                DesiredCount = 1,
                MinHealthyPercent = 0,
                MaxHealthyPercent = 200,
                SecurityGroups = props.ApplicationSecurityGroups,
                PlatformVersion = FargatePlatformVersion.LATEST,
                VpcSubnets = new SubnetSelection { SubnetType = SubnetType.PUBLIC },
                HealthCheckGracePeriod = Duration.Seconds(0),
                AssignPublicIp = true
            });


        AddFrontendContainer(props, taskDefinition, service, domainName);
        AddBackendContainer(props, taskDefinition, service, domainName);
        AddCeleryWorkerContainer(props, taskDefinition, service, domainName);
        AddCeleryFlowerContainer(props, taskDefinition, service, domainName);
        AddDatabaseMigrationContainer(props, taskDefinition, service, domainName);
    }

    private static void AddCeleryWorkerContainer(ApplicationStackProps props, TaskDefinition taskDefinition,
        BaseService service, string domainName)
    {
        var backendImageName = service.Node.TryGetContext("backendImageName") as string;
        taskDefinition.AddContainer("celery-worker",
            new ContainerDefinitionOptions
            {
                Essential = false,
                Secrets = CreateBackendSecretEnvironmentVariables(props),
                Environment = CreateBackendEnvironmentVariables(props, domainName),
                Image = ContainerImage.FromRegistry(
                    string.IsNullOrEmpty(backendImageName) ? "signalen/backend:latest" : backendImageName,
                    new RepositoryImageProps()),
                Command =
                [
                    "/usr/local/bin/celery","--app=signals","worker","--loglevel=DEBUG","--concurrency=1"
                ],
                HealthCheck = new Amazon.CDK.AWS.ECS.HealthCheck
                {
                    Command = ["bash", "-c", "celery --app=signals inspect ping -d celery@$HOSTNAME"]
                },
                Logging = LogDriver.AwsLogs(new AwsLogDriverProps
                {
                    LogRetention = RetentionDays.ONE_DAY,
                    Mode = AwsLogDriverMode.NON_BLOCKING,
                    StreamPrefix = "celery-worker"
                })
            });
    }

    private static void AddCeleryFlowerContainer(ApplicationStackProps props, TaskDefinition taskDefinition,
        BaseService service, string domainName)
    {
        var backendImageName = service.Node.TryGetContext("backendImageName") as string;
        taskDefinition.AddContainer("migration-worker",
            new ContainerDefinitionOptions
            {
                Essential = false,
                Secrets = CreateBackendSecretEnvironmentVariables(props),
                Environment = CreateBackendEnvironmentVariables(props, domainName),
                Image = ContainerImage.FromRegistry(
                    string.IsNullOrEmpty(backendImageName) ? "signalen/backend:latest" : backendImageName,
                    new RepositoryImageProps()),
                //Command = ["python", "manage.py", "migrate","--noinput"],
                Command = ["/migrate.sh"],
                Logging = LogDriver.AwsLogs(new AwsLogDriverProps
                {
                    LogRetention = RetentionDays.ONE_DAY,
                    Mode = AwsLogDriverMode.NON_BLOCKING,
                    StreamPrefix = "migration-worker"
                })
            });
    }

    private static void AddDatabaseMigrationContainer(ApplicationStackProps props, TaskDefinition taskDefinition,
        BaseService service, string domainName)
    {
        var backendImageName = service.Node.TryGetContext("backendImageName") as string;
        taskDefinition.AddContainer("celery-flower",
            new ContainerDefinitionOptions
            {
                Essential = false,
                Secrets = CreateBackendSecretEnvironmentVariables(props),
                Environment = CreateBackendEnvironmentVariables(props, domainName),
                Image = ContainerImage.FromRegistry(
                    string.IsNullOrEmpty(backendImageName) ? "signalen/backend:latest" : backendImageName,
                    new RepositoryImageProps()),
                Command =
                [
                    "/usr/local/bin/celery","--app=signals","flower","--address=0.0.0.0","--port=8001"
                ],
                HealthCheck = new Amazon.CDK.AWS.ECS.HealthCheck
                {
                    Command = ["bash", "-c", "celery --app=signals inspect ping -d celery@$HOSTNAME"]
                },
                Logging = LogDriver.AwsLogs(new AwsLogDriverProps
                {
                    LogRetention = RetentionDays.ONE_DAY,
                    Mode = AwsLogDriverMode.NON_BLOCKING,
                    StreamPrefix = "celery-flower"
                })
            });
    }

    private static void AddBackendContainer(ApplicationStackProps props, TaskDefinition taskDefinition, BaseService service, string domainName)
    {
        var backendImageName = service.Node.TryGetContext("backendImageName") as string;
        const int containerPort = 8000;
        taskDefinition.AddContainer("Backend",
            new ContainerDefinitionOptions
            {
                Essential = true,
                Secrets = CreateBackendSecretEnvironmentVariables(props),
                Environment = CreateBackendEnvironmentVariables(props, domainName),
                PortMappings =
                [
                    new PortMapping
                    {
                        ContainerPort = containerPort,
                        HostPort = containerPort
                    }
                ],
                Image = ContainerImage.FromRegistry(string.IsNullOrEmpty(backendImageName) ? "signalen/backend:latest" : backendImageName, new RepositoryImageProps()),
                Command = ["/usr/local/bin/uwsgi", "--master", $"--http=0.0.0.0:{containerPort}", "--module=signals.wsgi:application", "--buffer-size=8192", "--processes=4", "--threads=2", "--static-map=/signals/static=/app/static", "--static-map=/signals/media=/app/media", "--die-on-term", "--lazy-apps"],
                Logging = LogDriver.AwsLogs(new AwsLogDriverProps
                {
                    LogRetention = RetentionDays.ONE_DAY,
                    Mode = AwsLogDriverMode.NON_BLOCKING,
                    StreamPrefix = "backend"
                })
            });

        service.RegisterLoadBalancerTargets(new EcsTarget
        {
            ContainerName = "Backend",
            NewTargetGroupId = "Backend",
            Listener = ListenerConfig.ApplicationListener(props.Listener, new AddApplicationTargetsProps
            {
                Protocol = ApplicationProtocol.HTTP,
                Conditions = [
                    ListenerCondition.HostHeaders([$"api.{domainName}"])
                ],
                Priority = 20,
                HealthCheck = new HealthCheck
                {
                    Enabled = true,
                    HealthyHttpCodes = "200,301,404",
                    Interval = Duration.Minutes(2),
                    Timeout = Duration.Minutes(1)
                }
            })
        });
    }

    private static void AddFrontendContainer(ApplicationStackProps props, TaskDefinition taskDefinition, BaseService service, string domainName)
    {
        var frontendImageName = service.Node.TryGetContext("frontendImageName") as string;
        taskDefinition.AddContainer("Frontend",
            new ContainerDefinitionOptions
            {
                Essential = true,
                PortMappings =
                [
                    new PortMapping
                    {
                        ContainerPort = 8080,
                        HostPort = 8080
                    }
                ],
                Image = ContainerImage.FromRegistry(string.IsNullOrEmpty(frontendImageName) ? "signalen/frontend:latest" : frontendImageName, new RepositoryImageProps()),
                Logging = LogDriver.AwsLogs(new AwsLogDriverProps
                {
                    LogRetention = RetentionDays.ONE_DAY,
                    Mode = AwsLogDriverMode.NON_BLOCKING,
                    StreamPrefix = "frontend"
                })
            });

        service.RegisterLoadBalancerTargets(new EcsTarget
        {
            ContainerName = "Frontend",
            NewTargetGroupId = "Frontend",
            Listener = ListenerConfig.ApplicationListener(props.Listener, new AddApplicationTargetsProps
            {
                Protocol = ApplicationProtocol.HTTP,
                Conditions = [
                    ListenerCondition.HostHeaders([domainName])
                ],
                Priority = 10
            })
        });
    }

    private static Dictionary<string, Secret> CreateBackendSecretEnvironmentVariables(ApplicationStackProps props)
    {
        return new Dictionary<string, Secret>
        {
            {
                "DATABASE_USER",
                Secret.FromSecretsManager(props.DatabaseSecret, "username")
            },
            {
                "DATABASE_PASSWORD",
                Secret.FromSecretsManager(props.DatabaseSecret, "password")
            },
            {
                "DATABASE_HOST_OVERRIDE",
                Secret.FromSecretsManager(props.DatabaseSecret, "host")
            },
            {
                "DATABASE_PORT_OVERRIDE",
                Secret.FromSecretsManager(props.DatabaseSecret, "port")
            },
            {
                "EMAIL_HOST_USER",
                Secret.FromSecretsManager(props.MaiSecret, "username")
            },
            {
                "EMAIL_HOST_PASSWORD",
                Secret.FromSecretsManager(props.MaiSecret, "password")
            },
            {
                "RABBITMQ_USER",
                Secret.FromSecretsManager(props.RabbitSecret, "username")
            },
            {
                "RABBITMQ_PASSWORD",
                Secret.FromSecretsManager(props.RabbitSecret, "password")
            }
        };
    }

    private static Dictionary<string, string> CreateBackendEnvironmentVariables(ApplicationStackProps props, string domainName)
    {
        return new Dictionary<string, string>
        {
            { "SECRET_KEY", "insecure" },
            { "DJANGO_DEBUG", "False" },
            { "LOGGING_LEVEL", "INFO" },
            { "ALLOWED_HOSTS", "*" },
            { "FRONTEND_URL", $"http://{domainName}" },
            { "DWH_MEDIA_ROOT", "/dwh_media" },
            { "CORS_ALLOW_ALL_ORIGINS", "True" },
            { "DATABASE_NAME", "signals" },
            { "PUB_JWKS", "" },
            { "JWKS_URL", "https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_HEpqeR09o/.well-known/jwks.json" },
            { "USER_ID_FIELDS", "email" },
            { "SIGNALS_AUTH_ALWAYS_OK", "True" },
            { "TEST_LOGIN", "signals.admin@example.com" },
            { "SECURE_SSL_REDIRECT", "True" },
            { "SESSION_COOKIE_SECURE", "True" },
            { "CSRF_COOKIE_SECURE", "True" },
            { "ELASTICSEARCH_HOST", "elasticsearch:9200" },
            { "EMAIL_HOST", $"email-smtp.{Aws.REGION}.amazonaws.com" },
            { "EMAIL_PORT", "587" },
            { "EMAIL_USE_TLS", "True" },
            { "EMAIL_USE_SSL", "False" },
            { "DEFAULT_FROM_EMAIL",  $"Meddelelser fra Aarhus kommune <noreply@{props.MailFrom}>" },
            { "MY_SIGNALS_ENABLED", "True" },
            { "SIGNAL_HISTORY_LOG_ENABLED", "True" },
            { "OIDC_RP_CLIENT_ID", "1e62jf9du06ccq04sh80djse1i" },
            { "OIDC_RP_CLIENT_SECRET", "" },
            { "OIDC_OP_AUTHORIZATION_ENDPOINT", "https://eu-west-1hepqer09o.auth.eu-west-1.amazoncognito.com/oauth2/authorize" },
            { "OIDC_OP_TOKEN_ENDPOINT", "https://eu-west-1hepqer09o.auth.eu-west-1.amazoncognito.com/oauth2/token" },
            { "OIDC_OP_USER_ENDPOINT", "https://eu-west-1hepqer09o.auth.eu-west-1.amazoncognito.com/oauth2/userInfo" },
            { "OIDC_OP_JWKS_ENDPOINT", "https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_HEpqeR09o/.well-known/jwks.json" },
            { "SILK_ENABLED", "False" },
            { "SILK_PROFILING_ENABLED", "False" },
            { "SILK_AUTHENTICATION_ENABLED", "False" },
            { "SESSION_SUPPORT_ON_TOKEN_AUTHENTICATION", "False" },
            { "SYSTEM_MAIL_FEEDBACK_RECEIVED_ENABLED", "True" },
            { "REPORTER_MAIL_HANDLED_NEGATIVE_CONTACT_ENABLED", "True" },
            { "MAINTENANCE_MODE", "False" },
            { "RABBITMQ_HOST", props.RabbitMqHostname},
            { "CELERY_BROKER_URL", $"amqps://{props.RabbitSecret.SecretValueFromJson("username").UnsafeUnwrap()}:{props.RabbitSecret.SecretValueFromJson("password").UnsafeUnwrap()}@{props.RabbitMqHostname}:5671"}
        };
    }
}

public class ApplicationStackProps(Vpc vpc, ApplicationListener listener, ISecurityGroup[] applicationSecurityGroups, ISecret databaseSecret, ISecret rabbitSecret, ISecret maiSecret, string rabbitMqHostname, string mailFrom) : StackProps
{
    public IVpc Vpc { get; init; } = vpc;
    public ApplicationListener Listener { get; } = listener;
    public ISecurityGroup[] ApplicationSecurityGroups { get; } = applicationSecurityGroups;
    public ISecret DatabaseSecret { get; } = databaseSecret;
    public ISecret RabbitSecret { get; } = rabbitSecret;
    public ISecret MaiSecret { get; } = maiSecret;
    public string RabbitMqHostname { get; } = rabbitMqHostname;
    public string MailFrom { get; } = mailFrom;
}