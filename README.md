# Signals-dk
Subtree project for the danish version of Signals

## Repository

This repository serves as the parent repository for the **signals-dk** project, integrating multiple sub-projects (`frontend`, `backend`, etc.) using Git subtree. This setup allows for seamless collaboration, while maintaining the independence of the individual sub-project repositories.

### Structure

- `infrastructure`: Contains the AWS/IaC version of a hosting environment.
- `frontend`: Contains the frontend codebase, pulled from its dedicated repository.
- `backend`: Contains the backend codebase, pulled from its dedicated repository.

### Subtree Management Commands

#### Pull Updates from Subtree Repositories

To bring the latest changes from the upstream repositories into the (in this case, **OS2sandbox**) `signals-dk` repository:

```
git subtree pull --prefix=aws-infrastructure https://github.com/OS2sandbox/signals-aws-infrastructure main
git subtree pull --prefix=frontend https://github.com/OS2sandbox/signals-frontend main
git subtree pull --prefix=backend https://github.com/OS2sandbox/signals-backend main
```

#### Push Changes Back to Subtree Repositories
If changes are made to the frontend or backend directories in this repository, push them back to the respective upstream repositories using the `git subtree push` command.

#### In a Dedicated Subtree Repository
You can also clone and work directly in the subtree repositories (e.g., frontend or backend) for independent development

## Migrations

New database migrations handling translation of `Category` and `Permission` have been added. Also, a migration for entering signal `Source` defaults have been added (this is otherwise done manually using the Djando admin interface)
