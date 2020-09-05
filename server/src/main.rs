#![feature(proc_macro_hygiene, decl_macro, try_trait, backtrace)]

#[macro_use]
extern crate rocket;
extern crate anyhow;
extern crate hmac;
extern crate jsonwebtoken;
extern crate sha2;
extern crate sled;

use rocket_contrib::json::Json;
use serde::{Deserialize, Serialize};
use std::backtrace::Backtrace;
use std::option::NoneError;
use thiserror::Error;

use anyhow::anyhow;
use anyhow::Context;
use argon2::{self, Config};
use rocket::fairing::AdHoc;
use rocket::http::Status;
use rocket::request::{self, FromRequest, Request};
use rocket::Outcome;
use rocket::State;
use sled::Db;
use sled_extensions::bincode::Tree;
use sled_extensions::DbExt;

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    email: String,
    exp: usize,
}

#[derive(Serialize, Deserialize, PartialEq, Debug, Clone)]
#[serde(rename_all = "camelCase")]
struct Investment {
    purchase_price: u32,
    uuid: String,
}

struct Database {
    houses: Tree<Investment>,
    users: Tree<User>,
    user_investments: Tree<Vec<String>>,
}

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

#[get("/investments")]
fn get_investments(db: State<Database>, user: User) -> anyhow::Result<Json<Vec<Investment>>> {
    let house_uuids = db
        .user_investments
        .get(user.email)?
        .ok_or(anyhow!("No user investments"))?;
    let mut houses: Vec<Investment> = vec![];
    for house_uuid in house_uuids {
        let house = db
            .houses
            .get(&house_uuid)?
            .ok_or(anyhow!("No investment"))?;
        // let mut house: Investment = bincode::deserialize(&house)?;
        houses.push(house);
    }
    Ok(Json(houses))
}

#[derive(Error, Debug)]
pub enum ServerError {
    #[error("unauthorized")]
    Unauthorized,
    #[error("unknown data store error")]
    Unknown,
}
impl From<NoneError> for ServerError {
    fn from(err: NoneError) -> Self {
        ServerError::Unknown
    }
}

impl<'a, 'r> FromRequest<'a, 'r> for User {
    type Error = ServerError;

    fn from_request(request: &'a Request<'r>) -> request::Outcome<Self, Self::Error> {
        let db = request
            .guard::<State<Database>>()
            .map_failure(|_e| (Status::InternalServerError, ServerError::Unknown))?;
        let authorization: Option<&str> = request.headers().get("Authorization").next();
        match authorization {
            Some(authorization) => match resolve_jwt(authorization, &db) {
                Err(e) => {
                    eprintln!("{:?}", e);
                    Outcome::Failure((Status::Unauthorized, ServerError::Unauthorized))
                }
                Ok(user) => Outcome::Success(user),
            },
            None => Outcome::Failure((Status::Unauthorized, ServerError::Unauthorized)),
        }
    }
}

#[get("/investments/<uuid>")]
fn get_investment(db: State<Database>, uuid: String) -> anyhow::Result<String> {
    let house = db.houses.get(uuid)?.ok_or(anyhow!("BLAH"))?;
    let house = serde_json::to_string(&house)?;
    Ok(house)
}

#[post("/investments", data = "<house>")]
fn patch_investment(
    db: State<Database>,
    house: Json<Investment>,
    user: User,
) -> anyhow::Result<&'static str> {
    let house_uuids = db.user_investments.get(&user.email)?;
    let mut house_uuids: Vec<String> = house_uuids.unwrap_or(vec![]);
    house_uuids.push(house.uuid.clone());
    db.user_investments
        .insert(user.email.as_bytes(), house_uuids)?;
    db.houses.insert(house.uuid.as_bytes(), house.clone())?;
    Ok("Blah")
}

#[derive(Deserialize, PartialEq, Debug)]
struct Credentials {
    email: String,
    password: String,
}

#[derive(Serialize, Deserialize, PartialEq, Debug, Clone)]
struct User {
    email: String,
    hash: String,
    salt: String,
}

#[derive(Serialize, Deserialize, PartialEq, Debug)]
struct AuthResponse {
    token: String,
}

#[derive(Serialize, Deserialize, PartialEq, Debug)]
struct UserResponse {
    email: String,
}

#[post("/signup", data = "<credentials>")]
fn signup(
    db: State<Database>,
    credentials: Json<Credentials>,
) -> anyhow::Result<Json<AuthResponse>> {
    let (hash, salt) = hash_credentials(&*credentials);
    let user = User {
        email: credentials.email.clone(),
        hash: hash.clone(),
        salt: salt.clone(),
    };
    db.users.insert(user.email.as_bytes(), user.clone())?;
    Ok(Json(AuthResponse {
        token: create_jwt(user)?,
        // token: "BLAH".to_string(),
    }))
}

fn hash_credentials(credentials: &Credentials) -> (String, String) {
    let password = b"password";
    let config = argon2::Config::default();
    let salt = credentials.email.clone() + "r u salty";
    let hash =
        argon2::hash_encoded(&credentials.password.as_bytes(), &salt.as_bytes(), &config).unwrap();
    return (hash, salt);
}

fn resolve_jwt(jwt: &str, db: &Database) -> anyhow::Result<User> {
    let claims = jsonwebtoken::decode::<Claims>(
        &jwt,
        &jsonwebtoken::DecodingKey::from_secret("0f2baa54-c50b-484e-8bee-a21ac0fe1440".as_ref()),
        &jsonwebtoken::Validation::default(),
    )
    .context("Failed to resolve JWT")?;
    let user = db.users.get(claims.claims.email)?.ok_or(anyhow!("BLAH"))?;
    Ok(user)
}

fn create_jwt(user: User) -> anyhow::Result<String> {
    let now = chrono::Local::now();
    let claims = Claims {
        email: user.email.clone(),
        exp: (now + chrono::Duration::days(1)).timestamp() as usize,
    };
    jsonwebtoken::encode(
        &jsonwebtoken::Header::default(),
        &claims,
        &jsonwebtoken::EncodingKey::from_secret("0f2baa54-c50b-484e-8bee-a21ac0fe1440".as_ref()),
    )
    .map_err(|_e| anyhow!("jwt creation failed"))
}

#[post("/login", data = "<credentials>")]
fn login(db: State<Database>, credentials: Json<Credentials>) -> anyhow::Result<&'static str> {
    Ok("Blah")
}

fn launch_server() -> anyhow::Result<&'static str> {
    let path = "./data/sled";
    let db = sled_extensions::Config::default()
        .path("./data/sled")
        .open()
        .expect("Failed to open sled db");
    let db_clone = db.clone();
    let db = Database {
        houses: db.open_bincode_tree("houses")?,
        users: db.open_bincode_tree("users")?,
        user_investments: db.open_bincode_tree("user_investments")?,
    };
    rocket::ignite()
        .manage(db)
        .attach(AdHoc::on_response("Flush sled", move |req, res| {
            db_clone.flush();
        }))
        .mount(
            "/api/",
            routes![index, get_investments, patch_investment, signup, login],
        )
        .launch();
    Ok("blah")
}

fn main() {
    launch_server();
}
