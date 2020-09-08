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
// use std::backtrace::Backtrace;
use std::collections::HashSet;
use std::env;
use std::option::NoneError;
use thiserror::Error;

use anyhow::anyhow;
use anyhow::Context;
use argon2::{self};
use rocket::fairing::AdHoc;
use rocket::http::Status;
use rocket::request::{self, FromRequest, Request};
use rocket::Outcome;
use rocket::State;
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
    financing_option: String,
    purchase_price: f64,
    down_payment: f64,
    interest_rate: f64,
    rent: f64,
    annual_taxes: f64,
    insurance: f64,
    expense_ratio: f64,
    prop_management: f64,
    misc_expenses: f64,
    hoa: f64,
    title: String,
    uuid: String,
}

struct Database {
    houses: Tree<Investment>,
    users: Tree<User>,
    user_investments: Tree<Vec<String>>,
    investment_users: Tree<String>,
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
        .ok_or_else(|| anyhow!("No user investments"))?;
    let mut houses: Vec<Investment> = vec![];
    for house_uuid in house_uuids {
        let house = db
            .houses
            .get(&house_uuid)?
            .ok_or_else(|| anyhow!("No investment"))?;
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
    fn from(_err: NoneError) -> Self {
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
fn get_investment(db: State<Database>, uuid: String) -> anyhow::Result<Json<Investment>> {
    let house = db
        .houses
        .get(uuid)?
        .ok_or_else(|| anyhow!("Investment does not exist"))?;
    // let house = serde_json::to_string(&house)?;
    Ok(Json(house))
}

#[post("/investments", data = "<houses>")]
fn patch_investment(
    db: State<Database>,
    houses: Json<Vec<Investment>>,
    user: User,
) -> anyhow::Result<&'static str> {
    let house_uuids = db.user_investments.get(&user.email)?;
    let mut house_uuids: Vec<String> = house_uuids.unwrap_or_default();
    dbg!(house_uuids.clone());
    let existing_house_uuids: HashSet<String> = house_uuids.clone().into_iter().collect();
    dbg!(existing_house_uuids.clone());
    let mut new_house_uuids: Vec<_> = houses
        .iter()
        .filter(|house| !existing_house_uuids.contains(&house.uuid))
        .map(|h| h.uuid.clone())
        .collect();
    dbg!(new_house_uuids.clone());
    new_house_uuids = new_house_uuids
        .into_iter()
        .filter(|new_house_uuid| {
            let existing_owner = db.investment_users.get(new_house_uuid);
            match existing_owner {
                Ok(Some(_)) | Err(_) => false,
                Ok(None) => db
                    .investment_users
                    .insert(new_house_uuid.as_bytes(), user.email.clone())
                    .is_ok(),
            }
        })
        .collect::<Vec<String>>();
    // existing_house_uuids.
    house_uuids.append(&mut new_house_uuids);
    db.user_investments
        .insert(user.email.as_bytes(), house_uuids)?;
    for house in houses.iter() {
        db.houses.insert(house.uuid.as_bytes(), house.clone())?;
    }
    Ok("Blah")
}

#[get("/health")]
fn health_check() -> anyhow::Result<&'static str> {
    Ok("Healthy")
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
        hash,
        salt,
    };
    let existing_user = db.users.get(user.email.as_bytes())?;
    if existing_user.is_some() {
        Err(anyhow!("Existing user"))
    } else {
        db.users.insert(user.email.as_bytes(), user.clone())?;
        Ok(Json(AuthResponse {
            token: create_jwt(user)?,
            // token: "BLAH".to_string(),
        }))
    }
}

fn hash_credentials(credentials: &Credentials) -> (String, String) {
    let config = argon2::Config::default();
    let salt = credentials.email.clone() + "r u salty";
    let hash =
        argon2::hash_encoded(&credentials.password.as_bytes(), &salt.as_bytes(), &config).unwrap();
    (hash, salt)
}

fn resolve_jwt(jwt: &str, db: &Database) -> anyhow::Result<User> {
    let claims = jsonwebtoken::decode::<Claims>(
        &jwt,
        &jsonwebtoken::DecodingKey::from_secret("0f2baa54-c50b-484e-8bee-a21ac0fe1440".as_ref()),
        &jsonwebtoken::Validation::default(),
    )
    .context("Failed to resolve JWT")?;
    let user = db
        .users
        .get(claims.claims.email)?
        .ok_or_else(|| anyhow!("BLAH"))?;
    Ok(user)
}

fn create_jwt(user: User) -> anyhow::Result<String> {
    let now = chrono::Local::now();
    let claims = Claims {
        email: user.email,
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
fn login(
    db: State<Database>,
    credentials: Json<Credentials>,
) -> anyhow::Result<Json<AuthResponse>> {
    let (hash, _) = hash_credentials(&*credentials);
    let user = db
        .users
        .get(&credentials.email)?
        .ok_or_else(|| anyhow!("no user investments"))?;
    if hash == user.hash {
        Ok(Json(AuthResponse {
            token: create_jwt(user)?,
        }))
    } else {
        Err(anyhow!("hash doesn't match"))
    }
}

fn launch_server() -> anyhow::Result<&'static str> {
    // let path = "./data/sled";
    let path = env::var("DB_PATH").unwrap_or("./data/sled".to_string());
    let db = sled_extensions::Config::default()
        .path(path)
        .open()
        .expect("Failed to open sled db");
    let db_clone = db.clone();
    let db = Database {
        houses: db.open_bincode_tree("houses")?,
        users: db.open_bincode_tree("users")?,
        user_investments: db.open_bincode_tree("user_investments")?,
        investment_users: db.open_bincode_tree("investment_users")?,
    };
    rocket::ignite()
        .manage(db)
        .attach(AdHoc::on_response("Flush sled", move |req, res| {
            db_clone.flush();
        }))
        .mount(
            "/api/",
            routes![
                index,
                get_investments,
                get_investment,
                health_check,
                patch_investment,
                signup,
                login
            ],
        )
        .launch();
    Ok("blah")
}

fn main() {
    launch_server();
}
