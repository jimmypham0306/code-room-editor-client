Why Use Yjs and Its Extensions for a Live Code Editor?
Using Yjs and its related libraries (y-monaco and y-websocket) provides several benefits over a custom WebSocket-based approach:

Conflict Resolution: Yjs handles changes in real-time and merges them automatically without conflicts, making it ideal for collaborative environments.
Offline Support: Yjs allows users to make changes even when they’re offline. When they reconnect, their changes are automatically merged with the current state.
Reduced Complexity: With Yjs managing the document state, you avoid the complexity of manually implementing document synchronization and conflict resolution logic.
Scalability: Yjs reduces the data sent over the network by using efficient algorithms, making it easier to scale and reducing server load.