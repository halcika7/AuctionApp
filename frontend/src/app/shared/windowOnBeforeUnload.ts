import { WebSocketServiceService } from "./services/web-socket-service.service";

export class WindowOnBeforeUnload {
  constructor(private socketService: WebSocketServiceService) {}

  beforeUnload(productId = null, userId = null) {
    window.onbeforeunload = () => {
      if (productId) {
        this.socketService.emit("removeWatcher", { productId, userId });
        this.socketService.disconnect();
      }

      if (
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken")
      ) {
        const token = localStorage.getItem("accessToken")
          ? "Bearer " + localStorage.getItem("accessToken")
          : "Bearer " + sessionStorage.getItem("accessToken");
        this.socketService.emit("removeloggeduser", token);
      }

      this.socketService.disconnect();
    };
  }
}
