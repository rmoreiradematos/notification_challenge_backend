import { EventEmitter } from "events";
import { IAppEventEmitter } from "../../application/interfaces/IAppEventEmitter";

class AppEventEmitter extends EventEmitter implements IAppEventEmitter {
  constructor() {
    super();
  }
}

const appEventEmitter = new AppEventEmitter();
export default appEventEmitter;
