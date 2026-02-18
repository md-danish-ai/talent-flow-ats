# Talent Flow ATS

Talent Flow ATS is a modern application designed to streamline the recruitment process. It features a robust backend built with FastAPI and a dynamic frontend built with Next.js.

## Prerequisites

Before getting started, ensure you have the following installed on your system:

- **Node.js**: v18 or higher (using v24.13.0 recommended)
- **Python**: v3.9 or higher
- **npm**: (comes with Node.js)

## Getting Started

### 1. clone the repository

```bash
git clone <repository-url>
cd talent-flow-ats
```

### 2. Backend Setup

The backend is built with FastAPI and runs on port **4000**.

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Create and activate a virtual environment (optional but recommended):
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3.  Install the required dependencies:
    ```bash
    pip install -r ../requirements.txt
    ```

4.  Start the backend server:
    ```bash
    python -m app.main
    ```
    
    Alternatively, using `uvicorn` directly:
    ```bash
    uvicorn app.main:app --reload --port 4000
    ```

    The backend will be available at [http://localhost:4000](http://localhost:4000).
    - API Documentation (Swagger UI): [http://localhost:4000/docs](http://localhost:4000/docs)
    - ReDoc: [http://localhost:4000/redoc](http://localhost:4000/redoc)

### 3. Frontend Setup

The frontend is built with Next.js and React.

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  Install the dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

    The frontend will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

- `backend/`: Contains the FastAPI application logic.
    - `app/`: Main application source code.
    - `requirements.txt`: Python dependencies.
- `frontend/`: Contains the Next.js application logic.
    - `app/`: Next.js App Router structure.
    - `public/`: Static assets.