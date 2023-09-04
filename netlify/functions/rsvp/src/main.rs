use aws_lambda_events::encodings::Body;
use aws_lambda_events::event::apigw::{ApiGatewayProxyRequest, ApiGatewayProxyResponse};
use http::header::HeaderMap;
use lambda_runtime::{service_fn, Error, LambdaEvent};
use log::LevelFilter;
use postgrest::Postgrest;
use simple_logger::SimpleLogger;

#[tokio::main]
async fn main() -> Result<(), Error> {
    SimpleLogger::new()
        .with_utc_timestamps()
        .with_level(LevelFilter::Info)
        .init()
        .unwrap();

    let func = service_fn(root_handler);
    lambda_runtime::run(func).await?;
    Ok(())
}

pub(crate) async fn root_handler(
    event: LambdaEvent<ApiGatewayProxyRequest>,
) -> Result<ApiGatewayProxyResponse, Error> {
    let path = event.payload.path.as_ref().unwrap();

    let details: Result<String, (i64, String)> = match path.as_str().split('/').last() {
        Some("add") => add_handler(event).await,
        Some("get") => get_handler(event).await,
        _ => Err((400, format!("Path not Valid: {}", path))),
    };

    let resp = match details {
        Ok(body) => ApiGatewayProxyResponse {
            status_code: 200,
            headers: HeaderMap::new(),
            multi_value_headers: HeaderMap::new(),
            body: Some(Body::Text(body)),
            is_base64_encoded: Some(false),
        },
        Err((status, body)) => ApiGatewayProxyResponse {
            status_code: status,
            headers: HeaderMap::new(),
            multi_value_headers: HeaderMap::new(),
            body: Some(Body::Text(body)),
            is_base64_encoded: Some(false),
        },
    };
    Ok(resp)
}

async fn add_handler(event: LambdaEvent<ApiGatewayProxyRequest>) -> Result<String, (i64, String)> {
    let Ok(client) = db_client() else {
        return Err((500, "Failed to connect to database".into()));
    };
    let Some(body) = event.payload.body else {
        return Err((400, "No body provided".into()));
    };
    match client
        .from("rsvp")
        .upsert(body)
        .on_conflict("email")
        .execute()
        .await
    {
        Ok(_) => Ok("Success".into()),
        Err(e) => Err((500, format!("Failed to add to database: {}", e))),
    }
}

async fn get_handler(_event: LambdaEvent<ApiGatewayProxyRequest>) -> Result<String, (i64, String)> {
    Err((500, "Not Implemented".into()))
}

fn db_client() -> Result<Postgrest, Error> {
    Ok(Postgrest::new(dotenv::var("SUPABASE_API_URL")?)
        .insert_header("apikey", dotenv::var("SUPABASE_SECRET_KEY")?))
}
