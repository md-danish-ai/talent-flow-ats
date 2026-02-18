
class UserService:
    async def get_user_by_email(self, email: str):
        return {"id": 1, "email": email, "is_active": True}

    async def create_user(self, user_data: dict):
        return {"id": 2, **user_data, "is_active": True}
