from app.departments import repository

class DepartmentService:
    def get_all(self, **kwargs):
        return repository.get_all(**kwargs)

    def get_by_id(self, department_id: int):
        return repository.get_by_id(department_id)

    def create(self, data):
        return repository.create(data)

    def update(self, department_id: int, data):
        return repository.update(department_id, data)

    def delete(self, department_id: int):
        return repository.delete(department_id)
