from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from auth import authenticate_user, create_access_token, get_current_active_user, get_password_hash, get_current_admin_user
from api import training_router, submissions_router, osu_api_router
from models import Token, User, UserCreate
from db import get_user, user_exists, create_user

app = FastAPI()
app.include_router(submissions_router, prefix='/api')
app.include_router(training_router, prefix='/api')
app.include_router(osu_api_router, prefix='/api')



origins = [
    "http://localhost:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    print(form_data.username, form_data.password)
    print(user)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect Username or Password", headers={"WWW-Authenticate": "Bearer"})
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/register")
async def register_user(user_data: UserCreate):
    existing_username = user_exists("username", user_data.username)
    if existing_username:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists")
    existing_email = user_exists("email", user_data.email)
    if existing_email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists")

    hashed_password = get_password_hash(user_data.password)
    create_user(username=user_data.username, email=user_data.email, password_hashed=hashed_password)
    access_token = create_access_token(data={"sub": user_data.username})
    return {"user": user_data, "access_token": access_token, "token_type": "bearer", "message": "Success. The account has been registered."}


@app.get("/users/me/", response_model=User)
async def read_users_me(admin_user: User = Depends(get_current_admin_user)):
    return admin_user


@app.get("/")
def read_root():
    return {"Hello": "World"}



#if __name__ == "__main__":
#    main()
