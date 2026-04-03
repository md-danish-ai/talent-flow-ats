from app.classifications import repository
from fastapi import HTTPException
from app.utils.status_codes import StatusCode


class ClassificationService:
    def create_classification(self, data):
        # 1. Check duplicate name within type
        count = repository.count_by_name_and_type(data.name, data.type)
        if count > 0:
            raise HTTPException(
                status_code=StatusCode.CONFLICT,
                detail=f"Classification with name '{data.name}' already exists for type '{data.type}'",
            )

        # 2. Check global duplicate code
        code = (data.code if data.code else data.name.upper()).upper().replace(" ", "_")
        existing_code = repository.get_by_code(code)
        if existing_code:
            raise HTTPException(
                status_code=StatusCode.CONFLICT,
                detail=f"Classification with code '{code}' already exists (in type '{existing_code['type']}')",
            )

        return repository.create(data, code)

    def get_all(
        self,
        type_filter: str = None,
        is_active: bool = None,
        search: str = None,
        sort_by: str = "sort_order",
        order: str = "asc",
        limit: int = 10,
        offset: int = 0,
    ):
        try:
            return repository.get_all(
                type_filter=type_filter,
                is_active=is_active,
                search=search,
                sort_by=sort_by,
                order=order,
                limit=limit,
                offset=offset,
            )
        except Exception as exception:
            raise HTTPException(
                status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(exception)
            )

    def get_by_id(self, classification_id: int):
        result = repository.get_by_id(classification_id)
        if not result:
            raise HTTPException(
                status_code=StatusCode.NOT_FOUND, detail="Classification not found"
            )
        return result

    def create(self, data):
        try:
            return self.create_classification(data)
        except HTTPException:
            raise
        except Exception as exception:
            if "unique constraint" in str(exception).lower():
                raise HTTPException(
                    status_code=StatusCode.CONFLICT,
                    detail="A classification with this name or code already exists.",
                )
            raise HTTPException(
                status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(exception)
            )

    def update(self, classification_id: int, data):
        # 1. Check if exists
        existing = repository.get_by_id(classification_id)
        if not existing:
            raise HTTPException(
                status_code=StatusCode.NOT_FOUND, detail="Classification not found"
            )

        # 2. Check duplicate name (if name changed)
        target_name = data.name if data.name else existing["name"]
        target_type = data.type if data.type else existing["type"]

        if data.name and data.name != existing["name"]:
            count = repository.count_by_name_and_type_exclude_id(
                target_name, target_type, classification_id
            )
            if count > 0:
                raise HTTPException(
                    status_code=StatusCode.CONFLICT,
                    detail=f"Classification with name '{target_name}' already exists for type '{target_type}'",
                )

        # 3. Check code uniqueness (global)
        # Generate new potential code
        if data.code:
            new_code = data.code.upper().replace(" ", "_")
        elif data.name:
            new_code = data.name.upper().replace(" ", "_")
        else:
            new_code = existing["code"]

        if new_code != existing["code"]:
            existing_rec = repository.get_by_code(new_code)
            if existing_rec and existing_rec["id"] != classification_id:
                raise HTTPException(
                    status_code=StatusCode.CONFLICT,
                    detail=f"Classification with code '{new_code}' already exists (in type '{existing_rec['type']}')",
                )

        try:
            return repository.update(classification_id, data)
        except Exception as exception:
            if "unique constraint" in str(exception).lower():
                raise HTTPException(
                    status_code=StatusCode.CONFLICT,
                    detail="A classification with this name or code already exists.",
                )
            raise HTTPException(
                status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(exception)
            )

    def delete(self, classification_id: int):
        existing = repository.get_by_id(classification_id)
        if not existing:
            raise HTTPException(
                status_code=StatusCode.NOT_FOUND, detail="Classification not found"
            )

        # Guard: block deletion if this code is referenced by other tables
        deps = repository.check_dependencies(classification_id)
        if deps:
            dep_lines = [
                f"  • {table}: {count} record{'s' if count > 1 else ''}"
                for table, count in deps.items()
            ]
            dep_summary = "\n".join(dep_lines)
            raise HTTPException(
                status_code=StatusCode.CONFLICT,
                detail=(
                    f"Cannot delete '{existing['name']}' because it is still referenced by:\n"
                    f"{dep_summary}\n\n"
                    "Please remove or reassign all dependent records before deleting this classification."
                ),
            )

        return repository.delete(classification_id)
