# Changesets

Every change to `@hzblj/kara-ui` that consumers should hear about gets a changeset:

```bash
yarn changeset
```

Pick the bump, write one line a consumer can act on, commit the generated file with the change. On `main`
the Release workflow collects pending changesets into a "version packages" PR; merging that PR publishes
to npm. The example app is private and never versioned.
