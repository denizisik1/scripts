#![warn(rust_2018_idioms)]

use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::TcpListener;

use std::env;
use std::error::Error;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let addr = env::args()
        .nth(1)
        .unwrap_or_else(|| "127.0.0.1:8080".to_string());

    let listener = TcpListener::bind(&addr).await?;
    println!("Listening on: {}", addr);

    loop {
        let (mut socket, _) = listener.accept().await?;

        tokio::spawn(async move {
            let mut buf = vec![0; 1024];

            loop {
                let n = match socket.read(&mut buf).await {
                    Ok(0) => return,
                    Ok(n) => n,
                    Err(e) => {
                        eprintln!("read error: {}", e);
                        return;
                    }
                };

                let incoming = String::from_utf8_lossy(&buf[..n]);
                print!("{}", incoming);

                if let Err(e) = socket.write_all(&buf[..n]).await {
                    eprintln!("write error: {}", e);
                    return;
                }
            }
        });
    }
}

