## Uniqueness of Username and Email

In this application, the uniqueness of `username` and `email` is handled by the backend logic in the `RegisterAccountLogic` serializer. This means that, when a user registers, we check if the `username` or `email` is already in use before allowing them to create an account.

**Important Note:**
- There are **no unique constraints** set at the database level for these fields (i.e., `username` and `email` are not marked as `UNIQUE` in the database schema). -> This is done for custom error messsages.