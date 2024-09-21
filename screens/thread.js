import { self } from "react-native-parallel";


self.onmessage = (message) => {
    console.log('Message from main:',message);
}

self.postMessage('hello');