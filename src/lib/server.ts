class TCPServer {
  private serverSocket: TCPServerSocket;
  private clientList: String[] = [];

  // Backlog value will be assigned as OS default.
  // To manually add a value, add the second parameter as the backlog to the options variable
  constructor(
    private localAddress: string,
    private localPort: number
  ) {
    var options: TCPServerSocketOptions = {
      localPort
    }
    this.serverSocket = new TCPServerSocket(localAddress, options);
  }

  async start(): Promise<void> {
    const { readable, localAddress, localPort } = await this.serverSocket
      .opened;
    console.log(`Server started at ${localAddress}:${localPort}`);
    this.handleConnections(readable);
  }

  private async handleConnections(readable: ReadableStream<TCPSocket>) {
    const reader = readable.getReader();
    try { // TODO: Need a better way to handle the listening time of the server. A switch to turn it off.
      while (true) {
        const { value: clientSocket, done } = await reader.read();
        if (done) break;
        console.log("New client connected.");
        this.handleClient(clientSocket);
      }
    } finally {
      reader.releaseLock();
    }
  }

  // TODO: Allow client to send many messages and initiate the connection termination as well.
  // TODO: Allow support for multiple clients and distinguish between them
  private async handleClient(socket: TCPSocket) {
    const { readable, writable, remoteAddress, remotePort } =
      await socket.opened;
    console.log(`Client connected from ${remoteAddress}:${remotePort}`);

    const reader = readable.getReader();
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        console.log(
          `Received from ${remoteAddress}: ${new TextDecoder().decode(value)}`
        );

        const writer = writable.getWriter();
        await writer.write(
          new TextEncoder().encode("Echo: " + new TextDecoder().decode(value))
        );
        writer.releaseLock();
      }
    } finally {
      reader.releaseLock();
      console.log(`Client from ${remoteAddress}:${remotePort} disconnected.`);
    }
  }

  async close(): Promise<void> {
    await this.serverSocket.close();
    console.log("Server closed.");
  }
}
