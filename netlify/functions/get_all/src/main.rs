use aws_lambda_events::encodings::Body;
use aws_lambda_events::event::apigw::{ApiGatewayProxyRequest, ApiGatewayProxyResponse};
use http::header::HeaderMap;
use lambda_runtime::{handler_fn, Context, Error};
use log::LevelFilter;
use postgrest::Postgrest;
use simple_logger::SimpleLogger;

#[tokio::main]
async fn main() -> Result<(), Error> {
    SimpleLogger::new()
        .with_level(LevelFilter::Info)
        .with_utc_timestamps()
        .init()
        .unwrap();

    let func = handler_fn(my_handler);
    lambda_runtime::run(func).await?;
    Ok(())
}

pub(crate) async fn my_handler(
    _event: ApiGatewayProxyRequest,
    _ctx: Context,
) -> Result<ApiGatewayProxyResponse, Error> {
    let resp = match get_all_rsvp().await {
        Ok(resp) => ApiGatewayProxyResponse {
            status_code: 200,
            headers: HeaderMap::new(),
            multi_value_headers: HeaderMap::new(),
            body: Some(Body::Text(resp)),
            is_base64_encoded: Some(false),
        },
        Err(e) => ApiGatewayProxyResponse {
            status_code: 500,
            headers: HeaderMap::new(),
            multi_value_headers: HeaderMap::new(),
            body: Some(Body::Text(format!("Error: {}", e))),
            is_base64_encoded: Some(false),
        },
    };

    Ok(resp)
}

async fn get_all_rsvp() -> Result<String, Error> {
    let client = Postgrest::new(dotenv::var("SUPABASE_API_URL")?)
        .insert_header("apikey", dotenv::var("SUPABASE_SECRET_KEY")?);
    let resp = client
        .from("rsvp")
        .select("*")
        .auth(dotenv::var("SUPABASE_SECRET_KEY")?)
        .execute()
        .await?
        .text()
        .await?;

    Ok(resp)
}
