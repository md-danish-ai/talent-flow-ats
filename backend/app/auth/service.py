
class AuthService:
    async def register_user(self, user_data: dict):
        return {"message": "User registered successfully"}

    async def login_user(self, user_data: dict):
        return {"access_token": "dummy_token", "token_type": "bearer"}
