use aws_lambda_events::encodings::Body;
use aws_lambda_events::event::apigw::{ApiGatewayProxyRequest, ApiGatewayProxyResponse};
use http::header::HeaderMap;
use lambda_runtime::{service_fn, Error, LambdaEvent};
use postgrest::Postgrest;
use serde::{Deserialize, Serialize};

#[tokio::main]
async fn main() -> Result<(), Error> {
    println!("running function");

    lambda_runtime::run(service_fn(root_handler)).await?;
    println!("ran function");
    Ok(())
}

pub(crate) async fn root_handler(
    event: LambdaEvent<ApiGatewayProxyRequest>,
) -> Result<ApiGatewayProxyResponse, Error> {
    println!("handling root");
    let path = event.payload.path.as_ref().unwrap();

    let details: Result<String, (i64, String)> = match path.as_str().split('/').last() {
        Some("add") => add_handler(event).await,
        Some("get") => get_handler(event).await,
        _ => Err((400, format!("Path not Valid: {}", path))),
    };

    println!("response details: {:?}", details);

    match details {
        Ok(body) => Ok(ApiGatewayProxyResponse {
            status_code: 200,
            headers: HeaderMap::new(),
            multi_value_headers: HeaderMap::new(),
            body: Some(Body::Text(body)),
            is_base64_encoded: Some(false),
        }),
        Err((status, body)) => Ok(ApiGatewayProxyResponse {
            status_code: status,
            headers: HeaderMap::new(),
            multi_value_headers: HeaderMap::new(),
            body: Some(Body::Text(body)),
            is_base64_encoded: Some(false),
        }),
    }
}

async fn add_handler(event: LambdaEvent<ApiGatewayProxyRequest>) -> Result<String, (i64, String)> {
    println!("handling add");
    let Ok(client) = db_client() else {
        return Err((500, "Failed to connect to database".into()));
    };
    println!("client: made");
    let Some(body) = event.payload.body else {
        return Err((400, "No body provided".into()));
    };
    println!("body: {}", body);
    let Ok(data): Result<AddBody, _> = serde_json::from_str(&body) else {
        return Err((400, "Body not valid".into()));
    };
    println!("data: {:?}", data);
    let Ok(rsvp) = serde_json::to_string(&data.rsvp) else {
        return Err((400, "RSVP not valid".into()));
    };
    println!("rsvp: {}", rsvp);
    let Ok(res) = client
        .from("rsvp")
        .auth(dotenv::var("SUPABASE_SECRET_KEY").expect("Key already validated to exist"))
        .insert(format!("[{}]", rsvp))
        .execute()
        .await
    else {
        return Err((500, "Failed to connect to database".into()));
    };
    println!("res: {:?}", res);
    let Ok(res_text) = res.text().await else {
        return Err((500, "Failed to connect to database".into()));
    };
    println!("res_text: {}", res_text);
    let Ok(created_rsvp) = serde_json::from_str::<Vec<Rsvp>>(&res_text).map(|mut r| r.remove(0))
    else {
        return Err((500, "Malformed response from db".into()));
    };
    println!("created_rsvp: {:?}", created_rsvp);

    let guests = data
        .guests
        .into_iter()
        .map(|g| {
            let mut guest = g.clone();
            guest.rsvp_id = created_rsvp.id;
            guest
        })
        .collect::<Vec<Guest>>();

    let Ok(guests) = serde_json::to_string(&guests) else {
        return Err((400, "Guests not valid".into()));
    };

    println!("guests: {}", guests);

    let Ok(res) = client
        .from("guests")
        .auth(dotenv::var("SUPABASE_SECRET_KEY").expect("Key already validated to exist"))
        .insert(guests)
        .execute()
        .await
    else {
        return Err((500, "Failed to connect to database".into()));
    };

    println!("guest res: {:?}", res);

    let Ok(res_text) = res.text().await else {
        return Err((500, "Failed to connect to database".into()));
    };
    println!("res_text: {}", res_text);

    let Ok(created_guests) = serde_json::from_str::<Vec<Guest>>(&res_text) else {
        return Err((500, "Malformed response from db".into()));
    };

    println!("created_guests: {:?}", created_guests);

    Ok(serde_json::to_string(&AddBody {
        rsvp: created_rsvp,
        guests: created_guests,
    })
    .expect("Should be able to serialize"))
}

async fn get_handler(_event: LambdaEvent<ApiGatewayProxyRequest>) -> Result<String, (i64, String)> {
    Err((500, "Not Implemented...yet".into()))
}

fn db_client() -> Result<Postgrest, Error> {
    Ok(Postgrest::new(dotenv::var("SUPABASE_API_URL")?)
        .insert_header("apikey", dotenv::var("SUPABASE_SECRET_KEY")?))
}

#[derive(Deserialize, Serialize, Debug)]
struct AddBody {
    rsvp: Rsvp,
    guests: Vec<Guest>,
}

#[derive(Deserialize, Serialize, Debug)]
struct Rsvp {
    #[serde(skip_serializing_if = "Option::is_none")]
    id: Option<i64>,
    can_attend: i64,
    email: String,
    name: String,
    other_notes: String,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
struct Guest {
    rsvp_id: Option<i64>,
    dietary_restrictions: String,
    name: String,
}
