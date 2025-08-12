use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::TcpStream;
use tokio::time::{sleep, Duration};

#[tokio::main]
async fn main() {
    let mut handles = Vec::new();

    for id in 0..5 {
        handles.push(tokio::spawn(async move {
            let mut stream = TcpStream::connect("127.0.0.1:8080").await.unwrap();

            for seq in 0..12 {
                let msg = format!("device {id} packet {seq}\n");
                stream.write_all(msg.as_bytes()).await.unwrap();

                let mut buf = [0u8; 1024];
                let _ = stream.read(&mut buf).await.unwrap();

                sleep(Duration::from_secs(1)).await;
            }
        }));
    }

    for h in handles {
        h.await.unwrap();
    }
}
