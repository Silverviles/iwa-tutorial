class TCPClient {
  private socket: TCPSocket | null = null;

  constructor(private remoteAddress: string, private remotePort: number) {}

  async connect(): Promise<void> {
    console.log(`Connecting to ${this.remoteAddress}:${this.remotePort}...`);
    this.socket = new TCPSocket(this.remoteAddress, this.remotePort);

    const { readable, writable } = await this.socket.opened;

    this.listenForData(readable);
    console.log(`Connected to ${this.remoteAddress}:${this.remotePort}`);
  }

  private async listenForData(readable: ReadableStream<Uint8Array>) {
    const reader = readable.getReader();
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        console.log(`Received: ${new TextDecoder().decode(value)}`);
      }
    } finally {
      reader.releaseLock();
    }
  }

  async send(data: string): Promise<void> {
    if (!this.socket) throw new Error("Socket not connected.");
    const { writable } = await this.socket.opened;
    const writer = writable.getWriter();
    try {
      await writer.write(new TextEncoder().encode(data));
      console.log(`Sent: ${data}`);
    } finally {
      writer.releaseLock();
    }
  }

  async close(): Promise<void> {
    if (this.socket) {
      await this.socket.close();
      console.log("Connection closed.");
    }
  }
}
